import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

const dummyChecklistTitles = [
  "PROCESS OVERALL CHECKLIST",
  "PROCESS FEED PACKAGE CHECKLIST",
  "PROCESS FLOW DIAGRAM CHECKLIST",
  "CHECKLIST FOR PROCESS CONTROL",
  "PROCESS GENERAL PDS CHECKLIST",
  "CHECKLIST FOR HAZOP",
  "PROCESS P&ID REVISION",
  "PROCESS DESIGN SAFETY CHECKLIST",
  "PROCESS CHECKLIST VERIFICATION",
  "GENERIC VESSEL PDS CHECKLIST",
  "COMPRESSOR PDS CHECKLIST",
  "PUMP PDS CHECKLIST",
  "VESSEL PDS CHECKLIST",
  "COLUMN PDS CHECKLIST",
  "STILL COLUMN REFUX PDS",
  "FILTER PDS CHECKLIST",
  "AIR COOLED EXCHANGER PDS",
  "S&T HEAT EXCHANGER PDS",
  "FLOW INSTRUMENT IPDS",
  "LEVEL IPDS CHECKLIST",
  "VALVE IPDS CHECKLIST",
  "ANALYSER IPDS CHECKLIST",
  "PRESSURE IPDS CHECKLIST",
  "RELIEF VALVE IPDS",
  "TEMPERATURE INSTRUMENT IPDS"
];

export default function ChecklistDetail() {
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [progress, setProgress] = useState(0);
  const [score, setScore] = useState(null);
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    const checklist = dummyChecklistTitles[id];
    setTitle(checklist);
  }, [id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setScore(null);
    setShowPreview(false);
  };

  const handleAnalyze = () => {
    if (!file) return alert('Please upload a document first!');
    const simulatedScore = Math.floor(Math.random() * 51) + 50; // 50–100
    const passed = Math.floor((simulatedScore / 100) * 20);
    const failed = 20 - passed;

    setProgress(simulatedScore);
    setScore(simulatedScore);
    setResult({ passed, failed });
  };

  const getScoreColor = () => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 75) return 'bg-yellow-500';
    if (score >= 50) return 'bg-orange-500';
    return 'bg-red-600';
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md max-w-5xl mx-auto">
      {/* Title */}
      <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-400 mb-2">{title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Upload your document to run AI-powered QC analysis.</p>

      {/* Upload + Analyze */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="w-full sm:w-auto text-sm text-gray-700 dark:text-gray-300"
        />
        <button
          onClick={handleAnalyze}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded"
        >
          Analyze Document
        </button>
      </div>

      {/* QC Score + Results */}
      {score !== null && (
        <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            QC Score: <span className="text-blue-600 dark:text-blue-400">{score}%</span>
          </h2>

          {/* Progress bar */}
          <div className="w-full bg-gray-300 dark:bg-gray-700 h-4 rounded mb-2">
            <div className={`h-4 ${getScoreColor()} rounded`} style={{ width: `${progress}%` }} />
          </div>

          {/* Pass/fail stats */}
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
            Checklist Passed: <span className="text-green-500 font-semibold">{result.passed}</span> / 20 &nbsp; | &nbsp;
            Failed: <span className="text-red-500 font-semibold">{result.failed}</span> / 20
          </p>

          {/* Buttons */}
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm rounded"
            >
              {showPreview ? 'Hide' : 'View'} Detailed Report
            </button>

            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded">
              Download QC Report
            </button>
          </div>
        </div>
      )}

      {/* Embedded Report Viewer */}
      {showPreview && (
        <div className="mt-6 border rounded overflow-hidden shadow-lg h-[500px]">
          <iframe
            src="https://docs.google.com/document/d/1TbsvCR1X4myPd1fZl7frH8Y-6vXoh3a02I4xIQEA3Ds/edit?tab=t.0" // ⚠️ Replace with real file path later
            title="QC Detailed Report"
            className="w-full h-full"
          />
        </div>
      )}

      {/* Back Link */}
      <div className="mt-10">
        <Link to="/dashboard/process" className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
          ← Back to all checklists
        </Link>
      </div>
    </div>
  );
}
