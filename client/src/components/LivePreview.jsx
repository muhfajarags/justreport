import { useRef, useEffect } from 'react';

export default function LivePreview({ html, loading }) {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!iframeRef.current || !html) return;
    const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
    doc.open();
    doc.write(html);
    doc.close();
  }, [html]);

  return (
    <div className="section fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="section-title">
          <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Live Preview
        </div>
        {loading && (
          <span className="text-xs text-violet-500 font-medium animate-pulse">Rendering...</span>
        )}
      </div>

      <div className="rounded-xl border border-gray-100 overflow-hidden bg-white">
        {loading ? (
          <div className="flex items-center justify-center h-96 bg-gradient-to-br from-gray-50 to-violet-50/20">
            <div className="space-y-4 text-center">
              <div className="relative w-10 h-10 mx-auto">
                <div className="absolute inset-0 rounded-full border-2 border-violet-200"></div>
                <div className="absolute inset-0 rounded-full border-2 border-violet-500 border-t-transparent animate-spin"></div>
              </div>
              <p className="text-sm text-gray-400">Rendering preview...</p>
            </div>
          </div>
        ) : html ? (
          <iframe
            ref={iframeRef}
            className="w-full h-[500px] border-0"
            title="Live Preview"
            sandbox="allow-same-origin"
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-48 bg-gradient-to-br from-gray-50 to-violet-50/10">
            <svg className="w-8 h-8 text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-sm text-gray-300">Upload data & select a template to preview</p>
          </div>
        )}
      </div>
    </div>
  );
}
