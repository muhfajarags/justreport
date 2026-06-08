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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900">My Templates</h1>
          <p className="text-sm text-gray-500 mt-1">
            {defaultTemplates.length + customTemplates.length} template{defaultTemplates.length + customTemplates.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <label className="text-xs px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition-colors">
            Upload HTML
            <input type="file" accept=".html,.htm" className="hidden" onChange={handleFileUpload} />
          </label>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {defaultTemplates.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Default Templates</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {defaultTemplates.map((tpl) => (
                  <TemplateCard key={tpl.id} template={tpl} />
                ))}
              </div>
            </div>
          )}

          {customTemplates.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Custom Templates</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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

          {defaultTemplates.length === 0 && customTemplates.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-400 text-sm">No templates available.</p>
            </div>
          )}
        </>
      )}

      {toast && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-xl text-sm font-medium shadow-lg z-[60] transition-all
          ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
