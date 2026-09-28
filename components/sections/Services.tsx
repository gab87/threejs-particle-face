const SERVICES = [
  {
    title: "Esperienze 3D interattive",
    description:
      "Scene Three.js/WebGL su misura, ottimizzate per performance su desktop e mobile, integrate nel tuo sito o prodotto.",
  },
  {
    title: "Computer vision nel browser",
    description:
      "Face tracking, riconoscimento gesti e pose estimation eseguiti interamente lato client con MediaPipe e TensorFlow.js.",
  },
  {
    title: "Landing page ad alto impatto",
    description:
      "Siti vetrina e pagine di lancio pensate per stupire, con animazioni curate e attenzione a SEO e tempi di caricamento.",
  },
];

export function Services() {
  return (
    <section id="servizi" className="bg-slate-50/40 px-6 py-24 backdrop-blur-[1px]">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-medium tracking-widest text-cyan-600 uppercase">
          Servizi
        </p>
        <h2 className="mt-4 max-w-xl text-3xl font-semibold text-slate-900">
          Dalla scena 3D al prodotto finito
        </h2>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border border-black/10 bg-white/50 p-6 shadow-sm backdrop-blur-[1px] transition hover:border-cyan-600/40 hover:shadow-md"
            >
              <div className="mb-4 h-9 w-9 rounded-full bg-cyan-600/15" />
              <h3 className="text-lg font-medium text-slate-900">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
