import {
  Creator,
  Gig,
  Booking,
  DashboardData,
  CreateGigInput,
  CreateBookingInput,
  GigFilters,
} from '../types/index.js';

// Fallback seed data matching initialSeed
const SEED_CREATORS: Creator[] = [
  {
    id: 'creator-1',
    name: 'Kiran Kumar',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Visual storyteller and short-form video specialist. 5+ years producing viral Reels and YouTube Shorts.',
    title: 'Senior Motion & Video Editor',
    rating: 4.9,
    totalGigs: 3,
    createdAt: '2026-01-15T09:00:00.000Z',
    updatedAt: '2026-01-15T09:00:00.000Z',
  },
  {
    id: 'creator-2',
    name: 'Anya Sharma',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
    bio: 'Product and brand identity designer helping early-stage tech founders build world-class design systems.',
    title: 'Brand & UI/UX Designer',
    rating: 5.0,
    totalGigs: 2,
    createdAt: '2026-02-01T10:30:00.000Z',
    updatedAt: '2026-02-01T10:30:00.000Z',
  },
  {
    id: 'creator-3',
    name: 'Marcus Chen',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'Full-stack TypeScript and React Native developer. Building robust MVPs and web applications fast.',
    title: 'Full-Stack Software Engineer',
    rating: 4.95,
    totalGigs: 2,
    createdAt: '2026-02-10T14:00:00.000Z',
    updatedAt: '2026-02-10T14:00:00.000Z',
  },
  {
    id: 'creator-4',
    name: 'Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    bio: 'Technical copywriter and content strategist for developer tools, AI startups, and SaaS products.',
    title: 'SaaS Content & Copy Strategist',
    rating: 4.85,
    totalGigs: 2,
    createdAt: '2026-02-20T11:15:00.000Z',
    updatedAt: '2026-02-20T11:15:00.000Z',
  },
  {
    id: 'creator-5',
    name: 'Devon Patel',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    bio: 'Growth marketer specializing in organic TikTok virality, creator funnels, and paid acquisition.',
    title: 'Growth & Social Strategist',
    rating: 4.9,
    totalGigs: 2,
    createdAt: '2026-03-01T08:45:00.000Z',
    updatedAt: '2026-03-01T08:45:00.000Z',
  },
];

const SEED_GIGS: Gig[] = [
  {
    id: 'gig-1',
    creatorId: 'creator-1',
    title: 'Viral Instagram Reels & YouTube Shorts Video Editing',
    category: 'Video',
    description:
      'Turn raw footage into high-retention, algorithm-friendly short-form videos. Includes sound design, pacing, kinetic typography, b-roll integration, and color grading.',
    rate: 220,
    availability: true,
    createdAt: '2026-03-15T10:00:00.000Z',
    updatedAt: '2026-03-15T10:00:00.000Z',
    creator: SEED_CREATORS[0],
  },
  {
    id: 'gig-2',
    creatorId: 'creator-1',
    title: 'Long-Form YouTube Video Pacing & Narrative Editing',
    category: 'Video',
    description:
      'Complete post-production for 10-20 minute YouTube videos. Narrative structure, retention graph optimization, multi-camera sync, custom transitions, and sound mastering.',
    rate: 450,
    availability: true,
    createdAt: '2026-03-12T14:30:00.000Z',
    updatedAt: '2026-03-12T14:30:00.000Z',
    creator: SEED_CREATORS[0],
  },
  {
    id: 'gig-3',
    creatorId: 'creator-2',
    title: 'Complete SaaS Brand Identity & Design System',
    category: 'Design',
    description:
      'Comprehensive brand identity system including logo marks, typography scales, accessible color palettes, and Figma token variables ready for engineering handoff.',
    rate: 850,
    availability: true,
    createdAt: '2026-03-16T11:00:00.000Z',
    updatedAt: '2026-03-16T11:00:00.000Z',
    creator: SEED_CREATORS[1],
  },
  {
    id: 'gig-4',
    creatorId: 'creator-3',
    title: 'Full-Stack MVP Development (React, Vite, Express & Tailwind)',
    category: 'Programming',
    description:
      'Turn your product specs into a deployed, fully responsive web application in under 7 days. Complete with REST API, database architecture, and mobile viewport polish.',
    rate: 1200,
    availability: true,
    createdAt: '2026-03-17T09:00:00.000Z',
    updatedAt: '2026-03-17T09:00:00.000Z',
    creator: SEED_CREATORS[2],
  },
  {
    id: 'gig-5',
    creatorId: 'creator-4',
    title: 'High-Converting B2B SaaS Landing Page Copywriting',
    category: 'Writing',
    description:
      'Compelling, developer-centric homepage and pricing page copy. Clear positioning, value propositions, features breakdowns, and persuasive calls-to-action.',
    rate: 350,
    availability: true,
    createdAt: '2026-03-14T16:00:00.000Z',
    updatedAt: '2026-03-14T16:00:00.000Z',
    creator: SEED_CREATORS[3],
  },
  {
    id: 'gig-6',
    creatorId: 'creator-5',
    title: 'Organic Creator Growth Audit & TikTok Launch Playbook',
    category: 'Marketing',
    description:
      'In-depth 30-day organic growth roadmap. Hook formulations, content pillars, competitor gap analysis, and tailored posting cadences designed for rapid traction.',
    rate: 300,
    availability: true,
    createdAt: '2026-03-18T13:45:00.000Z',
    updatedAt: '2026-03-18T13:45:00.000Z',
    creator: SEED_CREATORS[4],
  },
];

