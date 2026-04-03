import { Outlet } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { FunctionSquare } from "lucide-react";
import { LoginButton } from "./LoginButton";
import { Sidebar } from "./Sidebar";

export function Layout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="shrink-0 flex items-center justify-between px-5 py-3 bg-card border-b border-border shadow-xs z-10">
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          data-ocid="header-logo"
        >
          <div className="flex items-center justify-center w-8 h-8 rounded-md bg-accent/10 border border-accent/20 transition-smooth group-hover:bg-accent/20">
            <FunctionSquare className="w-4.5 h-4.5 text-accent" />
          </div>
          <span className="font-display text-lg font-semibold tracking-tight text-foreground">
            EqDrawer
          </span>
        </Link>
        <LoginButton />
      </header>

      {/* Body: sidebar + main */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main
          className="flex-1 overflow-auto bg-background"
          data-ocid="main-content"
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
