const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://lemnart.ro"

const OrganizationSchema = () => {
    const schema = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": ["LocalBusiness", "FurnitureStore"],
                "@id": `${SITE_URL}/#organization`,
                name: "LemnArt",
                alternateName: "LemnArt - Mascare Calorifere Premium",
                description:
                    "Mascare calorifere din lemn masiv, fabricate artizanal. Design premium, materiale naturale, montaj inclus.",
                url: SITE_URL,
                telephone: "+40700000000",
                email: "contact@lemnart.ro",
                address: {
                    "@type": "PostalAddress",
                    addressLocality: "București",
                    addressCountry: "RO",
                },
                openingHoursSpecification: [
                    {
                        "@type": "OpeningHoursSpecification",
                        dayOfWeek: [
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                        ],
                        opens: "09:00",
                        closes: "18:00",
                    },
                    {
                        "@type": "OpeningHoursSpecification",
                        dayOfWeek: "Saturday",
                        opens: "10:00",
                        closes: "14:00",
                    },
                ],
                priceRange: "$$",
                currenciesAccepted: "RON",
                areaServed: {
                    "@type": "Country",
                    name: "Romania",
                },
            },
            {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                name: "LemnArt",
                url: SITE_URL,
                publisher: {
                    "@id": `${SITE_URL}/#organization`,
                },
                inLanguage: "ro-RO",
            },
        ],
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    )
}

export default OrganizationSchema
