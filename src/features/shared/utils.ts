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

// Current local time in the format <input type="datetime-local"> expects.
export const localNow = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};
