/**
 * Distance calculation utilities using Haversine formula
 */

interface Coordinates {
  latitude: number;
  longitude: number;
}

const EARTH_RADIUS_MILES = 3959;
const EARTH_RADIUS_KM = 6371;

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param from Starting coordinates
 * @param to Ending coordinates
 * @param unit 'miles' or 'km'
 * @returns Distance in specified unit
 */
export const calculateDistance = (
  from: Coordinates,
  to: Coordinates,
  unit: 'miles' | 'km' = 'miles'
): number => {
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);
  const deltaLat = toRadians(to.latitude - from.latitude);
  const deltaLon = toRadians(to.longitude - from.longitude);

  const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const radius = unit === 'miles' ? EARTH_RADIUS_MILES : EARTH_RADIUS_KM;
  
  return radius * c;
};

/**
 * Convert degrees to radians
 */
const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

/**
 * Calculate total distance from an array of coordinate points
 */
export const calculateTotalDistance = (
  points: Coordinates[],
  unit: 'miles' | 'km' = 'miles'
): number => {
  if (points.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 0; i < points.length - 1; i++) {
    totalDistance += calculateDistance(points[i], points[i + 1], unit);
  }
  
  return parseFloat(totalDistance.toFixed(2));
};

/**
 * Check if point is within a certain radius
 */
export const isWithinRadius = (
  center: Coordinates,
  point: Coordinates,
  radiusMiles: number
): boolean => {
  const distance = calculateDistance(center, point, 'miles');
  return distance <= radiusMiles;
};
