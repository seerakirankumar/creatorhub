import { Request, Response } from 'express';
import { db } from '../data/db.js';
import { createGigSchema } from '../validators/schemas.js';

export const getGigs = (req: Request, res: Response) => {
  try {
    const { search, category, minPrice, maxPrice, availability, sortBy } = req.query;

    const filters = {
      search: typeof search === 'string' ? search : undefined,
      category: typeof category === 'string' ? category : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
      availability: availability === 'available_only' ? ('available_only' as const) : ('all' as const),
      sortBy: (sortBy as 'relevant' | 'newest' | 'price_asc' | 'price_desc') || 'relevant',
    };

    const gigs = db.getGigs(filters);
    res.json({ success: true, data: gigs, count: gigs.length });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error while fetching gigs' });
  }
};

export const getGigById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const gig = db.getGigById(id);

    if (!gig) {
      return res.status(404).json({ success: false, error: 'Gig not found' });
    }

    res.json({ success: true, data: gig });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error while retrieving gig' });
  }
};

export const createGig = (req: Request, res: Response) => {
  try {
    const parseResult = createGigSchema.safeParse(req.body);

    if (!parseResult.success) {
      const errorMessages = parseResult.error.issues.map((e: { message: string }) => e.message).join(', ');
      return res.status(400).json({
        success: false,
        error: errorMessages,
        details: parseResult.error.format(),
      });
    }

    const created = db.createGig(parseResult.data);
    res.status(201).json({
      success: true,
      message: 'Gig published successfully.',
      data: created,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Internal server error while publishing gig' });
  }
};
