"use client";

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FadeIn, StaggerContainer, StaggerItem, GlassCard, SectionHeader } from '@/components/Animated';

export default function HakkimizdaPage() {
    return (
        <main className="bg-cream">
            <Navbar />

            {/* Hero */}
            <section className="relative h-[50vh] sm:h-[60vh] min-h-[350px] flex items-center justify-center overflow-hidden">
                <Image src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&h=800&fit=crop"
                    alt="Berber Salonu" fill className="object-cover object-center" priority />
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-cream" />
                <div className="relative z-10 text-center px-6">
                    <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-[0.35em] sm:tracking-[0.4em] text-white/80 mb-3 sm:mb-4">Hikayemiz</span>
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-6xl text-white">Hakkımızda</h1>
                </div>
            </section>

            {/* Story */}
            <section className="py-20 sm:py-28 px-6 bg-cream">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
                    <FadeIn direction="left">
                        <div className="relative aspect-[4/5] sm:aspect-[4/5] rounded-2xl overflow-hidden shadow-lg">
                            <Image src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=750&fit=crop"
                                alt="Berber" fill loading="lazy" className="object-cover object-center" />
                        </div>
                    </FadeIn>
                    <FadeIn direction="right">
                        <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-brass mb-3 sm:mb-4 block">12+ Yıllık Tecrübe</span>
                        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-charcoal mb-5 sm:mb-6">Ustalık, Tutku ve <span className="text-brass italic">Sanat</span></h2>
                        <p className="text-body leading-relaxed mb-4 sm:mb-5 text-sm sm:text-base">
                            2012 yılından bu yana İstanbul&apos;un kalbinde, geleneksel berber ustalığını modern tekniklerle harmanlayarak hizmet veriyoruz. Her müşterimiz bizim için bir sanat eseri.
                        </p>
                        <p className="text-body leading-relaxed text-sm sm:text-base">
                            Dünya trendlerini yakından takip ederek, sizlere en güncel ve kişiye özel tarzlar sunuyoruz. Salonumuz, sadece bir berber değil; kendinizi yenileyeceğiniz bir deneyim merkezi.
                        </p>
                    </FadeIn>
                </div>
            </section>



            <Footer />
        </main>
    );
}
