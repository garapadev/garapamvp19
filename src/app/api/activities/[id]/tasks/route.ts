import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { activityService } from '@/lib/activity-service'
import { TaskStatus, TaskPriority } from '@/lib/enums'

// Use string literals to avoid enum import issues
const TASK_STATUSES = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const

const TASK_PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
} as const

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const activity = await activityService.getActivityById(params.id, session.user.id)
    if (!activity) {
      return NextResponse.json(
        { error: 'Activity not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(activity.tasks)
  } catch (error) {
    console.error('Error fetching activity tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity tasks' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, status, priority, dueDate, assigneeId } = body

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    const task = await activityService.createTask(
      params.id,
      {
        title,
        description,
        status: status || TaskStatus.PENDING,
        priority: priority || TaskPriority.MEDIUM,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assigneeId
      },
      session.user.id
    )

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating activity task:', error)
    
    if (error instanceof Error && error.message.includes('permission')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create activity task' },
      { status: 500 }
    )
  }
}