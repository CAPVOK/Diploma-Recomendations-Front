import { Provider as StoreProvider } from "react-redux";

import { AppInit } from "./AppInit";
import { AppRouterProvider } from "./providers/RouterProvider";
import { ThemeProvider } from "./providers/ThemeProvider/ThemeProvider";

import { Suspense } from "react";

import { store } from "@/shared/config/store";
import { PageLoader } from "@/widgets/PageLoader";

import "./styles/main.css";

function App() {
  return (
    <StoreProvider store={store}>
      <ThemeProvider>
        <AppInit />
        <Suspense fallback={<PageLoader />}>
          <AppRouterProvider />
        </Suspense>
      </ThemeProvider>
    </StoreProvider>
  );
}

export default App;
