import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/db';
import { ManualBlock } from '@/lib/store';

export async function GET() {
    const db = readDB();
    return NextResponse.json(db.blocks);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const newBlock: ManualBlock = {
            ...body,
            id: Math.random().toString(36).substr(2, 9),
        };

        const db = readDB();
        db.blocks.push(newBlock);
        writeDB(db);

        return NextResponse.json(newBlock, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
