'use client'

import React, { useState } from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  IconButton,
  Autocomplete,
} from '@mui/material'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import AddIcon from '@mui/icons-material/Add'
import CloseIcon from '@mui/icons-material/Close'
import mockData from '../mockdata/data.json'

const Home = () => {
  const transactions = mockData.transactions || []
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedStock, setSelectedStock] = useState(null)
  
  // Use lazy initializer to avoid hydration mismatch
  const getDefaultFormData = () => ({
    stockSymbol: '',
    stockName: '',
    type: 'BUY',
    price: '',
    quantity: '',
    investedDate: ''
  })
  
  const [formData, setFormData] = useState(getDefaultFormData)

  // Get unique stock symbols and names for autocomplete
  const stockOptions = [...new Map(
    transactions.map(t => [t.stockSymbol, { symbol: t.stockSymbol, name: t.stockName }])
  ).values()].sort((a, b) => a.symbol.localeCompare(b.symbol))

  const handleOpenDialog = (stockSymbol = null) => {
    setSelectedStock(stockSymbol)
    const stockInfo = stockSymbol ? transactions.find(t => t.stockSymbol === stockSymbol) : null
    setFormData({
      stockSymbol: stockSymbol || '',
      stockName: stockInfo?.stockName || '',
      type: 'BUY',
      price: '',
      quantity: '',
      investedDate: new Date().toISOString().split('T')[0]
    })
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedStock(null)
    setFormData(getDefaultFormData())
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    // Calculate total amount
    const totalAmount = parseFloat(formData.price) * parseFloat(formData.quantity)
    
    const newTransaction = {
      _id: `tx${String(transactions.length + 1).padStart(3, '0')}`,
      stockSymbol: formData.stockSymbol.toUpperCase(),
      stockName: formData.stockName,
      type: formData.type,
      price: parseFloat(formData.price),
      quantity: parseFloat(formData.quantity),
      totalAmount: totalAmount,
      investedDate: formData.investedDate
    }

    console.log('New Transaction:', newTransaction)
    // TODO: Add logic to save to data.json or backend
    
    alert('Transaction added successfully! (Currently logged to console)')
    handleCloseDialog()
  }

  // Group transactions by stock symbol
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const symbol = transaction.stockSymbol
    if (!acc[symbol]) {
      acc[symbol] = []
    }
    acc[symbol].push(transaction)
    return acc
  }, {})

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NP', {
      style: 'currency',
      currency: 'NPR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const calculateTotalInvestment = (transactionList) => {
    return transactionList.reduce((sum, t) => {
      return t.type === 'BUY' ? sum + t.totalAmount : sum
    }, 0)
  }

  const calculateTotalSold = (transactionList) => {
    return transactionList.reduce((sum, t) => {
      return t.type === 'SELL' ? sum + t.totalAmount : sum
    }, 0)
  }

  const calculateNetInvestment = (transactionList) => {
    const totalBought = calculateTotalInvestment(transactionList)
    const totalSold = calculateTotalSold(transactionList)
    return totalBought - totalSold
  }

  const calculateTotalQuantity = (transactionList) => {
    return transactionList.reduce((sum, t) => {
      return t.type === 'BUY' ? sum + t.quantity : sum - t.quantity
    }, 0)
  }

  const calculateAveragePrice = (transactionList) => {
    const buyTransactions = transactionList.filter(t => t.type === 'BUY')
    if (buyTransactions.length === 0) return 0
    
    const totalCost = buyTransactions.reduce((sum, t) => sum + t.totalAmount, 0)
    const totalQuantity = buyTransactions.reduce((sum, t) => sum + t.quantity, 0)
    
    return totalQuantity > 0 ? totalCost / totalQuantity : 0
  }

  const calculateProfitLoss = (transactionList) => {
    const totalSold = calculateTotalSold(transactionList)
    const soldTransactions = transactionList.filter(t => t.type === 'SELL')
    
    // Calculate cost basis for sold shares
    let costBasis = 0
    const avgPrice = calculateAveragePrice(transactionList)
    const totalSoldQuantity = soldTransactions.reduce((sum, t) => sum + t.quantity, 0)
    costBasis = avgPrice * totalSoldQuantity
    
    return totalSold - costBasis
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      p: 4 
    }}>
      <Box sx={{ 
        mb: 4, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        p: 3,
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <ShowChartIcon sx={{ fontSize: 40, color: '#667eea' }} />
          <Box>
            <Typography variant="h4" fontWeight="bold" sx={{ 
              color: '#1a1a2e',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Stock Portfolio
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Track your investments and performance
            </Typography>
          </Box>
        </Box>
        <Box sx={{ 
          display: 'flex', 
          gap: 3,
          backgroundColor: '#f8f9fa',
          p: 2,
          borderRadius: 2
        }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" fontWeight="600">
              Total Stocks
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#667eea' }}>
              {Object.keys(groupedTransactions).length}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.secondary" fontWeight="600">
              Transactions
            </Typography>
            <Typography variant="h6" fontWeight="bold" sx={{ color: '#764ba2' }}>
              {transactions.length}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontWeight: 'bold',
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: 'none',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Add Transaction
        </Button>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {Object.entries(groupedTransactions).map(([symbol, symbolTransactions]) => {
          const totalInvestment = calculateTotalInvestment(symbolTransactions)
          const totalSold = calculateTotalSold(symbolTransactions)
          const netInvestment = calculateNetInvestment(symbolTransactions)
          const totalQuantity = calculateTotalQuantity(symbolTransactions)
          const averagePrice = calculateAveragePrice(symbolTransactions)
          const profitLoss = calculateProfitLoss(symbolTransactions)
          const stockName = symbolTransactions[0]?.stockName || ''

          return (
            <Accordion 
              key={symbol} 
              sx={{ 
                borderRadius: 3,
                '&:before': { display: 'none' },
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 12px 40px rgba(102, 126, 234, 0.25)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#667eea' }} />}
                sx={{
                  background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
                  borderRadius: 3,
                  minHeight: '80px',
                  '&:hover': { 
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
                  },
                  '& .MuiAccordionSummary-content': {
                    margin: '16px 0'
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                  <Box sx={{ 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2,
                    p: 1.5,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <ShowChartIcon sx={{ color: '#fff', fontSize: 32 }} />
                  </Box>
                  <Box sx={{ flexGrow: 1, minWidth: '180px' }}>
                    <Typography variant="h5" fontWeight="bold" sx={{ 
                      color: '#1a1a2e',
                      mb: 0.5 
                    }}>
                      {symbol}
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#667eea',
                      fontWeight: 500
                    }}>
                      {stockName}
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      color: '#999',
                      fontWeight: 400,
                      display: 'block',
                      mt: 0.5
                    }}>
                      {symbolTransactions.length} transactions • {totalQuantity} shares
                    </Typography>
                  </Box>
                  
                  {/* Metrics Grid */}
                  <Box sx={{ 
                    display: 'flex',
                    gap: 1.5,
                    flexWrap: 'nowrap',
                    alignItems: 'center'
                  }}>
                    <Box sx={{ 
                      textAlign: 'center',
                      backgroundColor: 'rgba(102, 126, 234, 0.1)',
                      p: 1.5,
                      borderRadius: 2,
                      width: '140px',
                      flex: '0 0 140px'
                    }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ letterSpacing: 0.5, display: 'block' }}>
                        AVG PRICE
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" sx={{ color: '#667eea', mt: 0.5 }}>
                        {formatCurrency(averagePrice)}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ 
                      textAlign: 'center',
                      backgroundColor: 'rgba(26, 26, 46, 0.05)',
                      p: 1.5,
                      borderRadius: 2,
                      width: '140px',
                      flex: '0 0 140px'
                    }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ letterSpacing: 0.5, display: 'block' }}>
                        INVESTED
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" sx={{ color: '#1a1a2e', mt: 0.5 }}>
                        {formatCurrency(totalInvestment)}
                      </Typography>
                    </Box>
                    
                    {totalSold > 0 && (
                      <Box sx={{ 
                        textAlign: 'center',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        p: 1.5,
                        borderRadius: 2,
                        width: '140px',
                        flex: '0 0 140px'
                      }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ letterSpacing: 0.5, display: 'block' }}>
                          SOLD
                        </Typography>
                        <Typography variant="body1" fontWeight="bold" sx={{ color: '#ff6b6b', mt: 0.5 }}>
                          {formatCurrency(totalSold)}
                        </Typography>
                      </Box>
                    )}
                    
                    <Box sx={{ 
                      textAlign: 'center',
                      backgroundColor: 'rgba(118, 75, 162, 0.1)',
                      p: 1.5,
                      borderRadius: 2,
                      width: '140px',
                      flex: '0 0 140px'
                    }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ letterSpacing: 0.5, display: 'block' }}>
                        NET
                      </Typography>
                      <Typography variant="body1" fontWeight="bold" sx={{ color: '#764ba2', mt: 0.5 }}>
                        {formatCurrency(netInvestment)}
                      </Typography>
                    </Box>
                    
                    {totalSold > 0 && (
                      <Box sx={{ 
                        textAlign: 'center',
                        backgroundColor: profitLoss >= 0 ? 'rgba(81, 207, 102, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                        p: 1.5,
                        borderRadius: 2,
                        width: '140px',
                        flex: '0 0 140px'
                      }}>
                        <Typography variant="caption" color="text.secondary" fontWeight="600" sx={{ letterSpacing: 0.5, display: 'block' }}>
                          P/L
                        </Typography>
                        <Typography 
                          variant="body1" 
                          fontWeight="bold" 
                          sx={{ color: profitLoss >= 0 ? '#51cf66' : '#ff6b6b', mt: 0.5 }}
                        >
                          {profitLoss >= 0 ? '+' : ''}{formatCurrency(profitLoss)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  {/* Add Transaction Button */}
                  <Box
                    onClick={(e) => {
                      e.stopPropagation()
                      handleOpenDialog(symbol)
                    }}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff',
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
                        transform: 'scale(1.1)'
                      },
                      transition: 'all 0.3s ease',
                      ml: 1
                    }}
                  >
                    <AddIcon />
                  </Box>
                </Box>
              </AccordionSummary>
              
              <AccordionDetails sx={{ p: 0, backgroundColor: '#fafbfc' }}>
                <TableContainer sx={{ maxHeight: 450 }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          fontSize: '0.85rem', 
                          backgroundColor: '#667eea',
                          color: '#fff',
                          letterSpacing: 0.5,
                          textTransform: 'uppercase'
                        }}>
                          Type
                        </TableCell>
                        <TableCell align="right" sx={{ 
                          fontWeight: 'bold', 
                          fontSize: '0.85rem', 
                          backgroundColor: '#667eea',
                          color: '#fff',
                          letterSpacing: 0.5,
                          textTransform: 'uppercase'
                        }}>
                          Price
                        </TableCell>
                        <TableCell align="right" sx={{ 
                          fontWeight: 'bold', 
                          fontSize: '0.85rem', 
                          backgroundColor: '#667eea',
                          color: '#fff',
                          letterSpacing: 0.5,
                          textTransform: 'uppercase'
                        }}>
                          Quantity
                        </TableCell>
                        <TableCell align="right" sx={{ 
                          fontWeight: 'bold', 
                          fontSize: '0.85rem', 
                          backgroundColor: '#667eea',
                          color: '#fff',
                          letterSpacing: 0.5,
                          textTransform: 'uppercase'
                        }}>
                          Total Amount
                        </TableCell>
                        <TableCell sx={{ 
                          fontWeight: 'bold', 
                          fontSize: '0.85rem', 
                          backgroundColor: '#667eea',
                          color: '#fff',
                          letterSpacing: 0.5,
                          textTransform: 'uppercase'
                        }}>
                          Date
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {symbolTransactions.map((transaction) => (
                        <TableRow
                          key={transaction._id}
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: 'rgba(102, 126, 234, 0.08)',
                              transform: 'scale(1.002)'
                            },
                            transition: 'all 0.2s ease',
                            '&:nth-of-type(odd)': {
                              backgroundColor: '#fff'
                            },
                            '&:nth-of-type(even)': {
                              backgroundColor: '#fafbfc'
                            }
                          }}
                        >
                          <TableCell>
                            <Chip
                              label={transaction.type}
                              icon={transaction.type === 'BUY' ? <TrendingUpIcon /> : <TrendingDownIcon />}
                              color={transaction.type === 'BUY' ? 'success' : 'error'}
                              size="small"
                              sx={{ 
                                fontWeight: 'bold',
                                fontSize: '0.75rem',
                                height: '28px'
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="500" sx={{ color: '#1a1a2e' }}>
                              {formatCurrency(transaction.price)}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body2" fontWeight="600" sx={{ color: '#667eea' }}>
                              {transaction.quantity}
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="body1" fontWeight="700" sx={{ color: '#1a1a2e' }}>
                              {formatCurrency(transaction.totalAmount)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ color: '#666' }}>
                              {formatDate(transaction.investedDate)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </AccordionDetails>
            </Accordion>
          )
        })}
      </Box>

      {/* Add Transaction Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          pb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AddIcon />
            <Typography variant="h6" fontWeight="bold">
              Add New Transaction
            </Typography>
          </Box>
          <IconButton onClick={handleCloseDialog} sx={{ color: '#fff' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Stock Symbol Field */}
            <Autocomplete
              freeSolo
              options={stockOptions}
              getOptionLabel={(option) => {
                if (typeof option === 'string') return option
                return option.symbol
              }}
              value={stockOptions.find(opt => opt.symbol === formData.stockSymbol) || formData.stockSymbol}
              onChange={(event, newValue) => {
                if (typeof newValue === 'string') {
                  handleFormChange('stockSymbol', newValue)
                  handleFormChange('stockName', '')
                } else if (newValue) {
                  handleFormChange('stockSymbol', newValue.symbol)
                  handleFormChange('stockName', newValue.name)
                } else {
                  handleFormChange('stockSymbol', '')
                  handleFormChange('stockName', '')
                }
              }}
              onInputChange={(event, newValue) => {
                if (event && event.type === 'change') {
                  handleFormChange('stockSymbol', newValue)
                }
              }}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body1" fontWeight="600">
                      {option.symbol}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {option.name}
                    </Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Stock Symbol"
                  required
                  fullWidth
                  placeholder="Enter or select stock symbol"
                  helperText={selectedStock ? `Adding transaction for ${selectedStock}` : 'Select existing or enter new stock symbol'}
                />
              )}
            />

            {/* Stock Name Field */}
            <TextField
              label="Stock Name"
              value={formData.stockName}
              onChange={(e) => handleFormChange('stockName', e.target.value)}
              required
              fullWidth
              placeholder="Enter the full company name"
              helperText="Full name of the company"
            />

            {/* Transaction Type */}
            <TextField
              select
              label="Transaction Type"
              value={formData.type}
              onChange={(e) => handleFormChange('type', e.target.value)}
              required
              fullWidth
            >
              <MenuItem value="BUY">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon color="success" />
                  <Typography>BUY</Typography>
                </Box>
              </MenuItem>
              <MenuItem value="SELL">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingDownIcon color="error" />
                  <Typography>SELL</Typography>
                </Box>
              </MenuItem>
            </TextField>

            {/* Price */}
            <TextField
              label="Price per Share"
              type="number"
              value={formData.price}
              onChange={(e) => handleFormChange('price', e.target.value)}
              required
              fullWidth
              inputProps={{ min: 0, step: 0.01 }}
              helperText="Enter the price per share"
            />

            {/* Quantity */}
            <TextField
              label="Quantity"
              type="number"
              value={formData.quantity}
              onChange={(e) => handleFormChange('quantity', e.target.value)}
              required
              fullWidth
              inputProps={{ min: 1, step: 1 }}
              helperText="Enter the number of shares"
            />

            {/* Date */}
            <TextField
              label="Transaction Date"
              type="date"
              value={formData.investedDate}
              onChange={(e) => handleFormChange('investedDate', e.target.value)}
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
            />

            {/* Total Amount Display */}
            {formData.price && formData.quantity && (
              <Box sx={{ 
                p: 2, 
                backgroundColor: 'rgba(102, 126, 234, 0.1)', 
                borderRadius: 2,
                border: '2px solid #667eea'
              }}>
                <Typography variant="caption" color="text.secondary" fontWeight="600">
                  TOTAL AMOUNT
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#667eea', mt: 0.5 }}>
                  {formatCurrency(parseFloat(formData.price) * parseFloat(formData.quantity))}
                </Typography>
              </Box>
            )}
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              color: '#666',
              textTransform: 'none',
              fontWeight: '600'
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.stockSymbol || !formData.stockName || !formData.price || !formData.quantity || !formData.investedDate}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              fontWeight: 'bold',
              px: 3,
              textTransform: 'none',
              '&:hover': {
                background: 'linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)',
              },
              '&:disabled': {
                background: '#ccc',
                color: '#666'
              }
            }}
          >
            Add Transaction
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Home
