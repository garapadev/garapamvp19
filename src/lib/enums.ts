// Temporary enum definitions until Prisma client is generated

export const ActivityStatus = {
  PLANNING: 'PLANNING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  ON_HOLD: 'ON_HOLD'
} as const

export const ActivityPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
} as const

export const TaskStatus = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const

export const TaskPriority = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
} as const

export const ParticipantRole = {
  MEMBER: 'MEMBER',
  MODERATOR: 'MODERATOR',
  ADMIN: 'ADMIN'
} as const

export type ActivityStatusType = typeof ActivityStatus[keyof typeof ActivityStatus]
export type ActivityPriorityType = typeof ActivityPriority[keyof typeof ActivityPriority]
export type TaskStatusType = typeof TaskStatus[keyof typeof TaskStatus]
export type TaskPriorityType = typeof TaskPriority[keyof typeof TaskPriority]
export type ParticipantRoleType = typeof ParticipantRole[keyof typeof ParticipantRole]