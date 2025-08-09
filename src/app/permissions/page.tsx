'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Users, 
  Shield, 
  Plus, 
  Edit, 
  Trash2, 
  UserPlus,
  Settings,
  FileText,
  BarChart3,
  Bell,
  Search,
  Calendar,
  MessageSquare,
  Database
} from 'lucide-react'

// Mock data para desenvolvimento
const mockGroups = [
  {
    id: '1',
    name: 'Administradores',
    description: 'Acesso total ao sistema',
    permissions: ['users.read', 'users.write', 'users.delete', 'customers.read', 'customers.write', 'customers.delete', 'tasks.read', 'tasks.write', 'tasks.delete', 'reports.read', 'settings.read', 'settings.write'],
    userCount: 2,
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Gerentes',
    description: 'Acesso a gestão de clientes e relatórios',
    permissions: ['customers.read', 'customers.write', 'tasks.read', 'tasks.write', 'reports.read'],
    userCount: 5,
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Vendedores',
    description: 'Acesso a clientes e tarefas',
    permissions: ['customers.read', 'customers.write', 'tasks.read', 'tasks.write'],
    userCount: 12,
    createdAt: '2024-02-01'
  }
]

const mockUsers = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao.silva@empresa.com',
    role: 'Administrador',
    groupId: '1',
    groupName: 'Administradores',
    status: 'ativo',
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria.santos@empresa.com',
    role: 'Administrador',
    groupId: '1',
    groupName: 'Administradores',
    status: 'ativo',
    createdAt: '2024-01-16'
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@empresa.com',
    role: 'Gerente',
    groupId: '2',
    groupName: 'Gerentes',
    status: 'ativo',
    createdAt: '2024-01-20'
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana.costa@empresa.com',
    role: 'Vendedor',
    groupId: '3',
    groupName: 'Vendedores',
    status: 'ativo',
    createdAt: '2024-02-01'
  }
]

const availablePermissions = [
  { id: 'users.read', name: 'Visualizar Usuários', description: 'Permite visualizar a lista de usuários' },
  { id: 'users.write', name: 'Criar/Editar Usuários', description: 'Permite criar e editar usuários' },
  { id: 'users.delete', name: 'Excluir Usuários', description: 'Permite excluir usuários' },
  { id: 'customers.read', name: 'Visualizar Clientes', description: 'Permite visualizar a lista de clientes' },
  { id: 'customers.write', name: 'Criar/Editar Clientes', description: 'Permite criar e editar clientes' },
  { id: 'customers.delete', name: 'Excluir Clientes', description: 'Permite excluir clientes' },
  { id: 'tasks.read', name: 'Visualizar Tarefas', description: 'Permite visualizar a lista de tarefas' },
  { id: 'tasks.write', name: 'Criar/Editar Tarefas', description: 'Permite criar e editar tarefas' },
  { id: 'tasks.delete', name: 'Excluir Tarefas', description: 'Permite excluir tarefas' },
  { id: 'reports.read', name: 'Visualizar Relatórios', description: 'Permite visualizar relatórios' },
  { id: 'settings.read', name: 'Visualizar Configurações', description: 'Permite visualizar configurações' },
  { id: 'settings.write', name: 'Editar Configurações', description: 'Permite editar configurações' }
]

