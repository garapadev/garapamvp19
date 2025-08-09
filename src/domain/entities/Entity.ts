export abstract class Entity {
  private readonly _id: string
  private readonly _createdAt: Date
  private _updatedAt: Date

  constructor(id?: string) {
    this._id = id || this.generateId()
    this._createdAt = new Date()
    this._updatedAt = new Date()
  }

  get id(): string {
    return this._id
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  protected updateTimestamp(): void {
    this._updatedAt = new Date()
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }

  public equals(entity: Entity): boolean {
    if (entity === this) return true
    if (entity === null || entity === undefined) return false
    if (!(entity instanceof Entity)) return false
    return this._id === entity._id
  }
}

export class UniqueEntityID {
  private readonly _value: string

  constructor(value?: string) {
    this._value = value || this.generateId()
  }

  get value(): string {
    return this._value
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15)
  }

  public equals(id?: UniqueEntityID): boolean {
    if (id === null || id === undefined) return false
    if (!(id instanceof UniqueEntityID)) return false
    return this._value === id._value
  }
}