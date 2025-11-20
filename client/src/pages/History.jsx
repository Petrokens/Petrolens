// History Page with Material UI

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Button,
  TextField,
  MenuItem,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Tooltip
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Download as DownloadIcon,
  FilterList as FilterIcon,
  Clear as ClearIcon
} from '@mui/icons-material';
import { getHistory, deleteReport, filterHistory, clearHistory, getHistoryStats } from '../utils/historyManager.js';
import { DISCIPLINES, SCORING_CATEGORIES } from '../config/constants.js';

export function History() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    discipline: '',
    dateFrom: '',
    dateTo: '',
    minScore: '',
    maxScore: ''
  });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, reportId: null });
  const [clearDialog, setClearDialog] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reports, filters]);

  const loadHistory = () => {
    const history = getHistory();
    let filtered = history;
    
    // Filter by user discipline if not admin
    if (!isAdmin() && user?.discipline) {
      filtered = history.filter(r => r.discipline === user.discipline);
    }
    
    setReports(filtered);
    setStats(getHistoryStats());
  };

  const applyFilters = () => {
    let filtered = [...reports];
    
    if (filters.discipline) {
      filtered = filtered.filter(r => r.discipline === filters.discipline);
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(r => new Date(r.createdAt) >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(r => new Date(r.createdAt) <= toDate);
    }
    
    if (filters.minScore !== '') {
      filtered = filtered.filter(r => (r.combinedScore || 0) >= parseFloat(filters.minScore));
    }
    
    if (filters.maxScore !== '') {
      filtered = filtered.filter(r => (r.combinedScore || 0) <= parseFloat(filters.maxScore));
    }
    
    setFilteredReports(filtered);
  };

  const handleViewReport = (reportId) => {
    const report = reports.find(r => r.id === reportId);
    if (report) {
      sessionStorage.setItem('qcResults', JSON.stringify({
        check1: report.check1Result,
        check2: report.check2Result,
        check1Score: report.check1Score,
        check2Score: report.check2Score,
        combinedScore: report.combinedScore,
        scoreCategory: report.scoreCategory,
        documentMeta: report.documentMeta,
        discipline: report.discipline,
        documentType: report.documentType
      }));
      navigate('/report');
    }
  };

  const handleDelete = (reportId) => {
    if (deleteReport(reportId)) {
      loadHistory();
      setDeleteDialog({ open: false, reportId: null });
    }
  };

  const handleClearAll = () => {
    if (clearHistory()) {
      loadHistory();
      setClearDialog(false);
    }
  };

  const getScoreColor = (score) => {
    if (score === null || score === undefined) return 'default';
    const category = Object.values(SCORING_CATEGORIES).find(
      cat => score >= cat.min && score <= cat.max
    );
    if (category?.key === 'EXCELLENT') return 'success';
    if (category?.key === 'APPROVED_MINOR') return 'info';
    if (category?.key === 'NEEDS_REVISION') return 'warning';
    return 'error';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          QC Reports History
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {isAdmin() ? 'All reports' : `Reports for ${user?.discipline}`}
        </Typography>
      </Box>

      {/* Statistics Cards */}
      {stats && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Total Reports
                </Typography>
                <Typography variant="h4">
                  {stats.totalReports}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Average Score
                </Typography>
                <Typography variant="h4">
                  {stats.averageScore.toFixed(1)}%
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  Disciplines
                </Typography>
                <Typography variant="h4">
                  {Object.keys(stats.byDiscipline).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<ClearIcon />}
                    onClick={() => setClearDialog(true)}
                    disabled={reports.length === 0}
                  >
                    Clear All
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <FilterIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Filters</Typography>
        </Box>
        <Grid container spacing={2}>
          {isAdmin() && (
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                select
                fullWidth
                label="Discipline"
                value={filters.discipline}
                onChange={(e) => setFilters({ ...filters, discipline: e.target.value })}
                size="small"
              >
                <MenuItem value="">All</MenuItem>
                {DISCIPLINES.map((disc) => (
                  <MenuItem key={disc} value={disc}>{disc}</MenuItem>
                ))}
              </TextField>
            </Grid>
          )}
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              fullWidth
              label="Date From"
              value={filters.dateFrom}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              type="date"
              fullWidth
              label="Date To"
              value={filters.dateTo}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              InputLabelProps={{ shrink: true }}
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField
                type="number"
                fullWidth
                label="Min Score"
                value={filters.minScore}
                onChange={(e) => setFilters({ ...filters, minScore: e.target.value })}
                size="small"
                inputProps={{ min: 0, max: 100 }}
              />
              <TextField
                type="number"
                fullWidth
                label="Max Score"
                value={filters.maxScore}
                onChange={(e) => setFilters({ ...filters, maxScore: e.target.value })}
                size="small"
                inputProps={{ min: 0, max: 100 }}
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={() => setFilters({
                discipline: '',
                dateFrom: '',
                dateTo: '',
                minScore: '',
                maxScore: ''
              })}
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Reports Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Document</strong></TableCell>
              <TableCell><strong>Discipline</strong></TableCell>
              <TableCell><strong>Type</strong></TableCell>
              <TableCell align="center"><strong>Check-1 Score</strong></TableCell>
              <TableCell align="center"><strong>Check-2 Score</strong></TableCell>
              <TableCell align="center"><strong>Overall Score</strong></TableCell>
              <TableCell><strong>Date</strong></TableCell>
              <TableCell align="center"><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredReports.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">
                    No reports found. Upload a document to generate your first QC report.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              filteredReports.map((report) => (
                <TableRow key={report.id} hover>
                  <TableCell>
                    {report.documentMeta?.title || report.documentMeta?.documentNumber || 'N/A'}
                  </TableCell>
                  <TableCell>{report.discipline || 'N/A'}</TableCell>
                  <TableCell>{report.documentType || 'N/A'}</TableCell>
                  <TableCell align="center">
                    {report.check1Score !== null ? `${report.check1Score.toFixed(1)}%` : 'N/A'}
                  </TableCell>
                  <TableCell align="center">
                    {report.check2Score !== null ? `${report.check2Score.toFixed(1)}%` : 'N/A'}
                  </TableCell>
                  <TableCell align="center">
                    {report.combinedScore !== null ? (
                      <Chip
                        label={`${report.combinedScore.toFixed(1)}%`}
                        color={getScoreColor(report.combinedScore)}
                        size="small"
                      />
                    ) : 'N/A'}
                  </TableCell>
                  <TableCell>{formatDate(report.createdAt)}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View Report">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewReport(report.id)}
                      >
                        <ViewIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteDialog({ open: true, reportId: report.id })}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog({ open: false, reportId: null })}>
        <DialogTitle>Delete Report</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this report? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, reportId: null })}>Cancel</Button>
          <Button onClick={() => handleDelete(deleteDialog.reportId)} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Clear All Confirmation Dialog */}
      <Dialog open={clearDialog} onClose={() => setClearDialog(false)}>
        <DialogTitle>Clear All History</DialogTitle>
        <DialogContent>
          <Alert severity="warning" sx={{ mb: 2 }}>
            This will permanently delete all {reports.length} reports from history. This action cannot be undone.
          </Alert>
          <Typography>Are you sure you want to proceed?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialog(false)}>Cancel</Button>
          <Button onClick={handleClearAll} color="error" variant="contained">
            Clear All
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

