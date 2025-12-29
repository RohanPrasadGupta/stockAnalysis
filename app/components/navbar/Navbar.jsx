'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText,
  Typography,
  Box,
  Divider
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home'
import SettingsIcon from '@mui/icons-material/Settings'
import ShowChartIcon from '@mui/icons-material/ShowChart'

const drawerWidth = 256

const Navbar = () => {
  const pathname = usePathname()
  
  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, href: '/pages/home' },
    { text: 'Settings', icon: <SettingsIcon />, href: '/pages/settings' },
  ]

  const isActive = (href) => pathname === href

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#1a1a2e',
          color: '#fff',
        },
      }}
    >
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <ShowChartIcon sx={{ fontSize: 32, color: '#00d4ff' }} />
        <Typography variant="h5" fontWeight="bold" sx={{ color: '#fff' }}>
          Stock Analysis
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.12)' }} />
      
      <List sx={{ mt: 2, px: 2 }}>
        {menuItems.map((item) => {
          const active = isActive(item.href)
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <Link href={item.href} style={{ textDecoration: 'none', width: '100%' }}>
                <ListItemButton
                  sx={{
                    borderRadius: 2,
                    backgroundColor: active ? 'rgba(0, 212, 255, 0.2)' : 'transparent',
                    '&:hover': {
                      backgroundColor: active ? 'rgba(0, 212, 255, 0.25)' : 'rgba(0, 212, 255, 0.15)',
                    },
                    transition: 'all 0.3s ease',
                    borderLeft: active ? '4px solid #00d4ff' : '4px solid transparent',
                    paddingLeft: active ? '12px' : '16px',
                  }}
                >
                  <ListItemIcon sx={{ color: active ? '#00d4ff' : '#8899aa', minWidth: 40 }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: active ? 700 : 500,
                      fontSize: '1rem',
                      color: active ? '#fff' : '#b0b8c1',
                    }}
                  />
                </ListItemButton>
              </Link>
            </ListItem>
          )
        })}
      </List>
    </Drawer>
  )
}

export default Navbar
