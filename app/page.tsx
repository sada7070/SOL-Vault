import { Mnemonic } from "@/components/mnemonic";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return <div className="mx-6 md:mx-20">
      <Navbar />
      <Mnemonic />
  </div>
}
