import { useState } from 'react'
import {
  ListItem,
  Checkbox,
  IconButton,
  TextField,
  Box,
  Typography,
  Chip,
  Stack,
  Collapse,
  Paper,
} from '@mui/material'
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Schedule as ScheduleIcon,
  PriorityHigh as PriorityHighIcon,
  Category as CategoryIcon,
} from '@mui/icons-material'

const TodoItem = ({ todo, toggleTodo, deleteTodo, editTodo, selectedDate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [expanded, setExpanded] = useState(false)

  const handleEdit = () => {
    setIsEditing(true)
    setEditText(todo.text)
  }

  const handleSave = () => {
    if (editText.trim()) {
      editTodo(todo.id, editText.trim(), selectedDate)
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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return '#9c27b0'
      case 'high': return '#f44336'
      case 'medium': return '#ff9800'
      case 'low': return '#4caf50'
      default: return '#757575'
    }
  }

  const getPriorityLabel = (priority) => {
    return priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Medium'
  }

  const getCategoryEmoji = (category) => {
    const emojis = {
      personal: '👤',
      work: '💼',
      study: '📚',
      health: '🏥',
      shopping: '🛒',
      other: '📌'
    }
    return emojis[category] || '📌'
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatDateOnly = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const isOverdue = () => {
    if (!todo.endDate) return false
    const endDate = new Date(todo.endDate)
    const now = new Date()
    return endDate < now && !todo.completed
  }

  // Check if task spans multiple days
  const isMultiDay = () => {
    if (!todo.startDate || !todo.endDate) return false
    const start = new Date(todo.startDate)
    const end = new Date(todo.endDate)
    return start.toDateString() !== end.toDateString()
  }

  return (
    <Paper
      elevation={0}
      sx={{
        mb: 1,
        bgcolor: '#f8f9fa',
        borderLeft: todo.completed ? '4px solid #4caf50' : 
                    isOverdue() ? '4px solid #f44336' : 
                    '4px solid #1976d2',
        transition: 'all 0.2s',
        '&:hover': {
          bgcolor: '#f0f0f0',
        },
        opacity: todo.completed ? 0.7 : 1,
      }}
    >
      <ListItem sx={{ py: 1 }}>
        <Checkbox
          checked={todo.completed}
          onChange={() => toggleTodo(todo.id, selectedDate)}
          sx={{
            color: '#1976d2',
            '&.Mui-checked': {
              color: '#4caf50',
            },
          }}
        />

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {isEditing ? (
            <TextField
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyPress}
              autoFocus
              size="small"
              fullWidth
              sx={{
                '& .MuiOutlinedInput-root': {
                  bgcolor: 'white',
                },
              }}
            />
          ) : (
            <Box>
              <Typography
                variant="body1"
                sx={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? '#999' : '#333',
                  wordBreak: 'break-word',
                  fontWeight: todo.priority === 'urgent' ? 600 : 400,
                }}
              >
                {todo.text}
              </Typography>
              
              {/* Tags */}
              <Stack direction="row" spacing={1} sx={{ mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                {todo.priority && (
                  <Chip
                    size="small"
                    label={getPriorityLabel(todo.priority)}
                    sx={{
                      bgcolor: getPriorityColor(todo.priority),
                      color: 'white',
                      height: 20,
                      fontSize: '0.65rem',
                    }}
                  />
                )}
                {todo.category && (
                  <Chip
                    size="small"
                    label={`${getCategoryEmoji(todo.category)} ${todo.category.charAt(0).toUpperCase() + todo.category.slice(1)}`}
                    sx={{
                      bgcolor: '#e0e0e0',
                      height: 20,
                      fontSize: '0.65rem',
                    }}
                  />
                )}
                {todo.startDate && (
                  <Chip
                    size="small"
                    icon={<ScheduleIcon sx={{ fontSize: 12 }} />}
                    label={formatDateOnly(todo.startDate)}
                    sx={{
                      bgcolor: '#e3f2fd',
                      height: 20,
                      fontSize: '0.65rem',
                    }}
                  />
                )}
                {isMultiDay() && (
                  <Chip
                    size="small"
                    label="📅 Multi-day"
                    sx={{
                      bgcolor: '#fff3e0',
                      height: 20,
                      fontSize: '0.65rem',
                    }}
                  />
                )}
                {isOverdue() && (
                  <Chip
                    size="small"
                    label="⚠️ Overdue"
                    sx={{
                      bgcolor: '#f44336',
                      color: 'white',
                      height: 20,
                      fontSize: '0.65rem',
                    }}
                  />
                )}
              </Stack>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {!isEditing && (
            <IconButton
              onClick={() => setExpanded(!expanded)}
              size="small"
              sx={{ color: '#666' }}
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
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
                onClick={() => deleteTodo(todo.id, selectedDate)}
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

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderTop: '1px solid #e0e0e0' }}>
          <Stack spacing={1.5}>
            {todo.startDate && (
              <Box display="flex" alignItems="center" gap={1}>
                <ScheduleIcon sx={{ fontSize: 16, color: '#666' }} />
                <Typography variant="body2" color="textSecondary">
                  <strong>Start:</strong> {formatDateTime(todo.startDate)}
                </Typography>
              </Box>
            )}
            {todo.endDate && (
              <Box display="flex" alignItems="center" gap={1}>
                <ScheduleIcon sx={{ fontSize: 16, color: '#666' }} />
                <Typography variant="body2" color="textSecondary">
                  <strong>End:</strong> {formatDateTime(todo.endDate)}
                  {isOverdue() && (
                    <span style={{ color: '#f44336', marginLeft: '8px' }}>
                      (Overdue!)
                    </span>
                  )}
                </Typography>
              </Box>
            )}
            {todo.priority && (
              <Box display="flex" alignItems="center" gap={1}>
                <PriorityHighIcon sx={{ fontSize: 16, color: '#666' }} />
                <Typography variant="body2" color="textSecondary">
                  <strong>Priority:</strong> {getPriorityLabel(todo.priority)}
                </Typography>
              </Box>
            )}
            {todo.category && (
              <Box display="flex" alignItems="center" gap={1}>
                <CategoryIcon sx={{ fontSize: 16, color: '#666' }} />
                <Typography variant="body2" color="textSecondary">
                  <strong>Category:</strong> {todo.category.charAt(0).toUpperCase() + todo.category.slice(1)}
                </Typography>
              </Box>
            )}
            {isMultiDay() && (
              <Box display="flex" alignItems="center" gap={1}>
                <span style={{ fontSize: '16px' }}>📅</span>
                <Typography variant="body2" color="textSecondary">
                  <strong>Multi-day task:</strong> Spans {Math.ceil((new Date(todo.endDate) - new Date(todo.startDate)) / (1000 * 60 * 60 * 24))} days
                </Typography>
              </Box>
            )}
            {todo.createdAt && (
              <Typography variant="caption" color="textSecondary" sx={{ mt: 1 }}>
                Created: {formatDateTime(todo.createdAt)}
              </Typography>
            )}
          </Stack>
        </Box>
      </Collapse>
    </Paper>
  )
}

export default TodoItem