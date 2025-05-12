"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { Keypair } from "@solana/web3.js";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "sonner"

type Wallet = {
  publicKey: string;
  privateKey: string;
  showPrivateKey: boolean;
};

export function Mnemonic() {
  const [mnemonic, setMnemonic] = useState("");
  const [currentIndex, setCurrentindex] = useState(0);
  const [wallets, setWallets] = useState<Wallet[]>([]);

  const createWallet = () => {
    const seed = mnemonicToSeedSync(mnemonic);
    const path = `m/44'/501'/${currentIndex}'/0'`;
    const derivedSeed = derivePath(path, seed.toString("hex")).key;
    const keyPair = nacl.sign.keyPair.fromSeed(derivedSeed);
    const kp = Keypair.fromSecretKey(keyPair.secretKey);

    setWallets([
      ...wallets,
      {
        publicKey: kp.publicKey.toBase58(),
        privateKey: Buffer.from(keyPair.secretKey).toString("hex"),
        showPrivateKey: false,
      },
    ]);
    setCurrentindex(currentIndex + 1);

    toast("Wallet created successfully!");
  };

  const togglePrivateKey = (index: number) => {
    const newWallets = [...wallets];
    newWallets[index].showPrivateKey = !newWallets[index].showPrivateKey;
    setWallets(newWallets);
  };

  const deleteWallet = (index: number) => {
    const updated = [...wallets];
    updated.splice(index, 1);
    setWallets(updated);

    toast("Wallet deleted successfully!");
  };

  const clearAll = () => {
    setWallets([]);
    setCurrentindex(0);
    setMnemonic("");
    toast("All Wallet deleted successfully!");
  };

  return <div className="mx-2 pt-4">
    <p className="text-3xl font-medium">Create your Solana Wallet today!!</p>
    <div className="flex gap-4 my-6">
        {!mnemonic && wallets.length === 0 && (
            <Button size='lg' onClick={async () => {
                const mn = await generateMnemonic();
                setMnemonic(mn);
                toast("Seed Phrase Created", {
                    description: "Dont share it with anyone, Keep safely"
                });
            }}>
            Create Seed Phrase
            </Button>
        )}
    </div>


      {mnemonic && (
        <div className="border-2 p-6 rounded-xl dark:bg-black dark:text-white bg-white text-black">
          <div className="pb-4 text-lg font-semibold">Your seed phrases are:</div>
          <div
            onClick={() => {
                navigator.clipboard.writeText(mnemonic);
                toast("Seed Phrase copied successfully", {
                    description: "Dont share it with anyone, Keep it safe"
                });
            }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 cursor-pointer"
          >
            {mnemonic.split(" ").map((word, index) => (
              <div
                key={index}
                className="bg-neutral-300 dark:bg-neutral-900 py-3 px-4 rounded-md text-xl text-center"
              >
                {word}
              </div>
            ))}
          </div>
          <p className="text-gray-800 dark:text-gray-400  mt-4 text-sm flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m4-10h2a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2h2" />
            </svg>
            Click Anywhere To Copy
          </p>
        </div>
      )}

      {mnemonic && (
        <div className="mt-6">
          <Button onClick={createWallet} className="mr-6 cursor-pointer">Add Wallet</Button>
          <Button variant="destructive" onClick={clearAll}>Clear all Wallets</Button>

          <div className="mt-6 space-y-6">
            {wallets.map((wallet, index) => (
              <div key={index} className="bg-white dark:bg-black border-2 border-neutral-400 dark:border-neutral-800 rounded-xl p-4 text-black dark:text-white relative">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-semibold">Wallet {index + 1}</h2>
                  <Button onClick={() => deleteWallet(index)} className="text-red-500 hover:text-red-600 bg-white dark:bg-black hover:bg-slate-300 dark:hover:bg-zinc-900">
                    <Trash2 size={18} />
                  </Button>
                </div>
                <div className="bg-slate-300 dark:bg-neutral-900 p-4 rounded-lg">
                  <div onClick={() => {
                    navigator.clipboard.writeText(wallet.publicKey)
                    toast("Public key copied to the clipboard");
                  }} className="mb-2 cursor-pointer">
                    <p className="text-sm text-black dark:text-gray-400 font-semibold mb-1">Public Key</p>
                    <p className="break-all truncate">{wallet.publicKey}</p>
                  </div>
                 <div className="flex items-center justify-between gap-2 mt-4">
                    <div onClick={() => {
                        navigator.clipboard.writeText(wallet.privateKey);
                        toast("Private key copied to the clipboard ", {
                            description: "Dont share it with anyone, Keep it safe"
                });
                    }} className="flex-1 min-w-0 cursor-pointer">
                        <p className="text-sm text-black dark:text-gray-400 font-semibold mb-1">
                        Private Key
                        </p>
                        <p className="font-mono truncate overflow-hidden whitespace-nowrap text-ellipsis text-black dark:text-white">
                        {wallet.showPrivateKey ? wallet.privateKey : "•".repeat(44)}
                        </p>
                    </div>

                    <Button
                        onClick={() => togglePrivateKey(index)}
                        className="flex-shrink-0 text-gray-700 hover:text-black bg-slate-300 hover:bg-slate-500 dark:text-gray-400 dark:hover:text-white dark:bg-neutral-900 dark:hover:bg-neutral-700"
                    >
                        {wallet.showPrivateKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>
                    </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
}
