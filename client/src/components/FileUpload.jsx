import { useState, useRef, useCallback } from 'react';
import useFileStore from '../store/fileStore';

export default function FileUpload({ onUpload }) {
  const { uploading, error } = useFileStore();
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) onUpload(file);
  }, [onUpload]);

  const handleChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) onUpload(file);
  }, [onUpload]);

  return (
    <div className="section">
      <div className="section-title mb-4">
        <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
        Upload Data
      </div>

      <div
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer group
          ${dragOver
            ? 'border-violet-400 bg-violet-50/50 scale-[1.01]'
            : 'border-gray-200 hover:border-violet-300 hover:bg-violet-50/20'}
          ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".json,.csv,.tsv,.xlsx,.xls,.txt"
          onChange={handleChange}
        />

        {uploading ? (
          <div className="space-y-4">
            <div className="relative w-12 h-12 mx-auto">
              <div className="absolute inset-0 rounded-full border-2 border-violet-200"></div>
              <div className="absolute inset-0 rounded-full border-2 border-violet-500 border-t-transparent animate-spin"></div>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">Parsing your data...</p>
              <p className="text-xs text-gray-400 mt-1">This won't take long</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center transition-all duration-300
              ${dragOver ? 'bg-violet-100 scale-110' : 'bg-gradient-to-br from-violet-50 to-indigo-50 group-hover:scale-105'}`}>
              <svg className={`w-7 h-7 transition-colors ${dragOver ? 'text-violet-600' : 'text-violet-400 group-hover:text-violet-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {dragOver ? 'Drop your file here' : <>Drag & drop or <span className="text-violet-600">browse</span></>}
              </p>
              <p className="text-xs text-gray-400 mt-1">Supports JSON, CSV, TSV, XLSX, XLS</p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-600 bg-red-50 px-4 py-3 rounded-xl border border-red-100 fade-in">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
