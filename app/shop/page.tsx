"use client";

import { useState } from "react";
import { ShoppingCart, Search, Trash2, Plus, Minus, Check, X, ShieldAlert, Cpu, Heart } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  category: "microcontrollers" | "sensors" | "motors" | "power" | "filaments";
  price: number;
  rating: number;
  stock: number;
  image: string;
  specs: string[];
}

const productsData: Product[] = [
  {
    id: "esp32-devkit",
    name: "ESP32 NodeMCU Development Board",
    category: "microcontrollers",
    price: 349,
    rating: 4.8,
    stock: 25,
    image: "Esp32 Devkit Board",
    specs: ["Dual-core Tensilica LX6", "Wi-Fi & Bluetooth integrated", "38 GPIO pins"],
  },
  {
    id: "arduino-uno-r3",
    name: "Arduino Uno R3 (CH340G Compatible)",
    category: "microcontrollers",
    price: 499,
    rating: 4.7,
    stock: 18,
    image: "Arduino Uno R3",
    specs: ["ATmega328P MCU", "14 Digital I/O, 6 Analog Input", "5V Operating Voltage"],
  },
  {
    id: "dht22-sensor",
    name: "DHT22 Temperature & Humidity Sensor",
    category: "sensors",
    price: 180,
    rating: 4.6,
    stock: 40,
    image: "DHT22 Sensor Module",
    specs: ["High precision capacitive sensor", "3.3V to 6V input", "0-100% Humidity range"],
  },
  {
    id: "nema17-stepper",
    name: "NEMA 17 Stepper Motor (4.2kg-cm)",
    category: "motors",
    price: 749,
    rating: 4.9,
    stock: 12,
    image: "NEMA 17 Motor",
    specs: ["1.8 deg Step Angle", "1.5A rated current", "4-lead wire connection"],
  },
  {
    id: "tp4056-charger",
    name: "TP4056 Micro-USB Li-Ion Charger Board",
    category: "power",
    price: 35,
    rating: 4.5,
    stock: 120,
    image: "TP4056 Charger",
    specs: ["1A Linear Charging Current", "With protection circuit", "Status LEDs indication"],
  },
  {
    id: "pla-filament-yellow",
    name: "Premium PLA+ 3D Printer Filament (Yellow, 1kg)",
    category: "filaments",
    price: 1299,
    rating: 4.9,
    stock: 15,
    image: "Premium PLA+ Yellow",
    specs: ["1.75mm diameter, ±0.02mm tolerance", "190°C - 220°C print temp", "High layer adhesion"],
  },
  {
    id: "sg90-servo",
    name: "SG90 Micro Servo Motor 9g",
    category: "motors",
    price: 99,
    rating: 4.4,
    stock: 65,
    image: "SG90 9g Servo",
    specs: ["1.6kg/cm stall torque", "180 degree rotation speed", "Lightweight nylon gears"],
  },
  {
    id: "ultrasonic-hcsr04",
    name: "HC-SR04 Ultrasonic Distance Sensor",
    category: "sensors",
    price: 85,
    rating: 4.6,
    stock: 55,
    image: "HC-SR04 Sensor",
    specs: ["2cm to 400cm range", "40kHz frequency", "5V operating voltage"],
  }
];

interface CartItem {
  product: Product;
  quantity: number;
}

