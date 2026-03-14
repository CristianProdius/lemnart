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
            <div className="relative flex items-center h-[72px] px-6 md:px-12 lg:px-20">
                <Link href="/" className="flex gap-x-2">
                    <p
                        className="navbar-logo text-xl font-bold"
                        style={{ fontFamily: "var(--font-barlow)" }}
                    >
                        LEMNART
                    </p>
                </Link>
                <span className="navbar-separator mx-5 hidden lg:block h-5 w-px" />
                <MainNav data={categories || []} />
                <NavbarActions />
            </div>
        </NavbarScrollWrapper>
    )
}
export default Navbar;
