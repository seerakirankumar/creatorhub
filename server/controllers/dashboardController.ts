import { Request, Response } from 'express';
import { db } from '../data/db.js';

export const getCreatorDashboard = (req: Request, res: Response) => {
  try {
    const creatorId = (req.query.creatorId || req.params.creatorId) as string | undefined;
    const dashboardData = db.getCreatorDashboard(
      typeof creatorId === 'string' && creatorId ? creatorId : undefined
    );
    res.json({ success: true, data: dashboardData });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error while retrieving dashboard' });
  }
};

export const getCreators = (_req: Request, res: Response) => {
  try {
    const creators = db.getCreators();
    res.json({ success: true, data: creators });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error while retrieving creators' });
  }
};

export const resetData = (_req: Request, res: Response) => {
  try {
    const refreshed = db.resetToDefault();
    res.json({
      success: true,
      message: 'Demo dataset reset successfully to initial state.',
      data: {
        creatorsCount: refreshed.creators.length,
        gigsCount: refreshed.gigs.length,
        bookingsCount: refreshed.bookings.length,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error while resetting data' });
  }
};
