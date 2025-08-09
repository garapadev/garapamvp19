'use client'

import { useRouteChangeLoading } from '@/hooks/useRouteChangeLoading'

export function RouteChangeLoadingHandler() {
  useRouteChangeLoading()
  
  // Este componente não renderiza nada, apenas gerencia o loading
  return null
}