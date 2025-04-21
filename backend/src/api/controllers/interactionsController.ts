import { Request, Response } from 'express';
import { query } from '../../db/postgresClient';
import type Interaction from '../types/interaction';
import type InteractionRecord from '../types/interactionRecord';

const recordToInteraction = (apiResponse: InteractionRecord): Interaction => {
  return {
    id: apiResponse.id.toString(),
    timestamp: apiResponse.timestamp,
    sourceId: apiResponse.source_id,
    source: apiResponse.source_name,
    sourceCompany: apiResponse.source_company,
    targetId: apiResponse.target_id,
    target: apiResponse.target_name,
    targetCompany: apiResponse.target_company,
    type: apiResponse.type,
    description: apiResponse.description
  };
}

export const getEntities = async (req: Request, res: Response) => {
  const entities = await query(`SELECT * from entities`);
  res.json(entities);
};

export const getInteractions = async (req: Request, res: Response) => {
  const interactions = await query(`
    SELECT i.id, i.type, i.description, i.timestamp, 
    source.id AS source_id, source.name AS source_name, source.company AS source_company, 
    target.id AS target_id, target.name AS target_name, target.company AS target_company 
    FROM interactions i 
    JOIN entities source ON i.source_id = source.id 
    JOIN entities target ON i.target_id = target.id
    ORDER BY i.id DESC;`);
  const convertedInteractions = interactions.map(recordToInteraction);  
  res.json(convertedInteractions);
};

export const createInteraction = async (req: Request, res: Response) => {
  const now = new Date();
  const formattedTimestamp = now.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric'
  }) + ' ' + now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const interaction: Interaction = req.body;
  const result = await query(`
    INSERT INTO interactions (source_id, target_id, type, timestamp, description) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *, 
    (SELECT name FROM entities WHERE id = source_id) AS source_name,
    (SELECT company FROM entities WHERE id = source_id) AS source_company,
    (SELECT name FROM entities WHERE id = target_id) AS target_name,
    (SELECT company FROM entities WHERE id = target_id) AS target_company;`, 
    [interaction.sourceId, interaction.targetId, interaction.type, formattedTimestamp, interaction.description]);
  const insertedInteraction = result[0];
  const convertedInteraction = recordToInteraction(insertedInteraction);
  res.status(201).json({ message: 'Interaction created', interaction: convertedInteraction });
};

export const deleteInteraction = async (req: Request, res: Response) => {
  const interactionId = req.params.id;
  const result = await query(`
    DELETE FROM interactions
    WHERE id = $1;`, 
    [interactionId]);
    
  res.status(200).json({ 
    success: true, 
    message: `Interaction ${interactionId} deleted successfully`
  });
}

export const health = async (req: Request, res: Response) => {
  res.status(200).send('OK');
};