# AI-Based QC Checker Tool

A comprehensive Quality Control (QC) Checker Tool for engineering deliverables, enabling automatic verification against discipline-specific or general checklists using AI.

## Features

- **Multi-Discipline Support**: Process, Piping, Civil & Structural, Mechanical, Electrical, Instrumentation, HSE, and General Engineering
- **Role-Based Access**: Admin (full access) and User (discipline-specific access)
- **Two-Stage QC Analysis**:
  - Check-1: Comprehensive QA/QC review (aesthetic, compliance, technical accuracy)
  - Check-2: Deep technical review with 40+ intelligent questions
- **Document Classification**: Automatic detection of document type (Drawing vs Document)
- **Report Generation**: Download QC reports in PDF and Word formats
- **Scoring System**: Normal and risk-weighted scoring with color-coded categories

## Prerequisites

- Node.js 18+ and npm
- OpenRouter API key (get one from https://openrouter.ai/)

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
   - Create a `.env` file in the `client` directory
   - Add your OpenRouter API key:
   ```
   VITE_OPENROUTER_API_KEY=your_api_key_here
   ```
   - Alternatively, you can set the API key in the application after login (stored in localStorage)

## Running the Application

### Development Mode
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Production Build
```bash
npm run build
npm run preview
```

## Usage

### 1. Login
- **Admin**: Full access to all disciplines and reports
- **User**: Access restricted to assigned discipline
- For demo purposes, any credentials will work

### 2. Upload Document
1. Select your discipline (if admin)
2. Upload a PDF or Word document (max 10MB)
3. Fill in document metadata (title, number, revision, status)
4. Click "Run QC Analysis"

### 3. View Results
- Check-1 results: QA/QC review with scoring
- Check-2 results: Technical review with detailed questions
- Overall consolidated score with category classification
- Download reports in PDF or Word format

## Project Structure

```
client/
├── src/
│   ├── api/              # OpenRouter API integration
│   ├── components/       # React components
│   │   ├── Common/      # Loader, ErrorBoundary
│   │   ├── Dashboard/   # ScoreDisplay, DisciplineSelector
│   │   ├── Layout/      # AdminLayout, DisciplineLayout
│   │   ├── Results/     # QCResultCheck1, QCResultCheck2, FinalReport
│   │   └── Upload/      # FileUpload, DocumentMeta
│   ├── config/          # Constants, document types
│   ├── context/         # AuthContext for role management
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Main pages (Login, Dashboard, etc.)
│   ├── routes/          # App routing
│   └── utils/           # Utilities (prompts, scoring, etc.)
├── public/
└── package.json
```

## Key Components

### Check-1: QA/QC Review
- Drawing checks: Title block, scale, compliance, technical accuracy, interdisciplinary consistency
- Document checks: Aesthetic, completeness, technical accuracy, format, approval trail
- General checks: Aesthetic, logical, technical, completeness

### Check-2: Technical Review
- 40+ intelligent questions using 5Ws + H method
- Auto-checks for blanks, inconsistencies, standards compliance
- Risk-weighted scoring (High/Medium/Low)

### Scoring Categories
- **95-100%**: Approved – Excellent
- **80-94%**: Approved with Minor Comments
- **70-79%**: Needs Revision
- **<69%**: Rejected

## API Configuration

The application uses OpenRouter API to access various AI models. Default model is `anthropic/claude-3.5-sonnet`.

To change the model, edit `client/src/api/openRouter.js`:
```javascript
const DEFAULT_MODEL = 'your-preferred-model';
```

Available models: https://openrouter.ai/models

## Troubleshooting

### API Key Issues
- Ensure your OpenRouter API key is set in `.env` or localStorage
- Check API key validity at https://openrouter.ai/

### File Upload Issues
- Supported formats: PDF (.pdf), Word (.doc, .docx)
- Maximum file size: 10MB
- For large files, text extraction may be limited

### Report Generation Issues
- Ensure browser allows file downloads
- Check browser console for errors

## Future Enhancements

- Backend integration for persistent storage
- Email notifications for QC reports
- Integration with Document Management Systems (DMS)
- Real-time collaboration features
- Advanced analytics dashboard
- Learning from past QA/QC feedback

## License

This project is proprietary software for internal use.

## Support

For issues or questions, please contact the development team.
