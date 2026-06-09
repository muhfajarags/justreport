import { useState, useEffect, useCallback } from 'react';
import TemplateCard from '../components/TemplateCard';
import { useTemplates } from '../hooks/useTemplates';
import useTemplateStore from '../store/templateStore';

export default function MyTemplatesPage() {
  const { fetchTemplates, uploadTemplate, deleteTemplate } = useTemplates();
  const { defaultTemplates, customTemplates, loading } = useTemplateStore();
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const showToast = (msg, type = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleDelete = useCallback(async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    const ok = await deleteTemplate(id);
    if (ok) showToast('Template deleted!');
  }, [deleteTemplate]);

  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const result = await uploadTemplate(file, file.name.replace(/\.\w+$/, ''));
    if (result) {
      showToast('Template uploaded!');
    } else {
      showToast('Upload failed', 'error');
    }
    e.target.value = '';
  }, [uploadTemplate]);

  const totalCount = defaultTemplates.length + customTemplates.length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My <span className="gradient-text">Templates</span></h1>
          <p className="text-sm text-gray-400 mt-1">{totalCount} template{totalCount !== 1 ? 's' : ''}</p>
        </div>
        <label className="btn-primary cursor-pointer">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Upload HTML
          <input type="file" accept=".html,.htm" className="hidden" onChange={handleFileUpload} />
        </label>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-32 glass-card animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {defaultTemplates.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Built-in Templates</h2>
                <span className="badge-default">{defaultTemplates.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {defaultTemplates.map((tpl) => (
                  <TemplateCard key={tpl.id} template={tpl} />
                ))}
              </div>
            </div>
          )}

          {customTemplates.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Custom Templates</h2>
                <span className="badge-warning">{customTemplates.length}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {customTemplates.map((tpl) => (
                  <TemplateCard
                    key={tpl.id}
                    template={tpl}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {totalCount === 0 && (
            <div className="text-center py-24">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-400 mb-1">No templates</h3>
              <p className="text-xs text-gray-300">Upload an HTML file to create a custom template</p>
            </div>
          )}
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 px-5 py-3 rounded-2xl text-sm font-semibold shadow-2xl z-[60] fade-in flex items-center gap-2.5
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
