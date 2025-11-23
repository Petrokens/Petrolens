# Petrolenz QC Platform - Complete Documentation

## 📋 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Installation & Setup](#installation--setup)
4. [Usage Guide](#usage-guide)
5. [Technical Architecture](#technical-architecture)
6. [API Configuration](#api-configuration)
7. [File Processing](#file-processing)
8. [QC Analysis System](#qc-analysis-system)
9. [Troubleshooting](#troubleshooting)
10. [Development Guide](#development-guide)

---

## 🎯 Overview

**Petrolenz QC Platform** is an AI-powered Quality Control (QC) system for engineering documents. It automatically analyzes engineering deliverables using AI to perform comprehensive QA/QC reviews and technical assessments.

### Key Capabilities

- ✅ **Multi-format Support**: PDF, Word, Excel, CAD, Text files
- ✅ **Large Document Processing**: Handles 785+ page PDFs
- ✅ **OCR Integration**: Automatic text extraction from scanned PDFs
- ✅ **Two-Stage QC Analysis**: Check-1 (QA/QC) and Check-2 (Technical)
- ✅ **AI Chat Assistant**: Interactive Q&A about QC and engineering
- ✅ **Report Generation**: Downloadable PDF and Word reports
- ✅ **Role-Based Access**: Admin and User roles with discipline restrictions

---

## ✨ Features

### 1. Document Upload & Processing

- **Supported Formats**:
  - PDF (.pdf) - Up to 50MB, unlimited pages
  - Word (.docx, .doc) - Up to 50MB
  - Excel (.xlsx, .xls) - Up to 50MB
  - Text files (.txt, .rtf) - Up to 50MB
  - CAD files (.dwg, .dxf) - Filename only

- **Real-time Progress Tracking**:
  - Page-by-page reading progress
  - Line-by-line extraction display
  - Visual indicators for reading status
  - OCR progress for scanned documents

- **Engineering Document Validation**:
  - Automatically validates if document is engineering-related
  - Shows error for non-engineering documents
  - Keyword-based classification

### 2. QC Analysis System

#### Check-1: QA/QC Review
- Aesthetic checks (formatting, clarity)
- Compliance verification (standards, regulations)
- Technical accuracy assessment
- Drawing-specific checks (title block, scale, dimensions)
- Document-specific checks (completeness, approval trail)

#### Check-2: Technical Review
- 40+ intelligent technical questions
- 5Ws + H methodology (Who, What, When, Where, Why, How)
- Auto-checks for blanks and inconsistencies
- Risk-weighted scoring (High/Medium/Low)
- Standards compliance verification

### 3. Scoring System

| Score Range | Category | Color | Action Required |
|------------|----------|-------|----------------|
| 95-100% | Approved – Excellent | 🟢 Green | No or minor comments |
| 80-94% | Approved with Minor Comments | 🔵 Blue | Acceptable, no re-issue needed |
| 70-79% | Needs Revision | 🟠 Orange | Rework and re-review required |
| <69% | Rejected | 🔴 Red | Major issues, rework essential |

### 4. AI Chat Assistant

- **Location**: Floating button (bottom-right corner)
- **Capabilities**:
  - Questions about QC analysis results
  - Engineering standards and best practices
  - Document classification help
  - Technical questions about disciplines
  - Platform usage guidance

### 5. Report Generation

- **PDF Reports**: Professional formatted reports
- **Word Reports**: Editable document format
- **Contents**:
  - Document metadata
  - Check-1 and Check-2 results
  - Quality scores and categories
  - Detailed findings
  - Recommendations

### 6. History & Analytics

- **QC History**: Track all past analyses
- **Statistics Dashboard**:
  - Total reports generated
  - Average quality score
  - Latest QC score
- **Filtering**: By discipline, date, score category

---

## 🚀 Installation & Setup

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm**: Comes with Node.js
- **Modern Browser**: Chrome, Firefox, Edge, or Safari

### Step-by-Step Installation

#### 1. Navigate to Client Directory
```bash
cd client
```

#### 2. Install Dependencies
```bash
npm install
```

This installs all required packages:
- React 19.2.0
- Material-UI 5.15.0
- PDF processing libraries (pdfjs-dist, pdf-lib)
- OCR library (tesseract.js)
- Document processing (mammoth, docx)
- File handling (file-saver)

#### 3. Start Development Server
```bash
npm run dev
```

The application will be available at: **http://localhost:5173**

#### 4. Build for Production
```bash
npm run build
```

Production files will be in the `dist/` folder.

---

## 📖 Usage Guide

### 1. Login

- **URL**: http://localhost:5173
- **Demo Mode**: Any credentials work
- **Roles**:
  - **Admin**: Full access to all disciplines
  - **User**: Discipline-specific access

### 2. Upload Document

1. Navigate to **"Upload Document"** page
2. **Select Discipline** (if Admin):
   - Process
   - Piping
   - Civil & Structural
   - Mechanical
   - Electrical
   - Instrumentation
   - HSE
   - General Engineering Deliverables
   - Projects

3. **Upload File**:
   - Drag & drop or click to upload
   - Supported: PDF, Word, Excel, CAD, Text (max 50MB)
   - Watch real-time reading progress

4. **Fill Document Metadata**:
   - Document Title
   - Document Number
   - Revision
   - Status (IFR, IFA, IFC, As-Built)

5. **Run QC Analysis**:
   - Click "Run QC Analysis"
   - Wait for Check-1 and Check-2 to complete
   - View results automatically

### 3. View Results

**QC Report Page** displays:
- **Check-1 Results**: QA/QC review with scoring
- **Check-2 Results**: Technical review with questions
- **Combined Score**: Overall quality assessment
- **Score Category**: Color-coded classification
- **Download Options**: PDF or Word report

### 4. Download Reports

1. On QC Report page
2. Click **"Download PDF"** or **"Download Word"**
3. File downloads automatically
4. Filename: `QC_Report_[DocumentNumber]_[Date].pdf`

### 5. Use AI Chat

1. Click chat button (bottom-right)
2. Type your question
3. Press Enter or click Send
4. AI responds using OpenRouter API
5. Conversation history maintained

---

## 🏗️ Technical Architecture

### Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 19.2.0 |
| **Build Tool** | Vite 7.2.2 |
| **UI Library** | Material-UI 5.15.0 |
| **Routing** | React Router DOM 6.26.0 |
| **PDF Processing** | pdfjs-dist 4.0.379, pdf-lib 1.17.1 |
| **OCR** | tesseract.js 5.1.1 |
| **Document Processing** | mammoth 1.6.0, docx 8.5.0 |
| **AI API** | OpenRouter API (via openRouter.js) |

### Project Structure

```
client/
├── src/
│   ├── api/
│   │   └── openRouter.js          # OpenRouter API integration
│   ├── components/
│   │   ├── Chat/
│   │   │   ├── AIChat.jsx         # AI Chat Assistant
│   │   │   └── AIChat.css
│   │   ├── Common/
│   │   │   ├── APISettings.jsx    # API configuration UI
│   │   │   ├── ErrorBoundary.jsx  # Error handling
│   │   │   ├── Loader.jsx          # Loading indicators
│   │   │   └── TerminalLog.jsx    # Progress logging
│   │   ├── Dashboard/
│   │   │   ├── DisciplineSelector.jsx
│   │   │   └── ScoreDisplay.jsx
│   │   ├── Layout/
│   │   │   ├── AdminLayout.jsx    # Admin navigation
│   │   │   └── DisciplineLayout.jsx # User navigation
│   │   ├── Results/
│   │   │   ├── FinalReport.jsx    # Main report view
│   │   │   ├── QCResultCheck1.jsx # Check-1 display
│   │   │   ├── QCResultCheck2.jsx # Check-2 display
│   │   │   └── FormattedTable.jsx # Table formatting
│   │   └── Upload/
│   │       ├── FileUpload.jsx      # File upload component
│   │       ├── DocumentMeta.jsx    # Metadata form
│   │       ├── ReadingProgress.jsx # Progress indicator
│   │       └── DocumentTextViewer.jsx # Text viewer
│   ├── config/
│   │   ├── constants.js           # App constants
│   │   └── documentTypes.js        # Document classification
│   ├── context/
│   │   └── AuthContext.jsx         # Authentication state
│   ├── hooks/
│   │   ├── useAIQC.js              # AI QC analysis hook
│   │   ├── useFileReader.js        # File reading hook
│   │   └── useScoring.js           # Scoring calculations
│   ├── pages/
│   │   ├── Login.jsx               # Login page
│   │   ├── Dashboard.jsx           # Main dashboard
│   │   ├── UploadDoc.jsx           # Document upload
│   │   ├── QCReport.jsx            # QC results view
│   │   ├── Reports.jsx             # Reports management
│   │   └── History.jsx             # QC history
│   ├── routes/
│   │   └── AppRoutes.jsx           # Route definitions
│   └── utils/
│       ├── documentClassifier.js   # Document classification
│       ├── documentChunker.js      # Large doc chunking
│       ├── ocrProcessor.js         # OCR processing
│       ├── promptCheck1.js          # Check-1 prompts
│       ├── promptCheck2.js          # Check-2 prompts
│       ├── reportGenerator.js       # PDF/Word generation
│       ├── responseParser.js         # AI response parsing
│       ├── scoringHelper.js         # Score calculations
│       ├── tableFormatter.js        # Table formatting
│       └── historyManager.js        # History storage
├── public/                          # Static assets
├── package.json                     # Dependencies
├── vite.config.js                   # Vite configuration
└── README.md                        # Quick start guide
```

### Data Flow

```
1. User uploads document
   ↓
2. File validation (type, size, engineering check)
   ↓
3. Text extraction (PDF/Word/Text)
   ↓
4. OCR for scanned pages (if needed)
   ↓
5. Document classification (Drawing/Document)
   ↓
6. Check-1: QA/QC Analysis (AI)
   ↓
7. Check-2: Technical Review (AI)
   ↓
8. Score calculation & categorization
   ↓
9. Results display & report generation
   ↓
10. History saved to localStorage
```

---

## 🔧 API Configuration

### Default API Key

The application uses a **hardcoded OpenRouter API key** by default:
```
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
```

### API Key Priority

1. **Environment Variable** (`.env` file): `VITE_OPENROUTER_API_KEY`
2. **localStorage**: User-set key in API Settings
3. **Hardcoded Default**: Your key (automatic fallback)

### API Settings

Access via **"⚙️ API Settings"** button on Upload page:
- Change API key (optional)
- Select AI model
- Adjust max tokens
- Choose API provider (OpenRouter/OpenAI/Anthropic)

### Supported Models

**Free Models** (default):
- `meta-llama/llama-3.2-3b-instruct:free`
- `mistralai/mistral-7b-instruct:free`
- `openchat/openchat-7b:free`

**Paid Models**:
- `gpt-3.5-turbo` (low cost)
- `claude-3-haiku` (low cost)
- `claude-3.5-sonnet` (high quality)

---

## 📄 File Processing

### PDF Processing

**Text-Based PDFs**:
- Direct text extraction using pdfjs-dist
- Processes all pages sequentially
- Real-time progress tracking

**Scanned PDFs**:
- Automatic OCR detection
- Uses Tesseract.js for text extraction
- Higher processing time (10-30 sec/page)

**Large PDFs (785+ pages)**:
- Processes all pages
- Intelligent chunking for AI analysis
- Representative sections selected for very large docs

### Word Document Processing

- Uses `mammoth` library for .docx files
- Extracts raw text content
- Estimates pages based on word count
- Line-by-line progress simulation

### Text File Processing

- Direct text reading
- Line-by-line processing
- Page estimation (50 lines/page)

### OCR Processing

**When OCR is Used**:
- Scanned/image-based PDFs
- PDFs with no selectable text
- PDFs with very short text (<50 chars)

**OCR Configuration**:
- Language: English (eng)
- Scale: 2.0x for better accuracy
- Worker: Lazy-loaded for performance

---

## 🔍 QC Analysis System

### Check-1: QA/QC Review

**For Drawings**:
- Title block verification
- Scale and units check
- Compliance with standards
- Technical accuracy
- Interdisciplinary consistency

**For Documents**:
- Aesthetic presentation
- Completeness check
- Technical accuracy
- Format compliance
- Approval trail verification

**General Checks**:
- Aesthetic quality
- Logical consistency
- Technical soundness
- Completeness

### Check-2: Technical Review

**Methodology**: 5Ws + H
- **Who**: Responsible parties
- **What**: Deliverable content
- **When**: Timeline and dates
- **Where**: Location references
- **Why**: Purpose and rationale
- **How**: Methodology and approach

**Auto-Checks**:
- Blank fields detection
- Inconsistency identification
- Standards compliance
- Risk assessment (High/Medium/Low)

### Scoring Calculation

**Combined Score Formula**:
```
Combined Score = (Check-1 Score × 0.6) + (Check-2 Score × 0.4)
```

**Risk Weighting** (Check-2):
- High Risk: Weight 3
- Medium Risk: Weight 2
- Low Risk: Weight 0.5

---

## 🐛 Troubleshooting

### Common Issues

#### 1. "API key not found" Error

**Solution**:
- API key is hardcoded, should work automatically
- Check browser console for errors
- Verify API key in `client/src/api/openRouter.js`

#### 2. Only 1 Page Read from Large PDF

**Check**:
- Browser console for errors
- Look for "PDF loaded: X pages detected" message
- Verify `MAX_PAGES_TO_READ` is set to `null` in `constants.js`

**Fix**:
- Restart dev server
- Clear browser cache
- Check console for extraction errors

#### 3. OCR Not Working

**Solution**:
```bash
cd client
npm install tesseract.js
```
- Restart dev server
- Check browser console for OCR errors
- Ensure Web Workers are enabled in browser

#### 4. File Upload Fails

**Check**:
- File size (max 50MB)
- File type (PDF, Word, Excel, Text, CAD)
- Browser console for errors
- Network connectivity

#### 5. Slow Processing for Large PDFs

**Expected**:
- 785 pages: 5-15 minutes
- OCR pages: 10-30 seconds each
- Normal pages: 1-2 seconds each

**Optimization**:
- Process in smaller batches
- Use text-based PDFs when possible
- Reduce max tokens in API settings

#### 6. Port Already in Use

**Solution**:
```bash
# Kill process on port 5173 (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change port in vite.config.js
server: { port: 3000 }
```

---

## 💻 Development Guide

### Running in Development

```bash
cd client
npm install
npm run dev
```

### Building for Production

```bash
npm run build
npm run preview  # Preview production build
```

### Code Structure

**Key Files to Modify**:

1. **API Configuration**: `src/api/openRouter.js`
   - Default API key
   - Model selection
   - Token limits

2. **Constants**: `src/config/constants.js`
   - File size limits
   - Page limits
   - Scoring categories

3. **Prompts**: `src/utils/promptCheck1.js`, `promptCheck2.js`
   - QC analysis prompts
   - Question templates

4. **Styling**: Component-specific CSS files
   - Material-UI theme in `App.jsx`

### Adding New Features

**New Document Type**:
1. Add to `src/config/documentTypes.js`
2. Update `src/utils/documentClassifier.js`
3. Add extraction logic if needed

**New Discipline**:
1. Add to `DISCIPLINES` in `src/config/constants.js`
2. Update prompts in `promptCheck1.js` and `promptCheck2.js`

**New QC Check**:
1. Update prompts in `promptCheck1.js` or `promptCheck2.js`
2. Modify response parser if needed

---

## 📊 Performance Considerations

### Large Document Processing

**For 785-page PDFs**:
- Processing time: 5-15 minutes
- Memory usage: Moderate (browser-based)
- Progress tracking: Real-time updates
- Chunking: Automatic for AI processing

### Optimization Tips

1. **Reduce API Calls**:
   - Lower max_tokens (1500-2000)
   - Use free models for testing
   - Process representative sections

2. **Faster OCR**:
   - Use text-based PDFs when possible
   - Reduce OCR scale (if quality allows)
   - Process OCR pages in background

3. **Better Performance**:
   - Clear browser cache regularly
   - Close other browser tabs
   - Use modern browser (Chrome/Firefox)

---

## 🔐 Security Notes

### Current Implementation

- **No Backend**: All processing client-side
- **API Key**: Hardcoded (visible in code)
- **Data Storage**: Browser localStorage only
- **No Authentication**: Demo mode (any credentials)

### Production Recommendations

1. **Backend Integration**:
   - Move API key to secure backend
   - Implement proper authentication
   - Database for history storage

2. **API Key Security**:
   - Use environment variables
   - Never commit keys to git
   - Rotate keys regularly

3. **Data Protection**:
   - Encrypt sensitive data
   - Implement user authentication
   - Secure file uploads

---

## 📝 File Formats & Limits

### Supported Formats

| Format | Extension | Max Size | Processing |
|--------|-----------|----------|------------|
| PDF | .pdf | 50MB | Full text + OCR |
| Word | .docx, .doc | 50MB | Full text |
| Excel | .xlsx, .xls | 50MB | Filename only |
| Text | .txt, .rtf | 50MB | Full text |
| CAD | .dwg, .dxf | 50MB | Filename only |

### Processing Limits

- **Max File Size**: 50MB
- **Max Pages**: Unlimited (null)
- **Content Limit**: 200K characters for AI
- **Chunk Size**: 15K characters per chunk
- **Chunk Overlap**: 500 characters

---

## 🎨 UI/UX Features

### Material-UI Theme

- **Primary Color**: #0f6fde (Blue)
- **Secondary Color**: #0b5ed7 (Blue)
- **Background**: #f5f6fb (Light gray)
- **Typography**: Segoe UI font family

### Responsive Design

- **Mobile**: Stacked layout, scrollable tabs
- **Tablet**: Optimized grid layouts
- **Desktop**: Full-width containers

### Visual Indicators

- **Progress Bars**: Page and line progress
- **Color Coding**: Score categories
- **Status Icons**: Reading, processing, completed
- **Real-time Updates**: Live progress tracking

---

## 📚 Additional Resources

### API Documentation

- **OpenRouter**: https://openrouter.ai/docs
- **Available Models**: https://openrouter.ai/models
- **API Reference**: https://openrouter.ai/api-reference

### Libraries Used

- **React**: https://react.dev/
- **Material-UI**: https://mui.com/
- **Vite**: https://vitejs.dev/
- **PDF.js**: https://mozilla.github.io/pdf.js/
- **Tesseract.js**: https://tesseract.projectnaptha.com/

---

## 🆘 Support & Contact

### Getting Help

1. **Check Console**: Browser DevTools (F12)
2. **Review Logs**: Terminal output during dev
3. **Check This Documentation**: Most issues covered here

### Common Error Messages

| Error | Solution |
|-------|----------|
| "API key not found" | Key is hardcoded, check code |
| "Failed to resolve tesseract.js" | Run `npm install tesseract.js` |
| "Only 1 page read" | Check console, verify page limit is null |
| "Engineering document validation failed" | Upload engineering-related files only |
| "Port already in use" | Change port or kill process |

---

## 📅 Version History

### Current Version: 1.0.0

**Features**:
- ✅ Multi-format document support
- ✅ Large PDF processing (785+ pages)
- ✅ OCR for scanned documents
- ✅ Two-stage QC analysis
- ✅ AI chat assistant
- ✅ Report generation (PDF/Word)
- ✅ History tracking
- ✅ Role-based access

**Known Limitations**:
- No backend (localStorage only)
- No real authentication
- OCR can be slow for large scanned PDFs
- Large documents take time to process

---

## 🚀 Future Enhancements

### Planned Features

- [ ] Backend integration for persistent storage
- [ ] Real user authentication system
- [ ] Database for QC history
- [ ] Email notifications
- [ ] Document Management System (DMS) integration
- [ ] Advanced analytics dashboard
- [ ] Learning from past QC feedback
- [ ] Multi-language support
- [ ] Batch document processing
- [ ] Custom QC checklists

---

## 📄 License

This project is proprietary software for internal use by Petrolenz.

---

## ✅ Quick Reference

### Start Application
```bash
cd client
npm install
npm run dev
```

### Access Application
- **URL**: http://localhost:5173
- **Login**: Any credentials (demo mode)

### Default API Key
- Already configured in code
- No setup needed

### Supported Files
- PDF, Word, Excel, Text, CAD
- Max 50MB, unlimited pages

### Key Features
- AI-powered QC analysis
- OCR for scanned PDFs
- Real-time progress tracking
- PDF/Word report generation
- AI chat assistant

---

**Last Updated**: 2024
**Version**: 1.0.0
**Status**: Production Ready

