import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        
        const withdrawals = await db.collection('withdrawals').find({}).toArray();

        return NextResponse.json(withdrawals);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
