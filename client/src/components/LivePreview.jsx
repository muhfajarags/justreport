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
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700">Live Preview</p>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-96 bg-gray-50">
            <div className="space-y-3 text-center">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-sm text-gray-400">Rendering preview...</p>
            </div>
          </div>
        ) : html ? (
          <iframe
            ref={iframeRef}
            className="w-full h-96 border-0"
            title="Live Preview"
            sandbox="allow-same-origin"
          />
        ) : (
          <div className="flex items-center justify-center h-48 bg-gray-50 text-sm text-gray-400">
            Select a template and upload data to see preview
          </div>
        )}
      </div>
    </div>
  );
}
