import { PublicKey } from '@solana/web3.js';
import { getDomainKeySync } from "@bonfida/spl-name-service";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { domain } = await request.json();
    if (!domain) {
        return NextResponse.json({ message: 'Program name (without .programdb.sol) is required' }, { status: 400 });
    }

    try {
        const { pubkey } = getDomainKeySync(`${domain}.programdb.sol`);

        return NextResponse.json({ message: 'Domain key found', pubkey }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Error - please provide domain excluding .programdb.sol', error: (error as Error).message }, { status: 500 });
    }
}