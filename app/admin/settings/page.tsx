"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/Toast';
import { getSettings, saveSettings, Settings } from '@/lib/store';

const DAYS = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];

export default function SettingsPage() {
    const { addToast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [settings, setSettings] = useState<Settings | null>(null);

    useEffect(() => { setMounted(true); setSettings(getSettings()); }, []);

    const handleSave = () => {
        if (!settings) return;
        saveSettings(settings);
        addToast('✅ Ayarlar kaydedildi', 'success');
    };

    if (!mounted || !settings) return null;

    return (
        <div className="space-y-6 sm:space-y-8 max-w-3xl">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-xl sm:text-2xl font-bold text-charcoal">Ayarlar</h1>
                <p className="text-sm text-body mt-1">Dükkan bilgilerini ve çalışma saatlerini yönetin</p>
            </motion.div>

            {/* General */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-5 sm:p-8 shadow-sm space-y-5 sm:space-y-6">
                <h2 className="text-lg font-bold text-charcoal">Genel Bilgiler</h2>
                <div className="space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">Dükkan Adı</label>
                        <input type="text" value={settings.shopName}
                            onChange={e => setSettings({ ...settings, shopName: e.target.value })}
                            className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-charcoal text-base focus:border-brass focus:ring-1 focus:ring-brass/20 transition-all outline-none" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-muted mb-2">SMS Başlığı</label>
                        <input type="text" value={settings.smsHeader}
                            onChange={e => setSettings({ ...settings, smsHeader: e.target.value })}
                            className="w-full bg-surface border border-border rounded-xl px-4 py-3.5 text-charcoal text-base focus:border-brass focus:ring-1 focus:ring-brass/20 transition-all outline-none" />
                    </div>
                </div>
            </motion.div>

            {/* Working Hours */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="bg-card border border-border rounded-2xl p-5 sm:p-8 shadow-sm space-y-5 sm:space-y-6">
                <h2 className="text-lg font-bold text-charcoal">Çalışma Saatleri</h2>
                <div className="space-y-4">
                    {settings.workingHours.map((wh, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface border border-border-light transition-all hover:border-border gap-4 sm:gap-0">
                            {/* Header: Day Name & Switch */}
                            <div className="flex items-center justify-between sm:w-32 sm:block">
                                <span className="text-sm font-semibold text-charcoal">{DAYS[wh.dayOfWeek]}</span>
                                <label className="relative inline-flex items-center cursor-pointer sm:hidden">
                                    <input type="checkbox" checked={!wh.isDayOff}
                                        onChange={e => {
                                            const whs = [...settings.workingHours];
                                            whs[idx] = { ...whs[idx], isDayOff: !e.target.checked };
                                            setSettings({ ...settings, workingHours: whs });
                                        }}
                                        className="sr-only peer" />
                                    <div className="w-9 h-5 bg-border rounded-full peer peer-focus:ring-2 peer-focus:ring-brass/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brass"></div>
                                </label>
                            </div>

                            {/* Time Inputs */}
                            <div className="flex-1">
                                {!wh.isDayOff ? (
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <input type="time" value={wh.startTime}
                                            onChange={e => {
                                                const whs = [...settings.workingHours];
                                                whs[idx] = { ...whs[idx], startTime: e.target.value };
                                                setSettings({ ...settings, workingHours: whs });
                                            }}
                                            className="flex-1 min-w-0 bg-white border border-border rounded-lg px-2 sm:px-3 py-2 text-sm text-charcoal focus:border-brass outline-none transition-colors" />
                                        <span className="text-muted text-sm font-medium shrink-0">–</span>
                                        <input type="time" value={wh.endTime}
                                            onChange={e => {
                                                const whs = [...settings.workingHours];
                                                whs[idx] = { ...whs[idx], endTime: e.target.value };
                                                setSettings({ ...settings, workingHours: whs });
                                            }}
                                            className="flex-1 min-w-0 bg-white border border-border rounded-lg px-2 sm:px-3 py-2 text-sm text-charcoal focus:border-brass outline-none transition-colors" />
                                    </div>
                                ) : (
                                    <div className="py-2 px-3 rounded-lg bg-border/30 text-muted text-sm italic font-medium text-center sm:text-left">
                                        Kapalı
                                    </div>
                                )}
                            </div>

                            {/* Desktop Switch */}
                            <label className="relative hidden sm:inline-flex items-center cursor-pointer ml-4">
                                <input type="checkbox" checked={!wh.isDayOff}
                                    onChange={e => {
                                        const whs = [...settings.workingHours];
                                        whs[idx] = { ...whs[idx], isDayOff: !e.target.checked };
                                        setSettings({ ...settings, workingHours: whs });
                                    }}
                                    className="sr-only peer" />
                                <div className="w-11 h-6 bg-border rounded-full peer peer-focus:ring-2 peer-focus:ring-brass/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brass"></div>
                            </label>
                        </div>
                    ))}
                </div>
            </motion.div>

            <motion.button whileTap={{ scale: 0.97 }} onClick={handleSave}
                className="w-full py-4 rounded-xl gradient-brass text-white font-bold text-sm brass-glow active:scale-[0.97] transition-all">
                Kaydet
            </motion.button>
        </div>
    );
}
