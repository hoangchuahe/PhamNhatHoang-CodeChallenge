import { zodResolver } from '@hookform/resolvers/zod';
import {
  ArrowLeftRightIcon,
  ArrowRightIcon,
  LoaderCircleIcon,
} from 'lucide-react';
import { FC, useMemo } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';

import TokenSelect from '@/components/token-select';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import NumberInput from '@/components/ui/number-input';
import { usePrices } from '@/hooks/use-prices';
import { useToast } from '@/hooks/use-toast';
import { wait } from '@/lib/utils';
import { TokenExchangeSchema, tokenExchangeSchema } from '@/schemas/token';
import { TokenOption } from '@/types/token';

type TokenFormProps = {
  form: UseFormReturn<TokenExchangeSchema>;
  priceMap: Map<string, number>;
  options: TokenOption[];
  disabled?: boolean;
};

const ToForm: FC<TokenFormProps> = ({ form, priceMap, options, disabled }) => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <FormField
        name="to.currency"
        control={form.control}
        disabled={options.length === 0 || disabled}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>To</FormLabel>
              <FormControl>
                <TokenSelect
                  {...field}
                  onValueChange={(value) => {
                    field.onChange(value);

                    if (form.getValues('from.currency') === value) {
                      // Don't allow the same currency in both fields
                      form.setValue('from.currency', '');
                      return;
                    }

                    const toPrice = priceMap.get(value);
                    const fromPrice = priceMap.get(
                      form.getValues('from.currency'),
                    );

                    if (toPrice && fromPrice) {
                      // Prioritize updating the "To" field when changing the currency
                      form.setValue(
                        'to.amount',
                        (form.getValues('from.amount') * fromPrice) / toPrice,
                      );
                    }
                  }}
                  options={options}
                  placeholder="Select a token"
                  className="h-12"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        name="to.amount"
        control={form.control}
        disabled={!form.watch('to.currency') || disabled}
        render={({ field }) => {
          return (
            <FormItem className="w-full">
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <NumberInput
                  {...field}
                  onChange={(value) => {
                    field.onChange(value);

                    const toPrice = priceMap.get(form.getValues('to.currency'));
                    const fromPrice = priceMap.get(
                      form.getValues('from.currency'),
                    );

                    // If changing the amount in the "To" field, update the "From" field
                    if (toPrice && fromPrice) {
                      form.setValue(
                        'from.amount',
                        (value * toPrice) / fromPrice,
                      );
                    }
                  }}
                  min={0}
                  placeholder="0.001"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};

const FromForm: FC<TokenFormProps> = ({
  form,
  priceMap,
  options,
  disabled,
}) => {
  return (
    <div className="flex flex-col gap-5 w-full">
      <FormField
        name="from.currency"
        control={form.control}
        disabled={options.length === 0 || disabled}
        render={({ field }) => {
          return (
            <FormItem>
              <FormLabel>From</FormLabel>
              <TokenSelect
                {...field}
                onValueChange={(value) => {
                  field.onChange(value);

                  if (form.getValues('to.currency') === value) {
                    // Don't allow the same currency in both fields
                    form.setValue('to.currency', '');
                    return;
                  }

                  const toPrice = priceMap.get(form.getValues('to.currency'));
                  const fromPrice = priceMap.get(value);

                  if (toPrice && fromPrice) {
                    // Prioritize updating the "From" field when changing the currency
                    form.setValue(
                      'to.amount',
                      (form.getValues('from.amount') * fromPrice) / toPrice,
                    );
                  }
                }}
                options={options}
                placeholder="Select a token"
                className="h-12"
              />
              <FormMessage />
            </FormItem>
          );
        }}
      />
      <FormField
        name="from.amount"
        control={form.control}
        disabled={!form.watch('from.currency') || disabled}
        render={({ field }) => {
          return (
            <FormItem className="w-full">
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <NumberInput
                  {...field}
                  onChange={(value) => {
                    field.onChange(value);

                    const toPrice = priceMap.get(form.getValues('to.currency'));
                    const fromPrice = priceMap.get(
                      form.getValues('from.currency'),
                    );

                    // If changing the amount in the "From" field, update the "To" field
                    if (toPrice && fromPrice) {
                      form.setValue('to.amount', (value * fromPrice) / toPrice);
                    }
                  }}
                  min={0}
                  placeholder="0.001"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};

const ExchangeForm = () => {
  const form = useForm<TokenExchangeSchema>({
    mode: 'all',
    resolver: zodResolver(tokenExchangeSchema),
    defaultValues: {
      from: {
        currency: '',
        amount: 0,
      },
      to: {
        currency: '',
        amount: 0,
      },
    },
  });

  const { toast } = useToast();
  const { prices, priceMap, loading } = usePrices();

  const fromCurrency = form.watch('from.currency');
  const toCurrency = form.watch('to.currency');

  const exchangeRate = useMemo(() => {
    const fromPrice = priceMap.get(fromCurrency);
    const toPrice = priceMap.get(toCurrency);

    return fromPrice && toPrice ? fromPrice / toPrice : 0;
  }, [fromCurrency, toCurrency, priceMap]);

  const onSubmit = async (data: TokenExchangeSchema) => {
    try {
      await wait(1_000);
      toast({
        title: 'Tokens exchanged successfully',
        description: `Exchanged ${data.from.amount} ${data.from.currency} for ${data.to.amount} ${data.to.currency}`,
      });
      form.reset();
    } catch (error) {
      const parsed =
        error instanceof Error
          ? error.message
          : 'An error occurred, please try again';
      toast({
        title: 'Failed to exchange tokens',
        description: parsed,
      });
    }
  };

  const onSwap = () => {
    const from = form.getValues('from');
    const to = form.getValues('to');

    form.setValue('from', to);
    form.setValue('to', from);
  };

  return (
    <Form {...form}>
      <form
        className="border p-4 rounded-md max-w-2xl w-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <h2 className="text-xl font-semibold">Token Exchange</h2>
        <div className="flex justify-between gap-5 lg:gap-10 mt-5 flex-col lg:flex-row">
          <FromForm
            form={form}
            priceMap={priceMap}
            options={prices}
            disabled={loading || form.formState.isSubmitting}
          />
          <div className="self-stretch flex flex-col justify-center items-center gap-2">
            <p className="text-nowrap flex items-center gap-2">
              1
              <ArrowRightIcon className="w-6 h-6 text-neutral-500" />
              {exchangeRate.toFixed(6)}
            </p>
            <Button
              type="button"
              onClick={onSwap}
              size="sm"
              variant="secondary"
              disabled={loading || form.formState.isSubmitting}
            >
              <ArrowLeftRightIcon className="w-6 h-6" />
              Swap
            </Button>
          </div>
          <ToForm
            form={form}
            priceMap={priceMap}
            options={prices}
            disabled={loading || form.formState.isSubmitting}
          />
        </div>
        <Button
          className="w-full mt-10"
          type="submit"
          disabled={
            loading || form.formState.isSubmitting || !form.formState.isValid
          }
        >
          {form.formState.isSubmitting ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : (
            'Exchange'
          )}
        </Button>
      </form>
    </Form>
  );
};

export default ExchangeForm;
