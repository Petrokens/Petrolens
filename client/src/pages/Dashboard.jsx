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
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Tooltip
} from '@mui/material';
import UploadIcon from '@mui/icons-material/CloudUpload';
import AssessmentIcon from '@mui/icons-material/Assessment';
import HistoryIcon from '@mui/icons-material/History';
import InsightsIcon from '@mui/icons-material/Insights';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import BoltIcon from '@mui/icons-material/Bolt';
import ScheduleIcon from '@mui/icons-material/Schedule';
import TimelineIcon from '@mui/icons-material/Timeline';
import { getHistory } from '../utils/historyManager.js';

export function Dashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalReports: 0,
    averageScore: 0,
    latestScore: null
  });

  const reviewPipeline = [
    { title: 'IFC Package 12', discipline: 'Mechanical', status: 'In QA', eta: 'Due in 2d', owner: 'Delta Team' },
    { title: 'Electrical Calculations', discipline: 'Electrical', status: 'Awaiting Inputs', eta: 'Needs vendor data', owner: 'Gridline' },
    { title: 'Process Datasheets', discipline: 'Process', status: 'Tech Review', eta: 'Review today', owner: 'North QC' }
  ];

  const qualitySignals = [
    { label: 'QA compliance', value: 92, unit: '%', trend: '+4.2% vs last sprint', palette: 'success' },
    { label: 'Open findings', value: 8, unit: ' items', trend: '-3 vs last week', palette: 'warning', max: 20 },
    { label: 'Automation coverage', value: 68, unit: '%', trend: '+12% YoY', palette: 'primary' }
  ];

  const heroHighlights = [
    { label: 'Live reviews', value: `${reviewPipeline.length} in flight`, detail: 'Multi-discipline stream' },
    { label: 'Avg turnaround', value: '34h', detail: 'Last 10 cycles' },
    { label: 'Automation coverage', value: '68%', detail: '+12% vs last month' }
  ];

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

  const roleChipLabel = isAdmin() ? 'Administrator' : `${user?.discipline || 'Discipline'} workspace`;
  const latestScoreChip =
    stats.latestScore !== null ? `${stats.latestScore.toFixed(1)}% latest score` : 'No score yet';

  const metricCards = [
    {
      label: 'Total Reports',
      value: stats.totalReports,
      sub: 'Generated this quarter',
      icon: TaskAltIcon,
      trend: stats.totalReports > 0 ? '+4 vs last quarter' : 'Awaiting first run'
    },
    {
      label: 'Average Score',
      value: stats.averageScore ? `${stats.averageScore}%` : 'N/A',
      sub: 'Across completed reviews',
      icon: TrendingUpIcon,
      trend: stats.averageScore ? '↑ healthy trend' : 'Collecting data'
    },
    {
      label: 'Latest Quality Score',
      value: stats.latestScore ? `${stats.latestScore.toFixed(1)}%` : 'N/A',
      sub: 'Most recent QC run',
      icon: BoltIcon,
      chip:
        stats.latestScore !== null
          ? stats.latestScore >= 80
            ? { label: 'Healthy', color: 'success' }
            : stats.latestScore >= 70
            ? { label: 'Needs review', color: 'warning' }
            : { label: 'Critical', color: 'error' }
          : null,
      trend: stats.latestScore ? 'Auto-checks completed' : 'Run AI QC to see score'
    }
  ];

  return (
    <Box>
      <Paper
        sx={{
          p: { xs: 3, md: 4 },
          mb: 4,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(120deg, rgba(19, 77, 154, 0.15), rgba(0, 210, 255, 0.08))',
          border: '1px solid',
          borderColor: 'divider'
        }}
        elevation={0}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'radial-gradient(circle at 10% 20%, rgba(96,165,255,0.25), transparent 45%), radial-gradient(circle at 80% 0%, rgba(0,210,255,0.2), transparent 40%)'
          }}
        />
        <Stack spacing={4} position="relative">
          <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4} alignItems="flex-start">
            <Box flex={1}>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                  <Chip label={roleChipLabel} color="primary" variant="outlined" />
                  <Chip label={latestScoreChip} variant="outlined" />
                </Stack>
                <Typography variant="h3" fontWeight={700} sx={{ letterSpacing: '-0.03em' }}>
                  {isAdmin() ? 'Quality Command Center' : 'QC Workspace'}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ maxWidth: '65ch' }}>
                  {isAdmin()
                    ? 'Monitor disciplines, orchestrate AI-powered QC, and broadcast insights to stakeholders.'
                    : `Stay on top of ${user?.discipline || 'discipline'} deliverables, run Petro Pilot checks, and close comments faster.`}
                </Typography>
              </Stack>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={() => navigate('/upload')}
                  startIcon={<UploadIcon />}
                  sx={{ minWidth: 200 }}
                >
                  Launch QC Cycle
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/history')}
                  startIcon={<TimelineIcon />}
                  sx={{ minWidth: 200 }}
                >
                  Review Timeline
                </Button>
              </Stack>
            </Box>
            <Box
              sx={{
                flexBasis: { xs: '100%', lg: 360 },
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(auto-fit, minmax(160px, 1fr))', lg: '1fr' },
                gap: 2
              }}
            >
              {heroHighlights.map((item) => (
                <Paper
                  key={item.label}
                  elevation={0}
                  sx={{
                    p: 2.5,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'rgba(255,255,255,0.2)',
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    color: '#f8fafc'
                  }}
                >
                  <Typography variant="caption" sx={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h5" fontWeight={700} sx={{ mt: 1 }}>
                    {item.value}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {item.detail}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Stack>
        </Stack>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={card.label}>
              <Paper
                sx={{
                  p: 3,
                  height: '100%',
                  border: '1px solid',
                  borderColor: 'divider',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-3px)'
                  }
                }}
                elevation={0}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 1.5 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      bgcolor: 'grey.100',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Icon color="primary" />
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}
                    >
                      {card.label}
                    </Typography>
                    <Stack direction="row" spacing={1.25} alignItems="center">
                      <Typography variant="h3" fontWeight={700} sx={{ letterSpacing: '-0.02em' }}>
                        {card.value}
                      </Typography>
                      {card.chip && (
                        <Chip
                          label={card.chip.label}
                          color={card.chip.color}
                          size="small"
                          sx={{ height: 24, fontSize: '0.6875rem' }}
                        />
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      {card.sub}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {card.trend}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Grid>
          );
        })}
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={7}>
          <Paper
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider'
            }}
            elevation={0}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Review pipeline
              </Typography>
              <Tooltip title="View full pipeline">
                <Button size="small" onClick={() => navigate('/history')} endIcon={<ScheduleIcon fontSize="small" />}>
                  Open board
                </Button>
              </Tooltip>
            </Stack>
            <List disablePadding>
              {reviewPipeline.map((item, idx) => {
                const statusColor = item.status.toLowerCase().includes('await')
                  ? 'warning'
                  : item.status.toLowerCase().includes('tech')
                  ? 'info'
                  : 'primary';
                return (
                  <ListItem
                    key={item.title}
                    disableGutters
                    divider={idx !== reviewPipeline.length - 1}
                    sx={{ py: 1.5 }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        variant="rounded"
                        sx={{
                          bgcolor: 'primary.light',
                          color: 'primary.dark',
                          fontWeight: 600
                        }}
                      >
                        {item.discipline.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                          <Typography variant="subtitle1" fontWeight={600}>
                            {item.title}
                          </Typography>
                          <Chip label={item.discipline} size="small" variant="outlined" />
                        </Stack>
                      }
                      secondary={
                        <Typography variant="body2" color="text.secondary">
                          {item.owner} · {item.status}
                        </Typography>
                      }
                    />
                    <Stack spacing={0.5} alignItems="flex-end">
                      <Chip label={item.status} size="small" color={statusColor} />
                      <Typography variant="caption" color="text.secondary">
                        {item.eta}
                      </Typography>
                    </Stack>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} lg={5}>
          <Paper
            sx={{
              p: 3,
              border: '1px solid',
              borderColor: 'divider',
              height: '100%'
            }}
            elevation={0}
          >
            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
              Quality signals
            </Typography>
            <Stack spacing={3}>
              {qualitySignals.map((signal) => (
                <Box key={signal.label}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle2">{signal.label}</Typography>
                    <Chip label={signal.trend} size="small" variant="outlined" />
                  </Stack>
                  <Typography variant="h4" fontWeight={700} sx={{ mt: 0.5 }}>
                    {signal.value}
                    {signal.unit}
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    value={signal.max ? (signal.value / signal.max) * 100 : signal.value}
                    sx={{
                      height: 8,
                      borderRadius: 999,
                      mt: 1,
                      backgroundColor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: (theme) => theme.palette[signal.palette].main
                      }
                    }}
                  />
                </Box>
              ))}
            </Stack>
          </Paper>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
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
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: 'primary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.contrastText',
                  }}
                >
                  <UploadIcon />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Upload Document
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Start a fresh QA/QC cycle for a PDF or Word deliverable.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button 
                fullWidth 
                variant="contained" 
                onClick={() => navigate('/upload')}
                startIcon={<UploadIcon />}
              >
                Launch Uploader
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
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
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: 'secondary.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'secondary.contrastText',
                  }}
                >
                  <HistoryIcon />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Review History
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Access stored QC runs with filters, status chips, and actions.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={() => navigate('/history')}
                startIcon={<HistoryIcon />}
              >
                Open History
              </Button>
            </CardActions>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
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
            <CardContent sx={{ flexGrow: 1, p: 3 }}>
              <Stack spacing={2}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    bgcolor: 'success.light',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'success.contrastText',
                  }}
                >
                  <AssessmentIcon />
                </Box>
                <Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Analytics & Reports
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Download QC summaries and share with project stakeholders.
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button 
                fullWidth 
                variant="outlined" 
                onClick={() => navigate('/reports')}
                startIcon={<AssessmentIcon />}
              >
                View Reports
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      {isAdmin() && (
        <Paper
          sx={{
            p: 4,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3
          }}
          elevation={0}
        >
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} sx={{ mb: 3 }}>
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                bgcolor: 'primary.light',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'primary.contrastText'
              }}
            >
              <InsightsIcon fontSize="small" />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={600}>
                Discipline orchestration
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pinpoint a discipline to broadcast AI QC runs or filter downstream history.
              </Typography>
            </Box>
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

