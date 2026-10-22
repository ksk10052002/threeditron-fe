"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, authChecked, logout, userEmail, username } = useAuth(); // added userEmail & username
  const displayName = username ?? (userEmail?.split("@")[0] ?? "Guest");
  const links = [
    { href: "/", label: "Home" },
    { href: "/Stl", label: "STL Calculator" },
    { href: "/Services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/Contact_Us", label: "Contact" },
  ];

  return (
    <header className="w-full shadow-[0px_5px_15px_#FFEB3B] bg-black border-b border-yellow-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* LOGO */}
        {/* <h1 className="text-xl font-bold text-yellow-500">
          Kamal 3D
        </h1> */}


        <Link href="/" className="text-xl font-bold text-yellow-500 ">
          <Image
            src={"/images/main-logo.png"}
            alt="Logo"
            width={80}
            height={20}
            className="rounded-lg"
          />
        </Link>

        <nav className="hidden md:flex items-center text-base lg:text-lg">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-yellow-500 transition hover:border border-[#FFEB3B] rounded-lg px-3 py-2">
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="md:hidden p-2 text-yellow-500 hover:bg-yellow-500/10 rounded-lg"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* <-- NEW STATUS AREA --> */}
        <div className="flex items-center justify-end gap-4 ml-1 text-sm">
          {/* While auth is being checked we render the same placeholder on both sides */}
          {!authChecked ? (
            <span className="text-gray-500">…</span>
          ) : isAuthenticated ? (
            <>
              <span className="text-yellow-500 font-medium">{displayName}</span>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-white transition"
              >
                Log out
              </button>
            </>
          ) : (
            <span className="text-gray-500">Guest</span>
          )}
        </div>
      </div>
      {isMenuOpen && (
        <nav className="md:hidden border-t border-yellow-500/20 px-2 py-3 flex flex-col items-stretch gap-1">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={() => setIsMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-base hover:bg-yellow-500 hover:text-black transition">
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
