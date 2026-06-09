import { useState, useCallback, useEffect } from 'react';
import FileUpload from '../components/FileUpload';
import DataPreview from '../components/DataPreview';
import TemplatePicker from '../components/TemplatePicker';
import LivePreview from '../components/LivePreview';
import { useFileUpload } from '../hooks/useFileUpload';
import { useTemplates } from '../hooks/useTemplates';
import useFileStore from '../store/fileStore';
import useTemplateStore from '../store/templateStore';
import client from '../api/client';

export default function GeneratorPage() {
  const { uploadFile } = useFileUpload();
  const { fetchTemplates } = useTemplates();
  const { filename, rows } = useFileStore();
  const { selectedTemplate } = useTemplateStore();
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [reportName, setReportName] = useState('');
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleUpload = useCallback(async (file) => {
    setPreviewHtml('');
    setReportName(file.name.replace(/\.[^.]+$/, ''));
    await uploadFile(file);
  }, [uploadFile]);

  const handlePreview = useCallback(async () => {
    if (!selectedTemplate || !rows) return;
    setPreviewLoading(true);
    try {
      const response = await client.post('/preview', {
        template_id: selectedTemplate.id,
        data: useFileStore.getState().allData
      });
      setPreviewHtml(response.data.html);
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setPreviewLoading(false);
    }
  }, [selectedTemplate, rows]);

  useEffect(() => {
    if (selectedTemplate && filename) {
      const timer = setTimeout(handlePreview, 400);
      return () => clearTimeout(timer);
    }
  }, [selectedTemplate, filename, handlePreview]);

  const handleGenerate = async () => {
    if (!selectedTemplate) {
      showToast('Please select a template', 'error');
      return;
    }
    if (!filename) {
      showToast('Please upload a file first', 'error');
      return;
    }
    if (!reportName.trim()) {
      showToast('Please enter a report name', 'error');
      return;
    }

    setGenerating(true);
    try {
      const response = await client.post('/generate', {
        report_name: reportName,
        template_id: selectedTemplate.id,
        data: useFileStore.getState().allData,
        save_template: true
      }, { responseType: 'blob' });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${reportName}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      showToast('PDF generated successfully!');
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-50 text-violet-600 text-xs font-semibold mb-3">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          JSON to PDF in seconds
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Report <span className="gradient-text">Generator</span>
        </h1>
        <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
          Upload your data (CSV, JSON, Excel), choose a template, and generate a beautiful PDF report instantly.
        </p>
      </div>

      <div className="space-y-5">
        <FileUpload onUpload={handleUpload} />
        <DataPreview />

        {filename && <TemplatePicker />}

        {filename && selectedTemplate && (
          <div className="space-y-5 slide-up">
            <div className="section">
              <label className="section-title mb-3">
                <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Report Name
              </label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="e.g. Monthly Sales Report Q3 2026"
                className="input"
              />
            </div>

            <LivePreview html={previewHtml} loading={previewLoading} />

            <button
              onClick={handleGenerate}
              disabled={generating || !reportName.trim()}
              className="btn-primary w-full py-3.5 text-base"
            >
              {generating ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Generate PDF</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-2xl text-sm font-semibold shadow-2xl z-50 fade-in flex items-center gap-2.5
          ${toast.type === 'error'
            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white'
            : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'}`}>
          {toast.type === 'error' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
