export function About() {
  return (
    <section
      id="chi-siamo"
      className="bg-white/40 px-6 py-24 backdrop-blur-[1px]"
    >
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-3">
        <div>
          <p className="text-sm font-medium tracking-widest text-cyan-600 uppercase">
            Chi siamo
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900">
            Uniamo grafica 3D e computer vision
          </h2>
        </div>
        <div className="lg:col-span-2">
          <p className="text-base leading-7 text-slate-600">
            Particula Studio è un piccolo team di sviluppatori e designer
            specializzati in esperienze web interattive basate su Three.js,
            WebGL e machine learning applicato al browser. Costruiamo
            interfacce che reagiscono al movimento, al volto e ai gesti degli
            utenti, mantenendo tutta l&apos;elaborazione lato client per
            garantire privacy e performance.
          </p>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Lavoriamo con brand, studi creativi e team di prodotto che
            vogliono distinguersi con esperienze digitali memorabili, dalle
            landing page immersive alle installazioni interattive.
          </p>
        </div>
      </div>
    </section>
  );
}
