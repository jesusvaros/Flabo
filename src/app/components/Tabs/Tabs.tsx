"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Tabs as TabsRoot,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

interface TabsProps {
  children: React.ReactElement[];
}

export const Tabs: React.FC<TabsProps> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      const tab = children.find((child) => child.props.id === tabParam);
      if (tab) {
        setActiveTab(tab.props.id);
        // Clean up the URL by removing the tab parameter
        const url = new URL(window.location.href);
        url.searchParams.delete("tab");
        window.history.replaceState({}, "", url);
      }
    } else if (children.length > 0) {
      // Set the first tab as default
      setActiveTab(children[0].props.id);
    }
  }, [searchParams, children]);

  return (
    <TabsRoot
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full space-y-6"
    >
      <TabsList className="h-10 items-center justify-start w-full bg-muted/50 p-1 text-muted-foreground">
        {children.map((child) => (
          <TabsTrigger
            key={child.props.id}
            value={child.props.id}
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            {child.props.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {children.map((child) => (
        <TabsContent
          key={child.props.id}
          value={child.props.id}
          className="mt-6 border rounded-lg p-4"
        >
          {child}
        </TabsContent>
      ))}
    </TabsRoot>
  );
};

export const TabPanel: React.FC<{
  label: string;
  children: React.ReactNode;
  id: string;
}> = ({ children }) => {
  return <div className="space-y-4">{children}</div>;
};
