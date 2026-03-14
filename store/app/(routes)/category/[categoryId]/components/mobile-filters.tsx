"use client";

import { useState } from "react";
import { Color, Size } from '@/types'
import { X, SlidersHorizontal } from "lucide-react";
import { Dialog } from "@headlessui/react";
import Filter from "./filter";

interface MobileFiltersProps {
    sizes: Size[];
    colors: Color[];
}

const MobileFilters: React.FC<MobileFiltersProps> = ({ sizes, colors }) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex items-center gap-2 text-sm font-medium text-white/60 transition hover:text-white lg:hidden"
                style={{ fontFamily: "var(--font-barlow)" }}
            >
                <SlidersHorizontal size={16} />
                Filtre
            </button>
            <Dialog
                open={open}
                as="div"
                className="relative z-40 lg:hidden"
                onClose={() => setOpen(false)}
            >
                {/* Backdrop */}
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

                {/* Panel */}
                <div className="fixed inset-0 z-40 flex justify-end">
                    <Dialog.Panel className="relative flex w-full max-w-sm flex-col overflow-y-auto bg-[#1A1A1A] shadow-2xl">
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                            <p
                                className="text-xs font-medium uppercase tracking-[0.3em] text-white/40"
                                style={{ fontFamily: "var(--font-barlow)" }}
                            >
                                Filtre
                            </p>
                            <button
                                onClick={() => setOpen(false)}
                                className="flex h-8 w-8 items-center justify-center text-white/40 transition hover:text-white"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Filters */}
                        <div className="space-y-8 px-6 py-8">
                            <Filter valueKey="sizeId" name="Dimensiune" data={sizes} />
                            <Filter valueKey="colorId" name="Culoare" data={colors} />
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </>
    );
}

export default MobileFilters;
