"use client";

import { useState } from "react"
import { Button } from "./ui/button";
import { generateMnemonic } from "bip39";
import { Input } from "./ui/input";

export function Mnemonic() {
    const [mnemonic, setMnemonic] = useState("");

    return <div>
        <Button className="my-6" onClick={async() => {
            const mn = await generateMnemonic();
            setMnemonic(mn);
        }}>Create Seed Phrase</Button>

        <Input type="text" value={mnemonic}></Input>
    </div>
}