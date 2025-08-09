import { Customer } from '@/domain/entities/Customer'

export interface CustomerRepository {
  findById(id: string): Promise<Customer | null>
  findByEmail(email: string): Promise<Customer | null>
  findByDocument(document: string): Promise<Customer | null>
  create(customer: Customer): Promise<Customer>
  update(customer: Customer): Promise<Customer>
  delete(id: string): Promise<void>
  findAll(): Promise<Customer[]>
  findByStatus(status: string): Promise<Customer[]>
  findByTags(tags: string[]): Promise<Customer[]>
  search(query: string): Promise<Customer[]>
}