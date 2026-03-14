import Link from "next/link"
import { Phone, Mail, MapPin } from "lucide-react"

const Footer = () => {
    return (
        <footer
            className="border-t"
            style={{
                backgroundColor: "var(--color-foreground)",
                borderColor: "transparent",
            }}
        >
            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Link href="/" className="text-2xl font-bold text-white">
                            LEMNART
                        </Link>
                        <p className="mt-4 text-sm leading-relaxed text-white/50">
                            Mascare calorifere din lemn masiv, fabricate artizanal.
                            Design premium pentru spații de excepție.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/70">
                            Navigare
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="text-sm text-white/50 transition-colors hover:text-white">
                                    Acasă
                                </Link>
                            </li>
                            <li>
                                <Link href="/category/all" className="text-sm text-white/50 transition-colors hover:text-white">
                                    Colecții
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-sm text-white/50 transition-colors hover:text-white">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/70">
                            Informații
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/terms" className="text-sm text-white/50 transition-colors hover:text-white">
                                    Termeni și Condiții
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-sm text-white/50 transition-colors hover:text-white">
                                    Politica de Confidențialitate
                                </Link>
                            </li>
                            <li>
                                <Link href="/returns" className="text-sm text-white/50 transition-colors hover:text-white">
                                    Politica de Retur
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white/70">
                            Contact
                        </h4>
                        <ul className="space-y-3">
                            <li>
                                <a
                                    href="tel:+40700000000"
                                    className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
                                >
                                    <Phone size={14} />
                                    +40 700 000 000
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:contact@lemnart.ro"
                                    className="flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
                                >
                                    <Mail size={14} />
                                    contact@lemnart.ro
                                </a>
                            </li>
                            <li>
                                <span className="flex items-center gap-2 text-sm text-white/50">
                                    <MapPin size={14} />
                                    București, România
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="mt-12 border-t border-white/10 pt-8">
                    <p className="text-center text-xs text-white/30">
                        &copy; {new Date().getFullYear()} LemnArt. Toate drepturile rezervate.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer;
