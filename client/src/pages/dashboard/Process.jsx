import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import Skeleton from '@/components/ui/Skeleton';

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

export default function Process() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-blue-800 dark:text-blue-400 mb-6">Checklist Process</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 20 }).map((_, index) => (
              <div
                key={index}
                className="flex flex-col space-y-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow border dark:border-gray-700"
              >
                <Skeleton height="h-4" width="w-3/4" rounded="rounded-md" />
                <Skeleton height="h-3" width="w-1/2" rounded="rounded" />
                <Skeleton height="h-3" width="w-1/3" rounded="rounded" />
              </div>
            ))
          : dummyChecklistTitles.map((title, index) => (
              <Link
                to={`/dashboard/process/${index}`} // ✅ Corrected
                key={index}
                className="flex bg-white dark:bg-gray-800 rounded-xl shadow border dark:border-gray-700 hover:shadow-md transition"
              >
                <div className="p-4 flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <FileText className="text-blue-600 dark:text-blue-400" />
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                      {title}
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Click to open</p>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
