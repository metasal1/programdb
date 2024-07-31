const wallet = Keypair.fromSecretKey(bs58.decode('wGZ54ZQ8tkey4JCtv5B6FUZJHTv2R7ATnAfZxTa6uHpR5x1pSdF6m19qG3HqkG31pnQ6HB14ozw4VjeJd1N6tnw'));
import { Connection, PublicKey, TransactionInstruction, Keypair, clusterApiUrl, Transaction } from "@solana/web3.js";
const connection = new Connection(process.env.RPC || clusterApiUrl('mainnet-beta'), 'confirmed');
import { createSubdomain } from "@bonfida/spl-name-service";
import { signAndSendInstructions } from '@bonfida/utils';
const instructions: TransactionInstruction[] = [];
import bs58 from 'bs58';

const handle = async () => {
    try {

        const sub = 'test1.programdb';
        const space = 0;

        const [, ix] = await createSubdomain(
            connection,
            sub,
            wallet.publicKey,
            space,
            wallet.publicKey,
        );
        instructions.push(...ix);
        const { blockhash } = await connection.getLatestBlockhash();
        const tx = new Transaction().add(...instructions);
        tx.feePayer = wallet.publicKey;
        tx.recentBlockhash = blockhash;
        const sig = await signAndSendInstructions(connection, [wallet], wallet, instructions);
        console.log('Instructions:', sig)
    } catch (err) {
        console.log('Err:', err)
    }
}

handle();