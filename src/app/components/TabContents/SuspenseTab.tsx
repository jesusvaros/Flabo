import { Suspense } from "react";
import { TabPanel } from "../Tabs/Tabs";
import { LoadingTab } from "./LoadingTab";

interface SuspenseTabProps {
  label: string;
  id: string;
  children: React.ReactNode;
}

export const SuspenseTab = ({ label, id, children }: SuspenseTabProps) => {
  return (
    <TabPanel label={label} id={id}>
      <Suspense fallback={<LoadingTab />}>
        {children}
      </Suspense>
    </TabPanel>
  );
};