"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

export const CreateCollectionCard = () => {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase
        .from("collections")
        .insert([{ title, creator_id: user.id }]);

      if (error) throw error;

      setTitle("");
      router.refresh();
    } catch (error) {
      console.error("Error creating collection:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Create Collection
        </CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <Input
            placeholder="Collection name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full"
          />
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            disabled={isLoading || !title.trim()}
            className="w-full"
          >
            {isLoading ? "Creating..." : "Create"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};
