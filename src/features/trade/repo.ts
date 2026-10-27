import { api } from "@/lib/api";
import type { Close, NewClose, NewTrade, Trade } from "./types";

// Same method names and shapes as the localStorage version, so no component changes.
export const tradeRepo = {
  list: () => api<Trade[]>("/api/trades"),
  create: (input: NewTrade) =>
    api<Trade>("/api/trades", { method: "POST", body: JSON.stringify(input) }),
  update: (id: string, input: NewTrade) =>
    api<Trade>(`/api/trades/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),
  remove: (id: string) => api<void>(`/api/trades/${id}`, { method: "DELETE" }),
};

export const closeRepo = {
  list: () => api<Close[]>("/api/closes"),
  create: (input: NewClose) =>
    api<Close>(`/api/trades/${input.tradeId}/closes`, {
      method: "POST",
      body: JSON.stringify(input),
    }),
  remove: (id: string) => api<void>(`/api/closes/${id}`, { method: "DELETE" }),
};
