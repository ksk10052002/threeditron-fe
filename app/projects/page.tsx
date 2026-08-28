"use client";

import { useState } from "react";
import { Cpu, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";
import { projectsData } from "./data";

export default function ProjectsPage() {
  const [filter, setFilter] = useState<string>("all");

  const filteredProjects = filter === "all"
    ? projectsData
    : projectsData.filter((p) => p.category === filter);

  return (
    <div className="min-h-screen bg-black text-white py-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HERO SECTION */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-500 text-sm font-semibold mb-4">
            <Cpu size={16} />
            <span>Electronics & Fabrication Showcase</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
            Custom <span className="text-yellow-500 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-amber-400">Electronics Projects</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Explore our portfolio of custom-engineered circuitry, embedded firmware, IoT devices, and 3D print-integrated electronics designed and built in-house. Click on any project to view photos, videos, BOM, and code.
          </p>
        </div>

        {/* FILTER CONTROLS */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { id: "all", label: "All Projects" },
            { id: "iot", label: "IoT & Wireless" },
            { id: "robotics", label: "Robotics" },
            { id: "pcb", label: "Custom PCBs" },
            { id: "integrated", label: "3D Print Integrated" },
          ].map((btn) => (
            <button
              key={btn.id}
              onClick={() => setFilter(btn.id)}
              className={`px-5 py-2.5 rounded-xl border text-sm font-semibold transition ${
                filter === btn.id
                  ? "bg-yellow-500 text-black border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]"
                  : "border-yellow-500/20 text-gray-400 hover:text-white hover:border-yellow-500/50 bg-zinc-900/50"
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* PROJECTS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group border border-yellow-500/10 rounded-2xl p-6 bg-zinc-950 hover:border-yellow-500/50 hover:shadow-[0_0_30px_rgba(234,179,8,0.08)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Meta details */}
                <div className="flex justify-between items-center mb-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    project.status === "Completed"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : project.status === "Open Source"
                      ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}>
                    {project.status}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {project.difficulty} Level
                  </span>
                </div>

                {/* Cover/Thumbnail Image */}
                {project.images && project.images[0] && (
                  <Link href={`/projects/${project.id}`} className="block overflow-hidden rounded-xl mb-4 border border-zinc-900 aspect-video relative group-hover:border-yellow-500/20 transition-all duration-300">
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                )}

                {/* Title */}
                <Link href={`/projects/${project.id}`}>
                  <h3 className="text-xl font-bold group-hover:text-yellow-500 transition-colors mb-2">
                    {project.title}
                  </h3>
                </Link>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4 leading-relaxed line-clamp-2">
                  {project.description}
                </p>

                {/* Features */}
                <ul className="space-y-1.5 mb-5">
                  {project.features.slice(0, 2).map((feat, i) => (
                    <li key={i} className="flex items-start text-xs text-gray-400">
                      <Zap size={12} className="text-yellow-500 mr-2 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                {/* Tech stack badges */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {project.tech.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-zinc-900 text-yellow-500/80 px-2 py-0.5 rounded border border-yellow-500/5"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between border-t border-zinc-900 pt-4 mt-2">
                  <span className="text-xs text-gray-500">
                    Category: <span className="text-gray-400 capitalize">{project.category}</span>
                  </span>
                  
                  <Link
                    href={`/projects/${project.id}`}
                    className="flex items-center gap-1.5 text-xs text-yellow-500 font-bold group-hover:translate-x-1 transition-transform"
                  >
                    <span>View Details</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA BOTTOM SECTION */}
        <div className="mt-20 border border-yellow-500/20 rounded-3xl p-8 md:p-12 text-center bg-zinc-950/80 relative overflow-hidden shadow-[0_0_40px_rgba(234,179,8,0.05)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <h2 className="text-3xl font-black mb-4">Need a Custom Electronics or IoT Design?</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8 text-sm md:text-base">
            From circuit design (schematics & PCB routing) to mechanical integration and enclosure printing, we provide complete end-to-end prototyping.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/Contact_Us"
              className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition shadow-[0_0_20px_rgba(234,179,8,0.2)]"
            >
              Get in Touch
            </Link>
            <Link
              href="/Services"
              className="border border-yellow-500/40 hover:border-yellow-500 text-white px-6 py-3 rounded-xl font-bold bg-zinc-900/20 transition"
            >
              Explore Services
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
