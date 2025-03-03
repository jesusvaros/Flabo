"use client";
import styled from "styled-components";

export const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: ${({ theme }) => theme.colors.background[100]};
  border-right: 1px solid ${({ theme }) => theme.colors.border[100]};
  padding: 1rem;
  position: fixed;
  left: 0;
  top: 0;
`;

export const SidebarTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text[900]};
  margin-bottom: 1.5rem;
  font-size: 1.25rem;
`;

export const CollectionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const CollectionItem = styled.li<{ $active?: boolean }>`
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  border-radius: 0.5rem;
  display: flex;
  cursor: pointer;
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.primary[100] : "transparent"};
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary[900] : theme.colors.text[500]};

  &:hover {
    background-color: ${({ theme, $active }) =>
      $active ? theme.colors.primary[100] : theme.colors.background[500]};
  }
`;

export const HomeButton = styled.span`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-bottom: 1.5rem;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[900]};
  }
`;
