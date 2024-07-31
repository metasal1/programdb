import { Connection, clusterApiUrl, Keypair } from '@solana/web3.js';
import { getDomainKeySync, NAME_PROGRAM_ID, deleteInstruction, } from "@bonfida/spl-name-service";
import { signAndSendInstructions } from "@bonfida/utils";
import { NextResponse } from 'next/server';
import bs58 from 'bs58';

export async function POST(request: Request) {
    const { domain } = await request.json();

    const wallet = Keypair.fromSecretKey(bs58.decode(process.env.WALLET || ''));
    const connection = new Connection(process.env.RPC || clusterApiUrl('mainnet-beta'), 'confirmed');

    const { pubkey } = getDomainKeySync(`${domain}.programdb.sol`);

    const ix = deleteInstruction(
        NAME_PROGRAM_ID,
        pubkey,
        wallet.publicKey,
        wallet.publicKey
    );

    const tx = await signAndSendInstructions(connection, [], wallet, [ix]);
    console.log(`Deleted subdomain ${tx}`);
    return NextResponse.json({ message: 'Subdomain deleted successfully', ix, tx }, { status: 200 });



}