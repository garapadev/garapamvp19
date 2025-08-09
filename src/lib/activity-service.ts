import { db } from '@/lib/db'
import { 
  Activity, 
  ActivityTask, 
  ActivityParticipant
} from '@prisma/client'
import { 
  ActivityStatusType, 
  ActivityPriorityType, 
  ParticipantRoleType,
  TaskStatusType,
  TaskPriorityType
} from './enums'
import { getAccessibleGroupIds } from './group-access'
import { PermissionError } from './permissions'

export type ActivityWithDetails = Activity & {
  creator: {
    id: string
    name: string
    email: string
  }
  customer?: {
    id: string
    name: string
    email?: string
  }
  group?: {
    id: string
    name: string
  }
  participants: (ActivityParticipant & {
    user: {
      id: string
      name: string
      email: string
    }
  })[]
  tasks: ActivityTask[]
  _count: {
    participants: number
    tasks: number
    completedTasks: number
  }
}

export type ActivityTaskWithAssignee = ActivityTask & {
  assignee?: {
    id: string
    name: string
    email: string
  }
}

export interface CreateActivityData {
  title: string
  description?: string
  priority?: ActivityPriorityType
  startDate?: Date
  endDate?: Date
  groupId?: string
  customerId?: string
  tasks: Omit<ActivityTask, 'id' | 'activityId' | 'createdAt' | 'updatedAt' | 'completedAt'>[]
  participantIds?: string[]
}

export interface UpdateActivityData {
  title?: string
  description?: string
  status?: ActivityStatusType
  priority?: ActivityPriorityType
  startDate?: Date
  endDate?: Date
  groupId?: string
  customerId?: string
}

