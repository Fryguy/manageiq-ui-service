# Carbon Design System Usage Guidelines

This document outlines the guidelines and best practices for using IBM Carbon Design System components in the ManageIQ Service UI React application.

## Overview

The ManageIQ Service UI uses IBM Carbon Design System as its primary UI framework. Carbon provides a comprehensive set of accessible, production-ready components that follow IBM's design language.

## Core Principles

### 1. Use Carbon Components First

Always prefer Carbon components over custom implementations:

```tsx
// ✅ Good - Use Carbon components
import { Button, DataTable } from '@carbon/react';

// ❌ Avoid - Custom implementations when Carbon provides the component
import CustomButton from './CustomButton';
```

### 2. Follow Carbon Design Patterns

Adhere to Carbon's design patterns and component usage guidelines:

- **Spacing**: Use Carbon's spacing tokens (`spacing-03`, `spacing-05`, etc.)
- **Typography**: Use Carbon's type tokens (`body-01`, `heading-03`, etc.)
- **Colors**: Use Carbon's color tokens (`text-primary`, `background`, etc.)
- **Icons**: Use `@carbon/icons-react` for all icons

### 3. Accessibility by Default

Carbon components are accessible by default. Maintain this by:

- Not overriding ARIA attributes unless necessary
- Preserving keyboard navigation patterns
- Maintaining focus management
- Using semantic HTML through Carbon components

## Component Usage

### Buttons

```tsx
import { Button } from '@carbon/react';

// Primary action
<Button kind="primary" onClick={handleSubmit}>
  Submit Order
</Button>

// Secondary action
<Button kind="secondary" onClick={handleCancel}>
  Cancel
</Button>

// Danger action
<Button kind="danger" onClick={handleDelete}>
  Delete Service
</Button>

// Ghost button for tertiary actions
<Button kind="ghost" onClick={handleEdit}>
  Edit
</Button>
```

### Data Tables

```tsx
import { DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell } from '@carbon/react';

const headers = [
  { key: 'name', header: 'Service Name' },
  { key: 'status', header: 'Status' },
  { key: 'created', header: 'Created' },
];

<DataTable rows={services} headers={headers}>
  {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
    <Table {...getTableProps()}>
      <TableHead>
        <TableRow>
          {headers.map((header) => (
            <TableHeader {...getHeaderProps({ header })}>
              {header.header}
            </TableHeader>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row) => (
          <TableRow {...getRowProps({ row })}>
            {row.cells.map((cell) => (
              <TableCell key={cell.id}>{cell.value}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )}
</DataTable>
```

### Modals

```tsx
import { Modal } from '@carbon/react';

<Modal
  open={isOpen}
  onRequestClose={handleClose}
  modalHeading="Confirm Action"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  onRequestSubmit={handleConfirm}
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

### Forms

```tsx
import { Form, TextInput, Select, SelectItem, Checkbox } from '@carbon/react';

<Form onSubmit={handleSubmit}>
  <TextInput
    id="service-name"
    labelText="Service Name"
    placeholder="Enter service name"
    value={name}
    onChange={(e) => setName(e.target.value)}
    required
  />
  
  <Select
    id="service-type"
    labelText="Service Type"
    value={type}
    onChange={(e) => setType(e.target.value)}
  >
    <SelectItem value="" text="Choose an option" />
    <SelectItem value="vm" text="Virtual Machine" />
    <SelectItem value="container" text="Container" />
  </Select>
  
  <Checkbox
    id="auto-approve"
    labelText="Auto-approve requests"
    checked={autoApprove}
    onChange={(checked) => setAutoApprove(checked)}
  />
</Form>
```

### Notifications

```tsx
import { ToastNotification, InlineNotification } from '@carbon/react';

// Toast notification (temporary)
<ToastNotification
  kind="success"
  title="Success"
  subtitle="Service created successfully"
  timeout={3000}
  onClose={handleClose}
/>

// Inline notification (persistent)
<InlineNotification
  kind="error"
  title="Error"
  subtitle="Failed to load services"
  lowContrast
/>
```

### Loading States

```tsx
import { Loading, InlineLoading, SkeletonText } from '@carbon/react';

// Full page loading
<Loading active={isLoading} description="Loading services..." />

// Inline loading
<InlineLoading
  status={isLoading ? 'active' : 'finished'}
  description="Saving..."
/>

// Skeleton loading
<SkeletonText heading paragraph lineCount={3} />
```

## Theming

### Using Carbon Themes

Carbon provides multiple themes. The default theme is `white` (light mode).

```tsx
import { Theme } from '@carbon/react';

// Wrap your app or component
<Theme theme="white">
  <App />
</Theme>

// Or use g10 (light gray), g90 (dark gray), g100 (dark)
<Theme theme="g10">
  <App />
</Theme>
```

### Custom Theme Tokens

When you need custom colors, use Carbon's color tokens:

```scss
@use '@carbon/react/scss/colors';

