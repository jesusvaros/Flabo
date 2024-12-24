"use client";
import styled from "styled-components";

export const RecipeContainer = styled.div`
  margin-left: 250px; // Match sidebar width
  padding: 2rem;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
`;

export const IngredientsCard = styled.div`
  background: ${({ theme }) => theme.colors.background[50]};
  border-radius: 1rem;
  padding: 1.5rem;
  height: fit-content;
  position: sticky;
  top: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.border[100]};
`;

export const IngredientsTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text[900]};
  margin-bottom: 1rem;
  font-size: 1.25rem;
`;

export const IngredientsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const IngredientItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border[100]};
  color: ${({ theme }) => theme.colors.text[700]};
  
  &:last-child {
    border-bottom: none;
  }
`;

export const InstructionsContainer = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 2rem;
  border: 1px solid ${({ theme }) => theme.colors.border[100]};
`;

export const RecipeTitle = styled.h1`
  color: ${({ theme }) => theme.colors.text[900]};
  margin-bottom: 2rem;
  font-size: 2rem;
`;

export const InstructionsTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text[900]};
  margin-bottom: 1rem;
  font-size: 1.25rem;
`;

export const InstructionsList = styled.ol`
  padding-left: 1.5rem;
  margin: 0;
  color: ${({ theme }) => theme.colors.text[700]};

  li {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
`;

export const Amount = styled.span`
  color: ${({ theme }) => theme.colors.text[500]};
  font-size: 0.9rem;
`;
