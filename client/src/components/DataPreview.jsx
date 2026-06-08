import useFileStore from '../store/fileStore';

export default function DataPreview() {
  const { filename, format, rows, columns, columnNames, preview } = useFileStore();

  if (!filename) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{filename}</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {format?.toUpperCase()} · {rows.toLocaleString()} rows · {columns} columns
            </p>
          </div>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
            Ready
          </span>
        </div>
      </div>

      <div className="overflow-x-auto max-h-64">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {columnNames.map((col) => (
                <th key={col} className="px-3 py-2 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {preview.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50/50">
                {columnNames.map((col) => (
                  <td key={col} className="px-3 py-1.5 text-gray-700 whitespace-nowrap text-xs">
                    {row[col] || '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {rows > preview.length && (
        <div className="px-4 py-2 text-xs text-gray-400 border-t border-gray-100">
          Showing first {preview.length} of {rows.toLocaleString()} rows
        </div>
      )}
    </div>
  );
}
