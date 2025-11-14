import React, { useState } from "react";
import {
  Home,
  Leaf,
  Settings,
  Power,
  Github,
  Linkedin,
  Menu,
  X,
} from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  const baseLink =
    "flex items-center gap-3 text-gray-300 hover:text-white hover:bg-[#1b5e50] px-3 py-2 rounded-lg transition-all duration-200";

  const activeLink = "text-white bg-[#1b5e50]";

  return (
    <>
      {/* Mobile + Tablet Header */}
      <header className="fixed top-0 left-0 w-full bg-[#0f3d33] text-white flex items-center justify-between px-6 py-4 shadow-md z-50 xl:hidden">
        <h1 className="text-2xl font-semibold">Floriva.</h1>
        <button onClick={toggleMenu} className="text-white focus:outline-none">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </header>

      {/* Sidebar */}
          <aside
            className={`
              fixed xl:static left-0 bg-[#0f3d33] text-white flex flex-col justify-between 
              py-8 px-6 z-40 w-64 
              h-[calc(100%-4rem)] xl:h-full 
              transform transition-transform duration-300 
              xl:translate-x-0
              shrink-0

              ${isOpen ? "translate-x-0 top-16" : "-translate-x-full top-16 xl:top-0"}
            `}
          >
        {/* TOP */}
        <div>
          <div className="mb-10 text-center hidden xl:block">
            <h1 className="text-5xl font-semibold tracking-tight flex justify-center">
              Floriva.
            </h1>
          </div>

          {/* NAVIGATION */}
          <nav className="flex flex-col gap-2 text-lg">
            {/* Dashboard */}
            <NavLink
              to="/"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              <Home size={20} />
              Dashboard
            </NavLink>

            {/* Plants */}
            <NavLink
              to="/plants"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              <Leaf size={20} />
              Plants
            </NavLink>

            {/* Settings (not implemented yet) */}
            <NavLink
              to="/settings"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `${baseLink} ${isActive ? activeLink : ""}`
              }
            >
              <Settings size={20} />
              Settings
            </NavLink>
          </nav>

          {/* MODE SWITCH */}
          <div className="mt-10 bg-[#134d3e] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300 font-medium">Mode</span>
              <Power size={16} className="text-gray-400" />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Manual</span>

              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-500 rounded-full peer peer-checked:bg-[#2e8b57] transition-colors"></div>
                <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></span>
              </label>

              <span className="text-sm text-gray-400">Auto</span>
            </div>
          </div>
        </div>

        {/* BOTTOM */}
        <div>
          <div className="flex items-center gap-3 border-t border-[#1b5e50] pt-4">
            <div className="w-10 h-10 bg-[#1b5e50] rounded-full flex items-center justify-center text-white font-semibold">
              A
            </div>
            <div>
              <p className="font-medium">Andrei</p>
            </div>
          </div>

          <div className="mt-6 text-xs text-gray-400 text-center leading-snug">
            <p>
              v0.2.5 — <span className="text-gray-300">Work in Progress</span>
            </p>
            <p className="mt-2 text-gray-500">
              Made by <span className="text-white font-medium">Andrei Popa</span>
            </p>

            <div className="flex justify-center gap-4 mt-2">
              <a
                href="https://github.com/anndreipopa/Floriva"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <Github size={16} />
              </a>
              <a
                href="https://linkedin.com/in/anndreipopa"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Spacer for mobile header */}
      <div className="h-16 xl:hidden" />
    </>
  );
}
