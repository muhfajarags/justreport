import { useCallback } from 'react';
import client from '../api/client';
import useReportStore from '../store/reportStore';

export function useReports() {
  const fetchReports = useCallback(async (params = {}) => {
    const store = useReportStore.getState();
    store.setLoading(true);
    try {
      const queryParams = {
        sort: params.sort || store.sort,
        order: params.order || store.order,
        search: params.search !== undefined ? params.search : store.search,
        page: params.page || store.page,
        limit: params.limit || store.limit
      };
      const response = await client.get('/reports', { params: queryParams });
      store.setReports(response.data);
      return response.data;
    } catch (err) {
      store.setError(err.message);
      return null;
    }
  }, []);

  const downloadReport = useCallback(async (id, name) => {
    try {
      const response = await client.get(`/reports/${id}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${name}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      useReportStore.getState().setError(err.message);
      return false;
    }
  }, []);

  const deleteReport = useCallback(async (id) => {
    try {
      await client.delete(`/reports/${id}`);
      useReportStore.getState().removeReport(id);
      return true;
    } catch (err) {
      useReportStore.getState().setError(err.message);
      return false;
    }
  }, []);

  const previewReport = useCallback(async (id) => {
    try {
      const response = await client.get(`/reports/${id}/download`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      return url;
    } catch (err) {
      useReportStore.getState().setError(err.message);
      return null;
    }
  }, []);

  return { fetchReports, downloadReport, deleteReport, previewReport };
}
