// Report generator utilities for PDF and Word

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Generate PDF report
 */
export async function generatePDFReport({
  check1Result,
  check2Result,
  check1Score,
  check2Score,
  combinedScore,
  scoreCategory,
  documentMeta,
  discipline,
  documentType,
  disclaimer
}) {
  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage([595, 842]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Courier);
  const boldFont = await pdfDoc.embedFont(StandardFonts.CourierBold);

  let y = 800;
  const margin = 50;
  const lineHeight = 16;
  const pageHeight = 792;
  const maxWidth = 595 - margin * 2;

  const wrapText = (text, size, useBoldFont = false) => {
    const words = text.split(' ');
    const lines = [];
    let currentLine = '';
    const currentFont = useBoldFont ? boldFont : font;

    words.forEach(word => {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const testWidth = currentFont.widthOfTextAtSize(testLine, size);
      if (testWidth > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    });

    if (currentLine) {
      lines.push(currentLine);
    }
    return lines.length ? lines : [''];
  };

  const ensureSpace = () => {
    if (y < margin + lineHeight) {
      page = pdfDoc.addPage([595, 842]);
      y = pageHeight;
    }
  };

  const addText = (text, size = 11, isBold = false, color = rgb(0, 0, 0)) => {
    const lines = wrapText(text, size, isBold);
    lines.forEach(line => {
      ensureSpace();
      page.drawText(line, {
        x: margin,
        y: y,
        size: size,
        font: isBold ? boldFont : font,
        color: color
      });
      y -= lineHeight;
    });
  };

  // Title
  addText('QC REPORT', 18, true);
  y -= 6;

  // Document Info
  if (documentMeta) {
    addText('Document Information:', 13, true);
    addText(`Title: ${documentMeta.title || 'N/A'}`, 11);
    addText(`Number: ${documentMeta.documentNumber || 'N/A'}`, 11);
    addText(`Revision: ${documentMeta.revision || 'N/A'}`, 11);
    addText(`Status: ${documentMeta.status || 'N/A'}`, 11);
    addText(`Discipline: ${discipline || 'N/A'}`, 11);
    addText(`Type: ${documentType || 'N/A'}`, 11);
    y -= 6;
  }

  // Scores
  addText('Quality Scores:', 13, true);
  if (check1Score !== null) {
    addText(`Check-1 (QA/QC): ${formatScore(check1Score)}`, 12);
  }
  if (check2Score !== null) {
    addText(`Check-2 (Technical): ${formatScore(check2Score)}`, 12);
  }
  if (combinedScore !== null) {
    addText(`Overall Score: ${formatScore(combinedScore)}`, 14, true);
    if (scoreCategory) {
      addText(`Category: ${scoreCategory.label}`, 12);
    }
  }
  y -= 20;

  // Check-1 Results
  if (check1Result) {
    addText('Check-1: QA/QC Review Results', 16, true);
    y -= 10;
    const check1Text = check1Result.response || check1Result;
    const lines = check1Text.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        addText(line.substring(0, 80), 10); // Limit line length
      }
    }
    y -= 20;
  }

  // Check-2 Results
  if (check2Result) {
    addText('Check-2: Technical Review Results', 16, true);
    y -= 10;
    const check2Text = check2Result.response || check2Result;
    const lines = check2Text.split('\n');
    for (const line of lines) {
      if (line.trim()) {
        addText(line.substring(0, 80), 10);
      }
    }
    y -= 20;
  }

  // Consolidated Score
  if (combinedScore !== null) {
    addText('Consolidated Overall Score', 16, true);
    y -= 10;
    addText(`Check-1 Score: ${formatScore(check1Score)}`, 12);
    addText(`Check-2 Score: ${formatScore(check2Score)}`, 12);
    addText(`Overall Score: ${formatScore(combinedScore)}`, 12, true);
    if (scoreCategory) {
      addText(`Category: ${scoreCategory.label}`, 12);
    }
    y -= 20;
  }

  // Disclaimer
  if (disclaimer) {
    y -= 20;
    addText('Disclaimer:', 12, true);
    y -= 5;
    const disclaimerLines = disclaimer.split(' ');
    let currentLine = '';
    for (const word of disclaimerLines) {
      if ((currentLine + word).length < 80) {
        currentLine += word + ' ';
      } else {
        addText(currentLine, 8);
        currentLine = word + ' ';
      }
    }
    if (currentLine) {
      addText(currentLine, 8);
    }
  }

  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const fileName = `QC_Report_${documentMeta?.documentNumber || 'Report'}_${new Date().toISOString().split('T')[0]}.pdf`;
  saveAs(blob, fileName);
}

/**
 * Generate Word report
 */
