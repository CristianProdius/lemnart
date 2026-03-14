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
                className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-white/40"
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
                                ? "bg-white text-[#1A1A1A]"
                                : "border border-white/15 text-white/60 hover:border-white/30 hover:text-white"
                        )}
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        {isColorFilter && (
                            <span
                                className={cn(
                                    "h-3.5 w-3.5 rounded-full border",
                                    selectedValue === filter.id
                                        ? "border-[#1A1A1A]/20"
                                        : "border-white/20"
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
