"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductClient } from "./client"
import { CategoryClient } from "../../categories/_components/client"
import { BillboardClient } from "../../billboards/_components/client"
import { SizeClient } from "../../sizes/_components/client"
import { ColorClient } from "../../colors/_components/client"
import type { ProductColumn } from "./columns"
import type { CategoryColumn } from "../../categories/_components/columns"
import type { BillboardColumn } from "../../billboards/_components/columns"
import type { SizeColumn } from "../../sizes/_components/columns"
import type { ColorColumn } from "../../colors/_components/columns"

interface ProductsTabsProps {
    products: ProductColumn[]
    categories: CategoryColumn[]
    billboards: BillboardColumn[]
    sizes: SizeColumn[]
    colors: ColorColumn[]
}

export const ProductsTabs: React.FC<ProductsTabsProps> = ({
    products,
    categories,
    billboards,
    sizes,
    colors,
}) => {
    return (
        <Tabs defaultValue="products">
            <TabsList>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="billboards">Billboards</TabsTrigger>
                <TabsTrigger value="sizes">Sizes</TabsTrigger>
                <TabsTrigger value="colors">Colors</TabsTrigger>
            </TabsList>
            <TabsContent value="products">
                <ProductClient data={products} />
            </TabsContent>
            <TabsContent value="categories">
                <CategoryClient data={categories} />
            </TabsContent>
            <TabsContent value="billboards">
                <BillboardClient data={billboards} />
            </TabsContent>
            <TabsContent value="sizes">
                <SizeClient data={sizes} />
            </TabsContent>
            <TabsContent value="colors">
                <ColorClient data={colors} />
            </TabsContent>
        </Tabs>
    )
}
