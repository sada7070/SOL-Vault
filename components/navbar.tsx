import { ModeToggle } from "./ui/mode-tongle";

export function Navbar() {
    return <div className="flex justify-between text-4xl my-6">
        Crypto Vault
        <ModeToggle />
    </div>
}