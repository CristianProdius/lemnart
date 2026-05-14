import { ConfiguratorOptions } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/configurator/options`;

const EMPTY: ConfiguratorOptions = {
    styles: [],
    colors: [],
    ventilationPatterns: [],
    mountingTypes: [],
    accessories: [],
    priceTiers: [],
} as ConfiguratorOptions;

const getConfiguratorOptions = async (): Promise<ConfiguratorOptions> => {
    if (!process.env.NEXT_PUBLIC_API_URL) {
        console.warn('[GET_CONFIGURATOR_OPTIONS] NEXT_PUBLIC_API_URL not set; returning empty');
        return EMPTY;
    }
    try {
        const res = await fetch(URL);
        if (!res.ok) {
            console.warn('[GET_CONFIGURATOR_OPTIONS]', res.status, res.statusText);
            return EMPTY;
        }
        return res.json();
    } catch (err) {
        console.warn('[GET_CONFIGURATOR_OPTIONS]', err);
        return EMPTY;
    }
}

export default getConfiguratorOptions;
