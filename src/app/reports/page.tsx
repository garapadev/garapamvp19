'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart3, 
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  DollarSign,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react'

export default function ReportsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  // Mock data for demonstration
  const stats = [
    {
      title: 'Receita Total',
      value: 'R$ 125.430',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      description: 'vs mês anterior'
    },
    {
      title: 'Novos Clientes',
      value: '156',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      description: 'vs mês anterior'
    },
    {
      title: 'Taxa de Conversão',
      value: '24.8%',
      change: '+2.1%',
      trend: 'up',
      icon: TrendingUp,
      description: 'vs mês anterior'
    },
    {
      title: 'Ticket Médio',
      value: 'R$ 2.847',
      change: '-3.2%',
      trend: 'down',
      icon: Building2,
      description: 'vs mês anterior'
    }
  ]

  const performanceData = [
    { month: 'Jan', sales: 65000, target: 70000 },
    { month: 'Fev', sales: 72000, target: 75000 },
    { month: 'Mar', sales: 68000, target: 70000 },
    { month: 'Abr', sales: 85000, target: 80000 },
    { month: 'Mai', sales: 92000, target: 85000 },
    { month: 'Jun', sales: 88000, target: 90000 }
  ]

  const conversionData = [
    { stage: 'Leads', count: 450, percentage: 100 },
    { stage: 'Qualificados', count: 320, percentage: 71 },
    { stage: 'Propostas', count: 180, percentage: 40 },
    { stage: 'Fechados', count: 108, percentage: 24 }
  ]

  const topPerformers = [
    { name: 'João Silva', sales: 45000, deals: 12, avatar: '/placeholder-avatar.jpg' },
    { name: 'Ana Costa', sales: 38000, deals: 10, avatar: '/placeholder-avatar.jpg' },
    { name: 'Carlos Souza', sales: 32000, deals: 8, avatar: '/placeholder-avatar.jpg' },
    { name: 'Maria Oliveira', sales: 28000, deals: 7, avatar: '/placeholder-avatar.jpg' }
  ]

  return (
    <MainLayout>
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Relatórios e Análises</h1>
            <p className="text-gray-600 mt-2">Acompanhe o desempenho do seu negócio</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filtrar
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Atualizar
            </Button>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mb-8">
          {['day', 'week', 'month', 'quarter', 'year'].map((period) => (
            <Button
              key={period}
              variant={selectedPeriod === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedPeriod(period)}
            >
              {period === 'day' && 'Dia'}
              {period === 'week' && 'Semana'}
              {period === 'month' && 'Mês'}
              {period === 'quarter' && 'Trimestre'}
              {period === 'year' && 'Ano'}
            </Button>
          ))}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                    {stat.change}
                  </span>
                  <span>{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Sales Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Desempenho de Vendas</CardTitle>
              <CardDescription>Comparação de vendas vs meta</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceData.map((data, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{data.month}</span>
                      <span>{((data.sales / data.target) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(data.sales / data.target) * 100}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-600 min-w-fit">
                        R$ {data.sales.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Funil de Conversão</CardTitle>
              <CardDescription>Taxa de conversão por etapa</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversionData.map((data, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{data.stage}</span>
                      <span>{data.count} ({data.percentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-600 h-2 rounded-full" 
                        style={{ width: `${data.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle>Melhores Desempenhos</CardTitle>
            <CardDescription>Vendedores com melhor performance este mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topPerformers.map((performer, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-semibold text-sm">{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold">{performer.name}</h4>
                      <p className="text-sm text-gray-600">{performer.deals} negócios fechados</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">R$ {performer.sales.toLocaleString()}</div>
                    <Badge variant="outline" className="text-xs">
                      Top {index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}