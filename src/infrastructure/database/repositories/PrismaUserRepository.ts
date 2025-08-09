import { PrismaClient } from '@prisma/client'
import { User } from '@/domain/entities/User'
import { UserRepository } from '@/application/repositories/UserRepository'

export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.users.findUnique({
      where: { id },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    })

    if (!user) return null

    return new User(
      {
        email: user.email,
        username: user.username || undefined,
        password: user.password,
        name: user.name || undefined,
        avatar: user.avatar || undefined,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        roles: user.userRoles.map(ur => ur.roleId)
      },
      user.id
    )
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.users.findUnique({
      where: { email },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    })

    if (!user) return null

    return new User(
      {
        email: user.email,
        username: user.username || undefined,
        password: user.password,
        name: user.name || undefined,
        avatar: user.avatar || undefined,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        roles: user.userRoles.map(ur => ur.roleId)
      },
      user.id
    )
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.users.findUnique({
      where: { username },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    })

    if (!user) return null

    return new User(
      {
        email: user.email,
        username: user.username || undefined,
        password: user.password,
        name: user.name || undefined,
        avatar: user.avatar || undefined,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        roles: user.userRoles.map(ur => ur.roleId)
      },
      user.id
    )
  }

  async create(user: User): Promise<User> {
    const createdUser = await this.prisma.users.create({
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        password: user.password,
        name: user.name,
        avatar: user.avatar,
        isActive: user.isActive,
        emailVerified: user.emailVerified
      }
    })

    // Create user roles if any
    if (user.roles.length > 0) {
      await this.prisma.userRole.createMany({
        data: user.roles.map(roleId => ({
          userId: user.id,
          roleId
        }))
      })
    }

    return user
  }

  async update(user: User): Promise<User> {
    await this.prisma.users.update({
      where: { id: user.id },
      data: {
        email: user.email,
        username: user.username,
        password: user.password,
        name: user.name,
        avatar: user.avatar,
        isActive: user.isActive,
        emailVerified: user.emailVerified
      }
    })

    // Update user roles
    await this.prisma.userRole.deleteMany({
      where: { userId: user.id }
    })

    if (user.roles.length > 0) {
      await this.prisma.userRole.createMany({
        data: user.roles.map(roleId => ({
          userId: user.id,
          roleId
        }))
      })
    }

    return user
  }

  async delete(id: string): Promise<void> {
    await this.prisma.userRole.deleteMany({
      where: { userId: id }
    })
    await this.prisma.users.delete({
      where: { id }
    })
  }

  async findAll(): Promise<User[]> {
    const users = await this.prisma.users.findMany({
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    })

    return users.map(user => new User(
      {
        email: user.email,
        username: user.username || undefined,
        password: user.password,
        name: user.name || undefined,
        avatar: user.avatar || undefined,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        roles: user.userRoles.map(ur => ur.roleId)
      },
      user.id
    ))
  }

  async findActive(): Promise<User[]> {
    const users = await this.prisma.users.findMany({
      where: { isActive: true },
      include: {
        userRoles: {
          include: {
            role: true
          }
        }
      }
    })

    return users.map(user => new User(
      {
        email: user.email,
        username: user.username || undefined,
        password: user.password,
        name: user.name || undefined,
        avatar: user.avatar || undefined,
        isActive: user.isActive,
        emailVerified: user.emailVerified,
        roles: user.userRoles.map(ur => ur.roleId)
      },
      user.id
    ))
  }
}