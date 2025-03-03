"use client";

import { useRouter } from "next/navigation";
import styled from "styled-components";

const BackLink = styled.button`
  display: inline-block;
  margin-bottom: 24px;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  
  &:hover {
    color: #000;
  }
`;

export const BackButton = () => {
  const router = useRouter();
  
  return (
    <BackLink onClick={() => router.back()}>
      ← Back
    </BackLink>
  );
};
