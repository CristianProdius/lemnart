"use client"

import { Button } from "@/components/ui/button"
import { Heading } from "@/components/ui/heading"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { StyleColumn, columns } from "./columns"
import { DataTable } from "@/components/ui/data-table"

interface StyleClientProps {
    data: StyleColumn[]
}

export const StyleClient: React.FC<StyleClientProps> = ({ data }) => {
    const router = useRouter();
    const params = useParams();
    return (
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Styles (${data?.length})`} description="Manage configurator styles"/>
                <Button onClick={() => router.push(`/dashboard/store/${params.storeId}/configurator/styles/new`)}>
                    <Plus className="w-4 h-4 mr-2" /> Add New
                </Button>
            </div>
            <Separator />
            <DataTable columns={columns} data={data} searchKey="name" />
        </>
    )
}
