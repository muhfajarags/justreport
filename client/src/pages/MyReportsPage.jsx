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
      // silently fail
    }
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">My <span className="gradient-text">Reports</span></h1>
        <p className="text-sm text-gray-400 mt-1">{total} report{total !== 1 ? 's' : ''} generated</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xs">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search reports..."
              className="input pl-10"
            />
          </div>
        </form>

        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="input w-auto"
        >
          <option value="date">Sort: Date</option>
          <option value="name">Sort: Name</option>
          <option value="size">Sort: Size</option>
        </select>

        <button
          onClick={() => { setOrder(order === 'asc' ? 'desc' : 'asc'); setPage(1); }}
          className="btn-ghost"
        >
          {order === 'desc' ? (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          )}
          {order === 'desc' ? 'Newest' : 'Oldest'}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 glass-card animate-pulse" />
          ))}
        </div>
      ) : reports.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="btn-ghost text-xs"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Prev
              </button>
              <span className="text-xs text-gray-400 font-medium px-2">
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="btn-ghost text-xs"
              >
                Next
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-24">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-sm font-semibold text-gray-400 mb-1">No reports yet</h3>
          <p className="text-xs text-gray-300">Generate your first PDF from the Generator page</p>
        </div>
      )}

      {/* PDF Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 fade-in" onClick={() => { window.URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }}>
          <div className="bg-white rounded-2xl w-full max-w-4xl h-[85vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                  <svg className="w-4 h-4 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-900">PDF Preview</h3>
              </div>
              <button
                onClick={() => { window.URL.revokeObjectURL(previewUrl); setPreviewUrl(null); }}
                className="btn-ghost text-xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Close
              </button>
            </div>
            <iframe src={previewUrl} className="flex-1 w-full border-0 rounded-b-2xl" title="PDF Preview" />
          </div>
        </div>
      )}
    </div>
  );
}
