import { PrismaClient } from '@prisma/client'
import { Customer, CustomerStatus } from '@/domain/entities/Customer'
import { CustomerRepository } from '@/application/repositories/CustomerRepository'

export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Customer | null> {
    const customer = await this.prisma.customers.findUnique({
      where: { id }
    })

    if (!customer) return null

    return new Customer(
      {
        name: customer.name,
        email: customer.email || undefined,
        phone: customer.phone || undefined,
        document: customer.document || undefined,
        company: customer.company || undefined,
        position: customer.position || undefined,
        avatar: customer.avatar || undefined,
        birthDate: customer.birthDate || undefined,
        address: customer.address || undefined,
        city: customer.city || undefined,
        state: customer.state || undefined,
        country: customer.country || undefined,
        postalCode: customer.postalCode || undefined,
        notes: customer.notes || undefined,
        status: customer.status as CustomerStatus,
        source: customer.source || undefined,
        tags: customer.tags || []
      },
      customer.id
    )
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customer = await this.prisma.customers.findUnique({
      where: { email }
    })

    if (!customer) return null

    return new Customer(
      {
        name: customer.name,
        email: customer.email || undefined,
        phone: customer.phone || undefined,
        document: customer.document || undefined,
        company: customer.company || undefined,
        position: customer.position || undefined,
        avatar: customer.avatar || undefined,
        birthDate: customer.birthDate || undefined,
        address: customer.address || undefined,
        city: customer.city || undefined,
        state: customer.state || undefined,
        country: customer.country || undefined,
        postalCode: customer.postalCode || undefined,
        notes: customer.notes || undefined,
        status: customer.status as CustomerStatus,
        source: customer.source || undefined,
        tags: customer.tags || []
      },
      customer.id
    )
  }

  async findByDocument(document: string): Promise<Customer | null> {
    const customer = await this.prisma.customers.findUnique({
      where: { document }
    })

    if (!customer) return null

    return new Customer(
      {
        name: customer.name,
        email: customer.email || undefined,
        phone: customer.phone || undefined,
        document: customer.document || undefined,
        company: customer.company || undefined,
        position: customer.position || undefined,
        avatar: customer.avatar || undefined,
        birthDate: customer.birthDate || undefined,
        address: customer.address || undefined,
        city: customer.city || undefined,
        state: customer.state || undefined,
        country: customer.country || undefined,
        postalCode: customer.postalCode || undefined,
        notes: customer.notes || undefined,
        status: customer.status as CustomerStatus,
        source: customer.source || undefined,
        tags: customer.tags || []
      },
      customer.id
    )
  }

  async create(customer: Customer): Promise<Customer> {
    const createdCustomer = await this.prisma.customers.create({
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        document: customer.document,
        company: customer.company,
        position: customer.position,
        avatar: customer.avatar,
        birthDate: customer.birthDate,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        country: customer.country,
        postalCode: customer.postalCode,
        notes: customer.notes,
        status: customer.status,
        source: customer.source,
        tags: customer.tags
      }
    })

    return customer
  }

  async update(customer: Customer): Promise<Customer> {
    await this.prisma.customers.update({
      where: { id: customer.id },
      data: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        document: customer.document,
        company: customer.company,
        position: customer.position,
        avatar: customer.avatar,
        birthDate: customer.birthDate,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        country: customer.country,
        postalCode: customer.postalCode,
        notes: customer.notes,
        status: customer.status,
        source: customer.source,
        tags: customer.tags
      }
    })

    return customer
  }

  async delete(id: string): Promise<void> {
    await this.prisma.customers.delete({
      where: { id }
    })
  }

  async findAll(): Promise<Customer[]> {
    const customers = await this.prisma.customers.findMany()

    return customers.map(customer => new Customer(
      {
        name: customer.name,
        email: customer.email || undefined,
        phone: customer.phone || undefined,
        document: customer.document || undefined,
        company: customer.company || undefined,
        position: customer.position || undefined,
        avatar: customer.avatar || undefined,
        birthDate: customer.birthDate || undefined,
        address: customer.address || undefined,
        city: customer.city || undefined,
        state: customer.state || undefined,
        country: customer.country || undefined,
        postalCode: customer.postalCode || undefined,
        notes: customer.notes || undefined,
        status: customer.status as CustomerStatus,
        source: customer.source || undefined,
        tags: customer.tags || []
      },
      customer.id
    ))
  }

  async findByStatus(status: string): Promise<Customer[]> {
    const customers = await this.prisma.customers.findMany({
      where: { status: status as CustomerStatus }
    })

    return customers.map(customer => new Customer(
      {
        name: customer.name,
        email: customer.email || undefined,
        phone: customer.phone || undefined,
        document: customer.document || undefined,
        company: customer.company || undefined,
        position: customer.position || undefined,
        avatar: customer.avatar || undefined,
        birthDate: customer.birthDate || undefined,
        address: customer.address || undefined,
        city: customer.city || undefined,
        state: customer.state || undefined,
        country: customer.country || undefined,
        postalCode: customer.postalCode || undefined,
        notes: customer.notes || undefined,
        status: customer.status as CustomerStatus,
        source: customer.source || undefined,
        tags: customer.tags || []
      },
      customer.id
    ))
  }

  async findByTags(tags: string[]): Promise<Customer[]> {
    const customers = await this.prisma.customers.findMany({
      where: {
        tags: {
          hasSome: tags
        }
      }
    })

    return customers.map(customer => new Customer(
      {
        name: customer.name,
        email: customer.email || undefined,
        phone: customer.phone || undefined,
        document: customer.document || undefined,
        company: customer.company || undefined,
        position: customer.position || undefined,
        avatar: customer.avatar || undefined,
        birthDate: customer.birthDate || undefined,
        address: customer.address || undefined,
        city: customer.city || undefined,
        state: customer.state || undefined,
        country: customer.country || undefined,
        postalCode: customer.postalCode || undefined,
        notes: customer.notes || undefined,
        status: customer.status as CustomerStatus,
        source: customer.source || undefined,
        tags: customer.tags || []
      },
      customer.id
    ))
  }

  async search(query: string): Promise<Customer[]> {
    const customers = await this.prisma.customers.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            email: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            company: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            document: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      }
    })

    return customers.map(customer => new Customer(
      {
        name: customer.name,
        email: customer.email || undefined,
        phone: customer.phone || undefined,
        document: customer.document || undefined,
        company: customer.company || undefined,
        position: customer.position || undefined,
        avatar: customer.avatar || undefined,
        birthDate: customer.birthDate || undefined,
        address: customer.address || undefined,
        city: customer.city || undefined,
        state: customer.state || undefined,
        country: customer.country || undefined,
        postalCode: customer.postalCode || undefined,
        notes: customer.notes || undefined,
        status: customer.status as CustomerStatus,
        source: customer.source || undefined,
        tags: customer.tags || []
      },
      customer.id
    ))
  }
}