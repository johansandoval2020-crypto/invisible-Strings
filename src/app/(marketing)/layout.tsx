import Link from "next/link";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-background-cream flex min-h-dvh flex-col">
      <header className="flex h-16 items-center px-6 md:px-10">
        <Link href="/" className="font-display text-base font-medium">
          Invisible String
        </Link>
      </header>
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
