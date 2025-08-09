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
const mockCustomers: Customer[] = [
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
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '')
  
  // Se começar com 55 (Brasil), formata com código do país
  if (cleaned.length === 13 && cleaned.startsWith('55')) {
    return `+${cleaned}`
  }
  
  // Se for número nacional (11 dígitos), adiciona código do Brasil
  if (cleaned.length === 11) {
    return `+55${cleaned}`
  }
  
  // Se já estiver no formato internacional
  if (cleaned.length === 12 && cleaned.startsWith('55')) {
    return `+${cleaned}`
  }
  
  // Retorna o número original se não conseguir normalizar
  return phone
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')
    
    if (!phone) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Número de telefone não fornecido' 
        },
        { status: 400 }
      )
    }
    
    // Normalizar o número de telefone para busca
    const normalizedPhone = normalizePhone(phone)
    
    // Buscar cliente pelo número de telefone
    const customer = mockCustomers.find(c => {
      const normalizedCustomerPhone = normalizePhone(c.phone)
      return normalizedCustomerPhone === normalizedPhone
    })
    
    if (customer) {
      return NextResponse.json({
        success: true,
        data: customer,
        exists: true,
        message: 'Cliente encontrado'
      })
    } else {
      return NextResponse.json({
        success: true,
        data: null,
        exists: false,
        message: 'Cliente não encontrado'
      })
    }
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao verificar cliente',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}