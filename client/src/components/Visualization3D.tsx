/**
 * Componente de visualização 3D da viga com Three.js
 * Design: Dark Mode Profissional - Similar ao StructuraCalc
 * - Renderização 3D interativa com grid
 * - Perspectiva isométrica
 * - Cores técnicas (azul para aço, cinza para concreto)
 */

import { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Box, Grid } from "@react-three/drei";
import * as THREE from "three";
import {
  BeamDimensions,
  ReinforcementConfig,
  StructuralResults,
} from "@/types/beam";

interface Visualization3DProps {
  dimensions: BeamDimensions;
  reinforcement: ReinforcementConfig;
  results: StructuralResults;
}

function BeamModel({
  dimensions,
  reinforcement,
  results,
}: {
  dimensions: BeamDimensions;
  reinforcement: ReinforcementConfig;
  results: StructuralResults;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005;
    }
  });

  // Dimensões em metros
  const length = dimensions.length;
  const width = dimensions.width / 100;
  const height = dimensions.height / 100;

  return (
    <group ref={groupRef}>
      {/* Concreto - Viga principal */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[length, height, width]} />
        <meshPhongMaterial color="#64748b" shininess={10} />
      </mesh>

      {/* Armadura Superior - Barras */}
      {Array.from({ length: reinforcement.topRebars.quantity }).map((_, i) => {
        const spacing =
          (length - 0.1) / (reinforcement.topRebars.quantity - 1 || 1);
        const x = -length / 2 + 0.05 + i * spacing;
        const y = height / 2 - 0.04;
        const z = -width / 4;

        return (
          <mesh key={`top-${i}`} position={[x, y, z]} castShadow>
            <cylinderGeometry
              args={[0.006, 0.006, length - 0.1, 16]}
              rotation-z={Math.PI / 2}
            />
            <meshPhongMaterial color="#f97316" shininess={20} />
          </mesh>
        );
      })}

      {/* Armadura Inferior - Barras */}
      {Array.from({ length: reinforcement.bottomRebars.quantity }).map(
        (_, i) => {
          const spacing =
            (length - 0.1) / (reinforcement.bottomRebars.quantity - 1 || 1);
          const x = -length / 2 + 0.05 + i * spacing;
          const y = -height / 2 + 0.04;
          const z = -width / 4;

          return (
            <mesh key={`bottom-${i}`} position={[x, y, z]} castShadow>
              <cylinderGeometry
                args={[0.006, 0.006, length - 0.1, 16]}
                rotation-z={Math.PI / 2}
              />
              <meshPhongMaterial color="#3b82f6" shininess={20} />
            </mesh>
          );
        }
      )}

      {/* Estribos - Simplificado */}
      {Array.from({
        length: Math.min(Math.ceil(results.stirrupQuantity), 15),
      }).map((_, i) => {
        const spacing = length / Math.min(Math.ceil(results.stirrupQuantity), 15);
        const x = -length / 2 + spacing * (i + 0.5);

        return (
          <group key={`stirrup-${i}`} position={[x, 0, 0]}>
            {/* Lado superior */}
            <mesh castShadow>
              <boxGeometry args={[0.01, 0.01, width - 0.08]} />
              <meshPhongMaterial color="#f97316" shininess={15} />
            </mesh>
            {/* Lado inferior */}
            <mesh position={[0, -height + 0.08, 0]} castShadow>
              <boxGeometry args={[0.01, 0.01, width - 0.08]} />
              <meshPhongMaterial color="#f97316" shininess={15} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function Visualization3D({
  dimensions,
  reinforcement,
  results,
}: Visualization3DProps) {
  return (
    <Canvas
      camera={{
        position: [10, 6, 10],
        fov: 50,
        near: 0.1,
        far: 1000,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Iluminação */}
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight
        position={[15, 15, 10]}
        intensity={0.8}
        castShadow
        color="#ffffff"
      />
      <directionalLight
        position={[-10, 10, -10]}
        intensity={0.3}
        color="#3b82f6"
      />
      <pointLight position={[0, 5, 0]} intensity={0.4} color="#f97316" />

      {/* Grid */}
      <Grid
        args={[20, 20]}
        cellSize={1}
        cellColor="#475569"
        sectionSize={5}
        sectionColor="#1e293b"
        fadeDistance={30}
        fadeStrength={0.5}
        infiniteGrid
      />

      {/* Modelo da viga */}
      <BeamModel
        dimensions={dimensions}
        reinforcement={reinforcement}
        results={results}
      />

      {/* Controles */}
      <OrbitControls
        enableZoom
        enablePan
        minDistance={5}
        maxDistance={30}
      />

      {/* Background */}
      <color attach="background" args={["#0f172a"]} />
    </Canvas>
  );
}
