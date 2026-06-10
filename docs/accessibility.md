# Accessibility Guidelines

This document outlines accessibility guidelines and keyboard interaction patterns for the ManageIQ Service UI React application.

## Overview

The ManageIQ Service UI is committed to meeting WCAG 2.1 Level AA accessibility standards. This ensures the application is usable by people with diverse abilities and assistive technologies.

## Core Principles

### 1. Perceivable

Information and user interface components must be presentable to users in ways they can perceive.

- **Text Alternatives**: Provide text alternatives for non-text content
- **Time-based Media**: Provide alternatives for time-based media
- **Adaptable**: Create content that can be presented in different ways
- **Distinguishable**: Make it easier for users to see and hear content

### 2. Operable

User interface components and navigation must be operable.

- **Keyboard Accessible**: Make all functionality available from a keyboard
- **Enough Time**: Provide users enough time to read and use content
- **Seizures**: Do not design content that causes seizures
- **Navigable**: Provide ways to help users navigate and find content

### 3. Understandable

Information and the operation of user interface must be understandable.

- **Readable**: Make text content readable and understandable
- **Predictable**: Make web pages appear and operate in predictable ways
- **Input Assistance**: Help users avoid and correct mistakes

### 4. Robust

Content must be robust enough to be interpreted by a wide variety of user agents, including assistive technologies.

## Keyboard Navigation

### Global Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Tab` | Move focus to next interactive element |
| `Shift + Tab` | Move focus to previous interactive element |
| `Enter` | Activate button, link, or submit form |
| `Space` | Activate button or toggle checkbox |
| `Escape` | Close modal, dropdown, or cancel action |
| `Arrow Keys` | Navigate within components (lists, menus, tabs) |

### Component-Specific Patterns

#### Buttons

```tsx
// Standard button - activated with Enter or Space
<Button onClick={handleClick}>
  Submit
</Button>

// Icon-only button - must have accessible label
<Button
  hasIconOnly
  iconDescription="Delete service"
  renderIcon={TrashCan}
  onClick={handleDelete}
/>
```

**Keyboard Interaction:**
- `Enter` or `Space`: Activate button
- `Tab`: Move focus to/from button

#### Modals

```tsx
<Modal
  open={isOpen}
  onRequestClose={handleClose}
  modalHeading="Confirm Action"
>
  <p>Modal content</p>
</Modal>
```

**Keyboard Interaction:**
- `Tab`: Cycle through interactive elements within modal
- `Escape`: Close modal
- Focus is trapped within modal when open
- Focus returns to trigger element when closed

#### Dropdowns and Menus

```tsx
<Dropdown
  id="service-actions"
  label="Actions"
  items={actions}
  onChange={handleAction}
/>
```

**Keyboard Interaction:**
- `Enter` or `Space`: Open dropdown
- `Arrow Up/Down`: Navigate menu items
- `Enter`: Select item
- `Escape`: Close dropdown
- `Tab`: Close dropdown and move to next element

#### Data Tables

```tsx
<DataTable
  rows={services}
  headers={headers}
  isSortable
>
  {/* Table content */}
</DataTable>
```

**Keyboard Interaction:**
- `Tab`: Move between table controls (sort buttons, pagination)
- `Enter` or `Space`: Activate sort, select row
- `Arrow Keys`: Navigate cells (if interactive)

#### Tabs

```tsx
<Tabs>
  <TabList>
    <Tab>Details</Tab>
    <Tab>Resources</Tab>
    <Tab>History</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>Details content</TabPanel>
    <TabPanel>Resources content</TabPanel>
    <TabPanel>History content</TabPanel>
  </TabPanels>
</Tabs>
```

**Keyboard Interaction:**
- `Tab`: Move focus to tab list
- `Arrow Left/Right`: Navigate between tabs
- `Enter` or `Space`: Activate tab
- `Tab`: Move focus into tab panel

#### Forms

```tsx
<Form onSubmit={handleSubmit}>
  <TextInput
    id="name"
    labelText="Service Name"
    required
  />
  <Select
    id="type"
    labelText="Service Type"
  >
    <SelectItem value="vm" text="Virtual Machine" />
  </Select>
  <Button type="submit">Submit</Button>
</Form>
```

**Keyboard Interaction:**
- `Tab`: Move between form fields
- `Enter`: Submit form (when focus is on submit button)
- `Space`: Toggle checkbox/radio
- `Arrow Up/Down`: Navigate select options

