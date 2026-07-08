import { useState } from 'react'
import {
  TextField,
  IconButton,
  Box,
  Paper,
} from '@mui/material'
import { Add as AddIcon } from '@mui/icons-material'

const TodoForm = ({ addTodo, selectedDate }) => {
  const [text, setText] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (text.trim()) {
      addTodo(text.trim(), selectedDate)
      setText('')
    }
  }

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
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
        placeholder={`Add a new task${selectedDate ? ` for ${new Date(selectedDate).toLocaleDateString()}` : ''}...`}
        value={text}
        onChange={(e) => setText(e.target.value)}
        variant="outlined"
        size="medium"
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: 'white',
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#1976d2',
            },
          },
        }}
      />
      <IconButton
        type="submit"
        color="primary"
        sx={{
          bgcolor: '#1976d2',
          color: 'white',
          '&:hover': {
            bgcolor: '#1565c0',
          },
          width: 56,
          height: 56,
        }}
      >
        <AddIcon />
      </IconButton>
    </Paper>
  )
}

export default TodoForm