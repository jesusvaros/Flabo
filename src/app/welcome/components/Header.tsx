'use client';

import { useState, useRef } from 'react';
import AuthForm from "../../login/authForm";
import { Modal } from '../../components/Modal';

export const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo">Flabo</div>
        <div className="auth-buttons">
          <button 
            ref={buttonRef}
            className="login-button"
            onClick={() => setIsModalOpen(true)}
          >
            Log in / Sign up
          </button>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Welcome to Flabo"
        triggerRef={buttonRef}
      >
        <AuthForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>

      <style jsx>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(10px);
          z-index: 100;
          padding: 1rem;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo {
          font-size: 1.5rem;
          font-weight: bold;
          color: #4a5568;
        }

        .login-button {
          background-color: #3b82f6;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background-color 0.2s;
        }

        .login-button:hover {
          background-color: #2563eb;
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: row;
            gap: 1rem;
          }
        }
      `}</style>
    </header>
  );
};
