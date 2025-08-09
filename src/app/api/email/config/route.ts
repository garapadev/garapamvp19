import { NextRequest, NextResponse } from 'next/server'

interface EmailConfig {
  id: string
  name: string
  email: string
  imapServer: string
  imapPort: number
  imapSecurity: 'none' | 'ssl' | 'tls'
  smtpServer: string
  smtpPort: number
  smtpSecurity: 'none' | 'ssl' | 'tls'
  smtpAuth: boolean
  username: string
  password: string
  active: boolean
}

// Mock storage - em produção, isso seria armazenado em banco de dados
let emailConfigs: EmailConfig[] = [
  {
    id: '1',
    name: 'Email Principal',
    email: 'joao.silva@empresa.com',
    imapServer: 'imap.empresa.com',
    imapPort: 993,
    imapSecurity: 'ssl',
    smtpServer: 'smtp.empresa.com',
    smtpPort: 587,
    smtpSecurity: 'tls',
    smtpAuth: true,
    username: 'joao.silva@empresa.com',
    password: '••••••••',
    active: true
  }
]

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: emailConfigs
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao buscar configurações de email' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const newConfig: EmailConfig = {
      id: Date.now().toString(),
      name: body.name,
      email: body.email,
      imapServer: body.imapServer,
      imapPort: body.imapPort,
      imapSecurity: body.imapSecurity,
      smtpServer: body.smtpServer,
      smtpPort: body.smtpPort,
      smtpSecurity: body.smtpSecurity,
      smtpAuth: body.smtpAuth,
      username: body.username,
      password: body.password,
      active: body.active ?? true
    }
    
    emailConfigs.push(newConfig)
    
    return NextResponse.json({
      success: true,
      data: newConfig
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao criar configuração de email' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    
    const configIndex = emailConfigs.findIndex(config => config.id === id)
    
    if (configIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Configuração não encontrada' },
        { status: 404 }
      )
    }
    
    emailConfigs[configIndex] = {
      ...emailConfigs[configIndex],
      ...updateData
    }
    
    return NextResponse.json({
      success: true,
      data: emailConfigs[configIndex]
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao atualizar configuração de email' },
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
    
    const configIndex = emailConfigs.findIndex(config => config.id === id)
    
    if (configIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Configuração não encontrada' },
        { status: 404 }
      )
    }
    
    emailConfigs.splice(configIndex, 1)
    
    return NextResponse.json({
      success: true,
      message: 'Configuração excluída com sucesso'
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Erro ao excluir configuração de email' },
      { status: 500 }
    )
  }
}