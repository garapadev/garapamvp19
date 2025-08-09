/**
 * User Service with Permission-Based Access Control
 * 
 * This service provides user management functionality with hierarchical
 * group-based permissions. It integrates with the permission system
 * to ensure users can only manage users within their accessible groups.
 */

import { db } from '@/lib/db';
import { 
  UserPermission, 
  GroupPermission, 
  canManageGroupUsers,
  canCreateUserInGroup,
  canEditUser,
  canChangeUserGroup,
  validateUserCreation,
  validateUserGroupAssignment,
  PermissionError
} from './permissions';
import { GroupWithChildren } from './group-access';
import { getAllGroups } from './group-service';

export interface UserData {
  id?: string;
  email: string;
  username?: string;
  password: string;
  name?: string;
  phone?: string;
  department?: string;
  position?: string;
  isSuperAdmin?: boolean;
  isGroupAdmin?: boolean;
  isActive?: boolean;
  groupId?: string;
}

export interface UserWithGroup extends UserData {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  group?: {
    id: string;
    name: string;
    description?: string;
    parentId?: string;
  };
}

/**
 * Create a new user with permission validation
 */
export async function createUser(
  userData: UserData,
  creatorPermission: UserPermission,
  groupHierarchy: GroupWithChildren[]
): Promise<UserWithGroup | null> {
  try {
    // Validate permissions
    validateUserCreation(creatorPermission, userData.groupId!, groupHierarchy);

    // Check if email already exists
    const existingUserByEmail = await db.user.findUnique({
      where: { email: userData.email }
    });

    if (existingUserByEmail) {
      throw new Error('Email já está em uso');
    }

    // Check if username already exists (if provided)
    if (userData.username) {
      const existingUserByUsername = await db.user.findUnique({
        where: { username: userData.username }
      });

      if (existingUserByUsername) {
        throw new Error('Nome de usuário já está em uso');
      }
    }

    // Hash password (in a real app, use bcrypt or similar)
    const hashedPassword = userData.password; // TODO: Implement proper hashing

    // Create the user
    const user = await db.user.create({
      data: {
        email: userData.email,
        username: userData.username,
        password: hashedPassword,
        name: userData.name,
        phone: userData.phone,
        department: userData.department,
        position: userData.position,
        isSuperAdmin: userData.isSuperAdmin || false,
        isGroupAdmin: userData.isGroupAdmin || false,
        isActive: userData.isActive !== undefined ? userData.isActive : true
      }
    });

    // Assign to group if specified
    if (userData.groupId) {
      await db.userGroup.create({
        data: {
          userId: user.id,
          groupId: userData.groupId
        }
      });
    }

    // Return the created user with group information
    const userWithGroup = await getUserById(user.id);
    return userWithGroup;
  } catch (error) {
    if (error instanceof PermissionError) {
      throw error;
    }
    console.error('Error creating user:', error);
    throw error;
  }
}

/**
 * Update user with permission validation
 */
export async function updateUser(
  userId: string,
  userData: Partial<UserData>,
  editorPermission: UserPermission,
  groupHierarchy: GroupWithChildren[]
): Promise<UserWithGroup | null> {
  try {
    // Get the target user
    const targetUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        userGroups: {
          where: { isActive: true },
          include: { group: true }
        }
      }
    });

    if (!targetUser) {
      throw new Error('Usuário não encontrado');
    }

    // Get primary group ID
    const primaryGroupId = targetUser.userGroups[0]?.groupId;

    // Check if editor can edit this user
    const canEdit = canEditUser(editorPermission, {
      id: targetUser.id,
      isSuperAdmin: targetUser.isSuperAdmin,
      isGroupAdmin: targetUser.isGroupAdmin,
      primaryGroupId
    }, groupHierarchy);

    if (!canEdit) {
      throw new PermissionError('Você não tem permissão para editar este usuário');
    }

    // Validate group assignment if changing group
    if (userData.groupId && userData.groupId !== primaryGroupId) {
      validateUserGroupAssignment(editorPermission, {
        id: targetUser.id,
        isSuperAdmin: targetUser.isSuperAdmin,
        primaryGroupId
      }, userData.groupId, groupHierarchy);
    }

    // Update user data
    const updateData: any = {};
    if (userData.name !== undefined) updateData.name = userData.name;
    if (userData.email !== undefined) updateData.email = userData.email;
    if (userData.username !== undefined) updateData.username = userData.username;
    if (userData.phone !== undefined) updateData.phone = userData.phone;
    if (userData.department !== undefined) updateData.department = userData.department;
    if (userData.position !== undefined) updateData.position = userData.position;
    if (userData.isSuperAdmin !== undefined) updateData.isSuperAdmin = userData.isSuperAdmin;
    if (userData.isGroupAdmin !== undefined) updateData.isGroupAdmin = userData.isGroupAdmin;
    if (userData.isActive !== undefined) updateData.isActive = userData.isActive;

    // Update password if provided
    if (userData.password) {
      updateData.password = userData.password; // TODO: Implement proper hashing
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: updateData
    });

    // Update group assignment if changed
    if (userData.groupId && userData.groupId !== primaryGroupId) {
      // Deactivate old group membership
      if (primaryGroupId) {
        await db.userGroup.updateMany({
          where: {
            userId,
            groupId: primaryGroupId
          },
          data: { isActive: false }
        });
      }

      // Create new group membership
      await db.userGroup.create({
        data: {
          userId,
          groupId: userData.groupId
        }
      });
    }

    // Return the updated user
    return await getUserById(userId);
  } catch (error) {
    if (error instanceof PermissionError) {
      throw error;
    }
    console.error('Error updating user:', error);
    throw error;
  }
}

