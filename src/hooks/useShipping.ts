import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Product } from '../types/product';
import type { ShippingCalculation } from '../types/shipping';
import { 
  findBestShippingZone, 
  parseProductDimensions,
  findApplicableDimensionRate,
  calculateShippingFee
} from '../utils/shipping';

export function useShipping(zipCode: string, products: Product[]): ShippingCalculation {
  const [calculation, setCalculation] = useState<ShippingCalculation>({
    fee: null,
    loading: false,
    error: null
  });

  useEffect(() => {
    if (!zipCode || !products.length) {
      setCalculation({ fee: null, loading: false, error: null });
      return;
    }

    const calculateShipping = async () => {
      setCalculation(prev => ({ ...prev, loading: true, error: null }));

      try {
        // Get all shipping zones
        const { data: zones, error: zonesError } = await supabase
          .from('shipping_zones')
          .select('*')
          .order('base_rate', { ascending: true });

        if (zonesError) throw zonesError;
        
        // Find applicable zone
        const applicableZones = zones?.filter(zone => 
          zipCode >= zone.zip_code_start && zipCode <= zone.zip_code_end
        ) || [];

        const bestZone = applicableZones[0]; // Take the cheapest applicable zone
        
        if (!bestZone) {
          setCalculation({
            fee: null,
            loading: false,
            error: 'Shipping not available for this ZIP code'
          });
          return;
        }

        // Get dimension rates
        const { data: dimensionRates, error: ratesError } = await supabase
          .from('dimension_rates')
          .select('*')
          .order('min_dimension', { ascending: true });

        if (ratesError) throw ratesError;
        if (!dimensionRates?.length) {
          setCalculation({
            fee: null,
            loading: false,
            error: 'No shipping rates available'
          });
          return;
        }

        // Calculate max dimension from all products
        const maxDimension = Math.max(
          ...products.flatMap(p => parseProductDimensions(p.dimensions))
        );

        const applicableRate = findApplicableDimensionRate(dimensionRates, maxDimension);
        if (!applicableRate) {
          setCalculation({
            fee: null,
            loading: false,
            error: 'Product dimensions exceed shipping limits'
          });
          return;
        }

        const fee = calculateShippingFee(bestZone.base_rate, applicableRate.rate_multiplier);
        
        setCalculation({
          fee,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error('Shipping calculation error:', err);
        setCalculation({
          fee: null,
          loading: false,
          error: 'Error calculating shipping'
        });
      }
    };

    calculateShipping();
  }, [zipCode, products]);

  return calculation;
}