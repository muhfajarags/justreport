import { useState, useEffect, useCallback } from 'react';
import ReportCard from '../components/ReportCard';
import { useReports } from '../hooks/useReports';
import useReportStore from '../store/reportStore';

export default function MyReportsPage() {
  const { fetchReports, downloadReport, deleteReport } = useReports();
  const { reports, total, loading, sort, order, search, page, limit, setSort, setOrder, setSearch, setPage } = useReportStore();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    fetchReports();
  }, [fetchReports, sort, order, page, search]);

  const handleDownload = useCallback(async (id, name) => {
    await downloadReport(id, name);
  }, [downloadReport]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Are you sure you want to delete this report?')) {
      await deleteReport(id);
      fetchReports();
    }
  }, [deleteReport, fetchReports]);

  const handlePreview = useCallback(async (id) => {
    try {
      const { default: client } = await import('../api/client');
      const response = await client.get(`/reports/${id}/download`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setPreviewUrl(url);
    } catch (err) {
      // silently fail, show nothing
    }
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold text-gray-900">My Reports</h1>
          <p className="text-sm text-gray-500 mt-1">{total} report{total !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search reports..."
            className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </form>

        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="date">Sort: Date</option>
          <option value="name">Sort: Name</option>
          <option value="size">Sort: Size</option>
        </select>

        <button
          onClick={() => { setOrder(order === 'asc' ? 'desc' : 'asc'); setPage(1); }}
          className="text-sm px-3 py-2 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 text-gray-600 transition-colors"
        >
          {order === 'desc' ? '↓ Desc' : '↑ Asc'}
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-36 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : reports.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {reports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onDownload={handleDownload}
                onDelete={handleDelete}
                onPreview={handlePreview}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Prev
              </button>
              <span className="text-sm text-gray-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No reports yet. Generate your first PDF from the Generator page.</p>
        </div>
      )}

      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => { window.URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }}>
          <div className="bg-white rounded-xl w-full max-w-3xl h-[80vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900">PDF Preview</h3>
              <button
                onClick={() => { window.URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }}
                className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
            <iframe src={previewUrl} className="flex-1 w-full border-0" title="PDF Preview" />
          </div>
        </div>
      )}
    </div>
  );
}
