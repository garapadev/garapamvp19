import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { updateGroup, deleteGroup } from '@/lib/group-service'

interface RouteParams {
  params: {
    id: string
  }
}

// PUT /api/groups/[id] - Update group
export async function PUT(request: NextRequest, context: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const groupId = context.params.id
    const body = await request.json()
    const { name, description, parentId, isActive } = body

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Group name is required' },
        { status: 400 }
      )
    }

    const group = await updateGroup(groupId, {
      name: name.trim(),
      description: description?.trim() || undefined,
      parentId: parentId || undefined,
      isActive: isActive !== undefined ? isActive : undefined
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Failed to update group' },
        { status: 500 }
      )
    }

    return NextResponse.json(group)
  } catch (error) {
    console.error('Error updating group:', error)
    
    if (error instanceof Error) {
      if (error.message === 'Parent group not found') {
        return NextResponse.json(
          { error: 'Parent group not found' },
          { status: 400 }
        )
      }
      
      if (error.message.includes('circular reference')) {
        return NextResponse.json(
          { error: 'Cannot set parent to a descendant group (circular reference)' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/groups/[id] - Delete group
export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const groupId = context.params.id
    const success = await deleteGroup(groupId)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete group' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Group deleted successfully' })
  } catch (error) {
    console.error('Error deleting group:', error)
    
    if (error instanceof Error && error.message.includes('child groups')) {
      return NextResponse.json(
        { error: 'Cannot delete group with child groups. Please delete or move child groups first.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}