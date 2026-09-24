import {
  Gig,
  Booking,
  Creator,
  DashboardData,
  CreateGigInput,
  CreateBookingInput,
  GigFilters,
} from '../types/index.js';
import { fallbackService } from './localFallback.js';

const API_BASE = (import.meta as unknown as { env: { VITE_API_BASE_URL?: string } }).env.VITE_API_BASE_URL || '/api';

export async function fetchGigs(filters: GigFilters = {}): Promise<Gig[]> {
  const params = new URLSearchParams();
  if (filters.search) params.append('search', filters.search);
  if (filters.category && filters.category !== 'All') params.append('category', filters.category);
  if (typeof filters.minPrice === 'number' && !isNaN(filters.minPrice))
    params.append('minPrice', filters.minPrice.toString());
  if (typeof filters.maxPrice === 'number' && !isNaN(filters.maxPrice))
    params.append('maxPrice', filters.maxPrice.toString());
  if (filters.availability) params.append('availability', filters.availability);
  if (filters.sortBy) params.append('sortBy', filters.sortBy);

  const query = params.toString() ? `?${params.toString()}` : '';
  try {
    const res = await fetch(`${API_BASE}/gigs${query}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch gigs');
    }
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('API fetchGigs failed, falling back to local storage:', err);
    return fallbackService.getGigs(filters);
  }
}

export async function fetchGigById(id: string): Promise<Gig> {
  try {
    const res = await fetch(`${API_BASE}/gigs/${id}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Gig not found');
    }
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('API fetchGigById failed, falling back to local storage:', err);
    return fallbackService.getGigById(id);
  }
}

export async function createGig(data: CreateGigInput): Promise<Gig> {
  try {
    const res = await fetch(`${API_BASE}/gigs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to create gig');
    }
    // Also save in local fallback mirror
    try {
      fallbackService.createGig(data);
    } catch {
      // Ignore mirror error
    }
    return json.data;
  } catch (err) {
    console.warn('API createGig failed, falling back to local storage:', err);
    return fallbackService.createGig(data);
  }
}

export async function fetchBookings(filters: {
  clientName?: string;
  creatorId?: string;
  status?: string;
} = {}): Promise<Booking[]> {
  const params = new URLSearchParams();
  if (filters.clientName) params.append('clientName', filters.clientName);
  if (filters.creatorId) params.append('creatorId', filters.creatorId);
  if (filters.status && filters.status !== 'ALL') params.append('status', filters.status);

  const query = params.toString() ? `?${params.toString()}` : '';
  try {
    const res = await fetch(`${API_BASE}/bookings${query}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch bookings');
    }
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('API fetchBookings failed, falling back to local storage:', err);
    return fallbackService.getBookings(filters);
  }
}

export async function fetchBookingById(id: string): Promise<Booking> {
  try {
    const res = await fetch(`${API_BASE}/bookings/${id}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Booking not found');
    }
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('API fetchBookingById failed, falling back to local storage:', err);
    return fallbackService.getBookingById(id);
  }
}

export async function createBooking(data: CreateBookingInput): Promise<Booking> {
  try {
    const res = await fetch(`${API_BASE}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to submit booking');
    }
    try {
      fallbackService.createBooking(data);
    } catch {
      // Ignore mirror error
    }
    return json.data;
  } catch (err) {
    console.warn('API createBooking failed, falling back to local storage:', err);
    return fallbackService.createBooking(data);
  }
}

export async function acceptBooking(
  id: string
): Promise<{ booking: Booking; autoDeclinedCompetingRequests: number }> {
  try {
    const res = await fetch(`${API_BASE}/bookings/${id}/accept`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to accept booking');
    }
    try {
      fallbackService.acceptBooking(id);
    } catch {
      // Ignore mirror error
    }
    return {
      booking: json.data,
      autoDeclinedCompetingRequests: json.autoDeclinedCompetingRequests || 0,
    };
  } catch (err) {
    console.warn('API acceptBooking failed, falling back to local storage:', err);
    return fallbackService.acceptBooking(id);
  }
}

export async function declineBooking(id: string, reason?: string): Promise<Booking> {
  try {
    const res = await fetch(`${API_BASE}/bookings/${id}/decline`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to decline booking');
    }
    try {
      fallbackService.declineBooking(id, reason);
    } catch {
      // Ignore mirror error
    }
    return json.data;
  } catch (err) {
    console.warn('API declineBooking failed, falling back to local storage:', err);
    return fallbackService.declineBooking(id, reason);
  }
}

export async function fetchCreatorDashboard(creatorId?: string): Promise<DashboardData> {
  const query = creatorId ? `?creatorId=${encodeURIComponent(creatorId)}` : '';
  try {
    const res = await fetch(`${API_BASE}/creator/dashboard${query}`);
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch dashboard');
    }
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('API fetchCreatorDashboard failed, falling back to local storage:', err);
    return fallbackService.getCreatorDashboard(creatorId);
  }
}

export async function fetchCreators(): Promise<Creator[]> {
  try {
    const res = await fetch(`${API_BASE}/creators`);
    if (!res.ok) {
      throw new Error('Failed to fetch creators');
    }
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('API fetchCreators failed, falling back to local storage:', err);
    return fallbackService.getCreators();
  }
}

export async function resetDemoData(): Promise<{ success: boolean; message: string }> {
  fallbackService.reset();
  try {
    const res = await fetch(`${API_BASE}/reset`, {
      method: 'POST',
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || 'Failed to reset demo data');
    }
    return json;
  } catch {
    return { success: true, message: 'Local demo data reset to initial state' };
  }
}
