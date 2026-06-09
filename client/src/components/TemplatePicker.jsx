import useTemplateStore from '../store/templateStore';

export default function TemplatePicker() {
  const { defaultTemplates, customTemplates, selectedTemplate, setSelectedTemplate, loading } = useTemplateStore();

  const allTemplates = [...defaultTemplates, ...customTemplates];

  if (loading) {
    return (
      <div className="section">
        <div className="section-title mb-4">
          <svg className="w-4 h-4 text-violet-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
          </svg>
          Loading Templates...
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-100/80 rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="section slide-up">
      <div className="flex items-center justify-between mb-4">
        <div className="section-title">
          <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z" />
          </svg>
          Choose Template
        </div>
        <span className="text-xs text-gray-400 font-medium">{allTemplates.length} available</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
        {allTemplates.map((tpl) => {
          const isSelected = selectedTemplate?.id === tpl.id;
          const isDefault = tpl.is_default;
          return (
            <button
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl)}
              className={`text-left p-3.5 rounded-xl border-2 transition-all duration-200 group
                ${isSelected
                  ? 'border-violet-400 bg-violet-50/50 shadow-lg shadow-violet-500/10 scale-[1.02]'
                  : 'border-gray-100 hover:border-violet-200 hover:bg-violet-50/20 bg-white/50'}`}
            >
              <div className="flex items-start justify-between mb-2">
                <span className={`text-sm font-semibold truncate transition-colors ${isSelected ? 'text-violet-700' : 'text-gray-800 group-hover:text-gray-900'}`}>
                  {tpl.name}
                </span>
                {isDefault && <span className="badge-default shrink-0 ml-1">Built-in</span>}
              </div>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full transition-colors ${isSelected ? 'bg-violet-500' : 'bg-gray-300'}`} />
                <span className={`text-[11px] font-medium transition-colors ${isSelected ? 'text-violet-500' : 'text-gray-400'}`}>
                  {isSelected ? 'Active' : 'Select'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {allTemplates.length === 0 && (
        <div className="text-center py-12">
          <svg className="w-10 h-10 mx-auto text-gray-200 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p className="text-sm text-gray-400">No templates available</p>
        </div>
      )}
    </div>
  );
}
