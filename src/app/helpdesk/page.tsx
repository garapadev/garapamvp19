'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Headphones, 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Circle,
  MessageSquare,
  User,
  Calendar,
  ArrowRight,
  Settings,
  Users
} from 'lucide-react'

interface Ticket {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  department: string
  requester: string
  assignee?: string
  createdAt: string
  updatedAt: string
  tags: string[]
}

interface Department {
  id: string
  name: string
  description: string
  active: boolean
}

export default function HelpdeskPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

  // Mock data
  useEffect(() => {
    // Mock departments
    const mockDepartments: Department[] = [
      { id: '1', name: 'TI - Suporte Técnico', description: 'Suporte técnico e infraestrutura', active: true },
      { id: '2', name: 'RH - Recursos Humanos', description: 'Gestão de pessoas e benefícios', active: true },
      { id: '3', name: 'Financeiro', description: 'Contas a pagar e receber', active: true }
    ]
    setDepartments(mockDepartments)

    // Mock tickets
    const mockTickets: Ticket[] = [
      {
        id: '1',
        title: 'Problema com acesso ao sistema',
        description: 'Usuário não consegue fazer login no sistema CRM',
        status: 'open',
        priority: 'high',
        department: 'TI - Suporte Técnico',
        requester: 'João Silva',
        assignee: 'Carlos Alberto',
        createdAt: '2024-01-15T09:30:00Z',
        updatedAt: '2024-01-15T09:30:00Z',
        tags: ['login', 'acesso']
      },
      {
        id: '2',
        title: 'Solicitação de férias',
        description: 'Gostaria de solicitar férias para o mês de fevereiro',
        status: 'in_progress',
        priority: 'medium',
        department: 'RH - Recursos Humanos',
        requester: 'Maria Santos',
        assignee: 'Ana Paula',
        createdAt: '2024-01-14T14:20:00Z',
        updatedAt: '2024-01-15T10:15:00Z',
        tags: ['férias', 'solicitação']
      },
      {
        id: '3',
        title: 'Erro na emissão de nota fiscal',
        description: 'Sistema não está gerando nota fiscal para venda #1234',
        status: 'resolved',
        priority: 'urgent',
        department: 'TI - Suporte Técnico',
        requester: 'Pedro Oliveira',
        assignee: 'Carlos Alberto',
        createdAt: '2024-01-13T16:45:00Z',
        updatedAt: '2024-01-15T11:30:00Z',
        tags: ['nota fiscal', 'erro']
      },
      {
        id: '4',
        title: 'Dúvida sobre benefícios',
        description: 'Gostaria de mais informações sobre o plano de saúde',
        status: 'open',
        priority: 'low',
        department: 'RH - Recursos Humanos',
        requester: 'Lucia Ferreira',
        createdAt: '2024-01-15T08:15:00Z',
        updatedAt: '2024-01-15T08:15:00Z',
        tags: ['benefícios', 'plano de saúde']
      }
    ]
    setTickets(mockTickets)
  }, [])

  const getStatusIcon = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return <Circle className="h-4 w-4 text-gray-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusText = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'Aberto'
      case 'in_progress':
        return 'Em Andamento'
      case 'resolved':
        return 'Resolvido'
      case 'closed':
        return 'Fechado'
    }
  }

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'urgent':
        return 'bg-red-100 text-red-800'
    }
  }

  const getPriorityText = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'low':
        return 'Baixa'
      case 'medium':
        return 'Média'
      case 'high':
        return 'Alta'
      case 'urgent':
        return 'Urgente'
    }
  }

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ticket.requester.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter
    const matchesDepartment = departmentFilter === 'all' || ticket.department === departmentFilter
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesDepartment && matchesPriority
  })

  const stats = {
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inProgress: tickets.filter(t => t.status === 'in_progress').length,
    resolved: tickets.filter(t => t.status === 'resolved').length
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Helpdesk</h1>
            <p className="text-gray-600 mt-1">
              Sistema de gestão de chamados e suporte
            </p>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => window.location.href = '/helpdesk/departments'}>
              <Settings className="mr-2 h-4 w-4" />
              Departamentos
            </Button>
            <Button onClick={() => window.location.href = '/helpdesk/tickets/new'}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Chamado
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Chamados</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Abertos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.open}</p>
                </div>
                <Circle className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Em Andamento</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Resolvidos</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar chamados..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="open">Abertos</SelectItem>
                  <SelectItem value="in_progress">Em Andamento</SelectItem>
                  <SelectItem value="resolved">Resolvidos</SelectItem>
                  <SelectItem value="closed">Fechados</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Departamentos</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept.id} value={dept.name}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Prioridade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas Prioridades</SelectItem>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Tickets List */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">Todos ({filteredTickets.length})</TabsTrigger>
            <TabsTrigger value="open">Abertos ({filteredTickets.filter(t => t.status === 'open').length})</TabsTrigger>
            <TabsTrigger value="in_progress">Em Andamento ({filteredTickets.filter(t => t.status === 'in_progress').length})</TabsTrigger>
            <TabsTrigger value="resolved">Resolvidos ({filteredTickets.filter(t => t.status === 'resolved').length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {filteredTickets.map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(ticket.status)}
                          <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {getPriorityText(ticket.priority)}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{ticket.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{ticket.requester}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{ticket.department}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-3">
                          {ticket.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {getStatusText(ticket.status)}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredTickets.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Nenhum chamado encontrado</h3>
                    <p className="text-gray-600 mb-4">Tente ajustar seus filtros ou crie um novo chamado.</p>
                    <Button onClick={() => window.location.href = '/helpdesk/tickets/new'}>
                      <Plus className="mr-2 h-4 w-4" />
                      Criar Chamado
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="open">
            <div className="space-y-4">
              {filteredTickets.filter(t => t.status === 'open').map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(ticket.status)}
                          <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {getPriorityText(ticket.priority)}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{ticket.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{ticket.requester}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{ticket.department}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-3">
                          {ticket.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {getStatusText(ticket.status)}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="in_progress">
            <div className="space-y-4">
              {filteredTickets.filter(t => t.status === 'in_progress').map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(ticket.status)}
                          <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {getPriorityText(ticket.priority)}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{ticket.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{ticket.requester}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{ticket.department}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-3">
                          {ticket.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {getStatusText(ticket.status)}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="resolved">
            <div className="space-y-4">
              {filteredTickets.filter(t => t.status === 'resolved').map((ticket) => (
                <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          {getStatusIcon(ticket.status)}
                          <h3 className="text-lg font-semibold text-gray-900">{ticket.title}</h3>
                          <Badge className={getPriorityColor(ticket.priority)}>
                            {getPriorityText(ticket.priority)}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{ticket.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{ticket.requester}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{ticket.department}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-3">
                          {ticket.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">
                          {getStatusText(ticket.status)}
                        </Badge>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}