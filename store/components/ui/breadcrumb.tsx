import Link from "next/link"

interface BreadcrumbItem {
    label: string
    href?: string
}

interface BreadcrumbProps {
    items: BreadcrumbItem[]
    className?: string
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
    return (
        <nav aria-label="Breadcrumb" className={className}>
            <ol
                className="flex flex-wrap items-center gap-0 text-xs font-medium uppercase tracking-[0.3em]"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                {items.map((item, index) => (
                    <li key={index} className="flex items-center">
                        {index > 0 && (
                            <span
                                className="mx-2 text-[var(--th-text-muted)]"
                                aria-hidden="true"
                            >
                                /
                            </span>
                        )}
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="text-[var(--color-accent-light)] transition-colors hover:text-[rgb(var(--th-text))]"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-[var(--th-text-tertiary)]">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    )
}

export default Breadcrumb
