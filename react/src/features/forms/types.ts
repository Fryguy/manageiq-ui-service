/**
 * Form types for Data Driven Forms integration
 * 
 * These types define the structure for schema-driven forms used in
 * ManageIQ dialogs, provisioning forms, and custom button dialogs.
 */

import type { Field as DDFField, ComponentMapper } from '@data-driven-forms/react-form-renderer';

/**
 * ManageIQ dialog field types
 */
export type DialogFieldType =
  | 'DialogFieldTextBox'
  | 'DialogFieldTextAreaBox'
  | 'DialogFieldCheckBox'
  | 'DialogFieldDropDownList'
  | 'DialogFieldRadioButton'
  | 'DialogFieldDateControl'
  | 'DialogFieldDateTimeControl'
  | 'DialogFieldTagControl'
  | 'DialogFieldButton';

/**
 * ManageIQ dialog field from API
 */
export interface ManageIQDialogField {
  id?: string;
  name: string;
  label: string;
  type: DialogFieldType;
  data_type?: string;
  default_value?: unknown;
  values?: Array<[string, string]> | Record<string, string>;
  required?: boolean;
  read_only?: boolean;
  visible?: boolean;
  validator_type?: string;
  validator_rule?: string;
  description?: string;
  dynamic?: boolean;
  reconfigurable?: boolean;
  auto_refresh?: boolean;
  trigger_auto_refresh?: boolean;
  load_values_on_init?: boolean;
  resource_action?: {
    resource_type?: string;
    ae_namespace?: string;
    ae_class?: string;
    ae_instance?: string;
    ae_message?: string;
    ae_attributes?: Record<string, unknown>;
  };
}

/**
 * ManageIQ dialog tab from API
 */
export interface ManageIQDialogTab {
  id?: string;
  label: string;
  description?: string;
  position?: number;
  dialog_groups?: ManageIQDialogGroup[];
}

/**
 * ManageIQ dialog group from API
 */
export interface ManageIQDialogGroup {
  id?: string;
  label: string;
  description?: string;
  position?: number;
  dialog_fields?: ManageIQDialogField[];
}

/**
 * ManageIQ dialog from API
 */
export interface ManageIQDialog {
  id?: string;
  label: string;
  description?: string;
  dialog_tabs?: ManageIQDialogTab[];
  content?: ManageIQDialogTab[];
}

/**
 * Extended field type with ManageIQ-specific properties
 */
export interface ExtendedField extends DDFField {
  // ManageIQ-specific properties
  dialogFieldId?: string;
  dynamic?: boolean;
  autoRefresh?: boolean;
  triggerAutoRefresh?: boolean;
  loadValuesOnInit?: boolean;
  resourceAction?: ManageIQDialogField['resource_action'];
}

/**
 * Data Driven Forms schema with ManageIQ extensions
 */
export interface DDFSchema {
  fields: ExtendedField[];
  title?: string;
  description?: string;
}

/**
 * Form submission payload
 */
export interface FormSubmission {
  values: Record<string, unknown>;
  dialogId?: string;
  resourceId?: string;
  resourceType?: string;
}

/**
 * Form validation error
 */
export interface FormValidationError {
  field: string;
  message: string;
}

/**
 * Form state
 */
export interface FormState {
  loading: boolean;
  submitting: boolean;
  errors: FormValidationError[];
  values: Record<string, unknown>;
  touched: Record<string, boolean>;
  dirty: boolean;
}

/**
 * Dialog form props
 */
export interface DialogFormProps {
  schema: DDFSchema;
  initialValues?: Record<string, unknown>;
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  readOnly?: boolean;
  showFormControls?: boolean;
}

/**
 * Field refresh callback
 */
export type FieldRefreshCallback = (
  fieldName: string,
  formValues: Record<string, unknown>
) => Promise<{
  values?: Array<[string, string]>;
  default_value?: unknown;
  visible?: boolean;
  read_only?: boolean;
}>;

/**
 * Form renderer context
 */
export interface FormRendererContext {
  onFieldRefresh?: FieldRefreshCallback;
  componentMapper?: ComponentMapper;
  readOnly?: boolean;
}

/**
 * Custom field component props
 */
export interface CustomFieldProps {
  input: {
    name: string;
    value: unknown;
    onChange: (value: unknown) => void;
    onBlur: () => void;
    onFocus: () => void;
  };
  meta: {
    error?: string;
    touched?: boolean;
    dirty?: boolean;
    invalid?: boolean;
    valid?: boolean;
  };
  label?: string;
  description?: string;
  helperText?: string;
  isRequired?: boolean;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  [key: string]: unknown;
}

/**
 * Schema normalization options
 */
export interface SchemaNormalizationOptions {
  includeHidden?: boolean;
  includeReadOnly?: boolean;
  validateOnMount?: boolean;
}

/**
 * Field dependency
 */
export interface FieldDependency {
  field: string;
  dependsOn: string[];
  condition?: (values: Record<string, unknown>) => boolean;
}
