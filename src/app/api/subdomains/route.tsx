import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { NextResponse } from 'next/server';
import { findSubdomains } from "@bonfida/spl-name-service"

export async function POST(request: Request) {
    const parentKey = new PublicKey("DJ67P8RUnNK49CwDYo3zehGpQGTjkdPMpvTiFZr1ekZT");

    try {
        const connection = new Connection(process.env.RPC || clusterApiUrl('mainnet-beta'), 'confirmed');
        const subdomains = await findSubdomains(connection, parentKey);
        console.log(subdomains)
        subdomains.sort();
        return NextResponse.json(subdomains);
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Error fetching subdomains' }, { status: 500 });
    }
}