export default function ShopPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [shippingForm, setShippingForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
  });

  const handleAddToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.product.id === id) {
            const nextQty = item.quantity + delta;
            return { ...item, quantity: nextQty };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== id));
  };

  const filteredProducts = productsData.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.specs.some((spec) => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingFee = cartSubtotal > 999 ? 0 : 80;
  const cartTotal = cartSubtotal + shippingFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingForm.name || !shippingForm.phone || !shippingForm.address) {
      alert("Please fill out Name, Phone and Delivery Address.");
      return;
    }
    // Simulate API call to place order
    setOrderPlaced(true);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-black text-white py-16 px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tight">
              Electronics <span className="text-yellow-500">Shop</span>
            </h1>
            <p className="text-gray-400 mt-2">
              Premium components, sensors, microcontrollers and 3D printing filaments.
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search components..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-zinc-900 border border-yellow-500/20 text-white rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-yellow-500 transition w-64 text-sm"
              />
              <Search className="absolute left-3 top-3 text-gray-500" size={16} />
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative bg-yellow-500 text-black p-3 rounded-xl hover:bg-yellow-400 transition shadow-[0_0_15px_rgba(234,179,8,0.2)] flex items-center gap-2 font-bold"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="bg-black text-yellow-500 text-xs px-2 py-0.5 rounded-full font-black border border-yellow-500/20">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* LAYOUT CONTAINER */}
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* SIDEBAR FILTER */}
          <div className="w-full lg:w-64 shrink-0 bg-zinc-950/40 p-6 rounded-2xl border border-yellow-500/10 h-fit">
            <h3 className="text-yellow-500 font-bold text-base mb-4 flex items-center gap-2">
              <Cpu size={16} /> Categories
            </h3>
            <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 pb-2 lg:pb-0">
              {[
                { id: "all", label: "All Items" },
                { id: "microcontrollers", label: "Microcontrollers" },
                { id: "sensors", label: "Sensors & Modules" },
                { id: "motors", label: "Motors & Actuators" },
                { id: "power", label: "Power & Chargers" },
                { id: "filaments", label: "3D Filaments" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-left px-4 py-2.5 rounded-xl text-sm transition font-semibold whitespace-nowrap lg:whitespace-normal w-fit lg:w-full ${
                    activeCategory === cat.id
                      ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.05)]"
                      : "text-gray-400 hover:text-white border border-transparent hover:bg-zinc-900/50"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            
            <div className="mt-8 pt-6 border-t border-zinc-900 text-xs text-gray-500 space-y-2">
              <p>⚡ Fast delivery across India</p>
              <p>📦 Free shipping on orders above ₹999</p>
              <p>🛠️ 100% genuine components tested in-house</p>
            </div>
          </div>

          {/* PRODUCTS GRID */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-yellow-500/10 rounded-3xl bg-zinc-950/20">
                <p className="text-gray-500 text-lg">No components found matching your criteria.</p>
                <button
                  onClick={() => { setSearchTerm(""); setActiveCategory("all"); }}
                  className="text-yellow-500 text-sm font-semibold mt-4 underline"
                >
                  Clear filters & search
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group border border-yellow-500/10 rounded-2xl bg-zinc-950/50 p-5 flex flex-col justify-between hover:border-yellow-500/40 hover:shadow-[0_0_30px_rgba(234,179,8,0.06)] transition-all duration-300"
                  >
                    <div>
                      {/* Stylized Component Icon Box */}
                      <div className="h-36 bg-zinc-900 rounded-xl mb-4 flex items-center justify-center border border-yellow-500/5 relative overflow-hidden group-hover:border-yellow-500/10 transition-colors">
                        <Cpu className="text-yellow-500/20 group-hover:scale-110 group-hover:text-yellow-500/30 transition-all duration-300" size={64} />
                        <span className="absolute bottom-2.5 left-3 text-[10px] text-gray-500 font-bold tracking-wider uppercase bg-black/60 px-2 py-0.5 rounded border border-zinc-800">
                          {product.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-bold text-base mb-2 group-hover:text-yellow-500 transition-colors line-clamp-1">
                        {product.name}
                      </h3>

                      {/* Specs */}
                      <ul className="space-y-1 mb-4 text-xs text-gray-400">
                        {product.specs.slice(0, 3).map((spec, i) => (
                          <li key={i} className="flex items-center gap-1.5">
                            <span className="w-1 h-1 bg-yellow-500 rounded-full"></span>
                            <span className="line-clamp-1">{spec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      {/* Price and Stock */}
                      <div className="flex items-center justify-between border-t border-zinc-900 pt-3 mb-4">
                        <div>
                          <span className="text-xs text-gray-500 block">Price</span>
                          <span className="text-xl font-black text-white">₹{product.price}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-500 block">Availability</span>
                          <span className={`text-xs font-bold ${product.stock > 15 ? "text-emerald-500" : "text-amber-500"}`}>
                            {product.stock > 15 ? "In Stock" : `Only ${product.stock} left`}
                          </span>
                        </div>
                      </div>

                      {/* Add to Cart Button */}
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="w-full bg-zinc-900 hover:bg-yellow-500 hover:text-black border border-yellow-500/30 hover:border-yellow-500 font-bold py-2 px-4 rounded-xl text-sm transition duration-300 flex items-center justify-center gap-2"
                      >
                        <ShoppingCart size={16} />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* SLIDING CART SIDEBAR */}
        {isCartOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden font-sans">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
            <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
              <div className="w-screen max-w-md bg-zinc-950 border-l border-yellow-500/20 text-white flex flex-col justify-between shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                
                {/* Cart Head */}
                <div className="px-6 py-6 border-b border-zinc-900 flex justify-between items-center bg-black">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <ShoppingCart className="text-yellow-500" size={22} />
                    <span>Your Shopping Cart</span>
                  </h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-zinc-900 transition"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Cart Items List */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {cart.length === 0 ? (
                    <div className="text-center py-20 space-y-4">
                      <ShoppingCart className="mx-auto text-zinc-700" size={48} />
                      <p className="text-gray-400 font-semibold">Your cart is empty.</p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="text-yellow-500 font-bold hover:underline"
                      >
                        Keep browsing components
                      </button>
                    </div>
                  ) : (
                    cart.map((item) => (
                      <div key={item.product.id} className="flex gap-4 border-b border-zinc-900 pb-4">
                        <div className="w-16 h-16 bg-zinc-900 border border-zinc-800 rounded-xl flex items-center justify-center shrink-0">
                          <Cpu className="text-yellow-500/35" size={24} />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-sm text-white line-clamp-1">{item.product.name}</h4>
                              <button
                                onClick={() => handleRemoveFromCart(item.product.id)}
                                className="text-gray-500 hover:text-red-500 p-0.5"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            <span className="text-xs text-gray-500 font-medium">₹{item.product.price} each</span>
                          </div>
                          <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center gap-2.5 border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 rounded-lg">
                              <button
                                onClick={() => handleUpdateQty(item.product.id, -1)}
                                className="text-gray-400 hover:text-white p-0.5"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="text-xs font-bold text-yellow-500 min-w-4 text-center">{item.quantity}</span>
                              <button
                                onClick={() => handleUpdateQty(item.product.id, 1)}
                                className="text-gray-400 hover:text-white p-0.5"
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="text-sm font-black text-white">₹{item.product.price * item.quantity}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Cart Summary */}
                {cart.length > 0 && (
                  <div className="p-6 bg-black border-t border-zinc-900 space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Subtotal</span>
                        <span>₹{cartSubtotal}</span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>Shipping Fee</span>
                        <span>{shippingFee === 0 ? <span className="text-emerald-500 font-bold">FREE</span> : `₹${shippingFee}`}</span>
                      </div>
                      {shippingFee > 0 && (
                        <p className="text-[10px] text-yellow-500/80">Add ₹{1000 - cartSubtotal} more for free shipping</p>
                      )}
                      <div className="border-t border-zinc-900 pt-2 flex justify-between font-bold text-base text-white">
                        <span>Total Amount</span>
                        <span className="text-yellow-500 text-lg font-black">₹{cartTotal}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setIsCheckoutModalOpen(true);
                      }}
                      className="w-full bg-yellow-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition text-center shadow-[0_0_20px_rgba(234,179,8,0.2)] block"
                    >
                      Proceed to Checkout
                    </button>
                  </div>
                )}

              </div>
            </div>
          </div>
        )}

        {/* CHECKOUT MODAL */}
        {isCheckoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
            <div className="absolute inset-0 bg-black/75 backdrop-blur-sm" onClick={() => { if (!orderPlaced) setIsCheckoutModalOpen(false); }}></div>
            <div className="bg-zinc-950 border border-yellow-500/20 max-w-lg w-full rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(234,179,8,0.15)] relative z-10 p-6 md:p-8">
              
              {!orderPlaced ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
                      <Cpu size={20} /> Checkout Details
                    </h3>
                    <button
                      onClick={() => setIsCheckoutModalOpen(false)}
                      className="text-gray-400 hover:text-white p-1"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    <div>
                      <label className="text-xs text-gray-500 font-bold mb-1 block">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={shippingForm.name}
                        onChange={(e) => setShippingForm({ ...shippingForm, name: e.target.value })}
                        className="w-full bg-zinc-900 border border-yellow-500/20 text-white rounded-xl py-2 px-4 focus:outline-none focus:border-yellow-500 transition text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 font-bold mb-1 block">Phone Number</label>
                        <input
                          type="tel"
                          required
                          placeholder="+91 XXXXX XXXXX"
                          value={shippingForm.phone}
                          onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                          className="w-full bg-zinc-900 border border-yellow-500/20 text-white rounded-xl py-2 px-4 focus:outline-none focus:border-yellow-500 transition text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 font-bold mb-1 block">Email (Optional)</label>
                        <input
                          type="email"
                          placeholder="name@domain.com"
                          value={shippingForm.email}
                          onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                          className="w-full bg-zinc-900 border border-yellow-500/20 text-white rounded-xl py-2 px-4 focus:outline-none focus:border-yellow-500 transition text-sm"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs text-gray-500 font-bold mb-1 block">Delivery Address</label>
                      <textarea
                        required
                        rows={2}
                        placeholder="Flat/House No, Building, Street name"
                        value={shippingForm.address}
                        onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                        className="w-full bg-zinc-900 border border-yellow-500/20 text-white rounded-xl py-2 px-4 focus:outline-none focus:border-yellow-500 transition text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs text-gray-500 font-bold mb-1 block">City / Town</label>
                        <input
                          type="text"
                          required
                          placeholder="Bengaluru"
                          value={shippingForm.city}
                          onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                          className="w-full bg-zinc-900 border border-yellow-500/20 text-white rounded-xl py-2 px-4 focus:outline-none focus:border-yellow-500 transition text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 font-bold mb-1 block">Pincode</label>
                        <input
                          type="text"
                          required
                          placeholder="560001"
                          value={shippingForm.pincode}
                          onChange={(e) => setShippingForm({ ...shippingForm, pincode: e.target.value })}
                          className="w-full bg-zinc-900 border border-yellow-500/20 text-white rounded-xl py-2 px-4 focus:outline-none focus:border-yellow-500 transition text-sm"
                        />
                      </div>
                    </div>

                    <div className="bg-zinc-900/60 p-4 rounded-xl border border-yellow-500/5 mt-4">
                      <div className="flex justify-between items-center text-sm font-bold text-white mb-2">
                        <span>Total to Pay:</span>
                        <span className="text-yellow-500 text-lg">₹{cartTotal}</span>
                      </div>
                      <p className="text-[10px] text-gray-500 leading-normal">
                        Note: We currently support <strong>Cash on Delivery (COD)</strong> and <strong>UPI Transfer</strong> upon shipment confirmation. Our support representative will contact you via Phone / WhatsApp within 24 hours to confirm your order.
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-yellow-500 text-black py-3 rounded-xl font-bold hover:bg-yellow-400 transition mt-4"
                    >
                      Confirm Order
                    </button>
                  </form>
                </>
              ) : (
                <div className="text-center py-8 space-y-6">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                    <Check size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-black text-white">Order Placed Successfully!</h3>
                    <p className="text-gray-400 text-sm max-w-sm mx-auto">
                      Thank you for shopping at Threeditron, <strong>{shippingForm.name}</strong>. We have logged your request. Our executive will reach out to you shortly at <strong>{shippingForm.phone}</strong>.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsCheckoutModalOpen(false);
                      setOrderPlaced(false);
                      setShippingForm({ name: "", phone: "", email: "", address: "", city: "", pincode: "" });
                    }}
                    className="bg-yellow-500 text-black font-bold px-6 py-2.5 rounded-xl hover:bg-yellow-400 transition"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
