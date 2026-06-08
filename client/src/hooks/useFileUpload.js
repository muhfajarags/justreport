import { useState, useCallback } from 'react';
import client from '../api/client';
import useFileStore from '../store/fileStore';

export function useFileUpload() {
  const { setFile, setPreviewData, setUploading, setError } = useFileStore();
  const [progress, setProgress] = useState(0);

  const uploadFile = useCallback(async (file) => {
    if (!file) {
      setError('No file selected');
      return null;
    }

    setFile(file);
    setUploading(true);
    setProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await client.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded * 100) / event.total));
          }
        }
      });

      setPreviewData(response.data.data);
      setProgress(100);
      return response.data.data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  }, [setFile, setPreviewData, setUploading, setError]);

  return { uploadFile, progress };
}
