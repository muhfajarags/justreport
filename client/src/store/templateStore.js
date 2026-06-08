import { create } from 'zustand';

const useTemplateStore = create((set) => ({
  templates: [],
  defaultTemplates: [],
  customTemplates: [],
  selectedTemplate: null,
  selectedTemplateHtml: '',
  loading: false,
  error: null,

  setTemplates: (data) => set({
    defaultTemplates: data.defaults || [],
    customTemplates: data.custom || [],
    templates: [...(data.defaults || []), ...(data.custom || [])],
    loading: false,
    error: null
  }),

  setSelectedTemplate: (template) => set({
    selectedTemplate: template,
    selectedTemplateHtml: template?.html_content || ''
  }),

  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error, loading: false }),

  addCustomTemplate: (template) => set((state) => ({
    customTemplates: [...state.customTemplates, template],
    templates: [...state.templates, template]
  })),

  removeCustomTemplate: (id) => set((state) => ({
    customTemplates: state.customTemplates.filter(t => t.id !== id),
    templates: state.templates.filter(t => t.id !== id)
  })),


}));

export default useTemplateStore;
