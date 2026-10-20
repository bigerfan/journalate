import localFont from "next/font/local";

export const estedad = localFont({
  src: [
    {
      path: "../../public/fonts/estedad/Estedad-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/estedad/Estedad-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/estedad/Estedad-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/estedad/Estedad-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-estedad",
  display: "swap",
});
