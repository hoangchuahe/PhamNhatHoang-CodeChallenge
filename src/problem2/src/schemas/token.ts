import { z } from 'zod';

export const tokenExchangeSchema = z.object({
  from: z.object({
    currency: z.string().min(1, {
      message: 'You must select a token to exchange',
    }),
    amount: z
      .number({
        message: 'You must enter a valid amount to exchange',
      })
      .positive({
        message: 'Amount must be greater than 0',
      }),
  }),
  to: z.object({
    currency: z.string().min(1, {
      message: 'You must select a token to receive',
    }),
    amount: z
      .number({
        message: 'You must enter a valid amount to receive',
      })
      .positive({
        message: 'Amount must be greater than 0',
      }),
  }),
});

export type TokenExchangeSchema = z.infer<typeof tokenExchangeSchema>;
