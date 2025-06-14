import axios from 'axios';

import { TokenOption } from '@/components/token-select';
import appConfig from '@/constants/config';
import { Token } from '@/types/token';

export const getPrices = async () => {
  const res = await axios.get<Token[]>(appConfig.pricesUrl, {
    headers: { 'Content-Type': 'application/json' },
  });

  const latestPrice = res.data
    .sort((lhs, rhs) => {
      // Sort by date in descending order
      return new Date(rhs.date).getTime() - new Date(lhs.date).getTime();
    })
    .reduce((acc, token) => {
      if (acc.has(token.currency)) return acc;

      acc.set(token.currency, {
        currency: token.currency,
        price: token.price,
        icon: `${appConfig.tokenIconUrl}/${token.currency}.svg`,
      });

      return acc;
    }, new Map<string, TokenOption>());

  return Array.from(latestPrice.values());
};
