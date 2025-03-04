"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { createClient } from "../../../../utils/supabase/client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { FilterableList } from "@/components/ui/filterable-list";
import { Ticket } from "@/types/collections";
import { Plus } from "lucide-react";

export const CreateCollectionCard = () => {
  const [title, setTitle] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTickets = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tickets")
        .select("id, content, created_at")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tickets:", error);
        return;
      }

      setTickets(data || []);
    };

    fetchTickets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setIsLoading(true);

    try {
      // Insert the collection
      const { data: collectionData, error: collectionError } = await supabase
        .from("collections")
        .insert({ title, user_id: user.id })
        .select()
        .single();

      if (collectionError) throw collectionError;

      // Insert the collection-ticket relationships
      if (selectedTickets.length > 0) {
        const relationshipsToInsert = selectedTickets.map((ticketId) => ({
          collection_id: collectionData.id,
          ticket_id: ticketId,
        }));

        const { error: relationshipError } = await supabase
          .from("collection_tickets")
          .insert(relationshipsToInsert);

        if (relationshipError) throw relationshipError;
      }

      // Reset form
      setTitle("");
      setSelectedTickets([]);
    } catch (error) {
      console.error("Error creating collection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTicketToggle = (ticketId: string) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Card className="hover:-translate-y-1 transition-transform duration-200 cursor-pointer w-full m-2">
          <CardHeader className="flex flex-row items-center justify-center w-full a">
            <Plus className="h-6 w-6" />
            <span className="ml-2">Create Collection</span>
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a new collection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                id="title"
                placeholder="Collection title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <FilterableList
              items={tickets}
              selectedItems={selectedTickets}
              onItemToggle={handleTicketToggle}
              maxHeight="200px"
            />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="w-full button-primary"
            >
              {isLoading ? "Creating..." : "Create Collection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
