import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TemplatePicker from '../TemplatePicker';

const mockStore = {
  defaultTemplates: [
    { id: 'tpl-1', name: 'Simple Table', is_default: true },
    { id: 'tpl-2', name: 'Summary Card', is_default: true }
  ],
  customTemplates: [
    { id: 'tpl-3', name: 'My Custom', is_default: false }
  ],
  selectedTemplate: null,
  setSelectedTemplate: vi.fn(),
  loading: false
};

vi.mock('../../store/templateStore', () => ({
  default: () => mockStore
}));

describe('TemplatePicker', () => {
  beforeEach(() => {
    mockStore.loading = false;
    mockStore.defaultTemplates = [
      { id: 'tpl-1', name: 'Simple Table', is_default: true },
      { id: 'tpl-2', name: 'Summary Card', is_default: true }
    ];
    mockStore.customTemplates = [
      { id: 'tpl-3', name: 'My Custom', is_default: false }
    ];
  });

  it('should render all templates', () => {
    render(<TemplatePicker />);
    expect(screen.getByText('Simple Table')).toBeDefined();
    expect(screen.getByText('Summary Card')).toBeDefined();
    expect(screen.getByText('My Custom')).toBeDefined();
  });

  it('should show template count', () => {
    render(<TemplatePicker />);
    expect(screen.getByText('3 available')).toBeDefined();
  });

  it('should show Default badge for default templates', () => {
    render(<TemplatePicker />);
    const badges = screen.getAllByText('Default');
    expect(badges).toHaveLength(2);
  });

  it('should call setSelectedTemplate on click', () => {
    render(<TemplatePicker />);
    const button = screen.getByText('Simple Table').closest('button');
    fireEvent.click(button);
    expect(mockStore.setSelectedTemplate).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'tpl-1', name: 'Simple Table' })
    );
  });

  it('should show loading state', () => {
    mockStore.loading = true;
    render(<TemplatePicker />);
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBe(5);
    mockStore.loading = false;
  });

  it('should show empty state when no templates', () => {
    mockStore.defaultTemplates = [];
    mockStore.customTemplates = [];
    render(<TemplatePicker />);
    expect(screen.getByText('No templates available')).toBeDefined();
  });
});
