export const SITE_PAGES = {
    home: {
        label: "Home Page",
        description: "Main landing page sections",
        sections: ["hero", "process", "quality", "testimonials", "faq", "cta"] as const,
    },
} as const;

export type PageKey = keyof typeof SITE_PAGES;

export const SECTION_LABELS: Record<string, string> = {
    hero: "Hero",
    process: "Process",
    quality: "Quality",
    testimonials: "Testimonials",
    faq: "FAQ",
    cta: "CTA",
};

export const SECTION_DEFAULTS: Record<string, Record<string, unknown>> = {
    hero: {
        headingLine1: "Artizanatul care îți",
        headingLine2: "transformă casa.",
        subtitle:
            "Mascare calorifere din lemn masiv, create manual cu atenție la fiecare detaliu.",
        ctaLabel: "Descoperă Colecția",
        ctaHref: "/category/all",
        secondaryLabel: "Află mai multe",
        secondaryHref: "/blog",
        videoSrc: "/hero-bg.mp4",
    },
    process: {
        steps: [
            {
                number: "01",
                title: "Măsurare",
                description:
                    "Venim la locație pentru dimensiuni precise și evaluarea spațiului.",
            },
            {
                number: "02",
                title: "Design",
                description:
                    "Proiectăm modelul perfect pentru spațiul tău, cu materiale alese de tine.",
            },
            {
                number: "03",
                title: "Fabricare",
                description:
                    "Construim manual din materiale premium, cu atenție la fiecare detaliu.",
            },
            {
                number: "04",
                title: "Instalare",
                description:
                    "Montaj profesional la domiciliu, fără griji și fără mizerie.",
            },
        ],
    },
    quality: {
        badges: [
            {
                title: "Lemn Masiv",
                description: "Stejar, nuc și fag din surse certificate.",
            },
            {
                title: "Finisaje Premium",
                description: "Lacuri și vopsele ecologice, rezistente.",
            },
            {
                title: "Ventilație Optimă",
                description:
                    "Design care permite circulația eficientă a căldurii.",
            },
            {
                title: "Măsuri Personalizate",
                description: "Fiecare piesă este fabricată pe comandă.",
            },
            {
                title: "Garanție 5 Ani",
                description: "Încredere totală în calitatea produselor.",
            },
            {
                title: "Montaj Inclus",
                description: "Instalare profesională la domiciliu.",
            },
        ],
    },
    testimonials: {
        items: [
            {
                quote: "Mascarea caloriferului a schimbat complet aspectul livingului. Calitate excepțională și finisaj impecabil!",
                name: "Maria P.",
                location: "București",
            },
            {
                quote: "Profesioniști de la A la Z. De la măsurare până la montaj, totul a decurs perfect. Recomand cu încredere.",
                name: "Andrei M.",
                location: "Cluj-Napoca",
            },
            {
                quote: "Am comandat pentru 4 camere. Fiecare piesă arată fabulos și se simte calitatea lemnului masiv.",
                name: "Elena D.",
                location: "Timișoara",
            },
        ],
    },
    faq: {
        items: [
            {
                question: "Cât durează o comandă personalizată?",
                answer: "Termenul standard este de 2-3 săptămâni de la confirmarea comenzii. Pentru proiecte mai complexe sau comenzi multiple, termenul poate fi de 3-4 săptămâni. Vă ținem la curent pe parcursul întregului proces.",
            },
            {
                question: "Ce materiale folosiți?",
                answer: "Lucrăm exclusiv cu lemn masiv — stejar, nuc, fag și alte esențe premium din surse certificate. Finisajele sunt realizate cu lacuri și vopsele ecologice, rezistente la uzură și căldură.",
            },
            {
                question: "Oferiți montaj?",
                answer: "Da, montajul profesional este inclus în preț. Echipa noastră se ocupă de instalarea completă, asigurând o fixare sigură și un aspect impecabil, fără deteriorarea pereților.",
            },
            {
                question: "Mascarea afectează eficiența caloriferului?",
                answer: "Designul nostru asigură ventilație optimă prin deschideri strategice în partea superioară și inferioară. Testele arată o pierdere minimă de eficiență termică, de doar 5-10%.",
            },
            {
                question: "Care este zona de livrare?",
                answer: "Livrăm și montăm în toată România. Pentru localitățile din afara Bucureștiului, programăm vizite de măsurare și montaj în funcție de zonă. Transportul este inclus pentru comenzi peste 1.500 RON.",
            },
        ],
    },
    cta: {
        marqueeText: "Transformă-ți Spațiul",
        heading: "Transformă-ți Spațiul",
        description:
            "Solicită o consultație gratuită și descoperă soluția perfectă pentru casa ta.",
        buttonLabel: "Contactează-ne",
        buttonHref: "/contact",
        phone: "+40 700 000 000",
        email: "contact@lemnart.ro",
    },
};
