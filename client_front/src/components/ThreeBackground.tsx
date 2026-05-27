'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as random from 'maath/random/dist/maath-random.esm';
import * as THREE from 'three';

function GalaxyStars() {
  const ref = useRef<THREE.Points>(null!);
  const { mouse, viewport } = useThree();

  const count = 3000;
  
  // Generate random points in a sphere and unique attributes
  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    random.inSphere(pos, { radius: 8 });
    
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    
    const colorCyan = new THREE.Color('#00E5FF');
    const colorPurple = new THREE.Color('#A78BFA');
    const colorWhite = new THREE.Color('#FFFFFF');
    const colorMixed = new THREE.Color();

    for (let i = 0; i < count; i++) {
      const r = Math.random();
      // 10% Cyan, 10% Purple, 80% White/Light Blue
      if (r > 0.9) {
        colorMixed.copy(colorCyan);
      } else if (r > 0.8) {
        colorMixed.copy(colorPurple);
      } else {
        colorMixed.copy(colorWhite);
        // Add a tiny tint of blue to the white stars
        colorMixed.lerp(colorCyan, Math.random() * 0.3);
      }
      
      // Add brightness variance
      colorMixed.multiplyScalar(0.5 + Math.random() * 0.5);

      col[i * 3] = colorMixed.r;
      col[i * 3 + 1] = colorMixed.g;
      col[i * 3 + 2] = colorMixed.b;

      // Make some stars distinctly larger
      const sizeRandom = Math.random();
      if (sizeRandom > 0.98) sz[i] = 0.2; // very large (rare)
      else if (sizeRandom > 0.8) sz[i] = 0.1; // medium
      else sz[i] = 0.04; // tiny stars
    }
    return { positions: pos, colors: col, sizes: sz };
  }, []);

  const originalPositions = useMemo(() => new Float32Array(positions), [positions]);

  // Custom Shader to render glowing circular stars with distinct sizes
  const shaderArgs = useMemo(() => ({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      void main() {
        vColor = color;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        // Scale size by depth so they get smaller further away
        gl_PointSize = size * (200.0 / -mvPosition.z);
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      void main() {
        // Create a soft circle
        vec2 xy = gl_PointCoord.xy - vec2(0.5);
        float dist = length(xy);
        if (dist > 0.5) discard;
        
        // Soft glowing edge
        float alpha = (0.5 - dist) * 2.0; 
        // Core is brighter
        float core = pow(alpha, 3.0);
        
        gl_FragColor = vec4(vColor + vec3(core), alpha * 0.8);
      }
    `
  }), []);

  useFrame((state) => {
    if (!ref.current) return;
    
    const time = state.clock.getElapsedTime();
    const pos = ref.current.geometry.attributes.position.array as Float32Array;

    // Mouse coordinates mapped to 3D space
    const mouseX = (mouse.x * viewport.width) / 2;
    const mouseY = (mouse.y * viewport.height) / 2;

    for (let i = 0; i < count; i++) {
      const idx = i * 3;
      const origX = originalPositions[idx];
      const origY = originalPositions[idx + 1];
      const origZ = originalPositions[idx + 2];
      
      // Floating space dust motion
      const floatX = Math.sin(time * 0.3 + origY) * 0.05;
      const floatY = Math.cos(time * 0.2 + origX) * 0.05;
      
      let targetX = origX + floatX;
      let targetY = origY + floatY;
      let targetZ = origZ;

      // Mouse attraction: stars follow the mouse!
      // Only affect stars that are somewhat in the foreground
      if (origZ > -3) {
        const dx = mouseX - targetX;
        const dy = mouseY - targetY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        const attractRadius = 4.0;
        if (dist < attractRadius) {
          // Exponential pull towards the mouse
          const pull = Math.pow(1 - dist / attractRadius, 2.0) * 1.2; 
          targetX += dx * pull;
          targetY += dy * pull;
          targetZ += pull * 2.0; // pop out towards the camera slightly
        }
      }

      // Smooth spring interpolation
      pos[idx] += (targetX - pos[idx]) * 0.05;
      pos[idx + 1] += (targetY - pos[idx + 1]) * 0.05;
      pos[idx + 2] += (targetZ - pos[idx + 2]) * 0.05;
    }
    
    // Slowly rotate the entire galaxy
    ref.current.rotation.y = time * 0.03;
    ref.current.rotation.x = Math.sin(time * 0.1) * 0.1;
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <group>
      <points ref={ref} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
          <bufferAttribute
            attach="attributes-size"
            args={[sizes, 1]}
          />
        </bufferGeometry>
        <shaderMaterial
          args={[shaderArgs]}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function ThreeBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-auto overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        style={{ width: '100%', height: '100%' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <fog attach="fog" args={['#0A0E14', 5, 15]} />
        <GalaxyStars />
      </Canvas>
    </div>
  );
}
