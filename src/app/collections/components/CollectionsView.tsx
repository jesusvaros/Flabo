"use client";

import { useState, useEffect } from "react";
import { CollectionsSidebar } from "./CollectionsSidebar";
import { CollectionViewProps, TicketWithPositionConversion } from "@/types/collections";
import { Button } from "@/components/ui/button";
import { SortableTicketsBoard } from "./draganddrop/SortableTicketsBoard";
import { useTicketPositions } from "./draganddrop/utils/useTicketPositions";
import { Badge } from "@/components/ui/badge";
import { Loader2, Menu, Home, Library, Filter } from "lucide-react";
import { AddTicketDrawer } from "./AddTicketDrawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { TabsDrawer } from "./TabsDrawer";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { useCollection } from "../context/CollectionContext";
import { AITicketFilter } from "@/app/components/AITicketFilter";
import { HeaderLoggedIn } from "@/app/components/Header";

export const CollectionsView = ({
  collections,
  tabsContent,
  tickets: initialTickets = [],
  userEmail,
}: CollectionViewProps & { tickets?: TicketWithPositionConversion[], userEmail: string }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [filteredTicketIds, setFilteredTicketIds] = useState<string[]>([]);
  const isMobile = useIsMobile();
  const { collection: selectedCollection, tickets, updateTickets } = useCollection();

  useEffect(() => {
    if (initialTickets.length > 0) {
      updateTickets(initialTickets);
    }
  }, [initialTickets, updateTickets]);

  const { tickets: localTickets, updatePositions, isUpdating } = useTicketPositions(
    {
      collectionId: selectedCollection?.id || "",
      tickets: selectedCollection?.tickets || [],
    }
  );

  const handleReorder = async (tickets: TicketWithPositionConversion[]) => {
    try {
      updatePositions(tickets);
    } catch (error) {
      console.log(error);
    }
  };
  const ticketsToUse = selectedCollection ? localTickets : tickets;

  const displayedTickets = filteredTicketIds.length > 0
    ? filteredTicketIds.map(id => ticketsToUse.find(ticket => ticket.id === id))
      .filter(Boolean) as TicketWithPositionConversion[]
    : ticketsToUse;

  const isFiltered = filteredTicketIds.length > 0;

  const renderMainContent = () => (
    <div className="flex-1 p-4 overflow-hidden flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {selectedCollection ? selectedCollection.title : "All Tickets"}
          {isUpdating && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving
            </Badge>
          )}
          {isFiltered && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <Filter className="h-3 w-3 mr-1" />
              Filtered: {displayedTickets.length} of {selectedCollection ? localTickets.length : tickets.length}
            </Badge>
          )}
        </h1>
        
        {selectedCollection && tabsContent && (
          <TabsDrawer>{tabsContent}</TabsDrawer>
        )}
      </div>

      <AITicketFilter
        onFilterResults={setFilteredTicketIds}
        tickets={selectedCollection ? localTickets : tickets}
      />
      {selectedCollection && (
        <Button onClick={() => setIsDrawerOpen(true)} className="bg-accent hover:bg-accent/80 mb-4">
          Add Tickets
        </Button>
      )}

      {displayedTickets.length > 0 || (!isFiltered && selectedCollection) ? (
        <SortableTicketsBoard
          tickets={isFiltered ? displayedTickets : (selectedCollection ? localTickets : displayedTickets)}
          onReorder={!isFiltered && selectedCollection ? handleReorder : undefined}
          disabled={isFiltered || !selectedCollection}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          {isFiltered ?
            "No tickets match your filter criteria" :
            "You don't have any tickets yet"}
        </div>
      )}

      {selectedCollection && (
        <AddTicketDrawer
          isOpen={isDrawerOpen}
          onOpenChange={setIsDrawerOpen}
          collectionId={selectedCollection.id}
          onTicketsAdded={() => {
            window.location.reload();
          }}
        />
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
              href={`/${collection.id}`}
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

  // Botón de menú para móviles integrado en el encabezado
  const MobileMenuButton = (
    <Sheet open={showMobileSidebar} onOpenChange={setShowMobileSidebar}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[280px]">
        <SheetHeader className="px-4 pt-4">
          <SheetTitle>Collections</SheetTitle>
        </SheetHeader>
        <MobileSidebarContent />
      </SheetContent>
    </Sheet>
  );

  return (
    <>
      {isMobile ? (
        <div className="flex flex-col h-full">
          <HeaderLoggedIn 
            userEmail={userEmail} 
            leftElement={MobileMenuButton} 
          />
          <div className="flex-1 overflow-hidden pt-16">
            {renderMainContent()}
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <HeaderLoggedIn userEmail={userEmail} />
          <div className="flex w-full pt-16">
            <CollectionsSidebar
              collections={collections}
              currentCollectionId={selectedCollection?.id}
            />
            {renderMainContent()}
          </div>
        </div>
      )}
    </>
  );
}
