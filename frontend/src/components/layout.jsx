import { useMemo, useState } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";

import Navbar from "./navbar";
import { getTheme } from "../theme";

// In your Layout.jsx
function Layout({ children }) {
  const [mode, setMode] = useState("light");
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar mode={mode} setMode={setMode} />
      
      <div style={{ padding: "16px" }}>
        {/* Pass mode as prop to children */}
        {children && typeof children === 'function' 
          ? children(mode) 
          : children}
      </div>
    </ThemeProvider>
  );
}

export default Layout;