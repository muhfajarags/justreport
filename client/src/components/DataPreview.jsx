import useFileStore from '../store/fileStore';

export default function DataPreview() {
  const { filename, format, rows, columns, columnNames, preview } = useFileStore();

  if (!filename) return null;

  return (
    <div className="section fade-in">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900">{filename}</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              {format?.toUpperCase()} &middot; {rows.toLocaleString()} rows &middot; {columns} columns
            </p>
          </div>
        </div>
        <span className="badge-success">
          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
          Ready
        </span>
      </div>

      <div className="overflow-x-auto max-h-64 rounded-xl border border-gray-100 custom-scrollbar">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50/80">
              {columnNames.map((col) => (
                <th key={col} className="px-4 py-2.5 text-left text-[11px] font-bold text-gray-500 uppercase tracking-wider whitespace-nowrap border-b border-gray-100">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {preview.map((row, i) => (
              <tr key={i} className="hover:bg-violet-50/30 transition-colors">
                {columnNames.map((col) => (
                  <td key={col} className="px-4 py-2 text-gray-700 whitespace-nowrap text-xs">
                    {row[col] || <span className="text-gray-300">-</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows > preview.length && (
        <div className="mt-2 text-[11px] text-gray-400 text-center">
          Showing {preview.length} of {rows.toLocaleString()} rows
        </div>
      )}
    </div>
  );
}
