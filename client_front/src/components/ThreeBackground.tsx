'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';
import * as THREE from 'three';

function ParticleField() {
  const ref = useRef<THREE.Points>(null!);
  const { mouse } = useThree();

  // Generate 2000 points in a sphere
  const sphere = useMemo(() => {
    const data = new Float32Array(2000 * 3);
    random.inSphere(data, { radius: 1.5 });
    return data;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      // Rotate the entire particle field slowly
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
      
      // Interactive mouse effect: slight tilt/rotation based on mouse position
      const targetRotationX = (mouse.y * Math.PI) / 6;
      const targetRotationY = (mouse.x * Math.PI) / 6;
      
      ref.current.rotation.x += (targetRotationX - ref.current.rotation.x) * 0.05;
      ref.current.rotation.y += (targetRotationY - ref.current.rotation.y) * 0.05;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00E5FF"
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 1] }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
      </Canvas>
    </div>
  );
}
