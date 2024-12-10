"use client";
import { useState } from 'react';
import styled from 'styled-components';

const TabContainer = styled.div`
  width: 100%;
  margin: 20px 0;
`;

const TabList = styled.div`
  display: flex;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 16px;
  color: ${props => props.active ? '#1a73e8' : '#666'};
  border-bottom: 2px solid ${props => props.active ? '#1a73e8' : 'transparent'};
  transition: all 0.3s ease;

  &:hover {
    color: #1a73e8;
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
      <TabContent>
        {children[activeTab]}
      </TabContent>
    </TabContainer>
  );
};

export const TabPanel: React.FC<{ label: string; children: React.ReactNode }> = ({ children }) => {
  return <div>{children}</div>;
};
