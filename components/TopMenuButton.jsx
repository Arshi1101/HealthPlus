"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function TopMenuButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating button */}
      <button
        className="fixed top-4 left-4 z-50 p-3 bg-black/50 text-white rounded-full shadow-lg hover:bg-indigo-700 transition"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Menu overlay */}
      {open && (
        <div className="fixed top-16 left-4 z-40 w-50 sm:bg-white/10 bg-white border border-cyan sm:text-white text-black rounded-xl shadow-lg p-4 flex flex-col space-y-3C">
          <Link href="/dashboard" className="hover:text-cyan-300">Dashboard</Link>
          <Link href="/team-dashboard" className="hover:text-cyan-300">Team Dashboard</Link>
        </div>
      )}
    </>
  );
}