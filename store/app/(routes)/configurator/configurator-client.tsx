"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ConfiguratorOptions } from "@/types"
import useConfigurator from "@/hooks/use-configurator"
import ProductViewer from "@/components/configurator/product-viewer"
import ConfiguratorPanel from "@/components/configurator/configurator-panel"

interface ConfiguratorClientProps {
    options: ConfiguratorOptions
}

const ConfiguratorClient: React.FC<ConfiguratorClientProps> = ({ options }) => {
    const searchParams = useSearchParams()
    const { styleId, colorId, width, height, depth, setStyleId, setColorId } =
        useConfigurator()

    // Pre-fill from URL params (linked from product pages)
    useEffect(() => {
        const urlStyle = searchParams.get("style")
        const urlColor = searchParams.get("color")

        if (urlStyle && !styleId) {
            // Try to match by category ID or slug
            const matchedStyle = options.styles.find(
                (s) => s.id === urlStyle || s.slug === urlStyle
            )
            if (matchedStyle) setStyleId(matchedStyle.id)
        }
        if (urlColor && !colorId) {
            const matchedColor = options.colors.find(
                (c) => c.id === urlColor
            )
            if (matchedColor) setColorId(matchedColor.id)
        }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const selectedStyle = options.styles.find((s) => s.id === styleId)
    const selectedColor = options.colors.find((c) => c.id === colorId)

    // Fallback: use the first style's model if no style is selected yet
    const defaultStyle = options.styles[0]
    const defaultModelUrl = defaultStyle?.modelUrl ?? ""

    return (
        <div className="bg-[var(--th-surface)]">
            <div className="mx-auto max-w-7xl px-6 py-12 md:py-20">
                <h1
                    className="mb-2 text-4xl text-[rgb(var(--th-text))] md:text-5xl"
                    style={{
                        fontFamily: "var(--font-instrument-serif)",
                        fontStyle: "italic",
                    }}
                >
                    Configurator
                </h1>
                <p
                    className="mb-10 text-sm text-[var(--th-text-tertiary)]"
                    style={{ fontFamily: "var(--font-barlow)" }}
                >
                    Personalizează mascarea caloriferului în câțiva pași simpli
                </p>

                <div className="flex flex-col gap-8 lg:flex-row">
                    {/* 3D Viewer */}
                    <div className="relative h-[350px] w-full border border-[var(--th-border)] bg-[var(--th-bg-secondary)] md:h-[500px] lg:h-[600px] lg:w-[55%]">
                        <ProductViewer
                            modelUrl={selectedStyle?.modelUrl ?? ""}
                            defaultModelUrl={defaultModelUrl}
                            previewUrl={selectedStyle?.previewUrl ?? ""}
                            colorHex={selectedColor?.value ?? "#C4A882"}
                            width={width}
                            height={height}
                            depth={depth}
                        />
                    </div>

                    {/* Configurator Panel */}
                    <div className="w-full lg:w-[45%]">
                        <ConfiguratorPanel options={options} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ConfiguratorClient
