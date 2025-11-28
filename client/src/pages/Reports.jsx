// Professional Reports Archive Page with Material UI

import { useAuth } from '../context/AuthContext.jsx';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider
} from '@mui/material';
import AssessmentIcon from '@mui/icons-material/Assessment';

export function Reports() {
  const { user, isAdmin } = useAuth();

  // In production, this would fetch from a backend API
  const reports = JSON.parse(localStorage.getItem('qc_reports') || '[]');

  const filteredReports = isAdmin() 
    ? reports 
    : reports.filter(r => r.discipline === user?.discipline);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ letterSpacing: '-0.02em' }}>
          QC Reports Archive
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {filteredReports.length === 0 
            ? 'No reports found. Upload a document to generate your first QC report.'
            : `Showing ${filteredReports.length} report${filteredReports.length !== 1 ? 's' : ''}`
          }
        </Typography>
      </Box>

      {filteredReports.length > 0 ? (
        <Grid container spacing={3}>
          {filteredReports.map((report, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-4px)',
                  },
                }}
                elevation={0}
              >
                <CardContent>
                  <Stack spacing={2}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1.5,
                          bgcolor: 'primary.light',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'primary.contrastText',
                        }}
                      >
                        <AssessmentIcon fontSize="small" />
                      </Box>
                      <Chip
                        label={new Date(report.timestamp).toLocaleDateString()}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight={600} gutterBottom>
                        {report.documentMeta?.title || `Report ${index + 1}`}
                      </Typography>
                    </Box>
                    <Divider />
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Discipline:
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {report.discipline || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Type:
                        </Typography>
                        <Typography variant="body2" fontWeight={500}>
                          {report.documentType || 'N/A'}
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          Score:
                        </Typography>
                        <Chip
                          label={report.combinedScore ? `${report.combinedScore.toFixed(1)}%` : 'N/A'}
                          size="small"
                          color={report.combinedScore >= 80 ? 'success' : report.combinedScore >= 70 ? 'warning' : 'error'}
                        />
                      </Box>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper
          sx={{
            p: 6,
            textAlign: 'center',
            border: '1px solid',
            borderColor: 'divider',
          }}
          elevation={0}
        >
          <AssessmentIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Reports Available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload a document to generate your first QC report.
          </Typography>
        </Paper>
      )}
    </Container>
  );
}

