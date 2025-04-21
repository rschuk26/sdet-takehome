import React, { useState, useEffect } from 'react';
import type Entity from '../../../types/entity';
import type Interaction from '../../../types/interaction';
import './styles.css';

interface AddInteractionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (interaction: Omit<Interaction, 'id'>) => void;
}

const AddInteractionPopup: React.FC<AddInteractionPopupProps> = ({isOpen, onClose, onAdd}) => {
  const [entities, setEntities] = useState<Entity[]>([])
  const [sourceId, setSourceId] = useState('');
  const [source, setSource] = useState('');
  const [sourceCompany, setSourceCompany] = useState('');
  const [targetId, setTargetId] = useState('');
  const [target, setTarget] = useState('');
  const [targetCompany, setTargetCompany] = useState('');
  const [type, setType] = useState<'Phone' | 'Message' | 'Email'>('Phone');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/entities');
        const data = await response.json() as Entity[];
        setEntities(data);
      } catch (error) {
        console.error('Error fetching interactions:', error);
      }
    };
    fetchEntities();
  }, []);

  const handleEntityChange = (role: 'source' | 'target', entityName: string) => {
    const selectedEntity = entities.find(entity => entity.name === entityName);
    
    if (selectedEntity) {
      if (role === 'source') {
        setSourceId(selectedEntity.id);
        setSource(selectedEntity.name);
        setSourceCompany(selectedEntity.company);
      } else {
        setTargetId(selectedEntity.id);
        setTarget(selectedEntity.name);
        setTargetCompany(selectedEntity.company);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    // Create timestamp in the required format
    const now = new Date();
    const formattedDate = `${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getDate().toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}${now.getHours() >= 12 ? 'PM' : 'AM'}`;
    
    const newInteraction : Interaction = {
      timestamp: formattedDate,
      sourceId,
      source,
      sourceCompany,
      targetId,
      target,
      targetCompany,
      type,
      description
    };
    
    try {
      const response = await fetch('http://localhost:3000/api/interaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newInteraction),
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      
      const savedInteraction = await response.json();      
      onAdd(savedInteraction.interaction);
      
      // Reset form
      setSourceId('');
      setSource('');
      setSourceCompany('');
      setTargetId('');
      setTarget('');
      setTargetCompany('');
      setType('Phone');
      setDescription('');
      
      onClose();
    } catch (err) {
      console.error('Failed to save interaction:', err);
      setError(err instanceof Error ? err.message : 'Failed to save interaction to database');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2>Add New Interaction</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="popup-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="source">Source Contact</label>
              <select 
                id="source" 
                value={source} 
                onChange={(e) => handleEntityChange('source', e.target.value)}
                required
                disabled={isSubmitting}
              >
                <option value="">Select a contact</option>
                {entities.map((entity, index) => (
                  <option key={`source-${index}`} value={entity.name}>
                    {entity.name} ({entity.company})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="target">Target Contact</label>
              <select 
                id="target" 
                value={target}
                onChange={(e) => handleEntityChange('target', e.target.value)}
                required
                disabled={isSubmitting}
              >
                <option value="">Select a contact</option>
                {entities.map((entity, index) => (
                  <option key={`target-${index}`} value={entity.name}>
                    {entity.name} ({entity.company})
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div className="form-group">
            <label>Interaction Type</label>
            <div className="radio-group">
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="type" 
                  value="Phone" 
                  checked={type === 'Phone'} 
                  onChange={() => setType('Phone')}
                  disabled={isSubmitting}
                />
                <span className="radio-text">Phone</span>
              </label>
              
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="type" 
                  value="Message" 
                  checked={type === 'Message'} 
                  onChange={() => setType('Message')}
                  disabled={isSubmitting}
                />
                <span className="radio-text">Message</span>
              </label>
              
              <label className="radio-label">
                <input 
                  type="radio" 
                  name="type" 
                  value="Email" 
                  checked={type === 'Email'} 
                  onChange={() => setType('Email')}
                  disabled={isSubmitting}
                />
                <span className="radio-text">Email</span>
              </label>
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea 
              id="description" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
              disabled={isSubmitting}
              placeholder="Describe the interaction..."
            />
          </div>
          
          <div className="form-actions">
            <button 
              type="button" 
              className="cancel-button" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Add Interaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInteractionPopup;