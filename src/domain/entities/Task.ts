import { Entity } from './Entity'

export enum TaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

export class Task extends Entity {
  private _title: string
  private _description?: string
  private _status: TaskStatus
  private _priority: TaskPriority
  private _dueDate?: Date
  private _completedAt?: Date
  private _assigneeId?: string
  private _creatorId: string
  private _customerId?: string

  constructor(
    props: {
      title: string
      description?: string
      status?: TaskStatus
      priority?: TaskPriority
      dueDate?: Date
      completedAt?: Date
      assigneeId?: string
      creatorId: string
      customerId?: string
    },
    id?: string
  ) {
    super(id)
    this._title = props.title
    this._description = props.description
    this._status = props.status || TaskStatus.PENDING
    this._priority = props.priority || TaskPriority.MEDIUM
    this._dueDate = props.dueDate
    this._completedAt = props.completedAt
    this._assigneeId = props.assigneeId
    this._creatorId = props.creatorId
    this._customerId = props.customerId
  }

  get title(): string {
    return this._title
  }

  get description(): string | undefined {
    return this._description
  }

  get status(): TaskStatus {
    return this._status
  }

  get priority(): TaskPriority {
    return this._priority
  }

  get dueDate(): Date | undefined {
    return this._dueDate
  }

  get completedAt(): Date | undefined {
    return this._completedAt
  }

  get assigneeId(): string | undefined {
    return this._assigneeId
  }

  get creatorId(): string {
    return this._creatorId
  }

  get customerId(): string | undefined {
    return this._customerId
  }

  public updateTitle(title: string): void {
    this._title = title
    this.updateTimestamp()
  }

  public updateDescription(description: string): void {
    this._description = description
    this.updateTimestamp()
  }

  public updateStatus(status: TaskStatus): void {
    this._status = status
    if (status === TaskStatus.COMPLETED) {
      this._completedAt = new Date()
    } else {
      this._completedAt = undefined
    }
    this.updateTimestamp()
  }

  public updatePriority(priority: TaskPriority): void {
    this._priority = priority
    this.updateTimestamp()
  }

  public updateDueDate(dueDate: Date): void {
    this._dueDate = dueDate
    this.updateTimestamp()
  }

  public assignTo(assigneeId: string): void {
    this._assigneeId = assigneeId
    this.updateTimestamp()
  }

  public unassign(): void {
    this._assigneeId = undefined
    this.updateTimestamp()
  }

  public isOverdue(): boolean {
    if (!this._dueDate || this._status === TaskStatus.COMPLETED) {
      return false
    }
    return this._dueDate < new Date()
  }

  public isDueSoon(days: number = 1): boolean {
    if (!this._dueDate || this._status === TaskStatus.COMPLETED) {
      return false
    }
    const now = new Date()
    const dueDate = new Date(this._dueDate)
    const diffTime = dueDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= days && diffDays >= 0
  }

  public isPending(): boolean {
    return this._status === TaskStatus.PENDING
  }

  public isInProgress(): boolean {
    return this._status === TaskStatus.IN_PROGRESS
  }

  public isCompleted(): boolean {
    return this._status === TaskStatus.COMPLETED
  }

  public isCancelled(): boolean {
    return this._status === TaskStatus.CANCELLED
  }

  public canBeAssigned(): boolean {
    return this._status !== TaskStatus.COMPLETED && this._status !== TaskStatus.CANCELLED
  }

  public getPriorityColor(): string {
    switch (this._priority) {
      case TaskPriority.LOW:
        return 'text-green-600'
      case TaskPriority.MEDIUM:
        return 'text-yellow-600'
      case TaskPriority.HIGH:
        return 'text-orange-600'
      case TaskPriority.URGENT:
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  public getStatusColor(): string {
    switch (this._status) {
      case TaskStatus.PENDING:
        return 'text-gray-600'
      case TaskStatus.IN_PROGRESS:
        return 'text-blue-600'
      case TaskStatus.COMPLETED:
        return 'text-green-600'
      case TaskStatus.CANCELLED:
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }
}