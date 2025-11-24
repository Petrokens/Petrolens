// Discipline User Layout Component with Material UI shell

import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { AIChat } from '../Chat/AIChat.jsx';

const NAV_ITEMS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Upload Document', path: '/upload' },
  { label: 'History', path: '/history' },
  { label: 'My Reports', path: '/reports' }
];

export function DisciplineLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(15,15,40,0.08)',
          background:
            'linear-gradient(120deg, rgba(11,94,215,0.08), rgba(255,255,255,0.9))'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 0 }}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: 'secondary.main',
                  width: 48,
                  height: 48,
                  fontWeight: 700,
                  fontSize: 18,
                }}
              >
                PZ
              </Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Petrolenz QC Platform
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.discipline || 'Discipline'} workspace
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" color="text.secondary">
                  Signed in as
                </Typography>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  {user?.username || 'User'}
                </Typography>
              </Box>
              <IconButton color="primary" onClick={handleLogout} sx={{ bgcolor: 'rgba(11,94,215,0.1)' }}>
                <LogoutIcon />
              </IconButton>
            </Stack>
          </Toolbar>
          <Tabs
            value={NAV_ITEMS.findIndex(item => isActive(item.path))}
            onChange={(e, idx) => navigate(NAV_ITEMS[idx].path)}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons
            allowScrollButtonsMobile
            sx={{
              mt: 1,
              minHeight: 56,
              '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, minHeight: 56 },
              '& .MuiTabs-indicator': { height: 4, borderRadius: 2 }
            }}
          >
            {NAV_ITEMS.map(item => (
              <Tab key={item.path} label={item.label} />
            ))}
          </Tabs>
        </Container>
      </AppBar>

      <Box
        sx={{
          background: 'linear-gradient(135deg, rgba(11,94,215,0.12), rgba(255,255,255,0.04))',
          borderBottom: '1px solid rgba(11,94,215,0.1)'
        }}
      >
        <Container maxWidth="xl" sx={{ py: { xs: 4, md: 6 } }}>
          <Stack spacing={2}>
            <Typography variant="h3" fontWeight={700}>
              {user?.discipline || 'Discipline'} Operations
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Petrolenz QC Platform · Track deliverables, run AI QC, and review history
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Signed in as {user?.username || 'User'} · {user?.email || 'user@petrolenz.com'}
            </Typography>
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" component="main" sx={{ py: 4 }}>
        {children}
      </Container>
      
      {/* AI Chat Assistant */}
      <AIChat />
    </Box>
  );
}

