// Main App Component with Material UI Theme

import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './context/AuthContext.jsx';
import { ErrorBoundary } from './components/Common/ErrorBoundary.jsx';
import { AppRoutes } from './routes/AppRoutes.jsx';
import './App.css';

// Create Material UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#0f6fde',
      light: '#4fa2ff',
      dark: '#0c4da8',
    },
    secondary: {
      main: '#0b5ed7',
    },
    background: {
      default: '#f5f6fb',
      paper: '#ffffff',
    },
    text: {
      primary: '#1b1f3b',
      secondary: '#4b5671',
    },
  },
  typography: {
    fontFamily: '"Segoe UI", "Segoe UI Variable", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    h3: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 10px 30px rgba(15,111,222,0.08)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 24,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 24,
        },
      },
    },
  },
});

function App() {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ErrorBoundary>
          <AuthProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </AuthProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App;
