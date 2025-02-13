'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Todos } from './todos'
import { useState } from 'react'
import { ToastContainer } from 'react-toastify'

export default function Home() {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <Todos />
    </QueryClientProvider>
  )
}
