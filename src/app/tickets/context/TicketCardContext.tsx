import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TicketWithPositionConversion } from '@/types/collections';
import { useCollection } from '@/app/collections/context/CollectionContext';

interface TicketImage {
  id: string;
  ticket_id: string;
  image_title?: string;
  image_description?: string;
}

interface TicketCardState {
  // Text tab state
  textContent: string;

  // Link tab state
  linkUrl: string;
  linkMetadata: string;

  // Picture tab state
  images: Partial<TicketImage>[];

  // Active tab
  activeTab: 'recipe' | 'notes' | 'image' | 'link' | 'text';

  // Flag to check if any content has been modified
  isDirty: boolean;
}

interface TicketCardContextProps {
  ticket: TicketWithPositionConversion;
  state: TicketCardState;
  setActiveTab: (tab: 'recipe' | 'notes' | 'image' | 'link' | 'text') => void;
  updateTextContent: (content: string) => void;
  updateLinkUrl: (url: string) => void;
  updateLinkMetadata: (metadata: string) => void;
  addImage: (imageData: { image_title?: string; image_description?: string }) => void;
  removeImage: (index: number) => void;
  saveChanges: () => Promise<void>;
  resetState: () => void;
  onClose: () => void;
}

const TicketCardContext = createContext<TicketCardContextProps | undefined>(undefined);

export const TicketCardProvider: React.FC<{
  ticket: TicketWithPositionConversion;
  children: ReactNode;
  onClose?: () => void;
}> = ({ ticket, children, onClose }) => {
  const { patchTicket, refetchTicket } = useCollection();
  
  // Initialize state from ticket data
  const [state, setState] = useState<TicketCardState>({
    textContent: ticket.text_content || '',
    linkUrl: ticket.ticket_url?.url || '',
    linkMetadata: ticket.ticket_url?.metadata || '',
    images: ticket.ticket_images || [],
    activeTab: 'recipe',
    isDirty: false,
  });

  // Methods to update state
  const setActiveTab = (tab: 'recipe' | 'notes' | 'image' | 'link' | 'text') => {
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  const updateTextContent = (content: string) => {
    setState(prev => ({ ...prev, textContent: content, isDirty: true }));
  };

  const updateLinkUrl = (url: string) => {
    setState(prev => ({ ...prev, linkUrl: url, isDirty: true }));
  };

  const updateLinkMetadata = (metadata: string) => {
    setState(prev => ({ ...prev, linkMetadata: metadata, isDirty: true }));
  };

  const addImage = (imageData: { image_title?: string; image_description?: string }) => {
    setState(prev => ({
      ...prev,
      images: [...prev.images, imageData],
      isDirty: true,
    }));
  };

  const removeImage = (index: number) => {
    setState(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return {
        ...prev,
        images: newImages,
        isDirty: true
      };
    });
  };

  // Save changes to backend
  const saveChanges = async () => {
    if (!state.isDirty) return;

    const updates: Partial<TicketWithPositionConversion> = {};

    // Update text content if changed
    if (state.textContent !== ticket.text_content) {
      console.log('Saving text content:', state.textContent);
      updates.text_content = state.textContent;
    }

    // Update URL if changed
    const urlChanged = state.linkUrl !== ticket.ticket_url?.url ||
      state.linkMetadata !== ticket.ticket_url?.metadata;

    if (urlChanged) {
      updates.ticket_url = state.linkUrl ? {
        id: ticket.ticket_url?.id || '',
        ticket_id: ticket.id,
        url: state.linkUrl,
        metadata: state.linkMetadata
      } : null;
    }

    // Update images if changed
    const imagesChanged = JSON.stringify(state.images) !== JSON.stringify(ticket.ticket_images);
    if (imagesChanged) {
      // Make sure all images have the ticket_id and convert to the expected format
      updates.ticket_images = state.images.map(img => ({
        id: img.id || '',
        ticket_id: ticket.id,
        image_title: img.image_title || '',
        image_description: img.image_description || ''
      }));
    }

    // Only patch if there are changes
    if (Object.keys(updates).length > 0) {
      console.log('Sending updates to patchTicket:', updates);
      try {
        const updatedTicket = await patchTicket(ticket.id, updates);
        if (updatedTicket) {
          console.log('Ticket updates saved successfully:', updatedTicket);

          // Refresh ticket data to make sure we have the latest from the server
          const refreshedTicket = await refetchTicket(ticket.id);
          if (refreshedTicket) {
            // Update images array with server data to ensure IDs are correct
            setState(prev => ({
              ...prev,
              isDirty: false,
              images: refreshedTicket.ticket_images || prev.images
            }));
            return;
          }
        }
      } catch (error) {
        console.error('Exception in saveChanges:', error);
      }
    }

    setState(prev => ({ ...prev, isDirty: false }));
  };

  // Handle close - save changes first, then close
  const handleClose = async () => {
    if (state.isDirty) {
      await saveChanges();
    }
    
    // Call the parent's onClose callback if provided
    if (onClose) {
      onClose();
    }
  };

  // Reset state
  const resetState = () => {
    setState({
      textContent: ticket.text_content || '',
      linkUrl: ticket.ticket_url?.url || '',
      linkMetadata: ticket.ticket_url?.metadata || '',
      images: ticket.ticket_images || [],
      activeTab: 'recipe',
      isDirty: false,
    });
  };

  const contextValue: TicketCardContextProps = {
    ticket,
    state,
    setActiveTab,
    updateTextContent,
    updateLinkUrl,
    updateLinkMetadata,
    addImage,
    removeImage,
    saveChanges,
    resetState,
    onClose: handleClose
  };

  return (
    <TicketCardContext.Provider value={contextValue}>
      {children}
    </TicketCardContext.Provider>
  );
};

// Custom hook to use the TicketCard context
export const useTicketCard = () => {
  const context = useContext(TicketCardContext);

  if (!context) {
    throw new Error('useTicketCard must be used within a TicketCardProvider');
  }

  return context;
};
