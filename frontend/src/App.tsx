import { cn } from "@/lib/utils";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Brain } from "lucide-react";

interface AppProps {
  className?: string;
}

export default function App({ className }: AppProps) {
  return (
    <div className="min-h-screen w-full bg-gradient-custom flex flex-col">
      <Navbar />
      <div className="h-24 sm:h-28" aria-hidden />

      <main
        className={cn(
          "flex-1 flex flex-col items-center justify-start text-center p-4 sm:p-6 lg:p-10",
          className
        )}
      >
        <div className="w-full mx-auto flex flex-col items-center justify-start gap-6">
          <Outlet />
        </div>
      </main>

      <footer className="mt-auto">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-white/5 backdrop-blur-md border border-white/20 rounded-2xl p-4 shadow-inner shadow-white/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary-foreground" />
                <span className="text-sm font-medium text-primary-foreground">
                  AI Toolkit
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-primary-foreground/60">
                <span>© 2025 Aditya Dubey</span>
                <span>•</span>
                <span>Open Source</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
