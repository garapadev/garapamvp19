import { NextRequest, NextResponse } from 'next/server';
import { createUser, getAccessibleUsers } from '@/lib/user-service';
import { getUserGroupContext } from '@/lib/group-service';
import { createUserPermissionContext } from '@/lib/permissions';

export async function GET(request: NextRequest) {
  try {
    // In a real app, get user ID from authentication
    const userId = request.headers.get('x-user-id') || '1';
    
    // Get user group context
    const userContext = await getUserGroupContext(userId);
    if (!userContext) {
      return NextResponse.json({ error: 'User context not found' }, { status: 404 });
    }

    // Create permission context
    const userPermission = createUserPermissionContext(
      { id: userId, isSuperAdmin: false, isGroupAdmin: true }, // Mock user data
      userContext.userGroupId,
      userContext.groupHierarchy
    );

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || undefined;
    const status = searchParams.get('status') as 'ACTIVE' | 'INACTIVE' | undefined;
    const groupId = searchParams.get('groupId') || undefined;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get accessible users
    const result = await getAccessibleUsers(userPermission, {
      search,
      status,
      groupId,
      limit,
      offset
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // In a real app, get user ID from authentication
    const userId = request.headers.get('x-user-id') || '1';
    
    // Get user group context
    const userContext = await getUserGroupContext(userId);
    if (!userContext) {
      return NextResponse.json({ error: 'User context not found' }, { status: 404 });
    }

    // Create permission context
    const userPermission = createUserPermissionContext(
      { id: userId, isSuperAdmin: false, isGroupAdmin: true }, // Mock user data
      userContext.userGroupId,
      userContext.groupHierarchy
    );

    const body = await request.json();
    const { email, username, password, name, phone, department, position, isGroupAdmin, isActive, groupId } = body;

    // Validate required fields
    if (!email || !password || !groupId) {
      return NextResponse.json(
        { error: 'Email, password, and group are required' },
        { status: 400 }
      );
    }

    // Create user
    const newUser = await createUser({
      email,
      username,
      password,
      name,
      phone,
      department,
      position,
      isGroupAdmin: isGroupAdmin || false,
      isActive: isActive !== undefined ? isActive : true,
      groupId
    }, userPermission, userContext.groupHierarchy);

    if (!newUser) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error('Error creating user:', error);
    
    if (error.message.includes('permissão')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }
    
    if (error.message.includes('já está em uso')) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}