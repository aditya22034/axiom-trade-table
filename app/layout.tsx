import "./globals.css";
import Providers from "@/components/providers";

export const metadata = {
  title: "Axiom Trade — Token Discovery Replica",
  description: "Pixel-perfect token table replica with real-time updates",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-textPrimary">
        <Providers>
          <div className="min-h-screen">
            <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
              <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
                <div className="text-lg font-semibold">
                  Axiom Trade — Token Discovery
                </div>
              </div>
            </header>

            <main className="mx-auto max-w-7xl px-4 py-6">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
