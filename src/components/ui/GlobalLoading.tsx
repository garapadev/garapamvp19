'use client'

import { useLoading } from '@/contexts/LoadingContext'
import { useEffect, useState } from 'react'

export function GlobalLoading() {
  const { isLoading } = useLoading()
  const [showLoading, setShowLoading] = useState(false)
  const [maxTimeout, setMaxTimeout] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isLoading) {
      // Mostrar o loading imediatamente
      setShowLoading(true)
      
      // Definir um timeout máximo de 3 segundos para garantir que o loading não fique preso
      const timeout = setTimeout(() => {
        setShowLoading(false)
      }, 3000)
      
      setMaxTimeout(timeout)
    } else {
      // Esconder o loading imediatamente
      setShowLoading(false)
      
      // Limpar o timeout máximo se existir
      if (maxTimeout) {
        clearTimeout(maxTimeout)
        setMaxTimeout(null)
      }
    }

    return () => {
      if (maxTimeout) {
        clearTimeout(maxTimeout)
      }
    }
  }, [isLoading, maxTimeout])

  if (!showLoading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl p-8 flex flex-col items-center space-y-6 transform scale-100 transition-all duration-300">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
        </div>
        <div className="text-center">
          <p className="text-xl font-semibold text-gray-800 mb-2">Carregando</p>
          <p className="text-sm text-gray-500">Por favor, aguarde...</p>
        </div>
        <div className="flex space-x-1">
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  )
}