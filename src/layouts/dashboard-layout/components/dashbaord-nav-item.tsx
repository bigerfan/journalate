"use client";

import Link from "next/link";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import type { DashboardNavItem } from "../config";

type Props = {
  item: DashboardNavItem;
  active: boolean;
  onNavigate?: () => void;
};

export function DashboardNavItem({ item, active, onNavigate }: Props) {
  const Icon = item.icon;

  return (
    <ListItemButton
      component={Link}
      href={item.href}
      selected={active}
      onClick={onNavigate}
      sx={{
        minHeight: 46,
        px: 2,
        mb: 0.5,
        borderRadius: 2,
        color: active ? "primary.main" : "text.secondary",
        "&.Mui-selected": {
          bgcolor: "action.selected",
          color: "primary.main",
        },
        "&.Mui-selected:hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 38,
          color: "inherit",
        }}
      >
        <Icon fontSize="small" />
      </ListItemIcon>

      <ListItemText
        primary={item.title}
        sx={{
          fontSize: 14,
          fontWeight: active ? 600 : 500,
        }}
      />
    </ListItemButton>
  );
}
