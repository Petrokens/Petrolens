const mammoth = require('mammoth');
const fs = require('fs');
const { callGPT } = require('../services/openaiService');
const path = require('path');
const checklist = require('../data/checklist.json');

const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel
} = require('docx');

exports.evaluateChecklist = async (req, res) => {
  try {
    const designFile = req.files.find(file => file.fieldname === 'design');

    if (!designFile) {
      return res.status(400).json({ error: 'Missing design file' });
    }

    const designPath = designFile.path;
    const designText = (await mammoth.extractRawText({ path: designPath })).value;

    const evaluations = [];

    for (const section of checklist) {
      for (const point of section.items) {
        const result = await callGPT(point.item, designText);
        evaluations.push({
          section: section.section,
          checklist_item: point.item,
          ...result
        });
      }
    }

    // Calculate score
    const total = evaluations.length;
    const passed = evaluations.filter(e => e.result === "Yes").length;
    const score = Math.round((passed / total) * 100);

    // Create reports folder if not exist
    const reportsDir = path.join(__dirname, '..', 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir);
    }

    // Create Word document
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            text: "Civil Design Basis QC Report",
            heading: HeadingLevel.TITLE,
          }),
          new Paragraph({
            text: `Overall Compliance Score: ${score}% (${passed}/${total} Passed)`,
            spacing: { after: 300 },
            heading: HeadingLevel.HEADING_2,
          }),
          ...evaluations.map(e =>
            new Paragraph({
              children: [
                new TextRun({ text: `✔ Checklist: ${e.checklist_item}`, bold: true }),
                new TextRun({ text: `\nSection: ${e.section}` }),
                new TextRun({ text: `\nResult: ${e.result === "Yes" ? "✅ Yes" : "❌ No"} (${Math.round(e.confidence * 100)}%)` }),
                new TextRun({ text: `\nRemark: ${e.remark}` }),
                new TextRun({ text: `\n\n` }),
              ],
            })
          )
        ]
      }]
    });

    const wordPath = path.join(reportsDir, `qc-${Date.now()}.docx`);
    const buffer = await Packer.toBuffer(doc);
    fs.writeFileSync(wordPath, buffer);

    res.json({
      evaluations,
      wordReport: wordPath,
      score
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'QC failed', details: err.message });
  }
};
