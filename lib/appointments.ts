export interface Service {
    id: string;
    name: string;
    price: number;
    duration: number; // in minutes
}

export interface Appointment {
    id: string;
    customerName: string;
    customerPhone: string;
    serviceId: string;
    date: string; // YYYY-MM-DD
    startTime: string; // HH:mm
    endTime: string; // HH:mm
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export const SERVICES: Service[] = [
    { id: '1', name: 'Modern Saç Kesimi', price: 450, duration: 45 },
    { id: '2', name: 'Sakal Tasarımı', price: 300, duration: 30 },
    { id: '3', name: 'Saç & Sakal Kombini', price: 700, duration: 75 },
    { id: '4', name: 'Cilt Bakımı', price: 600, duration: 60 },
    { id: '5', name: 'Saç Boyama', price: 1200, duration: 90 },
];

// Mock database in localStorage
export const getAppointments = (): Appointment[] => {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem('barber_appointments');
    return stored ? JSON.parse(stored) : [];
};

export const saveAppointment = (appointment: Appointment) => {
    const appointments = getAppointments();
    appointments.push(appointment);
    localStorage.setItem('barber_appointments', JSON.stringify(appointments));

    // Trigger "SMS" Logic (simulated)
    console.log(`[SMS] Randevu alındı: ${appointment.customerName} - ${appointment.date} ${appointment.startTime}`);
};

export const isSlotAvailable = (date: string, startTime: string, duration: number): boolean => {
    const appointments = getAppointments().filter(a => a.date === date && a.status !== 'cancelled');

    const newStart = new Date(`${date}T${startTime}`);
    const newEnd = new Date(newStart.getTime() + duration * 60000);

    for (const appt of appointments) {
        const apptStart = new Date(`${appt.date}T${appt.startTime}`);
        const apptEnd = new Date(`${appt.date}T${appt.endTime}`);

        // Check overlap
        if (newStart < apptEnd && newEnd > apptStart) {
            return false;
        }
    }

    return true;
};
