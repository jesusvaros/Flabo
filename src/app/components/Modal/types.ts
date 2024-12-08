export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  triggerRef?: React.RefObject<HTMLElement>;
}
