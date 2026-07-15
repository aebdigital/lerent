/**
 * Km allowance policy by rental length.
 *
 * The source of truth is the backend table in server/utils/kmPolicy.js of the
 * CarFlow repo; the backend also serves it at
 * GET /api/public/users/{email}/km-allowance?days=N for verification.
 * This local copy exists so no extra API request is needed on date selection.
 */

// Tier table — `duration` matches the carDetails.duration.* i18n keys used
// for display; a 1-day rental falls into the first tier, 30+ into the last.
export const KM_ALLOWANCE_TIERS = [
  { duration: '2-3days', maxDays: 3, kmPerDay: 250 },
  { duration: '4-10days', maxDays: 10, kmPerDay: 210 },
  { duration: '11-20days', maxDays: 20, kmPerDay: 180 },
  { duration: '21-29days', maxDays: 29, kmPerDay: 150 },
  { duration: '30-60days', maxDays: Infinity, kmPerDay: 125 }
];

// Day rounding must match the backend exactly: Math.max(1, Math.ceil(ms / 86400000))
export const getKmAllowance = (pickupDate, returnDate) => {
  if (!pickupDate || !returnDate) return null;
  const days = Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / 86400000));
  const tier = KM_ALLOWANCE_TIERS.find((t) => days <= t.maxDays);
  return { days, kmPerDay: tier.kmPerDay, totalKm: tier.kmPerDay * days };
};

// Slovak-style number formatting: "1 050"
export const formatKm = (km) => km.toLocaleString('sk-SK');

// Slovak-style price formatting: "0,50 €/km"
export const formatExcessKmPrice = (price) =>
  `${price.toLocaleString('sk-SK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €/km`;
