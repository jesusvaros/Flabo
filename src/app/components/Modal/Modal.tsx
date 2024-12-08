"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../../styles/theme/ThemeProvider";
import { ModalOverlay, ModalContent, ModalHeader, CloseButton, ModalBody } from "./styles";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  triggerRef?: React.RefObject<HTMLElement>;
};

export const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  triggerRef,
}: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(e.target as Node) &&
        triggerRef?.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, triggerRef]);

  useEffect(() => {
    if (isOpen && modalRef.current && triggerRef?.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const modalRect = modalRef.current.getBoundingClientRect();

      // Position the modal below the trigger button
      const top = triggerRect.bottom + 8; // 8px gap
      const left = Math.max(
        Math.min(
          triggerRect.left,
          window.innerWidth - modalRect.width - 8 // keep 8px from right edge
        )
      );

      modalRef.current.style.top = `${top}px`;
      modalRef.current.style.left = `${left}px`;
    }
  }, [isOpen, triggerRef]);

  if (!mounted) {
    return null;
  }

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <ModalOverlay theme={theme}>
      <ModalContent ref={modalRef} theme={theme}>
        <ModalHeader theme={theme}>
          {title && <h2 >{title}</h2>}
          <CloseButton theme={theme} onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <ModalBody theme={theme}>{children}</ModalBody>
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};
