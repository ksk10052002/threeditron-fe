import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Box,
  CheckCircle2,
  Clock3,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/Services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/shop", label: "Shop" },
  { href: "/Contact_Us", label: "Contact us" },
];
const serviceLinks = [
  { href: "/Stl", label: "Instant STL quote" },
  { href: "/Services", label: "3D printing" },
  { href: "/Services", label: "Custom prototyping" },
  { href: "/Services", label: "Small-batch production" },
];
const promises = [
  {
    icon: Sparkles,
    title: "Share your idea",
    copy: "Upload a model or tell us what you need.",
  },
  {
    icon: Box,
    title: "We make it real",
    copy: "Built carefully with the right material and finish.",
  },
  {
    icon: CheckCircle2,
    title: "Ready to use",
    copy: "Quality-checked before it heads your way.",
  },
];

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-yellow-500/25 bg-[#090909] text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_at_top,rgba(234,179,8,0.13),transparent_66%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <section className="grid gap-7 border-b border-white/10 py-9 sm:grid-cols-3 sm:gap-5 sm:py-10">
          {promises.map(({ icon: Icon, title, copy }, index) => (
            <div
              key={title}
              className="flex gap-4 sm:border-r sm:border-white/10 sm:pr-5 last:border-0"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-yellow-400/30 bg-yellow-500/10 text-yellow-400">
                <Icon size={19} strokeWidth={1.8} />
              </span>
              <div>
                <p className="text-[11px] font-bold tracking-[0.16em] text-yellow-500 uppercase">
                  0{index + 1}
                </p>
                <h2 className="mt-0.5 font-semibold text-white">{title}</h2>
                <p className="mt-1 text-sm leading-5 text-zinc-400">{copy}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="my-8 grid gap-6 rounded-2xl border border-yellow-400/25 bg-gradient-to-br from-yellow-400 to-amber-500 p-6 text-zinc-950 shadow-[0_14px_45px_rgba(0,0,0,0.26)] sm:my-10 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-xs font-extrabold tracking-[0.16em] uppercase">
              <Sparkles size={15} /> From file to finished piece
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
              Ready to bring your design to life?
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-800">
              Get a quick STL estimate, or talk to a real person about the best
              route for your project.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
            <Link
              href="/Stl"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-zinc-800"
            >
              Get instant quote <ArrowRight size={17} />
            </Link>
            <Link
              href="/Contact_Us"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-950/25 bg-white/45 px-5 py-3 text-sm font-bold text-zinc-950 transition hover:bg-white/70"
            >
              Discuss a project
            </Link>
          </div>
        </section>

        <div className="grid gap-10 py-4 sm:grid-cols-2 lg:grid-cols-[1.35fr_.8fr_1fr_1.25fr]">
          <div>
            <Link
              href="/"
              className="inline-flex"
              aria-label="THREEDITRON home"
            >
              <Image
                src="/images/main-logo.png"
                alt="THREEDITRON"
                width={118}
                height={35}
                className="rounded-lg"
              />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-6 text-zinc-400">
              Professional 3D printing and prototyping for makers, businesses,
              and big ideas across India.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-zinc-300">
              <ShieldCheck size={16} className="text-yellow-400" />{" "}
              Quality-checked before dispatch
            </div>
          </div>
          <FooterLinks title="Explore" links={quickLinks} />
          <FooterLinks title="What we make" links={serviceLinks} />
          <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-5">
            <h3 className="text-xs font-bold tracking-[0.16em] text-white uppercase">
              Need a hand?
            </h3>
            <p className="mt-2 text-sm leading-5 text-zinc-400">
              We&apos;re happy to help you choose the right path for your print.
            </p>
            <ul className="mt-5 space-y-3 text-sm text-zinc-300">
              <li>
                <a
                  href="mailto:threeditron.1005@gmail.com"
                  className="flex items-start gap-3 transition hover:text-yellow-400"
                >
                  <Mail size={17} className="mt-0.5 shrink-0 text-yellow-400" />
                  threeditron.1005@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+917209827299"
                  className="flex items-center gap-3 transition hover:text-yellow-400"
                >
                  <Phone size={17} className="shrink-0 text-yellow-400" />
                  +91 72098 27299
                </a>
              </li>
              <li className="flex items-start gap-3 text-zinc-400">
                <MapPin size={17} className="mt-0.5 shrink-0 text-yellow-400" />
                Jamshedpur, Jharkhand, India
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-3">
              <a
                href="https://wa.me/917209827299"
                target="_blank"
                rel="noreferrer"
                aria-label="Chat on WhatsApp"
                className="flex h-10 items-center gap-2 rounded-lg bg-[#25D366] px-3 text-xs font-bold text-zinc-950 transition hover:brightness-110"
              >
                <MessageCircle size={18} /> WhatsApp
              </a>
              <a
                href="https://www.instagram.com/3dit.ron/"
                target="_blank"
                rel="noreferrer"
                aria-label="Follow THREEDITRON on Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-400"
              >
                <Instagram size={19} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 py-5 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} THREEDITRON. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <Clock3 size={14} className="text-yellow-500" /> Built for ideas
            that deserve to become real.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-bold tracking-[0.16em] text-white uppercase">
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="group inline-flex items-center gap-1 text-sm text-zinc-400 transition hover:text-yellow-400"
            >
              <span className="h-1 w-1 rounded-full bg-zinc-600 transition group-hover:bg-yellow-400" />
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
