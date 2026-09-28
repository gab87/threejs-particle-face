export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center"
    >
      <div className="max-w-2xl rounded-3xl bg-white/35 p-8 backdrop-blur-[1px] sm:p-12">
        <p className="mb-4 text-sm font-medium tracking-widest text-cyan-600 uppercase">
          Realtà aumentata su misura
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
          Il tuo volto, trasformato in un wireframe di particelle in tempo
          reale.
        </h1>
        <p className="mt-6 text-base text-slate-600">
          Particula Studio progetta esperienze interattive con Three.js e
          computer vision: la webcam rileva il tuo volto e lo ricostruisce
          live come una nuvola di particelle 3D, senza inviare nulla a nessun
          server.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="#servizi"
            className="rounded-full bg-cyan-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-cyan-500"
          >
            Scopri i servizi
          </a>
          <a
            href="#contatti"
            className="rounded-full border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-400"
          >
            Parliamo del tuo progetto
          </a>
        </div>
      </div>
    </section>
  );
}
