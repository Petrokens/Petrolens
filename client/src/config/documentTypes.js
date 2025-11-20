// Document type classification and keywords

export const DOCUMENT_TYPES = {
  DRAWING: 'Drawing',
  DOCUMENT: 'Document'
};

export const DRAWING_TYPES = [
  'P&ID',
  'PFD',
  'Isometric',
  'GA Drawing',
  'Layout',
  'SLD',
  'Loop Diagram',
  'Instrumentation Drawing',
  'HVAC Drawing',
  'Fire Protection Drawing',
  'Structural Drawing',
  'Civil Drawing',
  'Electrical Drawing'
];

export const DOCUMENT_TYPES_LIST = [
  'Design Basis',
  'Report',
  'Specification',
  'Material Requisition',
  'TBE',
  'Calculation',
  'Philosophy',
  'Load List',
  'Instrument Index',
  'BOQ',
  'MTO',
  'Datasheet',
  'Line List',
  'Cable Schedule',
  'Vendor Data'
];

// Keywords for auto-detection
export const DRAWING_KEYWORDS = [
  'p&id', 'pid', 'pfd', 'isometric', 'iso', 'ga', 'general arrangement',
  'layout', 'sld', 'single line diagram', 'loop diagram', 'instrumentation',
  'hvac', 'fire', 'structural', 'civil', 'electrical', 'drawing', 'dwg'
];

export const DOCUMENT_KEYWORDS = [
  'specification', 'spec', 'calculation', 'datasheet', 'data sheet',
  'philosophy', 'report', 'load list', 'instrument index', 'boq', 'mto',
  'material requisition', 'tbe', 'design basis', 'line list', 'cable schedule',
  'vendor data', 'document', 'doc'
];

export function classifyDocumentType(fileName, content = '') {
  const lowerFileName = fileName.toLowerCase();
  const lowerContent = content.toLowerCase();
  const combined = `${lowerFileName} ${lowerContent}`;

  // Check for drawing keywords
  const isDrawing = DRAWING_KEYWORDS.some(keyword => 
    combined.includes(keyword)
  );

  // Check file extension
  const isDrawingExt = /\.(dwg|dxf|pdf)$/i.test(fileName) && 
    (combined.includes('drawing') || combined.includes('layout') || 
     combined.includes('p&id') || combined.includes('isometric'));

  if (isDrawing || isDrawingExt) {
    // Identify specific drawing type
    for (const type of DRAWING_TYPES) {
      if (combined.includes(type.toLowerCase().replace(/\s+/g, ' '))) {
        return { type: DOCUMENT_TYPES.DRAWING, specificType: type };
      }
    }
    return { type: DOCUMENT_TYPES.DRAWING, specificType: 'General Drawing' };
  }

  // Check for document keywords
  const isDocument = DOCUMENT_KEYWORDS.some(keyword => 
    combined.includes(keyword)
  );

  if (isDocument) {
    // Identify specific document type
    for (const type of DOCUMENT_TYPES_LIST) {
      if (combined.includes(type.toLowerCase())) {
        return { type: DOCUMENT_TYPES.DOCUMENT, specificType: type };
      }
    }
    return { type: DOCUMENT_TYPES.DOCUMENT, specificType: 'General Document' };
  }

  // Default based on extension
  if (/\.(docx?|xlsx?)$/i.test(fileName)) {
    return { type: DOCUMENT_TYPES.DOCUMENT, specificType: 'General Document' };
  }

  return { type: DOCUMENT_TYPES.DOCUMENT, specificType: 'Unknown' };
}

