export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#111111] text-[#f2f0ea]">
      <div className="absolute right-8 top-5 flex items-center gap-3 text-xs text-[#8d8d8d]">
        <a href="/play/mental-arithmetic" className="rounded-full border border-[#303030] px-4 py-2 text-[#d8d5ce] no-underline">
          Mental Arithmetic
        </a>
        <a href="/profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#202020] text-[#d8d5ce] no-underline">
          S
        </a>
      </div>

      <div className="pointer-events-none absolute inset-0">
        <span className="absolute left-[6%] top-[16%] text-[#777]">+</span>
        <span className="absolute left-[25%] top-[38%] text-[#777]">.</span>
        <span className="absolute right-[18%] top-[28%] text-[#777]">.</span>
        <span className="absolute bottom-[28%] left-[58%] text-[#777]">+</span>
        <span className="absolute bottom-[18%] right-[7%] text-[#777]">.</span>
      </div>

      <section className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-5 pb-24">
        <h1 className="mb-7 font-serif text-5xl font-semibold tracking-normal sm:text-6xl">
          SumTex <span className="align-baseline text-xl italic text-[#7a7a7a]">v1</span>
        </h1>
        <form action="/problems" className="flex h-14 w-full items-center rounded-full border border-[#303030] bg-[#1f1f1f] px-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
          <span className="mr-3 text-[#8a8a8a]">Search</span>
          <input
            name="q"
            placeholder="Mental arithmetic, calculus, algebra"
            className="min-w-0 flex-1 bg-transparent text-sm text-[#dedbd2] outline-none placeholder:text-[#696969]"
          />
          <button
            type="submit"
            className="ml-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#747474] text-lg leading-none text-[#111111]"
            aria-label="Search"
          >
            Go
          </button>
        </form>
      </section>

      <footer className="absolute inset-x-0 bottom-6 grid grid-cols-3 items-end px-10 text-xs text-[#676767]">
        <div />
        <div className="text-center">
          <div>Generated drills</div>
          <div className="mt-1 font-mono text-base text-[#aaa]">11 categories</div>
        </div>
        <div className="justify-self-end">
          <a href="/play" className="text-[#676767] no-underline">
            Play
          </a>
          <span className="mx-2">.</span>
          <a href="/problems" className="text-[#676767] no-underline">
            Problems
          </a>
          <span className="mx-2">.</span>
          <a href="/sign-in" className="text-[#676767] no-underline">
            Sign in
          </a>
        </div>
      </footer>
    </main>
  );
}
