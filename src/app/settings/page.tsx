'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { 
  Settings, 
  Database, 
  Bell, 
  Shield, 
  Palette,
  Users,
  UserPlus,
  Mail,
  Phone,
  Building2,
  Search,
  Plus,
  Edit,
  Trash2,
  Network,
  TreePine,
  Users2
} from 'lucide-react'

// Mock data para colaboradores
const mockCollaborators = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@crm.com',
    phone: '(11) 99999-9999',
    role: 'Gerente de Vendas',
    department: 'Vendas',
    groupId: '1',
    groupName: 'Administradores',
    status: 'ACTIVE',
    avatar: '/placeholder-avatar.jpg',
    joinDate: '2022-01-15'
  },
  {
    id: '2',
    name: 'Ana Costa',
    email: 'ana.costa@crm.com',
    phone: '(11) 98888-8888',
    role: 'Vendedora Sênior',
    department: 'Vendas',
    groupId: '3',
    groupName: 'Vendedores',
    status: 'ACTIVE',
    avatar: '/placeholder-avatar.jpg',
    joinDate: '2021-08-20'
  },
  {
    id: '3',
    name: 'Carlos Souza',
    email: 'carlos.souza@crm.com',
    phone: '(11) 97777-7777',
    role: 'Analista de CRM',
    department: 'TI',
    groupId: '2',
    groupName: 'Gerentes',
    status: 'ACTIVE',
    avatar: '/placeholder-avatar.jpg',
    joinDate: '2023-03-10'
  }
]

// Mock data para grupos de permissões
const mockGroups = [
  {
    id: '1',
    name: 'Administradores',
    description: 'Acesso total ao sistema'
  },
  {
    id: '2',
    name: 'Gerentes',
    description: 'Acesso a gestão de clientes e relatórios'
  },
  {
    id: '3',
    name: 'Vendedores',
    description: 'Acesso a clientes e tarefas'
  }
]

// Mock data para grupos hierárquicos
const mockHierarchicalGroups = [
  {
    id: '1',
    name: 'Empresa Matriz',
    description: 'Grupo principal da empresa',
    parentId: null,
    isActive: true,
    userCount: 5,
    customerCount: 150,
    children: [
      {
        id: '2',
        name: 'Filial São Paulo',
        description: 'Grupo da filial de São Paulo',
        parentId: '1',
        isActive: true,
        userCount: 8,
        customerCount: 89,
        children: []
      },
      {
        id: '3',
        name: 'Filial Rio de Janeiro',
        description: 'Grupo da filial do Rio de Janeiro',
        parentId: '1',
        isActive: true,
        userCount: 6,
        customerCount: 67,
        children: []
      }
    ]
  },
  {
    id: '4',
    name: 'Parceiros',
    description: 'Grupo de parceiros independentes',
    parentId: null,
    isActive: true,
    userCount: 12,
    customerCount: 45,
    children: []
  }
]

