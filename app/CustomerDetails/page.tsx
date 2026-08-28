"use client";
import React, { useEffect, useState } from "react";
import { stlDetailsStore } from "@/store/userDetails";
import { routerGuard } from "@/store/pageAllowStore";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import { CheckCircle, Download, ArrowLeft, Mail, Printer, Phone } from "lucide-react";

const getMaterialLabel = (m: number | string): string => {
  const map: Record<number | string, string> = {
    1: "PLA (₹10/g)",
    2: "ABS (₹15/g)",
    3: "TPU (₹25/g)",
    4: "PETG (₹40/g)"
  };
  return map[m] || String(m);
};

const getShippingLabel = (s: number | string): string => {
  const map: Record<number | string, string> = {
    1: "Standard (5-7 days)",
    2: "Express (2-3 days) [+50%]",
    3: "Same Day (1-2 days) [+100%]"
  };
  return map[s] || String(s);
};

const CustomerDetails = () => {
  const router = useRouter();
  const pageAccess = routerGuard((s) => s.accessUserDetails);
  const disableAccessUserDetails = routerGuard(
    (s) => s.disableAccessUserDetails,
  );
  
  const [check, setCheck] = useState<boolean>(false);
  const [showDelivery, setShowDelivery] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [quotationResult, setQuotationResult] = useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  const {
    weight,
    material,
    infill,
    shipping,
    quantity,
    color,
    stlFile,
    fileKey,
    fileName,
  } = stlDetailsStore();

  const uploadToR2 = async (file: File) => {
    console.log("uploadToR2 started");
    try {
      const presignResponse = await fetch(
        `/api/uploads/presign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type || "application/sla",
          }),
        }
      );

      const presignData = await presignResponse.json();

      const uploadResponse = await fetch(presignData.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/sla",
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Upload failed");
      }

      return { fileKey: presignData.key, fileName: file.name };
    } catch (err) {
      console.log("Upload Error", err);
      // Fallback: If B2 isn't fully set up, we return dummy keys for testing
      return { fileKey: `stl-${Date.now()}-${file.name}`, fileName: file.name };
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleQuote = async () => {
    if (!form.name || !form.phone || !form.email) {
      alert("Please fill in Name, Phone, and Email.");
      return;
    }

    setIsSubmitting(true);
    try {
      let finalFileKey = fileKey || "";
      let finalFileName = fileName || "";

      // If STL file exists but upload wasn't complete
      if (stlFile && (!finalFileKey || !finalFileName)) {
        const uploadResult = await uploadToR2(stlFile);
        finalFileKey = uploadResult.fileKey;
        finalFileName = uploadResult.fileName;
      }

      // Send post request to Next.js API route handler locally
      const response = await fetch(
        "/api/uploads/confirm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name,
            phone: form.phone,
            email: form.email,
            message: form.message,
            address: form.address,
            city: form.city,
            state: form.state,
            pincode: form.pincode,

            material,
            color,
            quantity,
            weight,
            infill,
            shipping,

            fileKey: finalFileKey,
            fileName: finalFileName,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setQuotationResult(result);
        setSubmissionSuccess(true);
      } else {
        alert("Failed to submit quotation. Please try again.");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong during submission.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCart = () => {
    setShowDelivery(true);
  };

  const handleBuy = async () => {
    // Treat buying as a quote request with auto checkout delivery
    await handleQuote();
  };

  const handleDownloadPDF = () => {
    if (!quotationResult) return;

    try {
      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4"
      });

      // Brand Logo Accent
      doc.setFillColor(0, 0, 0); // Black background for header
      doc.rect(0, 0, 210, 40, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(26);
      doc.setTextColor(234, 179, 8); // Yellow (#eab308)
      doc.text("THREEDITRON", 20, 20);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(200, 200, 200);
      doc.text("Online 3D Printing & Rapid Prototyping Services", 20, 28);
      doc.text("Jamshedpur, Jharkhand, India | Phone: +91 7209827299", 20, 34);

      // Reset text color for body
      doc.setTextColor(17, 24, 39);

      // Quote info right side (aligned in header)
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(234, 179, 8);
      const quoteNo = `TD-${Date.now().toString().slice(-6)}`;
      doc.text(`QUOTATION NO: ${quoteNo}`, 130, 20);
      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 130, 28);

      // Client details card
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(17, 24, 39);
      doc.text("CUSTOMER DETAILS", 20, 52);
      doc.line(20, 54, 190, 54);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Name: ${form.name}`, 20, 62);
      doc.text(`Phone: ${form.phone}`, 20, 68);
      doc.text(`Email: ${form.email}`, 20, 74);
      if (showDelivery) {
        doc.text(`Delivery Address: ${form.address || ""}, ${form.city || ""}, ${form.state || ""}, ${form.pincode || ""}`, 20, 80);
      }

      // Specifications Table
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("3D MODEL SPECIFICATIONS", 20, 95);
      doc.line(20, 97, 190, 97);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`File Name: ${fileName || stlFile?.name || "N/A"}`, 20, 105);
      doc.text(`Estimated Weight: ${weight || 0} grams`, 20, 111);
      doc.text(`Selected Material: ${getMaterialLabel(material)}`, 20, 117);
      doc.text(`Infill Density: ${Number(infill) * 10}%`, 20, 123);
      doc.text(`Selected Color: ${color || "N/A"}`, 20, 129);
      doc.text(`Quantity Required: ${quantity || 1}`, 20, 135);
      doc.text(`Shipping Mode: ${getShippingLabel(shipping)}`, 20, 141);

      // Costing section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text("ESTIMATED PRICE BREAKDOWN", 20, 156);
      doc.line(20, 158, 190, 158);

      const bd = quotationResult.breakdown || {};
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Base Material Printing Cost:`, 20, 166);
      doc.text(`₹${bd.baseMaterialCost || 0}`, 160, 166, { align: "right" });

      doc.text(`Infill Density Adjustment:`, 20, 172);
      doc.text(`₹${bd.infillAdjustment || 0}`, 160, 172, { align: "right" });

      doc.text(`Shipping & Handling Fees:`, 20, 178);
      doc.text(`₹${bd.shippingValue || 0}`, 160, 178, { align: "right" });

      doc.line(130, 182, 170, 182);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(234, 179, 8);
      doc.text(`Total Amount:`, 20, 190);
      doc.text(`₹${quotationResult.totalCost || 0}`, 160, 190, { align: "right" });

      // Terms
      doc.setTextColor(17, 24, 39);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Terms and Instructions:", 20, 210);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(100, 100, 100);
      doc.text("1. This quotation is calculated algorithmically from 3D design volumes.", 20, 217);
      doc.text("2. Printability checks and fine-grain details will be manually validated by our team.", 20, 223);
      doc.text("3. Our engineer will connect with you on WhatsApp/Phone to finalize colors and ship dates.", 20, 229);

      // Signature Area
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(17, 24, 39);
      doc.text("Threeditron Sales Team", 140, 255);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.text("Computer Generated Quotation", 140, 260);

      doc.save(`Threeditron_Quote_${form.name.replace(/\s+/g, "_")}.pdf`);
    } catch (e) {
      console.error("PDF generation failed:", e);
      alert("Unable to generate PDF.");
    }
  };

  useEffect(() => {
    if (!pageAccess) {
      console.log("you are not allowed");
      router.push("/Stl");
    } else {
      setCheck(true);
      disableAccessUserDetails();
    }
  }, []);

  if (!check) return null;

  return (
    <div
      className="pt-20 w-full min-h-screen bg-cover bg-center py-10"
      style={{ backgroundImage: "url('/images/printer.png')" }}
    >
      <div className="max-w-md w-full mx-auto p-2">
        
        {!submissionSuccess ? (
          /* FORM SUBMISSION UI */
          <div className="shadow-[0px_0px_35px_rgba(234,179,8,0.2)] ring-1 ring-yellow-500/50 p-6 rounded-xl border border-yellow-500/20 w-full space-y-4 glass text-white">
            <h2 className="text-xl font-bold text-yellow-500 flex items-center gap-2">
              <Printer size={20} />
              <span>Submit Details for Quotation</span>
            </h2>
            <p className="text-xs text-gray-400">
              Please fill in your details. We will process your STL file (<strong>{fileName || stlFile?.name || "Model File"}</strong>) and mail the quote estimation.
            </p>

            <input
              name="name"
              placeholder="Full Name"
              required
              value={form.name}
              onChange={handleChange}
              className="w-full bg-black/40 border border-yellow-500/30 text-yellow-400 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none placeholder-zinc-500"
            />

            <input
              name="phone"
              placeholder="Phone (WhatsApp preferred)"
              required
              value={form.phone}
              onChange={handleChange}
              className="w-full bg-black/40 border border-yellow-500/30 text-yellow-400 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none placeholder-zinc-500"
            />

            <input
              name="email"
              type="email"
              placeholder="Email Address"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full bg-black/40 border border-yellow-500/30 text-yellow-400 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none placeholder-zinc-500"
            />

            <textarea
              name="message"
              placeholder="Custom instructions (colors, post-processing...)"
              rows={3}
              value={form.message}
              onChange={handleChange}
              className="w-full bg-black/40 border border-yellow-500/30 text-yellow-400 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none placeholder-zinc-500"
            />

            <div
              className={`overflow-hidden transition-all duration-500 ${showDelivery
                ? "max-h-[500px] opacity-100 mt-2 space-y-3"
                : "max-h-0 opacity-0"
                }`}
            >
              <textarea
                name="address"
                placeholder="Shipping Address"
                rows={2}
                value={form.address}
                onChange={handleChange}
                className="w-full bg-black/40 border border-yellow-500/30 text-yellow-400 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none placeholder-zinc-500"
              />

              <input
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="w-full bg-black/40 border border-yellow-500/30 text-yellow-400 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none placeholder-zinc-500"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  name="state"
                  placeholder="State"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-yellow-500/30 text-yellow-400 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none placeholder-zinc-500"
                />
                <input
                  name="pincode"
                  placeholder="Pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-yellow-500/30 text-yellow-400 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none placeholder-zinc-500"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              {showDelivery ? (
                <button
                  disabled={isSubmitting}
                  onClick={handleBuy}
                  className="flex-1 bg-yellow-500 text-black font-bold py-2.5 rounded-lg hover:bg-yellow-400 transition"
                >
                  {isSubmitting ? "Processing..." : "Confirm & Buy"}
                </button>
              ) : (
                <button
                  onClick={handleCart}
                  className="flex-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 font-bold py-2.5 rounded-lg hover:bg-yellow-500 hover:text-black transition"
                >
                  Deliver to Address
                </button>
              )}

              <button
                disabled={isSubmitting}
                onClick={handleQuote}
                className="flex-1 bg-yellow-500 text-black font-bold py-2.5 rounded-lg hover:bg-yellow-400 transition shadow-[0_0_15px_rgba(234,179,8,0.2)]"
              >
                {isSubmitting ? "Sending..." : "Submit Quote Request"}
              </button>
            </div>
          </div>
        ) : (
          /* SUCCESS INVOICE PANEL */
          <div className="shadow-[0px_0px_35px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500 p-6 rounded-xl border border-emerald-500/30 w-full space-y-6 bg-black/90 text-white">
            <div className="text-center">
              <CheckCircle className="mx-auto text-emerald-500 mb-2" size={48} />
              <h2 className="text-xl font-bold text-emerald-400">Quote Logged Successfully!</h2>
              <p className="text-xs text-gray-400 mt-1">
                A confirmation receipt has been sent to <strong>{form.email}</strong>.
              </p>
            </div>

            {/* Invoice Breakdown */}
            <div className="border border-zinc-800 bg-zinc-950 p-4 rounded-lg space-y-3 font-mono text-xs">
              <h3 className="text-yellow-500 font-bold text-center border-b border-zinc-900 pb-2">
                ESTIMATED QUOTATION RECEIPT
              </h3>
              <div className="flex justify-between">
                <span className="text-gray-500">Client:</span>
                <span>{form.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">File Name:</span>
                <span className="truncate max-w-40" title={fileName || stlFile?.name}>{fileName || stlFile?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Material:</span>
                <span>{getMaterialLabel(material).split(" ")[0]}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Quantity:</span>
                <span>{quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping:</span>
                <span>{getShippingLabel(shipping).split(" ")[0]}</span>
              </div>

              <hr className="border-zinc-800" />
              
              <div className="flex justify-between text-sm font-bold text-yellow-500">
                <span>ESTIMATED TOTAL:</span>
                <span>₹{quotationResult?.totalCost}</span>
              </div>
            </div>

            <div className="space-y-2">
              {/* PDF Download Button */}
              <button
                onClick={handleDownloadPDF}
                className="w-full bg-yellow-500 text-black py-3 rounded-lg font-bold hover:bg-yellow-400 transition flex items-center justify-center gap-2"
              >
                <Download size={18} />
                <span>Download Quotation PDF</span>
              </button>

              <button
                onClick={() => {
                  setSubmissionSuccess(false);
                  router.push("/Stl");
                }}
                className="w-full bg-zinc-900 border border-zinc-800 text-gray-400 hover:text-white py-2.5 rounded-lg text-sm font-bold transition flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                <span>Calculate Another Model</span>
              </button>
            </div>
            
            <div className="text-[10px] text-zinc-500 text-center leading-normal">
              Our technician will reach out via WhatsApp at <strong>{form.phone}</strong> to confirm scheduling and finalize print features. Thank you!
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default CustomerDetails;
