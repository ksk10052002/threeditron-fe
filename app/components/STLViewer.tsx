"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Grid, Text, TransformControls } from "@react-three/drei";
import { STLLoader } from "three-stdlib";
import { useRef, useEffect, useState, useMemo } from "react";

import * as THREE from "three";

function calculateVolume(geometry: THREE.BufferGeometry) {
  const position = geometry.attributes.position;
  let volume = 0;

  for (let i = 0; i < position.count; i += 3) {
    const p1 = new THREE.Vector3().fromBufferAttribute(position, i);
    const p2 = new THREE.Vector3().fromBufferAttribute(position, i + 1);
    const p3 = new THREE.Vector3().fromBufferAttribute(position, i + 2);

    volume += p1.dot(p2.cross(p3)) / 6;
  }

  return Math.abs(volume);
}


function Model({ url, color, onVolume, onDimensions, meshRef }: any) {
  const originalGeometry = useLoader(STLLoader, url) as THREE.BufferGeometry;

  const { geometry, size, scale } = useMemo(() => {
    // Clone original geometry to avoid modifying useLoader cache and to allow re-renders
    const geo = originalGeometry.clone();

    // Rotate geometry so Z-up of STL maps to Y-up of Three.js (upright position)
    geo.rotateX(-Math.PI / 2);

    geo.computeBoundingBox();
    const box = geo.boundingBox!;
    const sizeVec = new THREE.Vector3();
    const centre = new THREE.Vector3();

    box.getSize(sizeVec);
    box.getCenter(centre);

    const scaleVal = 60 / Math.max(sizeVec.x, sizeVec.y, sizeVec.z);

    // Center geometry horizontally and set the bottom to Y = 0
    geo.translate(-centre.x, -box.min.y, -centre.z);

    return {
      geometry: geo,
      size: sizeVec,
      scale: scaleVal,
    };
  }, [originalGeometry]);

  useEffect(() => {
    // Send dimensions mapping back to original STL coordinates (X is X, Y is size.z, Z is size.y)
    if (onDimensions) {
      onDimensions({
        x: size.x,
        y: size.z,
        z: size.y
      });
    }

    // Calculate volume
    if (onVolume) {
      const volume = calculateVolume(geometry);
      onVolume(volume);
    }
  }, []);

  return (
    <mesh ref={meshRef} geometry={geometry} scale={scale}>
      <meshStandardMaterial color={color || "#FFFFFF"}
        roughness={0.4}
        metalness={0.1}
      />
    </mesh>
  );
}


export default function STLViewer({ fileUrl, color, onVolume, onDimensions }: any) {

  const containerRef = useRef(null);
  const controlsRef = useRef<any>(null);
  const transformRef = useRef<any>(null);
  const meshRef = useRef<any>(null);

  const [mode, setMode] = useState("translate");
  // const [mode, setMode] = useState("rotate");

  if (!fileUrl) return null;


  const resetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }

    if (meshRef.current) {
      meshRef.current.position.set(0, 0, 0);
      meshRef.current.rotation.set(0, 0, 0);
      meshRef.current.updateMatrixWorld(true);
    }

    if (transformRef.current && transformRef.current.object) {
      transformRef.current.object.position.set(0, 0, 0);
      transformRef.current.object.rotation.set(0, 0, 0);
      transformRef.current.updateMatrixWorld();
    }
    dropToPlate();
  };




  const dropToPlate = () => {
    if (!meshRef.current) return;

    meshRef.current.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(meshRef.current);
    const minY = box.min.y;

    if (minY < 0) {
      meshRef.current.position.y -= minY;
      meshRef.current.updateMatrixWorld(true);
    }
  };


  return (
    <div ref={containerRef} className="w-full h-full relative">
      <button
        onClick={resetView}
        className="absolute top-3 right-3 z-10 bg-yellow-500 text-black px-3 py-1 rounded text-sm font-bold hover:bg-yellow-400"
      >
        Reset View
      </button>


      <div className="absolute top-3 left-3 z-10 flex gap-2">
        {/* <button
      onClick={() => setMode("rotate")}
      className="bg-yellow-500 px-3 py-1 rounded text-black font-bold"
    >
      Rotate
    </button> */}

        <button
          onClick={() => setMode("translate")}
          className="bg-yellow-500 px-3 py-1 rounded text-black font-bold"
        >
          Move
        </button>
      </div>


      <Canvas
        style={{ width: "100%", height: "100%" }}
        camera={{ position: [0, 80, 120], fov: 50 }}
      >
        <color attach="background" args={["#f3f4f6"]} />

        <ambientLight intensity={0.8} />
        <directionalLight position={[60, 80, 40]} intensity={1.2} />
        {/* <directionalLight position={[50, 50, 50]} intensity={1} /> */}

        {/* Build Plate */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
          <planeGeometry args={[200, 200]} />
          <meshStandardMaterial color="#e5e7eb" roughness={0.8} metalness={0.1} />
        </mesh>

        {/* Grid */}
        <Grid
          args={[200, 200]}
          cellSize={10}
          cellThickness={0.5}
          cellColor="#9ca3af"
          sectionSize={50}
          sectionThickness={1.5}
          sectionColor="#374151"
          fadeDistance={300}
          fadeStrength={1}
          followCamera={false}
          infiniteGrid={false}
        />

        {/* Corner XYZ Axis */}
        <axesHelper args={[30]} position={[-70, 5, -80]} />

        <Text position={[-35, 5, -80]} fontSize={7} color="#eb0909">
          X
        </Text>

        <Text position={[-70, 5, -45]} fontSize={7} color="blue">
          Y
        </Text>

        <Text position={[-70, 40, -80]} fontSize={7} color="green">
          Z
        </Text>

        <TransformControls
          ref={transformRef}
          mode="translate"
          space="local"
          rotationSnap={THREE.MathUtils.degToRad(5)}
          onMouseDown={() => (controlsRef.current.enabled = false)}
          onMouseUp={() => (controlsRef.current.enabled = true)}
          onObjectChange={dropToPlate}
        >
          <Model
            url={fileUrl}
            color={color}
            onVolume={onVolume}
            onDimensions={onDimensions}
            meshRef={meshRef}
          />
        </TransformControls>

        <OrbitControls
          ref={controlsRef}
          enableZoom
          enablePan
          enableRotate
        />

      </Canvas>
    </div>


  );
}