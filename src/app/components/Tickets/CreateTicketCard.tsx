"use client";

import { useState } from "react";
import { Modal } from "../Modal";
import { createClient } from "../../../../utils/supabase/client";
import { useRouter } from "next/navigation";
import { ButtonGroup, CancelButton, CreateCard, Form, FormSection, Label, SaveButton, TextArea } from "./CreateTiccketCard.styles";



export const CreateTicketCard = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [content, setContent] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("tickets").insert([
      {
        content: content.trim(),
        creator_id: user.id,
      },
    ]);

    setContent("");
    setIsModalOpen(false);
    router.refresh(); // This will trigger a server-side rerender
  };

  return (
    <>
      <CreateCard onClick={() => setIsModalOpen(true)}>
        +
      </CreateCard>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Ticket"
      >
        <Form onSubmit={handleSubmit}>
          <FormSection>
            <Label htmlFor="content">Ticket Content</Label>
            <TextArea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Describe your ticket..."
              required
            />
          </FormSection>
          <ButtonGroup>
            <CancelButton type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </CancelButton>
            <SaveButton type="submit">
              Save
            </SaveButton>
          </ButtonGroup>
        </Form>
      </Modal>
    </>
  );
};
