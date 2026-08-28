"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="w-full shadow-[0px_5px_15px_#FFEB3B] bg-black border-b border-yellow-500/20 sticky top-0 z-50 ">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between py-10">
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

        {/* NAV */}
        <nav className="flex items-center text-lg">
          <Link
            href="/"
            className="hover:text-yellow-500 transition hover:border border-[#FFEB3B] rounded-lg px-3 py-2"
          >
            Home
          </Link>
          <Link
            href="/Stl"
            className="hover:text-yellow-500 transition hover:border border-[#FFEB3B] rounded-lg px-3 py-2"
          >
            STL Calculator
          </Link>
          <Link
            href="/Services"
            className="hover:text-yellow-500 transition hover:border border-[#FFEB3B] rounded-lg px-3 py-2"
          >
            Services
          </Link>
          {/* <Link
            href="/projects"
            className="hover:text-yellow-500 transition hover:border border-[#FFEB3B] rounded-lg px-3 py-2"
          >
            Projects
          </Link> */}
          {/* <Link
            href="/shop"
            className="hover:text-yellow-500 transition hover:border border-[#FFEB3B] rounded-lg px-3 py-2"
          >
            Shop
          </Link> */}
          <Link
            href="/Contact_Us"
            className="hover:text-yellow-500 transition hover:border border-[#FFEB3B] rounded-lg px-3 py-2"
          >
            Contact
          </Link>
        </nav>
      </div>
    </div>
  );
}
