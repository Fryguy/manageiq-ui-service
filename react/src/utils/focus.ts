/**
 * Focus Management Utilities
 * 
 * Utilities for managing focus in accessible ways, including focus trapping,
 * focus restoration, and focus indicators.
 */

/**
 * Query selector for all focusable elements
 */
const FOCUSABLE_ELEMENTS = [
  'a[href]',
  'area[href]',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'button:not([disabled])',
  'iframe',
  'object',
  'embed',
  '[contenteditable]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Get all focusable elements within a container
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = container.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENTS);
  return Array.from(elements).filter((element) => {
    // Filter out elements that are not visible or have negative tabindex
    return (
      element.offsetWidth > 0 &&
      element.offsetHeight > 0 &&
      element.tabIndex !== -1
    );
  });
}

/**
 * Get the first focusable element within a container
 */
export function getFirstFocusableElement(
  container: HTMLElement
): HTMLElement | null {
  const elements = getFocusableElements(container);
  return elements[0] || null;
}

/**
 * Get the last focusable element within a container
 */
export function getLastFocusableElement(
  container: HTMLElement
): HTMLElement | null {
  const elements = getFocusableElements(container);
  return elements[elements.length - 1] || null;
}

/**
 * Focus the first focusable element within a container
 */
export function focusFirstElement(container: HTMLElement): boolean {
  const firstElement = getFirstFocusableElement(container);
  if (firstElement) {
    firstElement.focus();
    return true;
  }
  return false;
}

/**
 * Focus the last focusable element within a container
 */
export function focusLastElement(container: HTMLElement): boolean {
  const lastElement = getLastFocusableElement(container);
  if (lastElement) {
    lastElement.focus();
    return true;
  }
  return false;
}

/**
 * Trap focus within a container (for modals, dialogs, etc.)
 * Returns a cleanup function to remove the trap
 */
export function trapFocus(container: HTMLElement): () => void {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = getFocusableElements(container);
    if (focusableElements.length === 0) {
      event.preventDefault();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    const activeElement = document.activeElement as HTMLElement;

    // Shift + Tab: Move focus to last element if on first element
    if (event.shiftKey && activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
      return;
    }

    // Tab: Move focus to first element if on last element
    if (!event.shiftKey && activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
      return;
    }
  };

  container.addEventListener('keydown', handleKeyDown);

  // Return cleanup function
  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Store the currently focused element and return a function to restore it
 */
export function saveFocus(): () => void {
  const previouslyFocused = document.activeElement as HTMLElement;

  return () => {
    if (previouslyFocused && previouslyFocused.focus) {
      // Use setTimeout to ensure focus is restored after any pending DOM updates
      setTimeout(() => {
        previouslyFocused.focus();
      }, 0);
    }
  };
}

/**
 * Focus an element with optional scroll behavior
 */
export function focusElement(
  element: HTMLElement,
  options?: {
    preventScroll?: boolean;
    scrollIntoView?: boolean;
  }
): void {
  const { preventScroll = false, scrollIntoView = false } = options || {};

  element.focus({ preventScroll });

  if (scrollIntoView && !preventScroll) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }
}

/**
 * Check if an element is currently focused
 */
export function isFocused(element: HTMLElement): boolean {
  return document.activeElement === element;
}

/**
 * Check if focus is within a container
 */
export function isFocusWithin(container: HTMLElement): boolean {
  return container.contains(document.activeElement);
}

/**
 * Move focus to the next focusable element
 */
export function focusNext(container?: HTMLElement): boolean {
  const root = container || document.body;
  const focusableElements = getFocusableElements(root);
  const currentIndex = focusableElements.indexOf(
    document.activeElement as HTMLElement
  );

  if (currentIndex === -1 || currentIndex === focusableElements.length - 1) {
    // Focus first element if no element is focused or last element is focused
    return focusFirstElement(root);
  }

  focusableElements[currentIndex + 1].focus();
  return true;
}

/**
 * Move focus to the previous focusable element
 */
export function focusPrevious(container?: HTMLElement): boolean {
  const root = container || document.body;
  const focusableElements = getFocusableElements(root);
  const currentIndex = focusableElements.indexOf(
    document.activeElement as HTMLElement
  );

  if (currentIndex === -1 || currentIndex === 0) {
    // Focus last element if no element is focused or first element is focused
    return focusLastElement(root);
  }

  focusableElements[currentIndex - 1].focus();
  return true;
}

/**
 * Create a focus trap for a modal or dialog
 * Automatically focuses the first element and restores focus on cleanup
 */
export function createFocusTrap(container: HTMLElement): {
  activate: () => void;
  deactivate: () => void;
} {
  let restoreFocus: (() => void) | null = null;
  let removeTrap: (() => void) | null = null;

  const activate = () => {
    // Save current focus
    restoreFocus = saveFocus();

    // Focus first element in container
    focusFirstElement(container);

    // Trap focus
    removeTrap = trapFocus(container);
  };

  const deactivate = () => {
    // Remove focus trap
    if (removeTrap) {
      removeTrap();
      removeTrap = null;
    }

    // Restore previous focus
    if (restoreFocus) {
      restoreFocus();
      restoreFocus = null;
    }
  };

  return { activate, deactivate };
}

/**
 * Ensure an element is visible in the viewport
 */
export function ensureVisible(element: HTMLElement): void {
  const rect = element.getBoundingClientRect();
  const isVisible =
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= window.innerHeight &&
    rect.right <= window.innerWidth;

  if (!isVisible) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
      inline: 'nearest',
    });
  }
}

/**
 * Add a visible focus indicator to an element
 */
export function addFocusIndicator(element: HTMLElement): void {
  element.style.outline = '2px solid #0f62fe';
  element.style.outlineOffset = '2px';
}

/**
 * Remove focus indicator from an element
 */
export function removeFocusIndicator(element: HTMLElement): void {
  element.style.outline = '';
  element.style.outlineOffset = '';
}

/**
 * Check if an element is focusable
 */
export function isFocusable(element: HTMLElement): boolean {
  const focusableElements = getFocusableElements(document.body);
  return focusableElements.includes(element);
}

/**
 * Disable focus for an element
 */
export function disableFocus(element: HTMLElement): void {
  element.setAttribute('tabindex', '-1');
}

/**
 * Enable focus for an element
 */
export function enableFocus(element: HTMLElement, tabIndex = 0): void {
  element.setAttribute('tabindex', String(tabIndex));
}
