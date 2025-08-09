/**
 * Group-based Access Control Utilities
 * 
 * This module provides utilities for managing hierarchical group-based data access.
 * It implements the logic where:
 * - Users can only see data from their own group
 * - Parent groups can see data from all their child groups
 * - Data segregation is enforced at the database query level
 */

export interface Group {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupWithChildren extends Group {
  children: GroupWithChildren[];
  parent?: GroupWithChildren;
}

export interface UserGroup {
  id: string;
  userId: string;
  groupId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Build a hierarchy tree from a flat list of groups
 */
export function buildGroupHierarchy(groups: Group[]): GroupWithChildren[] {
  const groupMap = new Map<string, GroupWithChildren>();
  
  // Create a map of all groups
  groups.forEach(group => {
    groupMap.set(group.id, { ...group, children: [] });
  });
  
  // Build the hierarchy
  const rootGroups: GroupWithChildren[] = [];
  
  groups.forEach(group => {
    const groupWithChildren = groupMap.get(group.id)!;
    
    if (group.parentId) {
      const parent = groupMap.get(group.parentId);
      if (parent) {
        parent.children.push(groupWithChildren);
        groupWithChildren.parent = parent;
      } else {
        // Parent not found, treat as root group
        rootGroups.push(groupWithChildren);
      }
    } else {
      // No parent, it's a root group
      rootGroups.push(groupWithChildren);
    }
  });
  
  return rootGroups;
}

/**
 * Get all descendant group IDs for a given group ID
 * This is used to determine what data a parent group can access
 */
export function getDescendantGroupIds(groupId: string, groupHierarchy: GroupWithChildren[]): string[] {
  const descendantIds: string[] = [];
  
  function findGroupAndCollectDescendants(groups: GroupWithChildren[]): boolean {
    for (const group of groups) {
      if (group.id === groupId) {
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
  return descendantIds;
}

/**
 * Get all accessible group IDs for a user
 * Includes the user's direct group and all descendant groups
 */
export function getAccessibleGroupIds(
  userGroupId: string, 
  groupHierarchy: GroupWithChildren[]
): string[] {
  const descendantIds = getDescendantGroupIds(userGroupId, groupHierarchy);
  return [userGroupId, ...descendantIds];
}

/**
 * Check if a user has access to data from a specific group
 */
export function hasAccessToGroup(
  userGroupId: string,
  targetGroupId: string,
  groupHierarchy: GroupWithChildren[]
): boolean {
  const accessibleIds = getAccessibleGroupIds(userGroupId, groupHierarchy);
  return accessibleIds.includes(targetGroupId);
}

/**
 * Filter customers based on user's group access
 */
export function filterCustomersByGroupAccess<T extends { groupId?: string | null }>(
  customers: T[],
  userGroupId: string,
  groupHierarchy: GroupWithChildren[]
): T[] {
  const accessibleGroupIds = getAccessibleGroupIds(userGroupId, groupHierarchy);
  
  return customers.filter(customer => {
    // Customers without a group are visible to everyone
    if (!customer.groupId) {
      return true;
    }
    
    return accessibleGroupIds.includes(customer.groupId);
  });
}

/**
 * Create a where clause for Prisma queries based on group access
 */
export function createGroupAccessWhereClause(
  userGroupId: string,
  groupHierarchy: GroupWithChildren[]
): {
  OR: Array<{
    groupId?: {
      in: string[];
    } | null;
  }>;
} {
  const accessibleGroupIds = getAccessibleGroupIds(userGroupId, groupHierarchy);
  
  return {
    OR: [
      {
        groupId: {
          in: accessibleGroupIds
        }
      },
      {
        groupId: null
      }
    ]
  };
}

/**
 * Get group path (hierarchy) for a given group ID
 * Returns the path from root to the specified group
 */
export function getGroupPath(groupId: string, groupHierarchy: GroupWithChildren[]): Group[] {
  const path: Group[] = [];
  
  function findPath(groups: GroupWithChildren[], targetPath: Group[]): boolean {
    for (const group of groups) {
      const currentPath = [...targetPath, group];
      
      if (group.id === groupId) {
        path.push(...currentPath);
        return true;
      }
      
      if (group.children.length > 0) {
        if (findPath(group.children, currentPath)) {
          return true;
        }
      }
    }
    return false;
  }
  
  findPath(groupHierarchy, []);
  return path;
}

/**
 * Check if a group is a descendant of another group
 */
export function isDescendantGroup(
  parentId: string,
  childId: string,
  groupHierarchy: GroupWithChildren[]
): boolean {
  const descendantIds = getDescendantGroupIds(parentId, groupHierarchy);
  return descendantIds.includes(childId);
}

/**
 * Get all users in a group and its descendant groups
 */
export function getUsersInGroupHierarchy(
  groupId: string,
  userGroups: UserGroup[],
  groupHierarchy: GroupWithChildren[]
): string[] {
  const accessibleGroupIds = getAccessibleGroupIds(groupId, groupHierarchy);
  
  const userIds = userGroups
    .filter(ug => accessibleGroupIds.includes(ug.groupId) && ug.isActive)
    .map(ug => ug.userId);
  
  // Remove duplicates
  return [...new Set(userIds)];
}

/**
 * Group statistics calculation utilities
 */
export interface GroupStats {
  totalGroups: number;
  totalUsers: number;
  totalCustomers: number;
  rootGroups: number;
  maxDepth: number;
}

export function calculateGroupStats(groupHierarchy: GroupWithChildren[]): GroupStats {
  let totalGroups = 0;
  let totalUsers = 0;
  let totalCustomers = 0;
  let maxDepth = 0;
  
  function traverse(groups: GroupWithChildren[], depth: number) {
    groups.forEach(group => {
      totalGroups++;
      maxDepth = Math.max(maxDepth, depth);
      
      // These would normally come from the database
      // For now, we'll use placeholder values
      // totalUsers += group.userCount || 0;
      // totalCustomers += group.customerCount || 0;
      
      if (group.children.length > 0) {
        traverse(group.children, depth + 1);
      }
    });
  }
  
  traverse(groupHierarchy, 1);
  
  return {
    totalGroups,
    totalUsers,
    totalCustomers,
    rootGroups: groupHierarchy.length,
    maxDepth
  };
}