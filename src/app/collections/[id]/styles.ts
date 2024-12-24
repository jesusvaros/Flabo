'use client';
import { styled } from "styled-components";

export const Container = styled.div`
  display: flex;
  min-height: 100vh;
`;

export const MainContent = styled.main`
  flex: 1;
  margin-left: 250px;
  padding: 2rem;
`;

export const Header = styled.header`
  margin-bottom: 2rem;
`;

export const Title = styled.h1`
  color: ${({theme}) => theme.colors.text[900] };
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

export const Description = styled.p`
  color: ${({theme}) => theme.colors.text[500] };
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;