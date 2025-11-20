// Report generator utilities for PDF and Word

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType } from 'docx';
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
  const page = pdfDoc.addPage([595, 842]); // A4 size
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 800;
  const margin = 50;
  const lineHeight = 20;
  const pageHeight = 792;

  // Helper function to add text with page break
  const addText = (text, size = 12, isBold = false, color = rgb(0, 0, 0)) => {
    if (y < margin + lineHeight) {
      const newPage = pdfDoc.addPage([595, 842]);
      y = pageHeight;
    }
    page.drawText(text, {
      x: margin,
      y: y,
      size: size,
      font: isBold ? boldFont : font,
      color: color
    });
    y -= lineHeight;
  };

  // Title
  addText('QC REPORT', 20, true);
  y -= 10;

  // Document Info
  if (documentMeta) {
    addText('Document Information:', 14, true);
    addText(`Title: ${documentMeta.title || 'N/A'}`, 12);
    addText(`Number: ${documentMeta.documentNumber || 'N/A'}`, 12);
    addText(`Revision: ${documentMeta.revision || 'N/A'}`, 12);
    addText(`Status: ${documentMeta.status || 'N/A'}`, 12);
    addText(`Discipline: ${discipline || 'N/A'}`, 12);
    addText(`Type: ${documentType || 'N/A'}`, 12);
    y -= 10;
  }

  // Scores
  addText('Quality Scores:', 14, true);
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

  // Title
  children.push(
    new Paragraph({
      text: 'QC REPORT',
      heading: HeadingLevel.TITLE,
      spacing: { after: 400 }
    })
  );

  // Document Information
  if (documentMeta) {
    children.push(
      new Paragraph({
        text: 'Document Information',
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200 }
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
        new Paragraph({
          text: info,
          spacing: { after: 100 }
        })
      );
    });
  }

  // Scores
  children.push(
    new Paragraph({
      text: 'Quality Scores',
      heading: HeadingLevel.HEADING_1,
      spacing: { before: 400, after: 200 }
    })
  );

  if (check1Score !== null) {
    children.push(
      new Paragraph({
        text: `Check-1 (QA/QC): ${formatScore(check1Score)}`,
        spacing: { after: 100 }
      })
    );
  }

  if (check2Score !== null) {
    children.push(
      new Paragraph({
        text: `Check-2 (Technical): ${formatScore(check2Score)}`,
        spacing: { after: 100 }
      })
    );
  }

  if (combinedScore !== null) {
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Overall Score: ${formatScore(combinedScore)}`,
            bold: true
          })
        ],
        spacing: { after: 100 }
      })
    );

    if (scoreCategory) {
      children.push(
        new Paragraph({
          text: `Category: ${scoreCategory.label}`,
          spacing: { after: 200 }
        })
      );
    }
  }

  // Check-1 Results
  if (check1Result) {
    children.push(
      new Paragraph({
        text: 'Check-1: QA/QC Review Results',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );

    const check1Text = check1Result.response || check1Result;
    const lines = check1Text.split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        children.push(
          new Paragraph({
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
      new Paragraph({
        text: 'Check-2: Technical Review Results',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );

    const check2Text = check2Result.response || check2Result;
    const lines = check2Text.split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        children.push(
          new Paragraph({
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
      new Paragraph({
        text: 'Consolidated Overall Score',
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );

    children.push(
      new Paragraph({
        text: `Check-1 Score: ${formatScore(check1Score)}`,
        spacing: { after: 100 }
      })
    );

    children.push(
      new Paragraph({
        text: `Check-2 Score: ${formatScore(check2Score)}`,
        spacing: { after: 100 }
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `Overall Score: ${formatScore(combinedScore)}`,
            bold: true
          })
        ],
        spacing: { after: 100 }
      })
    );

    if (scoreCategory) {
      children.push(
        new Paragraph({
          text: `Category: ${scoreCategory.label}`,
          spacing: { after: 200 }
        })
      );
    }
  }

  // Disclaimer
  if (disclaimer) {
    children.push(
      new Paragraph({
        text: 'Disclaimer',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 400, after: 200 }
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: disclaimer,
            italics: true,
            size: 18 // 9pt in half-points
          })
        ],
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

