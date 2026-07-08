import { List, Paper } from '@mui/material'
import TodoItem from './TodoItem'

const TodoList = ({ todos, toggleTodo, deleteTodo, editTodo }) => {
  if (todos.length === 0) {
    return (
      <Paper
        elevation={0}
        sx={{
          p: 4,
          textAlign: 'center',
          bgcolor: '#f8f9fa',
          borderRadius: 2,
        }}
      >
        <p style={{ color: '#666', fontSize: '16px' }}>
          No tasks to display
        </p>
      </Paper>
    )
  }

  return (
    <List sx={{ width: '100%', p: 0 }}>
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          editTodo={editTodo}
        />
      ))}
    </List>
  )
}

export default TodoList