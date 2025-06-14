import { useMemo } from 'react';
declare function useMemo<T>(factory: () => T, deps: any[]): T;
import { useWalletBalances } from './hooks/useWalletBalances';
declare function useWalletBalances(): WalletBalance[];
import { usePrices } from './hooks/usePrices';
declare function usePrices(): Record<string, number>;
import { WalletRow } from './WalletRow';
interface WalletRowProps {
  amount: number;
  usdValue: number;
  formattedAmount: string;
  className?: string;
}
declare function WalletRow(props: WalletRowProps): JSX.Element;

// @ts-expect-error - Mockfile
import classes from './WalletPage.module.css';

interface WalletBalance {
  currency: string;
  amount: number;
}

interface Props extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  // Add more props if needed
}

// Move 'priorityMap' outside the component and can be imported from a separate file
const priorityMap: Record<string, number> = {
  // All keys are converted from name to currency to ensure consistency and uniqueness, assuming it's unique
  // For crypto, this should use the address instead to ensure uniqueness
  osmo: 100,
  eth: 50,
  arb: 30,
  zil: 20,
  neo: 20,
};

// Move 'getPriority' outside the component and can be imported from a separate file
const getPriority = (currency: string): number => {
  return priorityMap[currency] ?? -99;
};

// 'isValidBalance' can be imported from a separate file
const isValidBalance = (balance: WalletBalance): boolean => {
  return getPriority(balance.currency) > -99 && balance.amount > 0;
};

// 'sortBalance' can be imported from a separate file
const sortBalance = (
  balances: WalletBalance[],
  direction: 'asc' | 'desc' = 'desc'
): WalletBalance[] => {
  return balances.sort((lhs, rhs) => {
    return (direction === 'asc' ? 1 : -1) * (getPriority(rhs.currency) - getPriority(lhs.currency));
  });
};

const WalletPage: React.FC<Props> = (props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const sortedBalances = useMemo(() => {
    const filtered = balances.filter(isValidBalance);
    return sortBalance(filtered);
  }, [balances]);

  const rows = sortedBalances.map((balance) => {
    const usdValue = (prices[balance.currency] ?? 0) * balance.amount;
    return (
      <WalletRow
        // Use 'currency' instead of 'blockchain'
        key={balance.currency}
        // Use 'classes' from module.css
        className={classes.row}
        amount={balance.amount}
        // Should round to 2 decimal places instead of 0 decimal places
        // Further improvement should retrieve the decimal places from the currency itself
        formattedAmount={balance.amount.toFixed(2)}
        usdValue={usdValue}
      />
    );
  });

  return <div {...props}>{rows}</div>;
};

// Export WalletPage
export default WalletPage;
