"use client";

import { useTheme } from "@mui/material";
import NextTopLoader from "nextjs-toploader";

export const ProgressBar = () => {
  const theme = useTheme();
  return (
    <NextTopLoader
      color={theme.palette.primary.main}
      height={3}
      showSpinner={false}
      crawl
      speed={200}
      shadow={`0 0 10px ${theme.palette.primary.light}, 0 0 5px ${theme.palette.primary.light}`}
    />
  );
};
