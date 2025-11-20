// Discipline Selector Component

import { DISCIPLINES } from '../../config/constants.js';
import './Dashboard.css';

export function DisciplineSelector({ selectedDiscipline, onSelect, disabled = false }) {
  return (
    <div className="discipline-selector">
      <label htmlFor="discipline-select">Select Discipline:</label>
      <select
        id="discipline-select"
        value={selectedDiscipline || ''}
        onChange={(e) => onSelect(e.target.value)}
        disabled={disabled}
        className="discipline-select"
      >
        <option value="">-- Select Discipline --</option>
        {DISCIPLINES.map((discipline) => (
          <option key={discipline} value={discipline}>
            {discipline}
          </option>
        ))}
      </select>
    </div>
  );
}