const SEED_BOOKINGS: Booking[] = [];


const LOCAL_KEY = 'creatorhub_local_storage_v1';

interface LocalState {
  creators: Creator[];
  gigs: Gig[];
  bookings: Booking[];
}

function getLocalState(): LocalState {
  if (typeof window === 'undefined') {
    return { creators: SEED_CREATORS, gigs: SEED_GIGS, bookings: SEED_BOOKINGS };
  }
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.creators) && Array.isArray(parsed.gigs) && Array.isArray(parsed.bookings)) {
        return parsed;
      }
    }
  } catch {
    // Ignore and fallback
  }

  const initial = {
    creators: JSON.parse(JSON.stringify(SEED_CREATORS)),
    gigs: JSON.parse(JSON.stringify(SEED_GIGS)),
    bookings: JSON.parse(JSON.stringify(SEED_BOOKINGS)),
  };
  saveLocalState(initial);
  return initial;
}

function saveLocalState(state: LocalState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable
  }
}

export const fallbackService = {
  reset(): void {
    const fresh = {
      creators: JSON.parse(JSON.stringify(SEED_CREATORS)),
      gigs: JSON.parse(JSON.stringify(SEED_GIGS)),
      bookings: JSON.parse(JSON.stringify(SEED_BOOKINGS)),
    };
    saveLocalState(fresh);
  },

  getCreators(): Creator[] {
    const state = getLocalState();
    return state.creators;
  },

  getGigs(filters: GigFilters = {}): Gig[] {
    const state = getLocalState();
    let result = [...state.gigs];

    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (g) =>
          g.title.toLowerCase().includes(q) ||
          g.description.toLowerCase().includes(q) ||
          g.category.toLowerCase().includes(q) ||
          (g.creator && g.creator.name.toLowerCase().includes(q))
      );
    }

    if (filters.category && filters.category !== 'All') {
      result = result.filter(
        (g) => g.category.toLowerCase() === filters.category!.toLowerCase()
      );
    }

    if (typeof filters.minPrice === 'number' && !isNaN(filters.minPrice)) {
      result = result.filter((g) => g.rate >= filters.minPrice!);
    }

    if (typeof filters.maxPrice === 'number' && !isNaN(filters.maxPrice)) {
      result = result.filter((g) => g.rate <= filters.maxPrice!);
    }

    if (filters.availability === 'available_only') {
      result = result.filter((g) => g.availability === true);
    }

    if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => a.rate - b.rate);
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a, b) => b.rate - a.rate);
    } else if (filters.sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      // DP3 deterministic ranking
      result.sort((a, b) => {
        const scoreA = (a.availability ? 40 : 0) + (a.creator?.rating || 4.5) * 5;
        const scoreB = (b.availability ? 40 : 0) + (b.creator?.rating || 4.5) * 5;
        return scoreB - scoreA;
      });
    }

    return result;
  },

  getGigById(id: string): Gig {
    const state = getLocalState();
    const gig = state.gigs.find((g) => g.id === id);
    if (!gig) throw new Error('Gig not found');
    return gig;
  },

  createGig(input: CreateGigInput): Gig {
    const state = getLocalState();
    let creator = state.creators.find((c) => c.id === input.creatorId);
    if (!creator) {
      creator = {
        id: `creator-${Date.now()}`,
        name: input.creatorName || 'New Creator',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        bio: 'Independent creative offering high-standard client deliverables.',
        title: `${input.category} Specialist`,
        rating: 5.0,
        totalGigs: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      state.creators.push(creator);
    }

    const newGig: Gig = {
      id: `gig-${Date.now()}`,
      creatorId: creator.id,
      title: input.title,
      category: input.category,
      description: input.description,
      rate: input.rate,
      availability: input.availability !== undefined ? input.availability : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creator,
    };

    state.gigs.unshift(newGig);
    saveLocalState(state);
    return newGig;
  },

  getBookings(filters: { clientName?: string; creatorId?: string; status?: string } = {}): Booking[] {
    const state = getLocalState();
    let result = [...state.bookings];

    if (filters.clientName) {
      const q = filters.clientName.toLowerCase();
      result = result.filter((b) => b.clientName.toLowerCase().includes(q));
    }

    if (filters.creatorId) {
      result = result.filter((b) => b.creatorId === filters.creatorId);
    }

    if (filters.status && filters.status !== 'ALL') {
      result = result.filter((b) => b.status === filters.status);
    }

    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  },

  getBookingById(id: string): Booking {
    const state = getLocalState();
    const booking = state.bookings.find((b) => b.id === id);
    if (!booking) throw new Error('Booking not found');
    return booking;
  },

  createBooking(input: CreateBookingInput): Booking {
    const state = getLocalState();
    const gig = state.gigs.find((g) => g.id === input.gigId);
    if (!gig) throw new Error('Referenced gig does not exist');

    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      gigId: gig.id,
      creatorId: gig.creatorId,
      clientName: input.clientName,
      clientEmail: input.clientEmail,
      projectDescription: input.projectDescription,
      requestedDate: input.requestedDate,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      gig,
      creator: gig.creator,
    };

    state.bookings.unshift(newBooking);
    saveLocalState(state);
    return newBooking;
  },

  acceptBooking(id: string): { booking: Booking; autoDeclinedCompetingRequests: number } {
    const state = getLocalState();
    const index = state.bookings.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Booking not found');

    const targetBooking = state.bookings[index];
    targetBooking.status = 'ACCEPTED';
    targetBooking.updatedAt = new Date().toISOString();

    // Mark gig booked/unavailable
    const gig = state.gigs.find((g) => g.id === targetBooking.gigId);
    if (gig) {
      gig.availability = false;
      gig.updatedAt = new Date().toISOString();
      if (targetBooking.gig) {
        targetBooking.gig.availability = false;
        targetBooking.gig.updatedAt = gig.updatedAt;
      }
    }

    // Availability guard: auto-decline competing pending bookings on this exact gig
    let autoDeclined = 0;
    state.bookings.forEach((b) => {
      if (b.id !== id && b.gigId === targetBooking.gigId && b.status === 'PENDING') {
        b.status = 'DECLINED';
        b.rejectionReason =
          'Gig booked by another confirmed client request.';
        b.updatedAt = new Date().toISOString();
        autoDeclined += 1;
      }
    });

    saveLocalState(state);
    return { booking: targetBooking, autoDeclinedCompetingRequests: autoDeclined };
  },

  declineBooking(id: string, reason?: string): Booking {
    const state = getLocalState();
    const booking = state.bookings.find((b) => b.id === id);
    if (!booking) throw new Error('Booking not found');

    booking.status = 'DECLINED';
    booking.rejectionReason =
      reason || 'Creator cannot accommodate this request at this time.';
    booking.updatedAt = new Date().toISOString();

    saveLocalState(state);
    return booking;
  },

  getCreatorDashboard(creatorId?: string): DashboardData {
    const state = getLocalState();
    const selectedCreator = state.creators.find((c) => c.id === creatorId) || state.creators[0];

    const creatorGigs = state.gigs.filter((g) => g.creatorId === selectedCreator.id);
    const creatorBookings = state.bookings.filter((b) => b.creatorId === selectedCreator.id);

    const pending = creatorBookings.filter((b) => b.status === 'PENDING').length;
    const accepted = creatorBookings.filter((b) => b.status === 'ACCEPTED').length;
    const declined = creatorBookings.filter((b) => b.status === 'DECLINED').length;
    const revenue = creatorBookings
      .filter((b) => b.status === 'ACCEPTED')
      .reduce((sum, b) => sum + (b.gig?.rate || 0), 0);

    return {
      creator: selectedCreator,
      metrics: {
        totalGigs: creatorGigs.length,
        pendingRequests: pending,
        acceptedRequests: accepted,
        declinedRequests: declined,
        totalPipelineValue: revenue,
      },
      gigs: creatorGigs,
      bookings: creatorBookings,
    };
  },
};
