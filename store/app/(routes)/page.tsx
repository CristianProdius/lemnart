import Hero from "@/components/sections/hero";
import Collections from "@/components/sections/collections";
import Process from "@/components/sections/process";
import Quality from "@/components/sections/quality";
import FeaturedProducts from "@/components/sections/featured-products";
import Testimonials from "@/components/sections/testimonials";
import FAQ from "@/components/sections/faq";
import CTA from "@/components/sections/cta";
import getProducts from "@/actions/get-products";
import getCategories from "@/actions/get-categories";
import getSiteContent from "@/actions/get-site-content";

export const revalidate = 3600;

const HomePage = async () => {
    const [products, allProducts, categories, heroData, processData, qualityData, testimonialsData, faqData, ctaData] = await Promise.all([
        getProducts({ isFeatured: true }),
        getProducts({}),
        getCategories(),
        getSiteContent('hero'),
        getSiteContent('process'),
        getSiteContent('quality'),
        getSiteContent('testimonials'),
        getSiteContent('faq'),
        getSiteContent('cta'),
    ])

    const h = heroData as Record<string, string> | null;

    return (
        <>
            <Hero
                headingLine1={h?.headingLine1 || "Artizanatul care îți"}
                headingLine2={h?.headingLine2 || "transformă casa."}
                subtitle={h?.subtitle || "Mascare calorifere din lemn masiv, create manual cu atenție la fiecare detaliu."}
                cta={{ label: h?.ctaLabel || "Descoperă Colecția", href: h?.ctaHref || "/category/all" }}
                secondaryLink={{ label: h?.secondaryLabel || "Află mai multe", href: h?.secondaryHref || "/blog" }}
                videoSrc={h?.videoSrc || "/hero-bg.mp4"}
                posterSrc="/hero-poster.jpg"
            />
            <Collections categories={categories} products={allProducts} />
            <Process data={processData as { steps: { number: string; title: string; description: string }[] } | null} />
            <Quality data={qualityData as { badges: { title: string; description: string }[] } | null} />
            <FeaturedProducts items={products} />
            <Testimonials data={testimonialsData as { items: { quote: string; name: string; location: string }[] } | null} />
            <FAQ data={faqData as { items: { question: string; answer: string }[] } | null} />
            <CTA data={ctaData as { marqueeText?: string; heading?: string; description?: string; buttonLabel?: string; buttonHref?: string; phone?: string; email?: string } | null} />
        </>
    )
}

export default HomePage;
