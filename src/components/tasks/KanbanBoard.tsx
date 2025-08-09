'use client'

import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverEvent,
  closestCenter,
  pointerWithin,
  rectIntersection,
} from '@dnd-kit/core'
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Plus, 
  MoreHorizontal, 
  Calendar, 
  MessageSquare, 
  Paperclip,
  User,
  Flag,
  CheckCircle,
  Circle,
  AlertCircle
} from 'lucide-react'

// Tipos
interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  dueDate?: string
  comments: number
  attachments: number
  createdAt: string
}

interface Column {
  id: string
  title: string
  status: Task['status']
  tasks: Task[]
}

// Mock data
const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Reunião com cliente ABC',
    description: 'Discutir novos requisitos do projeto',
    status: 'todo',
    priority: 'high',
    assignee: {
      id: '1',
      name: 'João Silva',
      avatar: '/placeholder-avatar.jpg'
    },
    dueDate: '2024-01-20',
    comments: 3,
    attachments: 2,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    title: 'Atualizar documentação',
    description: 'Revisar e atualizar a documentação do sistema',
    status: 'in-progress',
    priority: 'medium',
    assignee: {
      id: '2',
      name: 'Maria Santos',
      avatar: '/placeholder-avatar.jpg'
    },
    dueDate: '2024-01-18',
    comments: 1,
    attachments: 0,
    createdAt: '2024-01-14'
  },
  {
    id: '3',
    title: 'Corrigir bug no login',
    description: 'Investigar e corrigir o problema de autenticação',
    status: 'in-progress',
    priority: 'urgent',
    assignee: {
      id: '3',
      name: 'Pedro Oliveira',
      avatar: '/placeholder-avatar.jpg'
    },
    dueDate: '2024-01-16',
    comments: 5,
    attachments: 1,
    createdAt: '2024-01-13'
  },
  {
    id: '4',
    title: 'Design nova interface',
    description: 'Criar mockups para a nova interface do dashboard',
    status: 'done',
    priority: 'medium',
    assignee: {
      id: '4',
      name: 'Ana Costa',
      avatar: '/placeholder-avatar.jpg'
    },
    dueDate: '2024-01-15',
    comments: 2,
    attachments: 3,
    createdAt: '2024-01-10'
  },
  {
    id: '5',
    title: 'Configurar servidor',
    description: 'Instalar e configurar o ambiente de produção',
    status: 'todo',
    priority: 'high',
    comments: 0,
    attachments: 0,
    createdAt: '2024-01-12'
  }
]

// Componente para cartão de tarefa arrastável
const SortableTaskCard = ({ task, onUpdate }: { task: Task; onUpdate: (task: Task) => void }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityIcon = (priority: Task['priority']) => {
    switch (priority) {
      case 'urgent': return <AlertCircle className="h-3 w-3" />
      case 'high': return <Flag className="h-3 w-3" />
      case 'medium': return <Circle className="h-3 w-3" />
      case 'low': return <CheckCircle className="h-3 w-3" />
      default: return <Circle className="h-3 w-3" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit'
    })
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className="mb-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
      {...attributes}
      {...listeners}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="text-sm font-medium line-clamp-2">
            {task.title}
          </CardTitle>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
            <MoreHorizontal className="h-3 w-3" />
          </Button>
        </div>
        <p className="text-xs text-gray-600 line-clamp-2">
          {task.description}
        </p>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={getPriorityColor(task.priority)}>
              {getPriorityIcon(task.priority)}
              <span className="ml-1">
                {task.priority === 'urgent' ? 'Urgente' : 
                 task.priority === 'high' ? 'Alta' : 
                 task.priority === 'medium' ? 'Média' : 'Baixa'}
              </span>
            </Badge>
            {task.dueDate && (
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="h-3 w-3 mr-1" />
                {formatDate(task.dueDate)}
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between">
            {task.assignee && (
              <div className="flex items-center">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assignee.avatar} />
                  <AvatarFallback className="text-xs">
                    {task.assignee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <span className="ml-2 text-xs text-gray-600 truncate max-w-20">
                  {task.assignee.name}
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-2">
              {task.comments > 0 && (
                <div className="flex items-center text-xs text-gray-500">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  {task.comments}
                </div>
              )}
              {task.attachments > 0 && (
                <div className="flex items-center text-xs text-gray-500">
                  <Paperclip className="h-3 w-3 mr-1" />
                  {task.attachments}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Componente para coluna do Kanban
const KanbanColumn = ({ 
  column, 
  onTaskCreate,
  isOver,
  setNodeRef
}: { 
  column: Column; 
  onTaskCreate: (status: Task['status']) => void
  isOver: boolean
  setNodeRef: (element: HTMLElement | null) => void
}) => {
  const { setNodeRef: setDroppableNodeRef, isOver: isDroppableOver } = useDroppable({
    id: column.id,
  })

  const combinedSetNodeRef = (element: HTMLElement | null) => {
    setNodeRef(element)
    setDroppableNodeRef(element)
  }

  const showDropIndicator = isOver || isDroppableOver

  return (
    <div 
      ref={combinedSetNodeRef}
      className={`flex-1 min-w-80 bg-gray-50 rounded-lg p-4 transition-colors duration-200 ${
        showDropIndicator ? 'bg-blue-50 border-2 border-blue-300' : ''
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">{column.title}</h3>
        <Badge variant="secondary">{column.tasks.length}</Badge>
      </div>
      
      <SortableContext items={column.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 min-h-20">
          {column.tasks.map((task) => (
            <SortableTaskCard key={task.id} task={task} onUpdate={() => {}} />
          ))}
          {/* Espaço vazio para aceitar drops */}
          {column.tasks.length === 0 && (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
              <p className="text-sm">Solte tarefas aqui</p>
            </div>
          )}
        </div>
      </SortableContext>
      
      <Button 
        variant="ghost" 
        className="w-full mt-4 text-gray-500 hover:text-gray-700 hover:bg-gray-100"
        onClick={() => onTaskCreate(column.status)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar tarefa
      </Button>
    </div>
  )
}

// Componente principal do Kanban Board
export function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false)
  const [newTaskStatus, setNewTaskStatus] = useState<Task['status']>('todo')
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as Task['priority'],
    assignee: '',
    dueDate: ''
  })
  const [activeColumn, setActiveColumn] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  )

  // Organizar tarefas por coluna
  const columns: Column[] = [
    {
      id: 'todo',
      title: 'A Fazer',
      status: 'todo',
      tasks: tasks.filter(task => task.status === 'todo')
    },
    {
      id: 'in-progress',
      title: 'Em Progresso',
      status: 'in-progress',
      tasks: tasks.filter(task => task.status === 'in-progress')
    },
    {
      id: 'done',
      title: 'Concluído',
      status: 'done',
      tasks: tasks.filter(task => task.status === 'done')
    }
  ]

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    const task = tasks.find(t => t.id === active.id)
    if (task) {
      setActiveTask(task)
    }
  }

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event
    
    if (over) {
      const columnId = over.id.toString()
      setActiveColumn(columnId)
    } else {
      setActiveColumn(null)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)
    setActiveColumn(null)

    if (!over) {
      return
    }

    const taskId = active.id.toString()
    const overId = over.id.toString()

    // Encontrar a coluna de destino
    const targetColumn = columns.find(col => col.id === overId)
    if (targetColumn) {
      // Mover a tarefa para a nova coluna
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === taskId
            ? { ...task, status: targetColumn.status }
            : task
        )
      )
      return
    }

    // Se não for uma coluna, verificar se é uma tarefa e encontrar a coluna correspondente
    const overTask = tasks.find(t => t.id === overId)
    if (overTask) {
      const targetColumnForTask = columns.find(col => 
        col.status === overTask.status
      )
      
      if (targetColumnForTask) {
        // Mover a tarefa para a coluna da tarefa sobre a qual foi solta
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.id === taskId
              ? { ...task, status: targetColumnForTask.status }
              : task
          )
        )
      }
    }
  }

  const handleCreateTask = () => {
    if (newTask.title.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask.title,
        description: newTask.description,
        status: newTaskStatus,
        priority: newTask.priority,
        assignee: newTask.assignee ? {
          id: 'temp',
          name: newTask.assignee
        } : undefined,
        dueDate: newTask.dueDate || undefined,
        comments: 0,
        attachments: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      setTasks([...tasks, task])
      setNewTask({ title: '', description: '', priority: 'medium', assignee: '', dueDate: '' })
      setIsCreateTaskOpen(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quadro Kanban</h2>
          <p className="text-gray-600 mt-1">Arraste e solte as tarefas para atualizar o status</p>
        </div>
        <Dialog open={isCreateTaskOpen} onOpenChange={setIsCreateTaskOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Tarefa
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Nova Tarefa</DialogTitle>
              <DialogDescription>
                Preencha os detalhes da nova tarefa
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="taskTitle">Título</Label>
                <Input
                  id="taskTitle"
                  value={newTask.title}
                  onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Título da tarefa"
                />
              </div>
              <div>
                <Label htmlFor="taskDescription">Descrição</Label>
                <Textarea
                  id="taskDescription"
                  value={newTask.description}
                  onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição da tarefa"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="taskPriority">Prioridade</Label>
                  <Select value={newTask.priority} onValueChange={(value) => setNewTask(prev => ({ ...prev, priority: value as Task['priority'] }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Baixa</SelectItem>
                      <SelectItem value="medium">Média</SelectItem>
                      <SelectItem value="high">Alta</SelectItem>
                      <SelectItem value="urgent">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="taskAssignee">Responsável</Label>
                  <Input
                    id="taskAssignee"
                    value={newTask.assignee}
                    onChange={(e) => setNewTask(prev => ({ ...prev, assignee: e.target.value }))}
                    placeholder="Nome do responsável"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="taskDueDate">Data de Vencimento</Label>
                <Input
                  id="taskDueDate"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateTaskOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateTask}>
                Criar Tarefa
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-6 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              onTaskCreate={(status) => {
                setNewTaskStatus(status)
                setIsCreateTaskOpen(true)
              }}
              isOver={activeColumn === column.id}
              setNodeRef={() => {}}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask && (
            <Card className="shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  {activeTask.title}
                </CardTitle>
                <p className="text-xs text-gray-600">
                  {activeTask.description}
                </p>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className={
                      activeTask.priority === 'urgent' ? 'bg-red-100 text-red-800 border-red-200' :
                      activeTask.priority === 'high' ? 'bg-orange-100 text-orange-800 border-orange-200' :
                      activeTask.priority === 'medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                      'bg-green-100 text-green-800 border-green-200'
                    }>
                      {activeTask.priority === 'urgent' ? 'Urgente' : 
                       activeTask.priority === 'high' ? 'Alta' : 
                       activeTask.priority === 'medium' ? 'Média' : 'Baixa'}
                    </Badge>
                    {activeTask.dueDate && (
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(activeTask.dueDate).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit'
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}