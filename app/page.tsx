"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FadeIn, StaggerContainer, StaggerItem, GlassCard, MagneticButton, SectionHeader, AnimatedCounter } from '@/components/Animated';
import { SERVICES } from '@/lib/store';


const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1532710093739-9470acff878f?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1634480481970-b71692a83d00?w=800&h=600&fit=crop',
];

// =================== HERO ===================
function HeroSection() {
  return (
    <section className="relative h-screen sm:h-auto sm:pb-[20px] sm:pt-36 min-h-[600px] flex items-center justify-center overflow-hidden">
      <Image src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1920&h=1080&fit=crop"
        alt="Berber Salonu" fill className="object-cover object-center" priority />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-cream" />
      <div className="relative z-10 text-center px-6 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
          <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] sm:tracking-[0.4em] text-white/80 mb-4 sm:mb-6">Premium Berber Deneyimi</span>
          <h1 className="font-serif text-4xl sm:text-5xl md:text-7xl text-white leading-[1.1] mb-5 sm:mb-6">
            Tarzınıza <span className="italic text-brass">Değer</span> Katıyoruz
          </h1>
          <p className="text-white/70 text-base sm:text-lg max-w-xl mx-auto mb-8 sm:mb-10 leading-relaxed">
            12 yılı aşkın tecrübe ile modern tarzı ve geleneksel ustalığı bir araya getiriyoruz.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Desktop CTA (hidden on mobile, sticky bar handles it) */}
          <Link href="/booking" className="hidden sm:inline-block px-10 py-4 rounded-full gradient-brass text-white font-bold text-sm brass-glow-strong hover:shadow-xl transition-all">
            Randevu Al
          </Link>
          {/* Mobile CTA inline */}
          <Link href="/booking" className="sm:hidden w-full max-w-xs px-8 py-4 rounded-full gradient-brass text-white font-bold text-sm brass-glow-strong text-center active:scale-95 transition-all">
            Randevu Al
          </Link>
          <Link href="/hakkimizda" className="px-10 py-4 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium text-sm border border-white/30 hover:bg-white/30 active:scale-95 transition-all">
            Hakkımızda
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="flex items-center justify-center gap-8 sm:gap-10 mt-12 sm:mt-[20px] sm:mb-2">
          {[{ n: 12, s: '+', l: 'Yıl Tecrübe' }, { n: 5000, s: '+', l: 'Mutlu Müşteri' }, { n: 4.9, s: '', l: 'Puan' }].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounter target={stat.n} suffix={stat.s} /></p>
              <p className="text-[10px] sm:text-xs text-white/50 mt-1">{stat.l}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator — hide on mobile */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden"
        animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-1.5">
          <div className="w-1.5 h-2.5 rounded-full bg-white/60" />
        </div>
      </motion.div>
    </section>
  );
}

// =================== SERVICES ===================
function ServicesSection() {
  return (
    <section className="py-20 sm:pb-28 sm:pt-[20px] px-6 bg-cream">
      <SectionHeader className="sm:mb-[20px]" eyebrow="Hizmetler" title="Uzman Eller, Kusursuz Sonuç" description="Her ziyarette kendinizi yenilenmiş hissetmeniz için özenle tasarlanan hizmetlerimiz." />

      {/* Desktop Grid */}
      <StaggerContainer className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {SERVICES.map(svc => (
          <StaggerItem key={svc.id}>
            <GlassCard className="p-8">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-semibold text-charcoal text-lg">{svc.name}</h3>
                <span className="text-2xl font-bold text-brass">₺{svc.price}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {svc.duration} dakika
              </div>
            </GlassCard>
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Mobile Snap Carousel */}
      <div className="sm:!hidden snap-carousel -mx-6">
        {SERVICES.map(svc => (
          <div key={svc.id} className="w-[80vw] max-w-[320px]">
            <div className="bg-card border border-border rounded-2xl shadow-sm p-6 active:scale-[0.98] transition-transform">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-semibold text-charcoal text-base">{svc.name}</h3>
                <span className="text-xl font-bold text-brass">₺{svc.price}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                {svc.duration} dakika
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// =================== GALLERY ===================
function GallerySection() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setActive(p => (p + 1) % GALLERY_IMAGES.length), 4000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  return (
    <section className="py-20 sm:py-28 px-6 bg-surface">
      <SectionHeader eyebrow="Galeri" title="Çalışmalarımız" description="Her kesim, sakal ve bakım bir sanat eseri." />

      {/* Desktop main image */}
      <div className="max-w-5xl mx-auto hidden sm:block">
        <FadeIn>
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden shadow-lg">
            {GALLERY_IMAGES.map((src, i) => (
              <Image key={i} src={src} alt={`Gallery ${i + 1}`} fill loading="lazy"
                className={`object-cover object-center transition-all duration-700 ${i === active ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`} />
            ))}
          </div>
        </FadeIn>
        <div className="flex gap-3 mt-6 justify-center">
          {GALLERY_IMAGES.map((src, i) => (
            <button key={i} onClick={() => { setActive(i); if (timerRef.current) clearInterval(timerRef.current); }}
              className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all active:scale-95 ${i === active ? 'border-brass shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                }`}>
              <Image src={src} alt="" width={64} height={48} className="object-cover w-full h-full" />
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Snap Carousel Gallery */}
      <div className="sm:!hidden snap-carousel -mx-6">
        {GALLERY_IMAGES.map((src, i) => (
          <div key={i} className="w-[85vw] max-w-[340px] aspect-[4/3] rounded-2xl overflow-hidden shadow-md flex-shrink-0">
            <Image src={src} alt={`Gallery ${i + 1}`} width={340} height={255} loading="lazy"
              className="object-cover object-center w-full h-full" />
          </div>
        ))}
      </div>
    </section>
  );
}

// =================== CTA ===================
function CTASection() {
  return (
    <section className="py-20 sm:py-28 px-6 bg-cream">
      <FadeIn className="max-w-3xl mx-auto text-center">
        <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal mb-5 sm:mb-6">
          İlk Adımı <span className="text-brass italic">Atın</span>
        </h2>
        <p className="text-body text-base sm:text-lg mb-8 sm:mb-10 max-w-lg mx-auto leading-relaxed">
          Randevunuzu hemen oluşturun ve premium berber deneyiminin farkını yaşayın.
        </p>
        <Link href="/booking">
          <MagneticButton className="px-10 sm:px-12 py-4 sm:py-5 rounded-full gradient-brass text-white font-bold brass-glow-strong text-base sm:text-lg animate-pulse-brass active:scale-95 transition-transform">
            Randevu Al
          </MagneticButton>
        </Link>
      </FadeIn>
    </section>
  );
}

// =================== STICKY MOBILE CTA =================== 
function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className={`sm:hidden fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${visible ? 'translate-y-0' : 'translate-y-full'}`}>
      <div className="bg-white/80 backdrop-blur-xl border-t border-border px-6 py-4 mobile-bottom-safe">
        <Link href="/booking"
          className="block w-full py-4 rounded-2xl gradient-brass text-white text-center font-bold text-sm brass-glow active:scale-[0.97] transition-transform">
          ✂️ Randevu Al
        </Link>
      </div>
    </div>
  );
}

// =================== PAGE ===================
export default function Home() {
  return (
    <main className="bg-cream">
      <Navbar />
      <HeroSection />
      <ServicesSection />
      <GallerySection />
      <CTASection />
      <Footer />
      <StickyMobileCTA />
    </main>
  );
}
