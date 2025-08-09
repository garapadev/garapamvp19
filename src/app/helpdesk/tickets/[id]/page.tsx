'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  ArrowLeft, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  Circle,
  User,
  Users,
  Calendar,
  Tag,
  Paperclip,
  Send,
  Edit,
  Save,
  X
} from 'lucide-react'

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

interface Comment {
  id: string
  ticketId: string
  author: string
  content: string
  createdAt: string
  type: 'comment' | 'status_change' | 'assignment'
}

export default function TicketDetailPage() {
  const params = useParams()
  const router = useRouter()
  const ticketId = params.id as string
  
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    status: '',
    priority: '',
    assignee: ''
  })
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle')

  useEffect(() => {
    // Mock ticket data
    const mockTicket: Ticket = {
      id: ticketId,
      title: 'Problema com acesso ao sistema',
      description: 'Usuário não consegue fazer login no sistema CRM. Ao tentar acessar, aparece a mensagem "Credenciais inválidas" mesmo com as credenciais corretas. Já tentei redefinir a senha mas o problema persiste.',
      status: 'in_progress',
      priority: 'high',
      department: 'TI - Suporte Técnico',
      requester: 'João Silva',
      assignee: 'Carlos Alberto',
      createdAt: '2024-01-15T09:30:00Z',
      updatedAt: '2024-01-15T10:15:00Z',
      tags: ['login', 'acesso', 'crm']
    }
    setTicket(mockTicket)
    setEditForm({
      status: mockTicket.status,
      priority: mockTicket.priority,
      assignee: mockTicket.assignee || ''
    })

    // Mock comments
    const mockComments: Comment[] = [
      {
        id: '1',
        ticketId: ticketId,
        author: 'João Silva',
        content: 'Olá, estou com dificuldade para acessar o sistema. Já tentei redefinir minha senha mas continua dando erro.',
        createdAt: '2024-01-15T09:30:00Z',
        type: 'comment'
      },
      {
        id: '2',
        ticketId: ticketId,
        author: 'Carlos Alberto',
        content: 'Olá João! Vou verificar o que está acontecendo com seu acesso. Por favor, confirme se você está usando o endereço correto: crm.empresa.com',
        createdAt: '2024-01-15T09:45:00Z',
        type: 'comment'
      },
      {
        id: '3',
        ticketId: ticketId,
        author: 'Carlos Alberto',
        content: 'Status alterado para "Em Andamento"',
        createdAt: '2024-01-15T10:15:00Z',
        type: 'status_change'
      }
    ]
    setComments(mockComments)
  }, [ticketId])

  const getStatusIcon = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return <Circle className="h-4 w-4 text-gray-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'closed':
        return <CheckCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusText = (status: Ticket['status']) => {
    switch (status) {
      case 'open':
        return 'Aberto'
      case 'in_progress':
        return 'Em Andamento'
      case 'resolved':
        return 'Resolvido'
      case 'closed':
        return 'Fechado'
    }
  }

  const getPriorityColor = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'low':
        return 'bg-gray-100 text-gray-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'urgent':
        return 'bg-red-100 text-red-800'
    }
  }

  const getPriorityText = (priority: Ticket['priority']) => {
    switch (priority) {
      case 'low':
        return 'Baixa'
      case 'medium':
        return 'Média'
      case 'high':
        return 'Alta'
      case 'urgent':
        return 'Urgente'
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now().toString(),
      ticketId: ticketId,
      author: 'João Silva', // Mock user
      content: newComment.trim(),
      createdAt: new Date().toISOString(),
      type: 'comment'
    }

    setComments([...comments, comment])
    setNewComment('')

    // Atualizar data de atualização do ticket
    if (ticket) {
      setTicket({
        ...ticket,
        updatedAt: new Date().toISOString()
      })
    }
  }

  const handleSaveChanges = async () => {
    if (!ticket) return

    setSaveStatus('saving')

    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      const updatedTicket: Ticket = {
        ...ticket,
        status: editForm.status as Ticket['status'],
        priority: editForm.priority as Ticket['priority'],
        assignee: editForm.assignee || undefined,
        updatedAt: new Date().toISOString()
      }

      setTicket(updatedTicket)
      setIsEditing(false)
      setSaveStatus('success')

      // Adicionar comentário de mudança de status
      if (ticket.status !== editForm.status) {
        const statusComment: Comment = {
          id: Date.now().toString(),
          ticketId: ticketId,
          author: 'Carlos Alberto', // Mock user
          content: `Status alterado para "${getStatusText(editForm.status as Ticket['status'])}"`,
          createdAt: new Date().toISOString(),
          type: 'status_change'
        }
        setComments([...comments, statusComment])
      }

      setTimeout(() => setSaveStatus('idle'), 3000)
    } catch (error) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus('idle'), 3000)
    }
  }

  if (!ticket) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-500">Carregando...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Chamado #{ticket.id}</h1>
              <p className="text-gray-600 mt-1">
                Detalhes do chamado de suporte
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {saveStatus === 'saving' && (
              <Badge variant="secondary">Salvando...</Badge>
            )}
            {saveStatus === 'success' && (
              <Badge className="bg-green-100 text-green-800">
                Salvo com sucesso
              </Badge>
            )}
            {saveStatus === 'error' && (
              <Badge variant="destructive">Erro ao salvar</Badge>
            )}
            
            {isEditing ? (
              <div className="flex space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
                <Button onClick={handleSaveChanges}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ticket Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(ticket.status)}
                    <span>{ticket.title}</span>
                    <Badge className={getPriorityColor(ticket.priority)}>
                      {getPriorityText(ticket.priority)}
                    </Badge>
                  </div>
                  <Badge variant="secondary">
                    {getStatusText(ticket.status)}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Descrição</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{ticket.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {ticket.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center space-x-1">
                      <Tag className="h-3 w-3" />
                      <span>{tag}</span>
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Edit Form */}
            {isEditing && (
              <Card>
                <CardHeader>
                  <CardTitle>Editar Chamado</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <Select value={editForm.status} onValueChange={(value) => setEditForm({...editForm, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="open">Aberto</SelectItem>
                          <SelectItem value="in_progress">Em Andamento</SelectItem>
                          <SelectItem value="resolved">Resolvido</SelectItem>
                          <SelectItem value="closed">Fechado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prioridade
                      </label>
                      <Select value={editForm.priority} onValueChange={(value) => setEditForm({...editForm, priority: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baixa</SelectItem>
                          <SelectItem value="medium">Média</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                          <SelectItem value="urgent">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Responsável
                      </label>
                      <Select value={editForm.assignee} onValueChange={(value) => setEditForm({...editForm, assignee: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecionar responsável" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Carlos Alberto">Carlos Alberto</SelectItem>
                          <SelectItem value="Ana Paula">Ana Paula</SelectItem>
                          <SelectItem value="Pedro Oliveira">Pedro Oliveira</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Comments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Comentários ({comments.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add Comment */}
                <div className="space-y-2">
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Adicionar um comentário..."
                    className="min-h-[100px]"
                  />
                  <div className="flex justify-end">
                    <Button onClick={handleAddComment} disabled={!newComment.trim()}>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Comentário
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {comments.map((comment) => (
                    <div key={comment.id} className="flex space-x-3">
                      <Avatar>
                        <AvatarFallback>{comment.author.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium text-sm">{comment.author}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleString('pt-BR')}
                          </span>
                          {comment.type === 'status_change' && (
                            <Badge variant="outline" className="text-xs">
                              Mudança de Status
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700">{comment.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Ticket Details */}
            <Card>
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Solicitante</p>
                    <p className="text-sm text-gray-600">{ticket.requester}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Departamento</p>
                    <p className="text-sm text-gray-600">{ticket.department}</p>
                  </div>
                </div>

                {ticket.assignee && (
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">Responsável</p>
                      <p className="text-sm text-gray-600">{ticket.assignee}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Criado em</p>
                    <p className="text-sm text-gray-600">
                      {new Date(ticket.createdAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Atualizado em</p>
                    <p className="text-sm text-gray-600">
                      {new Date(ticket.updatedAt).toLocaleString('pt-BR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Paperclip className="mr-2 h-5 w-5" />
                  Anexos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <Paperclip className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Nenhum anexo</p>
                </div>
              </CardContent>
            </Card>

            {/* Alert */}
            <Alert>
              <AlertDescription>
                Este chamado está sendo atendido pelo departamento {ticket.department}. 
                O tempo médio de resposta é de 2 horas úteis.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}