import { Entity, UniqueEntityID } from './Entity'

export class User extends Entity {
  private _email: string
  private _username?: string
  private _password: string
  private _name?: string
  private _avatar?: string
  private _isActive: boolean
  private _emailVerified: boolean
  private _roles: string[]

  constructor(
    props: {
      email: string
      username?: string
      password: string
      name?: string
      avatar?: string
      isActive?: boolean
      emailVerified?: boolean
      roles?: string[]
    },
    id?: UniqueEntityID
  ) {
    super(id)
    this._email = props.email
    this._username = props.username
    this._password = props.password
    this._name = props.name
    this._avatar = props.avatar
    this._isActive = props.isActive ?? true
    this._emailVerified = props.emailVerified ?? false
    this._roles = props.roles ?? []
  }

  get email(): string {
    return this._email
  }

  get username(): string | undefined {
    return this._username
  }

  get name(): string | undefined {
    return this._name
  }

  get avatar(): string | undefined {
    return this._avatar
  }

  get isActive(): boolean {
    return this._isActive
  }

  get emailVerified(): boolean {
    return this._emailVerified
  }

  get roles(): string[] {
    return [...this._roles]
  }

  public activate(): void {
    this._isActive = true
  }

  public deactivate(): void {
    this._isActive = false
  }

  public verifyEmail(): void {
    this._emailVerified = true
  }

  public addRole(roleId: string): void {
    if (!this._roles.includes(roleId)) {
      this._roles.push(roleId)
    }
  }

  public removeRole(roleId: string): void {
    this._roles = this._roles.filter(id => id !== roleId)
  }

  public hasRole(roleId: string): boolean {
    return this._roles.includes(roleId)
  }

  public updateProfile(data: { name?: string; avatar?: string }): void {
    if (data.name !== undefined) this._name = data.name
    if (data.avatar !== undefined) this._avatar = data.avatar
  }
}