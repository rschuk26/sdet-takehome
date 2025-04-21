import React from 'react';
import type Interaction from '../../../types/interaction';
import InteractionListItem from '../InteractionListItem/InteractionListItem';

interface InteractionListProps {
  interactions: Interaction[];
  selectedInteraction: Interaction | null;
  onSelectInteraction: (interaction: Interaction) => void;
}

const InteractionList: React.FC<InteractionListProps> = ({ 
  interactions, 
  selectedInteraction, 
  onSelectInteraction 
}) => {
  return (
    <div className="interaction-list">
      {interactions.map((interaction) => (
        <InteractionListItem 
          key={interaction.id}
          interaction={interaction}
          isSelected={selectedInteraction?.id === interaction.id}
          onSelect={() => onSelectInteraction(interaction)}
        />
      ))}
    </div>
  );
};

export default InteractionList;