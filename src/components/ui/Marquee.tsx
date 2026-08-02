export function Marquee({
  children,
  reverse = false,
  className = '',
}: {
  children: React.ReactNode
  reverse?: boolean
  className?: string
}) {
  return (
    <div className={`relative flex overflow-hidden ${className}`}>
      <div className="marquee-track flex shrink-0 items-center gap-12 pr-12" style={reverse ? { animationDirection: 'reverse' } : undefined}>
        {children}
        {children}
      </div>
    </div>
  )
}
