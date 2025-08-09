'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function TableLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Filters and Actions Skeleton */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-8 w-20" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-4" />
              ))}
            </div>
            
            {/* Table Rows */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="grid grid-cols-12 gap-4 px-4 py-3 border-t">
                {Array.from({ length: 6 }).map((_, j) => (
                  <Skeleton key={j} className="h-4" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pagination Skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-32" />
        <div className="flex space-x-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
        </div>
      </div>
    </div>
  )
}