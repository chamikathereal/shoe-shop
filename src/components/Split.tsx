/** React-rendered char split for [data-reveal="chars"] — never mutate React-owned DOM via innerHTML. */
export function Split({ text, className = "" }: { text: string; className?: string }) {
  return (
    <>
      {text.split(" ").map((w, wi, arr) => (
        <span key={wi}>
          <span className={`inline-block overflow-hidden pb-[0.08em] -mb-[0.08em] ${className}`}>
            {[...w].map((c, ci) => <span key={ci} className="ch inline-block">{c}</span>)}
          </span>
          {wi < arr.length - 1 ? " " : null}
        </span>
      ))}
    </>
  );
}
