"use client";
import { useState } from "react";
import styled from "styled-components";

const TabContainer = styled.div`
  width: 100%;
  margin: 20px 0;
`;

const TabList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 15px 20px;
  border: none;
  background: ${(props) => (props.active ? props.theme.colors.background.secondary : "white")};
  cursor: pointer;
  font-size: 16px;
  color: ${(props) => (props.active ? props.theme.colors.text.primary : props.theme.colors.text.inverse)};
  transition: all 0.3s ease;
  width: 100%;
  border-radius: 16px;


  &:hover {
    opacity: ${(props) => (props.active ? "1" : " 0.6")};
  }
`;

const TabContent = styled.div`
  padding: 20px;
`;

interface TabsProps {
  children: React.ReactElement[];
}

export const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <TabContainer>
      <TabList>
        {children.map((child, index) => (
          <TabButton
            key={index}
            active={activeTab === index}
            onClick={() => setActiveTab(index)}
          >
            {child.props.label}
          </TabButton>
        ))}
      </TabList>
      <TabContent>{children[activeTab]}</TabContent>
    </TabContainer>
  );
};

export const TabPanel: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ children }) => {
  return <div>{children}</div>;
};
