import { useEffect, useMemo, useState } from 'react';

import { useToast } from '@/hooks/use-toast';
import { getPrices } from '@/services/price';
import { TokenOption } from '@/types/token';

export const usePrices = () => {
  const { toast } = useToast();
  const [prices, setPrices] = useState<TokenOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await getPrices();
        setPrices(response);
      } catch (error) {
        const parsed =
          error instanceof Error
            ? error.message
            : 'An error occurred, please try again';
        toast({
          title: 'Failed to fetch prices',
          description: parsed,
        });
      }
      setLoading(false);
    };

    fetchPrices();
  }, []);

  const priceMap = useMemo(() => {
    return prices.reduce((acc, price) => {
      acc.set(price.currency, price.price);
      return acc;
    }, new Map<string, number>());
  }, [prices]);

  return { prices, priceMap, loading };
};
