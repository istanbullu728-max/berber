import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const { id } = params;
        const body = await request.json();
        const db = readDB();

        const idx = db.appointments.findIndex((a: any) => a.id === id);
        if (idx === -1) {
            return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
        }

        db.appointments[idx] = { ...db.appointments[idx], ...body };
        writeDB(db);

        return NextResponse.json(db.appointments[idx]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const { id } = params;
        const db = readDB();

        const filtered = db.appointments.filter((a: any) => a.id !== id);
        db.appointments = filtered;
        writeDB(db);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
