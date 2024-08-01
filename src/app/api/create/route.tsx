import { Connection, PublicKey, clusterApiUrl, Keypair, Transaction, TransactionInstruction } from '@solana/web3.js';
import { createSubdomain } from "@bonfida/spl-name-service";
import { signAndSendInstructions } from '@bonfida/utils';
import { NextResponse } from 'next/server';
import bs58 from 'bs58';

export async function POST(request: Request) {
    const { program } = await request.json();
    if (request.method !== 'POST') {
        return NextResponse.json({ message: 'Method not allowed' }, { status: 405 });
    }

    if (request.body === null) {
        return NextResponse.json({ message: 'Body is required' }, { status: 200 });
    }

    if (!program) {
        return NextResponse.json({ message: 'Program name is required' }, { status: 400 });
    }
    try {
        const wallet = Keypair.fromSecretKey(bs58.decode(process.env.WALLET || ''));
        const space = 2;
        const connection = new Connection(process.env.RPC || clusterApiUrl('mainnet-beta'), 'confirmed');
        const sub = `${program}.programdb`;
        const [, ix] = await createSubdomain(
            connection,
            sub,
            wallet.publicKey,
            space,
            wallet.publicKey,
        );
        const instructions: TransactionInstruction[] = [];
        instructions.push(...ix);
        const { blockhash } = await connection.getLatestBlockhash();
        const tx = new Transaction().add(...instructions);
        tx.feePayer = wallet.publicKey;
        tx.recentBlockhash = blockhash;
        const signature = await signAndSendInstructions(connection, [wallet], wallet, instructions);


        return NextResponse.json({ message: 'Subdomain created successfully', signature }, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ message: 'Error creating subdomain', error: (error as Error).message }, { status: 500 });
    }
}