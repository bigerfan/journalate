import SimpleLayout from "@/layouts/simple-layout/simple-layout";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const Layout = ({ children }: Props) => {
  return <SimpleLayout>{children}</SimpleLayout>;
};

export default Layout;
