export type BookingStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export type GigCategory =
  | 'All'
  | 'Design'
  | 'Video'
  | 'Writing'
  | 'Programming'
  | 'Marketing'
  | 'Photography'
  | 'Music'
  | 'Education'
  | 'Other';

export interface Creator {
  id: string;
  name: string;
  avatar: string;
  bio?: string;
  title?: string;
  rating?: number;
  totalGigs?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Gig {
  id: string;
  creatorId: string;
  creator?: Creator;
  title: string;
  category: string;
  description: string;
  rate: number;
  availability: boolean;
  createdAt: string;
  updatedAt: string;
  rankingScore?: number;
}

export interface Booking {
  id: string;
  gigId: string;
  creatorId: string;
  clientName: string;
  clientEmail?: string;
  projectDescription: string;
  requestedDate: string;
  status: BookingStatus;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  gig?: Gig;
  creator?: Creator;
}

export interface DashboardMetrics {
  totalGigs: number;
  pendingRequests: number;
  acceptedRequests: number;
  declinedRequests: number;
  totalPipelineValue: number;
}

export interface DashboardData {
  creator: Creator;
  metrics: DashboardMetrics;
  gigs: Gig[];
  bookings: Booking[];
}

export interface CreateGigInput {
  title: string;
  category: string;
  description: string;
  rate: number;
  availability: boolean;
  creatorId?: string;
  creatorName?: string;
}

export interface CreateBookingInput {
  gigId: string;
  clientName: string;
  clientEmail?: string;
  projectDescription: string;
  requestedDate: string;
}

export interface GigFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  availability?: 'all' | 'available_only';
  sortBy?: 'relevant' | 'newest' | 'price_asc' | 'price_desc';
}
