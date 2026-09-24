import { Request, Response } from 'express';
import { db } from '../data/db.js';
import { createBookingSchema, declineBookingSchema } from '../validators/schemas.js';

export const getBookings = (req: Request, res: Response) => {
  try {
    const { clientName, creatorId, status } = req.query;

    const bookings = db.getBookings({
      clientName: typeof clientName === 'string' ? clientName : undefined,
      creatorId: typeof creatorId === 'string' ? creatorId : undefined,
      status: typeof status === 'string' ? status : undefined,
    });

    res.json({ success: true, data: bookings, count: bookings.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error while retrieving bookings' });
  }
};

export const getBookingById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = db.getBookingById(id);

    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error while fetching booking details' });
  }
};

export const createBooking = (req: Request, res: Response) => {
  try {
    const parseResult = createBookingSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errorMessages = parseResult.error.issues.map((e: { message: string }) => e.message).join(', ');
      return res.status(400).json({
        success: false,
        error: errorMessages,
        details: parseResult.error.format(),
      });
    }

    const requestedDate = parseResult.data.requestedDate || parseResult.data.targetCompletionDate || new Date().toISOString();
    const result = db.createBooking({
      ...parseResult.data,
      requestedDate,
    });

    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        error: result.error,
      });
    }

    res.status(201).json({
      success: true,
      message: 'Booking submitted successfully. Your request has been sent to the creator.',
      data: result.booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error while processing booking' });
  }
};

export const acceptBooking = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = db.acceptBooking(id);

    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      message: 'Booking accepted successfully.',
      data: result.booking,
      autoDeclinedCompetingRequests: result.autoDeclinedCount,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error while accepting booking' });
  }
};

export const declineBooking = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const parseResult = declineBookingSchema.safeParse(req.body || {});

    const reason = parseResult.success ? parseResult.data.reason : undefined;
    const result = db.declineBooking(id, reason);

    if (!result.success) {
      return res.status(result.status).json({
        success: false,
        error: result.error,
      });
    }

    res.json({
      success: true,
      message: 'Booking declined.',
      data: result.booking,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error while declining booking' });
  }
};
