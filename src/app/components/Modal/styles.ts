import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  position: relative;
  background-color: ${({ theme }) => theme.colors.background.primary};
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 600px;
  max-width: 90vw;
  max-height: 85vh;
  overflow: auto;
  z-index: 1001;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border.primary};

  h2 {
    margin: 0;
    color: ${({ theme }) => theme.colors.text.primary};
    font-size: 1.2rem;
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 4px 8px;
  border-radius: 4px;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.secondary};
  }
`;

export const ModalBody = styled.div`
  padding: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
`;
