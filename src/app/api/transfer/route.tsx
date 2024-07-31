import { Connection, PublicKey, clusterApiUrl, Keypair, Transaction, TransactionInstruction } from '@solana/web3.js';
import { transferSubdomain } from "@bonfida/spl-name-service";
import { signAndSendInstructions } from '@bonfida/utils';
import { NextResponse } from 'next/server';
import bs58 from 'bs58';

export async function POST(request: Request) {
    const { programName, programAddress } = await request.json();
    if (request.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    if (request.body === null) {
        return NextResponse.json({ message: 'Body is required' }, { status: 200 });
    }

    if (!programName || !programAddress) {
        return NextResponse.json({ message: 'program and newOwner is required' }, { status: 400 });
    }
    try {
        const wallet = Keypair.fromSecretKey(bs58.decode(process.env.WALLET || ''));
        const connection = new Connection(process.env.RPC || clusterApiUrl('mainnet-beta'), 'confirmed');
        const sub = `${programName}.programdb`;
        const ix = await transferSubdomain(
            connection,
            sub,
            new PublicKey(programAddress),
        );
        const instructions: TransactionInstruction[] = [];
        instructions.push(ix);
        const { blockhash } = await connection.getLatestBlockhash();
        const tx = new Transaction().add(...instructions);
        tx.feePayer = wallet.publicKey;
        tx.recentBlockhash = blockhash;
        const signature = await signAndSendInstructions(connection, [wallet], wallet, instructions);


        return NextResponse.json({ message: 'Subdomain transferred successfully', signature }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Error transerring subdomain', error: (error as Error).message }, { status: 500 });
    }
}