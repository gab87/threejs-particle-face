const NAV_LINKS = [
  { href: "#chi-siamo", label: "Chi siamo" },
  { href: "#servizi", label: "Servizi" },
  { href: "#contatti", label: "Contatti" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/40 backdrop-blur-[1px]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#top" className="flex items-center gap-2 text-slate-900">
          <span className="h-2 w-2 rounded-full bg-cyan-600" />
          <span className="text-sm font-semibold tracking-wide uppercase">
            Particula Studio
          </span>
        </a>
        <nav className="hidden gap-8 text-sm text-slate-600 sm:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition hover:text-slate-900"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#contatti"
          className="rounded-full bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-500"
        >
          Richiedi una demo
        </a>
      </div>
    </header>
  );
}
