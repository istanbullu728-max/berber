import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';

export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    try {
        const params = await props.params;
        const { id } = params;
        const db = readDB();
        db.blocks = (db.blocks || []).filter((b: any) => b.id !== id);
        writeDB(db);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
