"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface CartItem {
  product: { id: string; name: string; price: number };
  quantity: number;
}

export default function Checkout() {
    const { isAuthenticated, authChecked, userEmail } = useAuth();
    const router = useRouter();

    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [cartTotal, setCartTotal] = useState<number>(0);

    // redirect guests to login
    useEffect(() => {
        if (authChecked && !isAuthenticated) {
            localStorage.setItem("redirectAfterLogin", "/checkout");
            router.push("/login");
        }
    }, [authChecked, isAuthenticated, router]);

    // Load cart data from localStorage
    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedTotal = localStorage.getItem("cartTotal");
            const storedItems = localStorage.getItem("cartItems");
            if (storedTotal) setCartTotal(Number(storedTotal));
            if (storedItems) {
                try { setCartItems(JSON.parse(storedItems)); } catch { /* ignore */ }
            }
        }
    }, []);

    const handlePay = async () => {
        if (cartTotal <= 0) {
            alert("Your cart is empty. Please add items before checking out.");
            router.push("/shop");
            return;
        }

        // Convert rupees to paise for Razorpay
        const amountInPaise = Math.round(cartTotal * 100);

        const res = await fetch("/api/create-order", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: amountInPaise }),
        });

        const data = await res.json();
        if (!data.orderId) {
            alert("Failed to create payment order");
            return;
        }

        const options = {
            key: data.keyId,
            amount: amountInPaise,
            currency: "INR",
            name: "THREEDITRON",
            description: "Purchase from THREEDITRON Store",
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
                  // Clear cart data after successful payment
                  localStorage.removeItem('cartTotal');
                  localStorage.removeItem('cartItems');
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
                email: userEmail || "",
                contact: "",
            },
            theme: {
                color: "#FFEB3B",
            },
        };

        // @ts-ignore – Razorpay script adds a global `Razorpay`
        const rzp = new window.Razorpay(options);
        rzp.open();
    };

    if (!authChecked || !isAuthenticated) return null;

    return (
        <section className="flex min-h-screen items-center justify-center bg-black/80 px-4">
            <div className="bg-zinc-900/90 backdrop-blur-sm p-8 rounded-xl border border-yellow-500/20 shadow-lg w-full max-w-lg">
                <h1 className="text-2xl font-bold text-yellow-500 mb-6 text-center">
                    Checkout
                </h1>

                {/* Order Summary */}
                {cartItems.length > 0 && (
                    <div className="mb-6 space-y-3">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Order Summary</h2>
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                            {cartItems.map((item) => (
                                <div key={item.product.id} className="flex justify-between items-center text-sm border-b border-zinc-800 pb-2">
                                    <span className="text-white truncate mr-4">{item.product.name} <span className="text-gray-500">×{item.quantity}</span></span>
                                    <span className="text-yellow-500 font-bold shrink-0">₹{item.product.price * item.quantity}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Total */}
                <div className="flex justify-between items-center border-t border-zinc-800 pt-4 mb-6">
                    <span className="text-gray-300 font-semibold">Total</span>
                    <span className="text-2xl font-black text-yellow-500">₹{cartTotal}</span>
                </div>

                <button
                    onClick={handlePay}
                    className="w-full bg-yellow-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition shadow-[0_0_20px_rgba(234,179,8,0.2)]"
                >
                    Pay ₹{cartTotal} with Razorpay
                </button>

                <button
                    onClick={() => router.push("/shop")}
                    className="w-full mt-3 text-gray-400 hover:text-white text-sm py-2 transition"
                >
                    ← Back to Shop
                </button>
            </div>
        </section>
    );
}
