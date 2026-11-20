import Link from "next/link";

export default function NotFound() {
  return (
    <main id="content" className="grid min-h-screen place-items-center bg-[#070b14] px-6 text-center text-white">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">404</p>
        <h1 className="mt-3 font-display text-4xl">This street is not on the map.</h1>
        <p className="mt-3 text-slate-300">The page you requested is not part of the portfolio.</p>
        <Link href="/" className="mt-6 inline-flex rounded-full bg-cyan-200 px-4 py-2 text-sm font-semibold text-slate-950">
          Return to the city
        </Link>
      </div>
    </main>
  );
}
