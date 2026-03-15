import { notFound } from "next/navigation";
import prismadb from "@/lib/prismadb";
import { SITE_PAGES, SECTION_DEFAULTS, type PageKey } from "@/constants/sections";
import { PageEditor } from "./_components/page-editor";

const PageEditorPage = async ({
    params,
}: {
    params: Promise<{ storeId: string; pageKey: string }>;
}) => {
    const { storeId, pageKey } = await params;

    if (!(pageKey in SITE_PAGES)) {
        notFound();
    }

    const page = SITE_PAGES[pageKey as PageKey];
    const sectionKeys = page.sections as unknown as string[];

    const siteContents = await prismadb.siteContent.findMany({
        where: { storeId, key: { in: sectionKeys } },
    });

    const contentMap = new Map(
        siteContents.map((sc) => [sc.key, sc])
    );

    const sectionsData: Record<string, {
        data: Record<string, unknown>;
        isCustomized: boolean;
    }> = {};

    for (const key of sectionKeys) {
        const existing = contentMap.get(key);
        sectionsData[key] = {
            data: existing
                ? (existing.value as Record<string, unknown>)
                : (SECTION_DEFAULTS[key] ?? {}),
            isCustomized: !!existing,
        };
    }

    const storeUrl = process.env.FRONTEND_STORE_URL || "http://localhost:3002";

    return (
        <div className="flex-1">
            <PageEditor
                pageKey={pageKey as PageKey}
                pageLabel={page.label}
                sectionKeys={sectionKeys}
                sectionsData={sectionsData}
                storeUrl={storeUrl}
            />
        </div>
    );
};

export default PageEditorPage;
