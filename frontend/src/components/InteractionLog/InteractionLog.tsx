import React, { useState, useEffect } from 'react';
import InteractionList from './InteractionList/InteractionList';
import InteractionDetail from './InteractionDetail/InteractionDetail';
import AddInteractionPopup from './AddInteractionPopup/AddInteractionPopup';
import type Interaction from '../../types/interaction';
import { LuSquarePlus } from "react-icons/lu";
import './styles.css';

interface InteractionLogProps {
  interactions: Interaction[];
}

const InteractionLog: React.FC<InteractionLogProps> = ({ interactions: propInteractions }) => {
  const [interactions, setInteractions] = useState<Interaction[]>(propInteractions);
  const [selectedInteraction, setSelectedInteraction] = useState<Interaction | null>(
    propInteractions.length > 0 ? propInteractions[0] : null
  );
  const [activePage, setActivePage] = useState(0);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);

  useEffect(() => {
    setInteractions(propInteractions);
  }, [propInteractions]);
  
  useEffect(() => {
    if (propInteractions.length > 0 && !selectedInteraction) {
      setSelectedInteraction(propInteractions[0]);
    }
  }, [propInteractions, selectedInteraction]);

  const interactionsPerPage = 4;
  const totalPages = Math.ceil(interactions.length / interactionsPerPage);
  
  const displayedInteractions = interactions.slice(
    activePage * interactionsPerPage, 
    (activePage + 1) * interactionsPerPage
  );

  const handleDeleteInteraction = (interactionToDelete: Interaction) => {
    const updatedInteractions = interactions.filter(
      interaction => interaction.id !== interactionToDelete.id
    );
    setInteractions(updatedInteractions);
    setSelectedInteraction(updatedInteractions[0]);
  } 

  const handleAddInteraction = (newInteraction: Interaction) => {
    if (newInteraction.id) {
      setInteractions([newInteraction, ...interactions]);
      setSelectedInteraction(newInteraction);
      setActivePage(0);
    } else {
      console.error("Received interaction without an ID", newInteraction);
    }
  };

  return (
    <div className="interaction-log-container">
      <div className="interaction-log-panel">
        <div className="interaction-log-header">
          <h2 className="interaction-log-title">Interaction Log</h2>
          <button onClick={() => setIsAddPopupOpen(true)} className="interaction-log-add-button">
          <LuSquarePlus size={20}/>
          </button>
        </div>
        
        <InteractionList 
          interactions={displayedInteractions}
          selectedInteraction={selectedInteraction}
          onSelectInteraction={setSelectedInteraction}
        />
        
      {/* Pagination */}
        <div className="interaction-log-pagination">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              className={`pagination-dot ${activePage === index ? 'active' : ''}`}
              onClick={() => setActivePage(index)}
              aria-label={`Page ${index + 1}`}
            />
          ))}
        </div>
      </div>
      
      {/* Interaction Details Panel */}
      <div className="interaction-detail-panel">
        {selectedInteraction && (
          <InteractionDetail interaction={selectedInteraction} onDelete={handleDeleteInteraction}/>
        )}
      </div>

      {isAddPopupOpen && (
        <AddInteractionPopup 
          isOpen={true}
          onClose={() => setIsAddPopupOpen(false)}
          onAdd={handleAddInteraction}
        />
      )}
    </div>
  );
};

export default InteractionLog;