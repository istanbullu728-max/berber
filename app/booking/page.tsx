"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { FadeIn } from '@/components/Animated';
import {
    SERVICES,
    getSettings,
    getMonthDays,
    saveAppointment,
    dateToStr,
    addMinutesToTime,
    isSameDay,
    Service,
} from '@/lib/store';
import { createAppointment, fetchAvailableSlots } from '@/lib/api';

const MONTH_NAMES = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const WEEK_HEADERS = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const STEPS = ['Hizmet', 'Tarih & Saat', 'Bilgiler', 'Onay'];

export default function BookingPage() {
    const [mounted, setMounted] = useState(false);
    const [step, setStep] = useState(0);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [done, setDone] = useState(false);
    const [viewYear, setViewYear] = useState(new Date().getFullYear());
    const [viewMonth, setViewMonth] = useState(new Date().getMonth());
    const [slots, setSlots] = useState<string[]>([]);

    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const loadSlots = async () => {
            if (selectedDate && selectedService) {
                const s = await fetchAvailableSlots(dateToStr(selectedDate), selectedService.duration);
                setSlots(s);
            } else {
                setSlots([]);
            }
        };
        loadSlots();
    }, [selectedDate, selectedService]);

    if (!mounted) return null;

    const settings = getSettings();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = getMonthDays(viewYear, viewMonth);

    const isDayOff = (d: Date) => settings.workingHours.find(w => w.dayOfWeek === d.getDay())?.isDayOff ?? false;

    const navMonth = (dir: number) => {
        let m = viewMonth + dir, y = viewYear;
        if (m > 11) { m = 0; y++; } if (m < 0) { m = 11; y--; }
        setViewMonth(m); setViewYear(y);
    };

    const canNext = () => {
        if (step === 0) return !!selectedService;
        if (step === 1) return !!selectedDate && !!selectedTime;
        if (step === 2) return name.length > 1 && phone.length > 6;
        return false;
    };

    const submit = async () => {
        if (!selectedService || !selectedDate || !selectedTime) return;

        try {
            const result = await createAppointment({
                customerName: name,
                customerPhone: phone,
                serviceId: selectedService.id,
                date: dateToStr(selectedDate),
                startTime: selectedTime,
                endTime: addMinutesToTime(selectedTime, selectedService.duration),
            });

            if (result) {
                setDone(true);
            } else {
                alert("Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
            }
        } catch (error) {
            console.error("Submit error:", error);
            alert("Bir bağlantı hatası oluştu.");
        }
    };

    if (done) {
        return (
            <main className="bg-cream min-h-screen">
                <Navbar />
                <div className="flex items-center justify-center min-h-[80vh] px-6">
                    <FadeIn className="text-center max-w-md">
                        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-emerald-500">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                            </svg>
                        </div>
                        <h2 className="font-serif text-2xl sm:text-3xl text-charcoal mb-3">Randevunuz Alındı!</h2>
                        <p className="text-body text-sm sm:text-base mb-2">{selectedService?.name} — {selectedDate?.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}</p>
                        <p className="text-brass font-bold text-lg">{selectedTime}</p>
                    </FadeIn>
                </div>
                <Footer />
            </main>
        );
    }

    return (
        <main className="bg-cream min-h-screen">
            <Navbar />

            <div className="pt-28 sm:pt-32 pb-24 sm:pb-20 px-6">
                <div className="max-w-2xl mx-auto">
                    {/* Progress */}
                    <div className="flex items-center justify-center gap-2 mb-10 sm:mb-12">
                        {STEPS.map((s, i) => (
                            <div key={s} className="flex items-center gap-2">
                                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all ${i <= step ? 'gradient-brass text-white shadow-sm' : 'bg-surface text-muted border border-border'
                                    }`}>{i + 1}</div>
                                <span className={`hidden sm:inline text-xs font-medium ${i <= step ? 'text-charcoal' : 'text-muted'}`}>{s}</span>
                                {i < STEPS.length - 1 && <div className={`w-8 sm:w-12 h-[2px] rounded-full mx-1 ${i < step ? 'gradient-brass' : 'bg-border'}`} />}
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {/* ─── STEP 0: Service ─── */}
                        {step === 0 && (
                            <motion.div key="s0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 className="font-serif text-2xl sm:text-3xl text-charcoal text-center mb-2">Hizmet Seçin</h2>
                                <p className="text-body text-sm text-center mb-8">Size en uygun hizmeti belirleyin.</p>
                                <div className="space-y-3">
                                    {SERVICES.map(svc => (
                                        <button key={svc.id} onClick={() => setSelectedService(svc)}
                                            className={`w-full flex items-center justify-between p-5 sm:p-6 rounded-2xl border transition-all active:scale-[0.98] text-left ${selectedService?.id === svc.id
                                                ? 'border-brass bg-brass/5 shadow-sm'
                                                : 'border-border bg-card hover:border-brass/30'
                                                }`}>
                                            <div>
                                                <h3 className={`font-semibold text-base ${selectedService?.id === svc.id ? 'text-brass-dark' : 'text-charcoal'}`}>{svc.name}</h3>
                                                <p className="text-sm text-muted mt-0.5">{svc.duration} dakika</p>
                                            </div>
                                            <span className="text-xl font-bold text-brass">₺{svc.price}</span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* ─── STEP 1: Date & Time ─── */}
                        {step === 1 && (
                            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 className="font-serif text-2xl sm:text-3xl text-charcoal text-center mb-2">Tarih & Saat</h2>
                                <p className="text-body text-sm text-center mb-8">Uygun gün ve saati seçin.</p>

                                {/* Calendar */}
                                <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm mb-6">
                                    <div className="flex items-center justify-between mb-5">
                                        <button onClick={() => navMonth(-1)} className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-body hover:text-charcoal active:scale-90 transition-all">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                                        </button>
                                        <span className="text-sm font-bold text-charcoal">{MONTH_NAMES[viewMonth]} {viewYear}</span>
                                        <button onClick={() => navMonth(1)} className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-body hover:text-charcoal active:scale-90 transition-all">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-2">
                                        {WEEK_HEADERS.map(d => <div key={d} className="text-center text-[10px] uppercase tracking-wider text-muted font-semibold py-1">{d}</div>)}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                                        {days.map((day, i) => {
                                            if (!day) return <div key={`e-${i}`} />;
                                            const past = day < today;
                                            const off = isDayOff(day);
                                            const disabled = past || off;
                                            const sel = selectedDate && isSameDay(day, selectedDate);
                                            const td = isSameDay(day, new Date());
                                            return (
                                                <button key={day.toISOString()} onClick={() => { if (!disabled) { setSelectedDate(day); setSelectedTime(''); } }}
                                                    disabled={disabled}
                                                    className={`aspect-square rounded-xl text-sm font-medium flex items-center justify-center transition-all active:scale-90
                            ${sel ? 'gradient-brass text-white font-bold shadow-sm' : ''}
                            ${td && !sel ? 'ring-1 ring-brass/50 text-brass font-semibold' : ''}
                            ${disabled ? 'text-muted/30 cursor-not-allowed' : ''}
                            ${!sel && !disabled && !td ? 'text-charcoal hover:bg-surface' : ''}
                          `}>{day.getDate()}</button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Time Slots */}
                                {selectedDate && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                                        <h3 className="font-semibold text-charcoal text-sm mb-3">{selectedDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' })}</h3>
                                        {slots.length === 0 ? (
                                            <p className="text-body text-sm py-6 text-center bg-surface rounded-xl">Uygun slot bulunamadı.</p>
                                        ) : (
                                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
                                                {slots.map(slot => (
                                                    <button key={slot} onClick={() => setSelectedTime(slot)}
                                                        className={`py-3.5 sm:py-3 rounded-xl text-sm font-semibold transition-all active:scale-90 ${selectedTime === slot
                                                            ? 'gradient-brass text-white shadow-sm'
                                                            : 'bg-card border border-border text-charcoal hover:border-brass/30'
                                                            }`}>{slot}</button>
                                                ))}
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </motion.div>
                        )}

                        {/* ─── STEP 2: Contact ─── */}
                        {step === 2 && (
                            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 className="font-serif text-2xl sm:text-3xl text-charcoal text-center mb-2">Bilgileriniz</h2>
                                <p className="text-body text-sm text-center mb-8">İletişim bilgilerinizi girin.</p>
                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">Ad Soyad</label>
                                        <input value={name} onChange={e => setName(e.target.value)} autoComplete="name"
                                            className="w-full bg-surface border border-border rounded-xl px-4 py-4 text-charcoal text-base focus:border-brass focus:ring-1 focus:ring-brass/20 transition-all outline-none" placeholder="Ad Soyad" />
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-2">Telefon</label>
                                        <input value={phone} onChange={e => setPhone(e.target.value)}
                                            type="tel" inputMode="tel" autoComplete="tel"
                                            className="w-full bg-surface border border-border rounded-xl px-4 py-4 text-charcoal text-base focus:border-brass focus:ring-1 focus:ring-brass/20 transition-all outline-none" placeholder="05XX XXX XX XX" />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* ─── STEP 3: Confirm ─── */}
                        {step === 3 && (
                            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                                <h2 className="font-serif text-2xl sm:text-3xl text-charcoal text-center mb-2">Onay</h2>
                                <p className="text-body text-sm text-center mb-8">Bilgileri kontrol edin ve onaylayın.</p>
                                <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-4 sm:space-y-5">
                                    {[
                                        { l: 'Hizmet', v: `${selectedService?.name} — ₺${selectedService?.price}` },
                                        { l: 'Tarih', v: selectedDate?.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', weekday: 'long' }) },
                                        { l: 'Saat', v: selectedTime },
                                        { l: 'Ad', v: name },
                                        { l: 'Telefon', v: phone },
                                    ].map(r => (
                                        <div key={r.l} className="flex justify-between items-center py-3 border-b border-border-light last:border-b-0">
                                            <span className="text-sm text-muted">{r.l}</span>
                                            <span className="text-sm font-semibold text-charcoal text-right">{r.v}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* ─── BOTTOM NAV ─── */}
                    <div className="mt-8 sm:mt-10 flex gap-3 sm:gap-4">
                        {step > 0 && (
                            <button onClick={() => setStep(s => s - 1)}
                                className="flex-1 py-4 rounded-xl bg-surface border border-border text-charcoal font-semibold text-sm active:scale-[0.97] transition-all">
                                Geri
                            </button>
                        )}
                        {step < 3 ? (
                            <button onClick={() => setStep(s => s + 1)} disabled={!canNext()}
                                className={`flex-1 py-4 rounded-xl font-bold text-sm transition-all active:scale-[0.97] ${canNext() ? 'gradient-brass text-white brass-glow' : 'bg-surface text-muted cursor-not-allowed'
                                    }`}>Devam</button>
                        ) : (
                            <motion.button whileTap={{ scale: 0.97 }} onClick={submit}
                                className="flex-1 py-4 rounded-xl gradient-brass text-white font-bold text-sm brass-glow animate-pulse-brass">
                                ✂️ Randevuyu Onayla
                            </motion.button>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
