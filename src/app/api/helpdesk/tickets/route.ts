import { NextRequest, NextResponse } from 'next/server'

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

// Mock storage para tickets
let tickets: Ticket[] = [
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
  }
]

// Mock departments para validação
const departments: Department[] = [
  { id: '1', name: 'TI - Suporte Técnico', description: 'Suporte técnico e infraestrutura', active: true },
  { id: '2', name: 'RH - Recursos Humanos', description: 'Gestão de pessoas e benefícios', active: true },
  { id: '3', name: 'Financeiro', description: 'Contas a pagar e receber', active: true }
]

// Função para validar se um departamento existe
function validateDepartment(departmentName: string): boolean {
  return departments.some(d => d.name === departmentName && d.active)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const department = searchParams.get('department')
    const priority = searchParams.get('priority')
    const search = searchParams.get('search')
    
    let filteredTickets = tickets
    
    // Filtrar por status
    if (status && status !== 'all') {
      filteredTickets = filteredTickets.filter(t => t.status === status)
    }
    
    // Filtrar por departamento
    if (department && department !== 'all') {
      filteredTickets = filteredTickets.filter(t => t.department === department)
    }
    
    // Filtrar por prioridade
    if (priority && priority !== 'all') {
      filteredTickets = filteredTickets.filter(t => t.priority === priority)
    }
    
    // Filtrar por busca
    if (search) {
      const searchLower = search.toLowerCase()
      filteredTickets = filteredTickets.filter(t => 
        t.title.toLowerCase().includes(searchLower) ||
        t.description.toLowerCase().includes(searchLower) ||
        t.requester.toLowerCase().includes(searchLower) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }
    
    return NextResponse.json({
      success: true,
      data: filteredTickets,
      stats: {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in_progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        closed: tickets.filter(t => t.status === 'closed').length
      }
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao buscar chamados',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, department, priority, tags } = body
    
    // Validação básica
    if (!title || !description || !department) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Título, descrição e departamento são obrigatórios' 
        },
        { status: 400 }
      )
    }
    
    // Validar departamento
    if (!validateDepartment(department)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Departamento inválido ou inativo' 
        },
        { status: 400 }
      )
    }
    
    // Criar novo ticket
    const newTicket: Ticket = {
      id: Date.now().toString(),
      title,
      description,
      status: 'open',
      priority: priority || 'medium',
      department,
      requester: 'João Silva', // Mock user - deveria vir do contexto de autenticação
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: tags || []
    }
    
    tickets.unshift(newTicket) // Adicionar no início para aparecer primeiro
    
    return NextResponse.json({
      success: true,
      data: newTicket,
      message: 'Chamado criado com sucesso'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao criar chamado',
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
          error: 'ID do chamado não fornecido' 
        },
        { status: 400 }
      )
    }
    
    const ticketIndex = tickets.findIndex(t => t.id === id)
    
    if (ticketIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Chamado não encontrado' },
        { status: 404 }
      )
    }
    
    // Validar departamento se for fornecido
    if (updateData.department && !validateDepartment(updateData.department)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Departamento inválido ou inativo' 
        },
        { status: 400 }
      )
    }
    
    // Atualizar ticket
    tickets[ticketIndex] = {
      ...tickets[ticketIndex],
      ...updateData,
      updatedAt: new Date().toISOString()
    }
    
    const updatedTicket = tickets[ticketIndex]
    
    return NextResponse.json({
      success: true,
      data: updatedTicket,
      message: 'Chamado atualizado com sucesso'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao atualizar chamado',
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
    
    const ticketIndex = tickets.findIndex(t => t.id === id)
    
    if (ticketIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Chamado não encontrado' },
        { status: 404 }
      )
    }
    
    tickets.splice(ticketIndex, 1)
    
    return NextResponse.json({
      success: true,
      message: 'Chamado excluído com sucesso'
    })
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao excluir chamado',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}