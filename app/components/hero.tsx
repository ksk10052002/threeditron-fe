"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect } from "react";
import axios from "axios";

function DemoModel() {
  return (
    <mesh rotation={[0.3, 0.4, 0]}>
      <torusKnotGeometry args={[20, 6, 200, 32]} />
      <meshStandardMaterial color="#eab308" metalness={0.6} roughness={0.3} />
    </mesh>
  );
}

const Hero = () => {
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/wakeup`)
      .then((response) => console.log(response.data))
      .catch((err) => {
        console.log("Axios error", err);
        console.log("Unable to wake server from client side");
      });
  }, []);
  return (
    <section className="w-full bg-black text-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 px-6 py-20 items-center">
        {/* LEFT TEXT */}
        <div>
          <h1 className="text-5xl font-bold leading-tight">
            Upload Your <span className="text-yellow-500">3D Model</span>
            <br />
            Get Instant Price
          </h1>

          <h1 className="text-gray-400 mt-6 text-lg">
            Professional 3D printing service with instant STL analysis, volume
            calculation and automatic pricing.
          </h1>

          <div className="flex gap-4 mt-8">
            <a
              href="/Stl"
              className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400"
            >
              Get Quote
            </a>

            <a
              href="/Services"
              className="border border-yellow-500 px-6 py-3 rounded-lg hover:bg-yellow-500 hover:text-black"
            >
              Our Services
            </a>
          </div>
        </div>

        {/* RIGHT 3D MODEL */}
        <div className="h-[400px]">
          <Canvas camera={{ position: [0, 0, 80] }}>
            <ambientLight intensity={1} />
            <directionalLight position={[50, 50, 50]} />

            <DemoModel />

            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} />
          </Canvas>
        </div>
      </div>
    </section>
  );
};
export default Hero;
