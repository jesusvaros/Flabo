'use client';

import { useEffect, useRef } from 'react';
import { ModalProps } from './types';
import { modalStyles } from './styles';

export const Modal = ({ isOpen, onClose, children, title, triggerRef }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && 
          triggerRef?.current && !triggerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  useEffect(() => {
    if (isOpen && modalRef.current && triggerRef?.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const modalRect = modalRef.current.getBoundingClientRect();
      
      // Position the modal below the trigger button
      const top = triggerRect.bottom + 8; // 8px gap
      const left = Math.max(
        8, // minimum 8px from left edge
        Math.min(
          triggerRect.left + (triggerRect.width - modalRect.width) / 2,
          window.innerWidth - modalRect.width - 8 // keep 8px from right edge
        )
      );
      
      modalRef.current.style.top = `${top}px`;
      modalRef.current.style.left = `${left}px`;
    }
  }, [isOpen, triggerRef]);

  if (!isOpen) return null;

  return (
    <div className="modal-content" ref={modalRef}>
      <div className="modal-header">
        {title && <h2>{title}</h2>}
        <button className="close-button" onClick={onClose}>×</button>
      </div>
      <div className="modal-body">
        {children}
      </div>
      <div className="modal-arrow" />
      <style jsx>{modalStyles}</style>
    </div>
  );
};
