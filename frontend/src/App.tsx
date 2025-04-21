import React, { useState, useEffect, useRef } from 'react';
import type Interaction from './types/interaction';
import InteractionLog from './components/InteractionLog/InteractionLog';

const App: React.FC = () => {
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    if (dataFetchedRef.current) return;    
    const fetchInteractions = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/interactions');
        const data = await response.json() as Interaction[];
        setInteractions(data);
      } catch (error) {
        console.error('Error fetching interactions:', error);
      }
    };
    fetchInteractions();
    dataFetchedRef.current = true;
  }, []);

  return (
    <div className="app">
      <InteractionLog interactions={interactions} />
    </div>
  );
};

export default App;