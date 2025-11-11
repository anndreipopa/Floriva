import React from "react";
import { Home, Leaf, Settings, Power, Github, Linkedin } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="bg-[#0f3d33] text-white w-64 min-h-screen flex flex-col justify-between py-8 px-6">
      {/* === Top Section === */}
      <div>
        {/* Logo */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-semibold tracking-tight flex items-center justify-center gap-2">
            Floriva.
          </h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2 text-lg">
          <a
            href="#"
            className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-[#1b5e50] px-3 py-2 rounded-lg transition-all duration-200"
          >
            <Home size={20} />
            <span>Dashboard</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-[#1b5e50] px-3 py-2 rounded-lg transition-all duration-200"
          >
            <Leaf size={20} />
            <span>Plants</span>
          </a>
          <a
            href="#"
            className="flex items-center gap-3 text-gray-300 hover:text-white hover:bg-[#1b5e50] px-3 py-2 rounded-lg transition-all duration-200"
          >
            <Settings size={20} />
            <span>Settings</span>
          </a>
        </nav>

        {/* Auto / Manual Switch */}
        <div className="mt-10 bg-[#134d3e] rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300 font-medium">Mode</span>
            <Power size={16} className="text-gray-400" />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Manual</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" value="" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-500 peer-focus:outline-none rounded-full peer peer-checked:bg-[#2e8b57] transition-colors duration-300"></div>
              <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all peer-checked:translate-x-5"></span>
            </label>
            <span className="text-sm text-gray-400">Auto</span>
          </div>
        </div>
      </div>

      {/* === Bottom Section (User Profile + Footer) === */}
      <div>
        {/* User Info */}
        <div className="flex items-center gap-3 border-t border-[#1b5e50] pt-4">
          <div className="w-10 h-10 bg-[#1b5e50] rounded-full flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div>
            <p className="font-medium">Andrei</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-xs text-gray-400 text-center leading-snug">
          <p>
            v0.1.0 — <span className="text-gray-300">Work in Progress</span>
          </p>
          <p className="mt-2 text-gray-500">
            Made by <span className="text-white font-medium">Andrei Popa</span>
          </p>

          {/* Social icons */}
          <div className="flex justify-center gap-4 mt-2">
            <a
              href="https://github.com/anndreipopa/Floriva"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-200"
            >
              <Github size={16} />
            </a>
            <a
              href="https://linkedin.com/in/anndreipopa"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors duration-200"
            >
              <Linkedin size={16} />
            </a>
          </div>
        </div>
      </div>
    </aside>
  );
}
