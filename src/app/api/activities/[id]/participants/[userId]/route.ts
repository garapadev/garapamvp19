import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { activityService } from '@/lib/activity-service'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await activityService.removeParticipant(
      params.id,
      session.user.id,
      params.userId
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error removing activity participant:', error)
    
    if (error instanceof Error && error.message.includes('permission')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to remove activity participant' },
      { status: 500 }
    )
  }
}