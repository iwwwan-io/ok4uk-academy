import { Footer } from "@/components/layout/footer";
import Navbar from "@/components/layout/navbar/Navbar";


export default function AuthLayout({children, }:{ children: React.ReactNode }) {

  return (
        <>
        <Navbar />
        {children}
        <Footer />
        </>
  )
}