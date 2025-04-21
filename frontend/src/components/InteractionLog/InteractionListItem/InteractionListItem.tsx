import React from 'react';
import type Interaction from '../../../types/interaction';
import InteractionIcon from '../InteractionIcon';
import './styles.css';

interface InteractionListItemProps {
  interaction: Interaction;
  isSelected: boolean;
  onSelect: () => void;
}

const InteractionListItem: React.FC<InteractionListItemProps> = ({ 
  interaction, 
  isSelected, 
  onSelect 
}) => {
  // Extract names, with fallbacks in case they're undefined
  const sourceName = interaction.source || '';
  const targetName = interaction.target || '';

  // Split the names into parts for generating initials
  const sourceNameParts = sourceName.split(' ');
  const targetNameParts = targetName.split(' ');
  
  // Safely generate initials with proper checks
  let sourceInitials = '';
  if (sourceNameParts[0] && sourceNameParts[0][0]) {
    sourceInitials = sourceNameParts[0][0];
    if (sourceNameParts[1] && sourceNameParts[1][0]) {
      sourceInitials += sourceNameParts[1][0];
    }
  }
  
  let targetInitials = '';
  if (targetNameParts[0] && targetNameParts[0][0]) {
    targetInitials = targetNameParts[0][0];
    if (targetNameParts[1] && targetNameParts[1][0]) {
      targetInitials += targetNameParts[1][0];
    }
  }
  
  return (
    <div className='interaction-list-wrapper'>
        <div className="interaction-selector">
            <input 
            type="radio" 
            checked={isSelected}
            onChange={onSelect}
            aria-label={`Select interaction with ${interaction.target}`}
            />
        </div>
        <div className={`interaction-list-item ${isSelected ? 'selected' : ''}`} onClick={onSelect}>
            <div className="interaction-content">
                <div className="interaction-person source">
                <div className="avatar purple">
                    {sourceInitials.toUpperCase()}
                </div>
                <span className="name">{sourceName}</span>
                <span className="company">{interaction.sourceCompany}</span>
                </div>
                
                <div className="interaction-connector">
                <div className="connector-line">··········</div>
                <InteractionIcon type={interaction.type} />
                <div className="connector-line">··········</div>
                </div>
                
                <div className="interaction-person target">
                <div className="avatar yellow">
                    {targetInitials.toUpperCase()}
                </div>
                <span className="name">{targetName}</span>
                <span className="company">{interaction.targetCompany}</span>
                </div>
            </div>
        </div>
    </div>
  );
};

export default InteractionListItem;