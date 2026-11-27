"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { isAuthenticated, authChecked, logout, user } = useAuth(); // added userEmail & username
  const displayName = user?.name;
  const isAdmin = user?.role?.toLowerCase() === "admin";
  const links = [
    { href: "/", label: "Home" },
    { href: "/Stl", label: "STL Calculator" },
    { href: "/Services", label: "Services" },
    { href: "/shop", label: "Shop" },
    { href: "/projects", label: "Projects" },
    { href: "/Contact_Us", label: "Contact" },
  ];

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    router.push(query ? `/shop?search=${encodeURIComponent(query)}` : "/shop");
    setIsMenuOpen(false);
  };

  return (
    <header className="w-full shadow-[0px_5px_15px_#FFEB3B] bg-black border-b border-yellow-500/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        {/* LOGO */}
        {/* <h1 className="text-xl font-bold text-yellow-500">
          Kamal 3D
        </h1> */}

        <Link href="/" className="shrink-0 text-xl font-bold text-yellow-500 ">
          <Image
            src={"/images/main-logo.png"}
            alt="Logo"
            width={80}
            height={20}
            className="rounded-lg"
          />
        </Link>

        <nav className="hidden xl:flex items-center text-base lg:text-lg">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-yellow-500 transition hover:border border-[#FFEB3B] rounded-lg px-3 py-2"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <form
          onSubmit={handleSearch}
          className="hidden xl:block relative w-44 2xl:w-56"
        >
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={16}
          />
          <input
            id="site-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-yellow-500/30 bg-zinc-900 py-2 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-yellow-500"
          />
        </form>

        <form
          onSubmit={handleSearch}
          className="relative min-w-0 flex-1 xl:hidden"
        >
          <label htmlFor="mobile-header-search" className="sr-only">
            Search products
          </label>
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={16}
          />
          <input
            id="mobile-header-search"
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border border-yellow-500/30 bg-zinc-900 py-2 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-yellow-500"
          />
        </form>

        <button
          type="button"
          aria-label={
            isMenuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((open) => !open)}
          className="xl:hidden p-2 text-yellow-500 hover:bg-yellow-500/10 rounded-lg"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden xl:flex items-center justify-end gap-3 ml-1 text-sm">
          {!authChecked ? (
            <span className="text-gray-500">…</span>
          ) : isAuthenticated ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin/products"
                  className="rounded-lg border border-yellow-500/60 px-3 py-2 font-semibold text-yellow-500 transition hover:bg-yellow-500 hover:text-black"
                >
                  Admin Products
                </Link>
              )}
              <span className="text-yellow-500 font-medium">{displayName}</span>
              <button
                onClick={logout}
                className="text-gray-400 hover:text-white transition"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 font-medium text-gray-200 transition hover:text-yellow-500"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-yellow-500 px-3 py-2 font-semibold text-black transition hover:bg-yellow-400"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
      {isMenuOpen && (
        <nav className="xl:hidden border-t border-yellow-500/20 px-2 py-3 flex flex-col items-stretch gap-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-3 py-2.5 text-base hover:bg-yellow-500 hover:text-black transition"
            >
              {link.label}
            </Link>
          ))}
          {!authChecked ? (
            <span className="px-3 py-2.5 text-sm text-gray-500">
              Loading account…
            </span>
          ) : isAuthenticated ? (
            <div className="mt-2 border-t border-yellow-500/20 px-3 pt-3">
              {isAdmin && (
                <Link
                  href="/admin/products"
                  onClick={() => setIsMenuOpen(false)}
                  className="mb-2 block rounded-lg border border-yellow-500/60 px-3 py-2 text-center text-sm font-semibold text-yellow-500 transition hover:bg-yellow-500 hover:text-black"
                >
                  Admin Products
                </Link>
              )}
              <div className="flex items-center justify-between">
                <span className="font-medium text-yellow-500">{displayName}</span>
                <button
                  type="button"
                  onClick={() => {
                    setIsMenuOpen(false);
                    logout();
                  }}
                  className="rounded-lg px-3 py-2 text-sm text-gray-300 transition hover:bg-yellow-500 hover:text-black"
                >
                  Log out
                </button>
              </div>
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-2 gap-2 border-t border-yellow-500/20 px-3 pt-3">
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg border border-yellow-500/60 px-3 py-2.5 text-center font-medium text-yellow-500 transition hover:bg-yellow-500 hover:text-black"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsMenuOpen(false)}
                className="rounded-lg bg-yellow-500 px-3 py-2.5 text-center font-semibold text-black transition hover:bg-yellow-400"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
