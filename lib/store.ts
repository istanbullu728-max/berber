// =====================================================
// APPOINTMENT STORE - Professional LocalStorage Manager
// =====================================================

export interface Service {
    id: string;
    name: string;
    price: number;
    duration: number;
}

export interface Appointment {
    id: string;
    customerName: string;
    customerPhone: string;
    serviceId: string;
    date: string;       // YYYY-MM-DD
    startTime: string;  // HH:mm
    endTime: string;    // HH:mm
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    createdAt: string;
}

export interface ManualBlock {
    id: string;
    date: string;       // YYYY-MM-DD
    startTime: string;  // HH:mm
    endTime: string;    // HH:mm
    reason: string;     // "Öğle Molası", "Dükkan Kapalı", etc.
}

export interface WorkingHours {
    dayOfWeek: number;  // 0=Pazar, 1=Pazartesi ...
    startTime: string;
    endTime: string;
    isDayOff: boolean;
}

export interface Settings {
    shopName: string;
    smsHeader: string;
    workingHours: WorkingHours[];
}

// =================== SERVICES ===================
export const SERVICES: Service[] = [
    { id: '1', name: 'Modern Saç Kesimi', price: 450, duration: 45 },
    { id: '2', name: 'Sakal Tasarımı', price: 300, duration: 20 },
    { id: '3', name: 'Saç & Sakal Kombini', price: 700, duration: 60 },
    { id: '4', name: 'Cilt Bakımı', price: 600, duration: 45 },
    { id: '5', name: 'Saç Boyama', price: 1200, duration: 90 },
];

// =================== STORAGE KEYS ===================
const APPOINTMENTS_KEY = 'barber_appointments';
const SETTINGS_KEY = 'barber_settings';
const BLOCKS_KEY = 'barber_blocks';

// =================== DEFAULT SETTINGS ===================
const DEFAULT_SETTINGS: Settings = {
    shopName: 'Randevum Barber',
    smsHeader: 'RNDVMBRBR',
    workingHours: [
        { dayOfWeek: 0, startTime: '00:00', endTime: '00:00', isDayOff: true },
        { dayOfWeek: 1, startTime: '09:00', endTime: '21:00', isDayOff: false },
        { dayOfWeek: 2, startTime: '09:00', endTime: '21:00', isDayOff: false },
        { dayOfWeek: 3, startTime: '09:00', endTime: '21:00', isDayOff: false },
        { dayOfWeek: 4, startTime: '09:00', endTime: '21:00', isDayOff: false },
        { dayOfWeek: 5, startTime: '09:00', endTime: '21:00', isDayOff: false },
        { dayOfWeek: 6, startTime: '09:00', endTime: '20:00', isDayOff: false },
    ],
};

// =================== APPOINTMENTS CRUD ===================
export function getAppointments(): Appointment[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(APPOINTMENTS_KEY);
    return stored ? JSON.parse(stored) : [];
}

export function getAppointmentsByDate(date: string): Appointment[] {
    return getAppointments().filter(a => a.date === date && a.status !== 'cancelled');
}

export function getTodayAppointments(): Appointment[] {
    const today = new Date().toISOString().split('T')[0];
    return getAppointments().filter(a => a.date === today);
}

export function saveAppointment(appointment: Appointment): void {
    const appointments = getAppointments();
    appointments.push(appointment);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
}

export function updateAppointmentStatus(id: string, status: Appointment['status']): Appointment | null {
    const appointments = getAppointments();
    const idx = appointments.findIndex(a => a.id === id);
    if (idx === -1) return null;
    appointments[idx].status = status;
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
    return appointments[idx];
}

export function deleteAppointment(id: string): void {
    const appointments = getAppointments().filter(a => a.id !== id);
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
}

// =================== MANUAL BLOCKS ===================
export function getBlocks(): ManualBlock[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(BLOCKS_KEY);
    return stored ? JSON.parse(stored) : [];
}

export function getBlocksByDate(date: string): ManualBlock[] {
    return getBlocks().filter(b => b.date === date);
}

