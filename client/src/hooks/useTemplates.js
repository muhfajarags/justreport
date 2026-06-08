import { useCallback } from 'react';
import client from '../api/client';
import useTemplateStore from '../store/templateStore';

export function useTemplates() {
  const fetchTemplates = useCallback(async () => {
    useTemplateStore.getState().setLoading(true);
    try {
      const response = await client.get('/templates');
      useTemplateStore.getState().setTemplates(response.data);
      return response.data;
    } catch (err) {
      useTemplateStore.getState().setError(err.message);
      return null;
    }
  }, []);

  const fetchTemplate = useCallback(async (id) => {
    try {
      const response = await client.get(`/templates/${id}`);
      useTemplateStore.getState().setSelectedTemplate(response.data.template);
      return response.data.template;
    } catch (err) {
      useTemplateStore.getState().setError(err.message);
      return null;
    }
  }, []);

  const uploadTemplate = useCallback(async (file, name) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (name) formData.append('name', name);
      const response = await client.post('/templates', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      useTemplateStore.getState().addCustomTemplate(response.data.template);
      return response.data.template;
    } catch (err) {
      useTemplateStore.getState().setError(err.message);
      return null;
    }
  }, []);

  const deleteTemplate = useCallback(async (id) => {
    try {
      await client.delete(`/templates/${id}`);
      useTemplateStore.getState().removeCustomTemplate(id);
      return true;
    } catch (err) {
      useTemplateStore.getState().setError(err.message);
      return false;
    }
  }, []);

  return { fetchTemplates, fetchTemplate, uploadTemplate, deleteTemplate };
}
