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
  DOC: 'application/msword'
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

