"use client";

import { useState } from "react"
import { Button } from "./ui/button";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { Input } from "./ui/input";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair, PublicKey } from "@solana/web3.js";

export function Mnemonic() {
    const [mnemonic, setMnemonic] = useState("");
    const [currentIndex, setCurrentindex] = useState(0);
    const [publickKey, setPublicKey] = useState<PublicKey[]>([]);

    return <div>
        <Button className="my-6" onClick={async() => {
            const mn = await generateMnemonic();
            setMnemonic(mn);
        }}>Create Seed Phrase</Button>

        <Input type="text" value={mnemonic} readOnly  onClick={() => {
            navigator.clipboard.writeText(mnemonic);
            }} className="w-full col-span-2 gap-6 text-2xl py-30">
        </Input>

        {/* Wallet creation section */}
        {mnemonic && (
            <div className="mt-4">
            <Button onClick={() => {
                const seed = mnemonicToSeedSync(mnemonic);
                const path = `m/44'/501'/${currentIndex}'/0'`;
                const derivedSeed = derivePath(path, seed.toString('hex')).key;
                const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
                const keyPair = Keypair.fromSecretKey(secret);

                setCurrentindex(currentIndex + 1);
                setPublicKey([...publickKey, keyPair.publicKey]);
                }}>
                Create Wallet
            </Button>
            {publickKey.map((key, index) => 
            <div key={index}>   
                {key.toBase58()}
            </div>)}
        </div>
        )}
    </div>
}