import type { Metadata } from "next";
import getConfiguratorOptions from "@/actions/get-configurator-options";
import ConfiguratorClient from "./configurator-client";

export const metadata: Metadata = {
    title: "Configurator 3D — Personalizează Mascarea Caloriferului",
    description:
        "Configurează-ți propria mascare de calorifer: alege stilul, dimensiunile, culoarea lemnului, tipul de ventilație și accesoriile. Previzualizare 3D în timp real.",
    openGraph: {
        title: "Configurator 3D — Personalizează Mascarea Caloriferului",
        description:
            "Configurează-ți propria mascare de calorifer: alege stilul, dimensiunile, culoarea lemnului, tipul de ventilație și accesoriile.",
        type: "website",
    },
    alternates: {
        canonical: "/configurator",
    },
};

const ConfiguratorPage = async () => {
    const options = await getConfiguratorOptions();

    return <ConfiguratorClient options={options} />;
};

export default ConfiguratorPage;
