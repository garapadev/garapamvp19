import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerTenantId, createTenantFilter } from '@/lib/tenant-context'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const assigneeId = searchParams.get('assigneeId')
    const creatorId = searchParams.get('creatorId')
    const customerId = searchParams.get('customerId')
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')

    const skip = (page - 1) * limit
    const tenantFilter = createTenantFilter()

    const where: any = { ...tenantFilter }
    
    if (assigneeId) where.assigneeId = assigneeId
    if (creatorId) where.creatorId = creatorId
    if (customerId) where.customerId = customerId
    if (status) where.status = status
    if (priority) where.priority = priority

    const [tasks, total] = await Promise.all([
      prisma.tasks.findMany({
        where,
        skip,
        take: limit,
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          creator: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          customer: {
            select: {
              id: true,
              name: true,
              company: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.tasks.count({ where })
    ])

    return NextResponse.json({
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const tenantId = getServerTenantId()
    
    const task = await prisma.tasks.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status || 'PENDING',
        priority: body.priority || 'MEDIUM',
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        assigneeId: body.assigneeId,
        creatorId: body.creatorId,
        customerId: body.customerId,
        tenantId
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        creator: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            company: true
          }
        }
      }
    })

    return NextResponse.json(task, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}