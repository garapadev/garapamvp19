'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  Search, 
  Send, 
  Inbox, 
  Star, 
  Trash2, 
  Folder,
  Settings,
  RefreshCw,
  Paperclip,
  Clock,
  User,
  FileText
} from 'lucide-react'

interface Email {
  id: string
  from: string
  fromName: string
  subject: string
  preview: string
  date: string
  read: boolean
  starred: boolean
  hasAttachment: boolean
}

export default function EmailPage() {
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFolder, setActiveFolder] = useState('inbox')

  // Mock data para demonstração
  const mockEmails: Email[] = [
    {
      id: '1',
      from: 'joao.silva@empresa.com',
      fromName: 'João Silva',
      subject: 'Reunião de projeto',
      preview: 'Olá, gostaria de agendar uma reunião para discutir o novo projeto...',
      date: '10:30',
      read: false,
      starred: true,
      hasAttachment: false
    },
    {
      id: '2',
      from: 'maria.santos@empresa.com',
      fromName: 'Maria Santos',
      subject: 'Atualização do relatório',
      preview: 'Envio o relatório atualizado com as últimas métricas do trimestre...',
      date: '09:15',
      read: true,
      starred: false,
      hasAttachment: true
    },
    {
      id: '3',
      from: 'pedro.oliveira@empresa.com',
      fromName: 'Pedro Oliveira',
      subject: 'Novos leads',
      preview: 'Conseguimos 5 novos leads esta semana, preciso da sua ajuda...',
      date: 'Ontem',
      read: true,
      starred: false,
      hasAttachment: false
    }
  ]

  const filteredEmails = mockEmails.filter(email =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.fromName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.preview.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const folders = [
    { id: 'inbox', name: 'Caixa de Entrada', icon: Inbox, count: 3, unread: 1 },
    { id: 'sent', name: 'Enviados', icon: Send, count: 0, unread: 0 },
    { id: 'drafts', name: 'Rascunhos', icon: FileText, count: 2, unread: 0 },
    { id: 'starred', name: 'Favoritos', icon: Star, count: 1, unread: 0 },
    { id: 'trash', name: 'Lixeira', icon: Trash2, count: 0, unread: 0 }
  ]

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-8rem)] gap-6">
        {/* Sidebar com pastas */}
        <div className="w-64 bg-white rounded-lg border border-gray-200 p-4">
          <div className="space-y-4">
            <Button 
              className="w-full justify-start" 
              onClick={() => window.location.href = '/email/config'}
            >
              <Settings className="mr-2 h-4 w-4" />
              Configurar Email
            </Button>
            
            <div className="space-y-1">
              {folders.map((folder) => {
                const Icon = folder.icon
                return (
                  <button
                    key={folder.id}
                    onClick={() => setActiveFolder(folder.id)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors ${
                      activeFolder === folder.id 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="mr-3 h-4 w-4" />
                      <span className="text-sm font-medium">{folder.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {folder.unread > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {folder.unread}
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">{folder.count}</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Lista de emails */}
        <div className="flex-1 bg-white rounded-lg border border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Caixa de Entrada</h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => window.location.href = '/email/config'}>
                  <Settings className="mr-2 h-4 w-4" />
                  Configurar
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Atualizar
                </Button>
                <Button onClick={() => window.location.href = '/email/compose'}>
                  <Send className="mr-2 h-4 w-4" />
                  Novo Email
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Pesquisar emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredEmails.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Mail className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>Nenhum email encontrado</p>
              </div>
            ) : (
              filteredEmails.map((email) => (
                <div
                  key={email.id}
                  onClick={() => setSelectedEmail(email.id)}
                  className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                    selectedEmail === email.id ? 'bg-blue-50' : ''
                  } ${!email.read ? 'bg-blue-50/30' : ''}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start flex-1 min-w-0">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`text-sm font-medium truncate ${
                            !email.read ? 'text-gray-900 font-semibold' : 'text-gray-700'
                          }`}>
                            {email.fromName}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">{email.date}</span>
                            {email.starred && (
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            )}
                          </div>
                        </div>
                        <p className={`text-sm font-medium truncate mb-1 ${
                          !email.read ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {email.subject}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {email.preview}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      {email.hasAttachment && (
                        <Paperclip className="h-4 w-4 text-gray-400" />
                      )}
                      {!email.read && (
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Painel de visualização de email */}
        <div className="w-96 bg-white rounded-lg border border-gray-200">
          {selectedEmail ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">
                    {mockEmails.find(e => e.id === selectedEmail)?.subject}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Star className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {mockEmails.find(e => e.id === selectedEmail)?.fromName}
                      </p>
                      <p className="text-xs text-gray-500">
                        {mockEmails.find(e => e.id === selectedEmail)?.from}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {mockEmails.find(e => e.id === selectedEmail)?.date}
                  </div>
                </div>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  <p>Olá,</p>
                  <p>Este é um exemplo de conteúdo de email. Em uma implementação real, este conteúdo seria carregado do servidor IMAP.</p>
                  <p>O email client permitirá que você visualize, responda e gerencie seus emails diretamente da interface.</p>
                  <p>Atenciosamente,<br/>
                  {mockEmails.find(e => e.id === selectedEmail)?.fromName}</p>
                </div>
              </div>
              
              <div className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Responder
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Encaminhar
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <Mail className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <p>Selecione um email para visualizar</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}