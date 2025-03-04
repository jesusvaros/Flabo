"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
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

export const CreateCollectionCard = () => {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

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
      const { error } = await supabase
        .from("collections")
        .insert([{ title, creator_id: user.id }]);

      if (error) throw error;

      setTitle("");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error creating collection:", error);
    } finally {
      setIsLoading(false);
    }
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Collection</DialogTitle>
          <DialogDescription>
            Add a new collection to organize your content.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="py-4">
            <Input
              placeholder="Collection name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
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
