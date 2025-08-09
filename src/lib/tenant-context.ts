'use client'

import { createContext, useContext, ReactNode } from 'react'

export interface Tenant {
  id: string
  name: string
  domain?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface TenantContext {
  tenant: Tenant | null
  setTenant: (tenant: Tenant | null) => void
  isLoading: boolean
}

const TenantContext = createContext<TenantContext | undefined>(undefined)

export function TenantProvider({ children }: { children: ReactNode }) {
  // Single tenant setup - usando um tenant padrão
  const defaultTenant: Tenant = {
    id: 'default',
    name: 'GarapaCRM',
    domain: 'localhost',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }

  const value: TenantContext = {
    tenant: defaultTenant,
    setTenant: () => {
      // No single tenant mode, não permite alterar o tenant
      console.warn('Tenant change is not available in single tenant mode')
    },
    isLoading: false
  }

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  )
}

export function useTenant() {
  const context = useContext(TenantContext)
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider')
  }
  return context
}

// Hook para acessar o tenant ID atual
export function useTenantId(): string {
  const { tenant } = useTenant()
  return tenant?.id || 'default'
}

// Hook utilitário para verificar se está em modo multitenant
export function useIsMultitenant(): boolean {
  // Por padrão, retorna false (single tenant mode)
  // Pode ser configurado via variável de ambiente no futuro
  return process.env.NEXT_PUBLIC_MULTITENANT === 'true'
}

// Função para obter tenant ID no lado do servidor
export function getServerTenantId(): string {
  // Em single tenant mode, sempre retorna o tenant padrão
  // No futuro, pode ser obtido do header, domínio, ou sessão
  return 'default'
}

// Função para criar filtro de tenant para queries Prisma
export function createTenantFilter(tenantId?: string) {
  const id = tenantId || getServerTenantId()
  return { tenantId: id }
}

// Type guard para verificar se um objeto tem tenant ID
export function hasTenantId(obj: any): obj is { tenantId: string } {
  return obj && typeof obj === 'object' && 'tenantId' in obj
}