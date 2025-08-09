'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  CalendarDays, 
  Clock, 
  Users, 
  Target,
  CheckCircle,
  Circle,
  AlertTriangle,
  Plus,
  UserPlus,
  MoreVertical,
  X,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from 'lucide-react'
import { ActivityWithDetails, ActivityTaskWithAssignee } from '@/lib/activity-service'
import { ActivityStatus, ActivityPriority, TaskStatus, ParticipantRole } from '@/lib/enums'
import Link from 'next/link'
import { useParams } from 'next/navigation'

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

const TASK_STATUSES = {
  PENDING: 'PENDING',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const

const TASK_PRIORITIES = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  URGENT: 'URGENT'
} as const

const PARTICIPANT_ROLES = {
  MEMBER: 'MEMBER',
  MODERATOR: 'MODERATOR',
  ADMIN: 'ADMIN'
} as const

interface TaskCardProps {
  task: ActivityTaskWithAssignee
  onStatusChange: (taskId: string, status: string) => void
  onEdit: (task: ActivityTaskWithAssignee) => void
  onDelete: (taskId: string) => void
  canEdit: boolean
}

function TaskCard({ task, onStatusChange, onEdit, onDelete, canEdit }: TaskCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case TASK_STATUSES.PENDING:
        return 'bg-gray-100 text-gray-800'
      case TASK_STATUSES.IN_PROGRESS:
        return 'bg-blue-100 text-blue-800'
      case TASK_STATUSES.COMPLETED:
        return 'bg-green-100 text-green-800'
      case TASK_STATUSES.CANCELLED:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case TASK_PRIORITIES.LOW:
        return 'bg-gray-100 text-gray-800'
      case TASK_PRIORITIES.MEDIUM:
        return 'bg-blue-100 text-blue-800'
      case TASK_PRIORITIES.HIGH:
        return 'bg-orange-100 text-orange-800'
      case TASK_PRIORITIES.URGENT:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== TASK_STATUSES.COMPLETED

  return (
    <Card className={`h-full ${isOverdue ? 'border-red-200 bg-red-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base font-semibold line-clamp-2">
              {task.title}
            </CardTitle>
            {task.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {task.description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-2">
            <Badge className={getStatusColor(task.status)}>
              {task.status.replace('_', ' ')}
            </Badge>
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Due Date */}
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-1" />
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            {task.dueDate 
              ? `Due: ${new Date(task.dueDate).toLocaleDateString()}`
              : 'No due date'
            }
          </span>
          {isOverdue && (
            <AlertTriangle className="h-4 w-4 ml-1 text-red-600" />
          )}
        </div>

        {/* Assignee */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            {task.assignee ? (
              <>
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700 mr-2">
                  {(task.assignee.name || task.assignee.email).charAt(0).toUpperCase()}
                </div>
                <span>{task.assignee.name || task.assignee.email}</span>
              </>
            ) : (
              <span className="text-gray-400">Unassigned</span>
            )}
          </div>
          
          {/* Status Toggle */}
          {canEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newStatus = task.status === TASK_STATUSES.COMPLETED 
                  ? TASK_STATUSES.PENDING 
                  : TASK_STATUSES.COMPLETED
                onStatusChange(task.id, newStatus)
              }}
              className="h-8 w-8 p-0"
            >
              {task.status === TASK_STATUSES.COMPLETED ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <Circle className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          )}
        </div>

        {/* Actions */}
        {canEdit && (
          <div className="flex items-center justify-end pt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit(task)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDelete(task.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface ParticipantCardProps {
  participant: any
  onRemove: (userId: string) => void
  canRemove: boolean
}

function ParticipantCard({ participant, onRemove, canRemove }: ParticipantCardProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case PARTICIPANT_ROLES.ADMIN:
        return 'bg-red-100 text-red-800'
      case PARTICIPANT_ROLES.MODERATOR:
        return 'bg-blue-100 text-blue-800'
      case PARTICIPANT_ROLES.MEMBER:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="h-full">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-700 mr-3">
              {(participant.user.name || participant.user.email).charAt(0).toUpperCase()}
            </div>
            <div>
              <h4 className="font-medium">{participant.user.name || participant.user.email}</h4>
              <p className="text-sm text-gray-600">{participant.user.email}</p>
            </div>
          </div>
          <Badge className={getRoleColor(participant.role)}>
            {participant.role}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Joined {new Date(participant.joinedAt).toLocaleDateString()}</span>
          {canRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(participant.userId)}
              className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function ActivityDetailsPage() {
  const params = useParams()
  const activityId = params.id as string
  
  const [activity, setActivity] = useState<ActivityWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchActivity()
  }, [activityId])

  const fetchActivity = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/activities/${activityId}`)
      if (response.ok) {
        const data = await response.json()
        setActivity(data)
      } else {
        window.location.href = '/activities'
      }
    } catch (error) {
      console.error('Error fetching activity:', error)
      window.location.href = '/activities'
    } finally {
      setLoading(false)
    }
  }

  const handleTaskStatusChange = async (taskId: string, status: string) => {
    try {
      const response = await fetch(`/api/activities/${activityId}/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      })

      if (response.ok) {
        fetchActivity() // Refresh activity data
      }
    } catch (error) {
      console.error('Error updating task status:', error)
    }
  }

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) {
      return
    }

    try {
      const response = await fetch(`/api/activities/${activityId}/tasks/${taskId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchActivity() // Refresh activity data
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const handleRemoveParticipant = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this participant?')) {
      return
    }

    try {
      const response = await fetch(`/api/activities/${activityId}/participants/${userId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchActivity() // Refresh activity data
      }
    } catch (error) {
      console.error('Error removing participant:', error)
    }
  }

  const handleDeleteActivity = async () => {
    if (!confirm('Are you sure you want to delete this activity? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/activities/${activityId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        window.location.href = '/activities'
      }
    } catch (error) {
      console.error('Error deleting activity:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case ACTIVITY_STATUSES.PLANNING:
        return 'bg-blue-100 text-blue-800'
      case ACTIVITY_STATUSES.IN_PROGRESS:
        return 'bg-yellow-100 text-yellow-800'
      case ACTIVITY_STATUSES.COMPLETED:
        return 'bg-green-100 text-green-800'
      case ACTIVITY_STATUSES.CANCELLED:
        return 'bg-red-100 text-red-800'
      case ACTIVITY_STATUSES.ON_HOLD:
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case ACTIVITY_PRIORITIES.LOW:
        return 'bg-gray-100 text-gray-800'
      case ACTIVITY_PRIORITIES.MEDIUM:
        return 'bg-blue-100 text-blue-800'
      case ACTIVITY_PRIORITIES.HIGH:
        return 'bg-orange-100 text-orange-800'
      case ACTIVITY_PRIORITIES.URGENT:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!activity) {
    return null
  }

  const completedTasks = activity.tasks.filter(task => task.status === TaskStatus.COMPLETED).length
  const totalTasks = activity.tasks.length
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const canEdit = activity.creatorId === 'current-user-id' || // This should be replaced with actual user ID
    activity.participants.some(p => p.userId === 'current-user-id' && 
      (p.role === ParticipantRole.ADMIN || p.role === ParticipantRole.MODERATOR))

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/activities">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{activity.title}</h1>
            <p className="text-muted-foreground">
              Created by {activity.creator.name} on {new Date(activity.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link href={`/activities/${activity.id}/edit`}>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <Button 
            variant="outline" 
            onClick={handleDeleteActivity}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Activity Info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl">Activity Overview</CardTitle>
              {activity.description && (
                <CardDescription className="mt-2">
                  {activity.description}
                </CardDescription>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getStatusColor(activity.status)}>
                {activity.status.replace('_', ' ')}
              </Badge>
              <Badge className={getPriorityColor(activity.priority)}>
                {activity.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Target className="h-4 w-4 mr-1" />
                <span>Tasks</span>
              </div>
              <div className="text-2xl font-bold">{completedTasks}/{totalTasks}</div>
              <Progress value={progressPercentage} className="w-full" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <Users className="h-4 w-4 mr-1" />
                <span>Participants</span>
              </div>
              <div className="text-2xl font-bold">{activity._count.participants}</div>
            </div>

            {activity.startDate && (
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  <span>Start Date</span>
                </div>
                <div className="text-lg font-medium">
                  {new Date(activity.startDate).toLocaleDateString()}
                </div>
              </div>
            )}

            {activity.endDate && (
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>End Date</span>
                </div>
                <div className="text-lg font-medium">
                  {new Date(activity.endDate).toLocaleDateString()}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {activity.customer && (
              <Badge variant="outline">
                Customer: {activity.customer.name}
              </Badge>
            )}
            {activity.group && (
              <Badge variant="outline">
                Group: {activity.group.name}
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks ({activity.tasks.length})</TabsTrigger>
          <TabsTrigger value="participants">Participants ({activity.participants.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">Activity history will be shown here</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Completion Rate</span>
                    <span className="font-medium">{progressPercentage.toFixed(0)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overdue Tasks</span>
                    <span className="font-medium">
                      {activity.tasks.filter(task => 
                        task.dueDate && 
                        new Date(task.dueDate) < new Date() && 
                        task.status !== TaskStatus.COMPLETED
                      ).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Participants</span>
                    <span className="font-medium">
                      {activity.participants.filter(p => p.isActive).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Tasks</h3>
            {canEdit && (
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            )}
          </div>
          
          {activity.tasks.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Target className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tasks yet</h3>
                <p className="text-gray-500 text-center mb-4">
                  Add tasks to track the progress of this activity
                </p>
                {canEdit && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Task
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activity.tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleTaskStatusChange}
                  onEdit={() => {}} // TODO: Implement edit functionality
                  onDelete={handleDeleteTask}
                  canEdit={canEdit}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="participants" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Participants</h3>
            {canEdit && (
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Participant
              </Button>
            )}
          </div>
          
          {activity.participants.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No participants yet</h3>
                <p className="text-gray-500 text-center mb-4">
                  Add team members to collaborate on this activity
                </p>
                {canEdit && (
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add First Participant
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activity.participants.map((participant) => (
                <ParticipantCard
                  key={participant.id}
                  participant={participant}
                  onRemove={handleRemoveParticipant}
                  canRemove={canEdit}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </MainLayout>
  )
}