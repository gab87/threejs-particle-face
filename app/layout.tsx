import type { Metadata } from "next";
import { FaceExperience } from "@/components/three/FaceExperience";
import "./globals.css";

export const metadata: Metadata = {
  title: "Particula Studio — Esperienze 3D interattive con face tracking",
  description:
    "Particula Studio trasforma il tuo volto in un wireframe di particelle in tempo reale con Three.js e computer vision, direttamente nel browser.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-white">
        <FaceExperience>{children}</FaceExperience>
      </body>
    </html>
  );
}
