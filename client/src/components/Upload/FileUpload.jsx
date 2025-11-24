// File Upload Component

import { useState } from 'react';
import { FILE_TYPES, MAX_FILE_SIZE } from '../../config/constants.js';
import './Upload.css';

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
    <div className="file-upload-container">
      <div
        className={`file-upload-area ${dragActive ? 'drag-active' : ''} ${disabled ? 'disabled' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          accept=".pdf,.doc,.docx,.xlsx,.xls,.txt,.rtf,.dwg,.dxf"
          onChange={handleChange}
          disabled={disabled}
          style={{ display: 'none' }}
        />
        <label htmlFor="file-upload" className="upload-label">
          <div className="upload-icon">📄</div>
          <div className="upload-text">
            <strong>Click to upload</strong> or drag and drop
          </div>
          <div className="upload-hint">
            Engineering documents: PDF, Word, Excel, CAD, Text (Max {MAX_FILE_SIZE / (1024 * 1024)}MB)
          </div>
        </label>
      </div>
      {error && <div className="upload-error">{error}</div>}
    </div>
  );
}

