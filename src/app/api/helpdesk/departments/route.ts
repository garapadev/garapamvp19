import { NextRequest, NextResponse } from 'next/server'

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

interface Group {
  id: string
  name: string
  description?: string
  parentId?: string
  isActive: boolean
  path: string
}

// Mock storage para departamentos
let departments: Department[] = [
  {
    id: '1',
    name: 'TI - Suporte Técnico',
    description: 'Suporte técnico e infraestrutura',
    isRecursive: true,
    groups: ['1', '2', '3'], // TI e todos os subgrupos
    active: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'RH - Recursos Humanos',
    description: 'Gestão de pessoas e benefícios',
    isRecursive: false,
    groups: ['4'], // Apenas Recrutamento
    active: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-14T14:20:00Z'
  }
]

// Mock storage para grupos
const groups: Group[] = [
  { id: '1', name: 'TI', isActive: true, path: 'TI' },
  { id: '2', name: 'Desenvolvimento', parentId: '1', isActive: true, path: 'TI > Desenvolvimento' },
  { id: '3', name: 'Infraestrutura', parentId: '1', isActive: true, path: 'TI > Infraestrutura' },
  { id: '4', name: 'RH', isActive: true, path: 'RH' },
  { id: '5', name: 'Recrutamento', parentId: '4', isActive: true, path: 'RH > Recrutamento' },
  { id: '6', name: 'Financeiro', isActive: true, path: 'Financeiro' },
  { id: '7', name: 'Contabilidade', parentId: '6', isActive: true, path: 'Financeiro > Contabilidade' }
]

// Função para obter todos os descendentes de um grupo
function getAllDescendants(groupId: string, groupList: Group[]): string[] {
  const descendants: string[] = []
  
  const findDescendants = (currentGroupId: string) => {
    const children = groupList.filter(g => g.parentId === currentGroupId)
    children.forEach(child => {
      descendants.push(child.id)
      findDescendants(child.id)
    })
  }
  
  findDescendants(groupId)
  return descendants
}

// Função para validar se um grupo existe
function validateGroup(groupId: string): boolean {
  return groups.some(g => g.id === groupId && g.isActive)
}

// Função para expandir grupos recursivos
function expandRecursiveGroups(department: Department): string[] {
  if (!department.isRecursive) {
    return department.groups
  }
  
  const expandedGroups = [...department.groups]
  
  department.groups.forEach(groupId => {
    const descendants = getAllDescendants(groupId, groups)
    expandedGroups.push(...descendants)
  })
  
  // Remover duplicatas
  return [...new Set(expandedGroups)]
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('activeOnly') === 'true'
    
    let filteredDepartments = departments
    
    if (activeOnly) {
      filteredDepartments = departments.filter(d => d.active)
    }
    
    // Expandir grupos para departamentos recursivos
    const departmentsWithExpandedGroups = filteredDepartments.map(dept => ({
      ...dept,
      expandedGroups: expandRecursiveGroups(dept)
    }))
    
    return NextResponse.json({
      success: true,
      data: departmentsWithExpandedGroups
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao buscar departamentos',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, isRecursive, groups } = body
    
    // Validação básica
    if (!name || !description) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Nome e descrição são obrigatórios' 
        },
        { status: 400 }
      )
    }
    
    if (!groups || groups.length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Selecione pelo menos um grupo' 
        },
        { status: 400 }
      )
    }
    
    // Validar se todos os grupos existem
    const invalidGroups = groups.filter((groupId: string) => !validateGroup(groupId))
    if (invalidGroups.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Grupos inválidos selecionados',
          invalidGroups 
        },
        { status: 400 }
      )
    }
    
    // Criar novo departamento
    const newDepartment: Department = {
      id: Date.now().toString(),
      name,
      description,
      isRecursive: isRecursive || false,
      groups,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    departments.push(newDepartment)
    
    return NextResponse.json({
      success: true,
      data: {
        ...newDepartment,
        expandedGroups: expandRecursiveGroups(newDepartment)
      },
      message: 'Departamento criado com sucesso'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao criar departamento',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    if (!id) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'ID do departamento não fornecido' 
        },
        { status: 400 }
      )
    }
    
    const departmentIndex = departments.findIndex(d => d.id === id)
    
    if (departmentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Departamento não encontrado' },
        { status: 404 }
      )
    }
    
    // Validar grupos se forem fornecidos
    if (updateData.groups && updateData.groups.length > 0) {
      const invalidGroups = updateData.groups.filter((groupId: string) => !validateGroup(groupId))
      if (invalidGroups.length > 0) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Grupos inválidos selecionados',
            invalidGroups 
          },
          { status: 400 }
        )
      }
    }
    
    // Atualizar departamento
    departments[departmentIndex] = {
      ...departments[departmentIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    const updatedDepartment = departments[departmentIndex]
    
    return NextResponse.json({
      success: true,
      data: {
        ...updatedDepartment,
        expandedGroups: expandRecursiveGroups(updatedDepartment)
      },
      message: 'Departamento atualizado com sucesso'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao atualizar departamento',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID não fornecido' },
        { status: 400 }
      )
    }
    
    const departmentIndex = departments.findIndex(d => d.id === id)
    
    if (departmentIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Departamento não encontrado' },
        { status: 404 }
      )
    }
    
    departments.splice(departmentIndex, 1)
    
    return NextResponse.json({
      success: true,
      message: 'Departamento excluído com sucesso'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao excluir departamento',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}