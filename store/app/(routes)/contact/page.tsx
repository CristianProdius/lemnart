import getSiteContent from "@/actions/get-site-content"
import ContactPageClient from "./components/contact-page-client"

const defaultHero = {
    heading: "Contactează-ne",
    description:
        "Suntem aici pentru a vă ajuta cu orice întrebare despre produsele noastre, comenzi personalizate sau montaj.",
}

const defaultInfo = {
    phone: "+40 700 000 000",
    phoneHref: "tel:+40700000000",
    email: "contact@lemnart.ro",
    emailHref: "mailto:contact@lemnart.ro",
    location: "București, România",
}

const defaultHours = {
    rows: [
        { label: "Luni – Vineri", value: "09:00 – 18:00" },
        { label: "Sâmbătă", value: "10:00 – 14:00" },
        { label: "Duminică", value: "Închis" },
    ],
}

const ContactPage = async () => {
    const [heroData, infoData, hoursData] = await Promise.all([
        getSiteContent("contact-hero"),
        getSiteContent("contact-info"),
        getSiteContent("contact-hours"),
    ])

    const hero = (heroData ?? defaultHero) as { heading: string; description: string }
    const info = (infoData ?? defaultInfo) as {
        phone: string; phoneHref: string; email: string; emailHref: string; location: string
    }
    const hours = (hoursData ?? defaultHours) as { rows: { label: string; value: string }[] }

    const contactItems = [
        {
            num: "01",
            label: "Telefon",
            value: info.phone,
            href: info.phoneHref,
            iconName: "phone" as const,
        },
        {
            num: "02",
            label: "Email",
            value: info.email,
            href: info.emailHref,
            iconName: "mail" as const,
        },
        {
            num: "03",
            label: "Locație",
            value: info.location,
            href: null,
            iconName: "mapPin" as const,
        },
    ]

    return (
        <ContactPageClient
            heroHeading={hero.heading}
            heroDescription={hero.description}
            contactItems={contactItems}
            hoursRows={hours.rows}
        />
    )
}

export default ContactPage
