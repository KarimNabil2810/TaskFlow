import { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Home from './components/Home/Home'
import './App.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#6C63FF',
      light: '#8B83FF',
      dark: '#5A52D5',
    },
    secondary: {
      main: '#FF6584',
      light: '#FF85A0',
      dark: '#E55A78',
    },
    background: {
      default: '#f0f2f5',
      paper: '#ffffff',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #6C63FF 0%, #FF6584 100%)',
      secondary: 'linear-gradient(135deg, #FF6584 0%, #FFB347 100%)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
      letterSpacing: '-0.5px',
    },
    h6: {
      fontWeight: 600,
      letterSpacing: '-0.3px',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0 2px 8px rgba(108, 99, 255, 0.08)',
    '0 4px 16px rgba(108, 99, 255, 0.12)',
    '0 8px 32px rgba(108, 99, 255, 0.16)',
    '0 12px 48px rgba(108, 99, 255, 0.2)',
    '0 16px 64px rgba(108, 99, 255, 0.24)',
    ...Array(20).fill('none'),
  ],
})

// Helper function to format date as YYYY-MM-DD without timezone issues
const formatDateToYYYYMMDD = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function App() {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem('todos')
    return savedTodos ? JSON.parse(savedTodos) : {}
  })

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return formatDateToYYYYMMDD(today)
  })

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])

  const getTodosForDate = (date) => {
    return todos[date] || []
  }

  const addTodo = (taskData, date) => {
    const dateKey = date || selectedDate
    const newTodo = {
      id: Date.now(),
      ...taskData,
    }
    
    setTodos((prev) => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), newTodo],
    }))
  }

  const toggleTodo = (id, date) => {
    const dateKey = date || selectedDate
    setTodos((prev) => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ),
    }))
  }

  const deleteTodo = (id, date) => {
    const dateKey = date || selectedDate
    setTodos((prev) => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).filter((todo) => todo.id !== id),
    }))
  }

  const editTodo = (id, newText, date) => {
    const dateKey = date || selectedDate
    setTodos((prev) => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).map((todo) =>
        todo.id === id ? { ...todo, text: newText } : todo
      ),
    }))
  }

  const clearCompleted = (date) => {
    const dateKey = date || selectedDate
    setTodos((prev) => ({
      ...prev,
      [dateKey]: (prev[dateKey] || []).filter((todo) => !todo.completed),
    }))
  }

  const getDateTasks = (date) => {
    return todos[date] || []
  }

  const getAllDates = () => {
    return Object.keys(todos).sort()
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Home
        todos={getTodosForDate(selectedDate)}
        allTodos={todos}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        addTodo={addTodo}
        toggleTodo={toggleTodo}
        deleteTodo={deleteTodo}
        editTodo={editTodo}
        clearCompleted={clearCompleted}
        getDateTasks={getDateTasks}
        getAllDates={getAllDates}
      />
    </ThemeProvider>
  )
}

export default App