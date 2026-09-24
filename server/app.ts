import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import gigRoutes from './routes/gigRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

export function createExpressApp(): Express {
  const app = express();

  // Basic middleware
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'CreatorHub API',
      timestamp: new Date().toISOString(),
    });
  });

  // Mount API modules
  app.use('/api/gigs', gigRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api', dashboardRoutes);

  // Global 404 for unmatched API routes
  app.use('/api/*', (_req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: 'API endpoint not found',
    });
  });

  // Centralized error handler
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error('Unhandled server error:', err);
    res.status(500).json({
      success: false,
      error: 'An internal server error occurred',
    });
  });

  return app;
}
