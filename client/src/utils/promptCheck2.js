// Prompt builder for Check-2 Technical checks

export function buildCheck2Prompt(documentType, specificType, discipline, isDrawing) {
  const prompt = `CHECK-2 TECHNICAL CHECKS (BEGIN AFTER COMPLETING CHECK-1)

🎯 YOUR MANDATE (DO THIS FOR EVERY INPUT)
1️⃣ Document Type Identification
• Detected Type: ${isDrawing ? 'Drawing' : 'Document'}
• Specific Type: ${specificType}
• Discipline: ${discipline}

2️⃣ Load Context-Specific Questions Automatically
• Load dynamic technical QA/QC questions relevant to the identified document type.
• Each question must fall under one or more categories: Completeness, Logical/Engineering Accuracy, Cross-referencing, Safety/Code Compliance (validate ISA/IEC/API/NFPA references, versions, applicability), Optimization & Maintainability.

3️⃣ Ask Smart, Deep-Review Questions using 5Ws + H:
• What is this value/tag/item? Why selected? Where sourced? Who approved? How justified?
• Raise at least 40 pertinent questions when the deliverable warrants it.

4️⃣ Auto-Check Wherever Possible:
• Detect blanks, inconsistent data, mismatched specs.
• Compare against standards and prior project norms.
• Calculate totals (e.g., load sums vs. transformer size) and cross-verify related docs (P&ID ↔ ISO ↔ MTO).

5️⃣ Flag Issues with Reason:
For each QA/QC point:
• Status must be ✅ Pass, ⚠️ Warning, or ❌ Open Issue.
• Provide source basis: Input Document / Logical Engineering Rule / Good Engineering Practice (GEP) / Not Available.
• Track scoring (Pass count ÷ Total questions) to obtain the Check-2 technical score.

6️⃣ Generate a QA/QC Summary Report:
• Document Type
• Total Questions Raised
• Pass/Warning/Open counts
• Key risks
• Suggested actions

${getExamples(specificType, isDrawing)}

💡 FINAL OUTPUT FORMAT FOR CHECK-2
Produce a Word-ready table:
Question No | QA/QC Question | Status | Source | Reviewer Notes

After listing all questions, provide:
• Technical Score (Pass / Total questions)
• Summary narrative

Complete all Check-2 mandates without omission. Finally, provide the consolidated score combining Check-1 and Check-2 and restate the final QC verdict. Include the required disclaimer verbatim at the end of the report.`;

  return prompt;
}

function getExamples(specificType, isDrawing) {
  if (!isDrawing) {
    if (specificType.toLowerCase().includes('load list') || specificType.toLowerCase().includes('electrical')) {
      return `🔄 EXAMPLES (Per Document Type):

🧾 If Document Type = Electrical Load List

Raise questions like:
• Are all loads traceable to equipment in the layout or spec?
• Is the sum of connected loads matching the SLD?
• Are power factor and demand factor assumptions realistic?
• Is transformer sizing adequate?
• What is the backup or redundancy provision?`;
    }
  } else {
    if (specificType.toLowerCase().includes('isometric') || specificType.toLowerCase().includes('iso')) {
      return `🔄 EXAMPLES (Per Document Type):

🧾 If Document Type = Isometric Drawing

Raise questions like:
• Are pipe specs consistent with the P&ID?
• Is flow direction shown?
• Are supports and slopes shown?
• Do line numbers match spec and service?
• What is the pressure rating justification?`;
    }
    if (specificType.toLowerCase().includes('p&id') || specificType.toLowerCase().includes('pid')) {
      return `🔄 EXAMPLES (Per Document Type):

🧾 If Document Type = P&ID

Raise questions like:
• Are instrument symbols compliant with ISA/IEC?
• Are control loops complete and uniquely numbered?
• Are safety valves shown for all relief scenarios?
• Where is the data source for setpoints?`;
    }
  }
  
  return `🔄 EXAMPLES (Per Document Type):

Based on the document type "${specificType}", raise comprehensive technical questions covering:
• Completeness of all required information
• Technical accuracy and engineering logic
• Cross-referencing with related documents
• Compliance with applicable codes and standards
• Safety and operational considerations`;
}

