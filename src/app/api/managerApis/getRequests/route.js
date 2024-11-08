import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb';

export async function GET() {
    try {
        const { db } = await connectToDatabase();
        
        const requests = await db.collection('requests').find({}).toArray();

        return NextResponse.json(requests);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
