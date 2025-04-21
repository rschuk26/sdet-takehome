import { Router } from 'express';
import { createInteraction, getInteractions, getEntities, deleteInteraction, health } from '../controllers/interactionsController';

const router = Router();

router.get('/entities', getEntities);
router.post('/interaction', createInteraction);
router.get('/interactions', getInteractions);
router.delete('/interaction/:id', deleteInteraction);
router.get('/health', health);

export default router;