import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';

export async function POST(request) {
    try {
        const { userId } = await request.json();

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const { db } = await connectToDatabase();

        const userRequests = await db.collection('requests').find({ user_id: userId }).toArray();

        const userWithdrawals = await db.collection('withdrawals').find({ user_id: userId }).toArray();

        return NextResponse.json({
            requests: userRequests,
            withdrawals: userWithdrawals
        });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
