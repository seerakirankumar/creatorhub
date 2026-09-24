import fs from 'fs';
import path from 'path';
import { Creator, Gig, Booking, DashboardMetrics, GigFilters } from '../../src/types/index.js';
import { initialCreators, initialGigs, initialBookings } from './initialSeed.js';

interface DatabaseSchema {
  creators: Creator[];
  gigs: Gig[];
  bookings: Booking[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

class DatabaseStore {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.creators && parsed.gigs && parsed.bookings) {
          return parsed;
        }
      }
    } catch {
      // In case of parsing error, fallback to seed
    }

    const defaultData: DatabaseSchema = {
      creators: [...initialCreators],
      gigs: [...initialGigs],
      bookings: [...initialBookings],
    };
    this.saveData(defaultData);
    return defaultData;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
    } catch {
      // Ignore write errors in ephemeral environments
    }
  }

  public resetToDefault(): DatabaseSchema {
    this.data = {
      creators: JSON.parse(JSON.stringify(initialCreators)),
      gigs: JSON.parse(JSON.stringify(initialGigs)),
      bookings: JSON.parse(JSON.stringify(initialBookings)),
    };
    this.saveData();
    return this.data;
  }

  // --- Creators ---
  public getCreators(): Creator[] {
    return this.data.creators.map((c) => ({
      ...c,
      totalGigs: this.data.gigs.filter((g) => g.creatorId === c.id).length,
    }));
  }

  public getCreatorById(id: string): Creator | undefined {
    const creator = this.data.creators.find((c) => c.id === id);
    if (!creator) return undefined;
    return {
      ...creator,
      totalGigs: this.data.gigs.filter((g) => g.creatorId === creator.id).length,
    };
  }

  public findOrCreateCreatorByName(name: string): Creator {
    let creator = this.data.creators.find(
      (c) => c.name.toLowerCase() === name.trim().toLowerCase()
    );
    if (!creator) {
      const now = new Date().toISOString();
      creator = {
        id: `creator-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        name: name.trim(),
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
        bio: 'Talented digital creator monetizing high-value creative skills.',
        title: 'Independent Digital Creator',
        rating: 5.0,
        totalGigs: 0,
        createdAt: now,
        updatedAt: now,
      };
      this.data.creators.push(creator);
      this.saveData();
    }
    return creator;
  }

  // --- Gigs ---
  public getGigs(filters: GigFilters = {}): Gig[] {
    const creatorsMap = new Map(this.getCreators().map((c) => [c.id, c]));
    let result = this.data.gigs.map((g) => ({
      ...g,
      creator: creatorsMap.get(g.creatorId),
    }));

    // Filter by Category
    if (filters.category && filters.category !== 'All') {
      const catLower = filters.category.toLowerCase();
      result = result.filter((g) => g.category.toLowerCase() === catLower);
    }

    // Filter by Availability
    if (filters.availability === 'available_only') {
      result = result.filter((g) => g.availability === true);
    }

    // Filter by Price range
    if (typeof filters.minPrice === 'number' && !isNaN(filters.minPrice)) {
      result = result.filter((g) => g.rate >= filters.minPrice!);
    }
    if (typeof filters.maxPrice === 'number' && !isNaN(filters.maxPrice)) {
      result = result.filter((g) => g.rate <= filters.maxPrice!);
    }

    // Search query
    const searchQuery = (filters.search || '').trim().toLowerCase();

    // Calculate DP3 Ranking Score for each gig
    const now = Date.now();
    result = result.map((gig) => {
      let relevanceScore = 0;
      if (searchQuery) {
        const titleLower = gig.title.toLowerCase();
        const descLower = gig.description.toLowerCase();
        const creatorLower = (gig.creator?.name || '').toLowerCase();
        const categoryLower = gig.category.toLowerCase();

        if (titleLower.includes(searchQuery)) relevanceScore += 50;
        if (categoryLower.includes(searchQuery)) relevanceScore += 30;
        if (creatorLower.includes(searchQuery)) relevanceScore += 25;
        if (descLower.includes(searchQuery)) relevanceScore += 15;
      } else {
        relevanceScore = 30; // Baseline
      }

      // Availability Score: Available gets 40 points, Unavailable gets 0
      const availabilityScore = gig.availability ? 40 : 0;

      // Recency Score: Gigs created/updated recently get up to 20 points
      const gigTime = new Date(gig.updatedAt || gig.createdAt).getTime();
      const ageInDays = Math.max(0, (now - gigTime) / (1000 * 60 * 60 * 24));
      const recencyScore = Math.max(0, Math.round(20 - ageInDays * 0.5));

      // New Creator Boost: Creators with <= 2 gigs get 15 points
      const creatorTotalGigs = gig.creator?.totalGigs ?? 1;
      const newCreatorBoost = creatorTotalGigs <= 2 ? 15 : 0;

      const rankingScore = relevanceScore + availabilityScore + recencyScore + newCreatorBoost;

      return {
        ...gig,
        rankingScore,
      };
    });

    // If search term was provided and relevance is zero, exclude it
    if (searchQuery) {
      result = result.filter((g) => (g.rankingScore || 0) > 40 ||
        g.title.toLowerCase().includes(searchQuery) ||
        g.description.toLowerCase().includes(searchQuery) ||
        (g.creator?.name || '').toLowerCase().includes(searchQuery) ||
        g.category.toLowerCase().includes(searchQuery)
      );
    }

    // Sorting
    const sort = filters.sortBy || 'relevant';
    if (sort === 'relevant') {
      result.sort((a, b) => (b.rankingScore || 0) - (a.rankingScore || 0));
    } else if (sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'price_asc') {
      result.sort((a, b) => a.rate - b.rate);
    } else if (sort === 'price_desc') {
      result.sort((a, b) => b.rate - a.rate);
    }

    return result;
  }

  public getGigById(id: string): Gig | undefined {
    const gig = this.data.gigs.find((g) => g.id === id);
    if (!gig) return undefined;
    const creator = this.getCreatorById(gig.creatorId);
    return {
      ...gig,
      creator,
    };
  }

  public createGig(input: {
    title: string;
    category: string;
    description: string;
    rate: number;
    availability: boolean;
    creatorId?: string;
    creatorName?: string;
  }): Gig {
    let creator: Creator;
    if (input.creatorId) {
      const found = this.getCreatorById(input.creatorId);
      if (found) {
        creator = found;
      } else {
        creator = this.findOrCreateCreatorByName(input.creatorName || 'Creator');
      }
    } else if (input.creatorName) {
      creator = this.findOrCreateCreatorByName(input.creatorName);
    } else {
      creator = this.data.creators[0]; // fallback default creator
    }

    const now = new Date().toISOString();
    const newGig: Gig = {
      id: `gig-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      creatorId: creator.id,
      title: input.title.trim(),
      category: input.category.trim(),
      description: input.description.trim(),
      rate: Number(input.rate),
      availability: input.availability !== false,
      createdAt: now,
      updatedAt: now,
    };

    this.data.gigs.unshift(newGig);
    this.saveData();

    return {
      ...newGig,
      creator,
    };
  }

  // --- Bookings ---
  public getBookings(filters: { clientName?: string; creatorId?: string; status?: string } = {}): Booking[] {
    const gigsMap = new Map(this.data.gigs.map((g) => [g.id, g]));
    const creatorsMap = new Map(this.getCreators().map((c) => [c.id, c]));

    let bookings = this.data.bookings.map((b) => {
      const gig = gigsMap.get(b.gigId);
      const creator = creatorsMap.get(b.creatorId);
      return {
        ...b,
        gig: gig ? { ...gig, creator } : undefined,
        creator,
      };
    });

    if (filters.clientName) {
      const clientLower = filters.clientName.toLowerCase().trim();
      bookings = bookings.filter((b) => b.clientName.toLowerCase().includes(clientLower));
    }

    if (filters.creatorId) {
      bookings = bookings.filter((b) => b.creatorId === filters.creatorId);
    }

    if (filters.status && filters.status !== 'ALL') {
      bookings = bookings.filter((b) => b.status === filters.status);
    }

    // Sort newest first
    bookings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return bookings;
  }

  public getBookingById(id: string): Booking | undefined {
    const b = this.data.bookings.find((item) => item.id === id);
    if (!b) return undefined;
    const gig = this.getGigById(b.gigId);
    const creator = this.getCreatorById(b.creatorId);
    return {
      ...b,
      gig,
      creator,
    };
  }

  public createBooking(input: {
    gigId: string;
    clientName: string;
    clientEmail?: string;
    projectDescription: string;
    requestedDate: string;
  }): { success: true; booking: Booking } | { success: false; error: string; status: number } {
    const gig = this.getGigById(input.gigId);
    if (!gig) {
      return { success: false, error: 'Gig not found.', status: 404 };
    }

    // Backend enforcement of DP2: blocked if gig is already unavailable/booked
    if (!gig.availability) {
      return {
        success: false,
        error: 'This gig is currently unavailable. Please explore similar services.',
        status: 409,
      };
    }

    const now = new Date().toISOString();
    const dateParsed = !isNaN(Date.parse(input.requestedDate))
      ? new Date(input.requestedDate).toISOString()
      : now;

    const newBooking: Booking = {
      id: `booking-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      gigId: gig.id,
      creatorId: gig.creatorId,
      clientName: input.clientName.trim(),
      clientEmail: input.clientEmail?.trim() || undefined,
      projectDescription: input.projectDescription.trim(),
      requestedDate: dateParsed,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
    };

    this.data.bookings.unshift(newBooking);
    this.saveData();

    return {
      success: true,
      booking: {
        ...newBooking,
        gig,
        creator: gig.creator,
      },
    };
  }

  // DP2 Implementation: Accept a booking atomically
  public acceptBooking(bookingId: string): { success: true; booking: Booking; autoDeclinedCount: number } | { success: false; error: string; status: number } {
    const booking = this.data.bookings.find((b) => b.id === bookingId);
    if (!booking) {
      return { success: false, error: 'Booking not found.', status: 404 };
    }

    if (booking.status === 'ACCEPTED') {
      return { success: false, error: 'Booking has already been accepted.', status: 400 };
    }

    const gigIndex = this.data.gigs.findIndex((g) => g.id === booking.gigId);
    if (gigIndex === -1) {
      return { success: false, error: 'Associated gig not found.', status: 404 };
    }

    const now = new Date().toISOString();

    // 1. Mark this booking as ACCEPTED
    booking.status = 'ACCEPTED';
    booking.updatedAt = now;

    // 2. Mark the gig as unavailable (DP2: gig becomes unavailable once accepted)
    this.data.gigs[gigIndex].availability = false;
    this.data.gigs[gigIndex].updatedAt = now;

    // 3. Atomically transition all other competing PENDING bookings for this exact gig to DECLINED
    let autoDeclinedCount = 0;
    this.data.bookings.forEach((otherBooking) => {
      if (
        otherBooking.id !== bookingId &&
        otherBooking.gigId === booking.gigId &&
        otherBooking.status === 'PENDING'
      ) {
        otherBooking.status = 'DECLINED';
        otherBooking.rejectionReason = 'Gig booked by another confirmed client request.';
        otherBooking.updatedAt = now;
        autoDeclinedCount++;
      }
    });

    this.saveData();

    const fullBooking = this.getBookingById(bookingId)!;
    return {
      success: true,
      booking: fullBooking,
      autoDeclinedCount,
    };
  }

  // DP1 Implementation: Decline a booking without deleting it
  public declineBooking(bookingId: string, reason?: string): { success: true; booking: Booking } | { success: false; error: string; status: number } {
    const booking = this.data.bookings.find((b) => b.id === bookingId);
    if (!booking) {
      return { success: false, error: 'Booking not found.', status: 404 };
    }

    if (booking.status === 'DECLINED') {
      return { success: false, error: 'Booking is already declined.', status: 400 };
    }

    const now = new Date().toISOString();
    booking.status = 'DECLINED';
    booking.rejectionReason = reason?.trim() || 'Creator declined the request due to schedule or scope constraints.';
    booking.updatedAt = now;

    this.saveData();

    const fullBooking = this.getBookingById(bookingId)!;
    return {
      success: true,
      booking: fullBooking,
    };
  }

  // Creator Dashboard
  public getCreatorDashboard(creatorId?: string): {
    creator: Creator;
    metrics: DashboardMetrics;
    gigs: Gig[];
    bookings: Booking[];
  } {
    const creator = (creatorId ? this.getCreatorById(creatorId) : undefined) || this.data.creators[0];
    const gigs = this.data.gigs.filter((g) => g.creatorId === creator.id);
    const bookings = this.getBookings({ creatorId: creator.id });

    const totalGigs = gigs.length;
    const pendingRequests = bookings.filter((b) => b.status === 'PENDING').length;
    const acceptedRequests = bookings.filter((b) => b.status === 'ACCEPTED').length;
    const declinedRequests = bookings.filter((b) => b.status === 'DECLINED').length;

    const totalPipelineValue = bookings
      .filter((b) => b.status === 'ACCEPTED' || b.status === 'PENDING')
      .reduce((sum, b) => sum + (b.gig?.rate || 0), 0);

    return {
      creator,
      metrics: {
        totalGigs,
        pendingRequests,
        acceptedRequests,
        declinedRequests,
        totalPipelineValue,
      },
      gigs,
      bookings,
    };
  }
}

export const db = new DatabaseStore();
