const NoResults = () => {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <p
                className="text-xs font-medium uppercase tracking-[0.3em] text-[#1A1A1A]/30"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                Nu s-au găsit rezultate
            </p>
            <p className="mt-3 text-sm text-[#1A1A1A]/40">
                Încercați să modificați filtrele.
            </p>
        </div>
    );
}

export default NoResults;