export async function generateWordReport({
  check1Result,
  check2Result,
  check1Score,
  check2Score,
  combinedScore,
  scoreCategory,
  documentMeta,
  discipline,
  documentType,
  disclaimer
}) {
  const children = [];
  const MONO_FONT = 'Courier New';
  const BODY_SIZE = 22; // 11pt (docx uses half-points)

  const createParagraph = ({
    text,
    heading,
    spacing,
    bold = false,
    italics = false,
    size = BODY_SIZE
  }) =>
    new Paragraph({
      heading,
      spacing,
      children: [
        new TextRun({
          text,
          bold,
          italics,
          font: MONO_FONT,
          size
        })
      ]
    });

  // Title
  children.push(
    createParagraph({
      text: 'QC REPORT',
      heading: HeadingLevel.TITLE,
      spacing: { after: 400 },
      bold: true,
      size: 32
    })
  );

  // Document Information
  if (documentMeta) {
    children.push(
      createParagraph({
        text: 'Document Information',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 },
        bold: true,
        size: 26
      })
    );

    const metaInfo = [
      `Title: ${documentMeta.title || 'N/A'}`,
      `Number: ${documentMeta.documentNumber || 'N/A'}`,
      `Revision: ${documentMeta.revision || 'N/A'}`,
      `Status: ${documentMeta.status || 'N/A'}`,
      `Discipline: ${discipline || 'N/A'}`,
      `Type: ${documentType || 'N/A'}`
    ];

    metaInfo.forEach(info => {
      children.push(
        createParagraph({
          text: info,
          spacing: { after: 100 }
        })
      );
    });
  }

  // Scores
  children.push(
    createParagraph({
      text: 'Quality Scores',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 },
      bold: true,
      size: 26
    })
  );

  if (check1Score !== null) {
    children.push(
      createParagraph({
        text: `Check-1 (QA/QC): ${formatScore(check1Score)}`,
        spacing: { after: 100 }
      })
    );
  }

  if (check2Score !== null) {
    children.push(
      createParagraph({
        text: `Check-2 (Technical): ${formatScore(check2Score)}`,
        spacing: { after: 100 }
      })
    );
  }

  if (combinedScore !== null) {
    children.push(
      createParagraph({
        text: `Overall Score: ${formatScore(combinedScore)}`,
        bold: true,
        spacing: { after: 100 }
      })
    );

    if (scoreCategory) {
      children.push(
        createParagraph({
          text: `Category: ${scoreCategory.label}`,
          spacing: { after: 200 }
        })
      );
    }
  }

  // Check-1 Results
  if (check1Result) {
    children.push(
      createParagraph({
        text: 'Check-1: QA/QC Review Results',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
        bold: true,
        size: 26
      })
    );

    const check1Text = check1Result.response || check1Result;
    const lines = check1Text.split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        children.push(
        createParagraph({
          text: line,
          spacing: { after: 100 }
        })
        );
      }
    });
  }

  // Check-2 Results
  if (check2Result) {
    children.push(
      createParagraph({
        text: 'Check-2: Technical Review Results',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
        bold: true,
        size: 26
      })
    );

    const check2Text = check2Result.response || check2Result;
    const lines = check2Text.split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        children.push(
        createParagraph({
          text: line,
          spacing: { after: 100 }
        })
        );
      }
    });
  }

  // Consolidated Score
  if (combinedScore !== null) {
    children.push(
      createParagraph({
        text: 'Consolidated Overall Score',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 },
        bold: true,
        size: 26
      })
    );

    children.push(
      createParagraph({
        text: `Check-1 Score: ${formatScore(check1Score)}`,
        spacing: { after: 100 }
      })
    );

    children.push(
      createParagraph({
        text: `Check-2 Score: ${formatScore(check2Score)}`,
        spacing: { after: 100 }
      })
    );

    children.push(
      createParagraph({
        text: `Overall Score: ${formatScore(combinedScore)}`,
        bold: true,
        spacing: { after: 100 }
      })
    );

    if (scoreCategory) {
      children.push(
        createParagraph({
          text: `Category: ${scoreCategory.label}`,
          spacing: { after: 200 }
        })
      );
    }
  }

  // Disclaimer
  if (disclaimer) {
    children.push(
      createParagraph({
        text: 'Disclaimer',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 },
        bold: true,
        size: 24
      })
    );

    children.push(
      createParagraph({
        text: disclaimer,
        italics: true,
        size: 18,
        spacing: { after: 200 }
      })
    );
  }

  const doc = new Document({
    sections: [{
      children: children
    }]
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `QC_Report_${documentMeta?.documentNumber || 'Report'}_${new Date().toISOString().split('T')[0]}.docx`;
  saveAs(blob, fileName);
}

function formatScore(score) {
  if (score === null || score === undefined) return 'N/A';
  return `${Math.round(score * 100) / 100}%`;
}

