import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { TicketWithPositionConversion } from '@/types/collections';
import { useCollection } from '@/app/collections/context/CollectionContext';

interface TicketCardState {
  // Text tab state
  textContent: string;
  
  // Link tab state
  linkUrl: string;
  linkDescription: string;
  
  // Picture tab state
  pictures: string[];
  
  // Drawing tab state (already handled by ref)
  
  // Active tab
  activeTab: 'recipe' | 'drawing' | 'image' | 'link' | 'text';
  
  // Flag to check if any content has been modified
  isDirty: boolean;
}

interface TicketCardContextProps {
  ticket: TicketWithPositionConversion;
  state: TicketCardState;
  setActiveTab: (tab: 'recipe' | 'drawing' | 'image' | 'link' | 'text') => void;
  updateTextContent: (content: string) => void;
  updateLinkUrl: (url: string) => void;
  updateLinkDescription: (description: string) => void;
  addPicture: (pictureUrl: string) => void;
  removePicture: (pictureUrl: string) => void;
  saveChanges: () => Promise<void>;
  resetState: () => void;
}

const TicketCardContext = createContext<TicketCardContextProps | undefined>(undefined);

export const TicketCardProvider: React.FC<{
  ticket: TicketWithPositionConversion;
  children: ReactNode;
}> = ({ ticket, children }) => {
  const { patchTicket } = useCollection();
  
  // Initialize state from ticket data
  const [state, setState] = useState<TicketCardState>({
    textContent: ticket.text_content || '',
    linkUrl: ticket.link_url || '',
    linkDescription: ticket.link_description || '',
    pictures: ticket.pictures || [],
    activeTab: 'recipe',
    isDirty: false,
  });
  
  // Methods to update state
  const setActiveTab = (tab: 'recipe' | 'drawing' | 'image' | 'link' | 'text') => {
    setState(prev => ({ ...prev, activeTab: tab }));
  };
  
  const updateTextContent = (content: string) => {
    setState(prev => ({ ...prev, textContent: content, isDirty: true }));
  };
  
  const updateLinkUrl = (url: string) => {
    setState(prev => ({ ...prev, linkUrl: url, isDirty: true }));
  };
  
  const updateLinkDescription = (description: string) => {
    setState(prev => ({ ...prev, linkDescription: description, isDirty: true }));
  };
  
  const addPicture = (pictureUrl: string) => {
    setState(prev => ({ 
      ...prev, 
      pictures: [...prev.pictures, pictureUrl], 
      isDirty: true 
    }));
  };
  
  const removePicture = (pictureUrl: string) => {
    setState(prev => ({ 
      ...prev, 
      pictures: prev.pictures.filter(p => p !== pictureUrl),
      isDirty: true 
    }));
  };
  
  // Save changes to backend
  const saveChanges = async () => {
    if (!state.isDirty) return;
    
    const updates: Record<string, any> = {};
    
    // Only include changed fields
    if (state.textContent !== ticket.text_content) {
      updates.text_content = state.textContent;
    }
    
    if (state.linkUrl !== ticket.link_url) {
      updates.link_url = state.linkUrl;
    }
    
    if (state.linkDescription !== ticket.link_description) {
      updates.link_description = state.linkDescription;
    }
    
    if (JSON.stringify(state.pictures) !== JSON.stringify(ticket.pictures)) {
      updates.pictures = state.pictures;
    }
    
    // Only patch if there are changes
    if (Object.keys(updates).length > 0) {
      await patchTicket(ticket.id, updates);
      console.log('Ticket updates saved:', updates);
    }
    
    setState(prev => ({ ...prev, isDirty: false }));
  };
  
  // Reset state
  const resetState = () => {
    setState({
      textContent: ticket.text_content || '',
      linkUrl: ticket.link_url || '',
      linkDescription: ticket.link_description || '',
      pictures: ticket.pictures || [],
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
    updateLinkDescription,
    addPicture,
    removePicture,
    saveChanges,
    resetState,
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
