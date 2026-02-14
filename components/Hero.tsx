import Link from 'next/link';

export default function Hero() {
    return (
        <section className="relative flex min-h-[90vh] items-center justify-center overflow-hidden pt-20">
            {/* Background Pattern */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute inset-0 industrial-gradient" />
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#c5a059 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
                <h1 className="text-5xl font-black tracking-tight text-foreground-custom sm:text-7xl lg:text-8xl">
                    USTA DOKUNUŞU <br />
                    <span className="text-primary-custom gold-glow">MODERN STİL</span>
                </h1>
                <p className="mx-auto mt-8 max-w-2xl text-lg text-muted-foreground-custom sm:text-xl">
                    Endüstriyel estetik ve geleneksel berberlik sanatını birleştirdik.
                    Sıra beklemeden, size özel randevunuzu hemen oluşturun.
                </p>
                <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="/booking"
                        className="w-full rounded-full bg-primary-custom px-10 py-5 text-lg font-black uppercase tracking-widest text-primary-foreground-custom hover:bg-primary-custom/90 transition-all gold-glow sm:w-auto"
                    >
                        Hemen Randevu Al
                    </Link>
                    <Link
                        href="#services"
                        className="w-full rounded-full border border-border-custom bg-secondary-custom/50 px-10 py-5 text-lg font-bold text-foreground-custom backdrop-blur-sm hover:bg-secondary-custom transition-all sm:w-auto"
                    >
                        Hizmetlerimizi Gör
                    </Link>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-primary-custom to-transparent opacity-30" />
        </section>
    );
}
