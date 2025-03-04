"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createClient } from "../../../../utils/supabase/client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Ticket } from "@/types/collections";

export const CreateCollectionCard = () => {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("tickets")
        .select("id, content")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tickets:", error);
        return;
      }

      setTickets(data || []);
    };

    if (isOpen) {
      fetchTickets();
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

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
        .insert([{ title, creator_id: user.id }])
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
          .from("collections_tickets")
          .insert(relationshipsToInsert);

        if (relationshipError) throw relationshipError;
      }

      setTitle("");
      setSelectedTickets([]);
      setIsOpen(false);
      router.refresh();
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
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Card className="hover:-translate-y-1 transition-transform duration-200 cursor-pointer w-full m-2 select-none">
          <CardHeader className="flex flex-row items-center justify-center">
            <Plus className="h-6 w-6" />
            <span className="ml-2">Create Collection</span>
          </CardHeader>
        </Card>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription>
            Add a new collection and select tickets to include.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Input
                placeholder="Collection name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <label className="text-sm font-medium">Select Tickets</label>
              <ScrollArea className="h-[200px] w-full rounded-md border p-4">
                <div className="grid gap-2">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={ticket.id}
                        checked={selectedTickets.includes(ticket.id)}
                        onCheckedChange={() => handleTicketToggle(ticket.id)}
                      />
                      <label
                        htmlFor={ticket.id}
                        className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {ticket.content}
                      </label>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading || !title.trim()}
              className="w-full"
            >
              {isLoading ? "Creating..." : "Create Collection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
