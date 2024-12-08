import css from 'styled-jsx/css';

export const modalStyles = css`
  .modal-content {
    position: fixed;
    z-index: 1001;
    background: white;
    border-radius: 8px;
    width: 100%;
    max-width: 400px;
    max-height: calc(100vh - 80px);
    overflow-y: auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
    animation: modalIn 0.2s ease-out;
  }

  .modal-header {
    padding: 1rem;
    border-bottom: 1px solid #e2e8f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #1a202c;
    font-weight: 600;
  }

  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    line-height: 1;
    color: #4a5568;
    transition: color 0.2s;
  }

  .close-button:hover {
    color: #1a202c;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .modal-arrow {
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 16px;
    height: 8px;
    overflow: hidden;
  }

  .modal-arrow::after {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    background: white;
    transform: translateX(-50%) translateY(25%) rotate(45deg);
    left: 50%;
    box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.1);
  }

  @keyframes modalIn {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 640px) {
    .modal-content {
      position: fixed;
      top: auto !important;
      left: 0 !important;
      right: 0;
      bottom: 0;
      max-width: none;
      border-radius: 12px 12px 0 0;
      animation: slideUp 0.3s ease-out;
    }

    .modal-arrow {
      display: none;
    }

    @keyframes slideUp {
      from {
        transform: translateY(100%);
      }
      to {
        transform: translateY(0);
      }
    }
  }
`;
