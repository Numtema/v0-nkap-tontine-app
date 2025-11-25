interface NkapLogoProps {
  size?: "sm" | "md" | "lg" | "xl"
  showText?: boolean
  className?: string
}

const sizes = {
  sm: "w-8 h-8",
  md: "w-12 h-12",
  lg: "w-20 h-20",
  xl: "w-32 h-32",
}

const textSizes = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
  xl: "text-6xl",
}

export function NkapLogo({ size = "md", showText = true, className = "" }: NkapLogoProps) {
  return (
    <div className={`flex flex-col items-center gap-2 ${className}`}>
      <div className={`${sizes[size]} relative`}>
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse-ring" />
        {/* Main circle */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
          {/* Inner symbol - stylized N */}
          <svg viewBox="0 0 40 40" className="w-3/5 h-3/5 text-primary-foreground" fill="currentColor">
            <path d="M10 32V8h4l12 16V8h4v24h-4L14 16v16h-4z" />
          </svg>
        </div>
        {/* Accent dot */}
        <div className="absolute -right-1 -top-1 w-3 h-3 rounded-full bg-secondary shadow-sm" />
      </div>
      {showText && <span className={`font-bold ${textSizes[size]} text-foreground tracking-tight`}>Nkap</span>}
    </div>
  )
}
