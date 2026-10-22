"use client";

import { useRouter } from "next/navigation";

export default function CheckoutCancel() {
    const router = useRouter();

    return (
        <section className="flex min-h-screen items-center justify-center bg-black/80">
            <div className="bg-zinc-900/90 backdrop-blur-sm p-8 rounded-xl border border-yellow-500/20 shadow-lg w-full max-w-md text-center">
                <h1 className="text-3xl font-bold text-yellow-500 mb-6">
                    ❌ Payment Cancelled
                </h1>
                <p className="text-gray-300 mb-4">
                    You have cancelled the payment. Feel free to try again.
                </p>
                <button
                    onClick={() => router.push("/checkout")}
                    className="mt-4 w-full bg-yellow-500 text-black py-2 rounded-xl font-bold hover:bg-yellow-400 transition"
                >
                    Return to Checkout
                </button>
            </div>
        </section>
    );
}
