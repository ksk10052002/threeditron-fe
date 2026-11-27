"use client";

import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

interface CartItem {
  product: { id: string; name: string; price: number };
  quantity: number;
}

interface ShippingDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
}

export default function Checkout() {
  const { isAuthenticated, authChecked, user } = useAuth();
  const userEmail = user?.email;
  const router = useRouter();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState<number>(0);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

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
        try {
          setCartItems(JSON.parse(storedItems));
        } catch {
          /* ignore */
        }
      }
    }
  }, []);

  const handlePay = async (customerEmail: string) => {
    if (cartTotal <= 0) {
      toast.error("Your cart is empty. Please add items before checking out.");
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
      toast.error("Failed to create payment order");
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
        const verifyRes = await fetch("/api/verify-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        const verifyData = await verifyRes.json();

        if (verifyData.verified) {
          // Clear cart data after successful payment
          localStorage.removeItem("cartTotal");
          localStorage.removeItem("cartItems");
          // Send order confirmation email
          try {
            await fetch("/api/order/complete", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email: customerEmail,
                paymentId: response.razorpay_payment_id,
                amount: amountInPaise / 100,
                shippingDetails,
                items: cartItems,
              }),
            });
          } catch {
            console.error("Failed to send order confirmation email");
          }
          router.push("/checkout/success");
        } else {
          toast.error("Payment verification failed.");
          router.push("/checkout/cancel");
        }
      },
      modal: {
        ondismiss: () => router.push("/checkout/cancel"),
      },
      prefill: {
        name: shippingDetails.name,
        email: customerEmail,
        contact: shippingDetails.phone,
      },
      theme: {
        color: "#FFEB3B",
      },
    };

    // @ts-ignore – Razorpay script adds a global `Razorpay`
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const handleCheckoutSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const customerEmail = shippingDetails.email.trim() || userEmail?.trim();

    if (!customerEmail) {
      toast.error("Please enter your email address.");
      return;
    }

    void handlePay(customerEmail);
  };

  if (!authChecked || !isAuthenticated) return null;

  return (
    <section className="flex min-h-screen items-center justify-center bg-black/80 px-4">
      <form
        onSubmit={handleCheckoutSubmit}
        className="bg-zinc-900/90 backdrop-blur-sm p-8 rounded-xl border border-yellow-500/20 shadow-lg w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold text-yellow-500 mb-6 text-center">
          Checkout
        </h1>

        {/* Order Summary */}
        {cartItems.length > 0 && (
          <div className="mb-6 space-y-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Order Summary
            </h2>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {cartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between items-center text-sm border-b border-zinc-800 pb-2"
                >
                  <span className="text-white truncate mr-4">
                    {item.product.name}{" "}
                    <span className="text-gray-500">×{item.quantity}</span>
                  </span>
                  <span className="text-yellow-500 font-bold shrink-0">
                    ₹{item.product.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between items-center border-t border-zinc-800 pt-4 mb-6">
          <span className="text-gray-300 font-semibold">Total</span>
          <span className="text-2xl font-black text-yellow-500">
            ₹{cartTotal}
          </span>
        </div>

        <fieldset className="mb-6 space-y-4 border-t border-zinc-800 pt-6">
          <legend className="px-0 text-sm font-semibold uppercase tracking-wider text-gray-400">
            Delivery Details
          </legend>

          <div>
            <label htmlFor="shipping-name" className="mb-1 block text-xs font-medium text-gray-300">
              Full name
            </label>
            <input
              id="shipping-name"
              required
              value={shippingDetails.name}
              onChange={(event) => setShippingDetails({ ...shippingDetails, name: event.target.value })}
              className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2.5 text-sm text-white outline-none transition focus:border-yellow-500"
              placeholder="Your full name"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="shipping-email" className="mb-1 block text-xs font-medium text-gray-300">
                Email address
              </label>
              <input
                id="shipping-email"
                type="email"
                required={!userEmail}
                value={shippingDetails.email || userEmail || ""}
                onChange={(event) => setShippingDetails({ ...shippingDetails, email: event.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2.5 text-sm text-white outline-none transition focus:border-yellow-500"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="shipping-phone" className="mb-1 block text-xs font-medium text-gray-300">
                Phone number
              </label>
              <input
                id="shipping-phone"
                type="tel"
                required
                value={shippingDetails.phone}
                onChange={(event) => setShippingDetails({ ...shippingDetails, phone: event.target.value })}
                className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2.5 text-sm text-white outline-none transition focus:border-yellow-500"
                placeholder="98765 43210"
              />
            </div>
          </div>

          <div>
            <label htmlFor="shipping-address" className="mb-1 block text-xs font-medium text-gray-300">
              Delivery address
            </label>
            <textarea
              id="shipping-address"
              required
              rows={3}
              value={shippingDetails.address}
              onChange={(event) => setShippingDetails({ ...shippingDetails, address: event.target.value })}
              className="w-full resize-none rounded-lg border border-zinc-700 bg-black px-3 py-2.5 text-sm text-white outline-none transition focus:border-yellow-500"
              placeholder="House/flat number, street, locality"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="shipping-city" className="mb-1 block text-xs font-medium text-gray-300">City</label>
              <input id="shipping-city" required value={shippingDetails.city} onChange={(event) => setShippingDetails({ ...shippingDetails, city: event.target.value })} className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2.5 text-sm text-white outline-none transition focus:border-yellow-500" />
            </div>
            <div>
              <label htmlFor="shipping-state" className="mb-1 block text-xs font-medium text-gray-300">State</label>
              <input id="shipping-state" required value={shippingDetails.state} onChange={(event) => setShippingDetails({ ...shippingDetails, state: event.target.value })} className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2.5 text-sm text-white outline-none transition focus:border-yellow-500" />
            </div>
            <div>
              <label htmlFor="shipping-pincode" className="mb-1 block text-xs font-medium text-gray-300">Pincode</label>
              <input id="shipping-pincode" required inputMode="numeric" pattern="[0-9]{6}" title="Enter a 6-digit pincode" value={shippingDetails.pincode} onChange={(event) => setShippingDetails({ ...shippingDetails, pincode: event.target.value })} className="w-full rounded-lg border border-zinc-700 bg-black px-3 py-2.5 text-sm text-white outline-none transition focus:border-yellow-500" placeholder="123456" />
            </div>
          </div>
        </fieldset>

        <button
          type="submit"
          className="w-full bg-yellow-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition shadow-[0_0_20px_rgba(234,179,8,0.2)]"
        >
          Pay ₹{cartTotal} with Razorpay
        </button>

        <button
          type="button"
          onClick={() => router.push("/shop")}
          className="w-full mt-3 text-gray-400 hover:text-white text-sm py-2 transition"
        >
          ← Back to Shop
        </button>
      </form>
    </section>
  );
}
