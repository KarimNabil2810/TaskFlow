import { useState } from 'react'
import {
  Container,
  Paper,
  Typography,
  Box,
  Divider,
} from '@mui/material'
import TodoForm from '../Todo/TodoForm'
import TodoList from '../Todo/TodoList'
import TodoFilter from '../Todo/TodoFilter'
import styles from './Home.module.css'

const Home = ({
  todos,
  addTodo,
  toggleTodo,
  deleteTodo,
  editTodo,
  clearCompleted,
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

        <TodoForm addTodo={addTodo} />

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
        />

        {todos.length > 0 && (
          <Box className={styles.footer}>
            <TodoFilter filter={filter} setFilter={setFilter} />
            {todos.some((todo) => todo.completed) && (
              <button
                onClick={clearCompleted}
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