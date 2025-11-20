// Login Page with Material UI styling and engineering backdrop

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { DISCIPLINES, USER_ROLES } from '../config/constants.js';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Alert,
  Divider
} from '@mui/material';

const BACKDROP_IMAGE =
  'linear-gradient(rgba(5, 10, 30, 0.75), rgba(5, 10, 30, 0.85)), url(https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1950&q=80)';

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(USER_ROLES.USER);
  const [discipline, setDiscipline] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    if (role === USER_ROLES.USER && !discipline) {
      setError('Please select a discipline for user role');
      return;
    }

    try {
      login(username, password, role, discipline);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: BACKDROP_IMAGE,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 460,
          borderRadius: 3,
          p: 4,
          backdropFilter: 'blur(6px)'
        }}
      >
        <Stack spacing={1}>
          <Typography variant="h4" fontWeight={700}>
            Petrolenz QC Platform
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Secure Engineering Workspace
          </Typography>
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
            fullWidth
          />

          <TextField
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            fullWidth
          />

          <FormControl fullWidth>
            <InputLabel id="role-label">Role</InputLabel>
            <Select
              labelId="role-label"
              label="Role"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                if (e.target.value === USER_ROLES.ADMIN) {
                  setDiscipline('');
                }
              }}
            >
              <MenuItem value={USER_ROLES.USER}>User</MenuItem>
              <MenuItem value={USER_ROLES.ADMIN}>Admin</MenuItem>
            </Select>
          </FormControl>

          {role === USER_ROLES.USER && (
            <FormControl fullWidth>
              <InputLabel id="discipline-label">Discipline</InputLabel>
              <Select
                labelId="discipline-label"
                label="Discipline"
                value={discipline}
                onChange={(e) => setDiscipline(e.target.value)}
                required
              >
                <MenuItem value="">
                  <em>-- Select Discipline --</em>
                </MenuItem>
                {DISCIPLINES.map((disc) => (
                  <MenuItem key={disc} value={disc}>
                    {disc}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          <Button type="submit" variant="contained" size="large" sx={{ mt: 1 }}>
            Sign In
          </Button>
        </Stack>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 3, display: 'block', textAlign: 'center' }}>
          Note: Demo environment accepts any credentials.
        </Typography>
      </Paper>
    </Box>
  );
}

