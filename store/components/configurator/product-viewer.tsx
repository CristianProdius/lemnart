"use client"

import { Suspense, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import RadiatorModel from "./radiator-model"
import ViewerFallback from "./viewer-fallback"
import Image from "next/image"

interface ProductViewerProps {
    modelUrl: string
    defaultModelUrl?: string
    previewUrl: string
    colorHex: string
    width: number
    height: number
    depth: number
}

const ProductViewer: React.FC<ProductViewerProps> = ({
    modelUrl,
    defaultModelUrl,
    previewUrl,
    colorHex,
    width,
    height,
    depth,
}) => {
    const [showCanvas, setShowCanvas] = useState(false)
    const resolvedModelUrl = modelUrl || defaultModelUrl || ""
    const hasModel = !!resolvedModelUrl
    const containerRef = useRef<HTMLDivElement>(null)

    if (!hasModel && !previewUrl) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-[var(--th-bg-secondary)]">
                <p
                    className="text-xs uppercase tracking-[0.2em] text-[var(--th-text-tertiary)]"
                    style={{ fontFamily: "var(--font-barlow)" }}
                >
                    Selectează un stil
                </p>
            </div>
        )
    }

    if (!hasModel && previewUrl) {
        return (
            <div className="relative h-full w-full">
                <Image src={previewUrl} alt="Previzualizare produs" fill className="object-contain" />
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className="h-full w-full"
            style={{ touchAction: "none" }}
        >
            {/* Mobile: show static + button, Desktop: show 3D directly */}
            <div className="block h-full w-full md:hidden">
                {!showCanvas ? (
                    <div className="relative flex h-full w-full items-center justify-center bg-[var(--th-bg-secondary)]">
                        {previewUrl && (
                            <Image src={previewUrl} alt="Previzualizare" fill className="object-contain" />
                        )}
                        <button
                            onClick={() => setShowCanvas(true)}
                            className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 border border-[var(--th-border-strong)] bg-[var(--th-bg)]/90 px-5 py-2.5 text-xs font-medium uppercase tracking-[0.2em] text-[var(--th-text-tertiary)] backdrop-blur-sm transition hover:border-[var(--color-accent-light)] hover:text-[var(--color-accent-light)]"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            Vezi în 3D
                        </button>
                    </div>
                ) : (
                    <div className="fixed inset-0 z-50 bg-[var(--th-bg)]" style={{ touchAction: "none" }}>
                        <button
                            onClick={() => setShowCanvas(false)}
                            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center text-[var(--th-text-muted)] transition hover:text-[rgb(var(--th-text))]"
                        >
                            ✕
                        </button>
                        <ThreeCanvas
                            modelUrl={resolvedModelUrl}
                            colorHex={colorHex}
                            width={width}
                            height={height}
                            depth={depth}
                        />
                    </div>
                )}
            </div>

            {/* Desktop */}
            <div className="hidden h-full w-full md:block">
                <ThreeCanvas
                    modelUrl={resolvedModelUrl}
                    colorHex={colorHex}
                    width={width}
                    height={height}
                    depth={depth}
                />
            </div>
        </div>
    )
}

interface ThreeCanvasProps {
    modelUrl: string
    colorHex: string
    width: number
    height: number
    depth: number
}

function ThreeCanvas({ modelUrl, colorHex, width, height, depth }: ThreeCanvasProps) {
    return (
        <Canvas
            camera={{ position: [0, 0.5, 3], fov: 45 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            style={{ touchAction: "none", cursor: "grab" }}
            fallback={<ViewerFallback />}
        >
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} color="#FFF8E7" />
            <pointLight position={[-3, 2, 2]} intensity={0.6} color="#C8A55C" />
            <Environment preset="studio" />
            <Suspense fallback={null}>
                <RadiatorModel
                    modelUrl={modelUrl}
                    colorHex={colorHex}
                    width={width}
                    height={height}
                    depth={depth}
                />
            </Suspense>
            <OrbitControls
                enablePan={false}
                enableZoom={true}
                enableRotate={true}
                autoRotate={true}
                autoRotateSpeed={0.5}
                minPolarAngle={Math.PI / 6}
                maxPolarAngle={Math.PI / 1.5}
                minDistance={1.5}
                maxDistance={6}
            />
        </Canvas>
    )
}

export default ProductViewer
