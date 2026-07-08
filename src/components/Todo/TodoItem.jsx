import { useState } from 'react'
import {
  ListItem,
  Checkbox,
  IconButton,
  TextField,
  Box,
  Typography,
  ListItemSecondaryAction,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material'

const TodoItem = ({ todo, toggleTodo, deleteTodo, editTodo }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)

  const handleEdit = () => {
    setIsEditing(true)
    setEditText(todo.text)
  }

  const handleSave = () => {
    if (editText.trim()) {
      editTodo(todo.id, editText.trim())
      setIsEditing(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditText(todo.text)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  return (
    <ListItem
      sx={{
        bgcolor: '#f8f9fa',
        borderRadius: 2,
        mb: 1,
        transition: 'all 0.2s',
        '&:hover': {
          bgcolor: '#f0f0f0',
        },
        ...(todo.completed && {
          opacity: 0.7,
        }),
      }}
    >
      <Checkbox
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        sx={{
          color: '#1976d2',
          '&.Mui-checked': {
            color: '#1976d2',
          },
        }}
      />

      {isEditing ? (
        <TextField
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onKeyDown={handleKeyPress}
          autoFocus
          size="small"
          sx={{
            flex: 1,
            '& .MuiOutlinedInput-root': {
              bgcolor: 'white',
            },
          }}
        />
      ) : (
        <Typography
          variant="body1"
          sx={{
            flex: 1,
            textDecoration: todo.completed ? 'line-through' : 'none',
            color: todo.completed ? '#999' : '#333',
            wordBreak: 'break-word',
          }}
        >
          {todo.text}
        </Typography>
      )}

      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {isEditing ? (
          <>
            <IconButton
              onClick={handleSave}
              size="small"
              color="primary"
              sx={{ '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.1)' } }}
            >
              <SaveIcon />
            </IconButton>
            <IconButton
              onClick={handleCancel}
              size="small"
              color="error"
              sx={{ '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' } }}
            >
              <CancelIcon />
            </IconButton>
          </>
        ) : (
          <>
            <IconButton
              onClick={handleEdit}
              size="small"
              color="primary"
              sx={{ '&:hover': { bgcolor: 'rgba(25, 118, 210, 0.1)' } }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => deleteTodo(todo.id)}
              size="small"
              color="error"
              sx={{ '&:hover': { bgcolor: 'rgba(211, 47, 47, 0.1)' } }}
            >
              <DeleteIcon />
            </IconButton>
          </>
        )}
      </Box>
    </ListItem>
  )
}

export default TodoItem