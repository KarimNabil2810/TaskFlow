import { useState, useRef, useEffect } from 'react'
import {
  Box,
  Paper,
  IconButton,
  Typography,
  Popover,
  Button,
} from '@mui/material'
import {
  CalendarToday as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material'

const DateSelector = ({ selectedDate, onDateChange, getAllDates, getDateTasks }) => {
  const [anchorEl, setAnchorEl] = useState(null)
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate))
  
  useEffect(() => {
    setCurrentMonth(new Date(selectedDate))
  }, [selectedDate])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const days = []
    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const isDateToday = (date) => {
    const today = new Date()
    return date.getFullYear() === today.getFullYear() &&
           date.getMonth() === today.getMonth() &&
           date.getDate() === today.getDate()
  }

  const isDateSelected = (date) => {
    const selected = new Date(selectedDate)
    return date.getFullYear() === selected.getFullYear() &&
           date.getMonth() === selected.getMonth() &&
           date.getDate() === selected.getDate()
  }

  const hasTasks = (date) => {
    const dateString = formatDateToYYYYMMDD(date)
    const tasks = getDateTasks(dateString)
    return tasks && tasks.length > 0
  }

  const handleDateSelect = (date) => {
    const dateString = formatDateToYYYYMMDD(date)
    onDateChange(dateString)
    handleClose()
  }

  const changeMonth = (delta) => {
    const newMonth = new Date(currentMonth)
    newMonth.setMonth(newMonth.getMonth() + delta)
    setCurrentMonth(newMonth)
  }

  const formatMonthYear = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })
  }

  const getDateCount = (date) => {
    const dateString = formatDateToYYYYMMDD(date)
    const tasks = getDateTasks(dateString)
    return tasks ? tasks.length : 0
  }

  // Helper function to format date as YYYY-MM-DD without timezone issues
  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Button
        variant="outlined"
        startIcon={<CalendarIcon />}
        onClick={handleClick}
        sx={{
          borderColor: '#e0e0e0',
          color: '#333',
          '&:hover': {
            borderColor: '#1976d2',
            bgcolor: 'rgba(25, 118, 210, 0.04)',
          },
        }}
      >
        Select Date
      </Button>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        sx={{
          '& .MuiPopover-paper': {
            p: 2,
            minWidth: 320,
            borderRadius: 2,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <IconButton onClick={() => changeMonth(-1)} size="small">
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="subtitle1" fontWeight={500}>
            {formatMonthYear(currentMonth)}
          </Typography>
          <IconButton onClick={() => changeMonth(1)} size="small">
            <ChevronRightIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 1 }}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <Typography
              key={day}
              variant="caption"
              sx={{
                textAlign: 'center',
                fontWeight: 600,
                color: '#666',
                py: 0.5,
              }}
            >
              {day}
            </Typography>
          ))}
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
          {getDaysInMonth(currentMonth).map((date, index) => {
            if (!date) {
              return <Box key={`empty-${index}`} sx={{ aspectRatio: '1' }} />
            }

            const isToday = isDateToday(date)
            const isSelected = isDateSelected(date)
            const hasTask = hasTasks(date)
            const taskCount = getDateCount(date)

            return (
              <Box
                key={formatDateToYYYYMMDD(date)}
                onClick={() => handleDateSelect(date)}
                sx={{
                  aspectRatio: '1',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  borderRadius: 1,
                  bgcolor: isSelected ? '#1976d2' : 'transparent',
                  color: isSelected ? 'white' : 'inherit',
                  '&:hover': {
                    bgcolor: isSelected ? '#1565c0' : '#f0f0f0',
                  },
                  position: 'relative',
                }}
              >
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: isToday ? 700 : 400,
                    fontSize: isToday ? '0.875rem' : '0.75rem',
                  }}
                >
                  {date.getDate()}
                </Typography>
                {isToday && !isSelected && (
                  <Box
                    sx={{
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      bgcolor: '#1976d2',
                      mt: 0.5,
                    }}
                  />
                )}
                {hasTask && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 2,
                      right: 2,
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: isSelected ? 'rgba(255,255,255,0.8)' : '#4caf50',
                      fontSize: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: isSelected ? '#1976d2' : 'white',
                      fontWeight: 700,
                    }}
                  >
                    {taskCount > 1 ? taskCount : ''}
                  </Box>
                )}
              </Box>
            )
          })}
        </Box>
      </Popover>
    </Box>
  )
}

export default DateSelector