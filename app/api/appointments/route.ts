import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { Appointment } from '@/lib/store';

export async function GET() {
    try {
        const db = readDB();
        return NextResponse.json(db.appointments);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch appointments' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newAppointment: Appointment = {
            ...body,
            id: Math.random().toString(36).substr(2, 9),
            status: 'pending',
            createdAt: new Date().toISOString(),
        };

        const db = readDB();
        db.appointments.push(newAppointment);
        writeDB(db);

        return NextResponse.json(newAppointment, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
