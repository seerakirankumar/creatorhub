# Product Decisions (CreatorHub)

## DP1 — Rejection

### Decision
When a creator declines a booking request, the booking transitions to `DECLINED` status and is permanently preserved in the platform database rather than deleted. The client retains full visibility of the declined request within their "My Bookings" portal, accompanied by the creator's decline reason and immediate recovery actions: `[ Browse Similar Gigs ]` and `[ Explore Marketplace ]`.

### How It Behaves in the Application
- The creator clicks "Decline" in the Creator Dashboard and may optionally provide an explanation note.
- The booking status updates to `DECLINED`, recording the rejection timestamp and reason.
- When the client opens `/my-bookings`, the booking is displayed under the "Declined" filter with a clear negative status indicator and icon.
- Two prominent buttons (`[ Browse Similar Gigs ]` and `[ Explore Marketplace ]`) allow the client to instantly discover alternative creators in the same category with pre-filled filters.

### Why
Deleting declined bookings leaves clients confused about what happened to their project inquiry and removes any audit trail for dispute resolution. Retaining the declined booking while immediately offering similar recommendations prevents churn and preserves trust, transforming a negative rejection into a seamless rediscovery journey.

---

## DP2 — Double Booking

### Decision
Multiple clients are permitted to submit `PENDING` booking requests for the same gig concurrently. However, the instant a creator accepts one booking request, the gig is atomically marked as unavailable, all other competing `PENDING` requests for that gig are automatically transitioned to `DECLINED`, and any subsequent booking attempts are rejected with an HTTP 409 Conflict.

### How It Behaves in the Application
- A gig can accumulate multiple pending requests while the creator reviews project scopes and client requirements.
- When the creator clicks "Accept" on a pending request, the backend executes an atomic transaction:
  1. The selected booking transitions to `ACCEPTED`.
  2. The gig's `availability` status is set to `false`.
  3. Any other pending requests for that exact gig are automatically set to `DECLINED` with the reason: *"Gig booked by another confirmed client request."*
- If another user attempts to book the gig while it is unavailable, the backend returns HTTP 409 Conflict: *"This gig is currently unavailable. Please explore similar services."*

### Why
Allowing concurrent pending requests maximizes creator pipeline utilization because some inquiries may fall through or prove incompatible during review. Automating the closure of competing pending requests and marking the gig unavailable guarantees creators are never overcommitted, guarantees atomic consistency, and prevents race conditions without relying solely on frontend state.

---

## DP3 — Discovery

### Decision
Marketplace search and gig discovery utilize a deterministic multi-factor composite ranking algorithm that balances relevance, booking availability, recent platform activity, and an affirmative boost for emerging young creators.

### How It Behaves in the Application
Every gig is scored using the deterministic formula:
`Ranking Score = Relevance Score + Availability Score + Recency Score + New Creator Boost`
- **Relevance Score (0–50 points)**: Exact search matches in title award 50 points; partial matches in description, skills, or category award 25–35 points.
- **Availability Score (40 points)**: Gigs marked `available: true` receive 40 points, ensuring bookable inventory always ranks above currently occupied gigs.
- **Recency Score (0–20 points)**: Gigs created or updated within the last 7 to 30 days receive a decayed bonus up to 20 points, rewarding active creators.
- **New Creator Boost (15 points)**: Creators with 2 or fewer published gigs receive a 15-point discovery bonus.
Users can switch between "Most Relevant" (the composite discovery algorithm), "Newest", "Price: Low to High", and "Price: High to Low".

### Why
Relying solely on price sorting or review volume causes winner-take-all dynamics where veteran creators monopolize the first page, discouraging new young creators. Combining search relevance and real-time availability with an explicit new-creator boost creates an equitable, high-conversion discovery experience where clients find active talent immediately and rising creators get fair visibility.
