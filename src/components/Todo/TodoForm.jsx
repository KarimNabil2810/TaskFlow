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
} from '@mui/material'
import {
  Add as AddIcon,
  Close as CloseIcon,
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
    // Default to the selected date at 9:00 AM
    const date = new Date(selectedDate)
    date.setHours(9, 0, 0, 0)
    return date
  })
  const [endDate, setEndDate] = useState(() => {
    // Default to the selected date at 5:00 PM
    const date = new Date(selectedDate)
    date.setHours(17, 0, 0, 0)
    return date
  })
  const [priority, setPriority] = useState('medium')
  const [category, setCategory] = useState('personal')
  const [snackbarOpen, setSnackbarOpen] = useState(false)

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
    
    // Reset dates to the selected date when opening dialog
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

  const handleSubmit = () => {
    if (!text.trim()) {
      return
    }

    // Validate dates
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

  // Format the date for display
  const formatDisplayDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          p: 1,
          bgcolor: '#f8f9fa',
          borderRadius: 2,
        }}
      >
        <TextField
          fullWidth
          placeholder={isPastDate() ? "Cannot add tasks to past days" : `Add a new task for ${formatDisplayDate(selectedDate)}...`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          variant="outlined"
          size="medium"
          disabled={isPastDate()}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && text.trim()) {
              handleOpenDialog()
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: 'white',
              '& fieldset': {
                borderColor: '#e0e0e0',
              },
              '&:hover fieldset': {
                borderColor: isPastDate() ? '#e0e0e0' : '#1976d2',
              },
              '&.Mui-disabled': {
                bgcolor: '#f5f5f5',
              },
            },
          }}
        />
        <IconButton
          onClick={handleOpenDialog}
          color="primary"
          disabled={isPastDate() || !text.trim()}
          sx={{
            bgcolor: (isPastDate() || !text.trim()) ? '#bdbdbd' : '#1976d2',
            color: 'white',
            '&:hover': {
              bgcolor: (isPastDate() || !text.trim()) ? '#bdbdbd' : '#1565c0',
            },
            width: 56,
            height: 56,
            '&.Mui-disabled': {
              bgcolor: '#bdbdbd',
              color: 'white',
            },
          }}
        >
          <AddIcon />
        </IconButton>
      </Paper>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Add New Task for {formatDisplayDate(selectedDate)}
            </Typography>
            <IconButton onClick={handleCloseDialog} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Task Description"
              value={text}
              onChange={(e) => setText(e.target.value)}
              margin="normal"
              autoFocus
              multiline
              rows={2}
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
                        margin: 'normal' 
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
                        margin: 'normal' 
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
                  >
                    <MenuItem value="personal">
                      <Stack direction="row" alignItems="center" gap={1}>
                        👤 Personal
                      </Stack>
                    </MenuItem>
                    <MenuItem value="work">
                      <Stack direction="row" alignItems="center" gap={1}>
                        💼 Work
                      </Stack>
                    </MenuItem>
                    <MenuItem value="study">
                      <Stack direction="row" alignItems="center" gap={1}>
                        📚 Study
                      </Stack>
                    </MenuItem>
                    <MenuItem value="health">
                      <Stack direction="row" alignItems="center" gap={1}>
                        🏥 Health
                      </Stack>
                    </MenuItem>
                    <MenuItem value="shopping">
                      <Stack direction="row" alignItems="center" gap={1}>
                        🛒 Shopping
                      </Stack>
                    </MenuItem>
                    <MenuItem value="other">
                      <Stack direction="row" alignItems="center" gap={1}>
                        📌 Other
                      </Stack>
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, p: 1, bgcolor: '#e3f2fd', borderRadius: 1 }}>
              <Typography variant="caption" color="primary">
                💡 The task will be saved for {formatDisplayDate(selectedDate)}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!text.trim()}
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
        <Alert onClose={handleCloseSnackbar} severity="warning" sx={{ width: '100%' }}>
          You cannot add tasks to past days!
        </Alert>
      </Snackbar>
    </>
  )
}

export default TodoForm