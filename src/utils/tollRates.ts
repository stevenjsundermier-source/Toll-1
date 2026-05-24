/**
 * Denver Toll Rate Calculator
 * Supports I-25, US-36, I-270, E-470, T-Rex corridors
 */

interface TollRate {
  baseRate: number; // per mile
  peakMultiplier: number; // 7am-9am, 4pm-6pm weekdays
  offPeakMultiplier: number;
}

const TOLL_CORRIDORS: { [key: string]: TollRate } = {
  'I-25': {
    baseRate: 0.25,
    peakMultiplier: 1.5,
    offPeakMultiplier: 1.0
  },
  'US-36': {
    baseRate: 0.22,
    peakMultiplier: 1.6,
    offPeakMultiplier: 0.9
  },
  'I-270': {
    baseRate: 0.20,
    peakMultiplier: 1.4,
    offPeakMultiplier: 0.95
  },
  'E-470': {
    baseRate: 0.28,
    peakMultiplier: 1.3,
    offPeakMultiplier: 1.0
  },
  'T-Rex': {
    baseRate: 0.26,
    peakMultiplier: 1.5,
    offPeakMultiplier: 1.0
  }
};

const DENVER_CENTER = {
  latitude: 39.7392,
  longitude: -104.9903
};

const isPeakHours = (date: Date): boolean => {
  const hour = date.getHours();
  const dayOfWeek = date.getDay();
  // Monday-Friday
  if (dayOfWeek >= 1 && dayOfWeek <= 5) {
    // 7am-9am or 4pm-6pm
    return (hour >= 7 && hour < 9) || (hour >= 16 && hour < 18);
  }
  return false;
};

const detectCorridor = (latitude: number, longitude: number): string => {
  // Simplified corridor detection based on coordinates
  // In production, use Google Maps API or geofencing
  
  const latDiff = Math.abs(latitude - DENVER_CENTER.latitude);
  const lonDiff = Math.abs(longitude - DENVER_CENTER.longitude);
  
  if (latDiff < 0.1 && lonDiff < 0.1) {
    return 'I-25'; // Default to I-25 for downtown Denver
  }
  
  return 'I-25'; // Default corridor
};

export const calculateToll = (
  distanceMiles: number,
  corridor: string = 'I-25',
  timestamp: Date = new Date()
): number => {
  const rate = TOLL_CORRIDORS[corridor] || TOLL_CORRIDORS['I-25'];
  const multiplier = isPeakHours(timestamp) ? rate.peakMultiplier : rate.offPeakMultiplier;
  return parseFloat((distanceMiles * rate.baseRate * multiplier).toFixed(2));
};

export const getTollSummary = (
  totalDistance: number,
  corridor: string = 'I-25',
  startTime: Date = new Date(),
  endTime: Date = new Date()
) => {
  const toll = calculateToll(totalDistance, corridor, startTime);
  const durationMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);
  
  return {
    totalDistance: parseFloat(totalDistance.toFixed(2)),
    totalToll: toll,
    durationMinutes: Math.round(durationMinutes),
    corridor,
    isPeakHours: isPeakHours(startTime),
    averageSpeed: parseFloat((totalDistance / (durationMinutes / 60)).toFixed(2))
  };
};

export { DENVER_CENTER, detectCorridor };