## Focus Management

### Focus Indicators

Always maintain visible focus indicators:

```scss
// ✅ Good - Visible focus indicator
.custom-button:focus {
  outline: 2px solid #0f62fe;
  outline-offset: 2px;
}

// ❌ Avoid - Removing focus indicator without alternative
.custom-button:focus {
  outline: none; // Don't do this
}
```

### Focus Order

Ensure logical focus order:

```tsx
// ✅ Good - Logical DOM order
<div>
  <Button>First</Button>
  <Button>Second</Button>
  <Button>Third</Button>
</div>

// ❌ Avoid - Using tabIndex to override natural order
<div>
  <Button tabIndex={3}>Third</Button>
  <Button tabIndex={1}>First</Button>
  <Button tabIndex={2}>Second</Button>
</div>
```

### Focus Trapping

Trap focus within modals and dialogs:

```tsx
import { useEffect, useRef } from 'react';

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      const previouslyFocused = document.activeElement as HTMLElement;
      
      // Focus first interactive element in modal
      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
      
      // Return focus when modal closes
      return () => {
        previouslyFocused?.focus();
      };
    }
  }, [isOpen]);
  
  return (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {children}
    </div>
  );
}
```

### Skip Links

Provide skip links for keyboard users:

```tsx
function App() {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Content />
      </main>
    </>
  );
}
```

```scss
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  text-decoration: none;
  z-index: 100;
  
  &:focus {
    top: 0;
  }
}
```

## ARIA Attributes

### Semantic HTML First

Use semantic HTML before adding ARIA:

```tsx
// ✅ Good - Semantic HTML
<button onClick={handleClick}>Submit</button>

// ❌ Avoid - Unnecessary ARIA
<div role="button" onClick={handleClick}>Submit</div>
```

### Common ARIA Patterns

#### Labels and Descriptions

```tsx
// Label for form input
<TextInput
  id="service-name"
  labelText="Service Name"
  aria-required="true"
/>

// Description for additional context
<TextInput
  id="email"
  labelText="Email"
  aria-describedby="email-hint"
/>
<div id="email-hint">We'll never share your email</div>

// Label for icon-only button
<Button
  hasIconOnly
  iconDescription="Delete service"
  aria-label="Delete service"
  renderIcon={TrashCan}
/>
```

#### Live Regions

```tsx
// Announce dynamic content changes
<div role="status" aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

// For urgent announcements
<div role="alert" aria-live="assertive">
  {errorMessage}
</div>
```

#### Loading States

```tsx
// Loading indicator
<div role="status" aria-live="polite" aria-busy="true">
  <Loading description="Loading services..." />
</div>

// When loading completes
<div role="status" aria-live="polite" aria-busy="false">
  Services loaded successfully
</div>
```

#### Expanded/Collapsed States

```tsx
// Accordion or expandable section
<Button
  aria-expanded={isExpanded}
  aria-controls="details-panel"
  onClick={toggleExpanded}
>
  Show Details
</Button>
<div id="details-panel" hidden={!isExpanded}>
  Details content
</div>
```

## Screen Reader Support

### Meaningful Text

Provide meaningful text for screen readers:

```tsx
// ✅ Good - Descriptive text
<Button onClick={handleDelete}>
  Delete Service "{serviceName}"
</Button>

// ❌ Avoid - Generic text
<Button onClick={handleDelete}>
  Delete
</Button>
```

### Hidden Content

Hide decorative content from screen readers:

```tsx
// Decorative icon
<span aria-hidden="true">
  <Icon />
</span>

// Visually hidden but available to screen readers
<span className="visually-hidden">
  Loading services
</span>
```

```scss
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

### Announcements

Announce important changes:

```tsx
function ServiceList() {
  const [announcement, setAnnouncement] = useState('');
  
  const handleDelete = async (id: string) => {
    await deleteService(id);
    setAnnouncement('Service deleted successfully');
  };
  
  return (
    <>
      <div role="status" aria-live="polite" className="visually-hidden">
        {announcement}
      </div>
      {/* Service list content */}
    </>
  );
}
```

## Color and Contrast

### Color Contrast Requirements

- **Normal text**: 4.5:1 contrast ratio
- **Large text** (18pt+ or 14pt+ bold): 3:1 contrast ratio
- **UI components**: 3:1 contrast ratio

### Don't Rely on Color Alone

```tsx
// ✅ Good - Color + icon + text
<div className="status-success">
  <CheckmarkFilled />
  <span>Active</span>
