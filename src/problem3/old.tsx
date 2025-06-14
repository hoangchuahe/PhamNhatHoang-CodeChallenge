interface WalletBalance {
  currency: string;
  amount: number;
}
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  // 'formatted' is not a good name for a property, it should be 'formattedAmount'
  // In this case, it's not needed since it's just a formatted version of 'amount'
  formatted: string;
}

// Missing / unnecessary 'BoxProps' import
// With the current code, 'BoxProps' is just an alias for 'React.HTMLAttributes<HTMLDivElement>'
interface Props extends BoxProps {}

// Unnecessary type casting, 'React.FC<Props>' already infers the type of 'props'
const WalletPage: React.FC<Props> = (props: Props) => {
  // 'children' is not used, it should be removed
  // If 'children' is nto needed, it should be ignored with '_children' or omit it from the interface
  const { children, ...rest } = props;

  // Missing imports 'useWalletBalances' and 'usePrices' hooks
  const balances = useWalletBalances();
  const prices = usePrices();

  // 1. With this current setup:
  // - It's not reusable and can't be tested independently
  // - It will also be redefined on every render
  // 2. This function should be moved outside the component, preferably in a separate file
  // 3. Should also be simplified to a map for priority to be reusable
  // 4. Using blockchain with a type of any also defeats the purpose of TypeScript, it should be a string
  // 5. Logically, this should use 'currency' instead of 'blockchain' since it's the property in the WalletBalance interface and assuming it's unique, for actual blockchain, it should use the address instead to ensure uniqueness
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  // Missing import for 'useMemo'
  const sortedBalances = useMemo(() => {
    return (
      balances
        // Unnecessary type casting, it should be removed
        .filter((balance: WalletBalance) => {
          // 'blockchain' does not exist in the 'WalletBalance' interface, it should be replaced with 'currency'
          const balancePriority = getPriority(balance.blockchain);
          // 'lhsPriority' is not defined / should be replaced with balancePriority
          if (lhsPriority > -99) {
            // logically, we should look for balances that are greater than 0
            // replace 'balance.amount <= 0' with 'balance.amount > 0'
            if (balance.amount <= 0) {
              return true;
            }
          }
          return false;
        })
        .sort((lhs: WalletBalance, rhs: WalletBalance) => {
          // 'blockchain' does not exist in the 'WalletBalance' interface, it should be replaced with 'currency'
          const leftPriority = getPriority(lhs.blockchain);
          const rightPriority = getPriority(rhs.blockchain);
          // This can be simplified to return 'leftPriority - rightPriority' or 'rightPriority - leftPriority' for ascending / descending order
          if (leftPriority > rightPriority) {
            return -1;
          } else if (rightPriority > leftPriority) {
            return 1;
          }
        })
    );
    // 'prices' are not used in the function but is passed as a dependency, it should be removed
  }, [balances, prices]);

  // 1. This variable is not used, it should be removed
  // 2. Instead of looping through 'sortedBalances', we can format and return it from 'sortedBalances' or format it directly in the WalletRow component
  // Explanation: 'sortedBalance' will have a type of 'FormattedWalletBalance[]' after the sorting and filtering
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  // 1. Type mismatch for 'sortedBalances', the type is 'WalletBalance[]' but is casted to 'FormattedWalletBalance[]'
  // 2. Unnecessary type casting, it should be removed
  const rows = sortedBalances.map((balance: FormattedWalletBalance, index: number) => {
    // 'prices' may not have the currency, it should be checked before using it
    const usdValue = prices[balance.currency] * balance.amount;
    return (
      // Missing WalletRow import
      <WalletRow
        // 'classes' is not defined
        // can use module.css or passed as a prop
        className={classes.row}
        // 'index' is not a good key, it should be replaced with 'currency' assuming unique
        key={index}
        amount={balance.amount}
        usdValue={usdValue}
        // 'amount' can be formatted here if not in 'sortedBalances'
        // 'balance.amount.toFixed()' can be used here
        formattedAmount={balance.formatted}
      />
    );
  });

  return <div {...rest}>{rows}</div>;
};

function useMemo(arg0: () => any, arg1: any[]) {
  throw new Error('Function not implemented.');
}
