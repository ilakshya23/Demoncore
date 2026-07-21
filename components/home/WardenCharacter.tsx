'use client';

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

useGLTF.preload('/models/warden/warden.gltf');

function Model() {
  const outer = useRef<THREE.Group>(null!);
  const inner = useRef<THREE.Group>(null!);
  const pointer = useRef({ x: 0, y: 0 });
  const { scene } = useGLTF('/models/warden/warden.gltf') as any;
  const cloned = useMemo(() => scene.clone(), [scene]);

  useLayoutEffect(() => {
    const box = new THREE.Box3().setFromObject(cloned);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    const scale = 2.1 / maxDim;
    inner.current.scale.setScalar(scale);
    inner.current.rotation.y = Math.PI;
    inner.current.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
  }, [cloned]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  useFrame((state) => {
    const g = outer.current;
    if (!g) return;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, pointer.current.x * 0.6, 0.06);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -pointer.current.y * 0.2, 0.06);
    g.position.y = Math.sin(state.clock.elapsedTime * 1.2) * 0.06;
  });

  return (
    <group ref={outer}>
      <group ref={inner}>
        <primitive object={cloned} />
      </group>
    </group>
  );
}

export function WardenCharacter({ className = '' }: { className?: string }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0.2, 4.2], fov: 35 }}
      gl={{ alpha: true, antialias: true }}
      className={className}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 5]} intensity={1.6} />
      <directionalLight position={[-3, -1, -4]} intensity={0.6} color="#FF5A2E" />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </Canvas>
  );
}
