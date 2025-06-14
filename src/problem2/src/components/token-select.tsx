import { SelectProps, SelectValue } from '@radix-ui/react-select';
import { FC } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { TokenOption } from '@/types/token';

type TokenSelectProps = SelectProps & {
  options: TokenOption[];
  placeholder?: string;
  className?: string;
};

const TokenSelect: FC<TokenSelectProps> = ({
  options,
  placeholder,
  className,
  ...props
}) => {
  return (
    <Select {...props}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map(({ currency, price, icon }) => (
          <SelectItem key={currency} value={currency}>
            <div className="flex items-center gap-2 text-left">
              {icon ? (
                <img
                  src={icon}
                  alt={currency}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-neutral-500" />
              )}
              <div>
                <p className="font-semibold">{currency}</p>
                <p className="text-sm text-neutral-500">
                  {price.toFixed(6)} USD
                </p>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TokenSelect;
