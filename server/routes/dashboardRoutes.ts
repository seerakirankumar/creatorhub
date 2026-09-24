import { Router } from 'express';
import {
  getCreatorDashboard,
  getCreators,
  resetData,
} from '../controllers/dashboardController.js';

const router = Router();

router.get('/creator/dashboard', getCreatorDashboard);
router.get('/creators/:creatorId/dashboard', getCreatorDashboard);
router.get('/creators', getCreators);
router.post('/reset', resetData);

export default router;
