"use client";

import { CollectionProps } from "@/types/collections";
import { createContext, useContext } from "react";

interface CollectionContextType {
  collection: CollectionProps | null;
  refetchCollection?: () => void;
}

const CollectionContext = createContext<CollectionContextType | undefined>(undefined);

export function useCollection() {
  const context = useContext(CollectionContext);
  if (context === undefined) {
    throw new Error("useCollection must be used within a CollectionProvider");
  }
  return context;
}

interface CollectionProviderProps {
  collection: CollectionProps | null;
  refetchCollection?: () => void;
  children: React.ReactNode;
}

export function CollectionProvider({
  collection,
  refetchCollection,
  children,
}: CollectionProviderProps) {
  return (
    <CollectionContext.Provider value={{ collection, refetchCollection }}>
      {children}
    </CollectionContext.Provider>
  );
}
