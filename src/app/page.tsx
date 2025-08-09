'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Users, 
  Building2, 
  CheckSquare, 
  Settings, 
  Search, 
  Plus,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Tag,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Activity,
  AlertTriangle
} from 'lucide-react'

export default function CRM() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock user context - simulating a logged-in user belonging to "Filial São Paulo" group
  const mockUserContext = {
    userId: 'user-1',
    userGroupId: '2', // Filial São Paulo
    userName: 'Ana Costa',
    accessibleGroupIds: ['1', '2', '3'] // Can see Empresa Matriz and all its children
  }

  // Mock data for demonstration with group associations
  const allCustomers = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@email.com',
      company: 'Tech Solutions Ltda',
      status: 'CUSTOMER',
      groupId: '2', // Filial São Paulo
      groupName: 'Filial São Paulo',
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      company: 'Consultoria RH',
      status: 'LEAD',
      groupId: '2', // Filial São Paulo
      groupName: 'Filial São Paulo',
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: '3',
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@email.com',
      company: 'Comércio Eletrônico',
      status: 'PROSPECT',
      groupId: '3', // Filial Rio de Janeiro
      groupName: 'Filial Rio de Janeiro',
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: '4',
      name: 'Ana Costa',
      email: 'ana.costa@email.com',
      company: 'Marketing Digital',
      status: 'CUSTOMER',
      groupId: '1', // Empresa Matriz
      groupName: 'Empresa Matriz',
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: '5',
      name: 'Carlos Souza',
      email: 'carlos.souza@email.com',
      company: 'Software House',
      status: 'LEAD',
      groupId: '4', // Parceiros
      groupName: 'Parceiros',
      avatar: '/placeholder-avatar.jpg'
    }
  ]

  const allTasks = [
    {
      id: '1',
      title: 'Reunião com cliente',
      priority: 'HIGH',
      status: 'PENDING',
      dueDate: '2024-01-15',
      assignee: 'João Silva',
      groupId: '2', // Filial São Paulo
      groupName: 'Filial São Paulo'
    },
    {
      id: '2',
      title: 'Follow-up lead',
      priority: 'MEDIUM',
      status: 'IN_PROGRESS',
      dueDate: '2024-01-12',
      assignee: 'Ana Costa',
      groupId: '2', // Filial São Paulo
      groupName: 'Filial São Paulo'
    },
    {
      id: '3',
      title: 'Atualizar cadastro',
      priority: 'LOW',
      status: 'COMPLETED',
      dueDate: '2024-01-10',
      assignee: 'Carlos Souza',
      groupId: '3', // Filial Rio de Janeiro
      groupName: 'Filial Rio de Janeiro'
    },
    {
      id: '4',
      title: 'Negociação contrato',
      priority: 'URGENT',
      status: 'PENDING',
      dueDate: '2024-01-16',
      assignee: 'Maria Santos',
      groupId: '1', // Empresa Matriz
      groupName: 'Empresa Matriz'
    }
  ]

  // Filter data based on user's group access
  const accessibleCustomers = allCustomers.filter(customer => 
    !customer.groupId || mockUserContext.accessibleGroupIds.includes(customer.groupId)
  )
  
  const accessibleTasks = allTasks.filter(task => 
    !task.groupId || mockUserContext.accessibleGroupIds.includes(task.groupId)
  )

  // Get recent items (limited to accessible data)
  const recentCustomers = accessibleCustomers.slice(0, 3)
  const recentTasks = accessibleTasks.slice(0, 3)

  // Calculate statistics based on accessible data
  const totalCustomers = accessibleCustomers.length
  const newLeads = accessibleCustomers.filter(c => c.status === 'LEAD').length
  const activeTasks = accessibleTasks.filter(t => t.status !== 'COMPLETED' && t.status !== 'CANCELLED').length
  const urgentTasks = accessibleTasks.filter(t => t.priority === 'URGENT' || t.priority === 'HIGH').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LEAD': return 'bg-gray-100 text-gray-800'
      case 'PROSPECT': return 'bg-blue-100 text-blue-800'
      case 'CUSTOMER': return 'bg-green-100 text-green-800'
      case 'INACTIVE': return 'bg-red-100 text-red-800'
      case 'LOST': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'LOW': return 'bg-green-100 text-green-800'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800'
      case 'HIGH': return 'bg-orange-100 text-orange-800'
      case 'URGENT': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
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

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-600 mt-2">Bem-vindo ao seu CRM - Acompanhe o desempenho do seu negócio</p>
              <div className="mt-2">
                <Badge variant="outline" className="text-xs">
                  Visualizando dados do grupo: Filial São Paulo e hierarquia
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+12%</span>
                <span>desde o último mês</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Visível para seu grupo</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novos Leads</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{newLeads}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+8%</span>
                <span>desde o último mês</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Visível para seu grupo</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarefas Ativas</CardTitle>
              <CheckSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTasks}</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <AlertTriangle className="h-3 w-3 text-orange-600" />
                <span className="text-orange-600">{urgentTasks} urgentes</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Visível para seu grupo</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita do Mês</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 125K</div>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="text-green-600">+24%</span>
                <span>vs mês anterior</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Visível para seu grupo</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recent Customers */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Clientes Recentes</CardTitle>
                  <CardDescription>Últimos clientes adicionados</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Ver Todos
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCustomers.map((customer) => (
                  <div key={customer.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={customer.avatar} />
                        <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4 className="font-medium">{customer.name}</h4>
                        <p className="text-sm text-gray-600">{customer.company}</p>
                        {customer.groupName && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {customer.groupName}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Badge className={getStatusColor(customer.status)}>
                      {customer.status}
                    </Badge>
                  </div>
                ))}
              </div>
              {accessibleCustomers.length > recentCustomers.length && (
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm">
                    Ver todos os {accessibleCustomers.length} clientes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Tasks */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Tarefas Recentes</CardTitle>
                  <CardDescription>Últimas tarefas atualizadas</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  Ver Todas
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium">{task.title}</h4>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Calendar className="h-3 w-3" />
                          <span>{task.dueDate}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-gray-600">
                          <Users className="h-3 w-3" />
                          <span>{task.assignee}</span>
                        </div>
                        {task.groupName && (
                          <Badge variant="outline" className="text-xs">
                            {task.groupName}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                      <Badge className={getTaskStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              {accessibleTasks.length > recentTasks.length && (
                <div className="mt-4 text-center">
                  <Button variant="outline" size="sm">
                    Ver todas as {accessibleTasks.length} tarefas
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Acessar rapidamente as funcionalidades principais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <Plus className="h-6 w-6" />
                <span>Novo Cliente</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <CheckSquare className="h-6 w-6" />
                <span>Nova Tarefa</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <Users className="h-6 w-6" />
                <span>Adicionar Colaborador</span>
              </Button>
              <Button className="h-20 flex-col space-y-2" variant="outline">
                <Activity className="h-6 w-6" />
                <span>Ver Relatórios</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}