import { ConfiguratorOptions } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/configurator/options`;

const getConfiguratorOptions = async (): Promise<ConfiguratorOptions> => {
    try {
        const res = await fetch(URL);
        if (!res.ok) return { styles: [], colors: [], ventilationPatterns: [], mountingTypes: [], accessories: [], priceTiers: [] } as ConfiguratorOptions;
        return res.json();
    } catch {
        return { styles: [], colors: [], ventilationPatterns: [], mountingTypes: [], accessories: [], priceTiers: [] } as ConfiguratorOptions;
    }
}

export default getConfiguratorOptions;
