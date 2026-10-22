"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutSuccess() {
    const router = useRouter();

    // OPTIONAL: auto‑redirect after a few seconds
    useEffect(() => {
        const timer = setTimeout(() => router.push("/"), 5000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <section className="flex min-h-screen items-center justify-center bg-black/80">
            <div className="bg-zinc-900/90 backdrop-blur-sm p-8 rounded-xl border border-yellow-500/20 shadow-lg w-full max-w-md text-center">
                <h1 className="text-3xl font-bold text-yellow-500 mb-6">
                    🎉 Payment Successful!
                </h1>
                <p className="text-gray-300 mb-4">
                    Thank you for your purchase. Your order is being processed.
                </p>
                <button
                    onClick={() => router.push("/")}
                    className="mt-4 w-full bg-yellow-500 text-black py-2 rounded-xl font-bold hover:bg-yellow-400 transition"
                >
                    Back to Home
                </button>
            </div>
        </section>
    );
}
