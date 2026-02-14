"use client";

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FadeIn, GlassCard, MagneticButton } from '@/components/Animated';

export default function IletisimPage() {
    const [sent, setSent] = useState(false);
    return (
        <main className="bg-cream">
            <Navbar />

            {/* Hero */}
            <section className="pt-28 sm:pt-32 pb-12 sm:pb-16 px-6 text-center">
                <FadeIn>
                    <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-brass mb-3 sm:mb-4">İletişim</span>
                    <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-charcoal">Bize <span className="text-brass italic">Ulaşın</span></h1>
                </FadeIn>
            </section>

            <section className="pb-20 sm:pb-28 px-6">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                    {/* Form */}
                    <FadeIn direction="left">
                        <GlassCard className="p-6 sm:p-8 md:p-10" hover={false}>
                            {sent ? (
                                <div className="text-center py-10 sm:py-12">
                                    <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-emerald-500">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-charcoal mb-2">Mesajınız İletildi!</h3>
                                    <p className="text-body text-sm">En kısa sürede size dönüş yapacağız.</p>
                                </div>
                            ) : (
                                <form onSubmit={e => { e.preventDefault(); setSent(true); }} className="space-y-5 sm:space-y-6">
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">Ad Soyad</label>
                                        <input required type="text" autoComplete="name"
                                            className="w-full bg-surface border border-border rounded-xl px-4 py-4 text-charcoal placeholder-muted focus:border-brass focus:ring-1 focus:ring-brass/20 transition-all outline-none text-base" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">E-posta</label>
                                        <input required type="email" autoComplete="email" inputMode="email"
                                            className="w-full bg-surface border border-border rounded-xl px-4 py-4 text-charcoal placeholder-muted focus:border-brass focus:ring-1 focus:ring-brass/20 transition-all outline-none text-base" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">Mesaj</label>
                                        <textarea required rows={4}
                                            className="w-full bg-surface border border-border rounded-xl px-4 py-4 text-charcoal placeholder-muted focus:border-brass focus:ring-1 focus:ring-brass/20 transition-all outline-none resize-none text-base" />
                                    </div>
                                    <MagneticButton type="submit" className="w-full py-4 rounded-xl gradient-brass text-white font-bold brass-glow active:scale-[0.97] transition-transform">
                                        Gönder
                                    </MagneticButton>
                                </form>
                            )}
                        </GlassCard>
                    </FadeIn>

                    {/* Info */}
                    <FadeIn direction="right" className="space-y-4 sm:space-y-5">
                        {[
                            { icon: '📍', title: 'Adres', info: 'İstanbul, Beşiktaş — Barbaros Bulvarı No:123' },
                            { icon: '📞', title: 'Telefon', info: '+90 (212) 555 00 00' },
                            { icon: '✉️', title: 'E-posta', info: 'info@barbersaas.com' },
                            { icon: '🕐', title: 'Çalışma Saatleri', info: 'Pzt - Cmt: 09:00 - 21:00' },
                        ].map(item => (
                            <GlassCard key={item.title} className="p-5 sm:p-6 flex items-start gap-4 sm:gap-5">
                                <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center text-xl shrink-0">{item.icon}</div>
                                <div>
                                    <h4 className="font-semibold text-charcoal text-sm">{item.title}</h4>
                                    <p className="text-body text-sm mt-1">{item.info}</p>
                                </div>
                            </GlassCard>
                        ))}

                        {/* Map */}
                        <GlassCard className="overflow-hidden w-full" hover={false}>
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.1234567890123!2d29.0!3d41.04!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAyJzI0LjAiTiAyOcKwMDAnMDAuMCJF!5e0!3m2!1str!2str!4v1234567890"
                                width="100%" height="250" style={{ border: 0 }} allowFullScreen loading="lazy"
                                className="w-full h-full block" />
                        </GlassCard>
                    </FadeIn>
                </div>
            </section>

            <Footer />
        </main>
    );
}
