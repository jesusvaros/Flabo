"use client";

import { useState, useRef } from "react";
import AuthForm from "../../login/authForm";
import { Modal } from "../../components/Modal";
import { useTheme } from "../../styles/theme/ThemeProvider";
import { HeaderContainer, HeaderContent, Logo, LoginButton } from "./styles";

export const Header = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { theme } = useTheme();

  return (
    <HeaderContainer
      style={{ backgroundColor: theme.colors.background.primary }}
    >
      <HeaderContent>
        <Logo style={{ color: theme.colors.text.primary }}>Flabo</Logo>

        <LoginButton
          ref={buttonRef}
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: theme.colors.background.secondary,
            color: theme.colors.text.primary,
            border: `1px solid ${theme.colors.border.primary}`,
          }}
        >
          Log in / Sign up
        </LoginButton>
      </HeaderContent>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Welcome to Flabo"
        triggerRef={buttonRef}
      >
        <AuthForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </HeaderContainer>
  );
};
