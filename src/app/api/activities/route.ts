import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { activityService } from '@/lib/activity-service'
import { ActivityStatus, ActivityPriority } from '@/lib/enums'

// Use string literals to avoid enum import issues
const ACTIVITY_STATUSES = {
  PLANNING: 'PLANNING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  ON_HOLD: 'ON_HOLD'
} as const

const ACTIVITY_PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
} as const

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const filters = {
      status: searchParams.get('status') as ActivityStatus || undefined,
      priority: searchParams.get('priority') as ActivityPriority || undefined,
      groupId: searchParams.get('groupId') || undefined,
      customerId: searchParams.get('customerId') || undefined,
      search: searchParams.get('search') || undefined
    }

    const activities = await activityService.getActivities(session.user.id, filters)
    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { tasks, participantIds, ...activityData } = body

    // Validate required fields
    if (!activityData.title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      )
    }

    if (!tasks || !Array.isArray(tasks) || tasks.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 tasks are required' },
        { status: 400 }
      )
    }

    const activity = await activityService.createActivity(
      {
        ...activityData,
        tasks,
        participantIds
      },
      session.user.id
    )

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error('Error creating activity:', error)
    
    if (error instanceof Error && error.message.includes('permission')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to create activity' },
      { status: 500 }
    )
  }
}