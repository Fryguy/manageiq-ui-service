/**
 * FormRenderer component
 * 
 * Integrates Data Driven Forms with Carbon component mapper for
 * rendering schema-driven forms in ManageIQ dialogs and provisioning workflows.
 */

import React, { useCallback, useMemo } from 'react';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentMapper from '@data-driven-forms/carbon-component-mapper/component-mapper';
import type { Schema, ComponentMapper, Field } from '@data-driven-forms/react-form-renderer';
import type { DDFSchema, DialogFormProps, FieldRefreshCallback } from '../types';
import { CustomFormTemplate } from './CustomFormTemplate';

/**
 * Default component mapper with Carbon components
 */
const defaultComponentMapper: ComponentMapper = {
  ...componentMapper,
  // Add custom field components here as needed
};

/**
 * ManageIQ Dialog Form Renderer
 * 
 * Renders schema-driven forms using Data Driven Forms with Carbon components.
 * Supports dynamic field updates, validation, and conditional visibility.
 * 
 * @example
 * ```tsx
 * <DialogFormRenderer
 *   schema={dialogSchema}
 *   initialValues={{ field1: 'value1' }}
 *   onSubmit={handleSubmit}
 *   onCancel={handleCancel}
 * />
 * ```
 */
export const DialogFormRenderer: React.FC<DialogFormProps> = ({
  schema,
  initialValues = {},
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
  readOnly = false,
  showFormControls = true,
}) => {
  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (values: Record<string, unknown>) => {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        throw error;
      }
    },
    [onSubmit]
  );

  /**
   * Handle form cancellation
   */
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  /**
   * Clean schema without custom props that shouldn't be passed to DOM
   */
  const cleanedSchema = useMemo(() => {
    const baseSchema = { ...schema };
    
    // Remove ManageIQ-specific props that shouldn't be passed to DOM elements
    const cleanedFields = baseSchema.fields.map((field) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { dynamic, autoRefresh, triggerAutoRefresh, loadValuesOnInit, resourceAction, dialogFieldId, ...cleanField } = field as Record<string, unknown>;
      return cleanField as Field;
    });

    return {
      ...baseSchema,
      fields: cleanedFields,
    } as Schema;
  }, [schema]);

  return (
    <FormRenderer
      schema={cleanedSchema}
      componentMapper={defaultComponentMapper}
      FormTemplate={(props) => (
        <CustomFormTemplate
          {...props}
          showFormControls={showFormControls}
          submitLabel={submitLabel}
          cancelLabel={cancelLabel}
          readOnly={readOnly}
          onCancel={showFormControls && !readOnly && onCancel ? handleCancel : undefined}
        />
      )}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      subscription={{ values: true, errors: true, dirty: true }}
    />
  );
};

/**
 * Props for the ManageIQFormRenderer component
 */
export interface ManageIQFormRendererProps {
  schema: DDFSchema;
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  onCancel?: () => void;
  onFieldRefresh?: FieldRefreshCallback;
  customComponentMapper?: Partial<ComponentMapper>;
  readOnly?: boolean;
  showFormControls?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
}

/**
 * ManageIQ Form Renderer with field refresh support
 * 
 * Extended form renderer that supports dynamic field updates and
 * ManageIQ-specific field behaviors like auto-refresh and dependencies.
 * 
 * @example
 * ```tsx
 * <ManageIQFormRenderer
 *   schema={dialogSchema}
 *   initialValues={initialValues}
 *   onSubmit={handleSubmit}
 *   onFieldRefresh={handleFieldRefresh}
 * />
 * ```
 */
export const ManageIQFormRenderer: React.FC<ManageIQFormRendererProps> = ({
  schema,
  initialValues = {},
  onSubmit,
  onCancel,
  onFieldRefresh: _onFieldRefresh,
  customComponentMapper = {},
  readOnly = false,
  showFormControls = true,
  submitLabel = 'Submit',
  cancelLabel = 'Cancel',
}) => {
  /**
   * Merged component mapper with custom components
   */
  const mergedComponentMapper = useMemo(
    () => ({
      ...defaultComponentMapper,
      ...customComponentMapper,
    }),
    [customComponentMapper]
  ) as ComponentMapper;

  /**
   * Handle form submission
   */
  const handleSubmit = useCallback(
    async (values: Record<string, unknown>) => {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
        throw error;
      }
    },
    [onSubmit]
  );

  /**
   * Handle form cancellation
   */
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  /**
   * Clean schema without custom props that shouldn't be passed to DOM
   */
  const cleanedSchema = useMemo(() => {
    const baseSchema = { ...schema };
    
    // Remove ManageIQ-specific props that shouldn't be passed to DOM elements
    const cleanedFields = baseSchema.fields.map((field) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { dynamic, autoRefresh, triggerAutoRefresh, loadValuesOnInit, resourceAction, dialogFieldId, ...cleanField } = field as Record<string, unknown>;
      return cleanField as Field;
    });

    return {
      ...baseSchema,
      fields: cleanedFields,
    } as Schema;
  }, [schema]);

  return (
    <FormRenderer
      schema={cleanedSchema}
      componentMapper={mergedComponentMapper}
      FormTemplate={(props) => (
        <CustomFormTemplate
          {...props}
          showFormControls={showFormControls}
          submitLabel={submitLabel}
          cancelLabel={cancelLabel}
          readOnly={readOnly}
          onCancel={showFormControls && !readOnly && onCancel ? handleCancel : undefined}
        />
      )}
      onSubmit={handleSubmit}
      initialValues={initialValues}
      subscription={{ values: true, errors: true, dirty: true, touched: true }}
    />
  );
};

/**
 * Default export
 */
export default DialogFormRenderer;
