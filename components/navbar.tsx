import { ModeToggle } from "./ui/mode-tongle";
import { Box } from 'lucide-react';


export function Navbar() {
    return <div className="flex justify-between text-4xl font-semibold border-2 rounded-2xl p-6 my-6">
        <div className="flex">
            <Box className="h-8 w-8 mt-1.5 mr-2" />
            SOL Vault
        </div>
        
        <ModeToggle />
    </div>
}