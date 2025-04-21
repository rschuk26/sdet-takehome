import React from 'react';
import type Interaction from '../../../types/interaction';
import { FaRegTrashAlt } from "react-icons/fa";
import './styles.css';

interface InteractionDetailProps {
  interaction: Interaction;
  onDelete: (interaction : Interaction) => void;
}

const InteractionDetail: React.FC<InteractionDetailProps> = ({ interaction, onDelete }) => {

  const handleDelete = async (interaction : Interaction) => {
    try {
      const response = await fetch(`http://localhost:3000/api/interaction/${interaction.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      await response.json();
      onDelete(interaction);
  
    } catch (err) {
      console.error('Failed to save interaction:', err);
    } 
  }

  return (
    <div className="interaction-detail">
      {/* Delete Button */}
      <button 
        onClick={() => handleDelete(interaction)}
        className="delete-button"
        aria-label="Delete interaction"
        style={{
          position: 'absolute', 
          top: '0px', 
          right: '0px', 
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#666',
          transition: 'color 0.2s'
        }}
      >
        <FaRegTrashAlt size={17} />
      </button>
      
      <div className="detail-row">
        <span className="detail-label">Timestamp</span>
        <span className="detail-value">{interaction.timestamp}</span>
      </div>
      
      <div className="detail-row">
        <span className="detail-label">Source</span>
        <span className="detail-value">{interaction.source} ({interaction.sourceCompany})</span>
      </div>
      
      <div className="detail-row">
        <span className="detail-label">Target</span>
        <span className="detail-value">{interaction.target} ({interaction.targetCompany})</span>
      </div>
      
      <div className="detail-row">
        <span className="detail-label">Type</span>
        <span className="detail-value">{interaction.type}</span>
      </div>
      
      <div className="detail-description">
        <span className="detail-label">Description</span>
        <p className="description-value">{interaction.description}</p>
      </div>
    </div>
  );
};

export default InteractionDetail;