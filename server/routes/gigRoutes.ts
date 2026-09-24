import { Router } from 'express';
import { getGigs, getGigById, createGig } from '../controllers/gigController.js';

const router = Router();

router.get('/', getGigs);
router.get('/:id', getGigById);
router.post('/', createGig);

export default router;
