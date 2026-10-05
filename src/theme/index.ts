"use client";
import { createTheme } from "@mui/material/styles";
import { palette } from "./palette";
import { typography } from "./typography";
import { MuiButton } from "./components/button";

const theme = createTheme({
  palette,
  typography,
  components: {
    MuiButton,
  },
  shape: {
    borderRadius: 8,
  },
});

export default theme;
