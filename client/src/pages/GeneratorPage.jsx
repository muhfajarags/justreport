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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-gray-900">Report Generator</h1>
        <p className="text-sm text-gray-500 mt-1">Upload data, pick a template, generate PDF</p>
      </div>

      <div className="space-y-4">
        <FileUpload onUpload={handleUpload} />
        <DataPreview />

        {filename && <TemplatePicker />}

        {filename && selectedTemplate && (
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Report Name</label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="Enter report name..."
                className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>

            <LivePreview html={previewHtml} loading={previewLoading} />

            <button
              onClick={handleGenerate}
              disabled={generating || !reportName.trim()}
              className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {generating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Generating PDF...</span>
                </>
              ) : (
                <span>Generate PDF</span>
              )}
            </button>
          </div>
        )}
      </div>

      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-xl text-sm font-medium shadow-lg z-50 transition-all
          ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
