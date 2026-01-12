import React from "react";

export default function Navbar({ onNavigate }) {
  return (
    <header className="relative z-30 flex items-center justify-between px-6 py-4">
      {/* Mobile Menu */}
      <div className="flex items-center gap-2 md:hidden">
        <button className="text-white p-1 hover:bg-white/10 rounded">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>

      {/* Right Side Actions */}
      <div className="hidden w-full md:flex items-center gap-3  justify-between">
        <div className="hidden md:flex items-center gap-3  justify-between">
          <button className="px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 text-xs font-medium transition-colors text-gray-300">
            My Library
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 text-xs font-medium transition-colors border border-white/10">
            <span className="material-symbols-outlined text-[16px]">
              install_desktop
            </span>
            Get App
          </button>
        </div>

        <div className="size-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center p-[2px]">
          <img
            alt="User"
            className="w-full h-full rounded-full border border-black/20"
            src="https://picsum.photos/seed/user123/100/100"
          />
        </div>
      </div>
    </header>
  );
}
