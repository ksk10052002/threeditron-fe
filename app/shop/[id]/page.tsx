"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Check, Cpu, ShieldAlert, Star } from "lucide-react";
import { productsData } from "../data";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const product = productsData.find((item) => item.id === id);
  const productImages = product?.image.filter((image) => image.startsWith("/")) ?? [];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-black p-6 font-sans text-white flex flex-col items-center justify-center">
        <ShieldAlert className="mb-4 text-red-500" size={48} />
        <h1 className="mb-2 text-2xl font-bold">Product Not Found</h1>
        <p className="mb-6 text-center text-gray-400">This product does not exist or is no longer available.</p>
        <Link href="/shop" className="rounded-xl bg-yellow-500 px-6 py-2.5 font-bold text-black transition hover:bg-yellow-400">
          Back to Shop
        </Link>
      </div>
    );
  }

  const isInStock = product.stock > 0;

  return (
    <div className="min-h-screen bg-black px-6 py-12 font-sans text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/shop" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-gray-400 transition hover:text-yellow-500">
          <ArrowLeft size={16} />
          Back to Shop
        </Link>

        <div className="grid gap-8 lg:grid-cols-12">
          <section className="lg:col-span-7">
            <div className="relative aspect-video overflow-hidden rounded-2xl border border-yellow-500/10 bg-zinc-950">
              {productImages.length > 0 ? (
                <Image
                  src={productImages[selectedImageIndex]}
                  alt={`${product.name} image ${selectedImageIndex + 1}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="object-contain"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-gray-500">
                  <Cpu className="text-yellow-500/30" size={72} />
                  <p className="text-sm">Product photos will be added soon.</p>
                </div>
              )}
            </div>

            {productImages.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {productImages.map((image, index) => (
                  <button
                    key={image}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${selectedImageIndex === index ? "border-yellow-500" : "border-transparent opacity-60 hover:opacity-100"}`}
                    aria-label={`Show image ${index + 1}`}
                  >
                    <Image src={image} alt="" fill sizes="96px" className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="lg:col-span-5">
            <span className="inline-flex rounded-full border border-yellow-500/25 bg-yellow-500/10 px-3 py-1 text-xs font-bold capitalize text-yellow-500">
              {product.category}
            </span>
            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">{product.name}</h1>

            <div className="mt-4 flex items-center gap-2 text-sm text-gray-400">
              <Star className="fill-yellow-500 text-yellow-500" size={16} />
              <span className="font-bold text-white">{product.rating}</span>
              <span>Product rating</span>
            </div>

            <div className="my-6 border-y border-zinc-900 py-5">
              <span className="block text-xs text-gray-500">Price</span>
              <span className="text-4xl font-black text-yellow-500">₹{product.price}</span>
              <p className={`mt-2 text-sm font-bold ${isInStock ? "text-emerald-500" : "text-red-500"}`}>
                {isInStock ? `${product.stock} available` : "Out of stock"}
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/10 bg-zinc-950 p-6">
              <h2 className="mb-4 text-lg font-bold text-yellow-500">Product Specifications</h2>
              <ul className="space-y-3">
                {product.specs.map((spec) => (
                  <li key={spec} className="flex items-start gap-2 text-sm text-gray-300">
                    <Check className="mt-0.5 shrink-0 text-yellow-500" size={16} />
                    {spec}
                  </li>
                ))}
              </ul>
            </div>

            <Link href="/shop" className="mt-6 block rounded-xl bg-yellow-500 px-5 py-3 text-center font-bold text-black transition hover:bg-yellow-400">
              Back to Shop to Add to Cart
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
