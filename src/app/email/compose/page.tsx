'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Send, 
  Paperclip, 
  X, 
  Plus, 
  Save,
  Eye,
  FileText,
  Image,
  Download
} from 'lucide-react'

interface EmailAttachment {
  id: string
  filename: string
  size: number
  type: string
  content: string
}

interface EmailConfig {
  id: string
  name: string
  email: string
}

export default function EmailComposePage() {
  const [formData, setFormData] = useState({
    to: [] as string[],
    cc: [] as string[],
    bcc: [] as string[],
    subject: '',
    body: '',
    bodyType: 'html' as 'plain' | 'html',
    configId: ''
  })
  
  const [attachments, setAttachments] = useState<EmailAttachment[]>([])
  const [showCc, setShowCc] = useState(false)
  const [showBcc, setShowBcc] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  
  // Mock configs - em produção, viria da API
  const configs: EmailConfig[] = [
    { id: '1', name: 'Email Principal', email: 'joao.silva@empresa.com' }
  ]

  const handleAddRecipient = (type: 'to' | 'cc' | 'bcc', email: string) => {
    if (email && !formData[type].includes(email)) {
      setFormData(prev => ({
        ...prev,
        [type]: [...prev[type], email]
      }))
    }
  }

  const handleRemoveRecipient = (type: 'to' | 'cc' | 'bcc', email: string) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter(e => e !== email)
    }))
  }

  const handleFileAttach = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const attachment: EmailAttachment = {
            id: Date.now().toString() + Math.random(),
            filename: file.name,
            size: file.size,
            type: file.type,
            content: e.target?.result as string
          }
          setAttachments(prev => [...prev, attachment])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const handleRemoveAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSend = async () => {
    if (!formData.configId || formData.to.length === 0 || !formData.subject || !formData.body) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setIsSending(true)
    setSendStatus('sending')

    try {
      const response = await fetch('/api/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          attachments: attachments.map(att => ({
            filename: att.filename,
            content: att.content.split(',')[1], // Remove o prefixo data:image/...
            contentType: att.type
          }))
        })
      })

      const result = await response.json()

      if (result.success) {
        setSendStatus('success')
        // Limpar formulário após envio bem-sucedido
        setFormData({
          to: [],
          cc: [],
          bcc: [],
          subject: '',
          body: '',
          bodyType: 'html',
          configId: formData.configId
        })
        setAttachments([])
        
        setTimeout(() => {
          window.location.href = '/email'
        }, 2000)
      } else {
        setSendStatus('error')
      }
    } catch (error) {
      setSendStatus('error')
    } finally {
      setIsSending(false)
    }
  }

  const handleSaveDraft = async () => {
    // Implementar salvamento de rascunho
    alert('Rascunho salvo com sucesso!')
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Novo Email</h1>
            <p className="text-gray-600 mt-1">
              Componha e envie um novo email
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="mr-2 h-4 w-4" />
              Salvar Rascunho
            </Button>
            <Button onClick={handleSend} disabled={isSending}>
              <Send className="mr-2 h-4 w-4" />
              {isSending ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </div>

        {/* Status de Envio */}
        {sendStatus === 'success' && (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-800">
              Email enviado com sucesso! Redirecionando para a caixa de entrada...
            </AlertDescription>
          </Alert>
        )}

        {sendStatus === 'error' && (
          <Alert className="border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">
              Erro ao enviar email. Verifique as configurações e tente novamente.
            </AlertDescription>
          </Alert>
        )}

        {/* Formulário */}
        <Card>
          <CardContent className="p-6 space-y-4">
            {/* Configuração de Email */}
            <div>
              <Label htmlFor="config">Enviar como</Label>
              <Select value={formData.configId} onValueChange={(value) => setFormData(prev => ({ ...prev, configId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma configuração de email" />
                </SelectTrigger>
                <SelectContent>
                  {configs.map(config => (
                    <SelectItem key={config.id} value={config.id}>
                      {config.name} ({config.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Para */}
            <div>
              <Label htmlFor="to">Para *</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    id="to"
                    placeholder="Digite o email e pressione Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddRecipient('to', e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCc(!showCc)}
                  >
                    CC
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowBcc(!showBcc)}
                  >
                    BCC
                  </Button>
                </div>
                
                {/* Destinatários */}
                {formData.to.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.to.map(email => (
                      <Badge key={email} variant="secondary" className="flex items-center gap-1">
                        {email}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleRemoveRecipient('to', email)}
                        />
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* CC */}
            {showCc && (
              <div>
                <Label htmlFor="cc">CC</Label>
                <div className="space-y-2">
                  <Input
                    id="cc"
                    placeholder="Digite o email e pressione Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddRecipient('cc', e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                  {formData.cc.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.cc.map(email => (
                        <Badge key={email} variant="secondary" className="flex items-center gap-1">
                          {email}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleRemoveRecipient('cc', email)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* BCC */}
            {showBcc && (
              <div>
                <Label htmlFor="bcc">BCC</Label>
                <div className="space-y-2">
                  <Input
                    id="bcc"
                    placeholder="Digite o email e pressione Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddRecipient('bcc', e.currentTarget.value)
                        e.currentTarget.value = ''
                      }
                    }}
                  />
                  {formData.bcc.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {formData.bcc.map(email => (
                        <Badge key={email} variant="secondary" className="flex items-center gap-1">
                          {email}
                          <X 
                            className="h-3 w-3 cursor-pointer" 
                            onClick={() => handleRemoveRecipient('bcc', email)}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Assunto */}
            <div>
              <Label htmlFor="subject">Assunto *</Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Digite o assunto do email"
              />
            </div>

            {/* Tipo de Corpo */}
            <div>
              <Label>Tipo de Conteúdo</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={formData.bodyType === 'plain' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, bodyType: 'plain' }))}
                >
                  Texto Puro
                </Button>
                <Button
                  type="button"
                  variant={formData.bodyType === 'html' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFormData(prev => ({ ...prev, bodyType: 'html' }))}
                >
                  HTML
                </Button>
              </div>
            </div>

            {/* Corpo do Email */}
            <div>
              <Label htmlFor="body">Mensagem *</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                placeholder="Digite sua mensagem aqui..."
                className="min-h-[300px]"
              />
            </div>

            {/* Anexos */}
            <div>
              <Label>Anexos</Label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileAttach}
                    className="hidden"
                    id="file-upload"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    <Paperclip className="mr-2 h-4 w-4" />
                    Anexar Arquivos
                  </Button>
                  <span className="text-sm text-gray-500">
                    Tamanho máximo: 25MB
                  </span>
                </div>

                {attachments.length > 0 && (
                  <div className="space-y-2">
                    {attachments.map(attachment => (
                      <div key={attachment.id} className="flex items-center justify-between p-2 border rounded-lg">
                        <div className="flex items-center gap-2">
                          {attachment.type.startsWith('image/') ? (
                            <Image className="h-4 w-4 text-blue-500" alt="Image attachment" />
                          ) : (
                            <FileText className="h-4 w-4 text-gray-500" alt="File attachment" />
                          )}
                          <div>
                            <p className="text-sm font-medium">{attachment.filename}</p>
                            <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleRemoveAttachment(attachment.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}