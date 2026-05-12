import { useMemo, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";

import Navbar from "./navbar";
import Footer from "./Footer";
import { getTheme } from "../theme";

// In your Layout.jsx
function Layout({ children }) {
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="min-h-screen flex flex-col">
        <Navbar mode={mode} setMode={setMode} />

        <main className="flex-1 px-3 pt-20 sm:px-4 sm:pt-24 lg:px-6">
          {children && typeof children === 'function'
            ? children(mode)
            : children}
        </main>

        <Footer mode={mode} />
      </div>
    </ThemeProvider>
  );
}

export default Layout;
