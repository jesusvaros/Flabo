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
  defaultValue?: string;
}

interface TabPanelProps {
  label: string;
  children: React.ReactNode;
  id: string;
}

export const Tabs: React.FC<TabsProps> = ({ children, defaultValue }) => {
  const [activeTab, setActiveTab] = useState<string>(defaultValue || "");
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      const tab = children.find((child) => 
        child?.props?.id === tabParam
      );
      if (tab) {
        setActiveTab(tab.props.id);
        // Clean up the URL by removing the tab parameter
        const params = new URLSearchParams(searchParams);
        params.delete("tab");
        router.replace("?" + params.toString());
      }
    } else if (children.length > 0 && !activeTab) {
      // Only set default tab if no active tab is set
      const firstValidChild = children.find(child => 
        child?.props?.id && child?.props?.label
      );
      if (firstValidChild) {
        setActiveTab(firstValidChild.props.id);
      }
    }
  }, [searchParams, children, activeTab, router]);

  const validChildren = children.filter(
    (child) => child?.type === TabPanel || (child?.props?.id && child?.props?.label)
  );

  if (validChildren.length === 0) {
    return null;
  }

  return (
    <TabsRoot
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full h-full"
    >
      <div className="w-full">
        <TabsList className="w-full h-14 items-center justify-start bg-transparent">
          {validChildren.map((child) => (
            <TabsTrigger
              key={child.props.id}
              value={child.props.id}
              className="flex-1 h-14 text-base font-medium data-[state=active]:bg-background data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none transition-colors"
            >
              {child.props.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {validChildren.map((child) => (
        <TabsContent
          key={child.props.id}
          value={child.props.id}
          className="mt-6 p-4 w-full"
        >
          {child}
        </TabsContent>
      ))}
    </TabsRoot>
  );
};

export const TabPanel = ({ children, label, id }: TabPanelProps) => {
  return (
    <div className="w-full space-y-4" data-id={id} data-label={label}>
      {children}
    </div>
  );
};
