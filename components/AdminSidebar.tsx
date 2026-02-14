"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
    {
        label: 'Dashboard', short: 'Panel',
        href: '/admin',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
            </svg>
        ),
    },
    {
        label: 'Takvim', short: 'Takvim',
        href: '/admin/calendar',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
        ),
    },
    {
        label: 'Randevular', short: 'Randevu',
        href: '/admin/appointments',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z" />
            </svg>
        ),
    },
    {
        label: 'Ayarlar', short: 'Ayarlar',
        href: '/admin/settings',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
        ),
    },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const isActive = (href: string) => href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

    return (
        <>
            {/* ═══════ DESKTOP SIDEBAR ═══════ */}
            <aside className="hidden lg:flex fixed top-0 left-0 z-50 h-full w-72 bg-white border-r border-border flex-col">
                {/* Logo */}
                <div className="h-20 flex items-center px-6 border-b border-border">
                    <Link href="/admin" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl gradient-brass flex items-center justify-center">
                            <span className="text-white font-black text-lg">B</span>
                        </div>
                        <div>
                            <span className="text-lg font-bold text-charcoal">BARBER</span>
                            <span className="text-lg font-light text-brass">SaaS</span>
                            <p className="text-[10px] text-muted -mt-1 uppercase tracking-widest">Yönetim Paneli</p>
                        </div>
                    </Link>
                </div>
                {/* Nav */}
                <nav className="flex-1 py-6 px-4 space-y-1">
                    {NAV_ITEMS.map(item => (
                        <Link key={item.href} href={item.href}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all text-sm ${isActive(item.href) ? 'bg-brass/10 text-brass border border-brass/20' : 'text-body hover:bg-surface hover:text-charcoal border border-transparent'
                                }`}>
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>
                {/* Footer */}
                <div className="px-4 pb-6">
                    <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl text-body hover:bg-surface hover:text-charcoal transition-all text-sm font-medium">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                        </svg>
                        Siteye Dön
                    </Link>
                    <div className="mt-4 px-4 text-[10px] text-muted uppercase tracking-widest">v1.0.0 — @Hasan</div>
                </div>
            </aside>

            {/* ═══════ MOBILE: TOP HEADER BAR ═══════ */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-white/80 backdrop-blur-xl border-b border-border/60 flex items-center justify-between px-5">
                <Link href="/admin" className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg gradient-brass flex items-center justify-center">
                        <span className="text-white font-bold text-xs">B</span>
                    </div>
                    <span className="text-base font-bold text-charcoal">BARBER<span className="font-light text-brass">Panel</span></span>
                </Link>
                <Link href="/" className="text-xs text-body font-medium px-3 py-2 rounded-lg hover:bg-surface active:scale-95 transition-all">
                    Siteye Dön
                </Link>
            </div>

            {/* ═══════ MOBILE: BOTTOM TAB BAR (iOS-style) ═══════ */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-border/60 mobile-bottom-safe">
                <div className="flex items-stretch">
                    {NAV_ITEMS.map(item => {
                        const active = isActive(item.href);
                        return (
                            <Link key={item.href} href={item.href}
                                className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 transition-all active:scale-90 ${active ? 'text-brass' : 'text-muted'
                                    }`}>
                                <div className={active ? 'text-brass' : 'text-muted/70'}>{item.icon}</div>
                                <span className={`text-[10px] font-semibold ${active ? 'text-brass' : 'text-muted'}`}>{item.short}</span>
                                {active && <div className="w-4 h-0.5 rounded-full bg-brass mt-0.5" />}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
