'use client'

import { useState, useEffect } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Search, 
  MoreVertical, 
  Paperclip, 
  Smile, 
  Mic, 
  Send,
  Phone,
  Video,
  EllipsisVertical,
  User,
  CheckSquare,
  Headphones,
  ArrowLeft,
  Plus,
  MessageCircle
} from 'lucide-react'

interface Contact {
  id: string
  name: string
  phone: string
  avatar?: string
  lastMessage?: string
  lastMessageTime?: string
  unreadCount?: number
  isOnline?: boolean
}

interface Message {
  id: string
  contactId: string
  text: string
  timestamp: string
  isSent: boolean
  isDelivered: boolean
  isRead: boolean
}

interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  company?: string
  status: 'active' | 'inactive'
  createdAt: string
}

export default function WhatsAppPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showSidebar, setShowSidebar] = useState<'customer' | 'task' | 'helpdesk' | null>(null)
  const [customerData, setCustomerData] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(false)

  // Mock data
  useEffect(() => {
    // Mock contacts
    const mockContacts: Contact[] = [
      {
        id: '1',
        name: 'João Silva',
        phone: '+5511999999999',
        lastMessage: 'Preciso de ajuda com o sistema',
        lastMessageTime: '10:30',
        unreadCount: 2,
        isOnline: true
      },
      {
        id: '2',
        name: 'Maria Santos',
        phone: '+5511888888888',
        lastMessage: 'Obrigado pelo suporte!',
        lastMessageTime: '09:15',
        isOnline: false
      },
      {
        id: '3',
        name: 'Pedro Oliveira',
        phone: '+5511777777777',
        lastMessage: 'Quando estará disponível a nova versão?',
        lastMessageTime: 'Ontem',
        unreadCount: 1,
        isOnline: true
      },
      {
        id: '4',
        name: 'Ana Costa',
        phone: '+5511666666666',
        lastMessage: 'Agendada reunião para amanhã',
        lastMessageTime: 'Ontem',
        isOnline: false
      }
    ]
    setContacts(mockContacts)

    // Mock messages
    const mockMessages: Message[] = [
      {
        id: '1',
        contactId: '1',
        text: 'Olá! Preciso de ajuda com o sistema',
        timestamp: '10:25',
        isSent: false,
        isDelivered: true,
        isRead: true
      },
      {
        id: '2',
        contactId: '1',
        text: 'Olá João! Como posso ajudar?',
        timestamp: '10:26',
        isSent: true,
        isDelivered: true,
        isRead: true
      },
      {
        id: '3',
        contactId: '1',
        text: 'Não consigo acessar o módulo de relatórios',
        timestamp: '10:28',
        isSent: false,
        isDelivered: true,
        isRead: true
      },
      {
        id: '4',
        contactId: '1',
        text: 'Vou verificar suas permissões. Um momento, por favor.',
        timestamp: '10:29',
        isSent: true,
        isDelivered: true,
        isRead: true
      },
      {
        id: '5',
        contactId: '1',
        text: 'Preciso de ajuda com o sistema',
        timestamp: '10:30',
        isSent: false,
        isDelivered: true,
        isRead: false
      }
    ]
    setMessages(mockMessages)
  }, [])

  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  )

  const contactMessages = selectedContact 
    ? messages.filter(msg => msg.contactId === selectedContact.id)
    : []

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return

    const newMsg: Message = {
      id: Date.now().toString(),
      contactId: selectedContact.id,
      text: newMessage.trim(),
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isSent: true,
      isDelivered: true,
      isRead: false
    }

    setMessages([...messages, newMsg])
    setNewMessage('')

    // Update contact last message
    setContacts(contacts.map(contact =>
      contact.id === selectedContact.id
        ? { ...contact, lastMessage: newMessage.trim(), lastMessageTime: 'Agora' }
        : contact
    ))
  }

  const handleCustomerClick = async () => {
    if (!selectedContact) return

    setLoading(true)
    try {
      // Verificar se o cliente existe via API
      const response = await fetch(`/api/whatsapp/customers/check?phone=${encodeURIComponent(selectedContact.phone)}`)
      const result = await response.json()

      if (result.success && result.exists) {
        // Cliente já existe
        setCustomerData(result.data)
        setShowSidebar('customer')
      } else {
        // Cliente não existe, mostrar formulário de cadastro
        setCustomerData(null)
        setShowSidebar('customer')
      }
    } catch (error) {
      console.error('Erro ao verificar cliente:', error)
      alert('Erro ao verificar cliente. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleTaskClick = () => {
    setShowSidebar('task')
  }

  const handleHelpdeskClick = () => {
    setShowSidebar('helpdesk')
  }

  const formatTime = (time: string) => {
    return time
  }

  return (
    <MainLayout>
      <div className="h-screen flex flex-col bg-gray-100">
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar de Contatos */}
          <div className={`w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 flex flex-col ${selectedContact ? 'hidden md:flex' : 'flex'}`}>
            {/* Header */}
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">WhatsApp</h2>
                <Button size="sm" variant="ghost">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar contatos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Contacts List */}
            <ScrollArea className="flex-1">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
                    selectedContact?.id === contact.id ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {contact.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>
                  
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">{contact.name}</h3>
                      <span className="text-xs text-gray-500">{formatTime(contact.lastMessageTime || '')}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-600 truncate">{contact.lastMessage}</p>
                      {contact.unreadCount && contact.unreadCount > 0 && (
                        <Badge className="bg-green-500 text-white text-xs">
                          {contact.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </div>

          {/* Área de Conversa */}
          <div className={`flex-1 flex flex-col bg-gray-50 ${selectedContact ? 'flex' : 'hidden md:flex'}`}>
            {selectedContact ? (
              <>
                {/* Header da Conversa */}
                <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="md:hidden mr-2"
                      onClick={() => setSelectedContact(null)}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback>{selectedContact.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {selectedContact.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    
                    <div className="ml-3">
                      <h3 className="font-semibold text-gray-900">{selectedContact.name}</h3>
                      <p className="text-sm text-gray-500">{selectedContact.phone}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Ícones de Ação */}
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleCustomerClick}
                      disabled={loading}
                      className="hover:bg-blue-50"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleTaskClick}
                      className="hover:bg-green-50"
                    >
                      <CheckSquare className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={handleHelpdeskClick}
                      className="hover:bg-purple-50"
                    >
                      <Headphones className="h-4 w-4" />
                    </Button>

                    <div className="w-px h-6 bg-gray-300"></div>
                    
                    <Button variant="ghost" size="sm">
                      <Phone className="h-4 w-4" />
                    </Button>
                    
                    <Button variant="ghost" size="sm">
                      <Video className="h-4 w-4" />
                    </Button>
                    
                    <Button variant="ghost" size="sm">
                      <EllipsisVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Área de Mensagens */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {contactMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isSent
                            ? 'bg-green-500 text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                        <div className={`flex items-center justify-end mt-1 space-x-1 ${
                          message.isSent ? 'text-green-100' : 'text-gray-500'
                        }`}>
                          <span className="text-xs">{formatTime(message.timestamp)}</span>
                          {message.isSent && (
                            <>
                              {message.isDelivered && (
                                <span className="text-xs">✓</span>
                              )}
                              {message.isRead && (
                                <span className="text-xs">✓✓</span>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Área de Input */}
                <div className="bg-white border-t border-gray-200 px-4 py-3">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Plus className="h-5 w-5" />
                    </Button>
                    
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    
                    <div className="flex-1 relative">
                      <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Digite uma mensagem"
                        className="pr-12"
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      />
                      <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {newMessage.trim() ? (
                      <Button onClick={handleSendMessage} size="sm">
                        <Send className="h-5 w-5" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm">
                        <Mic className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Bem-vindo ao WhatsApp</h3>
                  <p className="text-gray-600">Selecione um contato para começar a conversar</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar de Ações */}
          {showSidebar && (
            <div className="w-full md:w-96 bg-white border-l border-gray-200 shadow-lg">
              {showSidebar === 'customer' && customerData && (
                <CustomerSidebar 
                  customer={customerData} 
                  onClose={() => setShowSidebar(null)} 
                />
              )}
              {showSidebar === 'customer' && !customerData && (
                <NewCustomerSidebar 
                  contact={selectedContact!} 
                  onClose={() => setShowSidebar(null)} 
                />
              )}
              {showSidebar === 'task' && (
                <QuickTaskSidebar 
                  contact={selectedContact!} 
                  onClose={() => setShowSidebar(null)} 
                />
              )}
              {showSidebar === 'helpdesk' && (
                <QuickHelpdeskSidebar 
                  contact={selectedContact!} 
                  onClose={() => setShowSidebar(null)} 
                />
              )}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

// Componentes de Sidebar
function CustomerSidebar({ customer, onClose }: { customer: Customer; onClose: () => void }) {
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Informações do Cliente</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 p-4 space-y-4">
        <div className="text-center">
          <Avatar className="w-20 h-20 mx-auto mb-3">
            <AvatarFallback className="text-xl">{customer.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <h4 className="text-xl font-semibold">{customer.name}</h4>
          <Badge className={customer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
            {customer.status === 'active' ? 'Ativo' : 'Inativo'}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-500">Telefone</label>
            <p className="text-gray-900">{customer.phone}</p>
          </div>
          
          {customer.email && (
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-gray-900">{customer.email}</p>
            </div>
          )}
          
          {customer.company && (
            <div>
              <label className="text-sm font-medium text-gray-500">Empresa</label>
              <p className="text-gray-900">{customer.company}</p>
            </div>
          )}
          
          <div>
            <label className="text-sm font-medium text-gray-500">Cliente desde</label>
            <p className="text-gray-900">
              {new Date(customer.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
        
        <div className="pt-4 space-y-2">
          <Button className="w-full" onClick={() => window.location.href = `/customers`}>
            Ver Detalhes Completos
          </Button>
          <Button variant="outline" className="w-full">
            Editar Cliente
          </Button>
        </div>
      </div>
    </div>
  )
}

function NewCustomerSidebar({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  const [formData, setFormData] = useState({
    name: contact.name,
    phone: contact.phone,
    email: '',
    company: ''
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/whatsapp/customers/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        alert('Cliente cadastrado com sucesso!')
        onClose()
      } else {
        alert(result.error || 'Erro ao cadastrar cliente')
      }
    } catch (error) {
      console.error('Erro ao cadastrar cliente:', error)
      alert('Erro ao cadastrar cliente. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Novo Cliente</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 p-4 space-y-4">
        <div className="text-center">
          <Avatar className="w-16 h-16 mx-auto mb-3">
            <AvatarFallback className="text-lg">{contact.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <p className="text-sm text-gray-600">Cadastrar novo cliente a partir desta conversa</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome *</label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Nome do cliente"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefone *</label>
            <Input
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              placeholder="Telefone"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              placeholder="Email (opcional)"
              type="email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Empresa</label>
            <Input
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              placeholder="Empresa (opcional)"
            />
          </div>
        </div>
        
        <div className="pt-4 space-y-2">
          <Button 
            className="w-full" 
            onClick={handleSave}
            disabled={saving || !formData.name || !formData.phone}
          >
            {saving ? 'Salvando...' : 'Cadastrar Cliente'}
          </Button>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}

function QuickTaskSidebar({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  })
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/whatsapp/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          contactName: contact.name,
          contactPhone: contact.phone,
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert('Tarefa criada com sucesso!')
        onClose()
      } else {
        alert(result.error || 'Erro ao criar tarefa')
      }
    } catch (error) {
      console.error('Erro ao criar tarefa:', error)
      alert('Erro ao criar tarefa. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Nova Tarefa</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 p-4 space-y-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <CheckSquare className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-sm text-gray-600">Criar tarefa para {contact.name}</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Título da tarefa"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descrição da tarefa"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Data de Vencimento</label>
            <Input
              value={formData.dueDate}
              onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
              placeholder="Data de vencimento"
              type="date"
            />
          </div>
        </div>
        
        <div className="pt-4 space-y-2">
          <Button 
            className="w-full" 
            onClick={handleSave}
            disabled={saving || !formData.title}
          >
            {saving ? 'Salvando...' : 'Criar Tarefa'}
          </Button>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}

function QuickHelpdeskSidebar({ contact, onClose }: { contact: Contact; onClose: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    department: '',
    priority: 'medium'
  })
  const [saving, setSaving] = useState(false)

  const departments = [
    'TI - Suporte Técnico',
    'RH - Recursos Humanos',
    'Financeiro'
  ]

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/whatsapp/helpdesk/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          contactName: contact.name,
          contactPhone: contact.phone,
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert('Chamado criado com sucesso!')
        onClose()
      } else {
        alert(result.error || 'Erro ao criar chamado')
      }
    } catch (error) {
      console.error('Erro ao criar chamado:', error)
      alert('Erro ao criar chamado. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Novo Chamado</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1 p-4 space-y-4">
        <div className="text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <Headphones className="h-6 w-6 text-purple-600" />
          </div>
          <p className="text-sm text-gray-600">Abrir chamado para {contact.name}</p>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Título do chamado"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Descrição detalhada do problema"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Departamento *</label>
            <select
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Selecione um departamento</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({...formData, priority: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>
        
        <div className="pt-4 space-y-2">
          <Button 
            className="w-full" 
            onClick={handleSave}
            disabled={saving || !formData.title || !formData.description || !formData.department}
          >
            {saving ? 'Salvando...' : 'Abrir Chamado'}
          </Button>
          <Button variant="outline" className="w-full" onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </div>
  )
}