'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { 
  Users, 
  Building2, 
  Plus,
  Search,
  Mail,
  Phone,
  MapPin,
  Tag,
  Filter,
  Network
} from 'lucide-react'

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isCreateCustomerOpen, setIsCreateCustomerOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    position: '',
    document: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    notes: '',
    status: 'LEAD',
    groupId: ''
  })

  // Mock data for groups
  const groups = [
    { id: '1', name: 'Empresa Matriz', description: 'Grupo principal da empresa' },
    { id: '2', name: 'Filial São Paulo', description: 'Grupo da filial de São Paulo' },
    { id: '3', name: 'Filial Rio de Janeiro', description: 'Grupo da filial do Rio de Janeiro' },
    { id: '4', name: 'Parceiros', description: 'Grupo de parceiros independentes' }
  ]

  // Mock data for demonstration
  const customers = [
    {
      id: '1',
      name: 'João Silva',
      email: 'joao.silva@email.com',
      phone: '(11) 99999-9999',
      company: 'Tech Solutions Ltda',
      status: 'CUSTOMER',
      tags: ['VIP', 'Empresa'],
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: '2',
      name: 'Maria Santos',
      email: 'maria.santos@email.com',
      phone: '(11) 98888-8888',
      company: 'Consultoria RH',
      status: 'LEAD',
      tags: ['Potencial'],
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: '3',
      name: 'Pedro Oliveira',
      email: 'pedro.oliveira@email.com',
      phone: '(11) 97777-7777',
      company: 'Comércio Eletrônico',
      status: 'PROSPECT',
      tags: ['E-commerce'],
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: '4',
      name: 'Ana Costa',
      email: 'ana.costa@email.com',
      phone: '(11) 96666-6666',
      company: 'Marketing Digital',
      status: 'CUSTOMER',
      tags: ['Premium'],
      avatar: '/placeholder-avatar.jpg'
    },
    {
      id: '5',
      name: 'Carlos Souza',
      email: 'carlos.souza@email.com',
      phone: '(11) 95555-5555',
      company: 'Software House',
      status: 'LEAD',
      tags: ['Tecnologia'],
      avatar: '/placeholder-avatar.jpg'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LEAD': return 'bg-gray-100 text-gray-800'
      case 'PROSPECT': return 'bg-blue-100 text-blue-800'
      case 'CUSTOMER': return 'bg-green-100 text-green-800'
      case 'INACTIVE': return 'bg-red-100 text-red-800'
      case 'LOST': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'LEAD': return 'Lead'
      case 'PROSPECT': return 'Prospect'
      case 'CUSTOMER': return 'Cliente'
      case 'INACTIVE': return 'Inativo'
      case 'LOST': return 'Perdido'
      default: return status
    }
  }

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateCustomer = () => {
    if (newCustomer.name && newCustomer.email) {
      const customer = {
        id: Date.now().toString(),
        name: newCustomer.name,
        email: newCustomer.email,
        phone: newCustomer.phone,
        company: newCustomer.company,
        status: newCustomer.status,
        tags: newCustomer.company ? ['Empresa'] : [],
        avatar: '/placeholder-avatar.jpg',
        groupId: newCustomer.groupId || null
      }
      
      // In a real app, this would be an API call
      console.log('Creating customer:', customer)
      
      // Reset form
      setNewCustomer({
        name: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        document: '',
        address: '',
        city: '',
        state: '',
        country: '',
        postalCode: '',
        notes: '',
        status: 'LEAD',
        groupId: ''
      })
      setIsCreateCustomerOpen(false)
    }
  }

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Clientes</h1>
            <p className="text-gray-600 mt-2">Gerencie seus clientes e leads</p>
          </div>
          <Dialog open={isCreateCustomerOpen} onOpenChange={setIsCreateCustomerOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                <DialogDescription>
                  Crie um novo cliente e atribua a um grupo hierárquico para controle de acesso
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Nome Completo *</Label>
                    <Input
                      id="customerName"
                      value={newCustomer.name}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="João Silva"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerEmail">Email *</Label>
                    <Input
                      id="customerEmail"
                      type="email"
                      value={newCustomer.email}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="joao.silva@empresa.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Telefone</Label>
                    <Input
                      id="customerPhone"
                      value={newCustomer.phone}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerCompany">Empresa</Label>
                    <Input
                      id="customerCompany"
                      value={newCustomer.company}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Tech Solutions Ltda"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPosition">Cargo</Label>
                    <Input
                      id="customerPosition"
                      value={newCustomer.position}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, position: e.target.value }))}
                      placeholder="Gerente de Compras"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerDocument">CPF/CNPJ</Label>
                    <Input
                      id="customerDocument"
                      value={newCustomer.document}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, document: e.target.value }))}
                      placeholder="00.000.000/0001-00"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="customerGroup">Grupo Hierárquico</Label>
                  <Select value={newCustomer.groupId} onValueChange={(value) => setNewCustomer(prev => ({ ...prev, groupId: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um grupo (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {groups.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          <div className="flex items-center space-x-2">
                            <Network className="h-4 w-4" />
                            <span>{group.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600 mt-1">
                    Clientes só serão visíveis para usuários do mesmo grupo ou grupos pais
                  </p>
                </div>

                <div>
                  <Label htmlFor="customerStatus">Status</Label>
                  <Select value={newCustomer.status} onValueChange={(value) => setNewCustomer(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LEAD">Lead</SelectItem>
                      <SelectItem value="PROSPECT">Prospect</SelectItem>
                      <SelectItem value="CUSTOMER">Cliente</SelectItem>
                      <SelectItem value="INACTIVE">Inativo</SelectItem>
                      <SelectItem value="LOST">Perdido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="customerAddress">Endereço</Label>
                    <Input
                      id="customerAddress"
                      value={newCustomer.address}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="Rua das Flores, 123"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerCity">Cidade</Label>
                    <Input
                      id="customerCity"
                      value={newCustomer.city}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="São Paulo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerState">Estado</Label>
                    <Input
                      id="customerState"
                      value={newCustomer.state}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="SP"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerCountry">País</Label>
                    <Input
                      id="customerCountry"
                      value={newCustomer.country}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, country: e.target.value }))}
                      placeholder="Brasil"
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPostalCode">CEP</Label>
                    <Input
                      id="customerPostalCode"
                      value={newCustomer.postalCode}
                      onChange={(e) => setNewCustomer(prev => ({ ...prev, postalCode: e.target.value }))}
                      placeholder="01234-567"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="customerNotes">Observações</Label>
                  <Textarea
                    id="customerNotes"
                    value={newCustomer.notes}
                    onChange={(e) => setNewCustomer(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Informações adicionais sobre o cliente..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateCustomerOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreateCustomer} disabled={!newCustomer.name || !newCustomer.email}>
                  Adicionar Cliente
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% desde o último mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Novos Leads</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">56</div>
              <p className="text-xs text-muted-foreground">+8% desde o último mês</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Clientes Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">892</div>
              <p className="text-xs text-muted-foreground">72% do total</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24%</div>
              <p className="text-xs text-muted-foreground">+2% desde o último mês</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar clientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
        </div>

        {/* Customers List */}
        <div className="space-y-4">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={customer.avatar} />
                      <AvatarFallback>{customer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">{customer.name}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                        <Mail className="h-3 w-3" />
                        <span>{customer.email}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Building2 className="h-3 w-3" />
                        <span>{customer.company}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <Badge className={getStatusColor(customer.status)}>
                      {getStatusText(customer.status)}
                    </Badge>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {customer.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente encontrado</h3>
            <p className="text-gray-600">Tente ajustar sua busca ou filtros</p>
          </div>
        )}
      </div>
    </MainLayout>
  )
}