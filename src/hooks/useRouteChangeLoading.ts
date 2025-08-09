'use client'

import { useEffect } from 'react'
import { useLoading } from '@/contexts/LoadingContext'

export function useRouteChangeLoading() {
  const { setLoading } = useLoading()

  useEffect(() => {
    // Desativar loading inicial quando a página carregar
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [setLoading])
}