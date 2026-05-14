interface NavbarScrollWrapperProps {
    children: React.ReactNode
}

const NavbarScrollWrapper: React.FC<NavbarScrollWrapperProps> = ({ children }) => {
    return (
        <div
            id="site-navbar"
            className="fixed top-0 left-0 right-0 z-40"
        >
            {children}
        </div>
    )
}

export default NavbarScrollWrapper
