export default function ReportCard({ report, onDownload, onDelete, onPreview }) {
  const date = report.created_at ? new Date(report.created_at).toLocaleDateString('id-ID', {
    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }) : 'Unknown';

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{report.name}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            Source: {report.source_filename} · Template: {report.template_name}
          </p>
          <div className="flex items-center space-x-3 mt-2 text-xs text-gray-400">
            <span>{date}</span>
            <span>{report.file_size_kb ?? '?'} KB</span>
            {report.row_count && <span>{report.row_count} rows</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
        <button
          onClick={() => onPreview(report.id)}
          className="text-xs px-2.5 py-1 rounded-md bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          Preview
        </button>
        <button
          onClick={() => onDownload(report.id, report.name)}
          className="text-xs px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
        >
          Download
        </button>
        <button
          onClick={() => onDelete(report.id)}
          className="text-xs px-2.5 py-1 rounded-md bg-red-50 text-red-500 hover:bg-red-100 transition-colors ml-auto"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
