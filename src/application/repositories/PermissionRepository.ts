import { Permission } from '@/domain/entities/RBAC'

export interface PermissionRepository {
  findById(id: string): Promise<Permission | null>
  findByName(name: string): Promise<Permission | null>
  create(permission: Permission): Promise<Permission>
  update(permission: Permission): Promise<Permission>
  delete(id: string): Promise<void>
  findAll(): Promise<Permission[]>
  findByRoleIds(roleIds: string[]): Promise<Permission[]>
}