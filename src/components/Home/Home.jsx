import { useState } from 'react'
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
  IconButton,
  Tooltip,
} from '@mui/material'
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  Block as BlockIcon,
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

  const isPastDate = (dateString) => {
    const today = new Date()
    const todayStr = formatDateToYYYYMMDD(today)
    return dateString < todayStr
  }

  const handleDateChange = (newDate) => {
    // Allow any date to be viewed, but adding tasks will be blocked
    setSelectedDate(newDate)
    setFilter('all')
  }

  const handlePreviousDay = () => {
    const date = new Date(selectedDate)
    date.setDate(date.getDate() - 1)
    const newDateStr = formatDateToYYYYMMDD(date)
    // Allow going to any past date for viewing
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
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }
  }

  const isToday = (dateString) => {
    const today = new Date()
    return dateString === formatDateToYYYYMMDD(today)
  }

  return (
    <Container maxWidth="md" className={styles.container}>
      <Paper elevation={3} className={styles.paper}>
        <Box className={styles.header}>
          <Typography variant="h4" component="h1" gutterBottom>
            TaskFlow
          </Typography>
          <Typography variant="subtitle1" color="textSecondary">
            Organize your tasks efficiently
          </Typography>
        </Box>

        <Box className={styles.dateNavigation}>
          <IconButton onClick={handlePreviousDay} size="small">
            <ArrowBackIcon />
          </IconButton>
          
          <Box className={styles.dateDisplay}>
            <Typography variant="h6" component="div">
              {formatDate(selectedDate)}
            </Typography>
            {!isToday(selectedDate) && (
              <button onClick={handleToday} className={styles.todayButton}>
                Go to Today
              </button>
            )}
            {isPastDate(selectedDate) && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                <BlockIcon sx={{ fontSize: 16, color: '#f44336' }} />
                <Typography variant="caption" color="error">
                  View Only - Past Date
                </Typography>
              </Box>
            )}
          </Box>
          
          <IconButton onClick={handleNextDay} size="small">
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
          <Box sx={{ mt: 1, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
            <Typography variant="caption" color="warning.main">
              ⚠️ This is a past date. You can view tasks but cannot add new ones.
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 3 }} />

        <Box className={styles.stats}>
          <Typography variant="body2" color="textSecondary">
            {activeCount} task{activeCount !== 1 ? 's' : ''} remaining
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Total: {todos.length} task{todos.length !== 1 ? 's' : ''}
          </Typography>
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
            {todos.some((todo) => todo.completed) && (
              <button
                onClick={() => clearCompleted(selectedDate)}
                className={styles.clearButton}
              >
                Clear Completed
              </button>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  )
}

export default Home