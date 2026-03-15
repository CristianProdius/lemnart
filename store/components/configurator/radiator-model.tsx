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
    const materialsRef = useRef<THREE.MeshStandardMaterial[]>([])

    // Effect 1 — Clone scene (only when the model changes)
    useEffect(() => {
        if (!groupRef.current) return

        const cloned = scene.clone(true)
        const mats: THREE.MeshStandardMaterial[] = []

        cloned.traverse((child) => {
            if (child instanceof THREE.Mesh) {
                child.geometry = child.geometry.clone()
                const mat = new THREE.MeshStandardMaterial({
                    color: new THREE.Color(colorHex),
                    roughness: 0.6,
                    metalness: 0.1,
                })
                child.material = mat
                mats.push(mat)
            }
        })

        materialsRef.current = mats
        groupRef.current.add(cloned)

        return () => {
            groupRef.current?.remove(cloned)
            cloned.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.geometry.dispose()
                    ;(child.material as THREE.Material).dispose()
                }
            })
            materialsRef.current = []
        }
    }, [scene])

    // Effect 2 — Apply color (no clone/dispose, just update material property)
    useEffect(() => {
        const color = new THREE.Color(colorHex)
        for (const mat of materialsRef.current) {
            mat.color.set(color)
        }
    }, [colorHex])

    const sx = width / REF_WIDTH
    const sy = height / REF_HEIGHT
    const sz = depth / REF_DEPTH

    return <group ref={groupRef} scale={[sx, sy, sz]} />
}

export default RadiatorModel
