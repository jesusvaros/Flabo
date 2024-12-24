'use client';
import { useState } from "react";
import { TabButton, TabContainer, TabContent, TabList } from "./Tabs.styles";

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
            $active={activeTab === index}
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
