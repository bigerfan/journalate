"use client";
import { createTheme } from "@mui/material/styles";
import { palette } from "./palette";
import { typography } from "./typography";
import * as components from "./components/index";

const theme = createTheme({
  palette,
  typography,
  components,
  shape: {
    borderRadius: 8,
  },
});

export default theme;
