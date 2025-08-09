import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Single tenant mode - preparado para multitenant
  
  // No futuro, quando for multitenant, podemos detectar o tenant por:
  // 1. Subdomínio (tenant1.example.com)
  // 2. Path (/tenant1/dashboard)
  // 3. Header personalizado
  // 4. Cookie de sessão
  
  // Por enquanto, apenas adiciona headers úteis para debugging
  const response = NextResponse.next()
  
  // Adiciona header indicando o tenant (útil para debugging)
  response.headers.set('X-Tenant-ID', 'default')
  response.headers.set('X-Tenant-Mode', 'single')
  
  // Se for multitenant no futuro, podemos adicionar lógica aqui:
  if (process.env.NEXT_PUBLIC_MULTITENANT === 'true') {
    // Lógica de multitenancy será implementada aqui
    // Por enquanto, apenas loga que está em modo multitenant
    console.log('Multitenant mode detected - future implementation')
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}