#!/bin/bash
BASE="/Users/Apple/Desktop/prym site/prym/src"

cat > "$BASE/components/booking/VehicleScene.jsx" << 'EOF'
import { Suspense, useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei'
import * as THREE from 'three'

function VehicleModel({ path }) {
  const { scene } = useGLTF(path)
  const ref = useRef()
  const clone = scene.clone(true)

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.12
  })

  useEffect(() => {
    if (!ref.current) return
    const box = new THREE.Box3().setFromObject(ref.current)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const scale = 3.5 / Math.max(size.x, size.y, size.z)
    ref.current.scale.setScalar(scale)
    ref.current.position.x = -center.x * scale
    ref.current.position.y = -box.min.y * scale
    ref.current.position.z = -center.z * scale
  }, [path])

  return <group ref={ref}><primitive object={clone} /></group>
}

function Placeholder() {
  const ref = useRef()
  useFrame((_, d) => { if (ref.current) ref.current.rotation.y += d * 0.25 })
  return (
    <group ref={ref}>
      <mesh><boxGeometry args={[3.2, 0.9, 1.5]} /><meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.2} /></mesh>
      <mesh position={[0, 0.75, 0]}><boxGeometry args={[2, 0.7, 1.45]} /><meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.2} /></mesh>
      {[-1.1, 1.1].flatMap(x => [-0.65, 0.65].map(z => (
        <mesh key={`${x}${z}`} position={[x, -0.35, z]}>
          <cylinderGeometry args={[0.28, 0.28, 0.22, 24]} />
          <meshStandardMaterial color="#111" metalness={0.5} roughness={0.6} />
        </mesh>
      )))}
    </group>
  )
}

function Loader() {
  return (
    <Html center>
      <div style={{ color: 'rgba(200,200,204,0.4)', fontFamily: 'monospace', fontSize: '10px', letterSpacing: '0.2em' }}>
        CHARGEMENT
      </div>
    </Html>
  )
}

function SceneInner({ modelPath, isMobile }) {
  const { camera } = useThree()

  useEffect(() => {
    if (isMobile) {
      // Mobile: caméra plus proche et plus haute pour bien cadrer
      camera.position.set(3.5, 1.8, 4.5)
    } else {
      // Desktop
      camera.position.set(5, 2.5, 6)
    }
    camera.lookAt(0, 0.8, 0)
  }, [isMobile])

  return (
    <>
      <directionalLight position={[6, 8, -4]} intensity={2.5} color="#fff5e8" castShadow />
      <directionalLight position={[-8, 4, 2]} intensity={0.8} color="#e8f0ff" />
      <directionalLight position={[-1, 5, 6]} intensity={1.8} color="#c8d8ff" />
      <ambientLight intensity={0.15} />
      <ContactShadows position={[0, -0.01, 0]} opacity={0.6} scale={18} blur={2.5} far={8} color="#000" />
      <Environment preset="studio" />
      <Suspense fallback={modelPath ? <Loader /> : <Placeholder />}>
        {modelPath ? <VehicleModel path={modelPath} /> : <Placeholder />}
      </Suspense>
      <OrbitControls
        enablePan={false}
        minDistance={isMobile ? 2 : 3}
        maxDistance={isMobile ? 7 : 12}
        minPolarAngle={Math.PI * 0.1}
        maxPolarAngle={Math.PI * 0.55}
        target={[0, 0.8, 0]}
        dampingFactor={0.05}
        enableDamping
      />
    </>
  )
}

export default function VehicleScene({ tier }) {
  const [key, setKey] = useState(0)
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768)

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  useEffect(() => { setKey(k => k + 1) }, [tier?.id])

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'radial-gradient(ellipse at center, transparent 50%, rgba(5,5,7,0.5) 100%)' }} />
      <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', zIndex: 2, pointerEvents: 'none', color: 'rgba(200,200,204,0.3)', fontFamily: 'monospace', fontSize: '8px', letterSpacing: '0.2em', whiteSpace: 'nowrap' }}>
        GLISSER · ORBITER · ZOOMER
      </div>
      <Canvas
        key={key}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        style={{ background: 'transparent' }}
        camera={{ fov: isMobile ? 55 : 45, near: 0.1, far: 100 }}
      >
        <Suspense fallback={<Loader />}>
          <SceneInner modelPath={tier?.modelPath || null} isMobile={isMobile} />
        </Suspense>
      </Canvas>
    </div>
  )
}

import { FLEET } from '../../data/fleet'
FLEET.forEach(t => { if (t.modelPath) useGLTF.preload(t.modelPath) })
EOF

echo "✅ Zoom mobile corrigé"
