'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Bell, Search, Check, X, Clock, User, MessageSquare, FileText, Calendar } from 'lucide-react'

// Mock data para notificações
const mockNotifications = [
  {
    id: '1',
    title: 'Nova tarefa atribuída',
    description: 'Você tem uma nova tarefa: "Reunião com cliente ABC"',
    type: 'task',
    priority: 'high',
    read: false,
    createdAt: '2024-01-15T10:30:00',
    icon: Calendar
  },
  {
    id: '2',
    title: 'Cliente atualizado',
    description: 'O cliente "Empresa XYZ" atualizou suas informações',
    type: 'customer',
    priority: 'medium',
    read: true,
    createdAt: '2024-01-15T09:15:00',
    icon: User
  },
  {
    id: '3',
    title: 'Nova mensagem',
    description: 'Você recebeu uma nova mensagem de João Silva',
    type: 'message',
    priority: 'low',
    read: false,
    createdAt: '2024-01-15T08:45:00',
    icon: MessageSquare
  },
  {
    id: '4',
    title: 'Relatório pronto',
    description: 'O relatório mensal de vendas está disponível',
    type: 'report',
    priority: 'medium',
    read: true,
    createdAt: '2024-01-14T16:20:00',
    icon: FileText
  },
  {
    id: '5',
    title: 'Lembrete de reunião',
    description: 'Reunião de equipe amanhã às 10:00',
    type: 'reminder',
    priority: 'high',
    read: false,
    createdAt: '2024-01-14T14:30:00',
    icon: Clock
  }
]

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || notification.type === filter
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ))
  }

  const markAsUnread = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: false } : notification
    ))
  }

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })))
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Alta'
      case 'medium': return 'Média'
      case 'low': return 'Baixa'
      default: return 'Normal'
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Agora mesmo'
    if (diffInHours < 24) return `Há ${diffInHours} horas`
    if (diffInHours < 48) return 'Ontem'
    return `Há ${Math.floor(diffInHours / 24)} dias`
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <MainLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notificações</h1>
            <p className="text-gray-600 mt-2">
              {unreadCount > 0 ? `${unreadCount} notificação${unreadCount > 1 ? 'ões' : ''} não lida${unreadCount > 1 ? 's' : ''}` : 'Nenhuma notificação não lida'}
            </p>
          </div>
          <div className="flex space-x-3">
            {unreadCount > 0 && (
              <Button variant="outline" onClick={markAllAsRead}>
                Marcar todas como lidas
              </Button>
            )}
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtrar Notificações</CardTitle>
            <CardDescription>Encontre as notificações que você procura</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar notificações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  onClick={() => setFilter('all')}
                >
                  Todas
                </Button>
                <Button
                  variant={filter === 'task' ? 'default' : 'outline'}
                  onClick={() => setFilter('task')}
                >
                  Tarefas
                </Button>
                <Button
                  variant={filter === 'customer' ? 'default' : 'outline'}
                  onClick={() => setFilter('customer')}
                >
                  Clientes
                </Button>
                <Button
                  variant={filter === 'message' ? 'default' : 'outline'}
                  onClick={() => setFilter('message')}
                >
                  Mensagens
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma notificação encontrada</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Nenhuma notificação corresponde à sua busca.' : 'Você não tem notificações no momento.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => {
              const Icon = notification.icon
              return (
                <Card key={notification.id} className={`transition-all ${!notification.read ? 'border-blue-200 bg-blue-50' : ''}`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className={`p-2 rounded-lg ${!notification.read ? 'bg-blue-100' : 'bg-gray-100'}`}>
                        <Icon className={`h-5 w-5 ${!notification.read ? 'text-blue-600' : 'text-gray-600'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className={`text-lg font-medium ${!notification.read ? 'text-blue-900' : 'text-gray-900'}`}>
                              {notification.title}
                            </h3>
                            <p className={`mt-1 ${!notification.read ? 'text-blue-700' : 'text-gray-600'}`}>
                              {notification.description}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2 ml-4">
                            <Badge variant="outline" className={getPriorityColor(notification.priority)}>
                              {getPriorityText(notification.priority)}
                            </Badge>
                            {!notification.read && (
                              <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <span className="text-sm text-gray-500">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          <div className="flex space-x-2">
                            {!notification.read ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <Check className="h-4 w-4 mr-1" />
                                Marcar como lida
                              </Button>
                            ) : (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsUnread(notification.id)}
                                className="text-gray-600 hover:text-gray-700"
                              >
                                Marcar como não lida
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4 mr-1" />
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </MainLayout>
  )
}