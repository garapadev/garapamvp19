'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export function RouterLoading() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    // Mostrar loading brevemente quando a rota mudar
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 200)
    
    return () => clearTimeout(timer)
  }, [pathname])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      <div className="h-0.5 bg-blue-600 animate-pulse"></div>
    </div>
  )
}