class ActivityService {
  async createActivity(
    data: CreateActivityData, 
    creatorId: string
  ): Promise<ActivityWithDetails> {
    // Validate that at least 2 tasks are provided
    if (data.tasks.length < 2) {
      throw new Error('At least 2 tasks are required to create an activity')
    }

    // Check group access if groupId is provided
    if (data.groupId) {
      const accessibleGroupIds = await getAccessibleGroupIds(creatorId)
      if (!accessibleGroupIds.includes(data.groupId)) {
        throw new PermissionError('You do not have access to this group')
      }
    }

    const activity = await db.activity.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority || ActivityPriority.MEDIUM,
        startDate: data.startDate,
        endDate: data.endDate,
        groupId: data.groupId,
        customerId: data.customerId,
        creatorId,
        tasks: {
          create: data.tasks.map(task => ({
            title: task.title,
            description: task.description,
            status: task.status || TaskStatus.PENDING,
            priority: task.priority || TaskPriority.MEDIUM,
            dueDate: task.dueDate,
            assigneeId: task.assigneeId
          }))
        },
        participants: {
          create: [
            // Always add creator as admin
            {
              userId: creatorId,
              role: ParticipantRole.ADMIN
            },
            // Add other participants if provided
            ...(data.participantIds || []).map(userId => ({
              userId,
              role: ParticipantRole.MEMBER
            }))
          ]
        }
      },
      include: this.getActivityIncludes()
    })

    return activity
  }

  async getActivities(
    userId: string,
    filters?: {
      status?: ActivityStatusType
      priority?: ActivityPriorityType
      groupId?: string
      customerId?: string
      search?: string
    }
  ): Promise<ActivityWithDetails[]> {
    const accessibleGroupIds = await getAccessibleGroupIds(userId)
    
    const where: any = {
      OR: [
        // Activities where user is creator
        { creatorId: userId },
        // Activities where user is participant
        { participants: { some: { userId, isActive: true } } },
        // Activities in accessible groups
        { groupId: { in: accessibleGroupIds } }
      ]
    }

    // Apply filters
    if (filters?.status) {
      where.status = filters.status
    }
    if (filters?.priority) {
      where.priority = filters.priority
    }
    if (filters?.groupId) {
      where.groupId = filters.groupId
    }
    if (filters?.customerId) {
      where.customerId = filters.customerId
    }
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    return await db.activity.findMany({
      where,
      include: this.getActivityIncludes(),
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    })
  }

  async getActivityById(id: string, userId: string): Promise<ActivityWithDetails | null> {
    const accessibleGroupIds = await getAccessibleGroupIds(userId)
    
    const activity = await db.activity.findFirst({
      where: {
        id,
        OR: [
          // Activities where user is creator
          { creatorId: userId },
          // Activities where user is participant
          { participants: { some: { userId, isActive: true } } },
          // Activities in accessible groups
          { groupId: { in: accessibleGroupIds } }
        ]
      },
      include: this.getActivityIncludes()
    })

    return activity
  }

  async updateActivity(
    id: string, 
    data: UpdateActivityData, 
    userId: string
  ): Promise<ActivityWithDetails> {
    // Check if user has access to this activity
    const existingActivity = await this.getActivityById(id, userId)
    if (!existingActivity) {
      throw new PermissionError('Activity not found or access denied')
    }

    // Check if user can modify this activity (creator or admin participant)
    const canModify = existingActivity.creatorId === userId || 
      existingActivity.participants.some(p => p.userId === userId && p.role === ParticipantRole.ADMIN)
    
    if (!canModify) {
      throw new PermissionError('You do not have permission to modify this activity')
    }

    // Check group access if groupId is being changed
    if (data.groupId && data.groupId !== existingActivity.groupId) {
      const accessibleGroupIds = await getAccessibleGroupIds(userId)
      if (!accessibleGroupIds.includes(data.groupId)) {
        throw new PermissionError('You do not have access to this group')
      }
    }

    const updatedActivity = await db.activity.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        startDate: data.startDate,
        endDate: data.endDate,
        groupId: data.groupId,
        customerId: data.customerId
      },
      include: this.getActivityIncludes()
    })

    return updatedActivity
  }

  async deleteActivity(id: string, userId: string): Promise<void> {
    // Check if user has access to this activity
    const existingActivity = await this.getActivityById(id, userId)
    if (!existingActivity) {
      throw new PermissionError('Activity not found or access denied')
    }

    // Check if user can delete this activity (only creator)
    if (existingActivity.creatorId !== userId) {
      throw new PermissionError('Only the creator can delete this activity')
    }

    await db.activity.delete({
      where: { id }
    })
  }

  async addParticipant(
    activityId: string, 
    userId: string, 
    participantId: string, 
    role: ParticipantRoleType = ParticipantRole.MEMBER
  ): Promise<ActivityParticipant> {
    // Check if user has access to this activity
    const activity = await this.getActivityById(activityId, userId)
    if (!activity) {
      throw new PermissionError('Activity not found or access denied')
    }

    // Check if user can add participants (creator or admin/moderator)
    const canAddParticipants = activity.creatorId === userId || 
      activity.participants.some(p => p.userId === userId && 
        (p.role === ParticipantRole.ADMIN || p.role === ParticipantRole.MODERATOR))
    
    if (!canAddParticipants) {
      throw new PermissionError('You do not have permission to add participants')
    }

    // Check if participant is already in the activity
    const existingParticipant = await db.activityParticipant.findUnique({
      where: {
        activityId_userId: {
          activityId,
          userId: participantId
        }
      }
    })

    if (existingParticipant) {
      // Reactivate if inactive
      return await db.activityParticipant.update({
        where: { id: existingParticipant.id },
        data: { isActive: true, role }
      })
    }

    return await db.activityParticipant.create({
      data: {
        activityId,
        userId: participantId,
        role
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  }

  async removeParticipant(
    activityId: string, 
    userId: string, 
    participantId: string
  ): Promise<void> {
    // Check if user has access to this activity
    const activity = await this.getActivityById(activityId, userId)
    if (!activity) {
      throw new PermissionError('Activity not found or access denied')
    }

    // Check if user can remove participants
    const canRemoveParticipants = activity.creatorId === userId || 
      activity.participants.some(p => p.userId === userId && 
        (p.role === ParticipantRole.ADMIN || p.role === ParticipantRole.MODERATOR)) ||
      userId === participantId // Users can remove themselves
    
    if (!canRemoveParticipants) {
      throw new PermissionError('You do not have permission to remove participants')
    }

    await db.activityParticipant.updateMany({
      where: {
        activityId,
        userId: participantId
      },
      data: { isActive: false }
    })
  }

  async createTask(
    activityId: string, 
    taskData: Omit<ActivityTask, 'id' | 'activityId' | 'createdAt' | 'updatedAt' | 'completedAt'>, 
    userId: string
  ): Promise<ActivityTaskWithAssignee> {
    // Check if user has access to this activity
    const activity = await this.getActivityById(activityId, userId)
    if (!activity) {
      throw new PermissionError('Activity not found or access denied')
    }

    // Check if user can add tasks (creator or admin/moderator)
    const canAddTasks = activity.creatorId === userId || 
      activity.participants.some(p => p.userId === userId && 
        (p.role === ParticipantRole.ADMIN || p.role === ParticipantRole.MODERATOR))
    
    if (!canAddTasks) {
      throw new PermissionError('You do not have permission to add tasks')
    }

    return await db.activityTask.create({
      data: {
        activityId,
        title: taskData.title,
        description: taskData.description,
        status: taskData.status || TaskStatus.PENDING,
        priority: taskData.priority || TaskPriority.MEDIUM,
        dueDate: taskData.dueDate,
        assigneeId: taskData.assigneeId
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  }

  async updateTask(
    taskId: string, 
    taskData: Partial<ActivityTask>, 
    userId: string
  ): Promise<ActivityTaskWithAssignee> {
    // Get the task with activity details
    const task = await db.activityTask.findUnique({
      where: { id: taskId },
      include: {
        activity: {
          include: {
            participants: true,
            creator: {
              select: { id: true }
            }
          }
        }
      }
    })

    if (!task) {
      throw new Error('Task not found')
    }

    // Check if user has access to this activity
    const activity = await this.getActivityById(task.activityId, userId)
    if (!activity) {
      throw new PermissionError('Activity not found or access denied')
    }

    // Check if user can update this task
    const canUpdateTask = activity.creatorId === userId || 
      activity.participants.some(p => p.userId === userId && 
        (p.role === ParticipantRole.ADMIN || p.role === ParticipantRole.MODERATOR)) ||
      task.assigneeId === userId // Task assignee can update their own task
    
    if (!canUpdateTask) {
      throw new PermissionError('You do not have permission to update this task')
    }

    // Handle completion
    const updateData: any = { ...taskData }
    if (taskData.status === TaskStatus.COMPLETED && task.status !== TaskStatus.COMPLETED) {
      updateData.completedAt = new Date()
    } else if (taskData.status !== TaskStatus.COMPLETED && task.status === TaskStatus.COMPLETED) {
      updateData.completedAt = null
    }

    return await db.activityTask.update({
      where: { id: taskId },
      data: updateData,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })
  }

  async deleteTask(taskId: string, userId: string): Promise<void> {
    // Get the task with activity details
    const task = await db.activityTask.findUnique({
      where: { id: taskId },
      include: {
        activity: {
          include: {
            creator: {
              select: { id: true }
            }
          }
        }
      }
    })

    if (!task) {
      throw new Error('Task not found')
    }

    // Check if user has access to this activity
    const activity = await this.getActivityById(task.activityId, userId)
    if (!activity) {
      throw new PermissionError('Activity not found or access denied')
    }

    // Check if user can delete this task (only creator or admin)
    const canDeleteTask = activity.creatorId === userId || 
      activity.participants.some(p => p.userId === userId && p.role === ParticipantRole.ADMIN)
    
    if (!canDeleteTask) {
      throw new PermissionError('You do not have permission to delete this task')
    }

    await db.activityTask.delete({
      where: { id: taskId }
    })
  }

  private getActivityIncludes() {
    return {
      creator: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      },
      group: {
        select: {
          id: true,
          name: true
        }
      },
      participants: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      tasks: {
        orderBy: {
          createdAt: 'asc'
        }
      },
      _count: {
        select: {
          participants: true,
          tasks: true
        }
      }
    }
  }
}

export const activityService = new ActivityService()