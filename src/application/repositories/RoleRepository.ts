import { Role } from '@/domain/entities/RBAC'

export interface RoleRepository {
  findById(id: string): Promise<Role | null>
  findByName(name: string): Promise<Role | null>
  create(role: Role): Promise<Role>
  update(role: Role): Promise<Role>
  delete(id: string): Promise<void>
  findAll(): Promise<Role[]>
  findByIds(ids: string[]): Promise<Role[]>
  addPermission(roleId: string, permissionId: string): Promise<void>
  removePermission(roleId: string, permissionId: string): Promise<void>
}