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
  alpha,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
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
  Warning as WarningIcon,
} from '@mui/icons-material'

const TodoItem = ({ todo, toggleTodo, deleteTodo, editTodo, selectedDate }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [expanded, setExpanded] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

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

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    deleteTodo(todo.id, selectedDate)
    setDeleteDialogOpen(false)
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return { bg: '#9c27b0', light: alpha('#9c27b0', 0.1) }
      case 'high': return { bg: '#f44336', light: alpha('#f44336', 0.1) }
      case 'medium': return { bg: '#ff9800', light: alpha('#ff9800', 0.1) }
      case 'low': return { bg: '#4caf50', light: alpha('#4caf50', 0.1) }
      default: return { bg: '#757575', light: alpha('#757575', 0.1) }
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

  const isMultiDay = () => {
    if (!todo.startDate || !todo.endDate) return false
    const start = new Date(todo.startDate)
    const end = new Date(todo.endDate)
    return start.toDateString() !== end.toDateString()
  }

  const priorityColors = getPriorityColor(todo.priority)

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          mb: 1.5,
          bgcolor: todo.completed ? alpha('#4caf50', 0.05) : '#fff',
          borderRadius: '14px',
          border: '1px solid',
          borderColor: todo.completed ? alpha('#4caf50', 0.2) : 
                      isOverdue() ? alpha('#f44336', 0.2) : 
                      alpha('#6C63FF', 0.08),
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateX(4px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            borderColor: todo.completed ? alpha('#4caf50', 0.3) : 
                        isOverdue() ? alpha('#f44336', 0.3) : 
                        alpha('#6C63FF', 0.15),
          },
          opacity: todo.completed ? 0.75 : 1,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            background: todo.completed ? '#4caf50' : 
                       isOverdue() ? '#f44336' : 
                       'linear-gradient(135deg, #6C63FF, #FF6584)',
            borderRadius: '4px 0 0 4px',
          },
        }}
      >
        <ListItem sx={{ py: 1.5, pl: 3, pr: 2 }}>
          <Checkbox
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id, selectedDate)}
            sx={{
              color: '#6C63FF',
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
                    borderRadius: '10px',
                    bgcolor: '#f5f5f5',
                  },
                }}
              />
            ) : (
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#999' : '#1a1a2e',
                    wordBreak: 'break-word',
                    fontWeight: todo.priority === 'urgent' ? 600 : 400,
                    fontSize: '15px',
                    lineHeight: 1.5,
                  }}
                >
                  {todo.text}
                </Typography>
                
                <Stack direction="row" spacing={0.5} sx={{ mt: 0.5, flexWrap: 'wrap', gap: 0.5 }}>
                  {todo.priority && (
                    <Chip
                      size="small"
                      label={getPriorityLabel(todo.priority)}
                      sx={{
                        bgcolor: priorityColors.light,
                        color: priorityColors.bg,
                        height: 22,
                        fontSize: '0.65rem',
                        fontWeight: 600,
                        borderRadius: '6px',
                      }}
                    />
                  )}
                  {todo.category && (
                    <Chip
                      size="small"
                      label={`${getCategoryEmoji(todo.category)} ${todo.category.charAt(0).toUpperCase() + todo.category.slice(1)}`}
                      sx={{
                        bgcolor: alpha('#6C63FF', 0.08),
                        color: '#6C63FF',
                        height: 22,
                        fontSize: '0.65rem',
                        borderRadius: '6px',
                      }}
                    />
                  )}
                  {todo.startDate && (
                    <Chip
                      size="small"
                      icon={<ScheduleIcon sx={{ fontSize: 12 }} />}
                      label={formatDateOnly(todo.startDate)}
                      sx={{
                        bgcolor: alpha('#6C63FF', 0.05),
                        color: '#666',
                        height: 22,
                        fontSize: '0.65rem',
                        borderRadius: '6px',
                      }}
                    />
                  )}
                  {isMultiDay() && (
                    <Chip
                      size="small"
                      label="📅 Multi-day"
                      sx={{
                        bgcolor: alpha('#FF6584', 0.1),
                        color: '#FF6584',
                        height: 22,
                        fontSize: '0.65rem',
                        borderRadius: '6px',
                      }}
                    />
                  )}
                  {isOverdue() && (
                    <Chip
                      size="small"
                      label="⚠️ Overdue"
                      sx={{
                        bgcolor: alpha('#f44336', 0.1),
                        color: '#f44336',
                        height: 22,
                        fontSize: '0.65rem',
                        borderRadius: '6px',
                        fontWeight: 600,
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
                sx={{ 
                  color: '#999',
                  transition: 'transform 0.3s ease',
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                <ExpandMoreIcon />
              </IconButton>
            )}
            {isEditing ? (
              <>
                <IconButton
                  onClick={handleSave}
                  size="small"
                  sx={{ 
                    color: '#4caf50',
                    '&:hover': { bgcolor: alpha('#4caf50', 0.1) },
                  }}
                >
                  <SaveIcon />
                </IconButton>
                <IconButton
                  onClick={handleCancel}
                  size="small"
                  sx={{ 
                    color: '#f44336',
                    '&:hover': { bgcolor: alpha('#f44336', 0.1) },
                  }}
                >
                  <CancelIcon />
                </IconButton>
              </>
            ) : (
              <>
                <IconButton
                  onClick={handleEdit}
                  size="small"
                  sx={{ 
                    color: '#6C63FF',
                    '&:hover': { bgcolor: alpha('#6C63FF', 0.1) },
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  onClick={handleDeleteClick}
                  size="small"
                  sx={{ 
                    color: '#FF6584',
                    '&:hover': { bgcolor: alpha('#FF6584', 0.1) },
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </>
            )}
          </Box>
        </ListItem>

        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <Box sx={{ 
            p: 2.5, 
            bgcolor: alpha('#f5f5f5', 0.5),
            borderTop: '1px solid',
            borderColor: alpha('#000', 0.05),
          }}>
            <Stack spacing={1.5}>
              {todo.startDate && (
                <Box display="flex" alignItems="center" gap={1.5}>
                  <ScheduleIcon sx={{ fontSize: 18, color: '#6C63FF' }} />
                  <Typography variant="body2" color="textSecondary">
                    <strong>Start:</strong> {formatDateTime(todo.startDate)}
                  </Typography>
                </Box>
              )}
              {todo.endDate && (
                <Box display="flex" alignItems="center" gap={1.5}>
                  <ScheduleIcon sx={{ fontSize: 18, color: '#FF6584' }} />
                  <Typography variant="body2" color="textSecondary">
                    <strong>End:</strong> {formatDateTime(todo.endDate)}
                    {isOverdue() && (
                      <span style={{ color: '#f44336', marginLeft: '8px', fontWeight: 600 }}>
                        (Overdue!)
                      </span>
                    )}
                  </Typography>
                </Box>
              )}
              {todo.priority && (
                <Box display="flex" alignItems="center" gap={1.5}>
                  <PriorityHighIcon sx={{ fontSize: 18, color: priorityColors.bg }} />
                  <Typography variant="body2" color="textSecondary">
                    <strong>Priority:</strong> {getPriorityLabel(todo.priority)}
                  </Typography>
                </Box>
              )}
              {todo.category && (
                <Box display="flex" alignItems="center" gap={1.5}>
                  <CategoryIcon sx={{ fontSize: 18, color: '#6C63FF' }} />
                  <Typography variant="body2" color="textSecondary">
                    <strong>Category:</strong> {todo.category.charAt(0).toUpperCase() + todo.category.slice(1)}
                  </Typography>
                </Box>
              )}
              {isMultiDay() && (
                <Box display="flex" alignItems="center" gap={1.5}>
                  <span style={{ fontSize: '18px' }}>📅</span>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Multi-day task:</strong> Spans {Math.ceil((new Date(todo.endDate) - new Date(todo.startDate)) / (1000 * 60 * 60 * 24))} days
                  </Typography>
                </Box>
              )}
              {todo.createdAt && (
                <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, opacity: 0.6 }}>
                  Created: {formatDateTime(todo.createdAt)}
                </Typography>
              )}
            </Stack>
          </Box>
        </Collapse>
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
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
              bgcolor: alpha('#f44336', 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <WarningIcon sx={{ fontSize: 35, color: '#f44336' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a2e' }}>
              Delete Task?
            </Typography>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" textAlign="center" sx={{ py: 1 }}>
            Are you sure you want to delete this task?
          </Typography>
          <Box sx={{ 
            mt: 2, 
            p: 2, 
            bgcolor: alpha('#f44336', 0.05),
            borderRadius: '12px',
            border: '1px solid',
            borderColor: alpha('#f44336', 0.1),
          }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#1a1a2e' }}>
              "{todo.text}"
            </Typography>
            {todo.priority && (
              <Chip
                size="small"
                label={getPriorityLabel(todo.priority)}
                sx={{
                  mt: 1,
                  bgcolor: priorityColors.light,
                  color: priorityColors.bg,
                  height: 22,
                  fontSize: '0.65rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                }}
              />
            )}
          </Box>
          <Typography variant="caption" color="textSecondary" textAlign="center" display="block" sx={{ mt: 2 }}>
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 1, pb: 3 }}>
          <Button 
            onClick={handleDeleteCancel}
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
            onClick={handleDeleteConfirm}
            variant="contained"
            sx={{
              borderRadius: '12px',
              px: 4,
              background: 'linear-gradient(135deg, #f44336, #d32f2f)',
              '&:hover': {
                background: 'linear-gradient(135deg, #d32f2f, #c62828)',
                boxShadow: '0 4px 20px rgba(244, 67, 54, 0.3)',
              },
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TodoItem