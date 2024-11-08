import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';

export async function POST(request) {
    const { invitationCode } = await request.json();

    if (!invitationCode) {
        return NextResponse.json({ error: 'Invitation code is required' }, { status: 400 });
    }

    try {
        const { db } = await connectToDatabase();
        
        const users = await db.collection('users').find({ reference_owner: invitationCode }).toArray();

        // if (users.length === 0) {
        //     return NextResponse.json({ message: 'No users found with the given invitation code' }, { status: 404 });
        // }

        return NextResponse.json(users);
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
