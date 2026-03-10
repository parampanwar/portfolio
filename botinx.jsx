const BotinxLogo = ({ size = 40, showText = true }) => {
  return (
    <div className="flex items-center gap-3">
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0">
        {/* Background */}
        <rect
          x="0"
          y="0"
          width="64"
          height="64"
          rx="18"
          fill="hsl(142, 72%, 42%)"
        />

        {/* Antenna */}
        <line
          x1="32"
          y1="11"
          x2="32"
          y2="18"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle
          cx="32"
          cy="9"
          r="3"
          fill="white"
        />

        {/* Head */}
        <rect
          x="18"
          y="20"
          width="28"
          height="22"
          rx="5"
          fill="white"
        />

        {/* Chat tail */}
        <path
          d="M32 46 L26 40 H38 Z"
          fill="white"
        />

        {/* Eyes */}
        <circle
          cx="26"
          cy="30"
          r="3.5"
          fill="hsl(142, 72%, 42%)"
        />
        <circle
          cx="38"
          cy="30"
          r="3.5"
          fill="hsl(142, 72%, 42%)"
        />

        {/* Smile */}
        <path
          d="M25 36 Q32 41 39 36"
          stroke="hsl(142, 72%, 42%)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  )
}

export default BotinxLogo