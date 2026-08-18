import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-yellow-500/20 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-10 text-sm text-gray-400">
        {/* BRAND */}
        <div className="flex py-8 items-center gap-5">
          <Image
            src={"/images/main-logo.png"}
            alt="Logo"
            width={90}
            height={20}
            className="rounded-lg"
          />
          <p>
            Professional 3D printing services with instant STL analysis and
            pricing.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>Home</li>
            <li>STL Calculator</li>
            <li>Services</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-white font-semibold mb-3">Contact</h3>
          <p>Email: threeditron.1005@gmail.com</p>
          <p>Phone: +91 7209827299</p>
        </div>
      </div>

      <div className="text-center text-gray-500 text-xs pb-5">
        © 2026 Threeditron. All rights reserved.
      </div>
    </footer>
  );
}
