import { NextRequest, NextResponse } from 'next/server'

interface Ticket {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  department: string
  contactName: string
  contactPhone: string
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

// Mock database de chamados
let mockTickets: Ticket[] = [
  {
    id: '1',
    title: 'Problema com acesso ao sistema',
    description: 'Usuário não consegue fazer login no sistema CRM',
    status: 'open',
    priority: 'high',
    department: 'TI - Suporte Técnico',
    contactName: 'João Silva',
    contactPhone: '+5511999999999',
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
    contactName: 'Maria Santos',
    contactPhone: '+5511888888888',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T10:15:00Z',
    tags: ['férias', 'solicitação']
  }
]

// Mock departments para validação
const mockDepartments: Department[] = [
  { id: '1', name: 'TI - Suporte Técnico', description: 'Suporte técnico e infraestrutura', active: true },
  { id: '2', name: 'RH - Recursos Humanos', description: 'Gestão de pessoas e benefícios', active: true },
  { id: '3', name: 'Financeiro', description: 'Contas a pagar e receber', active: true }
]

// Função para validar se um departamento existe e está ativo
function validateDepartment(departmentName: string): boolean {
  return mockDepartments.some(d => d.name === departmentName && d.active)
}

// Função para gerar ID único
function generateId(): string {
  return Date.now().toString()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, department, priority, contactName, contactPhone, tags } = body
    
    // Validação básica
    if (!title || !description || !department || !contactName || !contactPhone) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Título, descrição, departamento, nome do contato e telefone são obrigatórios' 
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
    
    // Validar prioridade
    const validPriorities = ['low', 'medium', 'high', 'urgent']
    if (priority && !validPriorities.includes(priority)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Prioridade inválida' 
        },
        { status: 400 }
      )
    }
    
    // Criar novo ticket
    const newTicket: Ticket = {
      id: generateId(),
      title: title.trim(),
      description: description.trim(),
      status: 'open',
      priority: priority || 'medium',
      department: department.trim(),
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: tags || []
    }
    
    // Adicionar ao mock database
    mockTickets.unshift(newTicket) // Adicionar no início para aparecer primeiro
    
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