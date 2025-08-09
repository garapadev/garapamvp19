import { Entity } from './Entity'

export class Role extends Entity {
  private _name: string
  private _description?: string
  private _isActive: boolean
  private _permissions: string[]

  constructor(
    props: {
      name: string
      description?: string
      isActive?: boolean
      permissions?: string[]
    },
    id?: string
  ) {
    super(id)
    this._name = props.name
    this._description = props.description
    this._isActive = props.isActive ?? true
    this._permissions = props.permissions || []
  }

  get name(): string {
    return this._name
  }

  get description(): string | undefined {
    return this._description
  }

  get isActive(): boolean {
    return this._isActive
  }

  get permissions(): string[] {
    return [...this._permissions]
  }

  public activate(): void {
    this._isActive = true
    this.updateTimestamp()
  }

  public deactivate(): void {
    this._isActive = false
    this.updateTimestamp()
  }

  public addPermission(permissionId: string): void {
    if (!this._permissions.includes(permissionId)) {
      this._permissions.push(permissionId)
      this.updateTimestamp()
    }
  }

  public removePermission(permissionId: string): void {
    this._permissions = this._permissions.filter(id => id !== permissionId)
    this.updateTimestamp()
  }

  public hasPermission(permissionId: string): boolean {
    return this._permissions.includes(permissionId)
  }

  public updateDescription(description: string): void {
    this._description = description
    this.updateTimestamp()
  }
}

export class Permission extends Entity {
  private _name: string
  private _description?: string
  private _resource: string
  private _action: string

  constructor(
    props: {
      name: string
      description?: string
      resource: string
      action: string
    },
    id?: string
  ) {
    super(id)
    this._name = props.name
    this._description = props.description
    this._resource = props.resource
    this._action = props.action
  }

  get name(): string {
    return this._name
  }

  get description(): string | undefined {
    return this._description
  }

  get resource(): string {
    return this._resource
  }

  get action(): string {
    return this._action
  }

  public updateDescription(description: string): void {
    this._description = description
    this.updateTimestamp()
  }

  public getFullName(): string {
    return `${this._resource}:${this._action}`
  }
}