.custom-element {
  background-color: colors.$background;
  color: colors.$text-primary;
  border-color: colors.$border-subtle;
}
```

## Layout and Grid

### Carbon Grid System

Use Carbon's grid system for responsive layouts:

```tsx
import { Grid, Column } from '@carbon/react';

<Grid>
  <Column lg={8} md={6} sm={4}>
    <MainContent />
  </Column>
  <Column lg={4} md={2} sm={4}>
    <Sidebar />
  </Column>
</Grid>
```

### Spacing

Use Carbon's spacing scale:

```scss
@use '@carbon/react/scss/spacing';

.container {
  padding: spacing.$spacing-05; // 1rem
  margin-bottom: spacing.$spacing-07; // 2rem
}
```

## Icons

### Using Carbon Icons

```tsx
import { Add, Edit, TrashCan, CheckmarkFilled } from '@carbon/icons-react';

// Standard size (16px)
<Add />

// Custom size
<Edit size={20} />

// With button
<Button renderIcon={Add}>
  Add Service
</Button>
```

### Icon Guidelines

- Use 16px icons for inline text and buttons
- Use 20px icons for larger touch targets
- Use 24px or 32px icons for prominent actions
- Always provide accessible labels for icon-only buttons

## Accessibility Considerations

### Keyboard Navigation

Carbon components support keyboard navigation by default:

- **Tab**: Navigate between interactive elements
- **Enter/Space**: Activate buttons and controls
- **Arrow keys**: Navigate within components (dropdowns, tabs, etc.)
- **Escape**: Close modals and dropdowns

### ARIA Labels

Provide descriptive labels for screen readers:

```tsx
// Icon-only button
<Button
  kind="ghost"
  hasIconOnly
  iconDescription="Delete service"
  renderIcon={TrashCan}
  onClick={handleDelete}
/>

// Custom ARIA label
<Button aria-label="Submit order for approval">
  Submit
</Button>
```

### Focus Management

Carbon handles focus management, but ensure:

- Focus returns to trigger element after modal closes
- Focus moves to first interactive element in modal
- Focus is visible (don't remove outline without alternative)

## Performance Optimization

### Code Splitting

Import Carbon components individually to enable tree-shaking:

```tsx
// ✅ Good - Tree-shakeable
import { Button, Modal } from '@carbon/react';

// ❌ Avoid - Imports entire library
import * as Carbon from '@carbon/react';
```

### Lazy Loading

Lazy load heavy components:

```tsx
import { lazy, Suspense } from 'react';
import { Loading } from '@carbon/react';

const DataTable = lazy(() => import('./components/DataTable'));

<Suspense fallback={<Loading />}>
  <DataTable />
</Suspense>
```

## Common Patterns

### Permission-Aware Actions

Combine Carbon components with RBAC:

```tsx
import { Button } from '@carbon/react';
import { usePermissions } from '@/features/auth/hooks/usePermissions';

function ServiceActions({ service }) {
  const { has } = usePermissions();
  
  return (
    <>
      {has('service_edit') && (
        <Button kind="secondary" onClick={handleEdit}>
          Edit
        </Button>
      )}
      {has('service_delete') && (
        <Button kind="danger" onClick={handleDelete}>
          Delete
        </Button>
      )}
    </>
  );
}
```

### Loading States with Data

```tsx
import { DataTable, DataTableSkeleton } from '@carbon/react';

function ServiceList() {
  const { services, loading } = useServices();
  
  if (loading) {
    return <DataTableSkeleton headers={headers} rowCount={5} />;
  }
  
  return <DataTable rows={services} headers={headers} />;
}
```

### Error States

```tsx
import { InlineNotification } from '@carbon/react';

function ServiceDetails() {
  const { service, error } = useService(id);
  
  if (error) {
    return (
      <InlineNotification
        kind="error"
        title="Error loading service"
        subtitle={error.message}
        lowContrast
      />
    );
  }
  
  return <ServiceInfo service={service} />;
}
```

## Resources

- [Carbon Design System Documentation](https://carbondesignsystem.com/)
- [Carbon React Components](https://react.carbondesignsystem.com/)
- [Carbon Icons](https://carbondesignsystem.com/guidelines/icons/library/)
- [Carbon Design Kit (Figma)](https://carbondesignsystem.com/designing/kits/figma/)
- [Carbon Accessibility Guidelines](https://carbondesignsystem.com/guidelines/accessibility/overview/)

## Migration from PatternFly

When migrating from PatternFly 3 components:

| PatternFly 3 | Carbon Equivalent |
|--------------|-------------------|
| `pf-button` | `Button` |
| `pf-modal` | `Modal` |
| `pf-table` | `DataTable` |
| `pf-form-control` | `TextInput`, `Select`, etc. |
| `pf-alert` | `InlineNotification`, `ToastNotification` |
| `pf-spinner` | `Loading`, `InlineLoading` |

## Getting Help

- Check Carbon documentation first
- Review existing component usage in the codebase
- Ask in team channels for Carbon-specific questions
- File issues for Carbon bugs or feature requests
