// Professional File Upload Component with Material UI

import { useState } from 'react';
import { FILE_TYPES, MAX_FILE_SIZE } from '../../config/constants.js';
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  Stack,
  alpha
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export function FileUpload({ onFileSelect, disabled = false }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const validateFile = (file) => {
    setError(null);

    if (!file) {
      setError('No file selected');
      return false;
    }

    // Check file type - support all engineering file types
    const fileName = file.name.toLowerCase();
    const isValidType = 
      file.type === FILE_TYPES.PDF ||
      file.type === FILE_TYPES.DOCX ||
      file.type === FILE_TYPES.DOC ||
      file.type === FILE_TYPES.XLSX ||
      file.type === FILE_TYPES.XLS ||
      file.type === FILE_TYPES.TXT ||
      file.type === FILE_TYPES.RTF ||
      fileName.endsWith('.pdf') ||
      fileName.endsWith('.docx') ||
      fileName.endsWith('.doc') ||
      fileName.endsWith('.xlsx') ||
      fileName.endsWith('.xls') ||
      fileName.endsWith('.txt') ||
      fileName.endsWith('.rtf') ||
      fileName.endsWith('.dwg') ||
      fileName.endsWith('.dxf');

    if (!isValidType) {
      setError('Invalid file type. Please upload engineering documents (PDF, Word, Excel, CAD, Text files).');
      return false;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      setError(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit.`);
      return false;
    }

    return true;
  };

  const handleFile = (file) => {
    if (validateFile(file)) {
      onFileSelect(file);
      setError(null);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <Box>
      <input
        type="file"
        id="file-upload"
        accept=".pdf,.doc,.docx,.xlsx,.xls,.txt,.rtf,.dwg,.dxf"
        onChange={handleChange}
        disabled={disabled}
        style={{ display: 'none' }}
      />
      <Paper
        component="label"
        htmlFor="file-upload"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        sx={{
          p: 4,
          border: `2px dashed ${dragActive ? 'primary.main' : 'grey.300'}`,
          borderRadius: 2,
          bgcolor: dragActive ? alpha('#1976d2', 0.04) : 'grey.50',
          cursor: disabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease-in-out',
          textAlign: 'center',
          opacity: disabled ? 0.6 : 1,
          '&:hover': {
            borderColor: disabled ? 'grey.300' : 'primary.main',
            bgcolor: disabled ? 'grey.50' : alpha('#1976d2', 0.04),
          },
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              bgcolor: dragActive ? 'primary.main' : 'grey.200',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <CloudUploadIcon
              sx={{
                fontSize: 32,
                color: dragActive ? 'white' : 'grey.600',
              }}
            />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {dragActive ? 'Drop file here' : 'Click to upload or drag and drop'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Engineering documents: PDF, Word, Excel, CAD, Text files
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              Maximum file size: {MAX_FILE_SIZE / (1024 * 1024)}MB
            </Typography>
          </Box>
          <Button
            variant="outlined"
            component="span"
            startIcon={<InsertDriveFileIcon />}
            disabled={disabled}
            sx={{ mt: 1 }}
          >
            Browse Files
          </Button>
        </Stack>
      </Paper>
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

