export default function ProductArt({ type, className = "" }) {
  return (
    <svg
      className={`product-art ${className}`}
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="60" cy="60" r="45" fill="currentColor" opacity="0.06" />
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {type === "mug" && (
          <>
            <path d="M38 42h38v24c0 12-8.5 21-19 21S38 78 38 66V42Z" />
            <path d="M76 48h5c6 0 11 5 11 11s-5 11-11 11h-5" />
            <ellipse cx="57" cy="42" rx="19" ry="4" opacity="0.45" />
            <path d="M50 32c0-4 4-5 4-9M62 32c0-4 4-5 4-9" opacity="0.45" />
          </>
        )}
        {type === "throw" && (
          <>
            <rect x="30" y="42" width="60" height="44" rx="7" />
            <path d="M30 55h60M30 68h60" opacity="0.35" />
            <path d="M38 86l-3 9M50 86v9M62 86v9M74 86l3 9" />
            <path d="M44 42c0-7 8-7 8 0" opacity="0.5" />
          </>
        )}
        {type === "board" && (
          <>
            <rect x="26" y="44" width="68" height="34" rx="10" />
            <circle cx="38" cy="61" r="4" />
            <path
              d="M52 52c8 5 8 13 0 18M66 52c-6 5-6 13 0 18M80 52c-4 5-4 13 0 18"
              opacity="0.35"
            />
          </>
        )}
        {type === "vase" && (
          <>
            <path d="M48 32h24v10c0 7 10 12 10 26 0 15-10 24-22 24S38 83 38 68c0-14 10-19 10-26V32Z" />
            <path d="M48 32h24" />
            <path d="M46 66c9 4 19 4 28 0" opacity="0.4" />
            <path d="M60 32V18M60 25l-8-6M60 25l8-6" opacity="0.7" />
          </>
        )}
        {type === "cushion" && (
          <>
            <rect x="32" y="34" width="56" height="52" rx="14" />
            <path d="M46 34v52M74 34v52" opacity="0.22" />
            <path d="M44 60h32" opacity="0.3" />
            <circle cx="32" cy="34" r="2.4" fill="currentColor" stroke="none" />
            <circle cx="88" cy="34" r="2.4" fill="currentColor" stroke="none" />
            <circle cx="32" cy="86" r="2.4" fill="currentColor" stroke="none" />
            <circle cx="88" cy="86" r="2.4" fill="currentColor" stroke="none" />
          </>
        )}
        {type === "candle" && (
          <>
            <rect x="40" y="48" width="40" height="42" rx="10" />
            <path d="M40 60h40" opacity="0.4" />
            <path d="M60 48V38" />
            <path d="M60 38c-5-4-5-10 0-14 5 4 5 10 0 14Z" />
            <circle
              cx="60"
              cy="30"
              r="10"
              opacity="0.2"
              strokeDasharray="2 4"
            />
            <rect
              x="48"
              y="66"
              width="24"
              height="12"
              rx="2"
              opacity="0.3"
            />
          </>
        )}
        {type === "tumbler" && (
          <>
            <path d="M33 44h23l-3 40H36l-3-40Z" />
            <path d="M64 44h23l-3 40H67l-3-40Z" />
            <path d="M34 56h21M65 56h21" opacity="0.4" />
            <path d="M35 80h19M66 80h19" opacity="0.3" />
          </>
        )}
        {type === "tote" && (
          <>
            <path d="M34 48h52l-4 44H38l-4-44Z" />
            <path d="M46 48V38a14 14 0 0 1 28 0v10" />
            <rect
              x="50"
              y="62"
              width="20"
              height="12"
              rx="2"
              opacity="0.35"
            />
            <path d="M38 58h44" opacity="0.3" />
          </>
        )}
        {type === "beanie" && (
          <>
            <path d="M34 66c0-18 12-30 26-30s26 12 26 30" />
            <rect x="32" y="64" width="56" height="14" rx="7" />
            <circle cx="60" cy="29" r="8" />
            <path
              d="M44 38l-2 26M52 32v32M60 29v35M68 32v32M76 38l2 26"
              opacity="0.22"
            />
          </>
        )}
        {type === "cap" && (
          <>
            <path d="M32 64c0-16 12-28 28-28s28 12 28 28" />
            <path d="M28 64h64c5 0 9 3 9 8H19c0-5 4-8 9-8Z" />
            <circle cx="60" cy="36" r="3" />
            <path d="M60 39v25M44 42c4 6 4 14 2 22M76 42c-4 6-4 14-2 22" opacity="0.3" />
          </>
        )}
        {type === "planter" && (
          <>
            <path d="M38 62h44l-6 34H44l-6-34Z" />
            <rect x="34" y="54" width="52" height="10" rx="4" />
            <path
              d="M60 54V34M60 44c-11 0-17-8-17-16 10 0 17 6 17 16ZM60 54c11 0 17-8 17-16-10 0-17 6-17 16Z"
              opacity="0.6"
            />
          </>
        )}
        {type === "bottle" && (
          <>
            <path d="M52 30h16v8c0 5 8 8 8 18v34a8 8 0 0 1-8 8H52a8 8 0 0 1-8-8V56c0-10 8-13 8-18v-8Z" />
            <rect x="50" y="22" width="20" height="8" rx="3" />
            <rect
              x="50"
              y="60"
              width="20"
              height="14"
              rx="2"
              opacity="0.35"
            />
            <path d="M44 76h32" opacity="0.3" />
          </>
        )}
        {type === "bowl" && (
          <>
            <path d="M30 58h60c0 18-13 30-30 30S30 76 30 58Z" />
            <ellipse cx="60" cy="58" rx="30" ry="7" />
            <ellipse cx="60" cy="58" rx="22" ry="4" opacity="0.3" />
            <path d="M52 88h16" opacity="0.4" />
          </>
        )}
        {type === "apron" && (
          <>
            <path d="M46 34h28l4 12c10 4 14 14 14 26v22H28V72c0-12 4-22 14-26l4-12Z" />
            <path
              d="M46 34c0-8 6-12 14-12s14 4 14 12"
              opacity="0.55"
            />
            <path d="M44 66h32v14H44Z" opacity="0.35" />
            <path
              d="M28 78c-8 0-12 2-14 6M92 78c8 0 12 2 14 6"
              opacity="0.45"
            />
          </>
        )}
        {type === "lamp" && (
          <>
            <ellipse cx="50" cy="92" rx="20" ry="5" />
            <path d="M50 92V56c0-16 12-26 28-26" />
            <path d="M72 24h16l8 18H64l8-18Z" />
            <path d="M70 48l-4 10M82 48l4 10" opacity="0.4" />
            <circle cx="80" cy="46" r="3" />
          </>
        )}
        {type === "socks" && (
          <>
            <path d="M40 28h18v40c0 12-8 20-20 20H28c-6 0-10-4-10-10s4-10 10-10h6c4 0 6-2 6-6V28Z" />
            <path d="M68 28h18v40c0 12-8 20-20 20H56c-6 0-10-4-10-10s4-10 10-10h6c4 0 6-2 6-6V28Z" />
            <path d="M40 36h18M68 36h18" opacity="0.32" />
          </>
        )}
      </g>
    </svg>
  );
}
