"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { RoundedBox } from "@react-three/drei"
import * as THREE from "three"

interface PanelProps {
  position: [number, number, number]
  rotation: [number, number, number]
  size: [number, number, number]
  floatSpeed: number
  floatAmplitude: number
  mouse: React.RefObject<{ x: number; y: number }>
}

const Panel: React.FC<PanelProps> = ({
  position,
  rotation,
  size,
  floatSpeed,
  floatAmplitude,
  mouse,
}) => {
  const meshRef = useRef<THREE.Mesh>(null)
  const initialY = position[1]
  const initialRotation = useMemo(() => [...rotation] as [number, number, number], [rotation])

  useFrame((state) => {
    if (!meshRef.current) return
    const t = state.clock.elapsedTime

    // Gentle floating
    meshRef.current.position.y = initialY + Math.sin(t * floatSpeed) * floatAmplitude

    // Mouse follow — subtle tilt
    const mouseX = mouse.current?.x ?? 0
    const mouseY = mouse.current?.y ?? 0
    meshRef.current.rotation.x = initialRotation[0] + mouseY * 0.1
    meshRef.current.rotation.y = initialRotation[1] + mouseX * 0.15
  })

  return (
    <RoundedBox
      ref={meshRef}
      args={size}
      radius={0.05}
      smoothness={4}
      position={position}
      rotation={rotation}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color="#C8A55C"
        metalness={0.8}
        roughness={0.2}
        envMapIntensity={1.2}
      />
    </RoundedBox>
  )
}

interface FloatingPanelsProps {
  mouse: React.RefObject<{ x: number; y: number }>
}

const FloatingPanels: React.FC<FloatingPanelsProps> = ({ mouse }) => {
  return (
    <group>
      {/* Large panel — left tilt */}
      <Panel
        position={[-1.5, 0.2, 0]}
        rotation={[0.1, 0.3, -0.05]}
        size={[1.8, 2.4, 0.08]}
        floatSpeed={0.6}
        floatAmplitude={0.15}
        mouse={mouse}
      />
      {/* Medium panel — center */}
      <Panel
        position={[0.3, -0.1, 0.5]}
        rotation={[-0.05, -0.1, 0.03]}
        size={[1.4, 1.8, 0.08]}
        floatSpeed={0.8}
        floatAmplitude={0.12}
        mouse={mouse}
      />
      {/* Small panel — right tilt */}
      <Panel
        position={[1.8, 0.4, -0.3]}
        rotation={[0.08, -0.25, 0.06]}
        size={[1.0, 1.3, 0.08]}
        floatSpeed={1.0}
        floatAmplitude={0.1}
        mouse={mouse}
      />
    </group>
  )
}

export default FloatingPanels
