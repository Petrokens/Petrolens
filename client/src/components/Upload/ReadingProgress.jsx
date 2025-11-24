// Reading Progress Component

import { Box, LinearProgress, Typography, Paper, Stack, Chip } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';

export function ReadingProgress({ currentPage, totalPages, isReading, currentLine, totalLines, status }) {
  if (!isReading && currentPage === 0 && totalPages === 0) {
    return null;
  }

  const pagePercentage = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;
  const linePercentage = totalLines > 0 ? (currentLine / totalLines) * 100 : 0;

  return (
    <Paper sx={{ p: 3, mb: 2, bgcolor: 'primary.50' }}>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <DescriptionIcon color="primary" />
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              Reading Document
            </Typography>
            {isReading ? (
              <>
                <Typography variant="body2" color="text.secondary">
                  {status || `Reading page ${currentPage} of ${totalPages}...`}
                </Typography>
                {currentLine > 0 && totalLines > currentLine && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Reading line {currentLine} of {totalLines || '?'}...
                  </Typography>
                )}
              </>
            ) : (
              <Typography variant="body2" color="success.main">
                ✓ Successfully read {totalPages} page{totalPages !== 1 ? 's' : ''} ({totalLines || 0} lines)
              </Typography>
            )}
          </Box>
          <Stack spacing={1} alignItems="flex-end">
            <Chip 
              label={`Page ${currentPage}/${totalPages}`} 
              color="primary" 
              variant="outlined"
              size="small"
            />
            {currentLine > 0 && (
              <Chip 
                label={`Line ${currentLine}${totalLines > 0 ? `/${totalLines}` : ''}`} 
                color="secondary" 
                variant="outlined"
                size="small"
              />
            )}
          </Stack>
        </Stack>
        
        <Stack spacing={1}>
          <Box>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Pages: {currentPage}/{totalPages}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={pagePercentage} 
              sx={{ height: 6, borderRadius: 3 }}
            />
          </Box>
          {currentLine > 0 && (
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Lines: {currentLine}{totalLines > 0 ? `/${totalLines}` : ''}
              </Typography>
              <LinearProgress 
                variant="determinate" 
                value={linePercentage} 
                color="secondary"
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
          )}
        </Stack>
        
        {isReading && (
          <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center' }}>
            Reading document content line by line...
          </Typography>
        )}
      </Stack>
    </Paper>
  );
}

