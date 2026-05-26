'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

function ParticleWave() {
  const meshRef = useRef<THREE.InstancedMesh>(null!);
  const { mouse, viewport } = useThree();
  
  // Grid settings
  const count = 100; // 100x100 = 10,000 particles
  const separation = 0.15;
  const totalParticles = count * count;

  // Pre-calculate positions, colors, and scales
  const { positions, colors, scales } = useMemo(() => {
    const positions = new Float32Array(totalParticles * 3);
    const colors = new Float32Array(totalParticles * 3);
    const scales = new Float32Array(totalParticles);
    
    const colorCyan = new THREE.Color('#00E5FF');
    const colorPurple = new THREE.Color('#A78BFA');
    const colorMixed = new THREE.Color();

    let i = 0;
    for (let ix = 0; ix < count; ix++) {
      for (let iy = 0; iy < count; iy++) {
        // Center the grid
        const x = (ix - count / 2) * separation;
        const z = (iy - count / 2) * separation;
        const y = 0;

        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        // Base color (will update dynamically, but set initial here)
        colorMixed.lerpColors(colorCyan, colorPurple, 0.5);
        colors[i * 3] = colorMixed.r;
        colors[i * 3 + 1] = colorMixed.g;
        colors[i * 3 + 2] = colorMixed.b;

        scales[i] = 1;
        i++;
      }
    }
    return { positions, colors, scales };
  }, [count, separation, totalParticles]);

  // Create Matrix4 and Color objects for updates
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);
  const colorCyan = useMemo(() => new THREE.Color('#00E5FF'), []);
  const colorPurple = useMemo(() => new THREE.Color('#A78BFA'), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    const time = state.clock.getElapsedTime() * 0.5;
    
    // Map mouse coordinates to 3D space
    // Assuming camera is at z=5, we project mouse to z=0 plane
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;

    let i = 0;
    for (let ix = 0; ix < count; ix++) {
      for (let iy = 0; iy < count; iy++) {
        const x = (ix - count / 2) * separation;
        const z = (iy - count / 2) * separation;

        // Base wave function
        let y = Math.sin(ix * 0.2 + time) * 0.3 + Math.sin(iy * 0.2 + time) * 0.3;

        // Mouse interaction (repel/ripple effect)
        const dx = x - mouseX;
        const dz = z - (-mouseY * 2); // Invert y and scale a bit for depth effect
        const dist = Math.sqrt(dx * dx + dz * dz);
        
        // Add a ripple if close to mouse
        const maxDist = 3.0;
        if (dist < maxDist) {
          const ripple = Math.cos(dist * Math.PI) * (1 - dist / maxDist) * 0.8;
          y += ripple;
        }

        // Apply transforms
        tempObject.position.set(x, y, z);
        
        // Scale based on height to emphasize peaks
        const scale = (y + 1) * 0.5;
        tempObject.scale.set(scale, scale, scale);
        
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObject.matrix);

        // Color based on height (peaks = Cyan, valleys = Purple)
        const mixRatio = Math.max(0, Math.min(1, (y + 0.6) / 1.2));
        tempColor.lerpColors(colorPurple, colorCyan, mixRatio);
        meshRef.current.setColorAt(i, tempColor);

        i++;
      }
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, totalParticles]}
      rotation={[-Math.PI / 3, 0, 0]}
      position={[0, -1, -5]}
    >
      <circleGeometry args={[0.025, 8]} />
      <meshBasicMaterial 
        transparent 
        opacity={0.6} 
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto overflow-hidden">
      <Canvas
        camera={{ position: [0, 2, 5], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={['#0A0E14', 3, 10]} />
        <ParticleWave />
      </Canvas>
    </div>
  );
}
