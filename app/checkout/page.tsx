"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Checkout() {
    const { isAuthenticated, authChecked } = useAuth();
    const router = useRouter();

    // redirect guests to login
    useEffect(() => {
        if (authChecked && !isAuthenticated) router.push("/login");
    }, [authChecked, isAuthenticated, router]);

    const handlePay = async () => {
        // Example: total amount from cart (hard‑coded for demo)
        const amount = 5000; // ₹50 in paise

        const res = await fetch("/api/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount }),
        });

        const data = await res.json();
        if (!data.orderId) {
            alert("Failed to create payment order");
            return;
        }

        const options = {
            key: data.keyId,
            amount,
            currency: "INR",
            name: "Kamal 3D Print",
            description: "Purchase from 3D‑Print Store",
            order_id: data.orderId,
            handler: async (response: any) => {
                // Verify payment on the server
                const verifyRes = await fetch('/api/verify-payment', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                });

                const verifyData = await verifyRes.json();

                if (verifyData.verified) {
                  alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
                  router.push('/checkout/success');
                } else {
                  alert('Payment verification failed.');
                  router.push('/checkout/cancel');
                }
            },
            modal: {
              ondismiss: () => router.push('/checkout/cancel'),
            },
            prefill: {
                // optional – you can pre‑fill user data
                email: "", // user email if you have it
                contact: "",
            },
            theme: {
                color: "#FFEB3B", // yellow accent matching your theme
            },
        };

        // @ts-ignore – Razorpay script adds a global `Razorpay`
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    return (
        <section className="flex min-h-screen items-center justify-center bg-black/80">
            <div className="bg-zinc-900/90 backdrop-blur-sm p-8 rounded-xl border border-yellow-500/20 shadow-lg w-full max-w-md text-center">
                <h1 className="text-2xl font-bold text-yellow-500 mb-6">
                    Checkout
                </h1>
                <p className="text-gray-300 mb-6">
                    Total: <span className="font-medium text-yellow-500">₹50</span>
                </p>
                <button
                    onClick={handlePay}
                    className="w-full bg-yellow-500 text-black py-2 rounded-xl font-bold hover:bg-yellow-400 transition"
                >
                    Pay with Razorpay
                </button>
            </div>
        </section>
    );
}
