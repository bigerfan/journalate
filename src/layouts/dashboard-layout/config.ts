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
      title: "نمای کلی",
      href: "/dashboard",
      icon: DashboardRoundedIcon,
    },
    {
      title: "معاملات",
      href: "/trades",
      icon: ShowChartRoundedIcon,
    },
    // {
    //   title: "معاملات بسته‌شده",
    //   href: "/closes",
    //   icon: ReceiptLongRoundedIcon,
    // },
    {
      title: "تنظیمات",
      href: "/settings",
      icon: SettingsRoundedIcon,
    },
  ] satisfies DashboardNavItem[],
};
