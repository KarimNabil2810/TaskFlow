import { useState, useRef, useEffect } from 'react'
import {
  Box,
  IconButton,
  Typography,
  Popover,
  Button,
  Tooltip,
  alpha,
} from '@mui/material'
import {
  CalendarToday as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Block as BlockIcon,
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

  const formatDateToYYYYMMDD = (date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

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

  const isPastDate = (date) => {
    const today = new Date()
    const todayStr = formatDateToYYYYMMDD(today)
    const dateStr = formatDateToYYYYMMDD(date)
    return dateStr < todayStr
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

  return (
    <Box sx={{ px: 3, pb: 1 }}>
      <Button
        variant="outlined"
        startIcon={<CalendarIcon />}
        onClick={handleClick}
        sx={{
          borderColor: alpha('#6C63FF', 0.2),
          color: '#6C63FF',
          borderRadius: '12px',
          px: 3,
          py: 1,
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            borderColor: '#6C63FF',
            bgcolor: alpha('#6C63FF', 0.04),
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 20px rgba(108, 99, 255, 0.15)',
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
            p: 3,
            minWidth: 340,
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            boxShadow: '0 20px 60px rgba(108, 99, 255, 0.15)',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <IconButton 
            onClick={() => changeMonth(-1)} 
            size="small"
            sx={{
              bgcolor: alpha('#6C63FF', 0.05),
              '&:hover': { bgcolor: alpha('#6C63FF', 0.1) },
            }}
          >
            <ChevronLeftIcon />
          </IconButton>
          <Typography variant="subtitle1" fontWeight={600} color="#1a1a2e">
            {formatMonthYear(currentMonth)}
          </Typography>
          <IconButton 
            onClick={() => changeMonth(1)} 
            size="small"
            sx={{
              bgcolor: alpha('#6C63FF', 0.05),
              '&:hover': { bgcolor: alpha('#6C63FF', 0.1) },
            }}
          >
            <ChevronRightIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 1.5 }}>
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
            <Typography
              key={day}
              variant="caption"
              sx={{
                textAlign: 'center',
                fontWeight: 700,
                color: '#999',
                py: 0.5,
                fontSize: '11px',
                letterSpacing: '0.5px',
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
            const isPast = isPastDate(date)
            const hasTask = hasTasks(date)
            const taskCount = getDateCount(date)

            return (
              <Tooltip 
                key={formatDateToYYYYMMDD(date)} 
                title={isPast ? "Past date - View only" : "Click to view"}
                placement="top"
              >
                <Box
                  onClick={() => handleDateSelect(date)}
                  sx={{
                    aspectRatio: '1',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    borderRadius: '12px',
                    bgcolor: isSelected ? '#6C63FF' : 'transparent',
                    color: isSelected ? 'white' : isPast ? '#bdbdbd' : '#1a1a2e',
                    opacity: isPast ? 0.6 : 1,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: isSelected ? '#5A52D5' : alpha('#6C63FF', 0.08),
                      transform: isSelected ? 'scale(1.02)' : 'scale(1.05)',
                    },
                    position: 'relative',
                  }}
                >
                  {isPast && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: '20px',
                        opacity: 0.15,
                      }}
                    >
                      <BlockIcon fontSize="small" />
                    </Box>
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: isToday ? 700 : 400,
                      fontSize: isToday ? '0.9rem' : '0.8rem',
                      zIndex: 1,
                      position: 'relative',
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
                        bgcolor: '#6C63FF',
                        mt: 0.5,
                        zIndex: 1,
                      }}
                    />
                  )}
                  {hasTask && !isPast && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: isSelected ? 'rgba(255,255,255,0.8)' : '#4caf50',
                        fontSize: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: isSelected ? '#6C63FF' : 'white',
                        fontWeight: 700,
                        zIndex: 1,
                      }}
                    >
                      {taskCount > 1 ? taskCount : ''}
                    </Box>
                  )}
                </Box>
              </Tooltip>
            )
          })}
        </Box>
        
        <Box sx={{ 
          mt: 2, 
          pt: 1.5, 
          borderTop: '1px solid',
          borderColor: alpha('#000', 0.05),
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}>
          <Typography variant="caption" sx={{ color: '#999', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <BlockIcon sx={{ fontSize: 14, color: '#bdbdbd' }} />
            Past dates are view-only
          </Typography>
          <Typography variant="caption" sx={{ color: '#999', display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Box sx={{ width: 8, height: 8, bgcolor: '#4caf50', borderRadius: '50%', display: 'inline-block' }} />
            Has tasks
          </Typography>
        </Box>
      </Popover>
    </Box>
  )
}

export default DateSelector