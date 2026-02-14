"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/Toast';
import { getServiceById, formatDate, Appointment } from '@/lib/store';
import { fetchAppointments, updateAppointmentStatus } from '@/lib/api';

export default function AppointmentsPage() {
    const { addToast } = useToast();
    const [mounted, setMounted] = useState(false);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        setMounted(true);
        loadData();
    }, []);

    const loadData = async () => {
        const data = await fetchAppointments();
        setAppointments(data);
    };

    const handleAction = async (id: string, action: string) => {
        const appt = appointments.find(a => a.id === id);
        if (!appt) return;
        let status: Appointment['status'] = 'pending';
        let msg = '';
        switch (action) {
            case 'confirm': status = 'confirmed'; msg = `📱 Onay SMS'i gönderildi → ${appt.customerPhone}`; break;
            case 'cancel': status = 'cancelled'; msg = `📱 İptal bildirimi gönderildi → ${appt.customerPhone}`; break;
            case 'complete': status = 'completed'; msg = `✅ Tamamlandı: ${appt.customerName}`; break;
        }
        const updated = await updateAppointmentStatus(id, status);
        if (updated) {
            addToast(msg, action === 'complete' ? 'success' : 'sms', 5000);
            loadData();
        }
    };

    const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);
    if (!mounted) return null;

    const tabs = [
        { key: 'all', label: 'Tümü', count: appointments.length },
        { key: 'pending', label: 'Bekleyen', count: appointments.filter(a => a.status === 'pending').length },
        { key: 'confirmed', label: 'Onaylı', count: appointments.filter(a => a.status === 'confirmed').length },
        { key: 'completed', label: 'Tamamlanan', count: appointments.filter(a => a.status === 'completed').length },
    ];

    const statusColors: Record<string, string> = {
        pending: 'bg-amber-50 text-amber-700 border-amber-200',
        confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        cancelled: 'bg-red-50 text-red-600 border-red-200',
        completed: 'bg-blue-50 text-blue-600 border-blue-200',
    };
    const statusLabels: Record<string, string> = { pending: 'Bekliyor', confirmed: 'Onaylandı', cancelled: 'İptal', completed: 'Tamamlandı' };

    return (
        <div className="space-y-5 sm:space-y-6">
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-xl sm:text-2xl font-bold text-charcoal">Randevular</h1>
                <p className="text-sm text-body mt-1">Tüm randevularınızı yönetin</p>
            </motion.div>

            {/* Tabs — horizontal scroll on mobile */}
            <div className="flex gap-2 overflow-x-auto -mx-1 px-1 pb-1 sm:flex-wrap sm:mx-0 sm:px-0">
                {tabs.map(tab => (
                    <button key={tab.key} onClick={() => setFilter(tab.key)}
                        className={`shrink-0 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${filter === tab.key ? 'gradient-brass text-white border-transparent shadow-sm' : 'bg-card text-body border-border hover:text-charcoal'
                            }`}>
                        {tab.label} ({tab.count})
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="space-y-3">
                {filtered.length === 0 && (
                    <div className="text-center py-16 bg-card border border-border rounded-2xl">
                        <p className="text-4xl mb-3">📋</p>
                        <p className="text-body text-sm">Bu filtrede randevu bulunamadı.</p>
                    </div>
                )}
                {filtered.map((appt, i) => {
                    const service = getServiceById(appt.serviceId);
                    return (
                        <motion.div key={appt.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                            className="bg-card border border-border rounded-2xl p-5 sm:p-6 shadow-sm">
                            {/* Mobile: stacked layout, Desktop: row */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-bold text-charcoal text-base">{appt.customerName}</h3>
                                        <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${statusColors[appt.status]}`}>
                                            {statusLabels[appt.status]}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-x-4 sm:gap-x-6 gap-y-1.5 text-xs text-body">
                                        <span>📱 {appt.customerPhone}</span>
                                        <span>✂️ {service?.name}</span>
                                        <span>📅 {formatDate(appt.date)}</span>
                                        <span>⏰ {appt.startTime} – {appt.endTime}</span>
                                    </div>
                                </div>
                                {/* Action buttons — full width on mobile for big touch targets */}
                                <div className="flex gap-2 shrink-0">
                                    {appt.status === 'pending' && (
                                        <button onClick={() => handleAction(appt.id, 'confirm')}
                                            className="flex-1 sm:flex-none px-4 py-3 sm:py-2 rounded-xl sm:rounded-lg bg-emerald-50 text-emerald-700 text-sm sm:text-xs font-bold border border-emerald-200 active:scale-95 sm:hover:bg-emerald-100 transition-all">
                                            Onayla
                                        </button>
                                    )}
                                    {appt.status === 'confirmed' && (
                                        <button onClick={() => handleAction(appt.id, 'complete')}
                                            className="flex-1 sm:flex-none px-4 py-3 sm:py-2 rounded-xl sm:rounded-lg bg-blue-50 text-blue-600 text-sm sm:text-xs font-bold border border-blue-200 active:scale-95 sm:hover:bg-blue-100 transition-all">
                                            Tamamla
                                        </button>
                                    )}
                                    {(appt.status === 'pending' || appt.status === 'confirmed') && (
                                        <button onClick={() => handleAction(appt.id, 'cancel')}
                                            className="flex-1 sm:flex-none px-4 py-3 sm:py-2 rounded-xl sm:rounded-lg bg-red-50 text-red-500 text-sm sm:text-xs font-bold border border-red-200 active:scale-95 sm:hover:bg-red-100 transition-all">
                                            İptal
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
