'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  Save,
  X,
  ChevronDown,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Info
} from 'lucide-react'

interface Group {
  id: string
  name: string
  description?: string
  parentId?: string
  isActive: boolean
  children?: Group[]
}

interface Department {
  id: string
  name: string
  description: string
  isRecursive: boolean
  groups: string[]
  active: boolean
  createdAt: string
  updatedAt: string
}

interface DepartmentFormData {
  name: string
  description: string
  isRecursive: boolean
  groups: string[]
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [groups, setGroups] = useState<Group[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(null)
  const [formData, setFormData] = useState<DepartmentFormData>({
    name: '',
    description: '',
    isRecursive: false,
    groups: []
  })
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set())
  const [selectedGroups, setSelectedGroups] = useState<Set<string>>(new Set())
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  // Mock data para demonstração
  useEffect(() => {
    // Mock groups data
    const mockGroups: Group[] = [
      {
        id: '1',
        name: 'Diretoria',
        description: 'Nível estratégico',
        isActive: true,
        children: [
          {
            id: '2',
            name: 'TI',
            description: 'Tecnologia da Informação',
            parentId: '1',
            isActive: true,
            children: [
              {
                id: '3',
                name: 'Suporte Técnico',
                description: 'Suporte técnico e infraestrutura',
                parentId: '2',
                isActive: true
              },
              {
                id: '4',
                name: 'Desenvolvimento',
                description: 'Desenvolvimento de sistemas',
                parentId: '2',
                isActive: true
              }
            ]
          },
          {
            id: '5',
            name: 'RH',
            description: 'Recursos Humanos',
            parentId: '1',
            isActive: true,
            children: [
              {
                id: '6',
                name: 'Recrutamento',
                description: 'Processos seletivos',
                parentId: '5',
                isActive: true
              }
            ]
          }
        ]
      }
    ]
    setGroups(mockGroups)

    // Mock departments data
    const mockDepartments: Department[] = [
      {
        id: '1',
        name: 'TI - Suporte Técnico',
        description: 'Suporte técnico e infraestrutura',
        isRecursive: true,
        groups: ['2'], // TI e todos os subgrupos
        active: true,
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        name: 'RH - Recursos Humanos',
        description: 'Gestão de pessoas e benefícios',
        isRecursive: false,
        groups: ['6'], // Apenas Recrutamento
        active: true,
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-14T14:20:00Z'
      }
    ]
    setDepartments(mockDepartments)
  }, [])

  const toggleGroupExpansion = (groupId: string) => {
    const newExpanded = new Set(expandedGroups)
    if (newExpanded.has(groupId)) {
      newExpanded.delete(groupId)
    } else {
      newExpanded.add(groupId)
    }
    setExpandedGroups(newExpanded)
  }

  const handleGroupSelection = (groupId: string, isRecursive: boolean) => {
    if (isRecursive) {
      // Se for recursivo, seleciona o grupo e todos os descendentes
      const allDescendants = getAllDescendants(groupId)
      const newSelected = new Set(selectedGroups)
      newSelected.add(groupId)
      allDescendants.forEach(id => newSelected.add(id))
      setSelectedGroups(newSelected)
    } else {
      // Se não for recursivo, alterna apenas este grupo
      const newSelected = new Set(selectedGroups)
      if (newSelected.has(groupId)) {
        newSelected.delete(groupId)
      } else {
        newSelected.add(groupId)
      }
      setSelectedGroups(newSelected)
    }
  }

  const getAllDescendants = (groupId: string): string[] => {
    const descendants: string[] = []
    const group = findGroupById(groupId, groups)
    
    if (group && group.children) {
      group.children.forEach(child => {
        descendants.push(child.id)
        descendants.push(...getAllDescendants(child.id))
      })
    }
    
    return descendants
  }

  const findGroupById = (groupId: string, groupList: Group[]): Group | undefined => {
    for (const group of groupList) {
      if (group.id === groupId) {
        return group
      }
      if (group.children) {
        const found = findGroupById(groupId, group.children)
        if (found) return found
      }
    }
    return undefined
  }

