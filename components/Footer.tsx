"use client";

import Link from 'next/link';
import { FadeIn } from './Animated';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-border">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand */}
                    <FadeIn>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-lg gradient-brass flex items-center justify-center">
                                <span className="text-white font-black text-sm">R</span>
                            </div>
                            <span className="text-xl font-bold tracking-tight text-charcoal">
                                RANDEVUM<span className="font-light text-brass">BARBER</span>
                            </span>
                        </div>
                        <p className="text-body text-sm leading-relaxed max-w-xs">
                            Profesyonel berber deneyimini modern teknoloji ile buluşturuyoruz. Kalite ve lüks bir arada.
                        </p>
                    </FadeIn>

                    {/* Links */}
                    <FadeIn delay={0.1}>
                        <h4 className="font-semibold text-charcoal uppercase tracking-wider text-xs mb-5">Sayfalar</h4>
                        <nav className="space-y-3">
                            {[
                                { label: 'Ana Sayfa', href: '/' },
                                { label: 'Hakkımızda', href: '/hakkimizda' },
                                { label: 'İletişim', href: '/iletisim' },
                                { label: 'Randevu Al', href: '/booking' },
                            ].map(link => (
                                <Link key={link.href} href={link.href}
                                    className="block text-sm text-body hover:text-brass transition-colors">{link.label}</Link>
                            ))}
                        </nav>
                    </FadeIn>

                    {/* Social */}
                    <FadeIn delay={0.2}>
                        <h4 className="font-semibold text-charcoal uppercase tracking-wider text-xs mb-5">Sosyal Medya</h4>
                        <div className="flex gap-3">
                            {[
                                {
                                    name: 'Instagram',
                                    icon: <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>,
                                    color: 'hover:text-[#E1306C]'
                                },
                                {
                                    name: 'X',
                                    icon: <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
                                    color: 'hover:text-black'
                                },
                                {
                                    name: 'YouTube',
                                    icon: <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" /></svg>,
                                    color: 'hover:text-[#FF0000]'
                                }
                            ].map(item => (
                                <div key={item.name}
                                    className={`w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-body hover:bg-white hover:shadow-md transition-all cursor-pointer ${item.color}`}>
                                    {item.icon}
                                </div>
                            ))}
                        </div>
                        <div className="mt-6 text-xs text-muted">
                            <p>📍 İstanbul, Türkiye</p>
                            <p className="mt-1">📞 +90 (212) 555 0000</p>
                        </div>
                    </FadeIn>
                </div>

                {/* Bottom */}
                <div className="mt-12 pt-6 border-t border-border-light flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <p className="text-xs text-muted">© 2026 Randevum Barber. Tüm hakları saklıdır.</p>
                        <Link href="/admin" className="text-[10px] text-muted/50 hover:text-brass transition-colors">Yönetici</Link>
                    </div>
                    <p className="text-xs text-muted">Designed with ✦ Premium Quality</p>
                </div>
            </div>
        </footer>
    );
}
