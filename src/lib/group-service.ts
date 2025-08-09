/**
 * Group Service - Integration layer for group-based access control
 * 
 * This service provides high-level methods for managing groups and enforcing
 * group-based data access rules throughout the application.
 */

import { db } from '@/lib/db';
import { 
  Group, 
  UserGroup, 
  User, 
  Customer,
  GroupWithChildren,
  buildGroupHierarchy,
  getAccessibleGroupIds,
  filterCustomersByGroupAccess,
  createGroupAccessWhereClause,
  getGroupPath,
  getUsersInGroupHierarchy as getUsersInGroupHierarchyUtil,
  calculateGroupStats,
  getDescendantGroupIds
} from './group-access';

export interface GroupWithStats extends GroupWithChildren {
  userCount: number;
  customerCount: number;
}

export interface GroupAccessContext {
  userId: string;
  userGroupId: string;
  accessibleGroupIds: string[];
  groupHierarchy: GroupWithChildren[];
}

/**
 * Get all groups with their hierarchy structure
 */
export async function getAllGroups(): Promise<GroupWithStats[]> {
  try {
    const groups = await db.group.findMany({
      where: {
        isActive: true
      },
      include: {
        _count: {
          select: {
            users: {
              where: {
                isActive: true
              }
            },
            customers: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const basicGroups = groups.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      parentId: group.parentId,
      isActive: group.isActive,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
      children: []
    }));

    const hierarchy = buildGroupHierarchy(basicGroups);
    
    // Add stats to each group
    function addStats(groups: GroupWithChildren[]): GroupWithStats[] {
      return groups.map(group => {
        const dbGroup = groups.find(g => g.id === group.id);
        const userCount = dbGroup?._count?.users || 0;
        const customerCount = dbGroup?._count?.customers || 0;
        
        return {
          ...group,
          userCount,
          customerCount,
          children: addStats(group.children)
        };
      });
    }
    
    return addStats(hierarchy);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return [];
  }
}

/**
 * Get a user's group access context
 * This should be called when a user logs in and cached for the session
 */
export async function getUserGroupContext(userId: string): Promise<GroupAccessContext | null> {
  try {
    // Get user's primary group (for simplicity, we'll use the first active group)
    const userGroup = await db.userGroup.findFirst({
      where: {
        userId,
        isActive: true
      },
      include: {
        group: true
      }
    });

    if (!userGroup) {
      return null;
    }

    // Get all groups for hierarchy building
    const allGroups = await db.group.findMany({
      where: {
        isActive: true
      }
    });

    const basicGroups = allGroups.map(group => ({
      id: group.id,
      name: group.name,
      description: group.description,
      parentId: group.parentId,
      isActive: group.isActive,
      createdAt: group.createdAt,
      updatedAt: group.updatedAt,
      children: []
    }));

    const groupHierarchy = buildGroupHierarchy(basicGroups);
    const accessibleGroupIds = getAccessibleGroupIds(userGroup.groupId, groupHierarchy);

    return {
      userId,
      userGroupId: userGroup.groupId,
      accessibleGroupIds,
      groupHierarchy
    };
  } catch (error) {
    console.error('Error getting user group context:', error);
    return null;
  }
}

/**
 * Get customers accessible to a user based on their group
 */
export async function getAccessibleCustomers(
  userContext: GroupAccessContext,
  options?: {
    search?: string;
    status?: string;
    limit?: number;
    offset?: number;
  }
) {
  try {
    const whereClause = {
      AND: [
        createGroupAccessWhereClause(userContext.userGroupId, userContext.groupHierarchy),
        options?.search ? {
          OR: [
            { name: { contains: options.search, mode: 'insensitive' } },
            { email: { contains: options.search, mode: 'insensitive' } },
            { company: { contains: options.search, mode: 'insensitive' } }
          ]
        } : {},
        options?.status ? { status: options.status } : {}
      ]
    };

    const [customers, totalCount] = await Promise.all([
      db.customer.findMany({
        where: whereClause,
        include: {
          group: true,
          tasks: {
            take: 5,
            orderBy: { createdAt: 'desc' }
          },
          notes: {
            take: 3,
            orderBy: { createdAt: 'desc' },
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 50,
        skip: options?.offset || 0
      }),
      db.customer.count({
        where: whereClause
      })
    ]);

    return {
      customers,
      totalCount,
      hasMore: (options?.offset || 0) + (options?.limit || 50) < totalCount
    };
  } catch (error) {
    console.error('Error fetching accessible customers:', error);
    return {
      customers: [],
      totalCount: 0,
      hasMore: false
    };
  }
}

/**
 * Create a new group
 */
export async function createGroup(data: {
  name: string;
  description?: string;
  parentId?: string;
}): Promise<Group | null> {
  try {
    // Check if parent group exists if parentId is provided
    if (data.parentId) {
      const parentExists = await db.group.findUnique({
        where: { id: data.parentId }
      });
      
      if (!parentExists) {
        throw new Error('Parent group not found');
      }
    }

    const group = await db.group.create({
      data: {
        name: data.name,
        description: data.description,
        parentId: data.parentId
      }
    });

    return group;
  } catch (error) {
    console.error('Error creating group:', error);
    return null;
  }
}

/**
 * Update a group
 */
export async function updateGroup(
  groupId: string,
  data: {
    name?: string;
    description?: string;
    parentId?: string;
    isActive?: boolean;
  }
): Promise<Group | null> {
  try {
    // Check for circular reference if changing parent
    if (data.parentId) {
      const groupHierarchy = await getAllGroups();
      const descendantIds = getDescendantGroupIds(groupId, groupHierarchy);
      
      if (descendantIds.includes(data.parentId)) {
        throw new Error('Cannot set parent to a descendant group (circular reference)');
      }
    }

    const group = await db.group.update({
      where: { id: groupId },
      data
    });

    return group;
  } catch (error) {
    console.error('Error updating group:', error);
    return null;
  }
}

/**
 * Delete a group (soft delete by setting isActive to false)
 */
export async function deleteGroup(groupId: string): Promise<boolean> {
  try {
    // Check if group has children
    const hasChildren = await db.group.count({
      where: { parentId: groupId }
    });

    if (hasChildren > 0) {
      throw new Error('Cannot delete group with child groups. Please delete or move child groups first.');
    }

    await db.group.update({
      where: { id: groupId },
      data: { isActive: false }
    });

    return true;
  } catch (error) {
    console.error('Error deleting group:', error);
    return false;
  }
}

/**
 * Add user to a group
 */
export async function addUserToGroup(userId: string, groupId: string): Promise<boolean> {
  try {
    // Check if user is already in the group
    const existingMembership = await db.userGroup.findUnique({
      where: {
        userId_groupId: {
          userId,
          groupId
        }
      }
    });

    if (existingMembership) {
      // Reactivate if exists but is inactive
      await db.userGroup.update({
        where: { id: existingMembership.id },
        data: { isActive: true }
      });
    } else {
      // Create new membership
      await db.userGroup.create({
        data: {
          userId,
          groupId
        }
      });
    }

    return true;
  } catch (error) {
    console.error('Error adding user to group:', error);
    return false;
  }
}

/**
 * Remove user from a group (soft remove by setting isActive to false)
 */
export async function removeUserFromGroup(userId: string, groupId: string): Promise<boolean> {
  try {
    await db.userGroup.updateMany({
      where: {
        userId,
        groupId
      },
      data: { isActive: false }
    });

    return true;
  } catch (error) {
    console.error('Error removing user from group:', error);
    return false;
  }
}

/**
 * Get users in a group and its descendant groups
 */
export async function getUsersInGroup(groupId: string): Promise<User[]> {
  try {
    const groupHierarchy = await getAllGroups();
    const userGroups = await db.userGroup.findMany({
      where: {
        isActive: true
      }
    });

    const userIds = getUsersInGroupHierarchyUtil(groupId, userGroups, groupHierarchy);

    const users = await db.user.findMany({
      where: {
        id: {
          in: userIds
        },
        isActive: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        createdAt: true
      }
    });

    return users;
  } catch (error) {
    console.error('Error getting users in group:', error);
    return [];
  }
}

/**
 * Get group statistics
 */
export async function getGroupStatistics() {
  try {
    const groupHierarchy = await getAllGroups();
    const stats = calculateGroupStats(groupHierarchy);
    
    // Get actual user and customer counts
    const [totalUsers, totalCustomers] = await Promise.all([
      db.user.count({
        where: { isActive: true }
      }),
      db.customer.count()
    ]);

    return {
      ...stats,
      totalUsers,
      totalCustomers
    };
  } catch (error) {
    console.error('Error getting group statistics:', error);
    return null;
  }
}