export default function SHLogo({ className = "w-9 h-9" }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 200 200" 
      className={className}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <linearGradient id="mainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E1B9D" />
          <stop offset="100%" stopColor="#70CADA" />
        </linearGradient>

        <style>{`
          .pulse-ring {
            fill: none;
            stroke: url(#mainGrad);
            stroke-width: 8;
            stroke-linecap: round;
            transform-origin: center;
            stroke-dasharray: 50 150;
            animation: kineticSweep 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
          .ring-2 { animation-duration: 4s; animation-direction: reverse; stroke-width: 6; }

          @keyframes kineticSweep {
            from { transform: rotate(0deg); stroke-dashoffset: 0; }
            to { transform: rotate(360deg); stroke-dashoffset: -200; }
          }

          .particle {
            fill: #70CADA;
            animation: float 2s ease-in-out infinite;
          }
          @keyframes float {
            0%, 100% { transform: translateY(0) scale(1); opacity: 0.5; }
            50% { transform: translateY(-10px) scale(1.2); opacity: 1; }
          }

          .sand-liquid {
            fill: #1E1B9D;
            filter: url(#neonGlow);
          }

          .hourglass-main {
            transform-origin: center;
            animation: snapFlip 6s cubic-bezier(0.85, 0, 0.15, 1) infinite;
          }

          @keyframes snapFlip {
            0%, 80% { transform: rotate(0deg); }
            90%, 100% { transform: rotate(180deg); }
          }

          .aura-bg {
            fill: #70CADA;
            opacity: 0.1;
            filter: blur(20px);
            animation: breathe 4s ease-in-out infinite;
          }
          @keyframes breathe {
            0%, 100% { r: 60; opacity: 0.05; }
            50% { r: 85; opacity: 0.15; }
          }
        `}</style>
      </defs>

      <circle className="aura-bg" cx="100" cy="100" r="70" />

      <circle className="pulse-ring" cx="100" cy="100" r="80" />
      <circle className="pulse-ring ring-2" cx="100" cy="100" r="65" />

      <circle className="particle" cx="150" cy="60" r="4" />
      <circle className="particle" cx="50" cy="140" r="3" />

      <g className="hourglass-main">
        <path fill="white" stroke="#1E1B9D" strokeWidth="4" d="M70,60 L130,60 L105,100 L130,140 L70,140 L95,100 Z" />
        
        <path className="sand-liquid" d="M78,65 L122,65 L100,100 Z">
          <animate attributeName="d" values="M78,65 L122,65 L100,100 Z; M100,95 L100,95 L100,100 Z; M78,65 L122,65 L100,100 Z" dur="6s" repeatCount="indefinite" />
        </path>

        <path className="sand-liquid" d="M100,100 L110,115 L90,115 Z">
          <animate attributeName="d" values="M100,100 L105,105 L95,105 Z; M100,100 L122,135 L78,135 Z; M100,100 L105,105 L95,105 Z" dur="6s" repeatCount="indefinite" />
        </path>

        <rect x="98" y="100" width="4" height="35" fill="#1E1B9D" opacity="0.6">
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="1s" repeatCount="indefinite" />
        </rect>
      </g>
    </svg>
  );
}
