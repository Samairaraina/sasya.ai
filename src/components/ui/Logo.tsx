export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <defs>
        <linearGradient id="sasya-leaf" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3DDC97" />
          <stop offset="55%" stopColor="#1FBF8F" />
          <stop offset="100%" stopColor="#F38BBC" />
        </linearGradient>
        <linearGradient id="sasya-bg" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#214846" />
          <stop offset="100%" stopColor="#0d2624" />
        </linearGradient>
      </defs>
      <rect x="1.5" y="1.5" width="45" height="45" rx="14" fill="url(#sasya-bg)" stroke="url(#sasya-leaf)" strokeWidth="1.6" />
      <path
        d="M14 33c0-9.5 6-15 19-16 .4 11-5.5 17.5-15 17.5-1.4 0-2.8-.5-4-1.5Z"
        fill="url(#sasya-leaf)"
      />
      <path
        d="M14 33c4-6.5 9-10.5 15-12.5"
        stroke="#163735"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="33.5" cy="16.5" r="2.4" fill="#F9B4D0" />
    </svg>
  )
}

export function Wordmark({ light = true, size = 'text-xl' }: { light?: boolean; size?: string }) {
  return (
    <span className={`font-display font-extrabold tracking-tight ${size} ${light ? 'text-white' : 'text-forest-900'}`}>
      Sasya
    </span>
  )
}

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <img
        src="/LOGO.png"
        alt="Sasya logo"
        width={size}
        height={size}
        className="h-auto shrink-0 rounded-xl object-contain"
      />
      <Wordmark />
    </span>
  )
}
