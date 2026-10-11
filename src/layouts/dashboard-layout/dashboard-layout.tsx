"use client";

import { useState } from "react";
import { Box, Container, useMediaQuery, useTheme } from "@mui/material";
import { DashboardSidebar } from "./components/dashbaord-sidebar";
import { DashboardHeader } from "./components/dashboard-header";

type Props = {
  children: React.ReactNode;
};

export function DashboardLayout({ children }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  const closeSidebar = () => setMobileOpen(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <DashboardSidebar
        desktop={desktop}
        mobileOpen={mobileOpen}
        onClose={closeSidebar}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <DashboardHeader onMenuClick={() => setMobileOpen(true)} />

        <Box sx={{ flexGrow: 1, py: { xs: 2, md: 4 } }}>
          <Container maxWidth="xl">{children}</Container>
        </Box>
      </Box>
    </Box>
  );
}
