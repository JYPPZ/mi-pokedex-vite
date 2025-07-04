import { Outlet } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import { Navigation } from "@/components/navigation";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Toaster />
    </ThemeProvider>
  );
}

export default App