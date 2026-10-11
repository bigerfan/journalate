"use client";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { usePathname } from "next/navigation";
import { dashboardConfig } from "../config";

type Props = {
  onMenuClick: () => void;
};

export function DashboardHeader({ onMenuClick }: Props) {
  const pathname = usePathname();

  const currentItem = dashboardConfig.navItems.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`)),
  );

  const title = currentItem?.title ?? "Dashboard";

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Toolbar sx={{ minHeight: "64px !important", gap: 2 }}>
        <IconButton
          onClick={onMenuClick}
          aria-label="Open navigation menu"
          sx={{ display: { md: "none" } }}
        >
          <MenuRoundedIcon />
        </IconButton>

        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        <Avatar
          sx={{
            width: 34,
            height: 34,
            bgcolor: "primary.main",
            fontSize: 14,
          }}
        >
          U
        </Avatar>
      </Toolbar>
    </AppBar>
  );
}
