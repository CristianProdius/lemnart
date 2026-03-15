"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { PricingColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

interface PricingClientProps {
    data: PricingColumn[]
}

export const PricingClient: React.FC<PricingClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Price Tiers (${data?.length})`} description="Manage pricing tiers for the configurator"/>
                <Button onClick={() => router.push(`/dashboard/store/${params.storeId}/configurator/pricing/new`)}>
                    <Plus className="w-4 h-4 mr-2" /> Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="styleName" />
        </>
    )
}
