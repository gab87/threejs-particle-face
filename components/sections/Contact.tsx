export function Contact() {
  return (
    <section id="contatti" className="bg-white/40 px-6 py-24 backdrop-blur-[1px]">
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium tracking-widest text-cyan-600 uppercase">
            Contatti
          </p>
          <h2 className="mt-4 text-3xl font-semibold text-slate-900">
            Raccontaci il tuo progetto
          </h2>
          <p className="mt-4 max-w-md text-base leading-7 text-slate-600">
            Scrivici per una consulenza gratuita: valutiamo insieme come
            un&apos;esperienza 3D interattiva può aiutare il tuo brand a
            comunicare meglio.
          </p>
          <div className="mt-8 space-y-2 text-sm text-slate-600">
            <p>
              Email:{" "}
              <a
                href="mailto:hello@particula.studio"
                className="text-cyan-600 hover:underline"
              >
                hello@particula.studio
              </a>
            </p>
            <p>Telefono: +39 02 1234 5678</p>
          </div>
        </div>

        <form
          action="mailto:hello@particula.studio"
          method="post"
          encType="text/plain"
          className="space-y-4 rounded-2xl border border-black/10 bg-white/50 p-6 shadow-sm backdrop-blur-[1px]"
        >
          <div>
            <label
              htmlFor="name"
              className="mb-1 block text-sm text-slate-600"
            >
              Nome
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full rounded-lg border border-slate-300 bg-white/70 px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-600"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm text-slate-600"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-slate-300 bg-white/70 px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-600"
            />
          </div>
          <div>
            <label
              htmlFor="message"
              className="mb-1 block text-sm text-slate-600"
            >
              Messaggio
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              className="w-full rounded-lg border border-slate-300 bg-white/70 px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-600"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-cyan-600 px-6 py-3 text-sm font-medium text-white transition hover:bg-cyan-500"
          >
            Invia messaggio
          </button>
        </form>
      </div>
    </section>
  );
}
