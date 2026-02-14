"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const LINKS = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/iletisim', label: 'İletişim' },
  { href: '/booking', label: 'Randevu Al', cta: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? 'bg-white/70 backdrop-blur-2xl border-b border-border/60 shadow-[0_1px_3px_rgba(0,0,0,0.03)]'
        : 'bg-gradient-to-b from-black/40 to-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 sm:h-18 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group min-h-[48px]">
            <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center transition-colors ${scrolled ? 'gradient-brass' : 'bg-white/20 backdrop-blur-md'}`}>
              <span className={`font-bold text-sm sm:text-base ${scrolled ? 'text-white' : 'text-white'}`}>R</span>
            </div>
            <span className={`text-lg sm:text-xl font-bold transition-colors ${scrolled ? 'text-charcoal' : 'text-white'}`}>
              Randevum<span className={scrolled ? 'text-brass' : 'text-white/90'}>Barber</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {LINKS.map(link => (
              link.cta ? (
                <Link key={link.href} href={link.href}
                  className="ml-4 px-6 py-2.5 rounded-full gradient-brass text-white text-sm font-bold brass-glow hover:shadow-lg transition-all">
                  {link.label}
                </Link>
              ) : (
                <Link key={link.href} href={link.href}
                  className={`relative px-4 py-2.5 text-sm font-semibold transition-colors ${pathname === link.href
                      ? (scrolled ? 'text-brass' : 'text-white')
                      : (scrolled ? 'text-body hover:text-charcoal' : 'text-white/80 hover:text-white')
                    }`}>
                  {link.label}
                  {pathname === link.href && <motion.div layoutId="nav-underline" className={`absolute bottom-0.5 left-4 right-4 h-0.5 rounded-full ${scrolled ? 'bg-brass' : 'bg-white'}`} />}
                </Link>
              )
            ))}
          </div>

          {/* Mobile Hamburger */}
          <button onClick={() => setMobileOpen(o => !o)}
            className="md:hidden w-12 h-12 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-surface/50 transition-colors"
            aria-label="Menü">
            <motion.div animate={{ rotate: mobileOpen ? 45 : 0, y: mobileOpen ? 7 : 0 }}
              className="w-6 h-[2px] rounded-full bg-charcoal" />
            <motion.div animate={{ opacity: mobileOpen ? 0 : 1 }}
              className="w-6 h-[2px] rounded-full bg-charcoal" />
            <motion.div animate={{ rotate: mobileOpen ? -45 : 0, y: mobileOpen ? -7 : 0 }}
              className="w-6 h-[2px] rounded-full bg-charcoal" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Full Screen Slide */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div className="absolute inset-0 bg-white/95 backdrop-blur-xl" />
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="relative h-full flex flex-col items-center justify-center gap-2 px-6"
            >
              {LINKS.map((link, i) => (
                link.cta ? (
                  <motion.div key={link.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06 }} className="w-full max-w-xs mt-4">
                    <Link href={link.href} onClick={() => setMobileOpen(false)}
                      className="block w-full py-4 rounded-2xl gradient-brass text-white text-center font-bold text-base brass-glow active:scale-95 transition-transform">
                      ✂️ {link.label}
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div key={link.href} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.06 }} className="w-full max-w-xs">
                    <Link href={link.href} onClick={() => setMobileOpen(false)}
                      className={`block w-full py-4 rounded-2xl text-center text-lg font-medium transition-all active:scale-95 active:bg-surface ${pathname === link.href ? 'text-brass font-bold' : 'text-charcoal'
                        }`}>
                      {link.label}
                    </Link>
                  </motion.div>
                )
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
