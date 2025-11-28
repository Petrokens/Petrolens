// Professional Final Report Component with Material UI

import { useMemo } from 'react';
import { QCResultCheck1 } from './QCResultCheck1.jsx';
import { QCResultCheck2 } from './QCResultCheck2.jsx';
import { ScoreDisplay } from '../Dashboard/ScoreDisplay.jsx';
import { useScoring } from '../../hooks/useScoring.js';
import { generatePDFReport, generateWordReport } from '../../utils/reportGenerator.js';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  Grid,
  Divider,
  Chip,
  IconButton,
  Tooltip
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';

const DISCLAIMER = `This QA/QC report is system-generated based on a standardized checklist and automated review logic. Ensure that only the latest approved revisions of all documents, drawings, and references are used in the preparation of this deliverable. Each input shall be cross-verified against the official document register and confirmed with the respective owner before inclusion. Superseded or unverified inputs must not be used. While it provides a structured and objective assessment of the deliverable, it should not be relied upon as a sole basis for approval or construction. Professional engineering judgment, experience, and good engineering practices must be applied in conjunction with this report. Reviewers are advised to perform a thorough manual validation where applicable and consult relevant discipline experts or project authorities for critical observations.`;

export function FinalReport({ 
  check1Result, 
  check2Result, 
  check1Score, 
  check2Score,
  documentMeta,
  discipline,
  documentType
}) {
  const { combinedScore, scoreCategory, formattedScores } = useScoring(check1Score, check2Score);

  const handleDownloadPDF = async () => {
    try {
      await generatePDFReport({
        check1Result,
        check2Result,
        check1Score,
        check2Score,
        combinedScore,
        scoreCategory,
        documentMeta,
        discipline,
        documentType,
        disclaimer: DISCLAIMER
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report. Please try again.');
    }
  };

  const handleDownloadWord = async () => {
    try {
      await generateWordReport({
        check1Result,
        check2Result,
        check1Score,
        check2Score,
        combinedScore,
        scoreCategory,
        documentMeta,
        discipline,
        documentType,
        disclaimer: DISCLAIMER
      });
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Failed to generate Word report. Please try again.');
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: 'auto', p: { xs: 2, md: 4 } }}>
      {/* Report Header */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
        elevation={0}
      >
        <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
              QC Report
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Quality Control Analysis Results
            </Typography>
          </Box>
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              startIcon={<PictureAsPdfIcon />}
              onClick={handleDownloadPDF}
              sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#c62828' } }}
            >
              PDF
            </Button>
            <Button
              variant="contained"
              startIcon={<DescriptionIcon />}
              onClick={handleDownloadWord}
              sx={{ bgcolor: '#1976d2', '&:hover': { bgcolor: '#1565c0' } }}
            >
              Word
            </Button>
          </Stack>
        </Stack>
      </Paper>

      {/* Document Information */}
      {documentMeta && (
        <Paper
          sx={{
            p: 3,
            mb: 3,
            border: '1px solid',
            borderColor: 'divider',
          }}
          elevation={0}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
            Document Information
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.6875rem', letterSpacing: '0.05em' }}>
                Title
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {documentMeta.title || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.6875rem', letterSpacing: '0.05em' }}>
                Document Number
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {documentMeta.documentNumber || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.6875rem', letterSpacing: '0.05em' }}>
                Revision
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {documentMeta.revision || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.6875rem', letterSpacing: '0.05em' }}>
                Status
              </Typography>
              <Chip 
                label={documentMeta.status || 'N/A'} 
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.6875rem', letterSpacing: '0.05em' }}>
                Discipline
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {discipline || 'N/A'}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontSize: '0.6875rem', letterSpacing: '0.05em' }}>
                Type
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {documentType || 'N/A'}
              </Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Score Display */}
      <ScoreDisplay
        check1Score={check1Score}
        check2Score={check2Score}
        combinedScore={combinedScore}
        scoreCategory={scoreCategory}
      />

      {/* Check Results */}
      {check1Result && (
        <Box sx={{ mb: 3 }}>
          <QCResultCheck1 result={check1Result} score={check1Score} />
        </Box>
      )}

      {check2Result && (
        <Box sx={{ mb: 3 }}>
          <QCResultCheck2 result={check2Result} score={check2Score} />
        </Box>
      )}

      {/* Consolidated Score */}
      {combinedScore !== null && (
        <Paper
          sx={{
            p: 3,
            mb: 3,
            border: '1px solid',
            borderColor: 'divider',
            bgcolor: 'grey.50',
          }}
          elevation={0}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Consolidated Overall Score
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Check-1 Score
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {formattedScores.check1}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Check-2 Score
              </Typography>
              <Typography variant="h5" fontWeight={700}>
                {formattedScores.check2}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Overall Score
              </Typography>
              <Typography variant="h5" fontWeight={700} color="primary.main">
                {formattedScores.combined}
              </Typography>
            </Grid>
            {scoreCategory && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Category
                </Typography>
                <Chip 
                  label={scoreCategory.label}
                  color={scoreCategory.key === 'EXCELLENT' ? 'success' : scoreCategory.key === 'APPROVED_MINOR' ? 'info' : scoreCategory.key === 'NEEDS_REVISION' ? 'warning' : 'error'}
                  sx={{ fontWeight: 600 }}
                />
              </Grid>
            )}
          </Grid>
        </Paper>
      )}

      {/* Disclaimer */}
      <Paper
        sx={{
          p: 2.5,
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'grey.50',
        }}
        elevation={0}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            fontSize: '0.75rem',
            fontStyle: 'italic',
            lineHeight: 1.6,
            display: 'block',
          }}
        >
          {DISCLAIMER}
        </Typography>
      </Paper>
    </Box>
  );
}

