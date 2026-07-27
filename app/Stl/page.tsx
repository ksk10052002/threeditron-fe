"use client";
import React, { useState, useEffect } from "react";
import DropdownInput from "../components/DropdownInput";
import CustomInput from "../components/CustomInput";
import ColorSelector from "./ColorSelector";
import STLViewer from "../components/STLViewer";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { stlDetailsStore } from "@/store/userDetails";
import { routerGuard } from "@/store/pageAllowStore";
// import Hero from "../components/hero";

const Stl = () => {
  const router = useRouter();
  const [weight, setWeight] = useState<number | string>("");
  const [material, setMaterial] = useState<string | number>("");
  const [infill, setInfill] = useState<string | number>("");
  const [shipping, setShipping] = useState<string | number>("");
  const [quantity, setQuantity] = useState<number | string>(1);
  const [color, setColor] = useState<string | number>("");
  const [materialCost, setMaterialCost] = useState(0);
  const [infillCost, setInfillCost] = useState(0);
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [stlFile, setStlFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState("");
  const [volume, setVolume] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({
    x: 0,
    y: 0,
    z: 0,
  });
  const [buildError, setBuildError] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [printTime, setPrintTime] = useState<number | null>(null);

  // Store states
  const setStoreWeight = stlDetailsStore((s) => s.setWeight);
  const setStoreMaterial = stlDetailsStore((s) => s.setMaterial);
  const setStoreInfill = stlDetailsStore((s) => s.setInfill);
  const setStoreShipping = stlDetailsStore((s) => s.setShipping);
  const setStoreQuantity = stlDetailsStore((s) => s.setQuantity);
  const setStoreColor = stlDetailsStore((s) => s.setColor);
  const setStoreStlFile = stlDetailsStore((s) => s.setStlFile);
  const enableAccessUserDetails = routerGuard((s) => s.enableAccessUserDetails);
  const disableAccessUserDetails = routerGuard(
    (s) => s.disableAccessUserDetails,
  );

  <p className="text-white">{fileUrl}</p>;

  const handleQuantityBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "") {
      setQuantity(1);
      return;
    }
    if (!Number.isInteger(Number(value))) return;
  };
  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "") {
      setQuantity("");
      return;
    }
    if (!Number.isInteger(Number(value))) return;
    if (Number.parseInt(value, 10) < 1) {
      setQuantity(1);
      return;
    }
    setQuantity(Number.parseInt(value, 10));
  };

  const handleWeightChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "") {
      setWeight("");
      return;
    }
    setWeight(Number(value));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);

    setStlFile(file);
    setFileUrl(url);
    setVolume(null);
    setDimensions({ x: 0, y: 0, z: 0 });
    setPrintTime(null);

    event.target.value = "";

    // reset pricing calculator
    setMaterial("");
    setInfill("");
    setShipping(1);
    setQuantity(1);
    setWeight(0);
    setTotalPrice(0);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!file.name.toLowerCase().endsWith(".stl")) return;

    const url = URL.createObjectURL(file);

    setStlFile(file);
    setFileUrl(url);

    setVolume(null);
    setDimensions({ x: 0, y: 0, z: 0 });
    setPrintTime(null);

    // clear drag memory
    e.dataTransfer.clearData();
  };

  const handleProceed = (e: React.MouseEvent) => {
    e.preventDefault();
    if (material === "" || infill === "" || shipping === "" || color === "") {
      if (material === "") {
        toast.error("Please select a material");
      } else if (infill === "") {
        toast.error("Please select an infill");
      } else if (shipping === "") {
        toast.error("Please select a shipping option");
      } else if (color === "") {
        toast.error("Please select a color");
      }
      // Remove access when requirements didnt met
      disableAccessUserDetails();
    } else {
      setStoreWeight(weight);
      setStoreMaterial(material);
      setStoreInfill(infill);
      setStoreShipping(shipping);
      setStoreQuantity(quantity);
      setStoreColor(color);
      setStoreStlFile(stlFile);
      // Give acces when requirements met
      enableAccessUserDetails();
      toast.success("yay ! lets procced.");
      router.push("/CustomerDetails");
    }
  };
  const calculatePrice = () => {
    if (!weight || !material) return;

    let materialRate = 0;

    if (material === 1) materialRate = 10;
    if (material === 2) materialRate = 15;
    if (material === 3) materialRate = 25;
    if (material === 4) materialRate = 40;

    const baseMaterialCost = Number(weight) * materialRate;

    const infillMultiplier: Record<number, number> = {
      1: 0,
      2: 0.1,
      3: 0.3,
      4: 0.4,
      5: 0.5,
      6: 0.6,
      7: 0.7,
      8: 0.8,
      9: 0.9,
      10: 1,
    };

    const infillAdjustment =
      baseMaterialCost * (infillMultiplier[infill as number] || 0);

    const shippingMultiplier: Record<number, number> = {
      1: 0,
      2: 0.5,
      3: 1,
    };

    const subtotal =
      (baseMaterialCost + infillAdjustment) * Number(quantity || 1);

    const shippingValue =
      subtotal * (shippingMultiplier[shipping as number] || 0);

    const total = subtotal + shippingValue;

    setMaterialCost(Math.ceil(baseMaterialCost));
    setInfillCost(Math.ceil(infillAdjustment));
    setDeliveryCost(Math.ceil(shippingValue));
    setTotalPrice(Math.ceil(total));
  };

  useEffect(() => {
    calculatePrice();
  }, [weight, material, infill, quantity, shipping]);

  useEffect(() => {
    if (!volume) return;

    const materialDensity: any = {
      1: 1.24, //PLA
      2: 1.04, // ABS
      3: 1.21, //TPU in g/cm³
      4: 1.27, // PETG
    };

    const density = materialDensity[material] || 1.24;

    if (!density) return;

    const volumeCm3 = volume / 1000;

    const calculatedWeight = volumeCm3 * density;

    setWeight(Number(calculatedWeight.toFixed(2)));
  }, [volume, material]);

  useEffect(() => {
    if (!volume) return;

    // convert mm³ → cm³
    const volumeCm3 = volume / 1000;

    // simple estimate (depends on printer speed)
    const estimatedHours = volumeCm3 / 5;

    setPrintTime(Number(estimatedHours.toFixed(2)));
  }, [volume]);

  return (

    // <>
     /* <Hero /> */
     
    <div className="min-h-screen p-20 bg-gradient-to-br from-gray via-[#0f0f0f] to-[#eba613] text-white">
      <h2 className="text-2xl text-center mb-8">Upload & Get Instant Quote</h2>
      <div className="flex gap-10">
        <div className="w-100 text-center">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border border-yellow-500 rounded-xl h-[420px] w-[420px] relative overflow-hidden flex items-center justify-center shadow-[0_0_30px_rgba(255,204,0,0.15)] transition-all duration-200
          ${dragActive ? "bg-yellow-500/20 scale-105" : "bg-[#0b0b0b]"}`}
          >
            {fileUrl ? (
              <div className="absolute inset-0">
                <STLViewer
                  key={fileUrl}
                  fileUrl={fileUrl}
                  color={color}
                  onVolume={(v: number) => setVolume(v)}
                  onDimensions={(d: { x: number; y: number; z: number }) => {
                    setDimensions(d);

                    if (d.x > 220 || d.y > 220 || d.z > 250) {
                      setBuildError(true);
                    } else {
                      setBuildError(false);
                    }
                  }}
                />
              </div>
            ) : (
              <>
                <p className="text-yellow-400 text-lg font-bold">
                  Drag & Drop your STL file here
                </p>

                <p className="text-gray-400 text-sm">or click to browse</p>

                <input
                  type="file"
                  accept=".stl"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </>
            )}
          </div>

          {fileUrl && (
            <div className="mt-4 flex justify-center w-[420px]">
              <label className="bg-linear-to-r from-yellow-500 to-amber-500 hover:from-amber-500 hover:to-yellow-500 text-black px-4 py-2 rounded-lg font-bold cursor-pointer">
                Upload New STL
                <input
                  type="file"
                  accept=".stl"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {fileUrl && (
            <div>
              <div className="mt-4 w-[420px] border border-yellow-500 rounded-xl bg-gradient-to-b from-[#111] to-[#050505]       p-4">
                <h3 className="text-yellow-400 font-bold text-center mb-4">
                  Model Information
                </h3>
                <div className="grid grid-cols-3 text-center border border-yellow-500 rounded-lg overflow-hidden">
                  {/* Header */}
                  <div className="bg-yellow-500 text-black font-bold py-2">
                    Volume
                  </div>
                  <div className="bg-yellow-500 text-black font-bold py-2">
                    Dimensions
                  </div>
                  <div className="bg-yellow-500 text-black font-bold py-2">
                    Print Time
                  </div>

                  {/* Values */}
                  <div className="py-3 border-t border-yellow-500">
                    {volume ? (volume / 1000).toFixed(2) + " cm³" : "-"}
                  </div>

                  <div className="py-3 border-t border-yellow-500">
                    {dimensions
                      ? `${dimensions.x.toFixed(1)} × ${dimensions.y.toFixed(1)} × ${dimensions.z.toFixed(1)} mm`
                      : "-"}
                  </div>

                  <div className="py-3 border-t border-yellow-500">
                    {printTime ? `${printTime} hrs` : "-"}
                  </div>
                </div>
              </div>
              <br />
              {
                <button
                  className="mt-10 border border-black rounded-xl text-black font-bold py-3 px-15 bg-linear-to-r from-yellow-500 to-amber-500 text-xl hover:from-amber-500 hover:to-yellow-500 active:from-emerald-500 active:to-amber-400 cursor-pointer "
                  onClick={handleProceed}
                >
                  PROCEED !
                </button>
              }
            </div>
          )}

          {buildError && (
            <div className="mt-3 w-[420px] bg-red-500 text-white text-sm font-bold text-center py-2 rounded-lg">
              ⚠ Model exceeds printer build volume (220 × 220 × 250 mm)
            </div>
          )}
        </div>

        <div className="border border-yellow-500 rounded-xl p-6 w-[420px] bg-gradient-to-b from-[#111] to-[#050505] shadow-lg flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold text-center mb-4 flex flex-col gap-4">
            Pricing Calculator
          </h3>

          <CustomInput
            className="mb-4"
            label="Weight Auto_Detect"
            value={weight}
            readOnly
            onChange={handleWeightChange}
          />
          <DropdownInput
            className="mb-4"
            label="Material"
            value={material}
            onChange={(value) => setMaterial(value)}
            options={[
              { label: "PLA (₹10/g)", value: 1 },
              { label: "ABS (₹15/g)", value: 2 },
              { label: "TPU (₹25/g)", value: 3 },
              { label: "PETG (₹40/g)", value: 4 },
            ]}
          />
          <DropdownInput
            className="mb-4"
            label="Infill %"
            value={infill}
            onChange={(value) => setInfill(value)}
            options={[
              { label: "10%", value: 1 },
              { label: "20%", value: 2 },
              { label: "30%", value: 3 },
              { label: "40%", value: 4 },
              { label: "50%", value: 5 },
              { label: "60%", value: 6 },
              { label: "70%", value: 7 },
              { label: "80%", value: 8 },
              { label: "90%", value: 9 },
              { label: "100%", value: 10 },
            ]}
          />
          <ColorSelector value={color} onChange={(value) => setColor(value)} />
          <CustomInput
            className="mb-4"
            label="Quantity"
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleQuantityBlur}
          />
          <DropdownInput
            className="mb-4"
            label="Shipping"
            value={shipping}
            onChange={(value) => setShipping(value)}
            options={[
              { label: "Standard (5-7 days)", value: 1 },
              { label: "Express (2-3 days) +50%", value: 2 },
              { label: "Same Day (1-2 days) +100%", value: 3 },
            ]}
          />

          <div className="mt-6 border border-yellow-500 rounded-xl p-5 w-80">
            <h3 className="text-yellow-400 font-bold text-center mb-4">
              Price Breakdown
            </h3>

            <div className="flex justify-between text-sm mb-2">
              <span>Material Cost:</span>
              <span>₹{materialCost}</span>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span>Infill Adjustment:</span>
              <span>₹{infillCost}</span>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span>Quantity Multiplier:</span>
              <span>x{quantity}</span>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span>Delivery:</span>
              <span>₹{deliveryCost}</span>
            </div>

            <hr className="my-3 border-yellow-500" />

            <div className="flex justify-between font-bold text-lg">
              <span>TOTAL:</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    // </>
  );
};

export default Stl;
