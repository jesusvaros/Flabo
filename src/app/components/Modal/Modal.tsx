"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useTheme } from "../../styles/theme/ThemeProvider";
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  CloseButton,
  ModalBody,
} from "./styles";

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
    const positionModal = () => {
      if (isOpen && modalRef.current && triggerRef?.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const modalRect = modalRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Position the modal below the trigger button
        let top = triggerRect.bottom + 8; // 8px gap

        // Check if modal would go off the bottom of the viewport
        if (top + modalRect.height > viewportHeight) {
          // Position above the trigger if it would fit better
          top = Math.max(8, triggerRect.top - modalRect.height - 8);
        }

        // Center horizontally relative to trigger
        const left = Math.max(
          8, // Minimum 8px from left edge
          Math.min(
            triggerRect.left + (triggerRect.width - modalRect.width) / 2,
            window.innerWidth - modalRect.width - 8 // Keep 8px from right edge
          )
        );

        modalRef.current.style.position = "fixed";
        modalRef.current.style.top = `${top}px`;
        modalRef.current.style.left = `${left}px`;
      }
    };

    if (isOpen) {
      // Wait for next frame to ensure modal is rendered
      requestAnimationFrame(positionModal);
      // Also handle window resize
      window.addEventListener("resize", positionModal);
    }

    return () => {
      window.removeEventListener("resize", positionModal);
    };
  }, [isOpen, triggerRef]);

  if (!mounted) {
    return null;
  }

  if (!isOpen) {
    return null;
  }

  return createPortal(
    <ModalOverlay>
      <ModalContent ref={modalRef}>
        <ModalHeader>
          {title && <h2>{title}</h2>}
          <CloseButton onClick={onClose}>×</CloseButton>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </ModalOverlay>,
    document.body
  );
};
