'use client'

import { useRouter, usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { useLoading } from '@/contexts/LoadingContext'
import { 
  Home, 
  Users, 
  CheckSquare, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Bell,
  Search,
  BarChart3,
  Calendar,
  MessageSquare,
  FileText,
  Database,
  Shield,
  Activity,
  Mail,
  HelpCircle,
  Headphones,
  MessageCircle
} from 'lucide-react'

interface SidebarProps {
  isCollapsed: boolean
  onToggle: () => void
}

const menuItems = [
  {
    title: 'Dashboard',
    icon: Home,
    href: '/',
    badge: null
  },
  {
    title: 'Clientes',
    icon: Users,
    href: '/customers',
    badge: '3'
  },
  {
    title: 'Tarefas',
    icon: CheckSquare,
    href: '/tasks',
    badge: '8'
  },
  {
    title: 'Atividades',
    icon: Activity,
    href: '/activities',
    badge: null
  },
  {
    title: 'Email',
    icon: Mail,
    href: '/email',
    badge: null
  },
  {
    title: 'WhatsApp',
    icon: MessageCircle,
    href: '/whatsapp',
    badge: null
  },
  {
    title: 'Helpdesk',
    icon: Headphones,
    href: '/helpdesk',
    badge: null
  },
  {
    title: 'Relatórios',
    icon: BarChart3,
    href: '/reports',
    badge: null
  }
]

const bottomMenuItems = [
  {
    title: 'Notificações',
    icon: Bell,
    href: '/notifications',
    badge: '2'
  },
  {
    title: 'Configurações',
    icon: Settings,
    href: '/settings',
    badge: null
  },
  {
    title: 'Permissões',
    icon: Shield,
    href: '/permissions',
    badge: null
  },
  {
    title: 'Sair',
    icon: LogOut,
    href: '/logout',
    badge: null
  }
]

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { setLoading } = useLoading()

  const handleNavigation = (href: string) => {
    // Ativar loading
    setLoading(true)
    
    // Navegar para a nova página
    router.push(href)
    
    // Desativar loading após um tempo (simulando o carregamento)
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const MenuItem = ({ item }: { item: any }) => {
    const isActive = pathname === item.href
    return (
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start mb-1",
          isCollapsed && "justify-center px-2"
        )}
        onClick={() => handleNavigation(item.href)}
      >
        <item.icon className={cn(
          "h-4 w-4",
          !isCollapsed && "mr-3"
        )} />
        {!isCollapsed && (
          <>
            <span className="flex-1 text-left">{item.title}</span>
            {item.badge && (
              <Badge variant="secondary" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </>
        )}
      </Button>
    )
  }

  return (
    <div className={cn(
      "bg-white border-r border-gray-200 flex flex-col h-full transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CRM</span>
              </div>
              <span className="font-bold text-lg">CRM System</span>
            </div>
          )}
          {isCollapsed && (
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-white font-bold text-sm">CRM</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className={cn(
              "h-8 w-8 p-0",
              isCollapsed && "mx-auto"
            )}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src="/placeholder-avatar.jpg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                João Silva
              </p>
              <p className="text-xs text-gray-500 truncate">
                Administrador
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Buscar..."
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      )}

      {/* Main Menu */}
      <div className="flex-1 overflow-y-auto p-4">
        <nav className="space-y-1">
          {menuItems.map((item) => (
            <MenuItem key={item.href} item={item} />
          ))}
        </nav>
      </div>

      {/* Bottom Menu */}
      <div className="p-4 border-t border-gray-200">
        <nav className="space-y-1">
          {bottomMenuItems.map((item) => (
            <MenuItem key={item.href} item={item} />
          ))}
        </nav>
      </div>

      {/* Collapsed User Profile */}
      {isCollapsed && (
        <div className="p-4 border-t border-gray-200">
          <Avatar className="mx-auto">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
      )}
    </div>
  )
}