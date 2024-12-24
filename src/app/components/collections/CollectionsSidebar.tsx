"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  SidebarContainer,
  SidebarTitle,
  CollectionsList,
  CollectionItem,
  HomeButton,
  RecipesList,
  RecipeItem,
  CollapsibleIcon,
} from "./CollectionsSidebar.styled";

export interface Ticket {
  id: string;
  content: string;
}

export interface Collection {
  id: string;
  title: string;
  tickets: Ticket[];
}

interface CollectionsSidebarProps {
  collections: Collection[];
  currentCollectionId?: string;
  currentTicketId?: string;
}

export const CollectionsSidebar: React.FC<CollectionsSidebarProps> = ({
  collections,
  currentCollectionId,
  currentTicketId,
}) => {
  const [openCollections, setOpenCollections] = useState<
    Record<string, boolean>
  >({
    [currentCollectionId || ""]: true,
  });

  const toggleCollection = (collectionId: string) => {
    setOpenCollections((prev) => ({
      ...prev,
      [collectionId]: !prev[collectionId],
    }));
  };

  return (
    <SidebarContainer>
      <Link href="/" style={{ textDecoration: "none" }}>
        <HomeButton>Back to Home</HomeButton>
      </Link>
      <SidebarTitle>Collections</SidebarTitle>
      <CollectionsList>
        {collections.map((collection) => (
          <React.Fragment key={collection.id}>
            <CollectionItem
              $active={collection.id === currentCollectionId}
              onClick={() => toggleCollection(collection.id)}
            >
              {collection.title}
              <CollapsibleIcon $isOpen={openCollections[collection.id]}>
                ›
              </CollapsibleIcon>
            </CollectionItem>
            <RecipesList $isOpen={openCollections[collection.id]}>
              {collection.tickets?.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={`/collections/${collection.id}/recipes/${ticket.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <RecipeItem $active={ticket.id === currentTicketId}>
                    {ticket.content}
                  </RecipeItem>
                </Link>
              ))}
            </RecipesList>
          </React.Fragment>
        ))}
      </CollectionsList>
    </SidebarContainer>
  );
};
