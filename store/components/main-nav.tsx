"use client"
import { cn } from '@/lib/utils';
import { Category } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation'

interface MainNavProps {
    data: Category[] | []
}

const MainNav: React.FC<MainNavProps> = ({ data }) => {
    const pathname = usePathname();

    const routes = data.map(route => ({
        href: `/category/${route.id}`,
        label: route.name,
        active: pathname === `/category/${route.id}`
    }))

    return (
        <nav
            className='flex items-center mx-6 space-x-4 lg:space-x-6'
            style={{ fontFamily: "var(--font-barlow)" }}
        >
            {routes.map(route => (
                <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                        'text-[14px] font-medium transition-colors duration-300',
                        route.active
                            ? 'text-[#1A1A1A]'
                            : 'text-neutral-500 hover:text-[#1A1A1A]'
                    )}
                >
                    {route.label}
                </Link>
            ))}
        </nav>
    )
}

export default MainNav;
