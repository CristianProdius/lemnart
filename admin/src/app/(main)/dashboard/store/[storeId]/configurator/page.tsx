"use client"

import { useParams, useRouter } from "next/navigation"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Paintbrush, Wind, Wrench, Package, DollarSign } from "lucide-react"

const subResources = [
    {
        title: "Styles",
        description: "Manage configurator styles (e.g., fence types, panel designs)",
        href: "configurator/styles",
        icon: Paintbrush,
    },
    {
        title: "Ventilation",
        description: "Manage ventilation patterns and their price modifiers",
        href: "configurator/ventilation",
        icon: Wind,
    },
    {
        title: "Mounting",
        description: "Manage mounting types and their price modifiers",
        href: "configurator/mounting",
        icon: Wrench,
    },
    {
        title: "Accessories",
        description: "Manage accessories available in the configurator",
        href: "configurator/accessories",
        icon: Package,
    },
    {
        title: "Pricing",
        description: "Manage price tiers based on style, color, and dimensions",
        href: "configurator/pricing",
        icon: DollarSign,
    },
]

const ConfiguratorPage = () => {
    const router = useRouter();
    const params = useParams();

    return (
        <div className="space-y-4">
            <Heading title="Configurator" description="Manage all configurator settings and resources" />
            <Separator />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {subResources.map((resource) => (
                    <Card
                        key={resource.title}
                        className="cursor-pointer transition-colors hover:bg-muted/50"
                        onClick={() => router.push(`/dashboard/store/${params.storeId}/${resource.href}`)}
                    >
                        <CardHeader>
                            <div className="flex items-center gap-x-3">
                                <resource.icon className="h-5 w-5" />
                                <CardTitle>{resource.title}</CardTitle>
                            </div>
                            <CardDescription>{resource.description}</CardDescription>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default ConfiguratorPage;
