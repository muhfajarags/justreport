export default function TemplateCard({ template, onDelete }) {
  const isDefault = template.is_default;
  const date = template.created_at ? new Date(template.created_at).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'short', day: 'numeric'
  }) : 'Unknown';

  return (
    <div className={`bg-white rounded-xl border p-4 transition-shadow hover:shadow-sm ${isDefault ? 'border-gray-200 bg-gray-50/50' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="text-sm font-semibold text-gray-900 truncate">{template.name}</h3>
            {isDefault && (
              <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-600">
                Default
              </span>
            )}
          </div>
          <p className="text-xs text-gray-400 mt-1">{date}</p>
        </div>
      </div>

      {!isDefault && (
        <div className="flex items-center mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => onDelete(template.id)}
            className="text-xs px-2.5 py-1 rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition-colors ml-auto"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
