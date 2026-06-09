export default function TemplateCard({ template, onDelete }) {
  const isDefault = template.is_default;
  const date = template.created_at ? new Date(template.created_at).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'short', day: 'numeric'
  }) : 'Unknown';

  return (
    <div className={`glass-card p-5 group hover:shadow-xl hover:shadow-violet-500/[0.04] transition-all duration-300 ${isDefault ? 'bg-gradient-to-br from-white to-violet-50/30' : ''}`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0
          ${isDefault ? 'bg-gradient-to-br from-violet-100 to-indigo-100' : 'bg-gradient-to-br from-amber-50 to-orange-50'}`}>
          {isDefault ? (
            <svg className="w-5 h-5 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-gray-900 truncate">{template.name}</h3>
            {isDefault && <span className="badge-default shrink-0">Built-in</span>}
            {!isDefault && <span className="badge-warning shrink-0">Custom</span>}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">{date}</p>
        </div>
      </div>

      {!isDefault && onDelete && (
        <div className="flex items-center mt-4 pt-3 border-t border-gray-100/80">
          <button
            onClick={() => onDelete(template.id)}
            className="btn-danger text-xs ml-auto"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
