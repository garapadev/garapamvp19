'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { 
  Users, 
  Plus,
  Search,
  Mail,
  Phone,
  Building2,
  Filter,
  Star,
  Award
} from 'lucide-react'

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock data for demonstration
  const teamMembers = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@crm.com',
      phone: '(11) 99999-9999',
      role: 'Gerente de Vendas',
      department: 'Vendas',
      status: 'ACTIVE',
      tasksCount: 12,
      completedTasks: 8,
      avatar: '/placeholder-avatar.jpg',
      joinDate: '2022-01-15',
      performance: 95
    },
    {
      id: '2',
      name: 'Ana Costa',
      email: 'ana.costa@crm.com',
      phone: '(11) 98888-8888',
      role: 'Vendedora Sênior',
      department: 'Vendas',
      status: 'ACTIVE',
      tasksCount: 15,
      completedTasks: 12,
      avatar: '/placeholder-avatar.jpg',
      joinDate: '2021-08-20',
      performance: 88
    },
    {
      id: '3',
      name: 'Carlos Souza',
      email: 'carlos.souza@crm.com',
      phone: '(11) 97777-7777',
      role: 'Analista de CRM',
      department: 'TI',
      status: 'ACTIVE',
      tasksCount: 8,
      completedTasks: 6,
      avatar: '/placeholder-avatar.jpg',
      joinDate: '2023-03-10',
      performance: 92
    },
    {
      id: '4',
      name: 'Maria Oliveira',
      email: 'maria.oliveira@crm.com',
      phone: '(11) 96666-6666',
      role: 'Coordenadora de Marketing',
      department: 'Marketing',
      status: 'ACTIVE',
      tasksCount: 10,
      completedTasks: 7,
      avatar: '/placeholder-avatar.jpg',
      joinDate: '2022-06-05',
      performance: 85
    },
    {
      id: '5',
      name: 'Pedro Santos',
      email: 'pedro.santos@crm.com',
      phone: '(11) 95555-5555',
      role: 'Desenvolvedor',
      department: 'TI',
      status: 'INACTIVE',
      tasksCount: 6,
      completedTasks: 4,
      avatar: '/placeholder-avatar.jpg',
      joinDate: '2023-01-20',
      performance: 78
    },
    {
      id: '6',
      name: 'Lucia Ferreira',
      email: 'lucia.ferreira@crm.com',
      phone: '(11) 94444-4444',
      role: 'Assistente Administrativo',
      department: 'Administração',
      status: 'ACTIVE',
      tasksCount: 14,
      completedTasks: 13,
      avatar: '/placeholder-avatar.jpg',
      joinDate: '2020-11-12',
      performance: 98
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'INACTIVE': return 'bg-red-100 text-red-800'
      case 'VACATION': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Ativo'
      case 'INACTIVE': return 'Inativo'
      case 'VACATION': return 'Férias'
      default: return status
    }
  }

  const getPerformanceColor = (performance: number) => {
    if (performance >= 90) return 'text-green-600'
    if (performance >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const filteredTeamMembers = teamMembers.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Equipe</h1>
            <p className="text-gray-600 mt-2">Gerencie sua equipe e colaboradores</p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Colaborador
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Equipe</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 novos este mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ativos</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">21</div>
              <p className="text-xs text-muted-foreground">87.5% do total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Desempenho Médio</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89%</div>
              <p className="text-xs text-muted-foreground">+3% este mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tarefas Concluídas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">156</div>
              <p className="text-xs text-muted-foreground">Esta semana</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar colaboradores..."
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

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeamMembers.map((member) => (
            <Card key={member.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-lg">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">{member.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{member.role}</p>
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge className={getStatusColor(member.status)}>
                        {getStatusText(member.status)}
                      </Badge>
                      <Badge variant="outline">{member.department}</Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Mail className="h-3 w-3" />
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Phone className="h-3 w-3" />
                        <span>{member.phone}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Desempenho</span>
                        <span className={`text-sm font-semibold ${getPerformanceColor(member.performance)}`}>
                          {member.performance}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-sm text-gray-600">
                        <span>Tarefas: {member.completedTasks}/{member.tasksCount}</span>
                        <span>{Math.round((member.completedTasks / member.tasksCount) * 100)}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTeamMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum colaborador encontrado</h3>
            <p className="text-gray-600">Tente ajustar sua busca ou filtros</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}