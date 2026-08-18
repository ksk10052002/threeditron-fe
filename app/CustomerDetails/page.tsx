"use client";
import React, { useEffect, useState } from "react";
import { stlDetailsStore } from "@/store/userDetails";
import { routerGuard } from "@/store/pageAllowStore";
import { useRouter } from "next/navigation";

const CustomerDetails = () => {
  const router = useRouter();
  const pageAccess = routerGuard((s) => s.accessUserDetails);
  const disableAccessUserDetails = routerGuard(
    (s) => s.disableAccessUserDetails,
  );
  const [check, setCheck] = useState<boolean>(false);
  const [showDelivery, setShowDelivery] = useState(false);
  // const [fileKey, setFileKey] = useState<string>('');
  // const [fileName, setFileName] = useState<string>('')
  // const weight = stlDetailsStore((s) => s.weight);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  // const {
  //   weight,
  //   material,
  //   infill,
  //   shipping,
  //   quantity,
  //   color,
  //   stlFile,
  // } = stlDetailsStore();

  const {
    weight,
    material,
    infill,
    shipping,
    quantity,
    color,
    stlFile,
  } = stlDetailsStore();


  const uploadToR2 = async (file: File) => {
    console.log("uploadToR2 started");
    try {
      // STEP 1
      const presignResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/uploads/presign`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fileName: file.name,
            fileType: file.type || "application/sla",
          }),
        },
      );

      const presignData = await presignResponse.json();

      // STEP 2

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

      // Save into Zustand
      console.log("Saving filekey:", presignData.key);
      // setFileKey(presignData.key);
      // setFileName(file.name);
      console.log("Setting uploadSuccess = true");
      return { fileKey: presignData.key, fileName: file.name };

    } catch (err) {
      console.log("Upload Error", err);
      return { "fileKey": "", "fileName": "" }
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

  // const handleQuote = () => {
  //   console.log("Quote requested", form);
  // };

  const handleQuote = async () => {
    try {

      if (stlFile !== null) {
        const { fileKey, fileName } = await uploadToR2(stlFile);

        if (!fileKey) {
          alert("Please upload STL first.");
          return;
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/uploads/confirm`,
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

              material,
              color,
              quantity,
              weight,
              infill,
              shipping,

              fileKey,
              fileName,
            }),
          },
        );

        const result = await response.json();

        if (result.success) {
          alert("Quote Submitted Successfully!");
        } else {
          alert("Something went wrong.");
        }
      } else {
        throw Error("Please upload an STL file first.")
      }
    } catch (err) {
      console.log(err);

      alert("Something went wrong.");
    }
  }



  // const handleQuote = async () => {
  //   try {

  //     if (!stlFile) {
  //       alert("Please upload an STL file first.");
  //       return;
  //     }

  //     // STEP 1 - Ask backend for upload URL
  //     const presignResponse = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/uploads/presign`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           fileName: stlFile.name,
  //           fileType: stlFile.type || "application/sla",
  //         }),
  //       }
  //     );

  //     const presignData = await presignResponse.json();

  //     if (!presignData.success) {
  //       alert("Unable to generate upload URL.");
  //       return;
  //     }

  //     // STEP 2 - Upload STL directly to Cloudflare R2
  //     const uploadResponse = await fetch(presignData.uploadUrl, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": stlFile.type || "application/sla",
  //       },
  //       body: stlFile,
  //     });

  //     console.log("Status:", uploadResponse.status);
  //     console.log("Status Text:", uploadResponse.statusText);

  //     const responseText = await uploadResponse.text();
  //     console.log(responseText);

  //     if (!uploadResponse.ok) {
  //       alert("File upload failed.");
  //       return;
  //     }

  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quote`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           name: form.name,
  //           phone: form.phone,
  //           email: form.email,
  //           message: form.message,

  //           material,
  //           color,
  //           quantity,
  //           weight,
  //           infill,
  //           shipping,

  //           fileKey: presignData.key,
  //           fileName: stlFile.name,
  //         }),
  //       }
  //     );

  //     const result = await response.json();

  //     if (result.success) {
  //       alert("Quote Submitted Successfully!");
  //     } else {
  //       alert("Something went wrong.");
  //     }

  //     alert("STL uploaded successfully!");

  //     console.log("R2 Key:", presignData.key);

  //   } catch (err) {
  //     console.error(err);
  //     alert("Something went wrong.");
  //   }
  // };

  const handleCart = () => {
    console.log("Added to cart", form);
    setShowDelivery(true);
  };

  const handleBuy = () => {
    console.log("buy");
  };

  useEffect(() => {
    if (!pageAccess) {
      console.log("you are not allowed");
      router.push("Stl");
    } else {
      setCheck(true);
      disableAccessUserDetails();
    }
  }, []);

  if (!check) return null;
  return (
    // <div>
    <div
      className="pt-20 w-full h-screen bg-cover"
      style={{ backgroundImage: "url('/images/printer.png')" }}
    >
      <div className="shadow-[0px_0px_35px_rgba(255,49,49,1)] ring-1 ring-amber-400  p-6 rounded-xl border border-amber-400/20 max-w-md w-full mx-auto space-y-4 glass">
        <h2 className="text-xl font-semibold text-yellow-500">
          Get a Quote / Add to Cart
        </h2>

        <input
          name="name"
          placeholder="Name"
          onChange={handleChange}
          className="w-full bg-red-100/20 border border-amber-400/40 text-yellow-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
        />

        <input
          name="phone"
          placeholder="Phone"
          onChange={handleChange}
          className="w-full bg-red-100/20 border border-amber-400/40 text-yellow-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full bg-red-100/20 border border-amber-400/40 text-yellow-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
        />

        <textarea
          name="message"
          placeholder="Any message..."
          rows={3}
          onChange={handleChange}
          className="w-full bg-red-100/20 border border-amber-400/40 text-yellow-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
        />
        <div
          className={`overflow-hidden transition-all duration-500 ${showDelivery
            ? "max-h-[500px] opacity-100 mt-2"
            : "max-h-0 opacity-0"
            }`}
        >
          {/* <input
          name="address"
          placeholder="Address"
          onChange={handleChange}
          className="w-full mt-3 bg-red-100/20 border border-amber-400/40 text-yellow-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
        /> */}
          <textarea
            name="address"
            placeholder="Address"
            rows={3}
            onChange={handleChange}
            className="w-full bg-red-100/20 border border-amber-400/40 text-yellow-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />

          <input
            name="city"
            placeholder="City"
            onChange={handleChange}
            className="w-full mt-3 bg-red-100/20 border border-amber-400/40 text-yellow-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />

          <input
            name="state"
            placeholder="State"
            onChange={handleChange}
            className="w-full mt-3 bg-red-100/20 border border-amber-400/40 text-yellow-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />

          <input
            name="pincode"
            placeholder="Pincode"
            onChange={handleChange}
            className="w-full mt-3 bg-red-100/20 border border-amber-400/40 text-yellow-400 px-4 py-2 rounded-lg focus:ring-2 focus:ring-yellow-500 outline-none"
          />
        </div>
        <div className="flex gap-3 pt-2">
          {showDelivery ? (
            <button
              onClick={handleBuy}
              className="flex-1 bg-amber-400 text-black font-semibold py-2 rounded-lg hover:bg-yellow-500 transition"
            >
              Buy
            </button>
          ) : (
            <button
              onClick={handleCart}
              className="flex-1 bg-amber-400 text-black font-semibold py-2 rounded-lg hover:bg-yellow-500 transition"
            >
              Add to Cart
            </button>
          )}

          <button
            onClick={handleQuote}
            className="flex-1 border border-yellow-500 text-yellow-500 py-2 rounded-lg hover:bg-yellow-500 hover:text-black transition"
          >
            Get Quote
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
