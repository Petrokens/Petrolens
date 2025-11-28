// Professional Discipline Selector Component with Material UI

import { DISCIPLINES } from '../../config/constants.js';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';

export function DisciplineSelector({ selectedDiscipline, onSelect, disabled = false }) {
  return (
    <Box sx={{ width: '100%', maxWidth: 400 }}>
      <FormControl fullWidth size="medium">
        <InputLabel id="discipline-select-label">Select Discipline</InputLabel>
        <Select
          labelId="discipline-select-label"
          id="discipline-select"
          value={selectedDiscipline || ''}
          onChange={(e) => onSelect(e.target.value)}
          disabled={disabled}
          label="Select Discipline"
        >
          <MenuItem value="">
            <em>-- Select Discipline --</em>
          </MenuItem>
          {DISCIPLINES.map((discipline) => (
            <MenuItem key={discipline} value={discipline}>
              {discipline}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}

