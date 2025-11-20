// Dashboard Page with Material UI experience

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { DisciplineSelector } from '../components/Dashboard/DisciplineSelector.jsx';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Stack,
  Paper,
  Divider
} from '@mui/material';
import UploadIcon from '@mui/icons-material/CloudUpload';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HistoryIcon from '@mui/icons-material/History';
import InsightsIcon from '@mui/icons-material/Insights';
import { getHistory } from '../utils/historyManager.js';

export function Dashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalReports: 0,
    averageScore: 0,
    latestScore: null
  });

  useEffect(() => {
    const history = getHistory();
    const filtered = isAdmin()
      ? history
      : history.filter(r => r.discipline === user?.discipline);

    if (filtered.length === 0) {
      setStats({
        totalReports: 0,
        averageScore: 0,
        latestScore: null
      });
      return;
    }

    const average =
      filtered
        .map(r => r.combinedScore)
        .filter(Boolean)
        .reduce((sum, score) => sum + score, 0) / filtered.length;

    const latest = filtered[0]?.combinedScore || null;

    setStats({
      totalReports: filtered.length,
      averageScore: Math.round(average * 10) / 10,
      latestScore: latest
    });
  }, [isAdmin, user]);

  const handleDisciplineSelect = (discipline) => {
    if (discipline) {
      sessionStorage.setItem('selectedDiscipline', discipline);
    }
  };

  return (
    <Box>
      <Paper
        sx={{
          p: { xs: 4, md: 6 },
          mb: 4,
          borderRadius: 4,
          background:
            'linear-gradient(120deg, rgba(15,111,222,0.1), rgba(79,167,255,0.25))'
        }}
        elevation={0}
      >
        <Stack spacing={2}>
          <Typography variant="h3" fontWeight={700}>
            {isAdmin() ? 'Petrolenz Quality Command Center' : 'QC Workspace'}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {isAdmin()
              ? 'Monitor disciplines, launch AI QC, and review enterprise insights.'
              : `Stay on top of ${user?.discipline || 'discipline'} deliverables, run AI checks, and close comments faster.`}
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
            <Button variant="contained" size="large" onClick={() => navigate('/upload')}>
              Start New QC Cycle
            </Button>
            <Button variant="outlined" size="large" onClick={() => navigate('/history')}>
              View Recent Reviews
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[
          {
            label: 'Total Reports',
            value: stats.totalReports,
            sub: 'Generated in this workspace'
          },
          {
            label: 'Average Score',
            value: stats.averageScore ? `${stats.averageScore}%` : 'N/A',
            sub: 'Across completed reviews'
          },
          {
            label: 'Latest Quality Score',
            value: stats.latestScore ? `${stats.latestScore.toFixed(1)}%` : 'N/A',
            sub: 'Most recent QC run',
            chip:
              stats.latestScore !== null
                ? {
                    label:
                      stats.latestScore >= 80
                        ? 'Healthy'
                        : stats.latestScore >= 70
                        ? 'Needs Review'
                        : 'Critical',
                    color:
                      stats.latestScore >= 80
                        ? 'success'
                        : stats.latestScore >= 70
                        ? 'warning'
                        : 'error'
                  }
                : null
          }
        ].map((card, idx) => (
          <Grid item xs={12} sm={6} md={4} key={card.label}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                height: '100%',
                background: idx === 0
                  ? 'linear-gradient(140deg, rgba(15,111,222,0.12), rgba(15,111,222,0.02))'
                  : idx === 1
                  ? 'linear-gradient(140deg, rgba(79,167,255,0.15), rgba(255,255,255,0.8))'
                  : 'linear-gradient(140deg, rgba(42,197,129,0.15), rgba(255,255,255,0.9))'
              }}
              elevation={0}
            >
              <Typography color="text.secondary" gutterBottom>
                {card.label}
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="h3" fontWeight={700}>
                  {card.value}
                </Typography>
                {card.chip && (
                  <Chip label={card.chip.label} color={card.chip.color} size="small" />
                )}
              </Stack>
              <Typography variant="body2" color="text.secondary">
                {card.sub}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <UploadIcon color="primary" fontSize="large" />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Upload Document
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start a fresh QA/QC cycle for a PDF or Word deliverable.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
            <CardActions>
              <Button fullWidth variant="contained" onClick={() => navigate('/upload')}>
                Launch Uploader
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <HistoryIcon color="secondary" fontSize="large" />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Review History
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Access stored QC runs with filters, status chips, and actions.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
            <CardActions>
              <Button fullWidth variant="outlined" onClick={() => navigate('/history')}>
                Open History
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                <AssessmentIcon color="success" fontSize="large" />
                <Box>
                  <Typography variant="h6" fontWeight={600}>
                    Analytics & Reports
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Download QC summaries and share with project stakeholders.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
            <CardActions>
              <Button fullWidth variant="outlined" onClick={() => navigate('/reports')}>
                View Reports
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {isAdmin() && (
        <Paper sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
            <InsightsIcon color="primary" />
            <Typography variant="h6" fontWeight={600}>
              Discipline Quick Access
            </Typography>
          </Stack>
          <Divider sx={{ mb: 3 }} />
          <DisciplineSelector
            selectedDiscipline={sessionStorage.getItem('selectedDiscipline') || ''}
            onSelect={handleDisciplineSelect}
          />
        </Paper>
      )}
    </Box>
  );
}

