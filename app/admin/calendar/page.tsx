"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/components/Toast';
import {
    updateAppointmentStatus,
    getServiceById,
    getWeekDays,
    getMonthDays,
    dateToStr,
    isSameDay,
    formatShortDate,
    formatDayName,
    timeToMinutes,
    minutesToTime,
    addMinutesToTime,
    SERVICES,
    Appointment,
    ManualBlock,
} from '@/lib/store';
import {
    fetchAppointments,
    fetchBlocks,
    createAppointment,
    createBlock,
    deleteBlock,
    updateAppointmentStatus as updateApptStatusApi
} from '@/lib/api';

/* ═══════════ CONSTANTS ═══════════ */
const HOUR_H = 72;
const START_H = 8;
const END_H = 22;
const TOTAL_H = END_H - START_H;
const HOURS = Array.from({ length: TOTAL_H }, (_, i) => START_H + i);
const MO_NAMES = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];
const WK_H = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const STATUS_P: Record<string, { bg: string; border: string; text: string; accent: string; badge: string; label: string }> = {
    pending: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', accent: 'bg-amber-400', badge: 'bg-amber-100 text-amber-700', label: 'Bekliyor' },
    confirmed: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', accent: 'bg-emerald-400', badge: 'bg-emerald-100 text-emerald-700', label: 'Onaylandı' },
    completed: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700', accent: 'bg-blue-400', badge: 'bg-blue-100 text-blue-700', label: 'Tamamlandı' },
    cancelled: { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-400', accent: 'bg-gray-300', badge: 'bg-gray-100 text-gray-500', label: 'İptal' },
};

/* ═══════════ MINI DATEPICKER ═══════════ */
function MiniPicker({ date, onSelect, open, toggle }: {
    date: Date; onSelect: (d: Date) => void; open: boolean; toggle: () => void;
}) {
    const today = new Date();
    const [vy, setVY] = useState(date.getFullYear());
    const [vm, setVM] = useState(date.getMonth());
    const days = getMonthDays(vy, vm);
    const nav = (d: number) => { let m = vm + d, y = vy; if (m > 11) { m = 0; y++; } if (m < 0) { m = 11; y--; } setVM(m); setVY(y); };
    return (
        <div className="relative">
            <button onClick={toggle}
                className="flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl bg-white border border-border text-sm font-semibold text-charcoal hover:border-brass/40 transition-all shadow-sm active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-brass">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
                <span className="hidden sm:inline">{date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                <span className="sm:hidden">{date.getDate()} {MO_NAMES[date.getMonth()]}</span>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className="absolute top-full mt-2 left-0 sm:left-0 z-50 bg-white border border-border rounded-2xl shadow-xl p-4 sm:p-5 w-[280px] sm:w-[300px]">
                        <div className="flex items-center justify-between mb-3">
                            <button onClick={() => nav(-1)} className="w-9 h-9 rounded-lg hover:bg-surface flex items-center justify-center text-body active:scale-90">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                            </button>
                            <span className="text-sm font-bold text-charcoal">{MO_NAMES[vm]} {vy}</span>
                            <button onClick={() => nav(1)} className="w-9 h-9 rounded-lg hover:bg-surface flex items-center justify-center text-body active:scale-90">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                            </button>
                        </div>
                        <div className="grid grid-cols-7 gap-0.5 mb-1">
                            {WK_H.map(d => <div key={d} className="text-center text-[10px] uppercase tracking-wider text-muted font-semibold py-1">{d}</div>)}
                        </div>
                        <div className="grid grid-cols-7 gap-0.5">
                            {days.map((day, i) => {
                                if (!day) return <div key={`e-${i}`} />;
                                const sel = isSameDay(day, date);
                                const td = isSameDay(day, today);
                                return (
                                    <button key={day.toISOString()} onClick={() => { onSelect(day); toggle(); }}
                                        className={`aspect-square rounded-lg text-xs font-medium flex items-center justify-center transition-all active:scale-90
                      ${sel ? 'gradient-brass text-white font-bold shadow-sm' : ''}
                      ${td && !sel ? 'ring-1 ring-brass/50 text-brass font-semibold' : ''}
                      ${!sel && !td ? 'text-charcoal hover:bg-surface' : ''}
                    `}>{day.getDate()}</button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* ═══════════ LIVE TIME LINE ═══════════ */
function LiveLine() {
    const [now, setNow] = useState(new Date());
    useEffect(() => { const i = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(i); }, []);
    const m = now.getHours() * 60 + now.getMinutes();
    const top = ((m - START_H * 60) / 60) * HOUR_H;
    if (top < 0 || top > TOTAL_H * HOUR_H) return null;
    return (
        <div className="absolute left-0 right-0 z-30 pointer-events-none" style={{ top }}>
            <div className="flex items-center">
                <div className="relative -ml-[5px]"><div className="w-[10px] h-[10px] rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" /></div>
                <div className="flex-1 h-[2px] bg-gradient-to-r from-red-500 to-red-500/0" />
            </div>
        </div>
    );
}

/* ═══════════ APPOINTMENT DETAIL DRAWER/MODAL ═══════════ */
function AppointmentDetail({ appt, onClose, onAction }: {
    appt: Appointment;
    onClose: () => void;
    onAction: (id: string, action: string) => void;
}) {
    const svc = getServiceById(appt.serviceId);
    const dur = timeToMinutes(appt.endTime) - timeToMinutes(appt.startTime);
    const p = STATUS_P[appt.status];
    const dateFormatted = appt.date.split('-').reverse().join('.');

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/20 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={onClose}>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="bg-white w-full sm:max-w-sm sm:rounded-2xl rounded-t-3xl border-t sm:border border-border shadow-2xl overflow-hidden"
                onClick={e => e.stopPropagation()}>

                {/* Drag handle (mobile) */}
                <div className="sm:hidden flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-border" /></div>

                {/* Status banner */}
                <div className={`${p.badge} px-5 py-2.5 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                        <div className={`w-2.5 h-2.5 rounded-full ${p.accent}`} />
                        <span className="text-xs font-bold uppercase tracking-wider">{p.label}</span>
                    </div>
                    <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-black/5 active:scale-90 transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Customer info */}
                <div className="p-5 sm:p-6 space-y-4">
                    {/* Name & Phone */}
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl gradient-brass flex items-center justify-center shrink-0">
                            <span className="text-white font-bold text-lg">{appt.customerName.charAt(0).toUpperCase()}</span>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-charcoal text-lg leading-tight truncate">{appt.customerName}</h3>
                            <a href={`tel:${appt.customerPhone}`} className="text-sm text-brass font-medium flex items-center gap-1 mt-0.5">
                                📱 {appt.customerPhone}
                            </a>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-border" />

                    {/* Details grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-surface rounded-xl p-3.5">
                            <p className="text-[10px] uppercase tracking-wider text-muted font-semibold mb-1">Hizmet</p>
                            <p className="text-sm font-bold text-charcoal">{svc?.name || '—'}</p>
                        </div>
                        <div className="bg-surface rounded-xl p-3.5">
                            <p className="text-[10px] uppercase tracking-wider text-muted font-semibold mb-1">Süre</p>
                            <p className="text-sm font-bold text-charcoal">{dur} dakika</p>
                        </div>
                        <div className="bg-surface rounded-xl p-3.5">
                            <p className="text-[10px] uppercase tracking-wider text-muted font-semibold mb-1">Tarih</p>
                            <p className="text-sm font-bold text-charcoal">{dateFormatted}</p>
                        </div>
                        <div className="bg-surface rounded-xl p-3.5">
                            <p className="text-[10px] uppercase tracking-wider text-muted font-semibold mb-1">Saat</p>
                            <p className="text-sm font-bold text-charcoal">{appt.startTime} – {appt.endTime}</p>
                        </div>
                    </div>

                    {svc && (
                        <div className="bg-surface rounded-xl p-3.5 flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-wider text-muted font-semibold">Ücret</span>
                            <span className="text-lg font-bold text-brass">₺{svc.price}</span>
                        </div>
                    )}

                    {/* Action buttons */}
                    {(appt.status === 'pending' || appt.status === 'confirmed') && (
                        <div className="flex gap-2 pt-1">
                            {appt.status === 'pending' && (
                                <button onClick={() => { onAction(appt.id, 'confirm'); onClose(); }}
                                    className="flex-1 py-3.5 rounded-xl bg-emerald-500 text-white text-sm font-bold active:scale-95 transition-all shadow-sm">
                                    ✓ Onayla
                                </button>
                            )}
                            {appt.status === 'confirmed' && (
                                <button onClick={() => { onAction(appt.id, 'complete'); onClose(); }}
                                    className="flex-1 py-3.5 rounded-xl bg-blue-500 text-white text-sm font-bold active:scale-95 transition-all shadow-sm">
                                    ✔ Tamamla
                                </button>
                            )}
                            <button onClick={() => { onAction(appt.id, 'cancel'); onClose(); }}
                                className="py-3.5 px-6 rounded-xl bg-red-50 text-red-500 text-sm font-bold border border-red-200 active:scale-95 transition-all">
                                İptal
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ═══════════ QUICK-ADD DRAWER (mobile) / MODAL (desktop) ═══════════ */
function QuickAdd({ date, time, onClose, onAppt, onBlock }: {
    date: string; time: string; onClose: () => void;
    onAppt: (d: { name: string; phone: string; serviceId: string }) => void;
    onBlock: (reason: string, end: string) => void;
}) {
    const [mode, setMode] = useState<'appt' | 'block'>('appt');
    const [name, setName] = useState(''); const [phone, setPhone] = useState('');
    const [svcId, setSvcId] = useState(SERVICES[0]?.id || '');
    const [reason, setReason] = useState('Öğle Molası');
    const [end, setEnd] = useState(() => minutesToTime(Math.min(timeToMinutes(time) + 60, END_H * 60)));
    const REASONS = ['Öğle Molası', 'Dükkan Kapalı', 'Kişisel İzin', 'Temizlik', 'Diğer'];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/15 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={onClose}>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-3xl border-t sm:border border-border shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                onClick={e => e.stopPropagation()}>
                <div className="sm:hidden flex justify-center pt-3 pb-1"><div className="w-10 h-1 rounded-full bg-border" /></div>
                <div className="px-6 pt-4 sm:pt-6 pb-3">
                    <div className="flex items-center justify-between mb-1">
                        <h3 className="text-lg font-bold text-charcoal">Hızlı Ekle</h3>
                        <button onClick={onClose} className="w-10 h-10 rounded-xl hover:bg-surface flex items-center justify-center text-muted active:scale-90">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    <p className="text-xs text-muted">{date.split('-').reverse().join('.')} · {time}</p>
                </div>
                <div className="px-6 mb-5">
                    <div className="flex rounded-xl bg-surface p-1">
                        <button onClick={() => setMode('appt')} className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${mode === 'appt' ? 'bg-white text-charcoal shadow-sm' : 'text-muted'}`}>📅 Randevu</button>
                        <button onClick={() => setMode('block')} className={`flex-1 py-3 rounded-lg text-xs font-bold transition-all ${mode === 'block' ? 'bg-white text-charcoal shadow-sm' : 'text-muted'}`}>🔒 Blok</button>
                    </div>
                </div>
                <div className="px-6 pb-6 sm:pb-8">
                    <AnimatePresence mode="wait">
                        {mode === 'appt' ? (
                            <motion.div key="a" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Müşteri Adı</label>
                                    <input value={name} onChange={e => setName(e.target.value)} autoComplete="name"
                                        className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-base text-charcoal focus:border-brass focus:ring-1 focus:ring-brass/20 outline-none" placeholder="Ad Soyad" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Telefon</label>
                                    <input value={phone} onChange={e => setPhone(e.target.value)} type="tel" inputMode="tel" autoComplete="tel"
                                        className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-base text-charcoal focus:border-brass focus:ring-1 focus:ring-brass/20 outline-none" placeholder="05XX XXX XX XX" />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Hizmet</label>
                                    <div className="space-y-2">
                                        {SERVICES.map(s => (
                                            <button key={s.id} onClick={() => setSvcId(s.id)}
                                                className={`w-full flex items-center justify-between p-3.5 rounded-xl text-sm border transition-all text-left active:scale-[0.98] ${svcId === s.id ? 'border-brass bg-brass/5 text-brass-dark font-medium' : 'border-border bg-white text-body hover:border-brass/30'
                                                    }`}>
                                                <span>{s.name}</span><span className="text-xs text-muted">{s.duration} dk · ₺{s.price}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <button disabled={!name || !phone} onClick={() => onAppt({ name, phone, serviceId: svcId })}
                                    className={`w-full py-4 rounded-xl font-bold text-sm transition-all active:scale-[0.97] ${name && phone ? 'gradient-brass text-white brass-glow' : 'bg-surface text-muted cursor-not-allowed'}`}>
                                    Randevu Oluştur
                                </button>
                            </motion.div>
                        ) : (
                            <motion.div key="b" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Sebep</label>
                                    <div className="flex flex-wrap gap-2">
                                        {REASONS.map(r => (
                                            <button key={r} onClick={() => setReason(r)}
                                                className={`px-4 py-2.5 rounded-lg text-xs font-medium border transition-all active:scale-95 ${reason === r ? 'border-brass bg-brass/10 text-brass-dark' : 'border-border text-body'}`}>{r}</button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-muted mb-1.5">Bitiş Saati</label>
                                    <input type="time" value={end} onChange={e => setEnd(e.target.value)}
                                        className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-base text-charcoal focus:border-brass outline-none" />
                                </div>
                                <button onClick={() => onBlock(reason, end)}
                                    className="w-full py-4 rounded-xl gradient-brass text-white font-bold text-sm brass-glow active:scale-[0.97] transition-all">Saati Blokla</button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </motion.div>
    );
}

/* ═══════════ MOBILE VERTICAL TIMELINE ═══════════ */
function MobileTimeline({ date, appointments, blocks, onAction, onDelete, onQuickAdd, onViewDetail }: {
    date: Date; appointments: Appointment[]; blocks: ManualBlock[];
    onAction: (id: string, a: string) => void; onDelete: (id: string) => void;
    onQuickAdd: (date: string, time: string) => void;
    onViewDetail: (appt: Appointment) => void;
}) {
    const ds = dateToStr(date);
    const dayAppts = appointments.filter(a => a.date === ds);
    const dayBlocks = blocks.filter(b => b.date === ds);

    const timeline: { hour: number; items: Array<{ type: 'appt'; data: Appointment } | { type: 'block'; data: ManualBlock }> }[] = [];
    for (const h of HOURS) {
        const items: typeof timeline[0]['items'] = [];
        dayBlocks.filter(b => Math.floor(timeToMinutes(b.startTime) / 60) === h).forEach(b => items.push({ type: 'block', data: b }));
        dayAppts.filter(a => Math.floor(timeToMinutes(a.startTime) / 60) === h).forEach(a => items.push({ type: 'appt', data: a }));
        timeline.push({ hour: h, items });
    }

    const now = new Date();
    const nowH = now.getHours();

    return (
        <div className="space-y-0">
            {timeline.map(({ hour, items }) => {
                const isPast = hour < nowH && isSameDay(date, now);
                const isCurrent = hour === nowH && isSameDay(date, now);
                return (
                    <div key={hour} className={`relative ${isPast ? 'opacity-50' : ''}`}>
                        <div className="flex items-center gap-3 py-1">
                            <span className={`text-sm font-semibold tabular-nums w-14 text-right shrink-0 ${isCurrent ? 'text-red-500' : 'text-muted'}`}>
                                {hour.toString().padStart(2, '0')}:00
                            </span>
                            <div className={`flex-1 h-px ${isCurrent ? 'bg-red-400' : 'bg-border'}`} />
                            {isCurrent && <div className="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />}
                        </div>

                        <div className="ml-[68px] space-y-2 pb-2">
                            {items.map(item => {
                                if (item.type === 'block') {
                                    const b = item.data;
                                    return (
                                        <div key={b.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-dashed border-slate-200">
                                            <div>
                                                <p className="text-sm font-medium text-slate-500">🔒 {b.reason}</p>
                                                <p className="text-xs text-slate-400 mt-0.5">{b.startTime} – {b.endTime}</p>
                                            </div>
                                            <button onClick={() => onDelete(b.id)} className="text-xs text-red-400 font-semibold px-3 py-2 rounded-lg active:bg-red-50">Kaldır</button>
                                        </div>
                                    );
                                }
                                const a = item.data;
                                const svc = getServiceById(a.serviceId);
                                const p = STATUS_P[a.status];
                                return (
                                    <motion.div key={a.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: a.status === 'cancelled' ? 0.5 : 1, y: 0 }}
                                        onClick={() => onViewDetail(a)}
                                        className={`rounded-2xl border ${p.bg} ${p.border} overflow-hidden cursor-pointer active:scale-[0.98] transition-transform`}>
                                        <div className="p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <div className={`w-2 h-2 rounded-full shrink-0 ${p.accent}`} />
                                                        <p className={`font-bold text-sm truncate ${p.text}`}>{a.customerName}</p>
                                                    </div>
                                                    <p className="text-xs text-body ml-4">{svc?.name} · {a.startTime}–{a.endTime}</p>
                                                    <p className="text-xs text-muted ml-4 mt-0.5">📱 {a.customerPhone}</p>
                                                </div>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${p.badge}`}>{p.label}</span>
                                                    {/* Chevron indicating it's tappable */}
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-muted/50">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}

                            {items.length === 0 && !isPast && (
                                <button onClick={() => onQuickAdd(ds, `${hour.toString().padStart(2, '0')}:00`)}
                                    className="w-full py-3 rounded-xl border-2 border-dashed border-brass/15 text-brass/40 text-xs font-semibold hover:bg-brass/[0.03] active:scale-[0.98] transition-all">
                                    + Randevu / Blok Ekle
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

/* ═══════════ MAIN CALENDAR PAGE ═══════════ */
export default function CalendarPage() {
    const { addToast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [blocks, setBlocks] = useState<ManualBlock[]>([]);
    const [tooltip, setTooltip] = useState<{ appt: Appointment; x: number; y: number } | null>(null);
    const [quickAdd, setQuickAdd] = useState<{ date: string; time: string } | null>(null);
    const [selectedAppt, setSelectedAppt] = useState<Appointment | null>(null);
    const [pickerOpen, setPickerOpen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const weekDays = getWeekDays(currentDate);
    const displayDays = viewMode === 'week' ? weekDays : [currentDate];
    const today = new Date();

    const refresh = useCallback(async () => {
        const appts = await fetchAppointments();
        setAppointments(appts.filter(a => a.status !== 'cancelled'));
        const blks = await fetchBlocks();
        setBlocks(blks);
    }, []);

    useEffect(() => { setMounted(true); }, []);
    useEffect(() => { if (mounted) refresh(); }, [mounted, refresh]);
    useEffect(() => {
        if (mounted && scrollRef.current) {
            const nm = today.getHours() * 60 + today.getMinutes();
            scrollRef.current.scrollTop = Math.max(0, ((nm - START_H * 60) / 60) * HOUR_H - 150);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mounted]);

    const nav = (dir: number) => { const d = new Date(currentDate); d.setDate(d.getDate() + (viewMode === 'week' ? dir * 7 : dir)); setCurrentDate(d); };

    const act = async (id: string, action: string) => {
        const a = appointments.find(x => x.id === id); if (!a) return;

        // Optimistic Update: Update UI immediately
        let newStatus: Appointment['status'] = 'pending';
        let msg = '';
        switch (action) {
            case 'confirm': newStatus = 'confirmed'; msg = `📱 Onay SMS'i → ${a.customerPhone}`; break;
            case 'cancel': newStatus = 'cancelled'; msg = `📱 İptal → ${a.customerPhone}`; break;
            case 'complete': newStatus = 'completed'; msg = `✅ Tamamlandı: ${a.customerName}`; break;
        }

        // Update local state instantly
        setAppointments(prev => prev.map(app => app.id === id ? { ...app, status: newStatus } : app));
        setTooltip(null);
        addToast(msg, action === 'complete' ? 'success' : 'sms', 2000);

        // Perform API call in background
        await updateApptStatusApi(id, newStatus);

        // Refresh to ensure sync (optional but good practice)
        refresh();
    };

    const qAppt = async (d: { name: string; phone: string; serviceId: string }) => {
        if (!quickAdd) return;
        const s = SERVICES.find(x => x.id === d.serviceId); if (!s) return;

        // Optimistic add could be complex, keeping strict for creation
        await createAppointment({
            customerName: d.name,
            customerPhone: d.phone,
            serviceId: d.serviceId,
            date: quickAdd.date,
            startTime: quickAdd.time,
            endTime: addMinutesToTime(quickAdd.time, s.duration)
        });

        addToast(`📅 ${d.name} — ${quickAdd.time}`, 'success');
        setQuickAdd(null); refresh();
    };
    const qBlock = async (reason: string, end: string) => {
        if (!quickAdd) return;
        await createBlock({
            date: quickAdd.date,
            startTime: quickAdd.time,
            endTime: end,
            reason
        });
        addToast(`🔒 ${reason}: ${quickAdd.time}–${end}`, 'info');
        setQuickAdd(null); refresh();
    };
    const delBlock = async (id: string) => {
        setBlocks(prev => prev.filter(b => b.id !== id)); // Optimistic delete
        await deleteBlock(id);
        addToast('Blok kaldırıldı', 'success');
        refresh();
    };
    if (!mounted) return null;

    return (
        <div className="space-y-4 sm:space-y-5">
            {/* ─── HEADER ─── */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-charcoal leading-none">Takvim</h1>
                        <p className="text-xs text-muted mt-1">
                            {viewMode === 'week' ? `${formatShortDate(weekDays[0])} — ${formatShortDate(weekDays[6])}` : currentDate.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={refresh} className="w-10 h-10 rounded-xl bg-surface flex items-center justify-center text-muted hover:text-charcoal active:scale-95 transition-all" title="Yenile">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                        </button>
                        <div className="flex rounded-xl bg-surface p-1 shadow-inner">
                            {([['week', 'Hafta'], ['day', 'Gün']] as const).map(([k, l]) => (
                                <button key={k} onClick={() => setViewMode(k)}
                                    className={`px-4 sm:px-5 py-2 rounded-lg text-xs font-bold transition-all active:scale-95 ${viewMode === k ? 'bg-white text-charcoal shadow-sm' : 'text-muted hover:text-body'
                                        }`}>{l}</button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <MiniPicker date={currentDate} onSelect={setCurrentDate} open={pickerOpen} toggle={() => setPickerOpen(p => !p)} />
                    <div className="flex items-center gap-1">
                        <button onClick={() => nav(-1)} className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl bg-white border border-border flex items-center justify-center text-body hover:text-charcoal active:scale-90 transition-all shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" /></svg>
                        </button>
                        <button onClick={() => setCurrentDate(new Date())} className="px-3 sm:px-4 h-10 sm:h-9 rounded-xl bg-white border border-border text-xs font-bold text-brass hover:bg-brass/5 active:scale-95 transition-all shadow-sm">Bugün</button>
                        <button onClick={() => nav(1)} className="w-10 h-10 sm:w-9 sm:h-9 rounded-xl bg-white border border-border flex items-center justify-center text-body hover:text-charcoal active:scale-90 transition-all shadow-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" /></svg>
                        </button>
                    </div>
                </div>

                {/* Mobile: horizontal day selector for week view */}
                {viewMode === 'week' && (
                    <div className="flex gap-1.5 sm:hidden overflow-x-auto -mx-1 px-1 snap-carousel !px-0 !gap-1.5">
                        {weekDays.map(day => {
                            const sel = isSameDay(day, currentDate);
                            const td = isSameDay(day, today);
                            // Count appointments for this day
                            const dayApptCount = appointments.filter(a => a.date === dateToStr(day)).length;
                            return (
                                <button key={day.toISOString()} onClick={() => setCurrentDate(day)}
                                    className={`flex-shrink-0 w-12 py-2.5 rounded-xl text-center transition-all active:scale-90 relative ${sel ? 'gradient-brass text-white shadow-sm' : td ? 'bg-white border border-brass/30 text-brass' : 'bg-white border border-border text-charcoal'
                                        }`}>
                                    <p className="text-[9px] uppercase font-semibold tracking-wider">{formatDayName(day).slice(0, 3)}</p>
                                    <p className="text-sm font-bold mt-0.5">{day.getDate()}</p>
                                    {/* Dot indicator for days with appointments */}
                                    {dayApptCount > 0 && (
                                        <div className={`absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center ${sel ? 'bg-white text-brass' : 'bg-brass text-white'}`}>
                                            {dayApptCount}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </motion.div>

            {/* ─── MOBILE: VERTICAL TIMELINE ─── */}
            <div className="sm:hidden">
                <MobileTimeline
                    date={currentDate} appointments={appointments} blocks={blocks}
                    onAction={act} onDelete={delBlock}
                    onQuickAdd={(d, t) => setQuickAdd({ date: d, time: t })}
                    onViewDetail={(appt) => setSelectedAppt(appt)}
                />
                {/* Legend */}
                <div className="flex items-center gap-4 text-[11px] text-muted mt-4 px-1 flex-wrap">
                    {[{ c: 'bg-amber-400', l: 'Bekleyen' }, { c: 'bg-emerald-400', l: 'Onaylı' }, { c: 'bg-blue-400', l: 'Tamamlanan' }].map(x => (
                        <div key={x.l} className="flex items-center gap-1.5"><div className={`w-2 h-2 rounded-full ${x.c}`} /><span>{x.l}</span></div>
                    ))}
                </div>
            </div>

            {/* ─── DESKTOP: TIME GRID ─── */}
            <div className="hidden sm:block rounded-2xl border border-border bg-white overflow-hidden shadow-sm">
                {/* Day Headers */}
                <div className="grid border-b border-border" style={{ gridTemplateColumns: `60px repeat(${displayDays.length}, 1fr)` }}>
                    <div className="p-3 border-r border-border bg-surface/40" />
                    {displayDays.map(day => {
                        const isToday = isSameDay(day, today);
                        const dayApptCount = appointments.filter(a => a.date === dateToStr(day)).length;
                        return (
                            <div key={day.toISOString()} className={`py-4 px-2 text-center border-r border-border last:border-r-0 ${isToday ? 'bg-brass/[0.04]' : 'bg-surface/40'}`}>
                                <p className={`text-[10px] uppercase tracking-[0.15em] font-semibold ${isToday ? 'text-brass' : 'text-muted'}`}>{formatDayName(day)}</p>
                                <p className={`text-xl font-bold mt-1 leading-none ${isToday ? 'text-brass' : 'text-charcoal'}`}>{day.getDate()}</p>
                                {isToday && <div className="w-5 h-0.5 rounded-full bg-brass mx-auto mt-2" />}
                                {dayApptCount > 0 && (
                                    <div className="mt-1.5">
                                        <span className="text-[10px] font-semibold text-brass bg-brass/10 px-2 py-0.5 rounded-full">{dayApptCount} randevu</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                {/* Scrollable Grid */}
                <div ref={scrollRef} className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 240px)' }}>
                    <div className="relative grid" style={{ gridTemplateColumns: `60px repeat(${displayDays.length}, 1fr)` }}>
                        <div className="relative bg-surface/20" style={{ height: TOTAL_H * HOUR_H }}>
                            {HOURS.map(h => (
                                <div key={h} className="absolute left-0 right-0 flex items-start justify-end pr-3" style={{ top: (h - START_H) * HOUR_H - 6 }}>
                                    <span className="text-[11px] font-medium text-muted tabular-nums">{h.toString().padStart(2, '0')}:00</span>
                                </div>
                            ))}
                        </div>
                        {displayDays.map(day => {
                            const ds = dateToStr(day);
                            const dA = appointments.filter(a => a.date === ds);
                            const dB = blocks.filter(b => b.date === ds);
                            const isToday = isSameDay(day, today);
                            return (
                                <div key={ds} className={`relative border-r border-border last:border-r-0 ${isToday ? 'bg-brass/[0.015]' : ''}`} style={{ height: TOTAL_H * HOUR_H }}>
                                    {HOURS.map(h => (
                                        <div key={h}>
                                            <div className="absolute left-0 right-0 border-t border-slate-200/80" style={{ top: (h - START_H) * HOUR_H }} />
                                            <div className="absolute left-3 right-3" style={{ top: (h - START_H) * HOUR_H + HOUR_H / 2 }}><div className="border-t border-dashed border-slate-100" /></div>
                                        </div>
                                    ))}
                                    {isToday && <LiveLine />}
                                    {HOURS.map(h => (
                                        <div key={`s-${h}`}>
                                            <button onClick={() => setQuickAdd({ date: ds, time: `${h.toString().padStart(2, '0')}:00` })}
                                                className="absolute left-0 right-0 z-[1] group cursor-pointer" style={{ top: (h - START_H) * HOUR_H, height: HOUR_H / 2 }}>
                                                <div className="h-full mx-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all border-2 border-dashed border-brass/20 bg-brass/[0.03] flex items-center justify-center">
                                                    <span className="text-[10px] text-brass/50 font-semibold">+ Ekle</span></div>
                                            </button>
                                            <button onClick={() => setQuickAdd({ date: ds, time: `${h.toString().padStart(2, '0')}:30` })}
                                                className="absolute left-0 right-0 z-[1] group cursor-pointer" style={{ top: (h - START_H) * HOUR_H + HOUR_H / 2, height: HOUR_H / 2 }}>
                                                <div className="h-full mx-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all border-2 border-dashed border-brass/20 bg-brass/[0.03] flex items-center justify-center">
                                                    <span className="text-[10px] text-brass/50 font-semibold">+ Ekle</span></div>
                                            </button>
                                        </div>
                                    ))}
                                    {dB.map(b => {
                                        const t = ((timeToMinutes(b.startTime) - START_H * 60) / 60) * HOUR_H;
                                        const hh = ((timeToMinutes(b.endTime) - timeToMinutes(b.startTime)) / 60) * HOUR_H;
                                        return (
                                            <div key={b.id} className="absolute left-1.5 right-1.5 z-10 group" style={{ top: t + 1, height: Math.max(hh - 2, 24) }}>
                                                <div className="h-full rounded-xl bg-slate-50 border border-slate-200 border-dashed px-3 py-2 flex flex-col justify-between overflow-hidden">
                                                    <div><p className="text-[11px] font-semibold text-slate-500 truncate">🔒 {b.reason}</p>{hh > 36 && <p className="text-[10px] text-slate-400 mt-0.5">{b.startTime}–{b.endTime}</p>}</div>
                                                    <button onClick={() => delBlock(b.id)} className="text-[10px] text-red-400 hover:text-red-500 font-semibold opacity-0 group-hover:opacity-100 transition-opacity self-end">Kaldır</button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {dA.map(a => {
                                        const t = ((timeToMinutes(a.startTime) - START_H * 60) / 60) * HOUR_H;
                                        const dm = timeToMinutes(a.endTime) - timeToMinutes(a.startTime);
                                        const hh = (dm / 60) * HOUR_H;
                                        const svc = getServiceById(a.serviceId);
                                        const ph4 = a.customerPhone.slice(-4);
                                        const p = STATUS_P[a.status];
                                        return (
                                            <motion.div key={a.id} layout initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: a.status === 'cancelled' ? 0.5 : 1, scale: 1 }}
                                                className={`absolute left-1.5 right-1.5 z-10 rounded-xl border ${p.bg} ${p.border} cursor-pointer group transition-shadow hover:shadow-lg`}
                                                style={{ top: t + 1, height: Math.max(hh - 2, 30) }}
                                                onClick={() => setSelectedAppt(a)}
                                                onMouseEnter={e => setTooltip({ appt: a, x: e.clientX, y: e.clientY })}
                                                onMouseMove={e => setTooltip({ appt: a, x: e.clientX, y: e.clientY })}
                                                onMouseLeave={() => setTooltip(null)}>
                                                <div className={`absolute top-1.5 bottom-1.5 left-0 w-[3px] rounded-full ${p.accent}`} />
                                                <div className="pl-3 pr-2 py-1.5 h-full flex flex-col justify-between overflow-hidden">
                                                    <div>
                                                        <p className={`text-xs font-bold truncate ${p.text}`}>{a.customerName}</p>
                                                        {hh > 38 && <p className="text-[10px] text-body/70 truncate mt-0.5">{svc?.name}{ph4 ? ` · ···${ph4}` : ''}</p>}
                                                        {hh > 58 && <p className="text-[10px] text-muted mt-0.5">{a.startTime}–{a.endTime}</p>}
                                                    </div>
                                                    {(a.status === 'pending' || a.status === 'confirmed') && hh > 50 && (
                                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all mt-1">
                                                            {a.status === 'pending' && <button onClick={e => { e.stopPropagation(); act(a.id, 'confirm'); }} className="text-[10px] font-bold text-emerald-600 bg-emerald-100 hover:bg-emerald-200 px-2 py-0.5 rounded-md">✓ Onayla</button>}
                                                            {a.status === 'confirmed' && <button onClick={e => { e.stopPropagation(); act(a.id, 'complete'); }} className="text-[10px] font-bold text-blue-600 bg-blue-100 hover:bg-blue-200 px-2 py-0.5 rounded-md">✔ Bitti</button>}
                                                            <button onClick={e => { e.stopPropagation(); act(a.id, 'cancel'); }} className="text-[10px] font-bold text-red-500 bg-red-50 hover:bg-red-100 px-2 py-0.5 rounded-md">✗</button>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Desktop Legend */}
            <div className="hidden sm:flex items-center gap-6 text-[11px] text-muted px-1">
                {[{ c: 'bg-amber-400', l: 'Bekleyen' }, { c: 'bg-emerald-400', l: 'Onaylı' }, { c: 'bg-blue-400', l: 'Tamamlanan' }, { c: 'bg-gray-300', l: 'İptal' }].map(x => (
                    <div key={x.l} className="flex items-center gap-1.5"><div className={`w-2.5 h-2.5 rounded-full ${x.c}`} /><span>{x.l}</span></div>
                ))}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {tooltip && !selectedAppt && (
                    <motion.div initial={{ opacity: 0, scale: 0.92, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="fixed z-[100] bg-white border border-border rounded-2xl shadow-2xl w-[260px] overflow-hidden hidden md:block pointer-events-none"
                        style={{ left: Math.min(tooltip.x + 12, (typeof window !== 'undefined' ? window.innerWidth : 1200) - 280), top: Math.max(tooltip.y - 140, 10) }}>
                        <div className={`px-4 py-2 ${STATUS_P[tooltip.appt.status].badge} text-[10px] font-bold uppercase tracking-wider`}>{STATUS_P[tooltip.appt.status].label}</div>
                        <div className="p-4 space-y-3">
                            <div><p className="font-bold text-charcoal">{tooltip.appt.customerName}</p><p className="text-xs text-muted mt-0.5">📱 {tooltip.appt.customerPhone}</p></div>
                            <div className="h-px bg-border" />
                            <div className="flex items-center justify-between text-xs"><span className="text-body">✂️ {getServiceById(tooltip.appt.serviceId)?.name || '—'}</span><span className="text-muted">{timeToMinutes(tooltip.appt.endTime) - timeToMinutes(tooltip.appt.startTime)} dk</span></div>
                            <div className="text-xs text-body">⏰ {tooltip.appt.startTime} – {tooltip.appt.endTime}</div>
                            <div className="text-[10px] text-brass font-medium">Detay için tıklayın →</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AnimatePresence>{quickAdd && <QuickAdd date={quickAdd.date} time={quickAdd.time} onClose={() => setQuickAdd(null)} onAppt={qAppt} onBlock={qBlock} />}</AnimatePresence>
            <AnimatePresence>{selectedAppt && <AppointmentDetail appt={selectedAppt} onClose={() => setSelectedAppt(null)} onAction={act} />}</AnimatePresence>
        </div>
    );
}
