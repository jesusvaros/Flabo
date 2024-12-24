"use client";
import styled from "styled-components";

export const TabContainer = styled.div`
  width: 100%;
  margin: 20px 0;
`;

export const TabList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  padding: 15px 20px;
  border: none;
  background: ${(props) =>
    props.$active ? props.theme.colors.background.secondary : "white"};
  cursor: pointer;
  font-size: 16px;
  color: ${(props) =>
    props.$active
      ? props.theme.colors.text.primary
      : props.theme.colors.text.inverse};
  transition: all 0.3s ease;
  width: 100%;
  border-radius: 16px;

  &:hover {
    opacity: ${(props) => (props.$active ? "1" : " 0.6")};
  }
`;

export const TabContent = styled.div`
  padding: 20px;
`;
