// Constants for Petrolenz QC Platform

export const DISCIPLINES = [
  'Process',
  'Piping',
  'Civil & Structural',
  'Mechanical',
  'Electrical',
  'Instrumentation',
  'HSE',
  'General Engineering Deliverables',
  'Projects'
];

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
};

export const SCORING_CATEGORIES = {
  EXCELLENT: { min: 95, max: 100, label: 'Approved – Excellent', action: 'No or minor comments', color: '#10b981' },
  APPROVED_MINOR: { min: 80, max: 94, label: 'Approved with Minor Comments', action: 'Acceptable, no re-issue needed', color: '#3b82f6' },
  NEEDS_REVISION: { min: 70, max: 79, label: 'Needs Revision', action: 'Rework and re-review required', color: '#f59e0b' },
  REJECTED: { min: 0, max: 69, label: 'Rejected', action: 'Major issues, rework essential', color: '#ef4444' }
};

export const RISK_LEVELS = {
  HIGH: { weight: 3, label: 'High Risk', color: '#ef4444' },
  MEDIUM: { weight: 2, label: 'Medium Risk', color: '#f59e0b' },
  LOW: { weight: 0.5, label: 'Low Risk', color: '#3b82f6' }
};

export const CHECK_STATUS = {
  OK: { label: 'OK', score: 1, color: '#10b981' },
  PARTIAL: { label: 'Partial', score: 0.5, color: '#f59e0b' },
  NOT_OK: { label: 'Not OK', score: 0, color: '#ef4444' }
};

export const DOCUMENT_STATUS = {
  IFR: 'IFR - Issued for Review',
  IFA: 'IFA - Issued for Approval',
  IFC: 'IFC - Issued for Construction',
  AS_BUILT: 'As-Built'
};

export const SOURCE_BASIS = {
  INPUT_DOCUMENT: '📎 Input Document',
  GOOD_PRACTICE: '💊 Good Engineering Practice',
  ENGINEERING_LOGIC: '🔧 Engineering Logic',
  NOT_AVAILABLE: '❓ Not Available'
};

export const FILE_TYPES = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  DOC: 'application/msword',
  XLSX: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  XLS: 'application/vnd.ms-excel',
  DWG: 'application/acad',
  DXF: 'image/vnd.dxf',
  TXT: 'text/plain',
  RTF: 'application/rtf'
};

// Maximum pages to read from documents (set to null for unlimited)
export const MAX_PAGES_TO_READ = null; // null = unlimited, set number to limit

// Chunking configuration for large documents
export const CHUNK_SIZE = 15000; // Characters per chunk for AI processing
export const CHUNK_OVERLAP = 500; // Overlap between chunks to maintain context

// OCR Configuration
export const OCR_CONFIG = {
  lang: 'eng',
  workerPath: 'https://unpkg.com/tesseract.js@5.0.4/dist/worker.min.js',
  corePath: 'https://unpkg.com/tesseract.js-core@5.0.0/tesseract-core.wasm.js'
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

// Engineering document validation keywords
export const ENGINEERING_KEYWORDS = [
  // Disciplines
  'process', 'piping', 'civil', 'structural', 'mechanical', 'electrical', 
  'instrumentation', 'hse', 'hvac', 'telecom', 'pipeline',
  // Drawing types
  'p&id', 'pid', 'pfd', 'process flow diagram', 'isometric', 'iso', 
  'general arrangement', 'ga drawing', 'layout', 'sld', 'single line diagram',
  'loop diagram', 'wiring diagram', 'instrumentation drawing',
  // Document types
  'specification', 'spec', 'datasheet', 'data sheet', 'calculation', 'cal',
  'design basis', 'philosophy', 'report', 'load list', 'instrument index',
  'boq', 'bill of quantities', 'mto', 'material take off', 'line list',
  'cable schedule', 'tbe', 'technical bid evaluation', 'material requisition',
  'vendor data', 'hookup', 'skid', 'package',
  // Engineering terms
  'engineering', 'drawing', 'dwg', 'deliverable', 'qa/qc', 'qaqc',
  'epc', 'project', 'construction', 'commissioning', 'operation',
  'piping', 'valve', 'pump', 'vessel', 'tank', 'heat exchanger',
  'stress', 'analysis', 'design', 'review', 'approval', 'revision',
  'document number', 'title block', 'ifr', 'ifa', 'ifc', 'as built',
  'engineering document', 'technical document'
];

