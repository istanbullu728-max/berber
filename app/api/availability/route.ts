import { NextResponse } from 'next/server';
import { readDB } from '@/lib/db';
import { timeToMinutes, minutesToTime } from '@/lib/store';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');
    const durationStr = searchParams.get('duration');

    if (!date || !durationStr) {
        return NextResponse.json({ error: 'Missing date or duration' }, { status: 400 });
    }

    try {
        const duration = parseInt(durationStr);
        const db = readDB();

        // Logic from store.ts but using DB data
        const d = new Date(date + 'T00:00:00');
        const dayOfWeek = d.getDay();
        const settings = db.settings || { workingHours: [] }; // Safe fallback
        const wh = settings.workingHours.find((w: any) => w.dayOfWeek === dayOfWeek);

        if (!wh || wh.isDayOff) {
            return NextResponse.json([]);
        }

        const startMin = timeToMinutes(wh.startTime);
        const endMin = timeToMinutes(wh.endTime);
        const slots: string[] = [];

        // Filter relevant appointments/blocks for performance
        const dayAppts = (db.appointments || []).filter(
            (a: any) => a.date === date && (a.status === 'pending' || a.status === 'confirmed')
        );
        const dayBlocks = (db.blocks || []).filter((b: any) => b.date === date);

        for (let m = startMin; m + duration <= endMin; m += 30) {
            const t = minutesToTime(m);
            // Check availability
            const newStart = m;
            const newEnd = m + duration;
            let available = true;

            for (const appt of dayAppts) {
                const apptStart = timeToMinutes(appt.startTime);
                const apptEnd = timeToMinutes(appt.endTime);
                if (newStart < apptEnd && newEnd > apptStart) { available = false; break; }
            }

            if (available) {
                for (const block of dayBlocks) {
                    const bStart = timeToMinutes(block.startTime);
                    const bEnd = timeToMinutes(block.endTime);
                    if (newStart < bEnd && newEnd > bStart) { available = false; break; }
                }
            }

            if (available) slots.push(t);
        }

        return NextResponse.json(slots);
    } catch (error) {
        console.error('Availability API Error:', error);
        return NextResponse.json([], { status: 500 });
    }
}
