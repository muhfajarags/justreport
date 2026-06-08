import { create } from 'zustand';

const useFileStore = create((set) => ({
  file: null,
  filename: '',
  format: '',
  preview: [],
  rows: 0,
  columns: 0,
  columnNames: [],
  allData: [],
  uploading: false,
  error: null,

  setFile: (file) => set({ file, filename: file?.name || '', error: null }),

  setPreviewData: (data) => set({
    filename: data.filename || '',
    format: data.format || '',
    preview: data.preview || [],
    rows: data.rows || 0,
    columns: data.columns || 0,
    columnNames: data.columnNames || [],
    allData: data.allData || data.preview || [],
    uploading: false,
    error: null
  }),

  setUploading: (uploading) => set({ uploading, error: null }),

  setError: (error) => set({ error, uploading: false }),

  reset: () => set({
    file: null,
    filename: '',
    format: '',
    preview: [],
    rows: 0,
    columns: 0,
    columnNames: [],
    allData: [],
    uploading: false,
    error: null
  })
}));

export default useFileStore;