export default function PermissionsPage() {
  const [groups, setGroups] = useState(mockGroups)
  const [users, setUsers] = useState(mockUsers)
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false)
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false)
  const [newGroup, setNewGroup] = useState({ name: '', description: '', permissions: [] as string[] })
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', groupId: '' })

  const handleCreateGroup = () => {
    if (newGroup.name && newGroup.description) {
      const group = {
        id: Date.now().toString(),
        name: newGroup.name,
        description: newGroup.description,
        permissions: newGroup.permissions,
        userCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setGroups([...groups, group])
      setNewGroup({ name: '', description: '', permissions: [] })
      setIsCreateGroupOpen(false)
    }
  }

  const handleCreateUser = () => {
    if (newUser.name && newUser.email && newUser.password && newUser.groupId) {
      const group = groups.find(g => g.id === newUser.groupId)
      const user = {
        id: Date.now().toString(),
        name: newUser.name,
        email: newUser.email,
        role: group?.name || '',
        groupId: newUser.groupId,
        groupName: group?.name || '',
        status: 'ativo',
        createdAt: new Date().toISOString().split('T')[0]
      }
      setUsers([...users, user])
      setNewUser({ name: '', email: '', password: '', groupId: '' })
      setIsCreateUserOpen(false)
    }
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    if (checked) {
      setNewGroup(prev => ({
        ...prev,
        permissions: [...prev.permissions, permissionId]
      }))
    } else {
      setNewGroup(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => p !== permissionId)
      }))
    }
  }

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Permissões</h1>
            <p className="text-gray-600 mt-2">Gerencie grupos de permissões e usuários do sistema</p>
          </div>
          <div className="flex space-x-3">
            <Dialog open={isCreateGroupOpen} onOpenChange={setIsCreateGroupOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Shield className="h-4 w-4 mr-2" />
                  Novo Grupo
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Criar Novo Grupo</DialogTitle>
                  <DialogDescription>
                    Crie um novo grupo de permissões para organizar o acesso dos usuários
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="groupName">Nome do Grupo</Label>
                    <Input
                      id="groupName"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Ex: Administradores"
                    />
                  </div>
                  <div>
                    <Label htmlFor="groupDescription">Descrição</Label>
                    <Textarea
                      id="groupDescription"
                      value={newGroup.description}
                      onChange={(e) => setNewGroup(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva as permissões deste grupo"
                    />
                  </div>
                  <div>
                    <Label>Permissões</Label>
                    <div className="mt-2 space-y-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                      {availablePermissions.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-3">
                          <Checkbox
                            id={permission.id}
                            checked={newGroup.permissions.includes(permission.id)}
                            onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                          />
                          <div className="flex-1">
                            <Label htmlFor={permission.id} className="font-medium">
                              {permission.name}
                            </Label>
                            <p className="text-sm text-gray-600">{permission.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateGroupOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateGroup}>
                    Criar Grupo
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isCreateUserOpen} onOpenChange={setIsCreateUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Criar Novo Usuário</DialogTitle>
                  <DialogDescription>
                    Crie um novo usuário e atribua a um grupo de permissões
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="userName">Nome Completo</Label>
                    <Input
                      id="userName"
                      value={newUser.name}
                      onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="João Silva"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userEmail">Email</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="joao.silva@empresa.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userPassword">Senha</Label>
                    <Input
                      id="userPassword"
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                    />
                  </div>
                  <div>
                    <Label htmlFor="userGroup">Grupo de Permissões</Label>
                    <Select value={newUser.groupId} onValueChange={(value) => setNewUser(prev => ({ ...prev, groupId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um grupo" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateUserOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleCreateUser}>
                    Criar Usuário
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Tabs defaultValue="groups" className="space-y-4">
          <TabsList>
            <TabsTrigger value="groups">Grupos</TabsTrigger>
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="permissions">Permissões</TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="space-y-4">
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
                        <Badge variant="secondary">{group.userCount}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Permissões</span>
                        <Badge variant="secondary">{group.permissions.length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Criado em</span>
                        <span className="text-sm text-gray-900">{group.createdAt}</span>
                      </div>
                      <div className="pt-2">
                        <p className="text-sm font-medium text-gray-700 mb-2">Permissões principais:</p>
                        <div className="flex flex-wrap gap-1">
                          {group.permissions.slice(0, 3).map((permissionId) => {
                            const permission = availablePermissions.find(p => p.id === permissionId)
                            return permission ? (
                              <Badge key={permissionId} variant="outline" className="text-xs">
                                {permission.name}
                              </Badge>
                            ) : null
                          })}
                          {group.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{group.permissions.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Usuários do Sistema</CardTitle>
                <CardDescription>Gerencie todos os usuários e seus grupos de permissões</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar usuários..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Grupo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Criado em</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{user.groupName}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'ativo' ? 'default' : 'secondary'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.createdAt}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Permissões por Grupo</CardTitle>
                <CardDescription>Selecione um grupo para gerenciar suas permissões</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="groupSelect">Selecionar Grupo</Label>
                    <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um grupo para gerenciar permissões" />
                      </SelectTrigger>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedGroup && (
                    <div className="border rounded-lg p-4">
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold">
                          {groups.find(g => g.id === selectedGroup)?.name}
                        </h3>
                        <p className="text-gray-600">
                          {groups.find(g => g.id === selectedGroup)?.description}
                        </p>
                      </div>
                      
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {availablePermissions.map((permission) => {
                          const group = groups.find(g => g.id === selectedGroup)
                          const hasPermission = group?.permissions.includes(permission.id) || false
                          
                          return (
                            <div key={permission.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                              <Checkbox
                                id={permission.id}
                                checked={hasPermission}
                                onCheckedChange={(checked) => {
                                  // Aqui você implementaria a lógica para atualizar as permissões do grupo
                                  console.log(`Permissão ${permission.id} ${checked ? 'adicionada' : 'removida'} do grupo ${selectedGroup}`)
                                }}
                              />
                              <div className="flex-1">
                                <Label htmlFor={permission.id} className="font-medium">
                                  {permission.name}
                                </Label>
                                <p className="text-sm text-gray-600">{permission.description}</p>
                              </div>
                              <Badge variant={hasPermission ? 'default' : 'secondary'}>
                                {hasPermission ? 'Ativo' : 'Inativo'}
                              </Badge>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}