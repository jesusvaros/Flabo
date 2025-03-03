"use client";

import { useState } from "react";
import { Modal } from "../Modal";
import { createClient } from "../../../../utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  CreateCard,
  Form,
  FormSection,
  Input,
  Label,
  ButtonGroup,
} from "./CreateCollectionCard.styles";

export const CreateCollectionCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
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
      console.error(error);
      return;
    }

    setTitle("");
    setIsModalOpen(false);
    router.refresh(); // This will trigger a server-side rerender
  };

  return (
    <>
      <CreateCard onClick={() => setIsModalOpen(true)}>+</CreateCard>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Collection"
      >
        <Form onSubmit={handleSubmit}>
          <FormSection>
            <Label htmlFor="title">Collection Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter collection title..."
              required
            />
          </FormSection>
          <ButtonGroup>
            <Button type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Create Collection</Button>
          </ButtonGroup>
        </Form>
      </Modal>
    </>
  );
};
