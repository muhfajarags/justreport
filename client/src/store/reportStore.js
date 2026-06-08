import { create } from 'zustand';

const useReportStore = create((set) => ({
  reports: [],
  total: 0,
  page: 1,
  limit: 20,
  sort: 'date',
  order: 'desc',
  search: '',
  loading: false,
  error: null,

  setReports: (data) => set({
    reports: data.data || [],
    total: data.total || 0,
    page: data.page || 1,
    limit: data.limit || 20,
    loading: false,
    error: null
  }),

  setSort: (sort) => set({ sort }),

  setOrder: (order) => set({ order }),

  setSearch: (search) => set({ search }),

  setPage: (page) => set({ page }),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),

  removeReport: (id) => set((state) => ({
    reports: state.reports.filter(r => r.id !== id),
    total: state.total - 1
  }))
}));

export default useReportStore;
