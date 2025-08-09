/**
 * Permission Utilities for Hierarchical Group Management
 * 
 * This module provides utilities for managing permissions based on user roles
 * and group hierarchy. It implements the logic where:
 * - SuperAdmins can manage users in any group
 * - GroupAdmins can manage users only in their group hierarchy
 * - Regular users cannot manage other users
 */

import { GroupWithChildren } from './group-access';

export interface UserPermission {
  userId: string;
  isSuperAdmin: boolean;
  isGroupAdmin: boolean;
  primaryGroupId?: string;
  accessibleGroupIds: string[];
}

export interface GroupPermission {
  groupId: string;
  groupName: string;
  isRootGroup: boolean;
  canManage: boolean;
  userCount: number;
  customerCount: number;
}

/**
 * Check if a user can manage users in a specific group
 */
export function canManageGroupUsers(
  userPermission: UserPermission,
  targetGroupId: string,
  groupHierarchy: GroupWithChildren[]
): boolean {
  // SuperAdmin can manage any group
  if (userPermission.isSuperAdmin) {
    return true;
  }

  // GroupAdmin can only manage users in their accessible groups
  if (userPermission.isGroupAdmin) {
    return userPermission.accessibleGroupIds.includes(targetGroupId);
  }

  // Regular users cannot manage other users
  return false;
}

/**
 * Get groups that a user can manage users in
 */
export function getManageableGroups(
  userPermission: UserPermission,
  allGroups: GroupWithChildren[]
): GroupPermission[] {
  return allGroups
    .filter(group => {
      // SuperAdmin can see all groups
      if (userPermission.isSuperAdmin) {
        return true;
      }

      // GroupAdmin can only see their accessible groups
      if (userPermission.isGroupAdmin) {
        return userPermission.accessibleGroupIds.includes(group.id);
      }

      // Regular users cannot see any groups for management
      return false;
    })
    .map(group => ({
      groupId: group.id,
      groupName: group.name,
      isRootGroup: !group.parentId,
      canManage: canManageGroupUsers(userPermission, group.id, allGroups),
      userCount: 0, // Will be populated from database
      customerCount: 0 // Will be populated from database
    }));
}

/**
 * Check if a user can create users in a specific group
 */
export function canCreateUserInGroup(
  userPermission: UserPermission,
  targetGroupId: string,
  groupHierarchy: GroupWithChildren[]
): boolean {
  return canManageGroupUsers(userPermission, targetGroupId, groupHierarchy);
}

/**
 * Check if a user can edit another user
 */
export function canEditUser(
  editorPermission: UserPermission,
  targetUser: {
    id: string;
    isSuperAdmin: boolean;
    isGroupAdmin: boolean;
    primaryGroupId?: string;
  },
  groupHierarchy: GroupWithChildren[]
): boolean {
  // Cannot edit yourself
  if (editorPermission.userId === targetUser.id) {
    return false;
  }

  // SuperAdmin can edit anyone
  if (editorPermission.isSuperAdmin) {
    return true;
  }

  // GroupAdmin cannot edit SuperAdmins
  if (targetUser.isSuperAdmin) {
    return false;
  }

  // GroupAdmin can edit users in their accessible groups
  if (editorPermission.isGroupAdmin && targetUser.primaryGroupId) {
    return editorPermission.accessibleGroupIds.includes(targetUser.primaryGroupId);
  }

  return false;
}

/**
 * Check if a user can change another user's group
 */
export function canChangeUserGroup(
  editorPermission: UserPermission,
  targetUser: {
    id: string;
    isSuperAdmin: boolean;
    primaryGroupId?: string;
  },
  newGroupId: string,
  groupHierarchy: GroupWithChildren[]
): boolean {
  // Must be able to edit the user first
  if (!canEditUser(editorPermission, targetUser, groupHierarchy)) {
    return false;
  }

  // SuperAdmin can change to any group
  if (editorPermission.isSuperAdmin) {
    return true;
  }

  // GroupAdmin can only change to groups they can manage
  if (editorPermission.isGroupAdmin) {
    return editorPermission.accessibleGroupIds.includes(newGroupId);
  }

  return false;
}

/**
 * Get user permission context from user data
 */
export function createUserPermissionContext(
  user: {
    id: string;
    isSuperAdmin: boolean;
    isGroupAdmin: boolean;
  },
  userGroupId?: string,
  groupHierarchy?: GroupWithChildren[]
): UserPermission {
  const accessibleGroupIds = groupHierarchy && userGroupId
    ? getAccessibleGroupIdsForUser(userGroupId, groupHierarchy)
    : [];

  return {
    userId: user.id,
    isSuperAdmin: user.isSuperAdmin,
    isGroupAdmin: user.isGroupAdmin,
    primaryGroupId: userGroupId,
    accessibleGroupIds
  };
}

/**
 * Get accessible group IDs for a user (helper function)
 */
function getAccessibleGroupIdsForUser(
  userGroupId: string,
  groupHierarchy: GroupWithChildren[]
): string[] {
  const descendantIds: string[] = [];
  
  function findGroupAndCollectDescendants(groups: GroupWithChildren[]): boolean {
    for (const group of groups) {
      if (group.id === userGroupId) {
        // Found the group, collect all descendants
        collectDescendants(group);
        return true;
      }
      
      if (group.children.length > 0) {
        if (findGroupAndCollectDescendants(group.children)) {
          return true;
        }
      }
    }
    return false;
  }
  
  function collectDescendants(group: GroupWithChildren) {
    group.children.forEach(child => {
      descendantIds.push(child.id);
      collectDescendants(child);
    });
  }
  
  findGroupAndCollectDescendants(groupHierarchy);
  return [userGroupId, ...descendantIds];
}

/**
 * Permission validation errors
 */
export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionError';
  }
}

/**
 * Validate user creation permissions
 */
export function validateUserCreation(
  creatorPermission: UserPermission,
  targetGroupId: string,
  groupHierarchy: GroupWithChildren[]
): void {
  if (!canCreateUserInGroup(creatorPermission, targetGroupId, groupHierarchy)) {
    throw new PermissionError(
      'Você não tem permissão para criar usuários neste grupo. ' +
      'Você só pode criar usuários nos grupos que você gerencia.'
    );
  }
}

/**
 * Validate user group assignment
 */
export function validateUserGroupAssignment(
  assignerPermission: UserPermission,
  targetUser: {
    id: string;
    isSuperAdmin: boolean;
    primaryGroupId?: string;
  },
  newGroupId: string,
  groupHierarchy: GroupWithChildren[]
): void {
  if (!canChangeUserGroup(assignerPermission, targetUser, newGroupId, groupHierarchy)) {
    throw new PermissionError(
      'Você não tem permissão para atribuir este usuário ao grupo selecionado. ' +
      'Você só pode atribuir usuários aos grupos que você gerencia.'
    );
  }
}