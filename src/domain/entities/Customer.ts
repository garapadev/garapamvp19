import { Entity } from './Entity'

export enum CustomerStatus {
  LEAD = 'LEAD',
  PROSPECT = 'PROSPECT',
  CUSTOMER = 'CUSTOMER',
  INACTIVE = 'INACTIVE',
  LOST = 'LOST'
}

export class Customer extends Entity {
  private _name: string
  private _email?: string
  private _phone?: string
  private _document?: string
  private _company?: string
  private _position?: string
  private _avatar?: string
  private _birthDate?: Date
  private _address?: string
  private _city?: string
  private _state?: string
  private _country?: string
  private _postalCode?: string
  private _notes?: string
  private _status: CustomerStatus
  private _source?: string
  private _tags: string[]

  constructor(
    props: {
      name: string
      email?: string
      phone?: string
      document?: string
      company?: string
      position?: string
      avatar?: string
      birthDate?: Date
      address?: string
      city?: string
      state?: string
      country?: string
      postalCode?: string
      notes?: string
      status?: CustomerStatus
      source?: string
      tags?: string[]
    },
    id?: string
  ) {
    super(id)
    this._name = props.name
    this._email = props.email
    this._phone = props.phone
    this._document = props.document
    this._company = props.company
    this._position = props.position
    this._avatar = props.avatar
    this._birthDate = props.birthDate
    this._address = props.address
    this._city = props.city
    this._state = props.state
    this._country = props.country
    this._postalCode = props.postalCode
    this._notes = props.notes
    this._status = props.status || CustomerStatus.LEAD
    this._source = props.source
    this._tags = props.tags || []
  }

  get name(): string {
    return this._name
  }

  get email(): string | undefined {
    return this._email
  }

  get phone(): string | undefined {
    return this._phone
  }

  get document(): string | undefined {
    return this._document
  }

  get company(): string | undefined {
    return this._company
  }

  get position(): string | undefined {
    return this._position
  }

  get avatar(): string | undefined {
    return this._avatar
  }

  get birthDate(): Date | undefined {
    return this._birthDate
  }

  get address(): string | undefined {
    return this._address
  }

  get city(): string | undefined {
    return this._city
  }

  get state(): string | undefined {
    return this._state
  }

  get country(): string | undefined {
    return this._country
  }

  get postalCode(): string | undefined {
    return this._postalCode
  }

  get notes(): string | undefined {
    return this._notes
  }

  get status(): CustomerStatus {
    return this._status
  }

  get source(): string | undefined {
    return this._source
  }

  get tags(): string[] {
    return [...this._tags]
  }

  public updateStatus(status: CustomerStatus): void {
    this._status = status
    this.updateTimestamp()
  }

  public addTag(tag: string): void {
    if (!this._tags.includes(tag)) {
      this._tags.push(tag)
      this.updateTimestamp()
    }
  }

  public removeTag(tag: string): void {
    this._tags = this._tags.filter(t => t !== tag)
    this.updateTimestamp()
  }

  public updateProfile(data: {
    name?: string
    email?: string
    phone?: string
    company?: string
    position?: string
    avatar?: string
  }): void {
    if (data.name !== undefined) this._name = data.name
    if (data.email !== undefined) this._email = data.email
    if (data.phone !== undefined) this._phone = data.phone
    if (data.company !== undefined) this._company = data.company
    if (data.position !== undefined) this._position = data.position
    if (data.avatar !== undefined) this._avatar = data.avatar
    this.updateTimestamp()
  }

  public updateAddress(data: {
    address?: string
    city?: string
    state?: string
    country?: string
    postalCode?: string
  }): void {
    if (data.address !== undefined) this._address = data.address
    if (data.city !== undefined) this._city = data.city
    if (data.state !== undefined) this._state = data.state
    if (data.country !== undefined) this._country = data.country
    if (data.postalCode !== undefined) this._postalCode = data.postalCode
    this.updateTimestamp()
  }

  public updateNotes(notes: string): void {
    this._notes = notes
    this.updateTimestamp()
  }

  public isLead(): boolean {
    return this._status === CustomerStatus.LEAD
  }

  public isProspect(): boolean {
    return this._status === CustomerStatus.PROSPECT
  }

  public isCustomer(): boolean {
    return this._status === CustomerStatus.CUSTOMER
  }

  public isActive(): boolean {
    return this._status !== CustomerStatus.INACTIVE && this._status !== CustomerStatus.LOST
  }
}