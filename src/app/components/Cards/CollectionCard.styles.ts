"use client";
import { styled } from "styled-components";

export const Card = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 16px;
  margin: 8px;
  cursor: pointer;
  transition: transform 0.2s;
  width: 280px;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
  }
`;

export const Title = styled.h3`
  margin: 0 0 8px 0;
  color: #333;
`;

export const Description = styled.p`
  color: #666;
  font-size: 14px;
  margin: 0;
`;