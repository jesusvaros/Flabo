import { Tabs } from "@/app/components/TabContents/Tabs";
import { TicktetsTabSuspense } from "@/app/tickets/components/TicketsTab";
import { IngredientsTabSuspense } from "@/app/ingredients/components/IngredientsTab";
import { CollectionTabSuspense } from "@/app/collections/components/CollectionsTab";

export function TabsContent() {
  return (
    <Tabs>
      <CollectionTabSuspense />
      <TicktetsTabSuspense />
      <IngredientsTabSuspense />
    </Tabs>
  );
}