export default function SettingsPage() {
  const router = useRouter()
  const [collaborators, setCollaborators] = useState(mockCollaborators)
  const [groups, setGroups] = useState(mockGroups)
  const [hierarchicalGroups, setHierarchicalGroups] = useState(mockHierarchicalGroups)
  const [searchQuery, setSearchQuery] = useState('')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800'
      case 'INACTIVE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'Ativo'
      case 'INACTIVE': return 'Inativo'
      default: return status
    }
  }

  const filteredCollaborators = collaborators.filter(collaborator =>
    collaborator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collaborator.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collaborator.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
    collaborator.department.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600 mt-2">Gerencie as configurações do sistema</p>
        </div>

        <Tabs defaultValue="general" className="space-y-4">
          <TabsList>
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="collaborators">Colaboradores</TabsTrigger>
            <TabsTrigger value="permissions">Permissões</TabsTrigger>
            <TabsTrigger value="groups">Grupos</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="appearance">Aparência</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Configurações Gerais</span>
                </CardTitle>
                <CardDescription>
                  Configure as opções básicas do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Nome da Empresa</Label>
                    <Input id="companyName" defaultValue="Sua Empresa" />
                  </div>
                  <div>
                    <Label htmlFor="timezone">Fuso Horário</Label>
                    <Input id="timezone" defaultValue="America/Sao_Paulo" />
                  </div>
                  <div>
                    <Label htmlFor="language">Idioma</Label>
                    <Input id="language" defaultValue="Português (Brasil)" />
                  </div>
                  <div>
                    <Label htmlFor="currency">Moeda</Label>
                    <Input id="currency" defaultValue="BRL - Real Brasileiro" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="collaborators" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Colaboradores</h2>
                <p className="text-gray-600">Gerencie os colaboradores e seus grupos de permissões</p>
              </div>
              <Button onClick={() => router.push('/settings/create-user')}>
                <UserPlus className="h-4 w-4 mr-2" />
                Novo Colaborador
              </Button>
            </div>

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar colaboradores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Colaboradores</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{collaborators.length}</div>
                  <p className="text-xs text-muted-foreground">Ativos no sistema</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Grupos</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{groups.length}</div>
                  <p className="text-xs text-muted-foreground">Grupos de permissões</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Ativos</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{collaborators.filter(c => c.status === 'ACTIVE').length}</div>
                  <p className="text-xs text-muted-foreground">Colaboradores ativos</p>
                </CardContent>
              </Card>
            </div>

            {/* Collaborators Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCollaborators.map((collaborator) => (
                <Card key={collaborator.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={collaborator.avatar} />
                        <AvatarFallback className="text-lg">
                          {collaborator.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{collaborator.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{collaborator.role}</p>
                        <div className="flex items-center space-x-2 mb-3">
                          <Badge className={getStatusColor(collaborator.status)}>
                            {getStatusText(collaborator.status)}
                          </Badge>
                          <Badge variant="outline">{collaborator.department}</Badge>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <Mail className="h-3 w-3" />
                            <span className="truncate">{collaborator.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Phone className="h-3 w-3" />
                            <span>{collaborator.phone}</span>
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-600">Grupo</span>
                            <Badge variant="secondary">{collaborator.groupName}</Badge>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>Admissão</span>
                            <span>{collaborator.joinDate}</span>
                          </div>
                        </div>

                        <div className="mt-4 flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-3 w-3 mr-1" />
                            Editar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredCollaborators.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum colaborador encontrado</h3>
                <p className="text-gray-600">Tente ajustar sua busca ou adicione um novo colaborador</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Permissões</h2>
                <p className="text-gray-600">Gerencie grupos de permissões e usuários do sistema</p>
              </div>
              <Button onClick={() => router.push('/settings/create-group')}>
                <Shield className="h-4 w-4 mr-2" />
                Novo Grupo
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Grupos</CardTitle>
                  <Shield className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{groups.length}</div>
                  <p className="text-xs text-muted-foreground">Grupos de permissões</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Usuários</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{collaborators.length}</div>
                  <p className="text-xs text-muted-foreground">Usuários no sistema</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Permissões Ativas</CardTitle>
                  <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">Tipos de permissões</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{collaborators.filter(c => c.status === 'ACTIVE').length}</div>
                  <p className="text-xs text-muted-foreground">87.5% do total</p>
                </CardContent>
              </Card>
            </div>

            {/* Permission Groups Grid */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Grupos de Permissões</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groups.map((group) => (
                  <Card key={group.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardDescription>{group.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Usuários</span>
                          <Badge variant="secondary">
                            {collaborators.filter(c => c.groupId === group.id).length}
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">Status</span>
                          <Badge variant="outline">Ativo</Badge>
                        </div>
                        <div className="pt-2">
                          <p className="text-sm font-medium text-gray-700 mb-2">Ações:</p>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="h-3 w-3 mr-1" />
                              Editar
                            </Button>
                            <Button variant="outline" size="sm">
                              <Shield className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Recent Users */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Usuários Recentes</h3>
              <Card>
                <CardContent className="p-0">
                  <div className="space-y-0">
                    {collaborators.slice(0, 5).map((collaborator) => (
                      <div key={collaborator.id} className="flex items-center justify-between p-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={collaborator.avatar} />
                            <AvatarFallback>
                              {collaborator.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{collaborator.name}</p>
                            <p className="text-sm text-gray-600">{collaborator.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary">{collaborator.groupName}</Badge>
                          <Badge className={getStatusColor(collaborator.status)}>
                            {getStatusText(collaborator.status)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="groups" className="space-y-4">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-2xl font-bold">Grupos Hierárquicos</h2>
                <p className="text-gray-600">Gerencie grupos hierárquicos para controle de acesso a dados</p>
              </div>
              <Button onClick={() => router.push('/settings/create-group')}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Grupo
              </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Grupos</CardTitle>
                  <Network className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {hierarchicalGroups.reduce((total, group) => total + 1 + group.children.length, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Grupos hierárquicos</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuários</CardTitle>
                  <Users2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {hierarchicalGroups.reduce((total, group) => total + group.userCount + group.children.reduce((childTotal, child) => childTotal + child.userCount, 0), 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Usuários nos grupos</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Clientes</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {hierarchicalGroups.reduce((total, group) => total + group.customerCount + group.children.reduce((childTotal, child) => childTotal + child.customerCount, 0), 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">Clientes nos grupos</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Grupos Raiz</CardTitle>
                  <TreePine className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{hierarchicalGroups.length}</div>
                  <p className="text-xs text-muted-foreground">Grupos principais</p>
                </CardContent>
              </Card>
            </div>

            {/* Groups Hierarchy */}
            <div className="space-y-6">
              {hierarchicalGroups.map((group) => (
                <div key={group.id} className="space-y-4">
                  {/* Parent Group */}
                  <Card className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Network className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{group.name}</CardTitle>
                            <CardDescription>{group.description}</CardDescription>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline">Grupo Raiz</Badge>
                          <Badge variant={group.isActive ? "default" : "secondary"}>
                            {group.isActive ? "Ativo" : "Inativo"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Users2 className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">Usuários</span>
                          </div>
                          <span className="font-semibold">{group.userCount}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Building2 className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">Clientes</span>
                          </div>
                          <span className="font-semibold">{group.customerCount}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <TreePine className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-600">Subgrupos</span>
                          </div>
                          <span className="font-semibold">{group.children.length}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/settings/create-group?edit=${group.id}`)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/settings/create-group?parent=${group.id}`)}
                        >
                          <Plus className="h-3 w-3 mr-1" />
                          Adicionar Subgrupo
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/settings/manage-users?group=${group.id}`)}
                        >
                          <Users2 className="h-3 w-3 mr-1" />
                          Gerenciar Usuários
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Child Groups */}
                  {group.children.length > 0 && (
                    <div className="ml-8 space-y-4">
                      <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wide">Subgrupos</h4>
                      {group.children.map((child) => (
                        <Card key={child.id} className="border-l-4 border-l-green-500">
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                  <Network className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                  <CardTitle className="text-lg">{child.name}</CardTitle>
                                  <CardDescription>{child.description}</CardDescription>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge variant="outline">Subgrupo</Badge>
                                <Badge variant={child.isActive ? "default" : "secondary"}>
                                  {child.isActive ? "Ativo" : "Inativo"}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <Users2 className="h-4 w-4 text-gray-600" />
                                  <span className="text-sm text-gray-600">Usuários</span>
                                </div>
                                <span className="font-semibold">{child.userCount}</span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <Building2 className="h-4 w-4 text-gray-600" />
                                  <span className="text-sm text-gray-600">Clientes</span>
                                </div>
                                <span className="font-semibold">{child.customerCount}</span>
                              </div>
                              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                  <TreePine className="h-4 w-4 text-gray-600" />
                                  <span className="text-sm text-gray-600">Pertence a</span>
                                </div>
                                <span className="font-semibold">{group.name}</span>
                              </div>
                            </div>
                            <div className="mt-4 flex space-x-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => router.push(`/settings/create-group?edit=${child.id}`)}
                              >
                                <Edit className="h-3 w-3 mr-1" />
                                Editar
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => router.push(`/settings/manage-users?group=${child.id}`)}
                              >
                                <Users2 className="h-3 w-3 mr-1" />
                                Gerenciar Usuários
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {hierarchicalGroups.length === 0 && (
              <div className="text-center py-12">
                <Network className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum grupo encontrado</h3>
                <p className="text-gray-600">Comece criando seu primeiro grupo hierárquico</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notificações</span>
                </CardTitle>
                <CardDescription>
                  Configure as preferências de notificação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações por Email</Label>
                      <p className="text-sm text-gray-600">Receba atualizações por email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações de Tarefas</Label>
                      <p className="text-sm text-gray-600">Seja notificado sobre novas tarefas</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações de Clientes</Label>
                      <p className="text-sm text-gray-600">Seja notificado sobre atualizações de clientes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notificações do Sistema</Label>
                      <p className="text-sm text-gray-600">Receba notificações do sistema</p>
                    </div>
                    <Switch />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Segurança</span>
                </CardTitle>
                <CardDescription>
                  Configure as opções de segurança
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Autenticação de Dois Fatores</Label>
                      <p className="text-sm text-gray-600">Proteja sua conta com 2FA</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Login por Biometria</Label>
                      <p className="text-sm text-gray-600">Use biometria para login rápido</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Session Timeout</Label>
                      <p className="text-sm text-gray-600">Desconectar após inatividade</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Aparência</span>
                </CardTitle>
                <CardDescription>
                  Personalize a aparência do sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Modo Escuro</Label>
                      <p className="text-sm text-gray-600">Use o tema escuro</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Menu Compacto</Label>
                      <p className="text-sm text-gray-600">Use o menu lateral compacto</p>
                    </div>
                    <Switch />
                  </div>
                  <div>
                    <Label>Cor Primária</Label>
                    <Input id="primaryColor" defaultValue="#3B82F6" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button>Salvar Alterações</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}