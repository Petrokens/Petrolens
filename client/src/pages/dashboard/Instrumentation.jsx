import { useEffect, useState } from 'react';
import { FileText, Eye, Download, UploadCloud } from 'lucide-react';

const instrumentationChecklistTitles = [
  "CHECKLIST FOR INSTRUMENT INDEX",
  "CHECKLIST FOR INSTRUMENT SPECIFICATION",
  "CHECKLIST FOR CONTROL SYSTEM ARCHITECTURE",
  "INSTRUMENTATION CABLE SCHEDULE",
  "CHECKLIST FOR INTERLOCK MATRIX",
  "CHECKLIST FOR FUNCTIONAL SPECIFICATIONS",
  "CHECKLIST FOR INSTRUMENT LOCATION PLAN",
  "CHECKLIST FOR OVERALL LOOP SCHEMATIC",
  "CHECKLIST FOR CABLE BLOCK DIAGRAM",
  "CHECKLIST FOR INPUT/OUTPUT LIST",
  "CHECKLIST FOR GRAPHIC PHILOSOPHY",
  "CHECKLIST FOR CONTROL SYSTEM PHILOSOPHY",
  "CHECKLIST FOR CABLE TRAY LAYOUT",
  "CHECKLIST FOR LOOP DRAWINGS",
  "CHECKLIST FOR ALARM MANAGEMENT",
  "CHECKLIST FOR INSTRUMENT SPEC. SHEETS",
  "CHECKLIST FOR JB SCHEDULE",
  "CHECKLIST FOR JUNCTION BOX WIRING",
  "CHECKLIST FOR POWER SUPPLY PHILOSOPHY",
  "CHECKLIST FOR EARTHING PHILOSOPHY",
  "CHECKLIST FOR INSTRUMENT DATASHEETS",
  "CHECKLIST FOR CAUSE & EFFECT MATRIX",
  "CHECKLIST FOR 3D MODEL REVIEW"
];

export default function Instrumentation() {
  const [loading, setLoading] = useState(true);
  const [checklists, setChecklists] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      const enriched = instrumentationChecklistTitles.map(title => ({
        title,
        progress: Math.floor(Math.random() * 100) + 1,
      }));
      setChecklists(enriched);
      setLoading(false);
    }, 1500);
  }, []);

  const handleView = (title) => alert(`🔍 View: ${title}`);
  const handleDownload = (title) => alert(`⬇️ Download: ${title}`);

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return alert("Please select a file first.");
    alert(`📤 Uploading: ${file.name}`);
    // Upload logic here...
  };

  const renderCard = (item, index) => (
    <div
      key={index}
      className="flex bg-white dark:bg-gray-800 rounded-lg shadow border dark:border-gray-700 hover:shadow-md transition"
    >
      {/* Progress bar */}
      <div className="relative w-2 bg-gray-200 dark:bg-gray-700 rounded-l">
        <div
          className="absolute bottom-0 left-0 w-full bg-blue-600 dark:bg-blue-400 rounded-l"
          style={{ height: `${item.progress}%` }}
          title={`${item.progress}%`}
        ></div>
      </div>

      {/* Card content */}
      <div className="flex flex-col justify-between p-4 flex-1">
        {loading ? (
          <>
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse" />
              <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
            </div>

            <div className="flex justify-between items-center mt-2">
              <div className="h-3 w-1/3 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
              <div className="flex space-x-2">
                <div className="h-6 w-14 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
                <div className="h-6 w-20 bg-gray-200 dark:bg-gray-600 rounded animate-pulse" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-3 mb-3">
              <FileText className="text-blue-600 dark:text-blue-400" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{item.title}</h3>
            </div>

            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">{item.progress}% Complete</span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleView(item.title)}
                  className="text-xs flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View
                </button>
                <button
                  onClick={() => handleDownload(item.title)}
                  className="text-xs flex items-center px-2 py-1 bg-blue-100 dark:bg-blue-700 text-blue-700 dark:text-white rounded hover:bg-blue-200 dark:hover:bg-blue-600"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Download
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return (
    <div className="p-4">
      {/* Header with Upload */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-400">Instrumentation</h1>

        <div className="flex items-center gap-2">
          {file && (
            <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[150px]">
              📄 {file.name}
            </span>
          )}
          <button
            onClick={handleUpload}
            className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm"
          >
            <UploadCloud className="w-4 h-4 mr-1" />
            Upload
          </button>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="mb-6 border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-md p-4 text-center text-gray-600 dark:text-gray-300"
      >
        <input type="file" id="uploadInput" hidden onChange={handleFileSelect} />
        <label htmlFor="uploadInput" className="cursor-pointer">
          Drag and drop a file here or <span className="text-blue-600 dark:text-blue-400 underline">click to browse</span>
        </label>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {(loading ? instrumentationChecklistTitles : checklists).map((item, index) =>
          renderCard(item, index)
        )}
      </div>
    </div>
  );
}
