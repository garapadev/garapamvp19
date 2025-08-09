'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  ArrowLeft,
  Users2,
  Network,
  Search,
  UserPlus,
  UserMinus,
  Mail,
  Phone,
  Building2,
  Filter,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw
} from 'lucide-react'

// Mock data for demonstration
const mockGroups = [
  { id: '1', name: 'Empresa Matriz', description: 'Grupo principal da empresa', parentId: null },
  { id: '2', name: 'Filial São Paulo', description: 'Grupo da filial de São Paulo', parentId: '1' },
  { id: '3', name: 'Filial Rio de Janeiro', description: 'Grupo da filial do Rio de Janeiro', parentId: '1' },
  { id: '4', name: 'Parceiros', description: 'Grupo de parceiros independentes', parentId: null }
]

const mockUsers = [
  { 
    id: '1', 
    name: 'João Silva', 
    email: 'joao.silva@crm.com', 
    phone: '(11) 99999-9999',
    role: 'Gerente de Vendas',
    department: 'Vendas',
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
    status: 'ACTIVE',
    avatar: '/placeholder-avatar.jpg',
    joinDate: '2023-03-10'
  },
  { 
    id: '4', 
    name: 'Maria Santos', 
    email: 'maria.santos@crm.com', 
    phone: '(11) 96666-6666',
    role: 'Coordenadora de Marketing',
    department: 'Marketing',
    status: 'INACTIVE',
    avatar: '/placeholder-avatar.jpg',
    joinDate: '2020-05-12'
  },
  { 
    id: '5', 
    name: 'Pedro Oliveira', 
    email: 'pedro.oliveira@crm.com', 
    phone: '(11) 95555-5555',
    role: 'Desenvolvedor',
    department: 'TI',
    status: 'ACTIVE',
    avatar: '/placeholder-avatar.jpg',
    joinDate: '2023-01-08'
  }
]

const mockGroupUsers = [
  { groupId: '1', userId: '1' },
  { groupId: '2', userId: '2' },
  { groupId: '2', userId: '3' },
  { groupId: '3', userId: '4' },
  { groupId: '4', userId: '5' }
]

