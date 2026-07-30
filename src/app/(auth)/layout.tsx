import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
      <Link href="/" className="mb-8 text-xl font-bold text-slate-900">
        FlowBoard
      </Link>
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-sm ring-1 ring-slate-200">
        {children}
      </div>
    </main>
  );
}
