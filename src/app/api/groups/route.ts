import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { createGroup, getAllGroups } from '@/lib/group-service'

// GET /api/groups - Get all groups
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const groups = await getAllGroups()
    return NextResponse.json(groups)
  } catch (error) {
    console.error('Error fetching groups:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/groups - Create new group
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, parentId } = body

    if (!name || name.trim() === '') {
      return NextResponse.json(
        { error: 'Group name is required' },
        { status: 400 }
      )
    }

    const group = await createGroup({
      name: name.trim(),
      description: description?.trim() || undefined,
      parentId: parentId || undefined
    })

    if (!group) {
      return NextResponse.json(
        { error: 'Failed to create group' },
        { status: 500 }
      )
    }

    return NextResponse.json(group, { status: 201 })
  } catch (error) {
    console.error('Error creating group:', error)
    
    if (error instanceof Error && error.message === 'Parent group not found') {
      return NextResponse.json(
        { error: 'Parent group not found' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}