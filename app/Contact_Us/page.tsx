"use client";

import toast from "react-hot-toast";

import React, { SubmitEventHandler, useState } from "react";
import axios from "axios";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [error, setError] = useState("");

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    // // ✅ Validation
    // if (!form.name || !form.email || !form.message) {
    //   setError("Please fill all fields ⚠️");
    //   return;
    // }

    // ✅ Email format check (basic)
    const emailValid = /\S+@\S+\.\S+/.test(form.email);
    if (!emailValid) {
      setError("Enter a valid email ❌");
      return;
    }
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/contact`, form)
      .then((response) => {
        console.log(response.data.message);
        toast.success("Message sent succesfully");
      })
      .catch((e) => {
        console.log(e);
        toast.error("Error ");
      });
    console.log(form.name);
    console.log(form.email);
    console.log(form.message);

    // Reset form
    setForm({
      name: "",
      email: "",
      message: "",
    });
  };

  return (
    <section className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-center mb-12">
          Contact <span className="text-yellow-500">Us</span>
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 border border-yellow-500/30 p-8 rounded-xl"
        >
          {/* ERROR MESSAGE */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <input
            type="text"
            value={form.name}
            placeholder="Your Name"
            className="w-full p-3 rounded bg-gray-800 focus:outline-none"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <input
            type="email"
            value={form.email}
            placeholder="Your Email"
            className="w-full p-3 rounded bg-gray-800 focus:outline-none"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <textarea
            value={form.message}
            placeholder="Your Message"
            rows={5}
            className="w-full p-3 rounded bg-gray-800 focus:outline-none"
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />

          <button
            type="submit"
            disabled={!form.name || !form.email || !form.message}
            className={`w-full py-3 rounded-lg font-bold ${
              !form.name || !form.email || !form.message
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-yellow-500 hover:bg-yellow-400 text-black"
            }`}
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
