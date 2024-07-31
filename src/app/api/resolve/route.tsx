import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { NextResponse } from 'next/server';
import { resolve } from "@bonfida/spl-name-service"

export async function POST(request: Request) {
    const { domain } = await request.json();

    if (!domain) {
        return NextResponse.json({ message: 'Domain name (without .sol) is required' }, { status: 400 });
    }

    try {
        const connection = new Connection(process.env.RPC || clusterApiUrl('mainnet-beta'), 'confirmed');
        const domainOwner = await resolve(connection, `${domain}.programdb.sol`);
        console.log(domainOwner)
        return NextResponse.json(domainOwner);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Error fetching domain owner' }, { status: 500 });
    }
}
