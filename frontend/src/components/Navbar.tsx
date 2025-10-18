import * as React from "react";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import { NavLink } from "react-router-dom";

const Navbar: React.FC = () => {
  return (
    <nav className="fixed top-0 left-1/2 -translate-x-1/2 z-50 w-[95vw] px-6 py-3 mt-2 bg-white/10 backdrop-blur-md shadow-inner shadow-white/10 border border-white/20 rounded-3xl mx-auto">
      <div className="flex items-center justify-between">
        <NavLink
          to="/"
          className="font-bold text-xl tracking-tight text-primary-foreground"
        >
          AI Toolkit
        </NavLink>
        <Menubar className="flex gap-x-2 bg-transparent shadow-none border-none">
          <MenubarMenu>
            <MenubarTrigger
              asChild
              className="text-md text-primary-foreground hover:bg-white/10 hover:text-primary-foreground transition-all duration-300 rounded-xl px-4 py-2 border border-white/10 hover:border-white/20 hover:shadow-md hover:scale-105"
            >
              <NavLink to="/">Home</NavLink>
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger
              asChild
              className="text-md text-primary-foreground hover:bg-white/10 hover:text-primary-foreground transition-all duration-300 rounded-xl px-4 py-2 border border-white/10 hover:border-white/20 hover:shadow-md hover:scale-105"
            >
              <NavLink to="/caption">Image Captioning</NavLink>
            </MenubarTrigger>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger
              asChild
              className="text-md text-primary-foreground hover:bg-white/10 hover:text-primary-foreground transition-all duration-300 rounded-xl px-4 py-2 border border-white/10 hover:border-white/20 hover:shadow-md hover:scale-105"
            >
              <NavLink to="/summarize">Text Summarization</NavLink>
            </MenubarTrigger>
          </MenubarMenu>
        </Menubar>
      </div>
    </nav>
  );
};

export default Navbar;
