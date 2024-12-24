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
  overflow-y: auto;
`;

export const HomeButton = styled.span`
  width: 100%;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary[500]};
  color: white;
  border-radius: 0.5rem;
  cursor: pointer;
  margin-bottom: 1.5rem;
  display: block;
  text-align: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary[900]};
  }
`;

export const SidebarTitle = styled.h2`
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text[900]};
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
  align-items: center;
  justify-content: space-between;
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

export const RecipesList = styled.ul<{ $isOpen: boolean }>`
  list-style: none;
  padding-left: 1.5rem;
  margin: 0;
  max-height: ${({ $isOpen }) => ($isOpen ? "500px" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
`;

export const RecipeItem = styled.li<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  margin: 0.25rem 0;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.9rem;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.primary[900] : theme.colors.text[500]};
  background-color: ${({ theme, $active }) =>
    $active ? theme.colors.primary[50] : "transparent"};

  &:hover {
    background-color: ${({ theme, $active }) =>
      $active ? theme.colors.primary[50] : theme.colors.background[200]};
  }
`;

export const CollapsibleIcon = styled.span<{ $isOpen: boolean }>`
  transform: rotate(${({ $isOpen }) => ($isOpen ? "90deg" : "0deg")});
  transition: transform 0.3s ease;
  display: inline-block;
  margin-left: 0.5rem;
`;
