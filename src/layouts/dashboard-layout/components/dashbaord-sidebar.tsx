"use client";

import { usePathname } from "next/navigation";
import { Box, Divider, Drawer, List, Typography } from "@mui/material";
import { dashboardConfig } from "../config";
import { DashboardNavItem } from "./dashbaord-nav-item";

type Props = {
  mobileOpen: boolean;
  onClose: () => void;
  desktop: boolean;
};

const DRAWER_WIDTH = 260;

export function DashboardSidebar({ mobileOpen, onClose, desktop }: Props) {
  const pathname = usePathname();

  const content = (
    <Box sx={{ p: 2, height: "100%" }}>
      <Box
        sx={{
          height: 56,
          display: "flex",
          alignItems: "center",
          px: 1,
          mb: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {dashboardConfig.appName}
        </Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography
        variant="overline"
        color="text.secondary"
        sx={{ px: 2, mb: 1, display: "block" }}
      >
        Workspace
      </Typography>

      <List disablePadding>
        {dashboardConfig.navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/dashboard" &&
              pathname.startsWith(`${item.href}/`));

          return (
            <DashboardNavItem
              key={item.href}
              item={item}
              active={active}
              onNavigate={onClose}
            />
          );
        })}
      </List>
    </Box>
  );

  return (
    <Drawer
      variant={desktop ? "permanent" : "temporary"}
      open={desktop || mobileOpen}
      onClose={onClose}
      sx={{
        width: desktop ? DRAWER_WIDTH : undefined,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          bgcolor: "background.paper",
          borderRight: "1px solid",
          borderColor: "divider",
        },
      }}
    >
      {content}
    </Drawer>
  );
}
