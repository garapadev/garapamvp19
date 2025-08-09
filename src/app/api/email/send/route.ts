import { NextRequest, NextResponse } from 'next/server'

interface EmailConfig {
  id: string
  smtpServer: string
  smtpPort: number
  smtpSecurity: 'none' | 'ssl' | 'tls'
  smtpAuth: boolean
  username: string
  password: string
}

interface EmailSendRequest {
  configId: string
  to: string[]
  cc?: string[]
  bcc?: string[]
  subject: string
  body: string
  bodyType: 'plain' | 'html'
  attachments?: EmailAttachment[]
  replyTo?: string
}

interface EmailAttachment {
  filename: string
  content: string // base64 encoded
  contentType: string
}

// Mock storage para configurações de email
const emailConfigs: EmailConfig[] = [
  {
    id: '1',
    smtpServer: 'smtp.empresa.com',
    smtpPort: 587,
    smtpSecurity: 'tls',
    smtpAuth: true,
    username: 'joao.silva@empresa.com',
    password: 'password123'
  }
]

export async function POST(request: NextRequest) {
  try {
    const emailData: EmailSendRequest = await request.json()
    
    // Validar campos obrigatórios
    if (!emailData.configId || !emailData.to || !emailData.subject || !emailData.body) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Campos obrigatórios não fornecidos: configId, to, subject, body' 
        },
        { status: 400 }
      )
    }
    
    // Verificar se a configuração existe
    const config = emailConfigs.find(c => c.id === emailData.configId)
    if (!config) {
      return NextResponse.json(
        { success: false, error: 'Configuração de email não encontrada' },
        { status: 404 }
      )
    }
    
    // Validar endereços de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    for (const email of emailData.to) {
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { success: false, error: `Endereço de email inválido: ${email}` },
          { status: 400 }
        )
      }
    }
    
    if (emailData.cc) {
      for (const email of emailData.cc) {
        if (!emailRegex.test(email)) {
          return NextResponse.json(
            { success: false, error: `Endereço de email inválido em CC: ${email}` },
            { status: 400 }
          )
        }
      }
    }
    
    if (emailData.bcc) {
      for (const email of emailData.bcc) {
        if (!emailRegex.test(email)) {
          return NextResponse.json(
            { success: false, error: `Endereço de email inválido em BCC: ${email}` },
            { status: 400 }
          )
        }
      }
    }
    
    // Simular envio de email
    const sendResult = await simulateEmailSend(emailData, config)
    
    if (!sendResult.success) {
      return NextResponse.json(
        { success: false, error: sendResult.error },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Email enviado com sucesso',
      data: {
        messageId: sendResult.messageId,
        timestamp: new Date().toISOString(),
        recipients: {
          to: emailData.to,
          cc: emailData.cc || [],
          bcc: emailData.bcc || []
        }
      }
    })
    
  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Erro ao enviar email',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

async function simulateEmailSend(emailData: EmailSendRequest, config: EmailConfig) {
  try {
    // Simular delay de envio
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Simular validação de servidor SMTP
    const isValidServer = config.smtpServer.includes('.') && config.smtpServer.length > 4
    const isValidPort = config.smtpPort > 0 && config.smtpPort <= 65535
    const isValidCredentials = config.username.includes('@') && config.password.length > 0
    
    if (!isValidServer) {
      return {
        success: false,
        error: 'Servidor SMTP inválido'
      }
    }
    
    if (!isValidPort) {
      return {
        success: false,
        error: 'Porta SMTP inválida'
      }
    }
    
    if (!isValidCredentials) {
      return {
        success: false,
        error: 'Credenciais SMTP inválidas'
      }
    }
    
    // Simular limite de tamanho de anexos
    if (emailData.attachments) {
      const totalSize = emailData.attachments.reduce((sum, att) => {
        // Calcular tamanho do conteúdo base64
        const sizeInBytes = (att.content.length * 3) / 4
        return sum + sizeInBytes
      }, 0)
      
      const maxSizeInBytes = 25 * 1024 * 1024 // 25MB
      if (totalSize > maxSizeInBytes) {
        return {
          success: false,
          error: 'Tamanho total dos anexos excede o limite de 25MB'
        }
      }
    }
    
    // Simular sucesso no envio
    const messageId = `<${Date.now()}@${config.smtpServer}>`
    
    return {
      success: true,
      messageId: messageId,
      details: {
        server: config.smtpServer,
        port: config.smtpPort,
        security: config.smtpSecurity,
        auth: config.smtpAuth,
        timestamp: new Date().toISOString()
      }
    }
    
  } catch (error) {
    return {
      success: false,
      error: 'Erro ao enviar email via SMTP',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }
  }
}