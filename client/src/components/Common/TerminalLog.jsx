// Terminal-style log viewer for QC analysis

import { useEffect, useRef } from 'react';
import { Paper, Typography, Stack, Box, Chip } from '@mui/material';

const STATUS_COLORS = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info'
};

export function TerminalLog({ logs = [] }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <Paper
      variant="outlined"
      sx={{
        bgcolor: '#0f172a',
        color: '#e2e8f0',
        fontFamily: 'SFMono-Regular, Consolas, Menlo, monospace',
        p: 2,
        minHeight: 300,
        maxHeight: 360,
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        overflowY: 'auto'
      }}
    >
      <Typography variant="subtitle2" sx={{ color: '#94a3b8', letterSpacing: 1, mb: 1 }}>
        QC TERMINAL · LIVE LOG
      </Typography>
      <Box sx={{ borderBottom: '1px solid rgba(148,163,184,0.3)', mb: 1 }} />
      {logs.length === 0 ? (
        <Typography variant="body2" sx={{ color: '#94a3b8' }}>
          Awaiting QC run... logs will appear here in real time.
        </Typography>
      ) : (
        <Stack spacing={0.5}>
          {logs.map((log) => (
            <Stack
              key={log.id}
              direction="row"
              spacing={1}
              alignItems="flex-start"
              sx={{ fontSize: 13 }}
            >
              <Typography variant="caption" sx={{ color: '#64748b', minWidth: 70 }}>
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </Typography>
              <Chip
                label={log.type?.toUpperCase() || 'INFO'}
                size="small"
                color={STATUS_COLORS[log.type] || 'default'}
                sx={{ height: 20 }}
              />
              <Typography component="span" sx={{ flex: 1 }}>
                {log.message}
              </Typography>
            </Stack>
          ))}
          <div ref={endRef} />
        </Stack>
      )}
    </Paper>
  );
}

