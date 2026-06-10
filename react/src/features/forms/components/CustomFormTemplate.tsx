/**
 * Custom Form Template for Data Driven Forms
 * 
 * Wraps the Carbon FormTemplate to provide custom control over
 * form controls rendering based on showFormControls and readOnly props.
 */

import React, { ReactNode } from 'react';
import { Button } from '@carbon/react';

export interface CustomFormTemplateProps {
  formFields: ReactNode[];
  showFormControls?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  readOnly?: boolean;
  handleSubmit?: (event: React.FormEvent) => void;
  onCancel?: () => void;
}

/**
 * Custom Form Template Component
 * 
 * Provides control over form button rendering while maintaining
 * compatibility with Data Driven Forms.
 */
export const CustomFormTemplate: React.FC<CustomFormTemplateProps> = ({
  formFields,
  showFormControls = true,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  readOnly = false,
  handleSubmit,
  onCancel,
}) => {
  return (
    <form onSubmit={handleSubmit}>
      {formFields}
      {showFormControls && !readOnly && (
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
          <Button type="submit" kind="primary">
            {submitLabel}
          </Button>
          {onCancel && (
            <Button type="button" kind="secondary" onClick={onCancel}>
              {cancelLabel}
            </Button>
          )}
        </div>
      )}
    </form>
  );
};

export default CustomFormTemplate;