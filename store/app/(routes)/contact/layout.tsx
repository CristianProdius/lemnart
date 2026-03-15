import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Contact — Mascare Calorifere din Lemn Masiv",
    description:
        "Contactează echipa LemnArt pentru informații despre mascare calorifere din lemn masiv, comenzi personalizate sau montaj profesional.",
    alternates: {
        canonical: "/contact",
    },
}

export default function ContactLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return children
}
