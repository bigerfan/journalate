import type { Side } from "./types";

const valid = (n: unknown): n is number =>
  typeof n === "number" && Number.isFinite(n);

/**
 * Size so that hitting the stop loses exactly `riskPct` of equity.
 * Assumes 1 unit moves 1 quote-currency per 1 price point (spot / linear crypto).
 * Forex and futures need a pip/contract value on top of this.
 */
export function suggestedSize(
  equity: number,
  riskPct: unknown,
  entry: unknown,
  stop: unknown,
): number {
  if (!valid(riskPct) || !valid(entry) || !valid(stop)) return 0;
  const distance = Math.abs(entry - stop);
  if (distance <= 0 || equity <= 0) return 0;
  return (equity * (riskPct / 100)) / distance;
}

export function riskAmount(
  size: unknown,
  entry: unknown,
  stop: unknown,
): number {
  if (!valid(size) || !valid(entry) || !valid(stop)) return 0;
  return size * Math.abs(entry - stop);
}

export function rewardRisk(
  side: Side,
  entry: unknown,
  stop: unknown,
  target: unknown,
): number | null {
  if (!valid(entry) || !valid(stop) || !valid(target)) return null;
  const risk = Math.abs(entry - stop);
  if (risk <= 0) return null;
  const reward = side === "long" ? target - entry : entry - target;
  return reward / risk;
}
