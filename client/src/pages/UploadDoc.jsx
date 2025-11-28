// Upload Document Page

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { FileUpload } from '../components/Upload/FileUpload.jsx';
import { DocumentMeta } from '../components/Upload/DocumentMeta.jsx';
import { ReadingProgress } from '../components/Upload/ReadingProgress.jsx';
import { DocumentTextViewer } from '../components/Upload/DocumentTextViewer.jsx';
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

  const { 
    readFile, 
    content, 
    extractedText,
    loading: fileLoading, 
    error: fileError,
    progress: readingProgress,
    isAIProcessing,
    setIsAIProcessing,
    reset: resetFileReader
  } = useFileReader();
  const { runBothChecks, loading: aiLoading, error: aiError, apiConfig, updateConfig, logs, clearLogs } = useAIQC();
  const [showSettings, setShowSettings] = useState(false);
  const [engineeringError, setEngineeringError] = useState(null);
  const [aiProcessedLines, setAIProcessedLines] = useState(0);

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    setProcessing(true);
    setEngineeringError(null);
    setDocumentType(null);
    
    try {
      // Read file content with progress tracking
      const fileContent = await readFile(file);
      
      if (!fileContent) {
        // Check for file reading errors
        if (fileError) {
          setEngineeringError(fileError);
          setSelectedFile(null);
        }
        return;
      }
      
      // Classify document (this will validate if it's an engineering document)
      try {
        const classification = await classifyDocument(file.name, fileContent || '');
        setDocumentType(classification);
        setEngineeringError(null);
      } catch (classifyError) {
        if (classifyError.message === 'NOT_ENGINEERING_DOCUMENT') {
          const errorMsg = 'This document does not appear to be an engineering document. Please upload engineering-related documents only (e.g., drawings, specifications, calculations, datasheets, P&IDs, isometrics, etc.).';
          setEngineeringError(errorMsg);
          setSelectedFile(null);
          resetFileReader(); // Clear extracted text and content
        } else {
          console.error('Error classifying document:', classifyError);
          setEngineeringError('Failed to classify document. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error processing file:', error);
      if (error.message && error.message.includes('engineering document')) {
        setEngineeringError(error.message);
        setSelectedFile(null);
      } else {
        setEngineeringError('Failed to process file. Please try again.');
      }
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
    setIsAIProcessing(true);
    // Calculate how many lines AI will process (up to content limit)
    const lines = content.split('\n').filter(line => line.trim().length > 0);
    const totalLinesToProcess = Math.min(lines.length, Math.ceil(20000 / 50)); // Based on content limit
    setAIProcessedLines(0);

    try {
      clearLogs();
      const isDrawing = documentType?.type === 'Drawing';
      const specificType = documentType?.specificType || 'General';

      // Simulate line-by-line AI processing (show progress)
      const simulateAIProcessing = async () => {
        for (let i = 0; i <= totalLinesToProcess; i += 10) {
          setAIProcessedLines(Math.min(i, totalLinesToProcess));
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      };

      // Start simulation
      simulateAIProcessing();

      const results = await runBothChecks(
        documentType?.type || 'Document',
        specificType,
        selectedDiscipline,
        isDrawing,
        content
      );

      // Mark all lines as processed
      setAIProcessedLines(totalLinesToProcess);

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
      setIsAIProcessing(false);
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
              1. Document Metadata
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
              2. Upload Deliverable
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Supported formats: PDF, DOC, DOCX, XLSX, XLS, TXT, RTF, DWG, DXF (max 50 MB)
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

            {/* Engineering Document Validation Error */}
            {engineeringError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  Document Validation Failed
                </Typography>
                <Typography variant="body2">
                  {engineeringError}
                </Typography>
              </Alert>
            )}

            {/* File Reading Error */}
            {fileError && !engineeringError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                <Typography variant="subtitle2" fontWeight={600} gutterBottom>
                  File Reading Error
                </Typography>
                <Typography variant="body2">
                  {fileError}
                </Typography>
              </Alert>
            )}

            {/* Reading Progress Indicator */}
            {(readingProgress.isReading || readingProgress.totalPages > 0) && (
              <ReadingProgress
                currentPage={readingProgress.currentPage}
                totalPages={readingProgress.totalPages}
                isReading={readingProgress.isReading}
                currentLine={readingProgress.currentLine}
                totalLines={readingProgress.totalLines}
                status={readingProgress.status}
              />
            )}
          </Paper>
        </Grid>

        {/* Document Text Viewer */}
        {extractedText && extractedText.trim().length > 0 && !engineeringError && (
          <Grid item xs={12}>
            <DocumentTextViewer 
              text={extractedText} 
              isReading={readingProgress.isReading}
              currentReadingLine={readingProgress.currentLine}
              isAIProcessing={isAIProcessing}
              aiProcessedLines={aiProcessedLines}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              3. Workflow Checklist
            </Typography>
            <Stack spacing={2} divider={<Divider flexItem />}>
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
              4. Execute QA/QC Analysis
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

