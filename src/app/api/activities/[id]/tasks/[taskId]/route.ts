import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { activityService } from '@/lib/activity-service'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const task = await activityService.updateTask(
      params.taskId,
      body,
      session.user.id
    )

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error updating activity task:', error)
    
    if (error instanceof Error && error.message.includes('permission')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to update activity task' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; taskId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await activityService.deleteTask(params.taskId, session.user.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting activity task:', error)
    
    if (error instanceof Error && error.message.includes('permission')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to delete activity task' },
      { status: 500 }
    )
  }
}