/**
 * Get user by ID with group information
 */
export async function getUserById(userId: string): Promise<UserWithGroup | null> {
  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: {
        userGroups: {
          where: { isActive: true },
          include: { group: true }
        }
      }
    });

    if (!user) {
      return null;
    }

    const primaryGroup = user.userGroups[0];

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      password: '', // Never return password
      name: user.name,
      phone: user.phone,
      department: user.department,
      position: user.position,
      isSuperAdmin: user.isSuperAdmin,
      isGroupAdmin: user.isGroupAdmin,
      isActive: user.isActive,
      groupId: primaryGroup?.groupId,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      group: primaryGroup?.group ? {
        id: primaryGroup.group.id,
        name: primaryGroup.group.name,
        description: primaryGroup.group.description,
        parentId: primaryGroup.group.parentId
      } : undefined
    };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    return null;
  }
}

/**
 * Get users accessible to the current user based on permissions
 */
export async function getAccessibleUsers(
  userPermission: UserPermission,
  options?: {
    search?: string;
    status?: 'ACTIVE' | 'INACTIVE';
    groupId?: string;
    limit?: number;
    offset?: number;
  }
): Promise<{ users: UserWithGroup[]; totalCount: number }> {
  try {
    const whereClause: any = {};

    // SuperAdmin can see all users
    if (!userPermission.isSuperAdmin) {
      // GroupAdmin can only see users in their accessible groups
      if (userPermission.isGroupAdmin && userPermission.accessibleGroupIds.length > 0) {
        whereClause.userGroups = {
          some: {
            groupId: { in: userPermission.accessibleGroupIds },
            isActive: true
          }
        };
      } else {
        // Regular users can only see themselves
        whereClause.id = userPermission.userId;
      }
    }

    // Apply filters
    if (options?.status) {
      whereClause.isActive = options.status === 'ACTIVE';
    }

    if (options?.groupId) {
      // Check if user can access this group
      if (canManageGroupUsers(userPermission, options.groupId, [])) {
        whereClause.userGroups = {
          some: {
            groupId: options.groupId,
            isActive: true
          }
        };
      } else {
        return { users: [], totalCount: 0 };
      }
    }

    if (options?.search) {
      whereClause.OR = [
        { name: { contains: options.search, mode: 'insensitive' } },
        { email: { contains: options.search, mode: 'insensitive' } },
        { username: { contains: options.search, mode: 'insensitive' } }
      ];
    }

    const [users, totalCount] = await Promise.all([
      db.user.findMany({
        where: whereClause,
        include: {
          userGroups: {
            where: { isActive: true },
            include: { group: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 50,
        skip: options?.offset || 0
      }),
      db.user.count({ where: whereClause })
    ]);

    const usersWithGroups = users.map(user => {
      const primaryGroup = user.userGroups[0];
      return {
        id: user.id,
        email: user.email,
        username: user.username,
        password: '',
        name: user.name,
        phone: user.phone,
        department: user.department,
        position: user.position,
        isSuperAdmin: user.isSuperAdmin,
        isGroupAdmin: user.isGroupAdmin,
        isActive: user.isActive,
        groupId: primaryGroup?.groupId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        group: primaryGroup?.group ? {
          id: primaryGroup.group.id,
          name: primaryGroup.group.name,
          description: primaryGroup.group.description,
          parentId: primaryGroup.group.parentId
        } : undefined
      };
    });

    return { users: usersWithGroups, totalCount };
  } catch (error) {
    console.error('Error getting accessible users:', error);
    return { users: [], totalCount: 0 };
  }
}

/**
 * Get groups that a user can manage
 */
export async function getManageableGroupsForUser(
  userPermission: UserPermission
): Promise<GroupPermission[]> {
  try {
    const allGroups = await getAllGroups();
    
    return allGroups
      .filter(group => {
        // SuperAdmin can manage all groups
        if (userPermission.isSuperAdmin) {
          return true;
        }

        // GroupAdmin can only manage their accessible groups
        if (userPermission.isGroupAdmin) {
          return userPermission.accessibleGroupIds.includes(group.id);
        }

        return false;
      })
      .map(group => ({
        groupId: group.id,
        groupName: group.name,
        isRootGroup: !group.parentId,
        canManage: true,
        userCount: group.userCount || 0,
        customerCount: group.customerCount || 0
      }));
  } catch (error) {
    console.error('Error getting manageable groups:', error);
    return [];
  }
}

/**
 * Deactivate a user (soft delete)
 */
export async function deactivateUser(
  userId: string,
  editorPermission: UserPermission,
  groupHierarchy: GroupWithChildren[]
): Promise<boolean> {
  try {
    const targetUser = await db.user.findUnique({
      where: { id: userId },
      include: {
        userGroups: {
          where: { isActive: true }
        }
      }
    });

    if (!targetUser) {
      throw new Error('Usuário não encontrado');
    }

    const primaryGroupId = targetUser.userGroups[0]?.groupId;

    // Check if editor can deactivate this user
    const canEdit = canEditUser(editorPermission, {
      id: targetUser.id,
      isSuperAdmin: targetUser.isSuperAdmin,
      isGroupAdmin: targetUser.isGroupAdmin,
      primaryGroupId
    }, groupHierarchy);

    if (!canEdit) {
      throw new PermissionError('Você não tem permissão para desativar este usuário');
    }

    await db.user.update({
      where: { id: userId },
      data: { isActive: false }
    });

    return true;
  } catch (error) {
    if (error instanceof PermissionError) {
      throw error;
    }
    console.error('Error deactivating user:', error);
    return false;
  }
}