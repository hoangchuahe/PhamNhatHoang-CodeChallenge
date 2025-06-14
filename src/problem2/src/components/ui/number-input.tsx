import {
  ChangeEvent,
  ComponentProps,
  FocusEvent,
  forwardRef,
  useEffect,
  useState,
} from 'react';

import { cn, parseNumber } from '@/lib/utils';

export type NumberInputProps = Omit<
  ComponentProps<'input'>,
  'value' | 'onChange' | 'type'
> & {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
};

const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      value,
      onChange,
      onBlur,
      min = Number.MIN_SAFE_INTEGER,
      max = Number.MAX_SAFE_INTEGER,
      className,
      ...props
    },
    ref,
  ) => {
    const [internalValue, setInternalValue] = useState(value?.toString() || '');

    const onInternalChange = (e: ChangeEvent<HTMLInputElement>) => {
      setInternalValue(e.target.value);
    };

    const onInternalBlur = (e: FocusEvent<HTMLInputElement>) => {
      const newValue = parseNumber(internalValue, min, max);
      setInternalValue(newValue.toString());
      onChange(newValue);
      onBlur?.(e);
    };

    useEffect(() => {
      if (!value) return;
      const newValue = parseNumber(value.toString(), min, max);
      setInternalValue(newValue.toString());
    }, [value, min, max]);

    return (
      <input
        className={cn(
          'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
          className,
        )}
        value={internalValue}
        onChange={onInternalChange}
        onBlur={onInternalBlur}
        ref={ref}
        pattern="^-?[0-9]+(\.[0-9]+)?$"
        {...props}
      />
    );
  },
);

export default NumberInput;
