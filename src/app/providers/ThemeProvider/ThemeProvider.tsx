import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";

import { Button, createTheme, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { ReactNode } from "react";

const theme = createTheme({
  defaultRadius: "sm",
  components: {
    Button: Button.extend({
      defaultProps: {
        size: "sm"
      },
    }),
  },
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <Notifications />
      {children}
    </MantineProvider>
  );
}
