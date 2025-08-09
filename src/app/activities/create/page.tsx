'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { 
  Plus, 
  X, 
  Save, 
  ArrowLeft, 
  CalendarDays,
  Clock,
  Users,
  Target,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { ActivityPriority, TaskStatus, TaskPriority, ParticipantRole } from '@/lib/enums'
import Link from 'next/link'

// Use string literals to avoid enum import issues
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

interface TaskFormData {
  id: string
  title: string
  description: string
  priority: TaskPriority
  dueDate: string
  assigneeId: string
}

interface Customer {
  id: string
  name: string
  email?: string
}

interface Group {
  id: string
  name: string
}

interface User {
  id: string
  name: string
  email: string
}

export default function CreateActivityPage() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: ACTIVITY_PRIORITIES.MEDIUM,
    startDate: '',
    endDate: '',
    groupId: 'none',
    customerId: 'none'
  })

  const [tasks, setTasks] = useState<TaskFormData[]>([
    {
      id: '1',
      title: '',
      description: '',
      priority: TASK_PRIORITIES.MEDIUM,
      dueDate: '',
      assigneeId: 'unassigned'
    },
    {
      id: '2',
      title: '',
      description: '',
      priority: TASK_PRIORITIES.MEDIUM,
      dueDate: '',
      assigneeId: 'unassigned'
    }
  ])

  const [participantIds, setParticipantIds] = useState<string[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchCustomers()
    fetchGroups()
    fetchUsers()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/customers')
      if (response.ok) {
        const data = await response.json()
        setCustomers(data)
      }
    } catch (error) {
      console.error('Error fetching customers:', error)
    }
  }

  const fetchGroups = async () => {
    try {
      const response = await fetch('/api/groups')
      if (response.ok) {
        const data = await response.json()
        setGroups(data)
      }
    } catch (error) {
      console.error('Error fetching groups:', error)
    }
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    // Validate tasks
    tasks.forEach((task, index) => {
      if (!task.title.trim()) {
        newErrors[`task-${index}-title`] = 'Task title is required'
      }
    })

    // Check if at least 2 tasks have titles
    const tasksWithTitles = tasks.filter(task => task.title.trim())
    if (tasksWithTitles.length < 2) {
      newErrors.tasks = 'At least 2 tasks with titles are required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...formData,
        startDate: formData.startDate ? new Date(formData.startDate) : undefined,
        endDate: formData.endDate ? new Date(formData.endDate) : undefined,
        customerId: formData.customerId === 'none' ? undefined : formData.customerId,
        groupId: formData.groupId === 'none' ? undefined : formData.groupId,
        tasks: tasks
          .filter(task => task.title.trim())
          .map(task => ({
            title: task.title,
            description: task.description,
            priority: task.priority,
            dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
            assigneeId: task.assigneeId === 'unassigned' ? undefined : task.assigneeId
          })),
        participantIds: participantIds.length > 0 ? participantIds : undefined
      }

      const response = await fetch('/api/activities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        window.location.href = '/activities'
      } else {
        const error = await response.json()
        setErrors({ submit: error.error || 'Failed to create activity' })
      }
    } catch (error) {
      console.error('Error creating activity:', error)
      setErrors({ submit: 'Failed to create activity' })
    } finally {
      setLoading(false)
    }
  }

  const addTask = () => {
    setTasks([
      ...tasks,
      {
        id: Date.now().toString(),
        title: '',
        description: '',
        priority: TaskPriority.MEDIUM,
        dueDate: '',
        assigneeId: ''
      }
    ])
  }

  const removeTask = (id: string) => {
    if (tasks.length > 2) {
      setTasks(tasks.filter(task => task.id !== id))
    }
  }

  const updateTask = (id: string, field: keyof TaskFormData, value: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    ))
  }

  const addParticipant = (userId: string) => {
    if (!participantIds.includes(userId)) {
      setParticipantIds([...participantIds, userId])
    }
  }

  const removeParticipant = (userId: string) => {
    setParticipantIds(participantIds.filter(id => id !== userId))
  }

  const getPriorityColor = (priority: TaskPriority | ActivityPriority) => {
    switch (priority) {
      case TaskPriority.LOW:
      case ActivityPriority.LOW:
        return 'bg-gray-100 text-gray-800'
      case TaskPriority.MEDIUM:
      case ActivityPriority.MEDIUM:
        return 'bg-blue-100 text-blue-800'
      case TaskPriority.HIGH:
      case ActivityPriority.HIGH:
        return 'bg-orange-100 text-orange-800'
      case TaskPriority.URGENT:
      case ActivityPriority.URGENT:
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/activities">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Criar Atividade</h1>
          <p className="text-muted-foreground">
            Crie uma nova atividade com tarefas e participantes
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Informações Básicas
            </CardTitle>
            <CardDescription>
              Digite as informações básicas para sua atividade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Título da Atividade *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Digite o título da atividade"
                className={errors.title ? 'border-red-500' : ''}
              />
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Digite a descrição da atividade"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="priority">Prioridade</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value as typeof ACTIVITY_PRIORITIES[keyof typeof ACTIVITY_PRIORITIES] })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ACTIVITY_PRIORITIES.LOW}>Baixa</SelectItem>
                    <SelectItem value={ACTIVITY_PRIORITIES.MEDIUM}>Média</SelectItem>
                    <SelectItem value={ACTIVITY_PRIORITIES.HIGH}>Alta</SelectItem>
                    <SelectItem value={ACTIVITY_PRIORITIES.URGENT}>Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>

              <div>
                <Label htmlFor="endDate">Data de Término</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer">Cliente (Opcional)</Label>
                <Select value={formData.customerId} onValueChange={(value) => setFormData({ ...formData, customerId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum cliente</SelectItem>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="group">Grupo (Opcional)</Label>
                <Select value={formData.groupId} onValueChange={(value) => setFormData({ ...formData, groupId: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum grupo</SelectItem>
                    {groups.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tarefas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="h-5 w-5 mr-2" />
                Tarefas *
              </div>
              <Button type="button" variant="outline" size="sm" onClick={addTask}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Tarefa
              </Button>
            </CardTitle>
            <CardDescription>
              Adicione pelo menos 2 tarefas para esta atividade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {errors.tasks && (
              <div className="flex items-center text-sm text-red-500">
                <AlertCircle className="h-4 w-4 mr-2" />
                {errors.tasks}
              </div>
            )}

            {tasks.map((task, index) => (
              <Card key={task.id} className="border-dashed">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="font-medium">Task {index + 1}</h4>
                    {tasks.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeTask(task.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`task-${task.id}-title`}>Task Title *</Label>
                      <Input
                        id={`task-${task.id}-title`}
                        value={task.title}
                        onChange={(e) => updateTask(task.id, 'title', e.target.value)}
                        placeholder="Enter task title"
                        className={errors[`task-${index}-title`] ? 'border-red-500' : ''}
                      />
                      {errors[`task-${index}-title`] && (
                        <p className="text-sm text-red-500 mt-1">{errors[`task-${index}-title`]}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor={`task-${task.id}-description`}>Description</Label>
                      <Textarea
                        id={`task-${task.id}-description`}
                        value={task.description}
                        onChange={(e) => updateTask(task.id, 'description', e.target.value)}
                        placeholder="Enter task description"
                        rows={2}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`task-${task.id}-priority`}>Priority</Label>
                        <Select value={task.priority} onValueChange={(value) => updateTask(task.id, 'priority', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={TASK_PRIORITIES.LOW}>Low</SelectItem>
                            <SelectItem value={TASK_PRIORITIES.MEDIUM}>Medium</SelectItem>
                            <SelectItem value={TASK_PRIORITIES.HIGH}>High</SelectItem>
                            <SelectItem value={TASK_PRIORITIES.URGENT}>Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor={`task-${task.id}-dueDate`}>Due Date</Label>
                        <Input
                          id={`task-${task.id}-dueDate`}
                          type="date"
                          value={task.dueDate}
                          onChange={(e) => updateTask(task.id, 'dueDate', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`task-${task.id}-assignee`}>Assignee</Label>
                        <Select value={task.assigneeId} onValueChange={(value) => updateTask(task.id, 'assigneeId', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select assignee" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unassigned">Unassigned</SelectItem>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                {user.name} ({user.email})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>

        {/* Participants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Participants (Optional)
            </CardTitle>
            <CardDescription>
              Add team members to collaborate on this activity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Add Participants</Label>
              <Select onValueChange={addParticipant}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a user to add" />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .filter(user => !participantIds.includes(user.id))
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {participantIds.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Participants</Label>
                <div className="flex flex-wrap gap-2">
                  {participantIds.map((userId) => {
                    const user = users.find(u => u.id === userId)
                    return user ? (
                      <Badge key={userId} variant="secondary" className="flex items-center">
                        {user.name}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeParticipant(userId)}
                          className="ml-2 h-4 w-4 p-0"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ) : null
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit */}
        {errors.submit && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center text-sm text-red-600">
                <AlertCircle className="h-4 w-4 mr-2" />
                {errors.submit}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex items-center justify-end space-x-4">
          <Link href="/activities">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Creating...' : 'Create Activity'}
          </Button>
        </div>
      </form>
      </div>
    </MainLayout>
  )
}