import { ConfiguratorOptions } from "@/types";

const URL = `${process.env.NEXT_PUBLIC_API_URL}/configurator/options`;

const getConfiguratorOptions = async (): Promise<ConfiguratorOptions> => {
    const res = await fetch(URL);
    return res.json();
}

export default getConfiguratorOptions;
