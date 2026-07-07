'use client';

import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessibility hook for modal / dialog components.
 *
 * Attach the returned ref to the modal's dialog panel (the element that
 * should carry `role="dialog"` / `aria-modal="true"`). While `active` is
 * true, this hook:
 *
 *  - moves focus into the modal on open (first focusable element, or the
 *    panel itself if nothing inside is focusable)
 *  - traps Tab / Shift+Tab so focus cycles within the modal's focusable
 *    elements instead of escaping to the page behind it
 *  - calls `onClose` when Escape is pressed
 *  - restores focus to whatever element had focus before the modal opened,
 *    once the modal closes or unmounts
 *
 * Usage:
 *   const panelRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);
 *   <div ref={panelRef} role="dialog" aria-modal="true" aria-labelledby="my-title-id">
 *     <h2 id="my-title-id">...</h2>
 *     ...
 *   </div>
 *
 * For modals that unmount entirely when closed (i.e. the component returns
 * `null` and is removed from the tree, rather than toggling a boolean),
 * pass `true` for `active` — mount/unmount already gives you the open/close
 * transition, so the effect's cleanup handles the focus restore.
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(
  active: boolean,
  onClose: () => void,
) {
  const containerRef = useRef<T>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // Keep a stable reference to the latest onClose without re-running the
  // effect (and re-trapping focus) every time the caller passes a new
  // inline function.
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!active) return;

    previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    const container = containerRef.current;

    const getFocusable = (): HTMLElement[] => {
      if (!container) return [];
      return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
        (el) => !el.hasAttribute('disabled') && el.tabIndex !== -1,
      );
    };

    // Move initial focus into the modal.
    const focusables = getFocusable();
    if (focusables.length > 0) {
      focusables[0].focus();
    } else {
      container?.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (e.key !== 'Tab') return;

      const items = getFocusable();
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement as HTMLElement | null;

      if (e.shiftKey) {
        if (current === first || !container?.contains(current)) {
          e.preventDefault();
          last.focus();
        }
      } else if (current === last || !container?.contains(current)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      previouslyFocusedRef.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return containerRef;
}

export default useFocusTrap;
