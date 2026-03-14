import Container from "@/components/ui/container";
import Link from "next/link";
import { MainNav } from "@/components";
import getCategories from "@/actions/get-categories";
import NavbarActions from "./navbar-actions";
import NavbarScrollWrapper from "./navbar-scroll-wrapper";

export const revalidate = 0;

const Navbar = async () => {
    const categories = await getCategories();

    return (
        <NavbarScrollWrapper>
            <Container>
                <div className="relative flex items-center h-16 px-4 sm:px-6 lg:px-8">
                    <Link href="/" className="flex ml-4 lg:ml-0 gap-x-2">
                        <p
                            className="text-xl font-bold text-[#1A1A1A]"
                            style={{ fontFamily: "var(--font-barlow)" }}
                        >
                            LEMNART
                        </p>
                    </Link>
                    <MainNav data={categories || []} />
                    <NavbarActions />
                </div>
            </Container>
        </NavbarScrollWrapper>
    )
}
export default Navbar;
