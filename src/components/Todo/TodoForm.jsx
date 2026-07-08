import { useState } from 'react'
import {
  TextField,
  IconButton,
  Box,
  Paper,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography,
  alpha,
} from '@mui/material'
import {
  Add as AddIcon,
  Close as CloseIcon,
  Schedule as ScheduleIcon,
  Warning as WarningIcon,
} from '@mui/icons-material'
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'

// Helper function to format date as YYYY-MM-DD without timezone issues
const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const TodoForm = ({ addTodo, selectedDate }) => {
  const [openDialog, setOpenDialog] = useState(false)
  const [text, setText] = useState('')
  const [startDate, setStartDate] = useState(() => {
    const date = new Date(selectedDate)
    date.setHours(9, 0, 0, 0)
    return date
  })
  const [endDate, setEndDate] = useState(() => {
    const date = new Date(selectedDate)
    date.setHours(17, 0, 0, 0)
    return date
  })
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('personal')
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [errorDialogOpen, setErrorDialogOpen] = useState(false)

  const isPastDate = () => {
    const today = new Date()
    const todayStr = formatDateToYYYYMMDD(today)
    return selectedDate < todayStr
  }

  const handleOpenDialog = () => {
    if (isPastDate()) {
      setSnackbarOpen(true)
      return
    }
    
    const start = new Date(selectedDate)
    start.setHours(9, 0, 0, 0)
    const end = new Date(selectedDate)
    end.setHours(17, 0, 0, 0)
    
    setStartDate(start)
    setEndDate(end)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setText('')
  }

  const handleSubmit = (e) => {
    if (e) {
      e.preventDefault()
    }

    if (!text.trim()) {
      setErrorDialogOpen(true)
      return
    }

    if (startDate > endDate) {
      alert('Start date cannot be after end date')
      return
    }

    const taskData = {
      text: text.trim(),
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      priority: priority,
      category: category,
      completed: false,
      createdAt: new Date().toISOString(),
    }

    addTodo(taskData, selectedDate)
    setOpenDialog(false)
    setText('')
    setPriority('medium')
    setCategory('personal')
  }

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false)
  }

  const handleCloseErrorDialog = () => {
    setErrorDialogOpen(false)
  }

  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (text.trim() && !isPastDate()) {
        handleOpenDialog()
      }
    }
  }

  return (
    <>
      <Box sx={{ px: 3, pb: 2 }}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={0}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            p: 1,
            bgcolor: alpha('#6C63FF', 0.04),
            borderRadius: '16px',
            border: '1px solid',
            borderColor: alpha('#6C63FF', 0.1),
            transition: 'all 0.3s ease',
            '&:hover': {
              borderColor: alpha('#6C63FF', 0.2),
              bgcolor: alpha('#6C63FF', 0.06),
            },
          }}
        >
          <TextField
            fullWidth
            placeholder={isPastDate() ? "Cannot add tasks to past days" : `What's on your mind for ${formatDisplayDate(selectedDate)}?`}
            value={text}
            onChange={(e) => setText(e.target.value)}
            variant="standard"
            size="medium"
            disabled={isPastDate()}
            onKeyDown={handleKeyPress}
            sx={{
              px: 1,
              '& .MuiInput-root': {
                '&:before': { borderBottom: 'none' },
                '&:after': { borderBottom: 'none' },
                '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
              },
              '& .MuiInput-input': {
                padding: '8px 0',
                fontSize: '15px',
                '&::placeholder': {
                  color: '#999',
                  opacity: 1,
                },
              },
              '& .MuiInput-root.Mui-disabled': {
                opacity: 0.5,
              },
            }}
          />
          <IconButton
            onClick={handleOpenDialog}
            disabled={isPastDate() || !text.trim()}
            type="button"
            sx={{
              background: (isPastDate() || !text.trim()) 
                ? '#e0e0e0' 
                : 'linear-gradient(135deg, #6C63FF, #8B83FF)',
              color: 'white',
              width: 48,
              height: 48,
              borderRadius: '12px',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: (isPastDate() || !text.trim()) 
                  ? '#e0e0e0' 
                  : 'linear-gradient(135deg, #5A52D5, #7A72E5)',
                transform: 'scale(1.02)',
                boxShadow: '0 4px 20px rgba(108, 99, 255, 0.3)',
              },
              '&:active': {
                transform: 'scale(0.95)',
              },
              '&.Mui-disabled': {
                background: '#e0e0e0',
                color: 'white',
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Paper>
      </Box>

      {/* Error Dialog for Empty Input */}
      <Dialog
        open={errorDialogOpen}
        onClose={handleCloseErrorDialog}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            p: 2,
            maxWidth: '400px',
          }
        }}
      >
        <DialogTitle sx={{ 
          textAlign: 'center',
          pt: 3,
          pb: 1,
        }}>
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: 1,
          }}>
            <Box sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              bgcolor: alpha('#FF6584', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <WarningIcon sx={{ fontSize: 35, color: '#FF6584' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
              Empty Task
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" textAlign="center" sx={{ py: 1 }}>
            Please enter a task description before adding a new task.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', pb: 3 }}>
          <Button 
            onClick={handleCloseErrorDialog} 
            variant="contained"
            sx={{
              borderRadius: '12px',
              px: 4,
              background: 'linear-gradient(135deg, #6C63FF, #8B83FF)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5A52D5, #7A72E5)',
              },
            }}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add Task Modal */}
      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            position: 'relative',
            overflow: 'visible',
          }
        }}
      >
        {/* X Close Button - Top Right */}
        <IconButton
          onClick={handleCloseDialog}
          sx={{
            position: 'absolute',
            right: 16,
            top: 16,
            zIndex: 10,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            color: '#666',
            width: 36,
            height: 36,
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 1)',
              color: '#1a1a2e',
              transform: 'rotate(90deg)',
            },
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          }}
        >
          <CloseIcon sx={{ fontSize: 20 }} />
        </IconButton>

        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
          color: 'white',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          py: 3,
          textAlign: 'center',
          position: 'relative',
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              ✨ New Task
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
              for {formatDisplayDate(selectedDate)}
            </Typography>
          </Box>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Task Description"
              value={text}
              onChange={(e) => setText(e.target.value)}
              margin="normal"
              autoFocus
              multiline
              rows={2}
              error={errorDialogOpen}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && e.shiftKey) {
                  return
                } else if (e.key === 'Enter') {
                  e.preventDefault()
                }
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  '&:hover fieldset': {
                    borderColor: '#6C63FF',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#6C63FF',
                    borderWidth: '2px',
                  },
                },
              }}
            />

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="Start Date & Time"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{ 
                      textField: { 
                        fullWidth: true, 
                        margin: 'normal',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          },
                        },
                      } 
                    }}
                    minDateTime={new Date(selectedDate)}
                    maxDateTime={endDate}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label="End Date & Time"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{ 
                      textField: { 
                        fullWidth: true, 
                        margin: 'normal',
                        sx: {
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '12px',
                          },
                        },
                      } 
                    }}
                    minDateTime={startDate}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>

            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    label="Priority"
                    sx={{ borderRadius: '12px' }}
                  >
                    <MenuItem value="low">
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Box sx={{ width: 10, height: 10, bgcolor: '#4caf50', borderRadius: '50%' }} />
                        Low
                      </Stack>
                    </MenuItem>
                    <MenuItem value="medium">
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Box sx={{ width: 10, height: 10, bgcolor: '#ff9800', borderRadius: '50%' }} />
                        Medium
                      </Stack>
                    </MenuItem>
                    <MenuItem value="high">
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Box sx={{ width: 10, height: 10, bgcolor: '#f44336', borderRadius: '50%' }} />
                        High
                      </Stack>
                    </MenuItem>
                    <MenuItem value="urgent">
                      <Stack direction="row" alignItems="center" gap={1}>
                        <Box sx={{ width: 10, height: 10, bgcolor: '#9c27b0', borderRadius: '50%' }} />
                        Urgent
                      </Stack>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Category"
                    sx={{ borderRadius: '12px' }}
                  >
                    <MenuItem value="personal">👤 Personal</MenuItem>
                    <MenuItem value="work">💼 Work</MenuItem>
                    <MenuItem value="study">📚 Study</MenuItem>
                    <MenuItem value="health">🏥 Health</MenuItem>
                    <MenuItem value="shopping">🛒 Shopping</MenuItem>
                    <MenuItem value="other">📌 Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ 
              mt: 2, 
              p: 2, 
              background: alpha('#6C63FF', 0.05),
              borderRadius: '12px',
              border: '1px solid',
              borderColor: alpha('#6C63FF', 0.1),
            }}>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ScheduleIcon sx={{ fontSize: 14 }} />
                This task will be saved for {formatDisplayDate(selectedDate)}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1, justifyContent: 'center' }}>
          <Button 
            onClick={handleCloseDialog}
            sx={{ 
              borderRadius: '12px',
              px: 4,
              py: 1,
              color: '#666',
              '&:hover': { bgcolor: alpha('#000', 0.05) },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained" 
            disabled={!text.trim()}
            sx={{
              borderRadius: '12px',
              px: 4,
              py: 1,
              background: 'linear-gradient(135deg, #6C63FF, #8B83FF)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5A52D5, #7A72E5)',
                boxShadow: '0 4px 20px rgba(108, 99, 255, 0.3)',
              },
              '&:disabled': {
                background: '#e0e0e0',
              },
            }}
          >
            Add Task
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="warning" 
          sx={{ 
            width: '100%', 
            borderRadius: '12px',
            '& .MuiAlert-icon': { color: '#FF6584' },
          }}
        >
          You cannot add tasks to past days!
        </Alert>
      </Snackbar>
    </>
  )
}

export default TodoForm