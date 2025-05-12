import { ModeToggle } from "./ui/mode-tongle";

export function Navbar() {
    return <div className="flex justify-between text-4xl font-semibold border-2 rounded-2xl p-6 my-6">
        Crypto Vault
        <ModeToggle />
    </div>
}