import { Suspense, useRef, useEffect, useState, useCallback, Component } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, OrbitControls, Environment, ContactShadows, Html } from '@react-three/drei'
import * as THREE from 'three'

// Catches useGLTF errors (e.g. 404 in production) so a missing GLB never
// crashes the whole page. key=modelPath resets the boundary on tier switch.
class ModelErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false } }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) return this.props.fallback ?? null
    return this.props.children
  }
}

function VehicleModel({ path }) {
  const { scene } = useGLTF(path)
  const ref = useRef()
  const clone = scene.clone(true)

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.10
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
      <mesh><boxGeometry args={[3.2, 0.9, 1.5]} /><meshStandardMaterial color="#3c3c3b" metalness={0.7} roughness={0.3} /></mesh>
      <mesh position={[0, 0.75, 0]}><boxGeometry args={[2, 0.7, 1.45]} /><meshStandardMaterial color="#3c3c3b" metalness={0.7} roughness={0.3} /></mesh>
      {[-1.1, 1.1].flatMap(x => [-0.65, 0.65].map(z => (
        <mesh key={`${x}${z}`} position={[x, -0.35, z]}>
          <cylinderGeometry args={[0.28, 0.28, 0.22, 24]} />
          <meshStandardMaterial color="#6B6867" metalness={0.5} roughness={0.6} />
        </mesh>
      )))}
    </group>
  )
}

function Loader() {
  return (
    <Html center>
      <div style={{ color: 'var(--c-loader)', fontFamily: '"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif', fontSize: '10px', letterSpacing: '0.2em' }}>
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
      <ambientLight intensity={1.4} />
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
  // Pause WebGL rendering when canvas is scrolled out of view — saves GPU on
  // mobile and mid-page booking flows where the canvas is off-screen.
  const [inView, setInView] = useState(true)
  const containerRef = useRef()

  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  useEffect(() => { setKey(k => k + 1) }, [tier?.id])

  const observerCb = useCallback(([entry]) => {
    setInView(entry.isIntersecting)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const obs = new IntersectionObserver(observerCb, { threshold: 0 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [observerCb])

  const modelPath = tier?.modelPath || null

  const errorFallback = (
    <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span style={{ fontFamily:'"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif', fontSize:8, letterSpacing:'0.3em', textTransform:'uppercase', color:'var(--c-silver3)' }}>
        Modèle en cours de préparation
      </span>
    </div>
  )

  return (
    // key=modelPath resets the boundary whenever the active model changes,
    // so a previously errored tier does not stay stuck in fallback state.
    <ModelErrorBoundary key={modelPath} fallback={errorFallback}>
      <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', background: 'var(--c-vig-radial)' }} />
        <Suspense fallback={
          <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ color:'var(--c-loader)', fontFamily:'"Eurostile","Russo One","Helvetica Neue",Arial,sans-serif', fontSize:'10px', letterSpacing:'0.2em', textTransform:'uppercase' }}>CHARGEMENT</span>
          </div>
        }>
          <Canvas
            key={key}
            shadows
            frameloop={inView ? 'always' : 'demand'}
            dpr={isMobile ? [1, 1.5] : [1, 2]}
            gl={{ antialias: true, alpha: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
            style={{ background: 'transparent' }}
            camera={{ fov: isMobile ? 55 : 45, near: 0.1, far: 100 }}
          >
            <SceneInner modelPath={modelPath} isMobile={isMobile} />
          </Canvas>
        </Suspense>
      </div>
    </ModelErrorBoundary>
  )
}

import { FLEET } from '../../data/fleet'

// Point drei's GLTFLoader at the Draco decoder so Draco-compressed GLBs
// are decoded automatically. CDN decoder avoids bundling ~1 MB of wasm.
useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')

// Preload all fleet models so they're in cache before the user reaches step 3.
FLEET.forEach(t => {
  if (t.modelPath) useGLTF.preload(t.modelPath)
  t.models?.forEach(m => { if (m.modelPath) useGLTF.preload(m.modelPath) })
})
