import type { SvgIconComponent } from "@mui/icons-material";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import ShowChartRoundedIcon from "@mui/icons-material/ShowChartRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";

export type DashboardNavItem = {
  title: string;
  href: string;
  icon: SvgIconComponent;
};

export const dashboardConfig = {
  appName: "Journalate",

  navItems: [
    {
      title: "Overview",
      href: "/dashboard",
      icon: DashboardRoundedIcon,
    },
    {
      title: "Trades",
      href: "/trades",
      icon: ShowChartRoundedIcon,
    },
    // {
    //   title: "Trade Closes",
    //   href: "/closes",
    //   icon: ReceiptLongRoundedIcon,
    // },
    {
      title: "Settings",
      href: "/settings",
      icon: SettingsRoundedIcon,
    },
  ] satisfies DashboardNavItem[],
};
