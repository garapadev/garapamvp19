import { User } from '@/domain/entities/User'
import { Role } from '@/domain/entities/RBAC'
import { UserRoleRepository } from '@/application/repositories/UserRoleRepository'
import { RoleRepository } from '@/application/repositories/RoleRepository'
import { PermissionRepository } from '@/application/repositories/PermissionRepository'

export interface RBACService {
  assignRoleToUser(userId: string, roleId: string): Promise<void>
  removeRoleFromUser(userId: string, roleId: string): Promise<void>
  getUserRoles(userId: string): Promise<Role[]>
  getUserPermissions(userId: string): Promise<string[]>
  hasPermission(userId: string, resource: string, action: string): Promise<boolean>
  createRole(data: { name: string; description?: string }): Promise<Role>
  updateRole(roleId: string, data: { name?: string; description?: string }): Promise<Role>
  deleteRole(roleId: string): Promise<void>
  addPermissionToRole(roleId: string, permissionId: string): Promise<void>
  removePermissionFromRole(roleId: string, permissionId: string): Promise<void>
}

export class RBACServiceImpl implements RBACService {
  constructor(
    private userRoleRepository: UserRoleRepository,
    private roleRepository: RoleRepository,
    private permissionRepository: PermissionRepository
  ) {}

  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    const existingAssignment = await this.userRoleRepository.findByUserAndRole(userId, roleId)
    if (existingAssignment) {
      throw new Error('User already has this role')
    }
    await this.userRoleRepository.create({ userId, roleId })
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    const assignment = await this.userRoleRepository.findByUserAndRole(userId, roleId)
    if (!assignment) {
      throw new Error('User does not have this role')
    }
    await this.userRoleRepository.delete(assignment.id)
  }

  async getUserRoles(userId: string): Promise<Role[]> {
    const userRoles = await this.userRoleRepository.findByUserId(userId)
    const roleIds = userRoles.map(ur => ur.roleId)
    return await this.roleRepository.findByIds(roleIds)
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const roles = await this.getUserRoles(userId)
    const roleIds = roles.map(r => r.id)
    const permissions = await this.permissionRepository.findByRoleIds(roleIds)
    return permissions.map(p => `${p.resource}:${p.action}`)
  }

  async hasPermission(userId: string, resource: string, action: string): Promise<boolean> {
    const permissions = await this.getUserPermissions(userId)
    const requiredPermission = `${resource}:${action}`
    return permissions.includes(requiredPermission)
  }

  async createRole(data: { name: string; description?: string }): Promise<Role> {
    const existingRole = await this.roleRepository.findByName(data.name)
    if (existingRole) {
      throw new Error('Role already exists')
    }
    const role = new Role(data)
    return await this.roleRepository.create(role)
  }

  async updateRole(roleId: string, data: { name?: string; description?: string }): Promise<Role> {
    const role = await this.roleRepository.findById(roleId)
    if (!role) {
      throw new Error('Role not found')
    }
    
    if (data.name) {
      const existingRole = await this.roleRepository.findByName(data.name)
      if (existingRole && existingRole.id !== roleId) {
        throw new Error('Role name already exists')
      }
      role.updateTitle(data.name)
    }
    
    if (data.description !== undefined) {
      role.updateDescription(data.description)
    }
    
    return await this.roleRepository.update(role)
  }

  async deleteRole(roleId: string): Promise<void> {
    const role = await this.roleRepository.findById(roleId)
    if (!role) {
      throw new Error('Role not found')
    }
    await this.roleRepository.delete(roleId)
  }

  async addPermissionToRole(roleId: string, permissionId: string): Promise<void> {
    const role = await this.roleRepository.findById(roleId)
    if (!role) {
      throw new Error('Role not found')
    }
    
    const permission = await this.permissionRepository.findById(permissionId)
    if (!permission) {
      throw new Error('Permission not found')
    }
    
    await this.roleRepository.addPermission(roleId, permissionId)
  }

  async removePermissionFromRole(roleId: string, permissionId: string): Promise<void> {
    const role = await this.roleRepository.findById(roleId)
    if (!role) {
      throw new Error('Role not found')
    }
    
    await this.roleRepository.removePermission(roleId, permissionId)
  }
}