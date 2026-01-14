import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Fabric() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[10, 10, 80, 80]} />
      <meshStandardMaterial 
        color="#b8a07e" 
        wireframe={false} 
        roughness={0.7} 
        metalness={0.3}
      />
    </mesh>
  );
}

export default function FabricBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 7], fov: 60 }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[0, 5, 5]} intensity={0.7} />
        <Fabric />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} />
      </Canvas>
    </div>
  );
}
