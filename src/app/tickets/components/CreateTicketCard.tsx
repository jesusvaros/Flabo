"use client";

import { useState } from "react";
import { createClient } from "../../../../utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const CreateTicketCard = () => {
  const [content, setContent] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) return;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("tickets").insert([
      {
        content: content.trim(),
        creator_id: user.id,
      },
    ]);

    if (error) {
      console.error("Error creating ticket:", error);
      return;
    }

    setContent("");
    setOpen(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="bg-white rounded-lg shadow-sm p-4 m-2 cursor-pointer transition-all duration-200 w-[280px] select-none outline-none flex items-center justify-center text-5xl text-text-500 hover:text-primary-500 hover:scale-102 hover:shadow-md">
          +
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
          <div className="flex flex-col gap-2">
            <label 
              htmlFor="content" 
              className="text-sm font-medium text-text-500"
            >
              Ticket Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your ticket..."
              required
              className="w-full min-h-[150px] px-4 py-4 text-base rounded-lg border border-input bg-background text-text-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 placeholder:text-text-500 resize-vertical leading-relaxed"
            />
          </div>
          <div className="flex justify-end gap-3 select-none">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
