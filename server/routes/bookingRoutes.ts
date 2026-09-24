import { Router } from 'express';
import {
  getBookings,
  getBookingById,
  createBooking,
  acceptBooking,
  declineBooking,
} from '../controllers/bookingController.js';

const router = Router();

router.get('/', getBookings);
router.get('/:id', getBookingById);
router.post('/', createBooking);
router.patch('/:id/accept', acceptBooking);
router.patch('/:id/decline', declineBooking);

export default router;
