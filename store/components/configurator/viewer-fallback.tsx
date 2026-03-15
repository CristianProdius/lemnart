"use client"

const ViewerFallback = () => {
    return (
        <div className="flex h-full w-full items-center justify-center bg-[var(--th-bg-secondary)]">
            <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--th-border-strong)] border-t-[var(--color-accent-light)]" />
                <p
                    className="text-xs uppercase tracking-[0.2em] text-[var(--th-text-tertiary)]"
                    style={{ fontFamily: "var(--font-barlow)" }}
                >
                    Se încarcă modelul 3D...
                </p>
            </div>
        </div>
    )
}

export default ViewerFallback
