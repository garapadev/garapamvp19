'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KanbanBoard } from '@/components/tasks/KanbanBoard'
import { 
  CheckSquare, 
  Plus,
  Search,
  Calendar,
  Users,
  Filter,
  Clock,
  Flag,
  LayoutGrid,
  List
} from 'lucide-react'

export default function TasksPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data for demonstration
  const tasks = [
    {
      id: '1',
      title: 'Reunião com cliente',
      description: 'Apresentar proposta de serviços para a Tech Solutions',
      priority: 'HIGH',
      status: 'PENDING',
      dueDate: '2024-01-15',
      assignee: 'João Silva',
      assigneeAvatar: '/placeholder-avatar.jpg'
    },
    {
      id: '2',
      title: 'Follow-up lead',
      description: 'Entrar em contato com Maria Santos sobre a proposta',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: '2024-01-12',
      assignee: 'Ana Costa',
      assigneeAvatar: '/placeholder-avatar.jpg'
    },
    {
      id: '3',
      title: 'Atualizar cadastro',
      description: 'Atualizar informações do cliente no sistema',
      priority: 'LOW',
      status: 'COMPLETED',
      dueDate: '2024-01-10',
      assignee: 'Carlos Souza',
      assigneeAvatar: '/placeholder-avatar.jpg'
    },
    {
      id: '4',
      title: 'Preparar relatório mensal',
      description: 'Compilar dados e preparar relatório de vendas',
      priority: 'HIGH',
      status: 'IN_PROGRESS',
      dueDate: '2024-01-20',
      assignee: 'Maria Oliveira',
      assigneeAvatar: '/placeholder-avatar.jpg'
    },
    {
      id: '5',
      title: 'Treinamento de equipe',
      description: 'Realizar treinamento sobre novo sistema CRM',
      priority: 'MEDIUM',
      status: 'PENDING',
      dueDate: '2024-01-25',
      assignee: 'Pedro Santos',
      assigneeAvatar: '/placeholder-avatar.jpg'
    }
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'URGENT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'Baixa'
      case 'MEDIUM': return 'Média'
      case 'HIGH': return 'Alta'
      case 'URGENT': return 'Urgente'
      default: return priority
    }
  }

  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-gray-100 text-gray-800'
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTaskStatusText = (status: string) => {
    switch (status) {
      case 'PENDING': return 'Pendente'
      case 'IN_PROGRESS': return 'Em Progresso'
      case 'COMPLETED': return 'Concluída'
      case 'CANCELLED': return 'Cancelada'
      default: return status
    }
  }

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.assignee.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Tarefas</h1>
            <p className="text-gray-600 mt-2">Gerencie suas tarefas e atividades</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nova Tarefa
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tarefas</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">+5% desde a semana passada</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">27% do total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">57% do total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">Precisam de atenção</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different views */}
        <Tabs defaultValue="list" className="space-y-6">
          <TabsList>
            <TabsTrigger value="list" className="flex items-center space-x-2">
              <List className="h-4 w-4" />
              <span>Lista</span>
            </TabsTrigger>
            <TabsTrigger value="kanban" className="flex items-center space-x-2">
              <LayoutGrid className="h-4 w-4" />
              <span>Kanban</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-6">
            {/* Search and Filter */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar tarefas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtrar
              </Button>
            </div>

            {/* Tasks List */}
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <Card key={task.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{task.title}</h3>
                        <p className="text-sm text-gray-600 mb-4">{task.description}</p>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Data limite: {task.dueDate}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4" />
                            <div className="flex items-center space-x-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage src={task.assigneeAvatar} />
                                <AvatarFallback className="text-xs">
                                  {task.assignee.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span>{task.assignee}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <Badge className={getPriorityColor(task.priority)}>
                          {getPriorityText(task.priority)}
                        </Badge>
                        <Badge className={getTaskStatusColor(task.status)}>
                          {getTaskStatusText(task.status)}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-12">
                <CheckSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma tarefa encontrada</h3>
                <p className="text-gray-600">Tente ajustar sua busca ou filtros</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="kanban" className="space-y-6">
            <KanbanBoard />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}