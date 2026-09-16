"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useEffect } from "react";
import axios from "axios";
import SplitFlapText from "../component/SplitFlapText";

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
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-10 px-4 sm:px-6 py-12 sm:py-16 lg:py-20 items-center">
        {/* LEFT TEXT */}
        <div>
          <div className="mb-5">
            <SplitFlapText
              words={["THREEDITRON", "CIRCUIT LAB", "3D PRINTLAB"]}
              // text={"THREEDITRON"}
              text
              flipDuration={0.12}
              stagger={0.06}
              cycleDelay={2400}
              charset="alphanumeric"
              flipsPerChar={8}
              tileColor="#111827"
              textColor="#f8fafc"
              tileRadius={8}
              gap={6}
              fontSize={52}
              loop={true}
              padTo={11}
            />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-4xl font-bold leading-tight">
            Upload Your <span className="text-yellow-500">3D Model</span>
            <br />
            Get Instant Price
          </h1>

          <h1 className="text-gray-400 mt-6 text-lg">
            Professional 3D printing service with instant STL analysis, volume
            calculation and automatic pricing.
          </h1>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8">
            <a
              href="/Stl"
              className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-400 text-center"
            >
              Get Quote
            </a>

            <a
              href="/Services"
              className="border border-yellow-500 px-6 py-3 rounded-lg hover:bg-yellow-500 hover:text-black text-center"
            >
              Our Services
            </a>
          </div>
        </div>

        {/* RIGHT 3D MODEL */}
        <div className="h-[280px] sm:h-[360px] lg:h-[400px]">
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
