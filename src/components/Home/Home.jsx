import { useState } from 'react'
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  IconButton,
  Tooltip,
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Block as BlockIcon,
  Today as TodayIcon,
  Warning as WarningIcon,
} from '@mui/icons-material'
import TodoForm from '../Todo/TodoForm'
import TodoList from '../Todo/TodoList'
import TodoFilter from '../Todo/TodoFilter'
import DateSelector from '../Todo/DateSelector'
import styles from './Home.module.css'

// Helper function to format date as YYYY-MM-DD without timezone issues
const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const Home = ({
  todos,
  allTodos,
  selectedDate,
  setSelectedDate,
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  clearCompleted,
  getDateTasks,
  getAllDates,
}) => {
  const [filter, setFilter] = useState('all')
  const [clearDialogOpen, setClearDialogOpen] = useState(false)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter((todo) => !todo.completed)
      case 'completed':
        return todos.filter((todo) => todo.completed)
      default:
        return todos
    }
  }

  const filteredTodos = getFilteredTodos()
  const activeCount = todos.filter((todo) => !todo.completed).length
  const completedCount = todos.filter((todo) => todo.completed).length

  const isPastDate = (dateString) => {
    const today = new Date()
    const todayStr = formatDateToYYYYMMDD(today)
    return dateString < todayStr
  }

  const handleDateChange = (newDate) => {
    setSelectedDate(newDate)
    setFilter('all')
  }

  const handlePreviousDay = () => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() - 1)
    const newDateStr = formatDateToYYYYMMDD(date)
    handleDateChange(newDateStr)
  }

  const handleNextDay = () => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() + 1)
    handleDateChange(formatDateToYYYYMMDD(date))
  }

  const handleToday = () => {
    const today = new Date()
    handleDateChange(formatDateToYYYYMMDD(today))
  }

  const handleClearClick = () => {
    setClearDialogOpen(true)
  }

  const handleClearConfirm = () => {
    clearCompleted(selectedDate)
    setClearDialogOpen(false)
  }

  const handleClearCancel = () => {
    setClearDialogOpen(false)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayStr = formatDateToYYYYMMDD(today)
    const yesterdayStr = formatDateToYYYYMMDD(yesterday)
    const tomorrowStr = formatDateToYYYYMMDD(tomorrow)

    if (dateString === todayStr) {
      return 'Today'
    } else if (dateString === yesterdayStr) {
      return 'Yesterday'
    } else if (dateString === tomorrowStr) {
      return 'Tomorrow'
    } else {
      // Short format for mobile
      if (isMobile) {
        return date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        })
      }
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    }
  }

  const isToday = (dateString) => {
    const today = new Date()
    return dateString === formatDateToYYYYMMDD(today)
  }

  return (
    <>
      <Container maxWidth="md" className={styles.container}>
        <Box className={styles.backgroundDecorations}>
          <div className={`${styles.decorationCircle} ${styles.decoration1}`} />
          <div className={`${styles.decorationCircle} ${styles.decoration2}`} />
          <div className={`${styles.decorationCircle} ${styles.decoration3}`} />
        </Box>

        <Paper elevation={3} className={`${styles.paper} fade-in-up`}>
          {/* Header with gradient - Centered */}
          <Box className={styles.header}>
            <Box className={styles.headerContent}>
              <div className={styles.logoWrapper}>
                <div className={styles.logoIcon}>✨</div>
                <Typography variant="h4" component="h1" className={styles.title}>
                  TaskFlow
                </Typography>
              </div>
              <Typography variant="subtitle1" className={styles.subtitle}>
                Organize your tasks with style
              </Typography>
            </Box>
          </Box>

          {/* Date Navigation - Compact for mobile */}
          <Box className={styles.dateNavigation}>
            <IconButton 
              onClick={handlePreviousDay} 
              className={styles.navButton}
              size={isMobile ? 'small' : 'medium'}
            >
              <ArrowBackIcon />
            </IconButton>
            
            <Box className={styles.dateDisplay}>
              <Typography variant="h6" className={styles.dateText}>
                {formatDate(selectedDate)}
              </Typography>
              <Box className={styles.dateActions}>
                {!isToday(selectedDate) && (
                  <button onClick={handleToday} className={styles.todayButton}>
                    <TodayIcon sx={{ fontSize: isMobile ? 14 : 16 }} />
                    {!isMobile && 'Today'}
                  </button>
                )}
                {isPastDate(selectedDate) && (
                  <Box className={styles.viewOnlyBadge}>
                    <BlockIcon />
                    {!isMobile && <span>View Only</span>}
                  </Box>
                )}
              </Box>
            </Box>
            
            <IconButton 
              onClick={handleNextDay} 
              className={styles.navButton}
              size={isMobile ? 'small' : 'medium'}
            >
              <ArrowForwardIcon />
            </IconButton>
          </Box>

          <DateSelector
            selectedDate={selectedDate}
            onDateChange={handleDateChange}
            getAllDates={getAllDates}
            getDateTasks={getDateTasks}
          />

          <TodoForm addTodo={addTodo} selectedDate={selectedDate} />

          {isPastDate(selectedDate) && (
            <Box className={styles.warningBanner}>
              <BlockIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2">
                {isMobile ? 'View only - Past date' : 'This is a past date. You can view tasks but cannot add new ones.'}
              </Typography>
            </Box>
          )}

          <Divider className={styles.divider} />

          {/* Stats */}
          <Box className={styles.stats}>
            <Box className={styles.statItem}>
              <span className={styles.statNumber}>{activeCount}</span>
              <span className={styles.statLabel}>Active</span>
            </Box>
            <Box className={styles.statDivider} />
            <Box className={styles.statItem}>
              <span className={styles.statNumber}>{todos.length}</span>
              <span className={styles.statLabel}>Total</span>
            </Box>
            <Box className={styles.statDivider} />
            <Box className={styles.statItem}>
              <span className={styles.statNumber}>{completedCount}</span>
              <span className={styles.statLabel}>Completed</span>
            </Box>
          </Box>

          <TodoList
            todos={filteredTodos}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
            selectedDate={selectedDate}
          />

          {todos.length > 0 && (
            <Box className={styles.footer}>
              <TodoFilter filter={filter} setFilter={setFilter} />
              {completedCount > 0 && (
                <button
                  onClick={handleClearClick}
                  className={styles.clearButton}
                >
                  {isMobile ? `Clear (${completedCount})` : `Clear Completed (${completedCount})`}
                </button>
              )}
            </Box>
          )}
        </Paper>
      </Container>

      {/* Clear Completed Confirmation Dialog */}
      <Dialog
        open={clearDialogOpen}
        onClose={handleClearCancel}
        PaperProps={{
          sx: {
            borderRadius: '20px',
            p: 2,
            maxWidth: '420px',
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
              Clear Completed Tasks?
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" textAlign="center" sx={{ py: 1 }}>
            This will permanently delete all completed tasks for this day.
          </Typography>
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            bgcolor: alpha('#FF6584', 0.05),
            borderRadius: '12px',
            border: '1px solid',
            borderColor: alpha('#FF6584', 0.1),
            textAlign: 'center',
          }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: '#FF6584' }}>
              {completedCount}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              completed task{completedCount !== 1 ? 's' : ''} will be removed
            </Typography>
          </Box>
          <Typography variant="caption" color="textSecondary" textAlign="center" display="block" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 1, pb: 3 }}>
          <Button 
            onClick={handleClearCancel}
            sx={{ 
              borderRadius: '12px',
              px: 3,
              color: '#666',
              '&:hover': { bgcolor: alpha('#000', 0.05) },
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleClearConfirm}
            variant="contained"
            sx={{
              borderRadius: '12px',
              px: 4,
              background: 'linear-gradient(135deg, #FF6584, #E55A78)',
              '&:hover': {
                background: 'linear-gradient(135deg, #E55A78, #CC4A68)',
                boxShadow: '0 4px 20px rgba(255, 101, 132, 0.3)',
              },
            }}
          >
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Home