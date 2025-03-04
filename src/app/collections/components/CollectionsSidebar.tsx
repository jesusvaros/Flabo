"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Home, Library } from "lucide-react";

interface Collection {
  id: string;
  name: string;
}

interface CollectionsSidebarProps {
  collections: Collection[];
  currentCollectionId?: string;
}

export const CollectionsSidebar: React.FC<CollectionsSidebarProps> = ({
  collections,
  currentCollectionId,
}) => {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar 
      collapsible="icon"
      className={cn(
        "border-r bg-background",
        "transition-[width] duration-200 ease-linear"
      )}
    >
      <div className="flex h-[52px] items-center justify-end px-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={toggleSidebar}
          className="h-6 w-6"
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    href="/" 
                    className={cn(
                      "no-underline flex items-center gap-2",
                      "transition-[width] duration-200 ease-linear"
                    )}
                  >
                    <Home className="h-4 w-4" />
                    <span className={cn(
                      "transition-opacity duration-200",
                      isCollapsed ? "opacity-0 w-0" : "opacity-100"
                    )}>
                      Home
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <Separator className="my-4" />
        <SidebarGroup>
          <SidebarGroupLabel className={cn(
            "transition-opacity duration-200",
            isCollapsed ? "opacity-0 h-0" : "opacity-100"
          )}>
            Collections
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {collections.map((collection) => (
                <SidebarMenuItem key={collection.id}>
                  <SidebarMenuButton 
                    asChild
                    isActive={collection.id === currentCollectionId}
                  >
                    <Link 
                      href={`/collections/${collection.id}`}
                      className={cn(
                        "no-underline flex items-center gap-2",
                        "transition-[width] duration-200 ease-linear"
                      )}
                      title={collection.name}
                    >
                      <Library className="h-4 w-4" />
                      <span className={cn(
                        "transition-opacity duration-200",
                        isCollapsed ? "opacity-0 w-0" : "opacity-100"
                      )}>
                        {collection.name}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};
