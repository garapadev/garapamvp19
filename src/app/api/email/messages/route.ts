import { NextRequest, NextResponse } from 'next/server'

interface EmailMessage {
  id: string
  messageId: string
  from: string
  fromName: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  body: string
  bodyType: 'plain' | 'html'
  date: string
  size: number
  flags: {
    seen: boolean
    answered: boolean
    flagged: boolean
    deleted: boolean
    draft: boolean
  }
  attachments: EmailAttachment[]
  folder: string
  uid: number
}

interface EmailAttachment {
  id: string
  filename: string
  contentType: string
  size: number
  cid?: string
}

interface EmailConfig {
  id: string
  imapServer: string
  imapPort: number
  imapSecurity: 'none' | 'ssl' | 'tls'
  username: string
  password: string
}

// Mock storage para configurações de email
const emailConfigs: EmailConfig[] = [
  {
    id: '1',
    imapServer: 'imap.empresa.com',
    imapPort: 993,
    imapSecurity: 'ssl',
    username: 'joao.silva@empresa.com',
    password: 'password123'
  }
]

// Mock storage para mensagens
const mockMessages: EmailMessage[] = [
  {
    id: '1',
    messageId: '<msg1@empresa.com>',
    from: 'joao.silva@empresa.com',
    fromName: 'João Silva',
    to: ['maria.santos@empresa.com'],
    subject: 'Reunião de projeto',
    body: 'Olá Maria,\n\nGostaria de agendar uma reunião para discutir o novo projeto. Podemos marcar para próxima semana?\n\nAguardo seu retorno.\n\nAtenciosamente,\nJoão',
    bodyType: 'plain',
    date: '2024-01-15T10:30:00Z',
    size: 512,
    flags: {
      seen: false,
      answered: false,
      flagged: true,
      deleted: false,
      draft: false
    },
    attachments: [],
    folder: 'INBOX',
    uid: 1
  },
  {
    id: '2',
    messageId: '<msg2@empresa.com>',
    from: 'maria.santos@empresa.com',
    fromName: 'Maria Santos',
    to: ['joao.silva@empresa.com'],
    cc: ['pedro.oliveira@empresa.com'],
    subject: 'Atualização do relatório',
    body: '<p>Olá João,</p><p>Envio o relatório atualizado com as últimas métricas do trimestre.</p><p>O crescimento foi de <strong>15%</strong> comparado ao trimestre anterior.</p><p>Qualquer dúvida, estou à disposição.</p><p>Atenciosamente,<br>Maria</p>',
    bodyType: 'html',
    date: '2024-01-15T09:15:00Z',
    size: 1024,
    flags: {
      seen: true,
      answered: false,
      flagged: false,
      deleted: false,
      draft: false
    },
    attachments: [
      {
        id: 'att1',
        filename: 'relatorio-trimestral.pdf',
        contentType: 'application/pdf',
        size: 2048000
      }
    ],
    folder: 'INBOX',
    uid: 2
  },
  {
    id: '3',
    messageId: '<msg3@empresa.com>',
    from: 'pedro.oliveira@empresa.com',
    fromName: 'Pedro Oliveira',
    to: ['joao.silva@empresa.com'],
    subject: 'Novos leads',
    body: 'João,\n\nConseguimos 5 novos leads esta semana. Preciso da sua ajuda para qualificá-los.\n\nSegue a lista:\n1. Empresa ABC - Interesse em soluções de CRM\n2. Empresa XYZ - Orçamento para projeto personalizado\n3. Empresa 123 - Demonstração agendada\n\nPodemos conversar sobre isso hoje?\n\nAbraço,\nPedro',
    bodyType: 'plain',
    date: '2024-01-14T16:45:00Z',
    size: 768,
    flags: {
      seen: true,
      answered: true,
      flagged: false,
      deleted: false,
      draft: false
    },
    attachments: [],
    folder: 'INBOX',
    uid: 3
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const configId = searchParams.get('configId')
    const folder = searchParams.get('folder') || 'INBOX'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const search = searchParams.get('search') || ''
    
    if (!configId) {
      return NextResponse.json(
        { success: false, error: 'ID da configuração não fornecido' },
        { status: 400 }
      )
    }
    
    // Verificar se a configuração existe
    const config = emailConfigs.find(c => c.id === configId)
    if (!config) {
      return NextResponse.json(
        { success: false, error: 'Configuração de email não encontrada' },
        { status: 404 }
      )
    }
    
    // Filtrar mensagens pela pasta e termo de busca
    let filteredMessages = mockMessages.filter(msg => 
      msg.folder === folder && (
        search === '' ||
        msg.subject.toLowerCase().includes(search.toLowerCase()) ||
        msg.fromName.toLowerCase().includes(search.toLowerCase()) ||
        msg.body.toLowerCase().includes(search.toLowerCase())
      )
    )
    
    // Ordenar por data (mais recentes primeiro)
    filteredMessages.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    
    // Paginação
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedMessages = filteredMessages.slice(startIndex, endIndex)
    
    return NextResponse.json({
      success: true,
      data: {
        messages: paginatedMessages,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(filteredMessages.length / limit),
          totalItems: filteredMessages.length,
          itemsPerPage: limit
        },
        folder: folder,
        unreadCount: filteredMessages.filter(msg => !msg.flags.seen).length
      }
    })
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao buscar mensagens de email',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { configId, action, messageIds } = body
    
    if (!configId || !action || !messageIds) {
      return NextResponse.json(
        { success: false, error: 'Parâmetros incompletos' },
        { status: 400 }
      )
    }
    
    // Verificar se a configuração existe
    const config = emailConfigs.find(c => c.id === configId)
    if (!config) {
      return NextResponse.json(
        { success: false, error: 'Configuração de email não encontrada' },
        { status: 404 }
      )
    }
    
    // Processar ação nas mensagens
    const updatedMessages = mockMessages.map(msg => {
      if (messageIds.includes(msg.id)) {
        switch (action) {
          case 'markAsRead':
            return { ...msg, flags: { ...msg.flags, seen: true } }
          case 'markAsUnread':
            return { ...msg, flags: { ...msg.flags, seen: false } }
          case 'markAsFlagged':
            return { ...msg, flags: { ...msg.flags, flagged: true } }
          case 'markAsUnflagged':
            return { ...msg, flags: { ...msg.flags, flagged: false } }
          case 'delete':
            return { ...msg, flags: { ...msg.flags, deleted: true } }
          default:
            return msg
        }
      }
      return msg
    })
    
    // Atualizar o storage (em produção, isso seria feito no servidor IMAP)
    mockMessages.splice(0, mockMessages.length, ...updatedMessages)
    
    return NextResponse.json({
      success: true,
      message: `Ação "${action}" aplicada com sucesso`,
      affectedMessages: messageIds.length
    })
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao processar ação nas mensagens',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}