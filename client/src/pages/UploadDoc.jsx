// Upload Document Page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FileUpload } from '../components/Upload/FileUpload.jsx';
import { DocumentMeta } from '../components/Upload/DocumentMeta.jsx';
import { DisciplineSelector } from '../components/Dashboard/DisciplineSelector.jsx';
import { Loader } from '../components/Common/Loader.jsx';
import { APISettings } from '../components/Common/APISettings.jsx';
import { useFileReader } from '../hooks/useFileReader.js';
import { useAIQC } from '../hooks/useAIQC.js';
import { classifyDocument } from '../utils/documentClassifier.js';
import { calculateCombinedScore, getScoreCategory } from '../utils/scoringHelper.js';
import { TerminalLog } from '../components/Common/TerminalLog.jsx';
import {
  Box,
  Typography,
  Stack,
  Button,
  Paper,
  Alert,
  Divider,
  Grid,
  Chip
} from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export function UploadDoc() {
  const { user, isAdmin, hasDisciplineAccess } = useAuth();
  const navigate = useNavigate();
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState(
    isAdmin() ? sessionStorage.getItem('selectedDiscipline') || '' : user?.discipline || ''
  );
  const [documentMeta, setDocumentMeta] = useState(null);
  const [documentType, setDocumentType] = useState(null);
  const [processing, setProcessing] = useState(false);

  const { readFile, content, loading: fileLoading } = useFileReader();
  const { runBothChecks, loading: aiLoading, error: aiError, apiConfig, updateConfig, logs, clearLogs } = useAIQC();
  const [showSettings, setShowSettings] = useState(false);

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    setProcessing(true);
    
    try {
      // Read file content
      const fileContent = await readFile(file);
      
      // Classify document
      const classification = await classifyDocument(file.name, fileContent || '');
      setDocumentType(classification);
    } catch (error) {
      console.error('Error processing file:', error);
    } finally {
      setProcessing(false);
    }
  };

  const handleRunQC = async () => {
    if (!selectedFile) {
      alert('Please select a file first');
      return;
    }

    if (!selectedDiscipline) {
      alert('Please select a discipline');
      return;
    }

    if (!documentMeta?.title) {
      alert('Please fill in document information');
      return;
    }

    if (!content) {
      alert('File content not loaded. Please try uploading again.');
      return;
    }

    setProcessing(true);

    try {
      clearLogs();
      const isDrawing = documentType?.type === 'Drawing';
      const specificType = documentType?.specificType || 'General';

      const results = await runBothChecks(
        documentType?.type || 'Document',
        specificType,
        selectedDiscipline,
        isDrawing,
        content
      );

      // Calculate combined score
      const combinedScore = results.check1.score !== null && results.check2.score !== null
        ? calculateCombinedScore(results.check1.score, results.check2.score)
        : results.check1.score || results.check2.score || null;
      const scoreCategory = combinedScore !== null ? getScoreCategory(combinedScore) : null;

      // Store results in session for report page
      const reportData = {
        check1: results.check1,
        check2: results.check2,
        check1Score: results.check1.score,
        check2Score: results.check2.score,
        combinedScore,
        scoreCategory,
        documentMeta,
        discipline: selectedDiscipline,
        documentType: specificType
      };
      
      sessionStorage.setItem('qcResults', JSON.stringify(reportData));

      navigate('/report');
    } catch (error) {
      console.error('QC analysis error:', error);
      alert(error.message || 'Failed to run QC analysis. Please check your API key configuration.');
    } finally {
      setProcessing(false);
    }
  };

  const isProcessing = processing || fileLoading || aiLoading;

  return (
    <Box sx={{ maxWidth: 'auto', mx: 'auto', pb: 6 }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        justifyContent="space-between"
        sx={{ mb: 3, gap: 2 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Upload Document for QC Analysis
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Prepare the deliverable, configure metadata, and trigger AI reviews.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<SettingsOutlinedIcon />}
          onClick={() => setShowSettings(true)}
        >
          API Settings
        </Button>
      </Stack>

      {showSettings && (
        <APISettings
          apiConfig={apiConfig}
          onConfigChange={updateConfig}
          onClose={() => setShowSettings(false)}
        />
      )}

      {!isAdmin() && (
        <Alert severity="info" sx={{ mb: 3 }}>
          You are uploading documents for <strong>{user?.discipline}</strong> discipline.
        </Alert>
      )}

      {isAdmin() && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Select Discipline
          </Typography>
          <DisciplineSelector
            selectedDiscipline={selectedDiscipline}
            onSelect={setSelectedDiscipline}
            disabled={isProcessing}
          />
        </Paper>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              1. Upload Deliverable
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Supported formats: PDF, DOC, DOCX (max 10 MB)
            </Typography>
            <FileUpload
              onFileSelect={handleFileSelect}
              disabled={isProcessing || !selectedDiscipline}
            />

            {selectedFile && (
              <Paper variant="outlined" sx={{ mt: 2, p: 2, bgcolor: 'grey.50' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <InsertDriveFileIcon color="primary" />
                  <Box>
                    <Typography variant="subtitle2">{selectedFile.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(selectedFile.size / 1024).toFixed(2)} KB
                    </Typography>
                    {documentType && (
                      <Chip
                        label={`${documentType.type} · ${documentType.specificType}`}
                        size="small"
                        color="primary"
                        sx={{ mt: 1 }}
                      />
                    )}
                  </Box>
                </Stack>
              </Paper>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              2. Document Metadata
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Ensure the title, document number, revision, and status match the control register.
            </Typography>
            <DocumentMeta
              onMetaChange={setDocumentMeta}
              disabled={isProcessing}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Workflow Checklist
            </Typography>
            <Stack spacing={2} divider={<Divider flexItem />}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography>AI Provider</Typography>
                <Chip label={apiConfig.provider?.toUpperCase() || 'OpenRouter'} color="primary" variant="outlined" />
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography>Model</Typography>
                <Chip label={apiConfig.model || 'Auto (free-tier)'} />
              </Stack>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography>Max Tokens</Typography>
                <Chip label={apiConfig.maxTokens || 2000} />
              </Stack>
            </Stack>
          </Paper>

          {aiError && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {aiError}
            </Alert>
          )}

          {isProcessing && (
            <Paper sx={{ p: 3, mb: 3, textAlign: 'center' }}>
              <Loader message="Processing document and running QC analysis..." />
            </Paper>
          )}
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              3. Execute QA/QC Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              The platform performs Check-1 (QA/QC) and Check-2 (Technical) reviews automatically.
            </Typography>
            <Stack spacing={2}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrowIcon />}
                onClick={handleRunQC}
                disabled={isProcessing || !selectedFile || !selectedDiscipline || !documentMeta}
              >
                Run QC Analysis
              </Button>
              <Typography variant="caption" color="text.secondary">
                Ensure the document metadata is complete before triggering the analysis.
              </Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <TerminalLog logs={logs} />
      </Box>
    </Box>
  );
}

