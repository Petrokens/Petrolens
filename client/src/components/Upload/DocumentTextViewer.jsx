// Document Text Viewer with Line Numbers

import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  IconButton,
  TextField,
  InputAdornment,
  Collapse,
  Chip,
  Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/material/styles';

const LineNumberedText = styled(Box)(({ theme }) => ({
  fontFamily: 'monospace',
  fontSize: '0.875rem',
  lineHeight: 1.6,
  backgroundColor: '#f8f9fa',
  borderRadius: 8,
  padding: theme.spacing(2),
  maxHeight: '600px',
  overflow: 'auto',
  '& .line': {
    display: 'flex',
    marginBottom: '2px',
    '&:hover': {
      backgroundColor: '#e9ecef'
    }
  },
  '& .line-number': {
    color: '#6c757d',
    paddingRight: theme.spacing(2),
    textAlign: 'right',
    minWidth: '50px',
    userSelect: 'none',
    fontFamily: 'monospace',
    fontWeight: 500
  },
  '& .line-content': {
    flex: 1,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word'
  },
  '& .line-highlight': {
    backgroundColor: '#fff3cd'
  },
  '& .line-reading': {
    backgroundColor: '#e3f2fd',
    animation: 'pulse 1.5s ease-in-out infinite',
    '@keyframes pulse': {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.7 }
    }
  },
  '& .line-ai-processing': {
    backgroundColor: '#f3e5f5',
    borderLeft: '3px solid #9c27b0'
  },
  '& .line-ai-processed': {
    backgroundColor: '#e8f5e9',
    borderLeft: '3px solid #4caf50'
  }
}));

export function DocumentTextViewer({ 
  text, 
  title = 'Extracted Document Text',
  isReading = false,
  currentReadingLine = 0,
  isAIProcessing = false,
  aiProcessedLines = 0
}) {
  const [expanded, setExpanded] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightLine, setHighlightLine] = useState(null);
  const [autoScroll, setAutoScroll] = useState(isReading);

  if (!text || text.trim().length === 0) {
    return null;
  }

  // Split text into lines
  const lines = text.split('\n');
  const totalLines = lines.length;
  const totalChars = text.length;
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;

  // Filter lines if search is active
  const filteredLines = searchTerm
    ? lines.map((line, idx) => ({
        line,
        idx,
        matches: line.toLowerCase().includes(searchTerm.toLowerCase())
      }))
    : lines.map((line, idx) => ({ line, idx, matches: false }));

  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term) {
      // Find first matching line
      const firstMatch = lines.findIndex(line =>
        line.toLowerCase().includes(term.toLowerCase())
      );
      if (firstMatch !== -1) {
        setHighlightLine(firstMatch);
        setTimeout(() => setHighlightLine(null), 2000);
      }
    }
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Stack spacing={2}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ cursor: 'pointer' }}
          onClick={() => setExpanded(!expanded)}
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              {title}
            </Typography>
            <Chip label={`${totalLines} lines`} size="small" variant="outlined" />
            <Chip label={`${wordCount} words`} size="small" variant="outlined" />
            <Chip label={`${totalChars.toLocaleString()} chars`} size="small" variant="outlined" />
          </Stack>
          <IconButton size="small">
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Stack>

        <Collapse in={expanded}>
          <Divider sx={{ mb: 2 }} />
          
          {/* Search Bar */}
          <TextField
            fullWidth
            size="small"
            placeholder="Search in document text..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => handleSearch('')}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{ mb: 2 }}
          />

          {/* Line Numbered Text Viewer */}
          <LineNumberedText
            ref={(el) => {
              // Auto-scroll to current reading line when reading
              if (el && autoScroll && isReading && currentReadingLine > 0) {
                const lineElement = el.querySelector(`#line-${currentReadingLine}`);
                if (lineElement) {
                  lineElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }
            }}
          >
            {filteredLines.map((item, index) => {
              const lineNum = item.idx + 1;
              const isHighlighted = highlightLine === item.idx || 
                                   (searchTerm && item.matches);
              const isCurrentlyReading = isReading && lineNum === currentReadingLine;
              const isLineAIProcessed = lineNum <= aiProcessedLines && aiProcessedLines > 0;
              const isRead = !isReading || lineNum < currentReadingLine;
              
              // Determine line class based on state
              let lineClass = 'line';
              if (isLineAIProcessed) {
                lineClass += ' line-ai-processed';
              } else if (isCurrentlyReading && isAIProcessing) {
                lineClass += ' line-ai-processing';
              } else if (isCurrentlyReading) {
                lineClass += ' line-reading';
              } else if (isHighlighted) {
                lineClass += ' line-highlight';
              }
              
              return (
                <Box
                  key={index}
                  className={lineClass}
                  id={`line-${lineNum}`}
                >
                  <Box className="line-number">
                    {lineNum}
                    {isCurrentlyReading && <span style={{ marginLeft: '8px' }}>👁️</span>}
                    {isLineAIProcessed && !isCurrentlyReading && <span style={{ marginLeft: '8px' }}>✓</span>}
                  </Box>
                  <Box className="line-content">{item.line || ' '}</Box>
                </Box>
              );
            })}
          </LineNumberedText>

          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            {isReading && 'Reading document... '}
            {isAIProcessing && 'AI is analyzing the document content for QC review... '}
            {!isReading && !isAIProcessing && 'This is the text extracted from your document that will be analyzed by AI for QC review.'}
            <span style={{ display: 'block', marginTop: '8px', padding: '8px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
              <strong>Legend:</strong> <span style={{ backgroundColor: '#e3f2fd', padding: '2px 6px', borderRadius: '3px' }}>Blue</span> = Currently Reading | 
              <span style={{ backgroundColor: '#f3e5f5', padding: '2px 6px', borderRadius: '3px' }}> Purple Border</span> = AI Processing | 
              <span style={{ backgroundColor: '#e8f5e9', padding: '2px 6px', borderRadius: '3px' }}> Green Border ✓</span> = AI Processed
            </span>
          </Typography>
        </Collapse>
      </Stack>
    </Paper>
  );
}

