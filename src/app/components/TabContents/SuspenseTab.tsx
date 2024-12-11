import { Suspense } from "react";
import { TabPanel } from "../Tabs/Tabs";
import { LoadingTab } from "./LoadingTab";

export const SuspenseTab = ({label,children}) => {
    return (
      <TabPanel label={label}>
        <Suspense fallback={<LoadingTab />}>
        {children}
        </Suspense>
      </TabPanel>
    );
  };