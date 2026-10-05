// apps/web/src/theme/palette.ts
import { PaletteOptions } from "@mui/material/styles";

export const palette: PaletteOptions = {
  mode: "dark", // your palette skews dark (black bg, off-white text) — flip to 'light' if you want the opposite

  primary: {
    main: "#F65F09", // Primary Orange
    dark: "#8C350C", // Dark Orange
    light: "#F98A44", // lightened tint for hover/light states
    contrastText: "#F3EDED", // Off White — readable on orange
  },

  secondary: {
    main: "#8F8888", // Muted Gray
    dark: "#625D5C", // Medium Gray
    light: "#CDC0BB", // Light Gray
    contrastText: "#05080B", // Primary Black
  },

  background: {
    default: "#05080B", // Primary Black
    paper: "#39312F", // Dark Gray — cards/surfaces sit slightly lighter than the page
  },

  text: {
    primary: "#F3EDED", // Off White
    secondary: "#CDC0BB", // Light Gray — for less prominent text
    disabled: "#625D5C", // Medium Gray
  },

  divider: "#39312F", // Dark Gray

  action: {
    hover: "rgba(246, 95, 9, 0.08)", // Primary Orange, low opacity
    selected: "rgba(246, 95, 9, 0.16)",
    disabled: "#625D5C",
    disabledBackground: "#39312F",
  },
};
