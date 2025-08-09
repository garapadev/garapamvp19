import { Task } from '@/domain/entities/Task'

export interface TaskRepository {
  findById(id: string): Promise<Task | null>
  create(task: Task): Promise<Task>
  update(task: Task): Promise<Task>
  delete(id: string): Promise<void>
  findAll(): Promise<Task[]>
  findByAssigneeId(assigneeId: string): Promise<Task[]>
  findByCreatorId(creatorId: string): Promise<Task[]>
  findByCustomerId(customerId: string): Promise<Task[]>
  findByStatus(status: string): Promise<Task[]>
  findByPriority(priority: string): Promise<Task[]>
  findOverdue(): Promise<Task[]>
  findDueSoon(days: number): Promise<Task[]>
}