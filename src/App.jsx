import { useState, useEffect } from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Home from './components/Home/Home'
import './App.css'

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
  },
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

  const addTodo = (text, date) => {
    const dateKey = date || selectedDate
    const newTodo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
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