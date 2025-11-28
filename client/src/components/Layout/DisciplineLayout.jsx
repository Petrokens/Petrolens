// Discipline User Layout Component with Material UI shell

import { useAuth } from '../../context/AuthContext.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
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
  { label: 'My Reports', path: '/reports' },
  { label: 'Petro Pilot', path: '/chat' }
];

export function DisciplineLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const isActive = (path) => location.pathname === path;
  const currentTabIndex = NAV_ITEMS.findIndex(item => isActive(item.path));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar
        position="sticky"
        color="default"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar
            disableGutters
            sx={{
              minHeight: { xs: 64, md: 72 },
              display: 'flex',
              gap: 2,
              alignItems: 'center'
            }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box
                component="img"
                src="/logo.png"
                alt="Petrolenz logo"
                sx={{
                  height: 48,
                  width: 48,
                  objectFit: 'contain',
                }}
              />
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Petrolenz
                </Typography>
               
              </Box>
            </Stack>

            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                justifyContent: { xs: 'flex-end', md: 'center' },
              }}
            >
              <Tabs
                value={currentTabIndex === -1 ? false : currentTabIndex}
                onChange={(e, idx) => navigate(NAV_ITEMS[idx].path)}
                variant={isMobile ? 'scrollable' : 'standard'}
                scrollButtons
                allowScrollButtonsMobile
                sx={{
                  minHeight: 48,
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    fontWeight: 600,
                    minHeight: 48,
                    fontSize: '0.95rem'
                  },
                  '& .MuiTabs-indicator': {
                    height: 3,
                    borderRadius: 3
                  }
                }}
              >
                {NAV_ITEMS.map(item => (
                  <Tab key={item.path} label={item.label} />
                ))}
              </Tabs>
            </Box>

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
        </Container>
      </AppBar>

      <Container maxWidth="xl" component="main" sx={{ py: 4 }}>
        {children}
      </Container>
      
      {/* AI Chat Assistant */}
      <AIChat />
    </Box>
  );
}

