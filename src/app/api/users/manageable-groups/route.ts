import { NextRequest, NextResponse } from 'next/server';
import { getManageableGroupsForUser } from '@/lib/user-service';
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

    // Get manageable groups
    const manageableGroups = await getManageableGroupsForUser(userPermission);

    return NextResponse.json(manageableGroups);
  } catch (error) {
    console.error('Error fetching manageable groups:', error);
    return NextResponse.json(
      { error: 'Failed to fetch manageable groups' },
      { status: 500 }
    );
  }
}