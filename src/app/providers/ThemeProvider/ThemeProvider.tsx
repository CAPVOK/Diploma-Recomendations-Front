import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ReactNode } from "react";
import { mantineCssVariableResolver } from "./cssVariableResolver.ts";
import { mantineTheme } from "./theme.ts";

export function ThemeProvider({ children }: { children: ReactNode }) {
  /* const theme = createTheme({}); */

  return (
    <MantineProvider
      theme={mantineTheme}
      cssVariablesResolver={mantineCssVariableResolver}
    >
      <Notifications />
      {children}
    </MantineProvider>
  );
}
