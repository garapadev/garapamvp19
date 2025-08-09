'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft,
  UserPlus,
  Save,
  Users,
  Shield,
  Network,
  AlertCircle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react'

// Mock current user (this would come from authentication)
const mockCurrentUser = {
  id: '1',
  name: 'João Silva',
  email: 'joao.silva@crm.com',
  isSuperAdmin: false,
  isGroupAdmin: true,
  primaryGroupId: '1',
  accessibleGroupIds: ['1', '2', '3'] // Can manage Empresa Matriz and its subgroups
}

const mockRoles = [
  { id: '1', name: 'Administrador', description: 'Acesso total ao sistema' },
  { id: '2', name: 'Gerente', description: 'Gestão de equipe e relatórios' },
  { id: '3', name: 'Vendedor', description: 'Acesso a clientes e vendas' },
  { id: '4', name: 'Analista', description: 'Acesso analítico e suporte' }
]

export default function CreateUserPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: '',
    groupId: '',
    isGroupAdmin: false,
    isActive: true,
    department: '',
    position: '',
    notes: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [manageableGroups, setManageableGroups] = useState<any[]>([])
  
  // Fetch manageable groups
  useEffect(() => {
    const fetchManageableGroups = async () => {
      try {
        const response = await fetch('/api/users/manageable-groups')
        if (response.ok) {
          const groups = await response.json()
          setManageableGroups(groups)
        } else {
          // Fallback to mock data if API fails
          const mockGroups = [
            { id: '1', name: 'Empresa Matriz', description: 'Grupo principal da empresa', parentId: null, userCount: 5, customerCount: 150 },
            { id: '2', name: 'Filial São Paulo', description: 'Grupo da filial de São Paulo', parentId: '1', userCount: 8, customerCount: 89 },
            { id: '3', name: 'Filial Rio de Janeiro', description: 'Grupo da filial do Rio de Janeiro', parentId: '1', userCount: 6, customerCount: 67 }
          ]
          setManageableGroups(mockGroups)
        }
      } catch (error) {
        console.error('Error fetching manageable groups:', error)
        // Fallback to mock data
        const mockGroups = [
          { id: '1', name: 'Empresa Matriz', description: 'Grupo principal da empresa', parentId: null, userCount: 5, customerCount: 150 },
          { id: '2', name: 'Filial São Paulo', description: 'Grupo da filial de São Paulo', parentId: '1', userCount: 8, customerCount: 89 },
          { id: '3', name: 'Filial Rio de Janeiro', description: 'Grupo da filial do Rio de Janeiro', parentId: '1', userCount: 6, customerCount: 67 }
        ]
        setManageableGroups(mockGroups)
      } finally {
        setIsLoading(false)
      }
    }

    fetchManageableGroups()
  }, [])
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Nome de usuário é obrigatório'
    }
    
    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem'
    }
    
    if (!formData.groupId) {
      newErrors.groupId = 'Selecione um grupo para o usuário'
    }
    
    if (!formData.role) {
      newErrors.role = 'Selecione uma função para o usuário'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': mockCurrentUser.id
        },
        body: JSON.stringify({
          email: formData.email,
          username: formData.username,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          department: formData.department,
          position: formData.position,
          isGroupAdmin: formData.isGroupAdmin,
          isActive: formData.isActive,
          groupId: formData.groupId
        })
      })

      if (response.ok) {
        const newUser = await response.json()
        alert('Usuário criado com sucesso!')
        router.push('/settings?tab=collaborators')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Erro ao criar usuário.')
      }
    } catch (error) {
      console.error('Error creating user:', error)
      alert('Erro ao criar usuário. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  const getSelectedGroup = () => {
    return manageableGroups.find(group => group.id === formData.groupId)
  }
  
  const getPermissionDescription = () => {
    if (mockCurrentUser.isSuperAdmin) {
      return 'SuperAdmin - Você pode criar usuários em qualquer grupo'
    } else if (mockCurrentUser.isGroupAdmin) {
      return 'Admin de Grupo - Você pode criar usuários apenas nos grupos que gerencia'
    } else {
      return 'Sem permissão - Você não pode criar usuários'
    }
  }
  
  const canCreateUser = mockCurrentUser.isSuperAdmin || mockCurrentUser.isGroupAdmin
  
  if (isLoading) {
    return (
      <MainLayout>
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </MainLayout>
    )
  }
  
  return (
    <MainLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/settings?tab=collaborators')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Criar Novo Usuário</h1>
              <p className="text-gray-600 mt-1">
                Adicione um novo usuário ao sistema com permissões apropriadas
              </p>
            </div>
          </div>
          
          {/* Permission Info */}
          <Alert className={canCreateUser ? "border-blue-200 bg-blue-50" : "border-red-200 bg-red-50"}>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <span>{getPermissionDescription()}</span>
                <Badge variant={canCreateUser ? "default" : "destructive"}>
                  {canCreateUser ? "Permitido" : "Bloqueado"}
                </Badge>
              </div>
            </AlertDescription>
          </Alert>
        </div>
        
        {!canCreateUser ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Shield className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Permissão Negada</h3>
              <p className="text-gray-600 mb-6">
                Você não tem permissão para criar novos usuários. 
                Entre em contato com um administrador do sistema.
              </p>
              <Button onClick={() => router.push('/settings?tab=collaborators')}>
                Voltar para Configurações
              </Button>
            </CardContent>
          </Card>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Personal Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <UserPlus className="h-5 w-5" />
                      <span>Informações Pessoais</span>
                    </CardTitle>
                    <CardDescription>
                      Dados básicos do novo usuário
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nome Completo *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="João Silva"
                          className={errors.name ? 'border-red-500' : ''}
                        />
                        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          placeholder="joao.silva@empresa.com"
                          className={errors.email ? 'border-red-500' : ''}
                        />
                        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="username">Nome de Usuário *</Label>
                        <Input
                          id="username"
                          value={formData.username}
                          onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                          placeholder="joao.silva"
                          className={errors.username ? 'border-red-500' : ''}
                        />
                        {errors.username && <p className="text-sm text-red-600 mt-1">{errors.username}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="phone">Telefone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="department">Departamento</Label>
                        <Input
                          id="department"
                          value={formData.department}
                          onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                          placeholder="Vendas"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="position">Cargo</Label>
                        <Input
                          id="position"
                          value={formData.position}
                          onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                          placeholder="Gerente de Vendas"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Security Information */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Informações de Segurança</span>
                    </CardTitle>
                    <CardDescription>
                      Credenciais de acesso e permissões
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password">Senha *</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            placeholder="••••••••"
                            className={errors.password ? 'border-red-500' : ''}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="confirmPassword">Confirmar Senha *</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            placeholder="••••••••"
                            className={errors.confirmPassword ? 'border-red-500' : ''}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="role">Função *</Label>
                        <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                          <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Selecione uma função" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockRoles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                <div>
                                  <div className="font-medium">{role.name}</div>
                                  <div className="text-sm text-gray-600">{role.description}</div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.role && <p className="text-sm text-red-600 mt-1">{errors.role}</p>}
                      </div>
                      
                      <div>
                        <Label htmlFor="groupId">Grupo Hierárquico *</Label>
                        <Select value={formData.groupId} onValueChange={(value) => setFormData(prev => ({ ...prev, groupId: value }))}>
                          <SelectTrigger className={errors.groupId ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Selecione um grupo" />
                          </SelectTrigger>
                          <SelectContent>
                            {manageableGroups.map((group) => (
                              <SelectItem key={group.groupId} value={group.groupId}>
                                <div className="flex items-center space-x-2">
                                  <Network className="h-4 w-4" />
                                  <div>
                                    <div className="font-medium">{group.groupName}</div>
                                    <div className="text-sm text-gray-600">{group.userCount} usuários</div>
                                  </div>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.groupId && <p className="text-sm text-red-600 mt-1">{errors.groupId}</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isGroupAdmin"
                          checked={formData.isGroupAdmin}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isGroupAdmin: checked }))}
                        />
                        <Label htmlFor="isGroupAdmin">Administrador de Grupo</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="isActive"
                          checked={formData.isActive}
                          onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                        />
                        <Label htmlFor="isActive">Usuário Ativo</Label>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Observações</Label>
                      <Textarea
                        id="notes"
                        value={formData.notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Observações sobre o usuário..."
                        rows={3}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Sidebar */}
              <div className="space-y-6">
                {/* User Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Resumo do Usuário</CardTitle>
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
                        <span className="text-sm text-gray-600">Email</span>
                        <span className="font-medium text-sm">
                          {formData.email || 'Não definido'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Função</span>
                        <span className="font-medium text-sm">
                          {formData.role ? mockRoles.find(r => r.id === formData.role)?.name || 'Selecionada' : 'Não definida'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Grupo</span>
                        <span className="font-medium text-sm">
                          {formData.groupId ? getSelectedGroup()?.groupName || 'Selecionado' : 'Não definido'}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Admin Grupo</span>
                        <Badge variant={formData.isGroupAdmin ? "default" : "secondary"}>
                          {formData.isGroupAdmin ? 'Sim' : 'Não'}
                        </Badge>
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
                
                {/* Group Info */}
                {formData.groupId && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Network className="h-5 w-5" />
                        <span>Informações do Grupo</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {(() => {
                        const group = getSelectedGroup()
                        if (!group) return null
                        
                        return (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Nome</span>
                              <span className="font-medium text-sm">{group.groupName}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Tipo</span>
                              <Badge variant={group.isRootGroup ? "default" : "secondary"}>
                                {group.isRootGroup ? 'Grupo Raiz' : 'Subgrupo'}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Usuários</span>
                              <span className="font-medium text-sm">{group.userCount}</span>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">Clientes</span>
                              <span className="font-medium text-sm">{group.customerCount}</span>
                            </div>
                          </div>
                        )
                      })()}
                    </CardContent>
                  </Card>
                )}
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Criando Usuário...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Criar Usuário
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </MainLayout>
  )
}