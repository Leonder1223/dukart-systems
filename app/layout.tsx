import "./globals.css";
import type { Metadata } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SessionWrapper from "@/components/SessionWrapper";

export const metadata: Metadata = {
  title: "Dukart Systems – PC-Service, Builds und Support",
  description: "Dukart Systems hilft bei PC-Builds, Reparaturen, Upgrades und technischem Support.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="de" className="dark">
      <body className="bg-slate-950 text-white antialiased">
        <SessionWrapper session={session}>
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}