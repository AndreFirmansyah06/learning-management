"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PlusIcon } from "./icons";

export function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/" },
    { label: "Mata Pelajaran", href: "/courses" },
    { label: "Materi", href: "/materials", className: "hidden md:inline-flex" },
    { label: "Tugas", href: "/assignments" },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#EFF8F7]/85 backdrop-blur-md border-b-2 border-[#2BA8A2]/15 px-4 sm:px-8 py-3.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand / Logo Flip7 Inspired */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative cursor-pointer">
            <div className="absolute -inset-1 bg-[#2BA8A2]/30 rounded-2xl blur-sm group-hover:bg-[#FFD23F]/50 transition-all"></div>
            <div className="relative w-11 h-11 rounded-2xl bg-[#2BA8A2] border-2 border-[#1E8C86] flex items-center justify-center text-[#FFF8E7] font-black text-xl shadow-md rotate-[-3deg] group-hover:rotate-0 transition-transform">
              LM
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[#1E8C86]">
                Learn<span className="text-[#EF6C4A]">Hub</span>
              </span>
              <span className="text-[10px] font-black tracking-wider uppercase bg-[#FFD23F] text-[#1E8C86] px-2 py-0.5 rounded-full border border-[#E6B800] shadow-sm">
                Pro
              </span>
            </div>
            <p className="text-xs font-semibold text-[#1E8C86]/70 hidden sm:block">
              Interactive Learning Management
            </p>
          </div>
        </Link>

        {/* Navigation Links - Pill buttons with retro playful feel */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  item.className || ""
                } ${
                  active
                    ? "bg-[#2BA8A2] text-white shadow-teal-glow"
                    : "text-[#1E8C86] hover:bg-[#E8F6F5] hover:text-[#2BA8A2]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Quick Action Pill Button */}
        <div className="flex items-center gap-2">
          <Link
            href="/courses"
            className="btn-bounce inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-extrabold bg-gradient-to-r from-[#FFD23F] to-[#FFE47A] text-[#1E8C86] border-2 border-[#E6B800] shadow-accent-glow"
          >
            <PlusIcon className="w-4 h-4 text-[#1E8C86]" />
            <span className="hidden sm:inline">Tambah Data</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
