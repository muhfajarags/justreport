import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FileUpload from '../FileUpload';

describe('FileUpload', () => {
  it('should render the upload area', () => {
    const onUpload = vi.fn();
    render(<FileUpload onUpload={onUpload} />);
    expect(screen.getByText(/drop your file/i)).toBeDefined();
  });

  it('should show supported formats', () => {
    const onUpload = vi.fn();
    render(<FileUpload onUpload={onUpload} />);
    expect(screen.getByText(/csv/i)).toBeDefined();
    expect(screen.getByText(/json/i)).toBeDefined();
    expect(screen.getByText(/xlsx/i)).toBeDefined();
  });

  it('should call onUpload when a file is selected', () => {
    const onUpload = vi.fn();
    render(<FileUpload onUpload={onUpload} />);

    const file = new File(['test data'], 'test.csv', { type: 'text/csv' });
    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [file] } });

    expect(onUpload).toHaveBeenCalledWith(file);
  });

  it('should not call onUpload when no file selected', () => {
    const onUpload = vi.fn();
    render(<FileUpload onUpload={onUpload} />);

    const input = document.querySelector('input[type="file"]');
    fireEvent.change(input, { target: { files: [] } });

    expect(onUpload).not.toHaveBeenCalled();
  });
});
