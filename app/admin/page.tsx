"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getTodayAppointments, getServiceById, formatDate, Appointment } from '@/lib/store';
import { fetchAppointments } from '@/lib/api';

export default function AdminDashboard() {
    const [mounted, setMounted] = useState(false);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [todayAppts, setTodayAppts] = useState<Appointment[]>([]);

    useEffect(() => {
        setMounted(true);
        loadData();
    }, []);

    const loadData = async () => {
        const data = await fetchAppointments();
        setAppointments(data);
        // Filter today's appointments from the fetched data
        const today = new Date().toISOString().split('T')[0];
        setTodayAppts(data.filter(a => a.date === today));
    };

    if (!mounted) return null;

    const stats = [
        { label: 'Toplam Randevu', value: appointments.length, icon: '📅', color: 'bg-blue-50 text-blue-600' },
        { label: 'Bekleyen', value: appointments.filter(a => a.status === 'pending').length, icon: '⏳', color: 'bg-amber-50 text-amber-600' },
        { label: 'Onaylanmış', value: appointments.filter(a => a.status === 'confirmed').length, icon: '✅', color: 'bg-emerald-50 text-emerald-600' },
        { label: 'Bugün', value: todayAppts.length, icon: '📊', color: 'bg-purple-50 text-purple-600' },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-2xl sm:text-3xl font-bold text-charcoal">Dashboard</h1>
                <p className="text-sm text-body mt-1">{new Date().toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                        className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                        <div className={`w-10 h-10 rounded-xl ${stat.color} flex items-center justify-center text-lg mb-4`}>{stat.icon}</div>
                        <p className="text-3xl font-bold text-charcoal">{stat.value}</p>
                        <p className="text-xs text-muted mt-1">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Today Timeline */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-charcoal mb-6">Bugünün Randevuları</h2>
                {todayAppts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-4xl mb-4">📋</p>
                        <p className="text-body text-sm">Bugün için randevu bulunmuyor.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {todayAppts.sort((a, b) => a.startTime.localeCompare(b.startTime)).map(appt => {
                            const service = getServiceById(appt.serviceId);
                            const statusColors: Record<string, string> = {
                                pending: 'bg-amber-50 text-amber-700 border-amber-200',
                                confirmed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                                cancelled: 'bg-red-50 text-red-600 border-red-200',
                                completed: 'bg-blue-50 text-blue-600 border-blue-200',
                            };
                            const statusLabels: Record<string, string> = { pending: 'Bekliyor', confirmed: 'Onaylandı', cancelled: 'İptal', completed: 'Tamamlandı' };
                            return (
                                <div key={appt.id} className="flex items-center gap-4 p-4 rounded-xl bg-surface border border-border-light">
                                    <div className="text-center shrink-0">
                                        <p className="text-lg font-bold text-charcoal">{appt.startTime}</p>
                                        <p className="text-[10px] text-muted">{appt.endTime}</p>
                                    </div>
                                    <div className="w-px h-10 bg-border" />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-charcoal text-sm truncate">{appt.customerName}</p>
                                        <p className="text-xs text-muted truncate">{service?.name}</p>
                                    </div>
                                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full border ${statusColors[appt.status]}`}>
                                        {statusLabels[appt.status]}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </motion.div>

            {/* Recent */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-charcoal mb-6">Son Randevular</h2>
                <div className="space-y-3">
                    {appointments.slice(-5).reverse().map(appt => {
                        const service = getServiceById(appt.serviceId);
                        return (
                            <div key={appt.id} className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border-light">
                                <div>
                                    <p className="font-semibold text-charcoal text-sm">{appt.customerName}</p>
                                    <p className="text-xs text-muted">{service?.name} — {formatDate(appt.date)}</p>
                                </div>
                                <p className="text-sm font-bold text-brass">{appt.startTime}</p>
                            </div>
                        );
                    })}
                    {appointments.length === 0 && <p className="text-sm text-muted text-center py-8">Henüz randevu bulunmuyor.</p>}
                </div>
            </motion.div>
        </div>
    );
}
