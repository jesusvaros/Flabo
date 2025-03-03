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

export const CreateCollectionCard = () => {
  const [title, setTitle] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) return;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("collections").insert([
      {
        title: title.trim(),
        creator_id: user.id,
      },
    ]);

    if (error) {
      console.error("Error creating collection:", error);
      return;
    }

    setOpen(false);
    setTitle("");
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div 
          className="bg-white rounded-lg shadow-sm p-4 m-2 cursor-pointer transition-all duration-200 w-[280px] select-none outline-none flex items-center justify-center text-5xl text-text-500 hover:text-primary-500 hover:-translate-y-1 hover:shadow-md"
        >
          +
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
          <div className="flex flex-col gap-2">
            <label 
              htmlFor="title" 
              className="text-sm font-medium text-text-500"
            >
              Collection Title
            </label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter collection title..."
              required
              className="w-full px-4 py-4 text-base rounded-lg border border-input bg-background text-text-900 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 placeholder:text-text-500"
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
            <Button type="submit">Create Collection</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
