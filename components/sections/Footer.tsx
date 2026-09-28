export function Footer() {
  return (
    <footer className="border-t border-black/10 bg-white/40 px-6 py-8 backdrop-blur-[1px]">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-slate-500 sm:flex-row">
        <p>© {new Date().getFullYear()} Particula Studio. Tutti i diritti riservati.</p>
        <p>Realizzato con Three.js, React Three Fiber e MediaPipe.</p>
      </div>
    </footer>
  );
}
