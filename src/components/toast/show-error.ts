import { ApiError } from "@/lib/api";
import { toast } from "sonner";

export const showError = (
  error: unknown,
  fallback = "Something went wrong.",
) => {
  console.error(error);
  toast.error(error instanceof ApiError ? error.message : fallback);
};
