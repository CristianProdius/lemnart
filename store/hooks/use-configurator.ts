import { create } from "zustand";

interface ConfiguratorState {
    currentStep: number;
    styleId: string;
    colorId: string;
    ventilationId: string;
    mountingId: string;
    accessoryIds: string[];
    width: number;
    height: number;
    depth: number;
    sections: number;

    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    setStyleId: (id: string) => void;
    setColorId: (id: string) => void;
    setVentilationId: (id: string) => void;
    setMountingId: (id: string) => void;
    toggleAccessory: (id: string) => void;
    setWidth: (w: number) => void;
    setHeight: (h: number) => void;
    setDepth: (d: number) => void;
    setSections: (n: number) => void;
    reset: () => void;
}

const TOTAL_STEPS = 8;

const initialState = {
    currentStep: 0,
    styleId: "",
    colorId: "",
    ventilationId: "",
    mountingId: "",
    accessoryIds: [] as string[],
    width: 80,
    height: 60,
    depth: 15,
    sections: 1,
};

const useConfigurator = create<ConfiguratorState>((set, get) => ({
    ...initialState,

    setStep: (step) => set({ currentStep: Math.max(0, Math.min(step, TOTAL_STEPS - 1)) }),
    nextStep: () => {
        const { currentStep } = get();
        if (currentStep < TOTAL_STEPS - 1) set({ currentStep: currentStep + 1 });
    },
    prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 0) set({ currentStep: currentStep - 1 });
    },

    setStyleId: (id) => set({ styleId: id }),
    setColorId: (id) => set({ colorId: id }),
    setVentilationId: (id) => set({ ventilationId: id }),
    setMountingId: (id) => set({ mountingId: id }),

    toggleAccessory: (id) => {
        const { accessoryIds } = get();
        if (accessoryIds.includes(id)) {
            set({ accessoryIds: accessoryIds.filter((a) => a !== id) });
        } else {
            set({ accessoryIds: [...accessoryIds, id] });
        }
    },

    setWidth: (w) => set({ width: w }),
    setHeight: (h) => set({ height: h }),
    setDepth: (d) => set({ depth: d }),
    setSections: (n) => set({ sections: Math.max(1, n) }),

    reset: () => set(initialState),
}));

export default useConfigurator;
