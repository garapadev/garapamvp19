import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { activityService } from '@/lib/activity-service'
import { ParticipantRole } from '@/lib/enums'

// Use string literals to avoid enum import issues
const PARTICIPANT_ROLES = {
  MEMBER: 'MEMBER',
  MODERATOR: 'MODERATOR',
  ADMIN: 'ADMIN'
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

    return NextResponse.json(activity.participants)
  } catch (error) {
    console.error('Error fetching activity participants:', error)
    return NextResponse.json(
      { error: 'Failed to fetch activity participants' },
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
    const { userId, role = ParticipantRole.MEMBER } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const participant = await activityService.addParticipant(
      params.id,
      session.user.id,
      userId,
      role
    )

    return NextResponse.json(participant, { status: 201 })
  } catch (error) {
    console.error('Error adding activity participant:', error)
    
    if (error instanceof Error && error.message.includes('permission')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to add activity participant' },
      { status: 500 }
    )
  }
}