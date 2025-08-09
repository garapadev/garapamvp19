import { NextRequest, NextResponse } from 'next/server'

interface Task {
  id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  dueDate?: string
  contactName: string
  contactPhone: string
  createdAt: string
  updatedAt: string
}

// Mock database de tarefas
let mockTasks: Task[] = [
  {
    id: '1',
    title: 'Ligar para cliente - Follow up',
    description: 'Realizar follow up da reunião de ontem',
    priority: 'medium',
    status: 'pending',
    dueDate: '2024-01-16T18:00:00Z',
    contactName: 'João Silva',
    contactPhone: '+5511999999999',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'Enviar proposta comercial',
    description: 'Enviar proposta de serviços para a Startup XYZ',
    priority: 'high',
    status: 'in_progress',
    dueDate: '2024-01-17T12:00:00Z',
    contactName: 'Pedro Oliveira',
    contactPhone: '+5511777777777',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T09:15:00Z'
  }
]

// Função para gerar ID único
function generateId(): string {
  return Date.now().toString()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, priority, dueDate, contactName, contactPhone } = body
    
    // Validação básica
    if (!title || !contactName || !contactPhone) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Título, nome do contato e telefone são obrigatórios' 
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
    
    // Validar data de vencimento se fornecida
    if (dueDate) {
      const dueDateObj = new Date(dueDate)
      if (isNaN(dueDateObj.getTime())) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Data de vencimento inválida' 
          },
          { status: 400 }
        )
      }
    }
    
    // Criar nova tarefa
    const newTask: Task = {
      id: generateId(),
      title: title.trim(),
      description: description?.trim(),
      priority: priority || 'medium',
      status: 'pending',
      dueDate: dueDate || undefined,
      contactName: contactName.trim(),
      contactPhone: contactPhone.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    // Adicionar ao mock database
    mockTasks.push(newTask)
    
    return NextResponse.json({
      success: true,
      data: newTask,
      message: 'Tarefa criada com sucesso'
    })
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao criar tarefa',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}