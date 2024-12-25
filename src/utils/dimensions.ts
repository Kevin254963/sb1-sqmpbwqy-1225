import type { Dimensions } from '../types/product';

export function formatDimensions(dimensions: Dimensions): string {
  return `${dimensions.length}x${dimensions.width}x${dimensions.height}`;
}

export function parseDimensions(dimensionString: string): Dimensions {
  const [length = '0', width = '0', height = '0'] = dimensionString.split('x');
  return {
    length,
    width,
    height
  };
}