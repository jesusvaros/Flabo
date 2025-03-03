"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { TabButton, TabContainer, TabContent, TabList } from "./Tabs.styles";

interface TabsProps {
  children: React.ReactElement[];
}

export const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      const tabIndex = children.findIndex(
        (child) => child.props.id === tabParam
      );
      if (tabIndex !== -1) {
        setActiveTab(tabIndex);
        // Clean up the URL by removing the tab parameter
        const url = new URL(window.location.href);
        url.searchParams.delete("tab");
        window.history.replaceState({}, "", url);
      }
    }
  }, [searchParams, children]);

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
  id: string;
}> = ({ children }) => {
  return <div>{children}</div>;
};
