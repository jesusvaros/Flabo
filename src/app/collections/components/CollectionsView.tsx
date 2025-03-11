"use client";

import { useState, useEffect } from "react";
import { CollectionsSidebar } from "./CollectionsSidebar";
import { CreateCollectionCard } from "./CreateCollectionCard";
import { CollectionViewProps, TicketWithPosition } from "@/types/collections";
import { Button } from "@/components/ui/button";
import { SortableTicketsBoard } from "./draganddrop/SortableTicketsBoard";
import { useTicketPositions } from "./draganddrop/utils/useTicketPositions";
import { Badge } from "@/components/ui/badge";
import { Loader2, Menu, Home, Library } from "lucide-react";
import { AddTicketDrawer } from "./AddTicketDrawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { TabsDrawer } from "./TabsDrawer";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export const CollectionsView = ({
  collections,
  selectedCollection,
  tabsContent,
}: CollectionViewProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [localTickets, setLocalTickets] = useState<TicketWithPosition[]>(
    [...(selectedCollection?.tickets || [])].sort(
      (a, b) => (a.position) - (b.position)
    )
  );
  const isMobile = useIsMobile();

  const { updatePositions, isUpdating, hasPendingChanges } = useTicketPositions(
    {
      collectionId: selectedCollection?.id || "",
      tickets: localTickets,
    }
  );

  const handleReorder = async (tickets: TicketWithPosition[]) => {
    try {
      setLocalTickets(tickets);
      updatePositions(tickets);
    } catch (error) {
      console.log(error);
    }
  };

  // Common content for both mobile and desktop views
  const renderMainContent = () => (
    <div className="flex-1 p-4 overflow-hidden">
      <div className="flex justify-end mb-4">
        {tabsContent && (
          <TabsDrawer>
            {tabsContent}
          </TabsDrawer>
        )}
      </div>
      {selectedCollection ? (
        <div className="h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                {selectedCollection.title}
              </h1>
              {isUpdating && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Button onClick={() => setIsDrawerOpen(true)}>
                Add Tickets
              </Button>
            </div>
          </div>
          <SortableTicketsBoard
            tickets={localTickets}
            onReorder={handleReorder}
          />
          <AddTicketDrawer 
            isOpen={isDrawerOpen}
            onOpenChange={setIsDrawerOpen}
            collectionId={selectedCollection.id}
            onTicketsAdded={() => {
              // Refresh the collection's tickets
              window.location.reload();
            }}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8 md:mt-0">
          <CreateCollectionCard />
        </div>
      )}
    </div>
  );

  // Mobile sidebar content
  const MobileSidebarContent = () => (
    <div className="flex flex-col h-full py-6">
      <SheetClose asChild>
        <Link 
          href="/" 
          className="flex items-center gap-2 px-4 py-2 hover:bg-accent"
        >
          <Home className="h-5 w-5" />
          <span>Home</span>
        </Link>
      </SheetClose>
      
      <Separator className="my-4" />
      
      <h3 className="px-4 text-sm font-medium text-muted-foreground mb-2">
        Collections
      </h3>
      
      <div className="flex flex-col space-y-1">
        {collections.map((collection) => (
          <SheetClose key={collection.id} asChild>
            <Link 
              href={`/collections/${collection.id}`}
              className={cn(
                "flex items-center gap-2 px-4 py-2 hover:bg-accent",
                collection.id === selectedCollection?.id ? "bg-accent/50 font-medium" : ""
              )}
            >
              <Library className="h-4 w-4" />
              <span>{collection.title}</span>
            </Link>
          </SheetClose>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-screen">
      {isMobile ? (
        <div className="h-screen">
          {/* Mobile View with Sheet for sidebar */}
          <Sheet open={showMobileSidebar} onOpenChange={setShowMobileSidebar}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="fixed top-4 left-4 z-50"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px]">
              <MobileSidebarContent />
            </SheetContent>
          </Sheet>
          
          {/* Main Content */}
          {renderMainContent()}
        </div>
      ) : (
        <div className="flex h-screen">
          <CollectionsSidebar
            collections={collections}
            currentCollectionId={selectedCollection?.id}
          />
          {renderMainContent()}
        </div>
      )}
    </div>
  );
}
