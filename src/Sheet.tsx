import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { ArrowLeft, X } from 'lucide-react';

/** One native dialog shell for every sheet: inert background, focus trap and Escape. */
export function Sheet({ title, children, onClose, onBack, backLabel = 'Go back', closeLabel = 'Close dialog', focusInput = false }: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  onBack?: () => void;
  backLabel?: string;
  closeLabel?: string;
  focusInput?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const element = dialog.current;
    element?.showModal();
    return () => {
      element?.close();
      requestAnimationFrame(() => {
        if (document.querySelector('dialog[open]')) return;
        const target = previous?.isConnected ? previous : document.querySelector<HTMLElement>('.app-content h1, main h1');
        target?.focus({ preventScroll: true });
      });
    };
  }, []);
  useEffect(() => {
    const input = focusInput ? dialog.current?.querySelector<HTMLInputElement>('input:not(:disabled)') : null;
    (input || heading.current)?.focus({ preventScroll: true });
  }, [title, focusInput]);
  return <dialog className="sheet" ref={dialog} aria-label={title} onKeyDown={event => {
    if (event.key !== 'Tab') return;
    const controls = dialog.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled), summary, a[href]');
    if (!controls?.length) return;
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement === heading.current)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }} onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => { if (event.target === event.currentTarget) onClose(); }}>
    <div className="sheet-inner">
      <div className="sheet-handle" aria-hidden="true" />
      <header className="sheet-heading">
        {onBack && <button className="icon-button" aria-label={backLabel} onClick={onBack}><ArrowLeft size={20} aria-hidden="true" /></button>}
        <h2 ref={heading} tabIndex={-1}>{title}</h2>
        <button className="icon-button" aria-label={closeLabel} onClick={onClose}><X size={21} aria-hidden="true" /></button>
      </header>
      {children}
    </div>
  </dialog>;
}
