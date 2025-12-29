'use client'

import React from 'react'
import Navbar from '../components/navbar/Navbar'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Box } from '@mui/material'

const Layout = ({children}) => {
  const [queryClient] = React.useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <Box sx={{ display: 'flex' }}>
        <Navbar />
        <Box 
          component="main"
          sx={{ 
            flexGrow: 1, 
            minHeight: '100vh'
          }}
        >
          {children}
        </Box>
      </Box>
    </QueryClientProvider>
  )
}

export default Layout
