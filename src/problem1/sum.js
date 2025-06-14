// Assuming n is a positive integer
// The sum of the first n natural numbers is 1 + 2 + 3 + ... + n
// All results are less than Number.MAX_SAFE_INTEGER

/**
 * First way to sum to n using a loop
 * @param {number} n
 * @returns {number} sum
 */
const sum_to_n_1 = (n) => {
  // Loop through the numbers from 1 to n and add them to the sum
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

/**
 * Second way to sum to n using the formula for the sum of the first n natural numbers
 * @param {number} n
 * @returns {number} sum
 */
const sum_to_n_2 = (n) => {
  // The sum of the first n natural numbers is n * (n + 1) / 2
  return (n * (n + 1)) / 2;
};

/**
 * Third way to sum to n using recursion (slowest method)
 * Can be improved by using memoization
 * @param {number} n
 * @returns {number} sum
 */
const sum_to_n_3 = (n) => {
  if (n < 1) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }
  // Recursively call the function with n - 1
  return n + sum_to_n_3(n - 1);
};

/**
 * Third way to sum to n using recursion with memoization
 * @param {number} n
 * @param {object} memo
 * @returns {number} sum
 */
const sum_to_n_3_improved = (n, memo = {}) => {
  if (n < 1) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }
  // Check if the result is already memoized
  if (memo[n]) {
    return memo[n];
  }
  return n + sum_to_n_3_improved(n - 1, memo);
};

console.log(sum_to_n_1(5)); // 15
console.log(sum_to_n_2(5)); // 15
console.log(sum_to_n_3(5)); // 15
console.log(sum_to_n_3_improved(5)); // 15
