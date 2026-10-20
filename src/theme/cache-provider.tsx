"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ReactNode } from "react";
import stylisRTLPlugin from "stylis-plugin-rtl";

export const CacheProvider = ({ children }: { children: ReactNode }) => {
  return (
    <AppRouterCacheProvider
      options={{ key: "muirtl", stylisPlugins: [stylisRTLPlugin] }}
    >
      {children}
    </AppRouterCacheProvider>
  );
};
