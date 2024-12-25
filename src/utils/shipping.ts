import type { ShippingZone, DimensionRate } from '../types/shipping';

export function findBestShippingZone(zones: ShippingZone[]): ShippingZone | null {
  if (!zones.length) return null;
  return zones.reduce((best, current) => 
    current.base_rate < best.base_rate ? current : best
  );
}

export function parseProductDimensions(dimensionString: string): number[] {
  const matches = dimensionString.match(/\d+(\.\d+)?/g);
  return matches ? matches.map(d => parseFloat(d)) : [0];
}

export function findApplicableDimensionRate(
  dimensionRates: DimensionRate[], 
  maxDimension: number
): DimensionRate | null {
  return dimensionRates.find(rate => 
    maxDimension >= rate.min_dimension && 
    maxDimension <= rate.max_dimension
  ) || null;
}

export function calculateShippingFee(
  baseRate: number, 
  rateMultiplier: number
): number {
  return Number((baseRate * rateMultiplier).toFixed(2));
}