  const renderGroupTree = (groupList: Group[], level = 0) => {
    return groupList.map((group) => (
      <div key={group.id} className="space-y-1">
        <div 
          className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer ${
            selectedGroups.has(group.id) ? 'bg-blue-50 border border-blue-200' : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => handleGroupSelection(group.id, formData.isRecursive)}
        >
          <div className="flex items-center space-x-2 flex-1">
            {group.children && group.children.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleGroupExpansion(group.id)
                }}
                className="p-1 hover:bg-gray-200 rounded"
              >
                {expandedGroups.has(group.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
            <input
              type="checkbox"
              checked={selectedGroups.has(group.id)}
              onChange={() => {}}
              className="rounded border-gray-300"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">{group.name}</span>
                {!group.isActive && (
                  <Badge variant="secondary" className="text-xs">Inativo</Badge>
                )}
              </div>
              {group.description && (
                <p className="text-xs text-gray-600">{group.description}</p>
              )}
            </div>
          </div>
        </div>
        
        {group.children && expandedGroups.has(group.id) && (
          <div className="ml-4">
            {renderGroupTree(group.children, level + 1)}
          </div>
        )}
      </div>
    ))
  }

  const handleSaveDepartment = async () => {
    if (!formData.name || !formData.description) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    if (formData.groups.length === 0) {
      alert('Selecione pelo menos um grupo')
      return
    }

    setSaveStatus('saving')

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const newDepartment: Department = {
        id: editingDepartment ? editingDepartment.id : Date.now().toString(),
        name: formData.name,
        description: formData.description,
        isRecursive: formData.isRecursive,
        groups: Array.from(selectedGroups),
        active: true,
        createdAt: editingDepartment ? editingDepartment.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      if (editingDepartment) {
        setDepartments(departments.map(d => d.id === editingDepartment.id ? newDepartment : d))
      } else {
        setDepartments([...departments, newDepartment])
      }

      setSaveStatus('success')
      setShowForm(false)
      setEditingDepartment(null)
      setFormData({ name: '', description: '', isRecursive: false, groups: [] })
      setSelectedGroups(new Set())

      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  const handleEditDepartment = (department: Department) => {
    setEditingDepartment(department)
    setFormData({
      name: department.name,
      description: department.description,
      isRecursive: department.isRecursive,
      groups: department.groups
    })
    setSelectedGroups(new Set(department.groups))
    setShowForm(true)
  }

  const handleDeleteDepartment = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este departamento?')) {
      setDepartments(departments.filter(d => d.id !== id))
    }
  }

  const handleToggleActive = (id: string) => {
    setDepartments(departments.map(d => 
      d.id === id ? { ...d, active: !d.active } : d
    ))
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Departamentos</h1>
            <p className="text-gray-600 mt-1">
              Gerencie os departamentos do helpdesk e suas vinculações com grupos
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Departamento
          </Button>
        </div>

        {/* Formulário de Cadastro */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  {editingDepartment ? 'Editar Departamento' : 'Novo Departamento'}
                </div>
                <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome do Departamento *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Ex: TI - Suporte Técnico"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="description">Descrição *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descreva as responsabilidades deste departamento"
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              {/* Configuração de Recursividade */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Configuração de Grupos</h3>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="recursive"
                    checked={formData.isRecursive}
                    onCheckedChange={(checked) => {
                      setFormData({...formData, isRecursive: checked})
                      if (checked) {
                        // Limpa seleção atual quando muda para recursivo
                        setSelectedGroups(new Set())
                      }
                    }}
                  />
                  <Label htmlFor="recursive">Atendimento Recursivo</Label>
                </div>
                
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {formData.isRecursive 
                      ? 'Quando recursivo, o departamento atenderá chamados de todos os subgrupos descendentes do grupo selecionado.'
                      : 'Quando não recursivo, o departamento atenderá chamados apenas dos grupos específicos selecionados.'
                    }
                  </AlertDescription>
                </Alert>
              </div>

              {/* Seleção de Grupos */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Selecionar Grupos</h3>
                <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                  {groups.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Nenhum grupo encontrado. Cadastre grupos primeiro.
                    </p>
                  ) : (
                    renderGroupTree(groups)
                  )}
                </div>
                
                {selectedGroups.size > 0 && (
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium text-blue-800">
                      {selectedGroups.size} grupo(s) selecionado(s)
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSelectedGroups(new Set())}
                    >
                      Limpar Seleção
                    </Button>
                  </div>
                )}
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  {saveStatus === 'saving' && (
                    <Badge variant="secondary">Salvando...</Badge>
                  )}
                  {saveStatus === 'success' && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Salvo com sucesso
                    </Badge>
                  )}
                  {saveStatus === 'error' && (
                    <Badge variant="destructive">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      Erro ao salvar
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveDepartment} disabled={saveStatus === 'saving'}>
                    <Save className="mr-2 h-4 w-4" />
                    {editingDepartment ? 'Atualizar' : 'Salvar'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Departamentos */}
        <div className="grid gap-4">
          {departments.map((department) => (
            <Card key={department.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{department.name}</h3>
                        <p className="text-sm text-gray-600">{department.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={department.isRecursive ? "default" : "secondary"}>
                        {department.isRecursive ? 'Recursivo' : 'Específico'}
                      </Badge>
                      <Badge variant={department.active ? "default" : "secondary"}>
                        {department.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={department.active}
                      onCheckedChange={() => handleToggleActive(department.id)}
                    />
                    <Button variant="outline" size="sm" onClick={() => handleEditDepartment(department)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteDepartment(department.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-600">
                  <p><strong>Grupos vinculados:</strong> {department.groups.length} grupo(s)</p>
                  <p><strong>Criado em:</strong> {new Date(department.createdAt).toLocaleDateString('pt-BR')}</p>
                  <p><strong>Atualizado em:</strong> {new Date(department.updatedAt).toLocaleDateString('pt-BR')}</p>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {departments.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhum departamento cadastrado
                </h3>
                <p className="text-gray-600 mb-4">
                  Cadastre seu primeiro departamento para começar a organizar o atendimento do helpdesk.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Departamento
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Informações de Ajuda */}
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Como funciona:</strong> Os departamentos são vinculados a grupos da organização. 
            Quando um departamento é marcado como recursivo, ele atende chamados de todos os subgrupos 
            descendentes. Caso contrário, o atendimento é restrito aos grupos específicos selecionados.
          </AlertDescription>
        </Alert>
      </div>
    </MainLayout>
  )
}