export default function ManageUsersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const groupId = searchParams.get('group')
  
  const [selectedGroup, setSelectedGroup] = useState(groupId || '')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  
  const [currentGroup, setCurrentGroup] = useState<any>(null)
  const [usersInGroup, setUsersInGroup] = useState<any[]>([])
  const [availableUsers, setAvailableUsers] = useState<any[]>([])
  
  // Load group data
  useEffect(() => {
    if (groupId) {
      const group = mockGroups.find(g => g.id === groupId)
      setCurrentGroup(group)
      
      const users = mockGroupUsers
        .filter(gu => gu.groupId === groupId)
        .map(gu => {
          const user = mockUsers.find(u => u.id === gu.userId)
          return user ? { ...user, inGroup: true } : null
        })
        .filter(Boolean)
      
      setUsersInGroup(users)
      setSelectedUsers(users.map(u => u.id))
    }
  }, [groupId])
  
  // Update available users
  useEffect(() => {
    if (groupId) {
      const usersNotInGroup = mockUsers
        .filter(user => !selectedUsers.includes(user.id))
        .map(user => ({ ...user, inGroup: false }))
      
      setAvailableUsers(usersNotInGroup)
    } else {
      setAvailableUsers(mockUsers.map(user => ({ ...user, inGroup: false })))
    }
  }, [selectedUsers, groupId])
  
  const filteredUsers = [...usersInGroup, ...availableUsers].filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    
    return matchesSearch && matchesStatus
  })
  
  const handleAddUsersToGroup = async () => {
    if (!groupId || selectedUsers.length === 0) return
    
    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Adding users to group:', { groupId, userIds: selectedUsers })
      
      // Update local state
      const newUsers = mockUsers
        .filter(user => selectedUsers.includes(user.id))
        .map(user => ({ ...user, inGroup: true }))
      
      setUsersInGroup([...usersInGroup, ...newUsers])
      setSelectedUsers([])
      setIsAddUserOpen(false)
      
      alert('Usuários adicionados ao grupo com sucesso!')
    } catch (error) {
      console.error('Error adding users:', error)
      alert('Erro ao adicionar usuários ao grupo.')
    } finally {
      setIsProcessing(false)
    }
  }
  
  const handleRemoveUserFromGroup = async (userId: string) => {
    if (!groupId) return
    
    setIsProcessing(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log('Removing user from group:', { groupId, userId })
      
      // Update local state
      setUsersInGroup(usersInGroup.filter(user => user.id !== userId))
      setSelectedUsers(selectedUsers.filter(id => id !== userId))
      
      alert('Usuário removido do grupo com sucesso!')
    } catch (error) {
      console.error('Error removing user:', error)
      alert('Erro ao remover usuário do grupo.')
    } finally {
      setIsProcessing(false)
    }
  }
  
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
  
  const getUserCountByStatus = (status: string) => {
    return usersInGroup.filter(user => user.status === status).length
  }
  
  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                onClick={() => router.push('/settings?tab=groups')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Gerenciar Usuários</h1>
                <p className="text-gray-600 mt-1">
                  {currentGroup 
                    ? `Gerencie os usuários do grupo: ${currentGroup.name}`
                    : 'Selecione um grupo para gerenciar seus usuários'
                  }
                </p>
              </div>
            </div>
            
            {currentGroup && (
              <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Adicionar Usuários
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Adicionar Usuários ao Grupo</DialogTitle>
                    <DialogDescription>
                      Selecione os usuários que deseja adicionar ao grupo "{currentGroup.name}"
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Buscar usuários..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                      {availableUsers.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          <Users2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                          <p>Todos os usuários já estão neste grupo</p>
                        </div>
                      ) : (
                        availableUsers.map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                  <Badge variant="outline" className="text-xs">{user.role}</Badge>
                                  <Badge className={`${getStatusColor(user.status)} text-xs`}>
                                    {getStatusText(user.status)}
                                  </Badge>
                                </div>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (!selectedUsers.includes(user.id)) {
                                  setSelectedUsers([...selectedUsers, user.id])
                                }
                              }}
                              disabled={selectedUsers.includes(user.id)}
                            >
                              {selectedUsers.includes(user.id) ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <UserPlus className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {selectedUsers.length > 0 && (
                      <div className="border-t pt-4">
                        <p className="text-sm font-medium mb-2">
                          {selectedUsers.length} usuário(s) selecionado(s):
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {selectedUsers.map((userId) => {
                            const user = mockUsers.find(u => u.id === userId)
                            return user ? (
                              <Badge key={userId} variant="secondary" className="text-xs">
                                {user.name}
                                <button
                                  type="button"
                                  onClick={() => setSelectedUsers(selectedUsers.filter(id => id !== userId))}
                                  className="ml-1 hover:text-red-600"
                                >
                                  <XCircle className="h-3 w-3" />
                                </button>
                              </Badge>
                            ) : null
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                      Cancelar
                    </Button>
                    <Button 
                      onClick={handleAddUsersToGroup}
                      disabled={selectedUsers.length === 0 || isProcessing}
                    >
                      {isProcessing ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <UserPlus className="h-4 w-4 mr-2" />
                      )}
                      Adicionar {selectedUsers.length} usuário(s)
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          {currentGroup && (
            <div className="flex items-center space-x-4 mb-6">
              <Badge variant="outline" className="text-sm">
                <Network className="h-3 w-3 mr-1" />
                {currentGroup.name}
              </Badge>
              <div className="flex space-x-4 text-sm text-gray-600">
                <span>Total: {usersInGroup.length}</span>
                <span>Ativos: {getUserCountByStatus('ACTIVE')}</span>
                <span>Inativos: {getUserCountByStatus('INACTIVE')}</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Group Selection */}
        {!groupId && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Selecione um Grupo</CardTitle>
              <CardDescription>
                Escolha um grupo hierárquico para gerenciar seus usuários
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockGroups.map((group) => (
                  <Card key={group.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <Network className="h-5 w-5 text-blue-600" />
                          <span className="font-medium">{group.name}</span>
                        </div>
                        <Badge variant={group.parentId ? "secondary" : "default"}>
                          {group.parentId ? 'Subgrupo' : 'Raiz'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">{group.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          {mockGroupUsers.filter(gu => gu.groupId === group.id).length} usuários
                        </span>
                        <Button 
                          size="sm" 
                          onClick={() => router.push(`/settings/manage-users?group=${group.id}`)}
                        >
                          Gerenciar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* User Management */}
        {groupId && currentGroup && (
          <>
            {/* Filters */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar usuários..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos os status</SelectItem>
                      <SelectItem value="ACTIVE">Ativos</SelectItem>
                      <SelectItem value="INACTIVE">Inativos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
            
            {/* Users List */}
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Users2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário encontrado</h3>
                    <p className="text-gray-600">Tente ajustar sua busca ou filtros</p>
                  </CardContent>
                </Card>
              ) : (
                filteredUsers.map((user) => (
                  <Card key={user.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">{user.name}</h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <div className="flex items-center space-x-1">
                                <Mail className="h-3 w-3" />
                                <span>{user.email}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Phone className="h-3 w-3" />
                                <span>{user.phone}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Building2 className="h-3 w-3" />
                                <span>{user.department}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2 mt-2">
                              <Badge variant="outline">{user.role}</Badge>
                              <Badge className={getStatusColor(user.status)}>
                                {getStatusText(user.status)}
                              </Badge>
                              {user.inGroup && (
                                <Badge variant="secondary">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  No grupo
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {user.inGroup ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveUserFromGroup(user.id)}
                              disabled={isProcessing}
                            >
                              <UserMinus className="h-3 w-3 mr-1" />
                              Remover
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedUsers([...selectedUsers, user.id])
                                setIsAddUserOpen(true)
                              }}
                            >
                              <UserPlus className="h-3 w-3 mr-1" />
                              Adicionar
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  )
}