import { useState } from 'react';
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Typography
} from '@mui/material';

const STATUS_OPTIONS = [
  { value: 'IFR', label: 'IFR - Issued for Review' },
  { value: 'IFA', label: 'IFA - Issued for Approval' },
  { value: 'IFC', label: 'IFC - Issued for Construction' },
  { value: 'AS_BUILT', label: 'As-Built' }
];

export function DocumentMeta({ onMetaChange, disabled = false }) {
  const [meta, setMeta] = useState({
    projectName: '',
    clientName: '',
    contractNumber: '',
    package: '',
    title: '',
    documentNumber: '',
    revision: '',
    status: 'IFR',
    dueDate: '',
    owner: '',
    confidentiality: 'Internal',
    notes: ''
  });

  const handleChange = (field, value) => {
    const updated = { ...meta, [field]: value };
    setMeta(updated);
    onMetaChange(updated);
  };

  return (
    <Stack spacing={3}>
      <Typography variant="h6" fontWeight={600}>
        Document Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <TextField
            label="Project / Unit"
            value={meta.projectName}
            onChange={(e) => handleChange('projectName', e.target.value)}
            disabled={disabled}
            placeholder="e.g., Gas Compression Upgrade"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Client / Asset Owner"
            value={meta.clientName}
            onChange={(e) => handleChange('clientName', e.target.value)}
            disabled={disabled}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Contract / PO Number"
            value={meta.contractNumber}
            onChange={(e) => handleChange('contractNumber', e.target.value)}
            disabled={disabled}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Package / WBS"
            value={meta.package}
            onChange={(e) => handleChange('package', e.target.value)}
            disabled={disabled}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Due Date"
            type="date"
            value={meta.dueDate}
            onChange={(e) => handleChange('dueDate', e.target.value)}
            disabled={disabled}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Document Title"
            value={meta.title}
            onChange={(e) => handleChange('title', e.target.value)}
            disabled={disabled}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Document Number"
            value={meta.documentNumber}
            onChange={(e) => handleChange('documentNumber', e.target.value)}
            disabled={disabled}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <TextField
            label="Revision"
            value={meta.revision}
            onChange={(e) => handleChange('revision', e.target.value)}
            disabled={disabled}
            placeholder="Rev. 0"
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              value={meta.status}
              onChange={(e) => handleChange('status', e.target.value)}
              disabled={disabled}
            >
              {STATUS_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Document Owner / Engineer"
            value={meta.owner}
            onChange={(e) => handleChange('owner', e.target.value)}
            disabled={disabled}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel id="confidentiality-label">Confidentiality</InputLabel>
            <Select
              labelId="confidentiality-label"
              label="Confidentiality"
              value={meta.confidentiality}
              onChange={(e) => handleChange('confidentiality', e.target.value)}
              disabled={disabled}
            >
              <MenuItem value="Internal">Internal</MenuItem>
              <MenuItem value="Restricted">Restricted</MenuItem>
              <MenuItem value="Confidential">Confidential</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Reviewer Notes / Additional Context"
            value={meta.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            disabled={disabled}
            fullWidth
            multiline
            minRows={3}
          />
        </Grid>
      </Grid>
    </Stack>
  );
}

