import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import AuthProvider from "@/providers/auth-provider";
import QueryProvider from "@/providers/query-provider";
import { auth } from "@/auth";

const fonts = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CheckCup",
  description: "A site monitoring tool",
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={fonts.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <AuthProvider session={session}>
            <QueryProvider>
              {children}
              {modal}
            </QueryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
