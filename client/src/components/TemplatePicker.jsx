import useTemplateStore from '../store/templateStore';

export default function TemplatePicker() {
  const { defaultTemplates, customTemplates, selectedTemplate, setSelectedTemplate, loading } = useTemplateStore();

  const allTemplates = [...defaultTemplates, ...customTemplates];

  if (loading) {
    return (
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Templates</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Choose Template</p>
        <span className="text-xs text-gray-400">{allTemplates.length} available</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
        {allTemplates.map((tpl) => {
          const isSelected = selectedTemplate?.id === tpl.id;
          const isDefault = tpl.is_default;
          return (
            <button
              key={tpl.id}
              onClick={() => setSelectedTemplate(tpl)}
              className={`text-left p-3 rounded-lg border-2 transition-all text-sm
                ${isSelected
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-gray-200 hover:border-gray-300 bg-white'}`}
            >
              <div className="flex items-start justify-between mb-1">
                <span className={`font-medium truncate ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                  {tpl.name}
                </span>
                {isDefault && (
                  <span className="shrink-0 ml-1 text-[10px] px-1 py-0.5 rounded bg-gray-100 text-gray-500">
                    Default
                  </span>
                )}
              </div>
              <p className={`text-xs ${isSelected ? 'text-blue-500' : 'text-gray-400'}`}>
                {isSelected ? 'Selected' : 'Click to select'}
              </p>
            </button>
          );
        })}
      </div>

      {allTemplates.length === 0 && (
        <p className="text-sm text-gray-400 text-center py-4">No templates available</p>
      )}
    </div>
  );
}
