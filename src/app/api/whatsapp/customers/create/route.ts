import { NextRequest, NextResponse } from 'next/server'

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  company?: string
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

// Mock database de clientes
let mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'João Silva',
    phone: '+5511999999999',
    email: 'joao.silva@email.com',
    company: 'Tech Solutions Ltda',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    name: 'Maria Santos',
    phone: '+5511888888888',
    email: 'maria.santos@email.com',
    company: 'Digital Agency',
    status: 'active',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-14T14:20:00Z'
  },
  {
    id: '3',
    name: 'Pedro Oliveira',
    phone: '+5511777777777',
    email: 'pedro.oliveira@email.com',
    company: 'Startup XYZ',
    status: 'inactive',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-10T09:15:00Z'
  }
]

// Função para normalizar número de telefone
function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 13 && cleaned.startsWith('55')) {
    return `+${cleaned}`
  }
  
  if (cleaned.length === 11) {
    return `+55${cleaned}`
  }
  
  if (cleaned.length === 12 && cleaned.startsWith('55')) {
    return `+${cleaned}`
  }
  
  return phone
}

// Função para validar email
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Função para gerar ID único
function generateId(): string {
  return Date.now().toString()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, company } = body
    
    // Validação básica
    if (!name || !phone) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Nome e telefone são obrigatórios' 
        },
        { status: 400 }
      )
    }
    
    // Validar email se fornecido
    if (email && !validateEmail(email)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Email inválido' 
        },
        { status: 400 }
      )
    }
    
    // Normalizar o número de telefone
    const normalizedPhone = normalizePhone(phone)
    
    // Verificar se o cliente já existe
    const existingCustomer = mockCustomers.find(c => {
      const normalizedCustomerPhone = normalizePhone(c.phone)
      return normalizedCustomerPhone === normalizedPhone
    })
    
    if (existingCustomer) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Já existe um cliente cadastrado com este número de telefone' 
        },
        { status: 400 }
      )
    }
    
    // Criar novo cliente
    const newCustomer: Customer = {
      id: generateId(),
      name: name.trim(),
      phone: normalizedPhone,
      email: email?.trim(),
      company: company?.trim(),
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Adicionar ao mock database
    mockCustomers.push(newCustomer)
    
    return NextResponse.json({
      success: true,
      data: newCustomer,
      message: 'Cliente criado com sucesso'
    })
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao criar cliente',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}