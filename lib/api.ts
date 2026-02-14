import { Appointment, ManualBlock } from './store';

const API_URL = '/api/appointments';
const BLOCKS_API_URL = '/api/blocks';

export async function fetchAppointments(): Promise<Appointment[]> {
    try {
        const res = await fetch(API_URL);
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error('Error fetching appointments:', error);
        return [];
    }
}

export async function createAppointment(data: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Promise<Appointment | null> {
    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error('Error creating appointment:', error);
        return null;
    }
}

export async function updateAppointmentStatus(id: string, status: Appointment['status']): Promise<Appointment | null> {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error('Error updating status:', error);
        return null;
    }
}

export async function deleteAppointment(id: string): Promise<boolean> {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        return res.ok;
    } catch (error) {
        console.error('Error deleting appointment:', error);
        return false;
    }
}

export async function fetchBlocks(): Promise<ManualBlock[]> {
    try {
        const res = await fetch(BLOCKS_API_URL);
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error('Error fetching blocks:', error);
        return [];
    }
}

export async function createBlock(data: Omit<ManualBlock, 'id'>): Promise<ManualBlock | null> {
    try {
        const res = await fetch(BLOCKS_API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.error('Error creating block:', error);
        return null;
    }
}

export async function deleteBlock(id: string): Promise<boolean> {
    try {
        const res = await fetch(`${BLOCKS_API_URL}/${id}`, {
            method: 'DELETE',
        });
        return res.ok;
    } catch (error) {
        console.error('Error deleting block:', error);
        return false;
    }
}

export async function fetchAvailableSlots(date: string, duration: number): Promise<string[]> {
    try {
        const res = await fetch(`/api/availability?date=${date}&duration=${duration}`);
        if (!res.ok) return [];
        return await res.json();
    } catch (error) {
        console.error('Error fetching slots:', error);
        return [];
    }
}
