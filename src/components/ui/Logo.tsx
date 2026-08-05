export function LogoMark({ size = 34 }: { size?: number }) {
  return (
    <img
      src="/LOGO.png"
      alt="Sasya logo"
      width={size}
      height={size}
      className="h-auto shrink-0 rounded-xl object-contain drop-shadow-md"
    />
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
