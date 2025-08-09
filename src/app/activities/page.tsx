'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  CalendarDays, 
  Users, 
  CheckCircle, 
  Clock, 
  Plus, 
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'
import { ActivityWithDetails } from '@/lib/activity-service'
import Link from 'next/link'

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

interface ActivityCardProps {
  activity: ActivityWithDetails
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

function ActivityCard({ activity, onView, onEdit, onDelete }: ActivityCardProps) {
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

  const completedTasks = activity.tasks.filter(task => task.status === 'COMPLETED').length
  const totalTasks = activity.tasks.length
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold line-clamp-2">
              {activity.title}
            </CardTitle>
            {activity.description && (
              <CardDescription className="mt-1 line-clamp-2">
                {activity.description}
              </CardDescription>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-2">
            <Badge className={getStatusColor(activity.status)}>
              {activity.status.replace('_', ' ')}
            </Badge>
            <Badge className={getPriorityColor(activity.priority)}>
              {activity.priority}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progresso</span>
            <span>{completedTasks}/{totalTasks} tarefas</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>

        {/* Dates */}
        <div className="flex items-center text-sm text-gray-600 space-x-4">
          {activity.startDate && (
            <div className="flex items-center">
              <CalendarDays className="h-4 w-4 mr-1" />
              <span>
                {new Date(activity.startDate).toLocaleDateString()}
              </span>
            </div>
          )}
          {activity.endDate && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {new Date(activity.endDate).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>

        {/* Participants */}
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-1" />
            <span>{activity._count.participants} participantes</span>
          </div>
          
          {/* Participant avatars */}
          <div className="flex -space-x-2">
            {activity.participants.slice(0, 3).map((participant) => (
              <div
                key={participant.id}
                className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium text-gray-700 border-2 border-white"
                title={participant.user.name || participant.user.email}
              >
                {(participant.user.name || participant.user.email).charAt(0).toUpperCase()}
              </div>
            ))}
            {activity._count.participants > 3 && (
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600 border-2 border-white">
                +{activity._count.participants - 3}
              </div>
            )}
          </div>
        </div>

        {/* Customer and Group */}
        <div className="flex flex-wrap gap-2">
          {activity.customer && (
            <Badge variant="outline" className="text-xs">
              Cliente: {activity.customer.name}
            </Badge>
          )}
          {activity.group && (
            <Badge variant="outline" className="text-xs">
              Grupo: {activity.group.name}
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-xs text-gray-500">
            Criado por {activity.creator.name}
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(activity.id)}
              className="h-8 w-8 p-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(activity.id)}
              className="h-8 w-8 p-0"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(activity.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ActivitiesPage() {
  const [activities, setActivities] = useState<ActivityWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (priorityFilter !== 'all') params.append('priority', priorityFilter)

      const response = await fetch(`/api/activities?${params}`)
      if (response.ok) {
        const data = await response.json()
        setActivities(data)
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchActivities()
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchTerm, statusFilter, priorityFilter])

  const handleViewActivity = (id: string) => {
    window.location.href = `/activities/${id}`
  }

  const handleEditActivity = (id: string) => {
    window.location.href = `/activities/${id}/edit`
  }

  const handleDeleteActivity = async (id: string) => {
    if (!confirm('Are you sure you want to delete this activity?')) {
      return
    }

    try {
      const response = await fetch(`/api/activities/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setActivities(activities.filter(a => a.id !== id))
      } else {
        console.error('Error deleting activity')
      }
    } catch (error) {
      console.error('Error deleting activity:', error)
    }
  }

  const filteredActivities = activities

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Atividades</h1>
            <p className="text-muted-foreground">
              Gerencie e acompanhe as atividades e tarefas da sua equipe
            </p>
          </div>
          <Link href="/activities/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Nova Atividade
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Pesquisar atividades..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value={ACTIVITY_STATUSES.PLANNING}>Planejamento</SelectItem>
                  <SelectItem value={ACTIVITY_STATUSES.IN_PROGRESS}>Em Andamento</SelectItem>
                  <SelectItem value={ACTIVITY_STATUSES.COMPLETED}>Concluído</SelectItem>
                  <SelectItem value={ACTIVITY_STATUSES.CANCELLED}>Cancelado</SelectItem>
                  <SelectItem value={ACTIVITY_STATUSES.ON_HOLD}>Pausado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as Prioridades</SelectItem>
                  <SelectItem value={ACTIVITY_PRIORITIES.LOW}>Baixa</SelectItem>
                  <SelectItem value={ACTIVITY_PRIORITIES.MEDIUM}>Média</SelectItem>
                  <SelectItem value={ACTIVITY_PRIORITIES.HIGH}>Alta</SelectItem>
                  <SelectItem value={ACTIVITY_PRIORITIES.URGENT}>Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Activities Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="h-2 bg-gray-200 rounded"></div>
                    <div className="h-2 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">Nenhuma atividade encontrada</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                    ? 'Tente ajustar seus filtros'
                    : 'Comece criando sua primeira atividade'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && priorityFilter === 'all' && (
                  <Link href="/activities/create">
                    <Button className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Atividade
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredActivities.map((activity) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                onView={handleViewActivity}
                onEdit={handleEditActivity}
                onDelete={handleDeleteActivity}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  )
}