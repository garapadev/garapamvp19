'use client'

import { Loader2, Building2 } from 'lucide-react'

export function GlobalLoading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 mx-auto relative">
            <Building2 className="w-16 h-16 text-primary animate-pulse" />
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full animate-spin border-t-primary"></div>
          </div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground">Carregando GarapaCRM</h2>
          <p className="text-muted-foreground">Aguarde enquanto preparamos seu sistema...</p>
        </div>
        <div className="flex items-center justify-center space-x-2">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground">Inicializando</span>
        </div>
      </div>
    </div>
  )
}