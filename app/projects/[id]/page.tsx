"use client";

import { use, useState } from "react";
import { ArrowLeft, Play, Image as ImageIcon, Cpu, Clipboard, Check, HelpCircle, Wrench, Shield, ExternalLink } from "lucide-react";
import Link from "next/link";
import { projectsData } from "../data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const project = projectsData.find((p) => p.id === id);

  const [activeMedia, setActiveMedia] = useState<"video" | "image">("video");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"firmware" | "schematics">("firmware");
  const [copied, setCopied] = useState(false);

  if (!project) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center font-sans p-6">
        <Shield className="text-red-500 mb-4" size={48} />
        <h1 className="text-2xl font-bold mb-2">Project Not Found</h1>
        <p className="text-gray-400 mb-6">The project you are looking for does not exist or has been moved.</p>
        <Link href="/projects" className="bg-yellow-500 text-black px-6 py-2.5 rounded-xl font-bold hover:bg-yellow-400 transition">
          Back to Projects
        </Link>
      </div>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(project.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* BACK TO PORTFOLIO */}
        <div className="mb-8">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 hover:text-yellow-500 transition"
          >
            <ArrowLeft size={16} />
            <span>Back to Projects Showcase</span>
          </Link>
        </div>

        {/* HERO SECTION */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start mb-12">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="text-xs px-3 py-1 rounded-full font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/25 capitalize">
                {project.category}
              </span>
              <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                project.status === "Completed"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : project.status === "Open Source"
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
              }`}>
                {project.status}
              </span>
              <span className="text-xs text-gray-400">
                • {project.difficulty} Level
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight">{project.title}</h1>
          </div>
          
          <Link
            href={`/Contact_Us?project=${project.id}`}
            className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition shadow-[0_0_20px_rgba(234,179,8,0.2)] whitespace-nowrap"
          >
            Request Custom Build
          </Link>
        </div>

        {/* MAIN SPLIT VIEW */}
        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          
          {/* MEDIA DISPLAY (Left 7 Cols) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Visual Screen Box */}
            <div className="w-full aspect-video bg-zinc-950 rounded-2xl border border-yellow-500/10 overflow-hidden relative group">
              {activeMedia === "video" ? (
                <video
                  src={project.video}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  controls
                  playsInline
                />
              ) : (
                <img
                  src={project.images[selectedImageIndex]}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Media & Gallery Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-zinc-950/60 p-4 rounded-xl border border-zinc-900">
              
              {/* Media Mode Tabs */}
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveMedia("video")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border transition ${
                    activeMedia === "video"
                      ? "bg-yellow-500 text-black border-yellow-500"
                      : "border-zinc-800 text-gray-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  <Play size={12} />
                  <span>Video Demo</span>
                </button>
                <button
                  onClick={() => setActiveMedia("image")}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold border transition ${
                    activeMedia === "image"
                      ? "bg-yellow-500 text-black border-yellow-500"
                      : "border-zinc-800 text-gray-400 hover:text-white hover:border-zinc-700"
                  }`}
                >
                  <ImageIcon size={12} />
                  <span>Photo Gallery</span>
                </button>
              </div>

              {/* Gallery Image Thumbnails */}
              <div className="flex gap-2 overflow-x-auto max-w-full">
                {project.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedImageIndex(idx);
                      setActiveMedia("image");
                    }}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition ${
                      activeMedia === "image" && selectedImageIndex === idx
                        ? "border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.2)]"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* PROJECT INFO (Right 5 Cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Overview Card */}
            <div className="bg-zinc-950 p-6 rounded-2xl border border-yellow-500/10">
              <h3 className="text-lg font-bold text-yellow-500 mb-3">Project Overview</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{project.details}</p>
              
              <h4 className="text-xs font-bold uppercase text-gray-500 tracking-wider mb-2">Key Technical Details</h4>
              <ul className="space-y-2 text-xs text-gray-300">
                {project.features.map((feat, i) => (
                  <li key={i} className="flex items-start">
                    <Check size={14} className="text-yellow-500 mr-2 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Bill of Materials (BOM) */}
            <div className="bg-zinc-950 p-6 rounded-2xl border border-yellow-500/10">
              <h3 className="text-lg font-bold text-yellow-500 mb-3 flex items-center gap-2">
                <Wrench size={16} /> Bill of Materials (BOM)
              </h3>
              <div className="max-h-52 overflow-y-auto pr-1 space-y-2.5">
                {project.bom.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs border-b border-zinc-900 pb-2">
                    <span className="text-gray-300 font-medium">{item.item}</span>
                    <span className="text-yellow-500 font-black px-2 py-0.5 bg-zinc-900 rounded">
                      x{item.qty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* BOTTOM TABBED VIEWS (Code & Schematics) */}
        <div className="border border-yellow-500/10 rounded-2xl overflow-hidden bg-zinc-950/80 mb-16">
          
          {/* Tab selectors */}
          <div className="flex border-b border-zinc-900 bg-zinc-950">
            <button
              onClick={() => setActiveTab("firmware")}
              className={`px-6 py-4 text-sm font-bold transition flex items-center gap-2 border-b-2 ${
                activeTab === "firmware"
                  ? "border-yellow-500 text-yellow-500 bg-black/40"
                  : "border-transparent text-gray-500 hover:text-white"
              }`}
            >
              <Cpu size={16} />
              <span>Firmware / Code</span>
            </button>
            <button
              onClick={() => setActiveTab("schematics")}
              className={`px-6 py-4 text-sm font-bold transition flex items-center gap-2 border-b-2 ${
                activeTab === "schematics"
                  ? "border-yellow-500 text-yellow-500 bg-black/40"
                  : "border-transparent text-gray-500 hover:text-white"
              }`}
            >
              <HelpCircle size={16} />
              <span>Electronics & Schematics</span>
            </button>
          </div>

          {/* Tab content panel */}
          <div className="p-6">
            {activeTab === "firmware" ? (
              <div className="relative group">
                {/* Copy Button */}
                <button
                  onClick={handleCopyCode}
                  className="absolute top-4 right-4 bg-zinc-900 text-gray-400 hover:text-white p-2 rounded-lg border border-zinc-800 transition text-xs font-bold flex items-center gap-1.5"
                >
                  <Clipboard size={14} />
                  <span>{copied ? "Copied!" : "Copy Code"}</span>
                </button>

                {/* Code Block */}
                <pre className="bg-black/80 rounded-xl p-5 overflow-x-auto text-xs text-yellow-500/90 font-mono border border-zinc-900 leading-normal max-h-96">
                  <code>{project.codeSnippet}</code>
                </pre>
              </div>
            ) : (
              <div className="space-y-4 max-w-4xl py-2">
                <h4 className="font-bold text-white text-base">Circuit Implementation & GPIO Mapping</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{project.schematics}</p>
                <div className="bg-zinc-900/40 border border-yellow-500/10 p-4 rounded-xl flex items-center gap-3">
                  <Cpu className="text-yellow-500 shrink-0" size={24} />
                  <div>
                    <span className="text-xs text-gray-500 block font-bold">PCB Layout Status</span>
                    <span className="text-xs text-gray-300">KiCad design files & Gerber outputs are available for custom fabrication requests.</span>
                  </div>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* BOTTOM ORDER CTA */}
        <div className="border border-yellow-500/20 rounded-3xl p-8 md:p-12 text-center bg-zinc-950 relative overflow-hidden shadow-[0_0_40px_rgba(234,179,8,0.05)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none"></div>

          <h2 className="text-2xl md:text-3xl font-black mb-3">Want a Custom Version of This Build?</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-6 text-sm">
            We can fabricate the custom PCBs, print structural enclosures in choice materials (PLA+, PETG, ABS, Resin), source electronic components, and assemble/program the module for you.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href={`/Contact_Us?project=${project.id}`}
              className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold hover:bg-yellow-400 transition"
            >
              Order Fabricated Assembly
            </Link>
            <Link
              href="/projects"
              className="border border-zinc-800 hover:border-zinc-700 text-white px-6 py-3 rounded-xl font-bold transition"
            >
              Back to List
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
