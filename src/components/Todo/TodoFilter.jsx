import { ToggleButtonGroup, ToggleButton, Box } from '@mui/material'
import {
  FormatListBulleted as AllIcon,
  CheckCircle as CompletedIcon,
  RadioButtonUnchecked as ActiveIcon,
} from '@mui/icons-material'

const TodoFilter = ({ filter, setFilter }) => {
  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter)
    }
  }

  return (
    <Box>
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={handleFilterChange}
        size="small"
        sx={{
          '& .MuiToggleButton-root': {
            px: 2,
            py: 1,
            textTransform: 'none',
            '&.Mui-selected': {
              bgcolor: '#1976d2',
              color: 'white',
              '&:hover': {
                bgcolor: '#1565c0',
              },
            },
          },
        }}
      >
        <ToggleButton value="all">
          <AllIcon sx={{ mr: 0.5 }} fontSize="small" />
          All
        </ToggleButton>
        <ToggleButton value="active">
          <ActiveIcon sx={{ mr: 0.5 }} fontSize="small" />
          Active
        </ToggleButton>
        <ToggleButton value="completed">
          <CompletedIcon sx={{ mr: 0.5 }} fontSize="small" />
          Completed
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}

export default TodoFilter