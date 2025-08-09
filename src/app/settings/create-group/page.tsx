'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Network, 
  Users2, 
  Building2, 
  TreePine,
  ArrowLeft,
  Save,
  Plus,
  X,
  UserPlus,
  UserMinus,
  Check,
  AlertCircle
} from 'lucide-react'

// Mock data for demonstration
const mockGroups = [
  { id: '1', name: 'Empresa Matriz', description: 'Grupo principal da empresa', parentId: null },
  { id: '2', name: 'Filial São Paulo', description: 'Grupo da filial de São Paulo', parentId: '1' },
  { id: '3', name: 'Filial Rio de Janeiro', description: 'Grupo da filial do Rio de Janeiro', parentId: '1' },
  { id: '4', name: 'Parceiros', description: 'Grupo de parceiros independentes', parentId: null }
]

const mockUsers = [
  { id: '1', name: 'João Silva', email: 'joao.silva@crm.com', role: 'Gerente de Vendas', avatar: '/placeholder-avatar.jpg' },
  { id: '2', name: 'Ana Costa', email: 'ana.costa@crm.com', role: 'Vendedora Sênior', avatar: '/placeholder-avatar.jpg' },
  { id: '3', name: 'Carlos Souza', email: 'carlos.souza@crm.com', role: 'Analista de CRM', avatar: '/placeholder-avatar.jpg' },
  { id: '4', name: 'Maria Santos', email: 'maria.santos@crm.com', role: 'Coordenadora de Marketing', avatar: '/placeholder-avatar.jpg' },
  { id: '5', name: 'Pedro Oliveira', email: 'pedro.oliveira@crm.com', role: 'Desenvolvedor', avatar: '/placeholder-avatar.jpg' }
]

const mockGroupUsers = [
  { groupId: '1', userId: '1' },
  { groupId: '2', userId: '2' },
  { groupId: '2', userId: '3' },
  { groupId: '3', userId: '4' },
  { groupId: '4', userId: '5' }
]

