"use client";

import { cn } from '@/lib/utils';
import { Color, Size } from '@/types';
import qs from 'query-string'
import { useRouter, useSearchParams } from 'next/navigation';

interface FilterProps {
    data: (Size | Color) [];
    name: string;
    valueKey: string;
}

const Filter: React.FC<FilterProps> = ({ data, name, valueKey }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const selectedValue = searchParams.get(valueKey);

    const onClick = (id: string) => {
        const current = qs.parse(searchParams.toString());
        const query = { ...current, [valueKey]: id }

        if(current[valueKey] === id) {
            query[valueKey] = null;
        }

        const url = qs.stringifyUrl({
            url: window.location.href,
            query
        }, { skipNull: true })

        router.push(url);
    }

    const isColorFilter = valueKey === "colorId";

    return (
        <div>
            <p
                className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[var(--th-text-tertiary)]"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                {name}
            </p>
            <div className="flex flex-wrap gap-2">
                {data.map(filter => (
                    <button
                        key={filter.id}
                        onClick={() => onClick(filter.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 text-sm transition-all duration-200",
                            selectedValue === filter.id
                                ? "bg-[var(--th-btn-inverse-bg)] text-[var(--th-btn-inverse-text)]"
                                : "border border-[var(--th-border-strong)] text-[var(--th-text-tertiary)] hover:border-[var(--th-text-muted)] hover:text-[rgb(var(--th-text))]"
                        )}
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        {isColorFilter && (
                            <span
                                className={cn(
                                    "h-3.5 w-3.5 rounded-full border",
                                    selectedValue === filter.id
                                        ? "border-[var(--th-btn-inverse-text)]/20"
                                        : "border-[var(--th-text-muted)]"
                                )}
                                style={{ backgroundColor: (filter as Color).value }}
                            />
                        )}
                        {filter.name}
                    </button>
                ))}
            </div>
        </div>
    )
}

export default Filter;
