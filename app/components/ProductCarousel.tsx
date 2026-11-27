"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Cpu, Star } from "lucide-react";
import { useRef, useState } from "react";
import { Product, ProductCategory, productsData } from "../shop/data";

const printedProducts = productsData.filter(
  (product) => product.category === "designs",
);
const electronicsProducts = productsData.filter(
  (product) => product.category !== "designs",
);

// Lead the home-page Popular carousel with 3D-printed products, then show electronics.
const featuredProducts = [...printedProducts.slice(0, 4), ...electronicsProducts].slice(
  0,
  10,
);

const categories: { id: "all" | ProductCategory; label: string }[] = [
  { id: "all", label: "Popular" },
  { id: "designs", label: "3D Printed Designs" },
  { id: "microcontrollers", label: "Electronics" },
  { id: "sensors", label: "Sensors" },
  { id: "motors", label: "Motors" },
  { id: "filaments", label: "Filaments" },
];

const getProductImage = (images: string[]) =>
  images.find((image) => image.startsWith("/"));

function ProductCard({
  product,
  duplicate = false,
}: {
  product: Product;
  duplicate?: boolean;
}) {
  const image = getProductImage(product.image);
  const cardClassName =
    "group w-[220px] shrink-0 overflow-hidden rounded-2xl border border-yellow-500/15 bg-black transition duration-300 hover:-translate-y-1 hover:border-yellow-500/60 hover:shadow-[0_12px_35px_rgba(234,179,8,0.12)] sm:w-[250px]";

  const content = (
    <>
      <div className="relative flex h-36 items-center justify-center overflow-hidden border-b border-yellow-500/10 bg-zinc-900 sm:h-40">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="250px"
            className="object-cover object-center transition duration-500 group-hover:scale-110"
          />
        ) : (
          <>
            <div className="absolute h-28 w-28 rounded-full bg-yellow-500/10 blur-2xl" />
            <Cpu
              size={58}
              className="relative text-yellow-500/60 transition duration-300 group-hover:scale-110 group-hover:text-yellow-400"
            />
          </>
        )}
        <span className="absolute bottom-2 left-2 rounded-full border border-white/10 bg-black/75 px-2 py-1 text-[10px] font-bold tracking-wide text-yellow-500 uppercase backdrop-blur">
          {product.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 min-h-10 text-sm font-bold text-white transition group-hover:text-yellow-500">
          {product.name}
        </h3>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-lg font-black text-white">
            ₹{product.price}
          </span>
          <span className="flex items-center gap-1 rounded-md bg-yellow-500/10 px-2 py-1 text-xs font-bold text-yellow-500">
            <Star size={12} fill="currentColor" /> {product.rating}
          </span>
        </div>
      </div>
    </>
  );

  if (duplicate) {
    return (
      <div aria-hidden="true" className={cardClassName}>
        {content}
      </div>
    );
  }

  return (
    <Link href={`/shop/${product.id}`} className={cardClassName}>
      {content}
    </Link>
  );
}

export default function ProductCarousel() {
  const [activeCategory, setActiveCategory] = useState<"all" | ProductCategory>(
    "all",
  );
  const [isManualNavigation, setIsManualNavigation] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const productsToDisplay =
    activeCategory === "all"
      ? featuredProducts
      : productsData.filter((product) => product.category === activeCategory);

  const scrollCarousel = (direction: "previous" | "next") => {
    setIsManualNavigation(true);

    requestAnimationFrame(() => {
      const carousel = carouselRef.current;
      if (!carousel) return;

      carousel.scrollBy({
        left: (direction === "next" ? 1 : -1) * carousel.clientWidth * 0.8,
        behavior: "smooth",
      });
    });
  };

  return (
    <section className="border-t border-yellow-500/15 bg-zinc-950 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-bold tracking-[0.2em] text-yellow-500 uppercase">
              Shop Featured
            </p>
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Popular Products &amp; Components
            </h2>
          </div>
          {/* <p className="hidden text-sm text-gray-500 sm:block">Hover to pause</p> */}
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => {
                setIsManualNavigation(false);
                setActiveCategory(category.id);
                requestAnimationFrame(() => {
                  carouselRef.current?.scrollTo({ left: 0 });
                });
              }}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                activeCategory === category.id
                  ? "border-yellow-500 bg-yellow-500 text-black"
                  : "border-zinc-700 bg-black text-gray-300 hover:border-yellow-500/60 hover:text-yellow-500"
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => scrollCarousel("previous")}
            className="absolute left-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-yellow-500/50 bg-black/85 p-2 text-yellow-500 shadow-lg shadow-black/40 transition hover:border-yellow-400 hover:bg-zinc-900 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:inline-flex"
            aria-label="Show previous products"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scrollCarousel("next")}
            className="absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 rounded-full border border-yellow-500/50 bg-black/85 p-2 text-yellow-500 shadow-lg shadow-black/40 transition hover:border-yellow-400 hover:bg-zinc-900 hover:text-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 sm:inline-flex"
            aria-label="Show next products"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>
          <div
            ref={carouselRef}
            className="group overflow-x-auto pb-4 [scrollbar-width:none]"
            aria-label={`${categories.find((category) => category.id === activeCategory)?.label} products`}
          >
          <div
            key={activeCategory}
            className={`flex w-max motion-reduce:animate-none ${
              isManualNavigation
                ? ""
                : "animate-[product-marquee_60s_linear_infinite] group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]"
            }`}
          >
            <div className="flex shrink-0 gap-4 pr-4">
              {productsToDisplay.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="flex shrink-0 gap-4 pr-4">
              {productsToDisplay.map((product) => (
                <ProductCard
                  key={`duplicate-${product.id}`}
                  product={product}
                  duplicate
                />
              ))}
            </div>
          </div>
        </div>
        </div>

        <div className="mt-2 text-center sm:hidden">
          <p className="text-xs text-gray-500">
            The display pauses while you browse
          </p>
        </div>
      </div>
    </section>
  );
}
