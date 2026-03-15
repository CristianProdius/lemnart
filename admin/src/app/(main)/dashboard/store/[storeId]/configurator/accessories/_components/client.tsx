"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { AccessoryColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

interface AccessoryClientProps {
    data: AccessoryColumn[]
}

export const AccessoryClient: React.FC<AccessoryClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Accessories (${data?.length})`} description="Manage configurator accessories"/>
                <Button onClick={() => router.push(`/dashboard/store/${params.storeId}/configurator/accessories/new`)}>
                    <Plus className="w-4 h-4 mr-2" /> Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name" />
        </>
    )
}
