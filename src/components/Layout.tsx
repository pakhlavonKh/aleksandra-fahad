import { Outlet } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "../lib/query-client";

const queryClient = getQueryClient();

function Layout() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <header className="border-b">
          <nav className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">Паспорт на свадьбу</h1>
          </nav>
        </header>
        <main className="flex-1 container mx-auto px-4 py-6">
          <Outlet />
        </main>
        <footer className="border-t mt-12">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>made with ❤ by <a href="https://invito.live" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">invito.live</a></p>
          </div>
        </footer>
      </div>
    </QueryClientProvider>
  );
}

export default Layout;
