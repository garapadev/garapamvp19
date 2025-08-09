'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  Mail, 
  Server, 
  Shield, 
  CheckCircle, 
  AlertCircle,
  Plus,
  Trash2,
  TestTube
} from 'lucide-react'

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

export default function EmailConfigPage() {
  const [configs, setConfigs] = useState<EmailConfig[]>([
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
  ])

  const [showForm, setShowForm] = useState(false)
  const [editingConfig, setEditingConfig] = useState<EmailConfig | null>(null)
  const [formData, setFormData] = useState<Partial<EmailConfig>>({})
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle')

  const handleSaveConfig = () => {
    if (editingConfig) {
      // Edit existing config
      setConfigs(configs.map(config => 
        config.id === editingConfig.id 
          ? { ...config, ...formData } 
          : config
      ))
    } else {
      // Add new config
      const newConfig: EmailConfig = {
        id: Date.now().toString(),
        name: formData.name || '',
        email: formData.email || '',
        imapServer: formData.imapServer || '',
        imapPort: formData.imapPort || 993,
        imapSecurity: formData.imapSecurity || 'ssl',
        smtpServer: formData.smtpServer || '',
        smtpPort: formData.smtpPort || 587,
        smtpSecurity: formData.smtpSecurity || 'tls',
        smtpAuth: formData.smtpAuth ?? true,
        username: formData.username || '',
        password: formData.password || '',
        active: formData.active ?? true
      }
      setConfigs([...configs, newConfig])
    }
    
    setShowForm(false)
    setEditingConfig(null)
    setFormData({})
  }

  const handleEditConfig = (config: EmailConfig) => {
    setEditingConfig(config)
    setFormData(config)
    setShowForm(true)
  }

  const handleDeleteConfig = (id: string) => {
    setConfigs(configs.filter(config => config.id !== id))
  }

  const handleTestConnection = async () => {
    setTestStatus('testing')
    
    // Simular teste de conexão
    setTimeout(() => {
      setTestStatus('success')
      setTimeout(() => setTestStatus('idle'), 3000)
    }, 2000)
  }

  const handleToggleActive = (id: string) => {
    setConfigs(configs.map(config => 
      config.id === id 
        ? { ...config, active: !config.active }
        : config
    ))
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Configurações de Email</h1>
            <p className="text-gray-600 mt-1">
              Configure suas contas de email para usar o cliente de email integrado
            </p>
          </div>
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Configuração
          </Button>
        </div>

        {/* Formulário de Configuração */}
        {showForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="mr-2 h-5 w-5" />
                {editingConfig ? 'Editar Configuração' : 'Nova Configuração de Email'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações Básicas */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Informações Básicas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Nome da Configuração</Label>
                    <Input
                      id="name"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Email Principal"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Seu Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>
              </div>

              {/* Configurações IMAP */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Server className="mr-2 h-4 w-4" />
                  Configurações IMAP (Recebimento)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="imapServer">Servidor IMAP</Label>
                    <Input
                      id="imapServer"
                      value={formData.imapServer || ''}
                      onChange={(e) => setFormData({...formData, imapServer: e.target.value})}
                      placeholder="imap.seuprovedor.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="imapPort">Porta</Label>
                    <Input
                      id="imapPort"
                      type="number"
                      value={formData.imapPort || ''}
                      onChange={(e) => setFormData({...formData, imapPort: parseInt(e.target.value)})}
                      placeholder="993"
                    />
                  </div>
                  <div>
                    <Label htmlFor="imapSecurity">Segurança</Label>
                    <Select 
                      value={formData.imapSecurity || 'ssl'} 
                      onValueChange={(value: 'none' | 'ssl' | 'tls') => 
                        setFormData({...formData, imapSecurity: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="none">Nenhuma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Configurações SMTP */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Mail className="mr-2 h-4 w-4" />
                  Configurações SMTP (Envio)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="smtpServer">Servidor SMTP</Label>
                    <Input
                      id="smtpServer"
                      value={formData.smtpServer || ''}
                      onChange={(e) => setFormData({...formData, smtpServer: e.target.value})}
                      placeholder="smtp.seuprovedor.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">Porta</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={formData.smtpPort || ''}
                      onChange={(e) => setFormData({...formData, smtpPort: parseInt(e.target.value)})}
                      placeholder="587"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpSecurity">Segurança</Label>
                    <Select 
                      value={formData.smtpSecurity || 'tls'} 
                      onValueChange={(value: 'none' | 'ssl' | 'tls') => 
                        setFormData({...formData, smtpSecurity: value})
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ssl">SSL</SelectItem>
                        <SelectItem value="tls">TLS</SelectItem>
                        <SelectItem value="none">Nenhuma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Credenciais */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Credenciais
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="username">Usuário</Label>
                    <Input
                      id="username"
                      value={formData.username || ''}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password || ''}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="smtpAuth"
                    checked={formData.smtpAuth ?? true}
                    onCheckedChange={(checked) => setFormData({...formData, smtpAuth: checked})}
                  />
                  <Label htmlFor="smtpAuth">Usar autenticação SMTP</Label>
                </div>
              </div>

              {/* Ações */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleTestConnection}
                    disabled={testStatus === 'testing'}
                  >
                    <TestTube className="mr-2 h-4 w-4" />
                    {testStatus === 'testing' ? 'Testando...' : 'Testar Conexão'}
                  </Button>
                  {testStatus === 'success' && (
                    <Badge variant="secondary" className="text-green-700 bg-green-50">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      Conexão bem-sucedida
                    </Badge>
                  )}
                  {testStatus === 'error' && (
                    <Badge variant="destructive">
                      <AlertCircle className="mr-1 h-3 w-3" />
                      Falha na conexão
                    </Badge>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleSaveConfig}>
                    {editingConfig ? 'Atualizar' : 'Salvar'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de Configurações */}
        <div className="grid gap-4">
          {configs.map((config) => (
            <Card key={config.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <h3 className="font-medium">{config.name}</h3>
                        <p className="text-sm text-gray-600">{config.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={config.active ? "default" : "secondary"}>
                        {config.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={config.active}
                      onCheckedChange={() => handleToggleActive(config.id)}
                    />
                    <Button variant="outline" size="sm" onClick={() => handleEditConfig(config)}>
                      <Settings className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteConfig(config.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">IMAP:</span> {config.imapServer}:{config.imapPort} ({config.imapSecurity.toUpperCase()})
                  </div>
                  <div>
                    <span className="font-medium">SMTP:</span> {config.smtpServer}:{config.smtpPort} ({config.smtpSecurity.toUpperCase()})
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {configs.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Mail className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Nenhuma configuração de email
                </h3>
                <p className="text-gray-600 mb-4">
                  Configure sua primeira conta de email para começar a usar o cliente de email integrado.
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Adicionar Configuração
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Informações de Ajuda */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Dica:</strong> Para configurar seu email, você precisará das informações do seu provedor de email. 
            Verifique a documentação do seu provedor ou entre em contato com o suporte para obter os detalhes dos servidores IMAP e SMTP.
          </AlertDescription>
        </Alert>
      </div>
    </MainLayout>
  )
}