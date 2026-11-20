export function PhilosophyDiagram({ id }: { id: string }) {
  const stroke = "rgba(167, 139, 250, 0.9)";
  const glow = "rgba(103, 232, 249, 0.9)";

  return (
    <svg viewBox="0 0 220 88" className="h-20 w-full" aria-hidden="true">
      <title>
        {id === "scalability"
          ? "Stacked layers growing wider toward the base"
          : id === "architecture"
            ? "Concentric modules around a stable core"
            : id === "improvement"
              ? "A continuous loop between four practices"
              : "People connected through a shared plan"}
      </title>
      {id === "scalability" ? (
        <g fill="none" strokeWidth="3">
          <rect x="78" y="12" width="64" height="14" rx="4" stroke={glow} />
          <rect x="58" y="36" width="104" height="14" rx="4" stroke={stroke} />
          <rect x="36" y="60" width="148" height="14" rx="4" stroke={glow} />
        </g>
      ) : null}
      {id === "architecture" ? (
        <g fill="none" strokeWidth="3">
          <circle cx="110" cy="44" r="14" stroke={glow} />
          <circle cx="110" cy="44" r="26" stroke={stroke} />
          <circle cx="110" cy="44" r="38" stroke="rgba(255,255,255,0.35)" />
        </g>
      ) : null}
      {id === "improvement" ? (
        <g fill="none" stroke={glow} strokeWidth="3">
          <path d="M40 44h140" />
          <path d="M168 44c0-18-16-30-36-30H88c-20 0-36 12-36 30" stroke={stroke} />
          <circle cx="40" cy="44" r="5" fill={glow} stroke="none" />
          <circle cx="110" cy="14" r="5" fill={stroke} stroke="none" />
          <circle cx="180" cy="44" r="5" fill={glow} stroke="none" />
          <circle cx="110" cy="70" r="5" fill={stroke} stroke="none" />
        </g>
      ) : null}
      {id === "leadership" ? (
        <g fill="none" stroke={glow} strokeWidth="3">
          <circle cx="40" cy="44" r="8" />
          <circle cx="110" cy="24" r="8" />
          <circle cx="110" cy="64" r="8" />
          <circle cx="180" cy="44" r="8" stroke={stroke} />
          <path d="M48 44h54M110 32v24M118 24h54M118 64h54" />
        </g>
      ) : null}
    </svg>
  );
}
