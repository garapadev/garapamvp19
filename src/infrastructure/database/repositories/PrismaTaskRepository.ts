import { PrismaClient } from '@prisma/client'
import { Task, TaskStatus, TaskPriority } from '@/domain/entities/Task'
import { TaskRepository } from '@/application/repositories/TaskRepository'

export class PrismaTaskRepository implements TaskRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Task | null> {
    const task = await this.prisma.tasks.findUnique({
      where: { id }
    })

    if (!task) return null

    return new Task(
      {
        title: task.title,
        description: task.description || undefined,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        dueDate: task.dueDate || undefined,
        completedAt: task.completedAt || undefined,
        assigneeId: task.assigneeId || undefined,
        creatorId: task.creatorId,
        customerId: task.customerId || undefined
      },
      task.id
    )
  }

  async create(task: Task): Promise<Task> {
    const createdTask = await this.prisma.tasks.create({
      data: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        completedAt: task.completedAt,
        assigneeId: task.assigneeId,
        creatorId: task.creatorId,
        customerId: task.customerId
      }
    })

    return task
  }

  async update(task: Task): Promise<Task> {
    await this.prisma.tasks.update({
      where: { id: task.id },
      data: {
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate,
        completedAt: task.completedAt,
        assigneeId: task.assigneeId,
        creatorId: task.creatorId,
        customerId: task.customerId
      }
    })

    return task
  }

  async delete(id: string): Promise<void> {
    await this.prisma.tasks.delete({
      where: { id }
    })
  }

  async findAll(): Promise<Task[]> {
    const tasks = await this.prisma.tasks.findMany()

    return tasks.map(task => new Task(
      {
        title: task.title,
        description: task.description || undefined,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        dueDate: task.dueDate || undefined,
        completedAt: task.completedAt || undefined,
        assigneeId: task.assigneeId || undefined,
        creatorId: task.creatorId,
        customerId: task.customerId || undefined
      },
      task.id
    ))
  }

  async findByAssigneeId(assigneeId: string): Promise<Task[]> {
    const tasks = await this.prisma.tasks.findMany({
      where: { assigneeId }
    })

    return tasks.map(task => new Task(
      {
        title: task.title,
        description: task.description || undefined,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        dueDate: task.dueDate || undefined,
        completedAt: task.completedAt || undefined,
        assigneeId: task.assigneeId || undefined,
        creatorId: task.creatorId,
        customerId: task.customerId || undefined
      },
      task.id
    ))
  }

  async findByCreatorId(creatorId: string): Promise<Task[]> {
    const tasks = await this.prisma.tasks.findMany({
      where: { creatorId }
    })

    return tasks.map(task => new Task(
      {
        title: task.title,
        description: task.description || undefined,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        dueDate: task.dueDate || undefined,
        completedAt: task.completedAt || undefined,
        assigneeId: task.assigneeId || undefined,
        creatorId: task.creatorId,
        customerId: task.customerId || undefined
      },
      task.id
    ))
  }

  async findByCustomerId(customerId: string): Promise<Task[]> {
    const tasks = await this.prisma.tasks.findMany({
      where: { customerId }
    })

    return tasks.map(task => new Task(
      {
        title: task.title,
        description: task.description || undefined,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        dueDate: task.dueDate || undefined,
        completedAt: task.completedAt || undefined,
        assigneeId: task.assigneeId || undefined,
        creatorId: task.creatorId,
        customerId: task.customerId || undefined
      },
      task.id
    ))
  }

  async findByStatus(status: string): Promise<Task[]> {
    const tasks = await this.prisma.tasks.findMany({
      where: { status: status as TaskStatus }
    })

    return tasks.map(task => new Task(
      {
        title: task.title,
        description: task.description || undefined,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        dueDate: task.dueDate || undefined,
        completedAt: task.completedAt || undefined,
        assigneeId: task.assigneeId || undefined,
        creatorId: task.creatorId,
        customerId: task.customerId || undefined
      },
      task.id
    ))
  }

  async findByPriority(priority: string): Promise<Task[]> {
    const tasks = await this.prisma.tasks.findMany({
      where: { priority: priority as TaskPriority }
    })

    return tasks.map(task => new Task(
      {
        title: task.title,
        description: task.description || undefined,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        dueDate: task.dueDate || undefined,
        completedAt: task.completedAt || undefined,
        assigneeId: task.assigneeId || undefined,
        creatorId: task.creatorId,
        customerId: task.customerId || undefined
      },
      task.id
    ))
  }

  async findOverdue(): Promise<Task[]> {
    const now = new Date()
    const tasks = await this.prisma.tasks.findMany({
      where: {
        dueDate: {
          lt: now
        },
        status: {
          not: TaskStatus.COMPLETED
        }
      }
    })

    return tasks.map(task => new Task(
      {
        title: task.title,
        description: task.description || undefined,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        dueDate: task.dueDate || undefined,
        completedAt: task.completedAt || undefined,
        assigneeId: task.assigneeId || undefined,
        creatorId: task.creatorId,
        customerId: task.customerId || undefined
      },
      task.id
    ))
  }

  async findDueSoon(days: number): Promise<Task[]> {
    const now = new Date()
    const dueDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    
    const tasks = await this.prisma.tasks.findMany({
      where: {
        dueDate: {
          gte: now,
          lte: dueDate
        },
        status: {
          not: TaskStatus.COMPLETED
        }
      }
    })

    return tasks.map(task => new Task(
      {
        title: task.title,
        description: task.description || undefined,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        dueDate: task.dueDate || undefined,
        completedAt: task.completedAt || undefined,
        assigneeId: task.assigneeId || undefined,
        creatorId: task.creatorId,
        customerId: task.customerId || undefined
      },
      task.id
    ))
  }
}