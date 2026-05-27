'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function EtherealWave() {
  const ref = useRef<THREE.Points>(null!);
  const { mouse, viewport } = useThree();

  const count = 150;
  const separation = 0.2;
  const totalParticles = count * count;

  // Generate particles
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(totalParticles * 3);
    const col = new Float32Array(totalParticles * 3);
    
    const colorCyan = new THREE.Color('#00E5FF');
    const colorPurple = new THREE.Color('#A78BFA');
    const colorMixed = new THREE.Color();

    let i = 0;
    for (let ix = 0; ix < count; ix++) {
      for (let iy = 0; iy < count; iy++) {
        // Create a wider, deeper grid
        const x = (ix - count / 2) * separation + (Math.random() - 0.5) * 0.1;
        const z = (iy - count / 2) * separation + (Math.random() - 0.5) * 0.1;
        const y = (Math.random() - 0.5) * 0.2; // slight random vertical variance

        pos[i * 3] = x;
        pos[i * 3 + 1] = y;
        pos[i * 3 + 2] = z;

        colorMixed.lerpColors(colorPurple, colorCyan, Math.random());
        col[i * 3] = colorMixed.r;
        col[i * 3 + 1] = colorMixed.g;
        col[i * 3 + 2] = colorMixed.b;

        i++;
      }
    }
    return { positions: pos, colors: col };
  }, [count, separation, totalParticles]);

  const originalPositions = useMemo(() => new Float32Array(positions), [positions]);

  useFrame((state) => {
    if (!ref.current) return;
    const time = state.clock.getElapsedTime();
    const pos = ref.current.geometry.attributes.position.array as Float32Array;

    // Mouse mapping
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;

    let i = 0;
    for (let ix = 0; ix < count; ix++) {
      for (let iy = 0; iy < count; iy++) {
        const idx = i * 3;
        const origX = originalPositions[idx];
        const origZ = originalPositions[idx + 2];
        
        // Complex beautiful wave math
        const waveX = Math.sin(origX * 0.5 + time * 0.5) * 0.5;
        const waveZ = Math.cos(origZ * 0.5 + time * 0.4) * 0.5;
        const waveCombined = Math.sin((origX + origZ) * 0.2 + time) * 1.5;
        
        let targetY = originalPositions[idx + 1] + waveX + waveZ + waveCombined;

        // Interactive mouse repulsion
        const dx = origX - mouseX * 2;
        const dz = origZ - (-mouseY * 4); // Scale up depth interaction
        const dist = Math.sqrt(dx * dx + dz * dz);
        
        if (dist < 4.0) {
          const repel = Math.cos((dist / 4.0) * Math.PI / 2);
          targetY += repel * 3.0; // Pushes particles UP when hovered
        }

        // Smooth transition
        pos[idx + 1] += (targetY - pos[idx + 1]) * 0.1;

        i++;
      }
    }
    
    // Rotate the entire field slowly for an epic cinematic feel
    ref.current.rotation.y = time * 0.05;
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group rotation={[0.2, 0, 0]} position={[0, -2, -10]}>
      <Points ref={ref} positions={positions} colors={colors} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          vertexColors
          size={0.03}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto overflow-hidden">
      <Canvas
        camera={{ position: [0, 3, 5], fov: 75 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#0A0E14', 5, 20]} />
        <EtherealWave />
      </Canvas>
    </div>
  );
}
