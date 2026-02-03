import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ServiceGrid from "@/components/ServiceGrid";
import HeritageBox from "@/components/HeritageBox";
import LegacyRecoveryAudit from "@/components/LegacyRecoveryAudit";
import DigitalDispatch from "@/components/DigitalDispatch";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#1a1a1a]">
      <Navbar />
      <Hero />
      <ServiceGrid />
      <HeritageBox />
      <LegacyRecoveryAudit />
      <DigitalDispatch />
      <Footer />
    </main>
  );
}
