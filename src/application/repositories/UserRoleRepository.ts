export interface UserRoleRepository {
  findByUserAndRole(userId: string, roleId: string): Promise<{ id: string; userId: string; roleId: string } | null>
  findByUserId(userId: string): Promise<{ id: string; userId: string; roleId: string }[]>
  create(data: { userId: string; roleId: string }): Promise<{ id: string; userId: string; roleId: string }>
  delete(id: string): Promise<void>
}