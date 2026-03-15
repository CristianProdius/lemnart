"use client"

import { useEffect, useRef } from "react"
import { useGLTF } from "@react-three/drei"
import * as THREE from "three"

interface RadiatorModelProps {
    modelUrl: string
    colorHex: string
    width: number
    height: number
    depth: number
}

const REF_WIDTH = 80
const REF_HEIGHT = 60
const REF_DEPTH = 15

const RadiatorModel: React.FC<RadiatorModelProps> = (props) => {
    if (!props.modelUrl) return null
    return <RadiatorModelInner {...props} />
}

const RadiatorModelInner: React.FC<RadiatorModelProps> = ({
    modelUrl,
    colorHex,
    width,
    height,
    depth,
}) => {
    const { scene } = useGLTF(modelUrl)
    const groupRef = useRef<THREE.Group>(null!)

    useEffect(() => {
        if (!groupRef.current) return

        const cloned = scene.clone(true)
        const color = new THREE.Color(colorHex)

        cloned.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry = child.geometry.clone()
                child.material = new THREE.MeshStandardMaterial({
                    color,
                    roughness: 0.6,
                    metalness: 0.1,
                })
            }
        })

        groupRef.current.add(cloned)

        return () => {
            groupRef.current?.remove(cloned)
            cloned.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry.dispose()
                    ;(child.material as THREE.Material).dispose()
                }
            })
        }
    }, [scene, colorHex])

    const sx = width / REF_WIDTH
    const sy = height / REF_HEIGHT
    const sz = depth / REF_DEPTH

    return <group ref={groupRef} scale={[sx, sy, sz]} />
}

export default RadiatorModel