export default function CreateGroupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editGroupId = searchParams.get('edit')
  const parentGroupId = searchParams.get('parent')
  
  const [isEditing, setIsEditing] = useState(!!editGroupId)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: parentGroupId || null,
    isActive: true
  })
  
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [availableUsers, setAvailableUsers] = useState(mockUsers)
  
  // Load group data if editing
  useEffect(() => {
    if (editGroupId) {
      const group = mockGroups.find(g => g.id === editGroupId)
      if (group) {
        setFormData({
          name: group.name,
          description: group.description || '',
          parentId: group.parentId || null,
          isActive: true
        })
        
        // Load users in this group
        const usersInGroup = mockGroupUsers
          .filter(gu => gu.groupId === editGroupId)
          .map(gu => gu.userId)
        setSelectedUsers(usersInGroup)
      }
    }
  }, [editGroupId])
  
  // Filter out users already in other groups for better UX
  useEffect(() => {
    const usersInOtherGroups = mockGroupUsers
      .filter(gu => gu.groupId !== editGroupId)
      .map(gu => gu.userId)
    
    const available = mockUsers.filter(user => 
      !usersInOtherGroups.includes(user.id) || selectedUsers.includes(user.id)
    )
    setAvailableUsers(available)
  }, [selectedUsers, editGroupId])
  
  const handleAddUser = (userId: string) => {
    if (!selectedUsers.includes(userId)) {
      setSelectedUsers([...selectedUsers, userId])
    }
  }
  
  const handleRemoveUser = (userId: string) => {
    setSelectedUsers(selectedUsers.filter(id => id !== userId))
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      console.log('Saving group:', {
        ...formData,
        users: selectedUsers,
        isEditing
      })
      
      // Show success message and redirect
      alert(isEditing ? 'Grupo atualizado com sucesso!' : 'Grupo criado com sucesso!')
      router.push('/settings?tab=groups')
    } catch (error) {
      console.error('Error saving group:', error)
      alert('Erro ao salvar grupo. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const getParentGroupName = () => {
    if (!formData.parentId) return 'Grupo Raiz'
    const parent = mockGroups.find(g => g.id === formData.parentId)
    return parent?.name || 'Grupo Raiz'
  }
  
  const getSelectedUsers = () => {
    return mockUsers.filter(user => selectedUsers.includes(user.id))
  }
  
  const getAvailableUsers = () => {
    return availableUsers.filter(user => !selectedUsers.includes(user.id))
  }
  
  const canCreateGroup = formData.name.trim() !== ''
  
  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/settings?tab=groups')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold">
                {isEditing ? 'Editar Grupo' : 'Criar Novo Grupo'}
              </h1>
              <p className="text-gray-600 mt-1">
                {isEditing 
                  ? 'Atualize as informações do grupo e seus membros'
                  : parentGroupId 
                    ? 'Adicione um novo subgrupo à hierarquia'
                    : 'Crie um novo grupo hierárquico'
                }
              </p>
            </div>
          </div>
          
          {parentGroupId && (
            <Badge variant="outline" className="mb-4">
              <TreePine className="h-3 w-3 mr-1" />
              Subgrupo de: {getParentGroupName()}
            </Badge>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Group Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Network className="h-5 w-5" />
                    <span>Informações do Grupo</span>
                  </CardTitle>
                  <CardDescription>
                    Defina as informações básicas do grupo hierárquico
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="groupName">Nome do Grupo *</Label>
                    <Input
                      id="groupName"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nome do grupo"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="groupDescription">Descrição</Label>
                    <Textarea
                      id="groupDescription"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Descreva o propósito e escopo deste grupo"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="parentGroup">Grupo Pai</Label>
                    <Select 
                      value={formData.parentId || 'root'} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value === 'root' ? null : value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o grupo pai (opcional)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="root">
                          <div className="flex items-center space-x-2">
                            <TreePine className="h-4 w-4" />
                            <span>Nenhum (Grupo Raiz)</span>
                          </div>
                        </SelectItem>
                        {mockGroups
                          .filter(group => group.id !== editGroupId)
                          .map((group) => (
                            <SelectItem key={group.id} value={group.id}>
                              <div className="flex items-center space-x-2">
                                <Network className="h-4 w-4" />
                                <span>{group.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-600 mt-1">
                      {isEditing 
                        ? 'Altere o grupo pai para reorganizar a hierarquia'
                        : 'Selecione um grupo pai para criar uma hierarquia'
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>
              
              {/* User Management */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users2 className="h-5 w-5" />
                    <span>Gerenciar Usuários</span>
                  </CardTitle>
                  <CardDescription>
                    Adicione ou remova usuários deste grupo
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Available Users */}
                  <div>
                    <Label className="text-sm font-medium">Usuários Disponíveis</Label>
                    <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                      {getAvailableUsers().length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          <Users2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Todos os usuários já estão neste grupo</p>
                        </div>
                      ) : (
                        getAvailableUsers().map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{user.name}</p>
                                <p className="text-xs text-gray-600">{user.email}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleAddUser(user.id)}
                            >
                              <UserPlus className="h-3 w-3 mr-1" />
                              Adicionar
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                  
                  {/* Selected Users */}
                  <div>
                    <Label className="text-sm font-medium">Usuários no Grupo ({selectedUsers.length})</Label>
                    <div className="mt-2 space-y-2 max-h-48 overflow-y-auto">
                      {selectedUsers.length === 0 ? (
                        <div className="text-center py-4 text-gray-500">
                          <Users2 className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p>Nenhum usuário selecionado</p>
                        </div>
                      ) : (
                        getSelectedUsers().map((user) => (
                          <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-sm">{user.name}</p>
                                <p className="text-xs text-gray-600">{user.email}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveUser(user.id)}
                            >
                              <UserMinus className="h-3 w-3 mr-1" />
                              Remover
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Group Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumo do Grupo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Nome</span>
                      <span className="font-medium text-sm">
                        {formData.name || 'Não definido'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tipo</span>
                      <Badge variant={formData.parentId ? "secondary" : "default"}>
                        {formData.parentId ? 'Subgrupo' : 'Grupo Raiz'}
                      </Badge>
                    </div>
                    
                    {formData.parentId && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Grupo Pai</span>
                        <span className="font-medium text-sm">
                          {getParentGroupName()}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Usuários</span>
                      <Badge variant="outline">{selectedUsers.length}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <Badge variant={formData.isActive ? "default" : "secondary"}>
                        {formData.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Validation Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Validação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2">
                    {formData.name.trim() !== '' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-orange-600" />
                    )}
                    <span className="text-sm">
                      {formData.name.trim() !== '' 
                        ? 'Nome do grupo definido' 
                        : 'Nome do grupo é obrigatório'
                      }
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">
                      {selectedUsers.length > 0 
                        ? `${selectedUsers.length} usuário(s) selecionado(s)`
                        : 'Nenhum usuário selecionado (opcional)'
                      }
                    </span>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <Button 
                      type="submit" 
                      className="w-full" 
                      disabled={!canCreateGroup || isSubmitting}
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {isSubmitting 
                        ? 'Salvando...' 
                        : isEditing 
                          ? 'Atualizar Grupo' 
                          : 'Criar Grupo'
                      }
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    asChild
                  >
                    <a href={`/settings/manage-users?group=${editGroupId || 'new'}`}>
                      <Users2 className="h-4 w-4 mr-2" />
                      Gerenciar Usuários
                    </a>
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    asChild
                  >
                    <a href="/settings?tab=groups">
                      <Network className="h-4 w-4 mr-2" />
                      Ver Todos os Grupos
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}