const NoResults = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <p
                className="text-xs font-medium uppercase tracking-[0.3em] text-[var(--th-text-muted)]"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                Nu s-au găsit rezultate
            </p>
            <p className="mt-3 text-sm text-[var(--th-text-tertiary)]">
                Încercați să modificați filtrele.
            </p>
        </div>
    );
}

export default NoResults;
