import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { addUserToGroup, removeUserFromGroup, getUsersInGroup } from '@/lib/group-service'

interface RouteParams {
  params: {
    id: string
  }
}

// GET /api/groups/[id]/users - Get users in a group
export async function GET(request: NextRequest, context: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const groupId = context.params.id
    const users = await getUsersInGroup(groupId)

    return NextResponse.json(users)
  } catch (error) {
    console.error('Error fetching group users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/groups/[id]/users - Add users to group
export async function POST(request: NextRequest, context: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const groupId = context.params.id
    const body = await request.json()
    const { userIds } = body

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: 'User IDs array is required' },
        { status: 400 }
      )
    }

    const results = await Promise.allSettled(
      userIds.map(userId => addUserToGroup(userId, groupId))
    )

    const successful = results.filter(result => result.status === 'fulfilled').length
    const failed = results.filter(result => result.status === 'rejected').length

    return NextResponse.json({
      message: `Added ${successful} users to group successfully`,
      successful,
      failed,
      total: userIds.length
    })
  } catch (error) {
    console.error('Error adding users to group:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/groups/[id]/users - Remove users from group
export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const groupId = context.params.id
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const success = await removeUserFromGroup(userId, groupId)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to remove user from group' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'User removed from group successfully' })
  } catch (error) {
    console.error('Error removing user from group:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}