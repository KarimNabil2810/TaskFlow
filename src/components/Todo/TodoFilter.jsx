import { ToggleButtonGroup, ToggleButton, Box, alpha } from '@mui/material'
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
            px: 2.5,
            py: 1,
            textTransform: 'none',
            borderRadius: '10px !important',
            border: '1px solid',
            borderColor: alpha('#6C63FF', 0.1),
            color: '#666',
            fontWeight: 500,
            fontSize: '13px',
            transition: 'all 0.3s ease',
            '&:hover': {
              bgcolor: alpha('#6C63FF', 0.05),
              borderColor: alpha('#6C63FF', 0.2),
            },
            '&.Mui-selected': {
              bgcolor: '#6C63FF',
              color: 'white',
              borderColor: '#6C63FF',
              '&:hover': {
                bgcolor: '#5A52D5',
                borderColor: '#5A52D5',
              },
            },
          },
        }}
      >
        <ToggleButton value="all">
          <AllIcon sx={{ mr: 0.5, fontSize: 18 }} />
          All
        </ToggleButton>
        <ToggleButton value="active">
          <ActiveIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Active
        </ToggleButton>
        <ToggleButton value="completed">
          <CompletedIcon sx={{ mr: 0.5, fontSize: 18 }} />
          Completed
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  )
}

export default TodoFilter