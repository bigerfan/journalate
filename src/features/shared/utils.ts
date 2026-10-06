import { Currency } from "../settings/schema";

export const getCurrencyFormatter = (
  currency: Currency,
  options?: Intl.NumberFormatOptions,
) => {
  const fixedCurr = currency == "USDC" || currency == "USDT" ? "USD" : currency;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: fixedCurr,
    ...options,
  });
};
