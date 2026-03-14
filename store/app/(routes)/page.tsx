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
                headingLine1="Artizanatul care îți transformă"
                headingLine2="casa în operă de artă"
                subtext="Mascare calorifere premium din lemn masiv, create artizanal cu atenție la fiecare detaliu pentru designeri și proprietari exigenți."
                cta={{ label: "Descoperă Colecția", href: "/category/all" }}
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
