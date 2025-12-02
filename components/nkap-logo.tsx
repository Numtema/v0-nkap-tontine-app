interface NkapLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
  animated?: boolean
}

const sizes = {
  sm: "w-10 h-10",
  md: "w-14 h-14",
  lg: "w-24 h-24",
  xl: "w-36 h-36",
}

const textSizes = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-5xl",
  xl: "text-7xl",
}

export function NkapLogo({ size = "md", showText = true, className = "", animated = true }: NkapLogoProps) {
  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div className={`${sizes[size]} relative ${animated ? "animate-float" : ""}`}>
        {/* Outer glow ring */}
        <div className={`absolute inset-0 rounded-full bg-primary/20 ${animated ? "animate-pulse-ring" : ""}`} />

        {/* Middle ring */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-primary/30 to-transparent" />

        {/* Main circle with gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary via-primary to-primary/80 flex items-center justify-center shadow-xl shadow-primary/20">
          {/* Inner glow */}
          <div className="absolute inset-2 rounded-full bg-gradient-to-t from-transparent to-white/20" />

          {/* Letter N */}
          <svg viewBox="0 0 40 40" className="w-1/2 h-1/2 text-primary-foreground relative z-10" fill="currentColor">
            <path d="M10 32V8h4l12 16V8h4v24h-4L14 16v16h-4z" />
          </svg>
        </div>

        {/* Accent dot with glow */}
        <div className="absolute -right-0.5 -top-0.5 w-3.5 h-3.5 rounded-full bg-gradient-to-br from-accent to-accent/80 shadow-lg shadow-accent/30" />
      </div>

      {showText && (
        <div className="flex flex-col items-center">
          <span
            className={`font-bold ${textSizes[size]} text-foreground tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text`}
          >
            Nkap
          </span>
          {size === "xl" && (
            <span className="text-sm text-muted-foreground font-medium tracking-widest uppercase mt-1">
              Tontine Digitale
            </span>
          )}
        </div>
      )}
    </div>
  )
}
