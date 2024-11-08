import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function GET() {
    try {
        // Veritabanına bağlan
        const { db } = await connectToDatabase();

        // Tüm kullanıcıları çek
        const deposits = await db.collection('deposits').find({}).toArray();

        // Kullanıcıları yanıtla
        return NextResponse.json(deposits);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
