import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./globals.css";
import { createClient } from '@supabase/supabase-js'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Budgetize",
  description: "Spend without guilt",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GoogleOAuthProvider clientId="432648370154-kckqtu8vbehg8asctasum2hr290kddmj.apps.googleusercontent.com">
      <html lang="en">
        <body className={inter.className}>{children}</body>
        <script src="https://accounts.google.com/gsi/client" async></script>
      </html>
    </GoogleOAuthProvider>
  );
}
