import Link from 'next/link';

export default function RootNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF6EA] px-6 text-center text-[#003B2F]">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.16em] text-[#C65F26]">404</p>
        <h1 className="mt-3 font-serif text-4xl font-black tracking-[-0.04em]">Stranica nije pronađena</h1>
        <p className="mt-3 text-base font-semibold text-[#52635D]">Čini se da se ovaj ljubimac izgubio.</p>
        <Link className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-[#F26A00] px-6 text-sm font-black text-white" href="/">
          Natrag na PetPark
        </Link>
      </div>
    </main>
  );
}
