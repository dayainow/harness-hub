import { useState, useEffect, useCallback } from 'react';

/**
 * Hook for managing form state inside a dialog.
 * Manages view/edit/create modes and formData state.
 *
 * @param open - Dialog open state (formData is initialized when the dialog opens)
 * @param initialData - Initial data (used in edit/view mode)
 * @param initialMode - Initial mode (default: 'create')
 * @returns formData, mode, handleChange, handleEdit, setFormData, setMode
 *
 * @example
 * // Usage inside CharacterDialog
 * function CharacterDialog({ open, character }) {
 *   const { formData, handleChange } = useDialogForm(open, character);
 *
 *   return (
 *     <Dialog open={open}>
 *       <BaseVerticalTable data={formData} onChange={handleChange} />
 *     </Dialog>
 *   );
 * }
 */
export function useDialogForm<T extends Record<string, any>>(
  open: boolean,
  initialData?: T | null,
  initialMode: 'view' | 'edit' | 'create' = 'create'
) {
  const [formData, setFormData] = useState<Partial<T>>({});
  const [mode, setMode] = useState<'view' | 'edit' | 'create'>(initialMode);

  // Initialize formData each time the dialog opens
  useEffect(() => {
    if (open) {
      setFormData(initialData || {});
      setMode(initialMode);
    }
  }, [open, initialData, initialMode]);

  const handleChange = useCallback((key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  }, []);

  const handleEdit = useCallback(() => {
    setMode('edit');
  }, []);

  return {
    formData,
    mode,
    handleChange,
    handleEdit,
    setFormData,
    setMode
  };
}