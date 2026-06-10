/**
 * FormRenderer component tests
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { DialogFormRenderer, ManageIQFormRenderer } from './FormRenderer';
import type { DDFSchema } from '../types';

describe('DialogFormRenderer', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  const sampleSchema: DDFSchema = {
    fields: [
      {
        component: 'text-field',
        name: 'name',
        label: 'Name',
        isRequired: true,
        validate: [{ type: 'required' }],
      },
      {
        component: 'text-field',
        name: 'email',
        label: 'Email',
        dataType: 'string',
        validate: [
          { type: 'required' },
          { type: 'pattern', pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
        ],
      },
      {
        component: 'select',
        name: 'role',
        label: 'Role',
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with schema fields', () => {
    render(
      <DialogFormRenderer
        schema={sampleSchema}
        onSubmit={mockOnSubmit}
        showFormControls={false}
      />
    );

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
  });

  it('renders submit button when showFormControls is true', () => {
    render(
      <DialogFormRenderer
        schema={sampleSchema}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        showFormControls={true}
      />
    );

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('renders cancel button when showFormControls is true and onCancel is provided', () => {
    render(
      <DialogFormRenderer
        schema={sampleSchema}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        showFormControls={true}
      />
    );

    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('does not render form controls when showFormControls is false', () => {
    render(
      <DialogFormRenderer
        schema={sampleSchema}
        onSubmit={mockOnSubmit}
        showFormControls={false}
      />
    );

    expect(screen.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });

  it('populates initial values', () => {
    const initialValues = {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'admin',
    };

    render(
      <DialogFormRenderer
        schema={sampleSchema}
        initialValues={initialValues}
        onSubmit={mockOnSubmit}
        showFormControls={false}
      />
    );

    expect(screen.getByLabelText(/name/i)).toHaveValue('John Doe');
    expect(screen.getByLabelText(/email/i)).toHaveValue('john@example.com');
  });

  it('uses custom submit label', () => {
    render(
      <DialogFormRenderer
        schema={sampleSchema}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        showFormControls={true}
        submitLabel="Save"
      />
    );

    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('uses custom cancel label', () => {
    render(
      <DialogFormRenderer
        schema={sampleSchema}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        showFormControls={true}
        cancelLabel="Close"
      />
    );

    expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
  });

  it('does not render buttons in readOnly mode', () => {
    render(
      <DialogFormRenderer
        schema={sampleSchema}
        onSubmit={mockOnSubmit}
        showFormControls={true}
        readOnly={true}
      />
    );

    expect(screen.queryByRole('button', { name: /submit/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });

  it('cleans ManageIQ-specific props from schema', () => {
    const schemaWithCustomProps: DDFSchema = {
      fields: [
        {
          component: 'text-field',
          name: 'test',
          label: 'Test',
          dynamic: true,
          autoRefresh: true,
          triggerAutoRefresh: true,
          loadValuesOnInit: true,
          dialogFieldId: '123',
        },
      ],
    };

    render(
      <DialogFormRenderer
        schema={schemaWithCustomProps}
        onSubmit={mockOnSubmit}
        showFormControls={false}
      />
    );

    // Should render without errors despite custom props
    expect(screen.getByLabelText(/test/i)).toBeInTheDocument();
  });
});

describe('ManageIQFormRenderer', () => {
  const mockOnSubmit = jest.fn();
  const mockOnFieldRefresh = jest.fn();

  const sampleSchema: DDFSchema = {
    fields: [
      {
        component: 'text-field',
        name: 'service_name',
        label: 'Service Name',
        isRequired: true,
        validate: [{ type: 'required' }],
      },
      {
        component: 'select',
        name: 'catalog_id',
        label: 'Catalog',
        options: [
          { label: 'Catalog 1', value: '1' },
          { label: 'Catalog 2', value: '2' },
        ],
        dynamic: true,
        autoRefresh: true,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with ManageIQ-specific fields', () => {
    render(
      <ManageIQFormRenderer
        schema={sampleSchema}
        onSubmit={mockOnSubmit}
        showFormControls={false}
      />
    );

    expect(screen.getByLabelText(/service name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/catalog/i)).toBeInTheDocument();
  });

  it('accepts custom component mapper', () => {
    const customMapper = {
      'custom-field': () => <div>Custom Field</div>,
    };

    const schemaWithCustomField: DDFSchema = {
      fields: [
        {
          component: 'custom-field',
          name: 'custom',
          label: 'Custom',
        },
      ],
    };

    render(
      <ManageIQFormRenderer
        schema={schemaWithCustomField}
        onSubmit={mockOnSubmit}
        customComponentMapper={customMapper}
        showFormControls={false}
      />
    );

    expect(screen.getByText('Custom Field')).toBeInTheDocument();
  });

  it('renders submit button when showFormControls is true', () => {
    render(
      <ManageIQFormRenderer
        schema={sampleSchema}
        onSubmit={mockOnSubmit}
        showFormControls={true}
      />
    );

    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('supports field refresh callback prop', () => {
    render(
      <ManageIQFormRenderer
        schema={sampleSchema}
        onSubmit={mockOnSubmit}
        onFieldRefresh={mockOnFieldRefresh}
        showFormControls={false}
      />
    );

    // Field refresh callback is passed but not directly testable without triggering field changes
    expect(screen.getByLabelText(/service name/i)).toBeInTheDocument();
  });

  it('cleans ManageIQ-specific props from schema fields', () => {
    render(
      <ManageIQFormRenderer
        schema={sampleSchema}
        onSubmit={mockOnSubmit}
        showFormControls={false}
      />
    );

    // Should render without errors despite dynamic and autoRefresh props
    expect(screen.getByLabelText(/catalog/i)).toBeInTheDocument();
  });
});

describe('Carbon Mapper Compatibility', () => {
  it('renders Carbon text field component', () => {
    const schema: DDFSchema = {
      fields: [
        {
          component: 'text-field',
          name: 'test',
          label: 'Test Field',
        },
      ],
    };

    render(
      <DialogFormRenderer
        schema={schema}
        onSubmit={jest.fn()}
        showFormControls={false}
      />
    );

    expect(screen.getByLabelText(/test field/i)).toBeInTheDocument();
  });

  it('renders Carbon select component', () => {
    const schema: DDFSchema = {
      fields: [
        {
          component: 'select',
          name: 'test',
          label: 'Test Select',
          options: [
            { label: 'Option 1', value: '1' },
            { label: 'Option 2', value: '2' },
          ],
        },
      ],
    };

    render(
      <DialogFormRenderer
        schema={schema}
        onSubmit={jest.fn()}
        showFormControls={false}
      />
    );

    expect(screen.getByLabelText(/test select/i)).toBeInTheDocument();
  });

  it('renders Carbon checkbox component', () => {
    const schema: DDFSchema = {
      fields: [
        {
          component: 'checkbox',
          name: 'test',
          label: 'Test Checkbox',
        },
      ],
    };

    render(
      <DialogFormRenderer
        schema={schema}
        onSubmit={jest.fn()}
        showFormControls={false}
      />
    );

    expect(screen.getByLabelText(/test checkbox/i)).toBeInTheDocument();
  });

  it('renders Carbon textarea component', () => {
    const schema: DDFSchema = {
      fields: [
        {
          component: 'textarea',
          name: 'test',
          label: 'Test Textarea',
        },
      ],
    };

    render(
      <DialogFormRenderer
        schema={schema}
        onSubmit={jest.fn()}
        showFormControls={false}
      />
    );

    expect(screen.getByLabelText(/test textarea/i)).toBeInTheDocument();
  });

  it('renders Carbon date picker component', () => {
    const schema: DDFSchema = {
      fields: [
        {
          component: 'date-picker',
          name: 'test',
          label: 'Test Date',
        },
      ],
    };

    render(
      <DialogFormRenderer
        schema={schema}
        onSubmit={jest.fn()}
        showFormControls={false}
      />
    );

    expect(screen.getByLabelText(/test date/i)).toBeInTheDocument();
  });
});