</div>

// ❌ Avoid - Color only
<div className="status-success">
  Active
</div>
```

### Test with Color Blindness Simulators

Use tools to test color accessibility:
- Chrome DevTools (Rendering > Emulate vision deficiencies)
- Colorblind Web Page Filter
- Stark plugin for Figma

## Forms and Validation

### Error Messages

Provide clear, accessible error messages:

```tsx
<TextInput
  id="email"
  labelText="Email"
  invalid={!!errors.email}
  invalidText={errors.email}
  aria-invalid={!!errors.email}
  aria-describedby={errors.email ? 'email-error' : undefined}
/>
{errors.email && (
  <div id="email-error" role="alert">
    {errors.email}
  </div>
)}
```

### Required Fields

Indicate required fields clearly:

```tsx
<TextInput
  id="name"
  labelText="Service Name"
  required
  aria-required="true"
/>
```

### Form Submission

Announce form submission results:

```tsx
function ServiceForm() {
  const [submitStatus, setSubmitStatus] = useState('');
  
  const handleSubmit = async (data) => {
    try {
      await submitService(data);
      setSubmitStatus('Service created successfully');
    } catch (error) {
      setSubmitStatus(`Error: ${error.message}`);
    }
  };
  
  return (
    <>
      <div role="status" aria-live="polite">
        {submitStatus}
      </div>
      <Form onSubmit={handleSubmit}>
        {/* Form fields */}
      </Form>
    </>
  );
}
```

## Testing Accessibility

### Automated Testing

Use automated tools to catch common issues:

```tsx
// In tests
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

test('should have no accessibility violations', async () => {
  const { container } = render(<ServiceList />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
```

### Manual Testing

#### Keyboard Testing

1. Unplug your mouse
2. Navigate the entire application using only keyboard
3. Verify all functionality is accessible
4. Check focus indicators are visible
5. Ensure logical tab order

#### Screen Reader Testing

Test with popular screen readers:
- **NVDA** (Windows, free)
- **JAWS** (Windows, commercial)
- **VoiceOver** (macOS/iOS, built-in)
- **TalkBack** (Android, built-in)

#### Browser DevTools

Use browser accessibility tools:
- Chrome DevTools Lighthouse
- Firefox Accessibility Inspector
- axe DevTools browser extension

### Testing Checklist

- [ ] All interactive elements are keyboard accessible
- [ ] Focus indicators are visible
- [ ] Tab order is logical
- [ ] ARIA attributes are used correctly
- [ ] Color contrast meets WCAG AA standards
- [ ] Images have alt text
- [ ] Forms have proper labels and error messages
- [ ] Dynamic content changes are announced
- [ ] Modals trap focus and return focus on close
- [ ] No keyboard traps exist
- [ ] Screen reader announces content correctly

## Common Accessibility Issues

### Issue: Missing Alt Text

```tsx
// ❌ Bad
<img src="service-icon.png" />

// ✅ Good
<img src="service-icon.png" alt="Virtual Machine Service" />

// ✅ Good - Decorative image
<img src="decorative.png" alt="" aria-hidden="true" />
```

### Issue: Non-Descriptive Links

```tsx
// ❌ Bad
<a href="/services/123">Click here</a>

// ✅ Good
<a href="/services/123">View details for Web Server service</a>
```

### Issue: Keyboard Trap

```tsx
// ❌ Bad - Focus can't escape
<div onKeyDown={(e) => e.preventDefault()}>
  <input />
</div>

// ✅ Good - Allow normal keyboard navigation
<div>
  <input />
</div>
```

### Issue: Missing Form Labels

```tsx
// ❌ Bad
<input type="text" placeholder="Service name" />

// ✅ Good
<TextInput
  id="service-name"
  labelText="Service Name"
  placeholder="Enter service name"
/>
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Carbon Accessibility Guidelines](https://carbondesignsystem.com/guidelines/accessibility/overview/)
- [WebAIM](https://webaim.org/)
- [A11y Project](https://www.a11yproject.com/)
- [Deque University](https://dequeuniversity.com/)

## Getting Help

- Review Carbon component accessibility documentation
- Use automated testing tools (axe, Lighthouse)
- Test with real assistive technologies
- Consult WCAG guidelines for specific requirements
- Ask accessibility experts for complex scenarios
