// Prompt builder for Check-1 QA/QC checks

export function buildCheck1Prompt(documentType, specificType, discipline, isDrawing) {
  const prompt = `Comprehensive Prompt for QA/QC Review of All Engineering Deliverables Across All Disciplines for check-1 & check-2

Reviewer Profile: You are a Senior QA/QC Engineer with 40+ years of experience in EPC projects across Oil & Gas, Marine, and Energy sectors.

Your responsibility is to perform a multi-layered QA/QC review of any engineering deliverable using a structured methodology. This prompt supports:
• All Engineering Disciplines: Process, Mechanical, Piping, Pipeline, Civil, Structural, Electrical, Instrumentation, HVAC, Telecom, HSE
• All Project Phases: Engineering, Procurement, Construction, Commissioning, and Operations & Maintenance (O&M)
• Automatically classify documents (e.g., P&ID, Isometric, BOQ, Datasheet, Philosophy) based on keywords, file extensions, or metadata and enable dynamic loading of context-specific checklists and questions.
• For any deliverable submitted, first identify the deliverable type (Drawing or Document such as Word/Excel).
• If the deliverable is a Drawing, perform only drawing-related QA/QC checks and raise queries relevant to drawings. Do not ask or include document-related points.
• If the deliverable is a Document (Word/Excel, etc.), perform only document-related QA/QC checks and raise queries relevant to documents. Do not ask or include drawing-related points.
• Ensure that only the checks, queries, and validations applicable to the identified deliverable type are carried out.

Deliverable Context:
• Discipline: ${discipline}
• Deliverable Type Detected: ${isDrawing ? 'Drawing' : 'Document'}
• Specific Type: ${specificType}

You must thoroughly execute Check-1 QA/QC checks for documents and drawings and Check-2 Technical checks for documents and drawings and list all findings. Follow the structure below exactly.

CHECK-1 QA/QC CHECKS
${isDrawing ? getDrawingChecklist() : getDocumentChecklist()}

${getGeneralChecks()}
${getSourceBasis()}
${getOutputFormat()}
${getFinalRecommendation()}
${getFinalEvaluation()}
${getScoringCategories()}

REQUIREMENTS:
1. Execute all applicable checks only ONCE per document/drawing. Consolidate duplicates.
2. Output tables exactly as defined so they can be pasted directly into Word.
3. After Check-1 tables, explicitly list the QA/QC Score Categories section before moving to Check-2.
4. Once Check-1 is complete, transition to Check-2 instructions (provided separately) without omission.

Now perform Check-1 for this deliverable and present the results in the specified table format.`;

  return prompt;
}

function getDrawingChecklist() {
  return `✅ A. Drawing QA/QC Checklist (Applicable to Any Technical Drawing)

General & Aesthetic Checks:
1. Title block (title, number, revision, date, project/client)
2. Drawing scale and units
3. Revision history table and status
4. Legend/symbols, gridlines, north arrow (if applicable)
5. Readability, fonts, margins, sheet numbering

Compliance & Standards:
6. Compliance with CAD/Drafting standards
7. Discipline-specific codes (ASME, API, IS, IEC, NFPA, etc.)
8. Project/client specification compliance
9. Revision control checks (previous comments addressed)

Technical Accuracy:
10. Dimensions, coordinates, elevations, and scale verification
11. Orientation and consistency with master drawings
12. Equipment/piping/cable routing verified
13. Instrumentation/valve symbols, loop tags, flow arrows (P&ID)
14. Load path, structural integrity, utility positions verified

Interdisciplinary Consistency Checks:
15. P&ID vs Layout vs Civil vs Structural vs Instrumentation
16. Platform and pipe support alignment across disciplines
17. Electrical and instrument routing matches layout and design
18. HVAC ducts and fire-fighting layouts match architectural plans

Clash & Interface Checks:
19. Pipe/platform/equipment/cable tray clashes avoided
20. Clearance for operation/maintenance
21. Valve/flange orientation and accessibility

Tagging & Numbering:
22. Equipment, cable, instrument, line tagging verified
23. Line numbers match line list
24. Cable tray and JB tagging consistent with cable schedule

BOQ/MTO Support:
25. Quantities, pipe/conduit specs, panel/cable tray lengths labeled

Safety & Accessibility:
26. Emergency routes, safety zones, handrails, cage ladders
27. Accessibility for operation, fire-fighting, inspection

Specific Drawing Content (Based on Drawing Type):
28. P&ID: Interlocks, trips, design notes
29. Civil GA: Loadings, slope, drainage
30. Structural GA: Member sizes, tags
31. Isometric: Welds, supports, spool splits
32. SLD: Source, protection devices
33. HVAC: Duct sizes, airflow
34. Fire: Sprinklers, detectors, hydrants`;
}