export function saveBlock(block: ManualBlock): void {
    const blocks = getBlocks();
    blocks.push(block);
    localStorage.setItem(BLOCKS_KEY, JSON.stringify(blocks));
}

export function deleteBlock(id: string): void {
    const blocks = getBlocks().filter(b => b.id !== id);
    localStorage.setItem(BLOCKS_KEY, JSON.stringify(blocks));
}

// =================== CONFLICT DETECTION ===================
export function isSlotAvailable(date: string, startTime: string, duration: number): boolean {
    const appointments = getAppointments().filter(
        a => a.date === date && (a.status === 'pending' || a.status === 'confirmed')
    );
    const blocks = getBlocksByDate(date);

    const newStart = timeToMinutes(startTime);
    const newEnd = newStart + duration;

    for (const appt of appointments) {
        const apptStart = timeToMinutes(appt.startTime);
        const apptEnd = timeToMinutes(appt.endTime);
        if (newStart < apptEnd && newEnd > apptStart) return false;
    }
    for (const block of blocks) {
        const bStart = timeToMinutes(block.startTime);
        const bEnd = timeToMinutes(block.endTime);
        if (newStart < bEnd && newEnd > bStart) return false;
    }
    return true;
}

export function getBookedSlots(date: string): { startTime: string; endTime: string }[] {
    return getAppointments()
        .filter(a => a.date === date && (a.status === 'confirmed' || a.status === 'pending'))
        .map(a => ({ startTime: a.startTime, endTime: a.endTime }));
}

export function isTimeSlotBooked(date: string, time: string, duration: number): boolean {
    return !isSlotAvailable(date, time, duration);
}

// =================== SETTINGS ===================
export function getSettings(): Settings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
}

export function saveSettings(settings: Settings): void {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

// =================== DATE HELPERS ===================
export function getWeekDays(referenceDate: Date): Date[] {
    const d = new Date(referenceDate);
    const day = d.getDay();
    const monday = new Date(d);
    monday.setDate(d.getDate() - ((day + 6) % 7));
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
        const wd = new Date(monday);
        wd.setDate(monday.getDate() + i);
        week.push(wd);
    }
    return week;
}

export function getMonthDays(year: number, month: number): (Date | null)[] {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = (firstDay.getDay() + 6) % 7; // Monday=0
    const days: (Date | null)[] = [];
    for (let i = 0; i < startPad; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
    return days;
}

export function dateToStr(d: Date): string {
    return d.toISOString().split('T')[0];
}

export function isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function formatShortDate(d: Date): string {
    return d.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' });
}

export function formatDayName(d: Date): string {
    return d.toLocaleDateString('tr-TR', { weekday: 'short' });
}

export function getAvailableSlotsForDate(date: string, serviceDuration: number): string[] {
    const settings = getSettings();
    const d = new Date(date + 'T00:00:00');
    const dayOfWeek = d.getDay();
    const wh = settings.workingHours.find(w => w.dayOfWeek === dayOfWeek);
    if (!wh || wh.isDayOff) return [];

    const startMin = timeToMinutes(wh.startTime);
    const endMin = timeToMinutes(wh.endTime);
    const slots: string[] = [];
    for (let m = startMin; m + serviceDuration <= endMin; m += 30) {
        const t = minutesToTime(m);
        if (isSlotAvailable(date, t, serviceDuration)) slots.push(t);
    }
    return slots;
}

// =================== TIME HELPERS ===================
export function timeToMinutes(time: string): number {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
}

export function minutesToTime(minutes: number): string {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
}

export function addMinutesToTime(time: string, minutes: number): string {
    return minutesToTime(timeToMinutes(time) + minutes);
}

export function getServiceById(id: string): Service | undefined {
    return SERVICES.find(s => s.id === id);
}

export function formatDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
}

export function generateTimeSlots(startHour: number, endHour: number, intervalMinutes: number = 30): string[] {
    const slots: string[] = [];
    for (let m = startHour * 60; m < endHour * 60; m += intervalMinutes) {
        slots.push(minutesToTime(m));
    }
    return slots;
}
