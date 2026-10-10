"use client";

import type { CSSProperties } from "react";
import { Toaster } from "sonner";
import { useTheme } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

// Render once in the root layout, inside <ThemeProvider>.
// Everything visual comes from the MUI theme, so changing the theme restyles the toasts too.
export function AppToaster() {
  const theme = useTheme();
  const { palette } = theme;

  // In MUI's default dark theme the page and Paper share almost the same color, so the toast would
  // blend into the page. Lift it slightly in dark mode; in light mode the border and shadow are enough.
  const surface =
    palette.mode === "dark"
      ? `color-mix(in srgb, ${palette.background.paper}, white 8%)`
      : palette.background.paper;

  // Sonner reads these CSS variables for its base colors and shape.
  const style = {
    "--normal-bg": surface,
    "--normal-text": palette.text.primary,
    "--normal-border": palette.divider,
    "--border-radius": `${theme.shape.borderRadius}px`,
  } as CSSProperties;

  return (
    <Toaster
      theme={palette.mode}
      position="top-left"
      closeButton
      style={style}
      toastOptions={{ style: { fontFamily: theme.typography.fontFamily } }}
      // Status colors come from the MUI palette, not from Sonner's own (richColors would use Sonner's).
      icons={{
        success: (
          <CheckCircleOutlineIcon
            fontSize="small"
            sx={{ color: "success.main" }}
          />
        ),
        error: (
          <ErrorOutlineIcon fontSize="small" sx={{ color: "error.main" }} />
        ),
        warning: (
          <WarningAmberIcon fontSize="small" sx={{ color: "warning.main" }} />
        ),
        info: <InfoOutlinedIcon fontSize="small" sx={{ color: "info.main" }} />,
      }}
    />
  );
}
