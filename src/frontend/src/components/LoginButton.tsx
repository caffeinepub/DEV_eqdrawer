import { Button } from "@/components/ui/button";
import { useInternetIdentity } from "@caffeineai/core-infrastructure";
import { Loader2, LogIn, LogOut } from "lucide-react";

export function LoginButton() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();

  const isLoading = loginStatus === "logging-in";
  const isLoggedIn = !!identity;

  if (isLoggedIn) {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={clear}
        className="gap-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
        data-ocid="logout-btn"
      >
        <LogOut className="w-4 h-4" />
        <span className="hidden sm:inline">Sign out</span>
      </Button>
    );
  }

  return (
    <Button
      size="sm"
      onClick={login}
      disabled={isLoading}
      className="gap-2 transition-smooth"
      data-ocid="login-btn"
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogIn className="w-4 h-4" />
      )}
      {isLoading ? "Signing in…" : "Sign in"}
    </Button>
  );
}
