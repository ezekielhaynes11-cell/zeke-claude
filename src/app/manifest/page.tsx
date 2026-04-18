import ManifestationTracker from "@/components/ManifestationTracker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Manifestation Tracker | Claim Your Reality",
  description: "Set your daily and weekly intentions. Click to manifest health, wealth, love, and growth.",
};

export default function ManifestPage() {
  return <ManifestationTracker />;
}
