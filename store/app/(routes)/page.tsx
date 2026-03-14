import Hero from "@/components/sections/hero";
import Collections from "@/components/sections/collections";
import Process from "@/components/sections/process";
import Quality from "@/components/sections/quality";
import FeaturedProducts from "@/components/sections/featured-products";
import Testimonials from "@/components/sections/testimonials";
import FAQ from "@/components/sections/faq";
import CTA from "@/components/sections/cta";
import getProducts from "@/actions/get-products";

export const revalidate = 0;

const HomePage = async () => {
    const products = await getProducts({ isFeatured: true })
    return (
        <>
            <Hero
                headingLine1="Artizanatul care îți"
                headingLine2="transformă casa."
                subtitle="Mascare calorifere din lemn masiv, create manual cu atenție la fiecare detaliu."
                cta={{ label: "Descoperă Colecția", href: "/category/all" }}
                secondaryLink={{ label: "Află mai multe", href: "#collections" }}
                videoSrc="/hero-bg.mp4"
            />
            <Collections />
            <Process />
            <Quality />
            <FeaturedProducts items={products} />
            <Testimonials />
            <FAQ />
            <CTA />
        </>
    )
}

export default HomePage;