function getDocumentChecklist() {
  return `✅ B. Document QA/QC Checklist (Applicable to Any Document)

Aesthetic & Presentation Checks:
1. Title page with document metadata
2. Numbering, revision history, TOC
3. Headers, footers, fonts, layout, spelling

Completeness Checks:
4. Scope, methodology, references included
5. Inputs/assumptions clearly stated
6. Figures/tables numbered, appendices attached
7. SI/Imperial units used consistently

Technical Accuracy:
8. Design parameters traceable and justified
9. Calculations verified, software tools stated
10. Safety margins shown
11. Compliance with latest project specs
12. Cross-discipline references validated (PFDs, HMB, P&ID)

Format and Referencing:
13. Consistent format across all pages
14. Cross-referencing to sections/tables/figures correct
15. Valid external standards and URL references

QA/QC & Approval Trail:
16. Prepared, checked, approved by with dates
17. Revision description & change log
18. Document control number
19. Client comments incorporated
20. Confidentiality/Disclaimer clause

Discipline-Specific Checks:
21. Process: Mass balance, relief load, line list, control logic
22. Piping: Line class, stress lines, branch table, supports
23. Pipeline: Wall thickness, crossings, valve stations
24. Civil/Structural: UDLs, rebar schedule, load transfer
25. Mechanical: Design pressures, metallurgy, codes
26. Electrical: Load lists, SLDs, voltage drop, earthing
27. Instrumentation: Loop diagram, JB schedule, setpoints
28. HVAC: Heat load, duct routing, damper locations
29. Fire & Safety: NFPA/SIL zones, detectors
30. HSE: Hazardous area, escape paths
31. Project Control: BOQ, delivery schedule, VDR

Special Deliverables:
32. Material Requisitions: Clause-wise compliance
33. Calculations: Inputs, formulas, versioning
34. Philosophy Docs: Emergency logic, operation
35. Loop Diagrams: Termination integrity
36. BOQ: Unit validation, alignment with drawings`;
}

function getGeneralChecks() {
  return `✅ C. General Checks (Documents & Drawings):
• Aesthetic Checks: Title block, header, footer, font, layout
• Logical Checks: TOC/sheet list, sequence, notes, terminology
• Technical Checks: Specs, logic, assumptions, materials
• Completeness: All required sections, cross-discipline references`;
}

function getSourceBasis() {
  return `✅ D. Source Basis
Each observation to be supported by:
• 📎 Input Document (spec, vendor data, PEFS, etc.)
• 💊 Good Engineering Practice
• 🔧 Engineering Logic
• ❓ Not Available (missing or to be confirmed)`;
}

function getOutputFormat() {
  return `✅ E. Output Format
Each QA/QC observation to be compiled in a table format:

| Check Point | Status (OK / Partial / Not OK) | Remarks | Score (1 / 0.5 / 0) | Source Basis |`;
}

function getFinalRecommendation() {
  return `📉 F. Final Recommendation (Based on Document Status):
• IFR (Issued for Review) → 🔁 Recommend revision before client issue
• IFA (Issued for Approval) → ✅ Acceptable with minor comments OR 🔁 Needs revision
• IFC (Issued for Construction) → ✅ Approved OR ❌ Major rework required
• As-Built → ✅ Conforms to site data OR 🔁 Field verification needed`;
}

function getFinalEvaluation() {
  return `📊 G. Final Evaluation Summary:
• Total Score & Percentage
• Missing Inputs or Source Docs
• Suggestions for Improvement
• Final QC Verdict with Status Tag (e.g., "Acceptable for IFA with Minor Comments")`;
}

function getScoringCategories() {
  return `📈 QA/QC Score Categories:

Option-1 based on number of documents:
| Score (%) | Category | Action |
|-----------|----------|--------|
| 95–100% | ✅ Approved – Excellent | No or minor comments |
| 80–94% | ✅ Approved with Minor Comments | Acceptable, no re-issue needed |
| 70–79% | 🔁 Needs Revision | Rework and re-review required |
| <69% | ❌ Rejected | Major issues, rework essential |

Option-2 based on risk-weighted scoring:
Provide scoring with risk-weighted scoring, where each QA/QC point is assigned a risk level (High/Medium/Low) based on impact (safety, cost, schedule).

Example: A missing SIL classification = High Risk (weight = 3), while font inconsistency = Low Risk (weight = 0.5).`;
}

