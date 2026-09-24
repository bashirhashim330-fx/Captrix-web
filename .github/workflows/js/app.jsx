
    const { useState, useEffect, useMemo, useRef, useCallback } = React;

    // ==========================================
    // 1. DATA CONSTANTS & EXACT CHALLENGE SPECS
    // ==========================================
    const CHALLENGE_DATA = [
      {
        id: '1s-1k',
        type: '1-Step',
        size: 1000,
        label: '$1,000',
        price: 29,
        targetPercent: 8,
        targetAmount: 80,
        dailyDrawdown: 50,
        maxDrawdown: 100,
        profitSplit: 80,
        tradingDays: 'No minimum',
        leverage: '1:50',
        badge: 'Micro Starter'
      },
      {
        id: '1s-5k',
        type: '1-Step',
        size: 5000,
        label: '$5,000',
        price: 69,
        targetPercent: 8,
        targetAmount: 400,
        dailyDrawdown: 250,
        maxDrawdown: 500,
        profitSplit: 80,
        tradingDays: 'No minimum',
        leverage: '1:50',
        badge: 'Fast-Track'
      },
      {
        id: '2s-10k',
        type: '2-Step',
        size: 10000,
        label: '$10,000',
        price: 99,
        targetPercent: 10,
        targetAmount: 1000,
        dailyDrawdown: 500,
        maxDrawdown: 1000,
        profitSplit: 80,
        tradingDays: '5–60',
        leverage: '1:100',
        badge: 'Popular'
      },
      {
        id: '2s-25k',
        type: '2-Step',
        size: 25000,
        label: '$25,000',
        price: 199,
        targetPercent: 10,
        targetAmount: 2500,
        dailyDrawdown: 1250,
        maxDrawdown: 2500,
        profitSplit: 85,
        tradingDays: '5–60',
        leverage: '1:100',
        badge: 'Recommended'
      },
      {
        id: '2s-50k',
        type: '2-Step',
        size: 50000,
        label: '$50,000',
        price: 329,
        targetPercent: 10,
        targetAmount: 5000,
        dailyDrawdown: 2500,
        maxDrawdown: 5000,
        profitSplit: 85,
        tradingDays: '5–60',
        leverage: '1:100',
        badge: 'Pro Tier'
      },
      {
        id: '2s-100k',
        type: '2-Step',
        size: 100000,
        label: '$100,000',
        price: 599,
        targetPercent: 10,
        targetAmount: 10000,
        dailyDrawdown: 5000,
        maxDrawdown: 10000,
        profitSplit: 90,
        tradingDays: '5–60',
        leverage: '1:100',
        badge: 'High Roller'
      },
      {
        id: 'ins-200k',
        type: 'Instant Funded',
        size: 200000,
        label: '$200,000',
        price: 999,
        targetPercent: 8,
        targetAmount: 16000,
        dailyDrawdown: 10000,
        maxDrawdown: 20000,
        profitSplit: 90,
        tradingDays: 'Immediate live allocation',
        leverage: '1:30',
        badge: 'Apex Instant'
      }
    ];

    // Audio Micro-feedback Synthesis (Web Audio API)
    const playFinAudio = (type) => {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;
        if (type === 'tick') {
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.04);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.start(now);
          osc.stop(now + 0.04);
        } else if (type === 'win') {
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(523.25, now); // C5
          osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
          osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
          osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
          osc.start(now);
          osc.stop(now + 0.55);
        }
      } catch (e) {
        // Silent graceful fallback if audio is restricted
      }
    };

    // ==========================================
    // 2. ICON COMPONENTS (Fintech-Native SVGs)
    // ==========================================
    const Icon = ({ name, className = "w-5 h-5", color = "currentColor" }) => {
      switch (name) {
        case 'corridor':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 5h18M3 19h18" strokeDasharray="2 2" />
              <path d="M4 12c3-4 6-2 9-5s5 2 7-1" stroke="#2EE6A6" strokeWidth="2" />
              <circle cx="20" cy="6" r="2.5" fill="#2EE6A6" />
            </svg>
          );
        case 'dashboard':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="9" rx="1.5" />
              <rect x="14" y="3" width="7" height="5" rx="1.5" />
              <rect x="14" y="12" width="7" height="9" rx="1.5" />
              <rect x="3" y="16" width="7" height="5" rx="1.5" />
            </svg>
          );
        case 'chart':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 20h18" />
              <path d="M6 16l4-6 4 4 6-8" stroke="#11D6FF" strokeWidth="2" />
            </svg>
          );
        case 'trophy':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
              <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
              <path d="M4 22h16" />
              <path d="M10 14.66V17c0 .55-.45 1-1 1H7" />
              <path d="M14 14.66V17c0 .55.45 1 1 1h2" />
              <path d="M18 2H6v7a6 6 0 0 0 12 0V2z" />
            </svg>
          );
        case 'wallet':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
              <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
              <path d="M18 12a2 2 0 0 0 0 4h4v-4z" />
            </svg>
          );
        case 'spin':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3v9l6 3" stroke="#11D6FF" />
              <circle cx="12" cy="12" r="2" fill="#11D6FF" />
            </svg>
          );
        case 'shield':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          );
        case 'terminal':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 17 10 11 4 5" />
              <line x1="12" y1="19" x2="20" y2="19" />
            </svg>
          );
        case 'check':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          );
        case 'chevronRight':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          );
        case 'arrowUpRight':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          );
        case 'sun':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
          );
        case 'moon':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
              <path d="M21 12.8A8.5 8.5 0 1 1 11.2 3 6.7 6.7 0 0 0 21 12.8z" />
            </svg>
          );
        case 'monitor':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
              <rect x="3" y="4" width="18" height="13" rx="2" />
              <path d="M8 21h8M12 17v4" />
            </svg>
          );
        case 'bell':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          );
        case 'user':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          );
        case 'award':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
          );
        case 'lock':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          );
        case 'headset':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
              <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
            </svg>
          );
        case 'copy':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          );
        case 'eye':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          );
        case 'eyeOff':
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          );
        default:
          return (
            <svg className={className} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
              <circle cx="12" cy="12" r="10" />
            </svg>
          );
      }
    };

    // ==========================================
    // 3. CAPTRIX CORRIDOR VISUALIZATION ENGINE
    // ==========================================
    // Visualizing Starting Capital sandwiched between Profit Target and Drawdown Limits
    const CaptrixCorridor = ({ challenge, interactive = true, onSelectSize }) => {
      const [hoverPoint, setHoverPoint] = useState(null);

      const targetValue = challenge.size + challenge.targetAmount;
      const dailyDdValue = challenge.size - challenge.dailyDrawdown;
      const maxDdValue = challenge.size - challenge.maxDrawdown;

      // Simulated equity curve traversing safely within the corridor
      const equityPoints = useMemo(() => {
        const points = [
          { p: 0, val: challenge.size },
          { p: 15, val: challenge.size + challenge.targetAmount * 0.18 },
          { p: 32, val: challenge.size - challenge.dailyDrawdown * 0.35 },
          { p: 48, val: challenge.size + challenge.targetAmount * 0.45 },
          { p: 65, val: challenge.size + challenge.targetAmount * 0.32 },
          { p: 82, val: challenge.size + challenge.targetAmount * 0.78 },
          { p: 100, val: challenge.size + challenge.targetAmount * 0.94 }
        ];
        return points;
      }, [challenge]);

      // Generate SVG path string
      const svgHeight = 220;
      const svgWidth = 720;
      const range = (targetValue * 1.05) - (maxDdValue * 0.95);
      
      const getY = (val) => {
        const norm = (targetValue * 1.04 - val) / range;
        return 18 + norm * (svgHeight - 36);
      };

      const pathData = equityPoints.reduce((acc, pt, idx) => {
        const x = (pt.p / 100) * svgWidth;
        const y = getY(pt.val);
        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
      }, "");

      return (
        <div className="relative w-full rounded-2xl bg-surface-subtle border border-surface-border p-4 sm:p-6 lg:p-7 overflow-hidden shadow-2xl backdrop-blur-xl">
          {/* Subtle Ambient Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-brand-cyan/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-fin-loss/5 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

          {/* Corridor Header Status */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium tracking-wide bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan animate-pulse"></span>
                  THE CAPTRIX CORRIDOR
                </span>
                <span className="text-xs text-slate-400 font-mono tracking-tight">DYNAMIC RISK ENGINE</span>
              </div>
              <h3 className="font-sora text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
                Account Architecture: <span className="text-brand-cyan">{challenge.label}</span>
              </h3>
            </div>

            {/* Quick account tier switcher pills */}
            {interactive && onSelectSize && (
              <div className="flex flex-wrap items-center gap-1.5 bg-surface p-1 rounded-xl border border-surface-border">
                {CHALLENGE_DATA.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      playFinAudio('tick');
                      onSelectSize(c);
                    }}
                    className={`px-2.5 py-1 text-xs font-mono rounded-lg transition-all ${
                      c.id === challenge.id
                        ? 'bg-gradient-to-r from-brand-cyan to-brand-blue text-bg font-semibold shadow-cyan-sm'
                        : 'text-slate-400 hover:text-white hover:bg-surface-elevated'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* SVG Visual Financial Corridor */}
          <div className="relative w-full overflow-x-auto pb-2">
            <div className="min-w-[560px] relative">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-48 sm:h-56 select-none overflow-visible">
                <defs>
                  {/* Linear gradients */}
                  <linearGradient id="corridorSafeZone" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2EE6A6" stopOpacity="0.12" />
                    <stop offset="50%" stopColor="#11D6FF" stopOpacity="0.04" />
                    <stop offset="100%" stopColor="#FF5C6C" stopOpacity="0.1" />
                  </linearGradient>
                  <linearGradient id="equityStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#1478FF" />
                    <stop offset="70%" stopColor="#11D6FF" />
                    <stop offset="100%" stopColor="#2EE6A6" />
                  </linearGradient>
                </defs>

                {/* Corridor Safe Boundary Fill */}
                <rect 
                  x="0" 
                  y={getY(targetValue)} 
                  width={svgWidth} 
                  height={Math.max(0, getY(maxDdValue) - getY(targetValue))} 
                  fill="url(#corridorSafeZone)"
                />

                {/* Upper Limit: Profit Target Line */}
                <line 
                  x1="0" y1={getY(targetValue)} 
                  x2={svgWidth} y2={getY(targetValue)} 
                  stroke="#2EE6A6" strokeWidth="1.5" strokeDasharray="5 5" 
                />
                
                {/* Center Baseline: Starting Balance */}
                <line 
                  x1="0" y1={getY(challenge.size)} 
                  x2={svgWidth} y2={getY(challenge.size)} 
                  stroke="#11D6FF" strokeWidth="1.2" strokeOpacity="0.6" 
                />

                {/* Intermediate Warning: Daily Drawdown Limit */}
                <line 
                  x1="0" y1={getY(dailyDdValue)} 
                  x2={svgWidth} y2={getY(dailyDdValue)} 
                  stroke="#FFB547" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.7"
                />

                {/* Lower Boundary: Max Drawdown Liquidation Barrier */}
                <line 
                  x1="0" y1={getY(maxDdValue)} 
                  x2={svgWidth} y2={getY(maxDdValue)} 
                  stroke="#FF5C6C" strokeWidth="1.8" 
                />

                {/* Dynamic Equity Curve */}
                <path 
                  d={pathData} 
                  fill="none" 
                  stroke="url(#equityStroke)" 
                  strokeWidth="3.2" 
                  strokeLinecap="round"
                  className="transition-all duration-700 ease-out drop-shadow-[0_2px_12px_rgba(17,214,255,0.4)]"
                />

                {/* Target achieved halo marker */}
                {equityPoints.map((pt, i) => {
                  const cx = (pt.p / 100) * svgWidth;
                  const cy = getY(pt.val);
                  return (
                    <g key={i} className="cursor-pointer group" onMouseEnter={() => setHoverPoint(pt)}>
                      <circle cx={cx} cy={cy} r="4.5" fill="#0b0c10" stroke="#11D6FF" strokeWidth="2.5" />
                      <circle cx={cx} cy={cy} r="9" fill="#11D6FF" opacity="0.15" className="group-hover:opacity-40 transition-opacity" />
                    </g>
                  );
                })}
              </svg>

              {/* Float Labels for Markers */}
              <div className="absolute left-2 top-1 font-mono text-[11px] text-fin-profit flex items-center gap-1.5 bg-bg/80 px-2 py-0.5 rounded border border-fin-profit/30 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-fin-profit"></span>
                PROFIT TARGET: +${challenge.targetAmount.toLocaleString()} ({challenge.targetPercent}%) → ${targetValue.toLocaleString()}
              </div>

              <div className="absolute left-2 top-1/2 -translate-y-1/2 font-mono text-[11px] text-brand-cyan flex items-center gap-1.5 bg-bg/80 px-2 py-0.5 rounded border border-brand-cyan/30 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
                START BALANCE: ${challenge.size.toLocaleString()}
              </div>

              <div className="absolute left-2 bottom-1 font-mono text-[11px] text-fin-loss flex items-center gap-1.5 bg-bg/80 px-2 py-0.5 rounded border border-fin-loss/30 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-fin-loss"></span>
                MAX DRAWDOWN FLOOR: -${challenge.maxDrawdown.toLocaleString()} → ${maxDdValue.toLocaleString()}
              </div>
            </div>
          </div>

          {/* Interactive Metric Cards beneath the corridor */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-5 border-t border-surface-border">
            <div className="p-3 rounded-xl bg-surface/60 border border-surface-border">
              <span className="text-[11px] font-mono text-slate-400 block uppercase tracking-wider">Starting Capital</span>
              <span className="font-mono text-base sm:text-lg font-bold text-white mt-0.5 block">
                ${challenge.size.toLocaleString()}
              </span>
              <span className="text-[10px] text-brand-cyan font-mono">100% Capital Base</span>
            </div>

            <div className="p-3 rounded-xl bg-surface/60 border border-surface-border">
              <span className="text-[11px] font-mono text-fin-profit block uppercase tracking-wider">Profit Objective</span>
              <span className="font-mono text-base sm:text-lg font-bold text-fin-profit mt-0.5 block">
                +${challenge.targetAmount.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Target: {challenge.targetPercent}%</span>
            </div>

            <div className="p-3 rounded-xl bg-surface/60 border border-surface-border">
              <span className="text-[11px] font-mono text-fin-warning block uppercase tracking-wider">Daily Loss Limit</span>
              <span className="font-mono text-base sm:text-lg font-bold text-fin-warning mt-0.5 block">
                -${challenge.dailyDrawdown.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Server reset @ 00:00 UTC</span>
            </div>

            <div className="p-3 rounded-xl bg-surface/60 border border-surface-border">
              <span className="text-[11px] font-mono text-fin-loss block uppercase tracking-wider">Max Drawdown Guard</span>
              <span className="font-mono text-base sm:text-lg font-bold text-fin-loss mt-0.5 block">
                -${challenge.maxDrawdown.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">Dynamic trailing floor</span>
            </div>
          </div>
        </div>
      );
    };

    // ==========================================
    // 4. SPIN & WIN — SVG wheel with visible prize board (prototype only:
    // in production the outcome MUST be decided server-side)
    // ==========================================
    const SPIN_COST = 100;
    const SPIN_SEGMENTS = [
      { label: '$25K', sub: 'ACCOUNT', prize: true },
      { label: 'TRY AGAIN', prize: false },
      { label: '$1K', sub: 'ACCOUNT', prize: true },
      { label: 'TRY AGAIN', prize: false },
      { label: '$5K', sub: 'ACCOUNT', prize: true },
      { label: 'TRY AGAIN', prize: false },
      { label: '$10K', sub: 'ACCOUNT', prize: true },
      { label: 'TRY AGAIN', prize: false },
    ];
    const SpinAndWinEngine = ({ userCredits, onCreditChange, addNotification }) => {
      const [rot, setRot] = useState(0);
      const [spinning, setSpinning] = useState(false);
      const [result, setResult] = useState(null);
      const [activity, setActivity] = useState([
        { id: 1, what: '$5K ACCOUNT' }, { id: 2, what: 'TRY AGAIN' }, { id: 3, what: '$1K ACCOUNT' },
      ]);
      const pending = useRef(null);
      const timer = useRef(null);
      const closeRef = useRef(null);
      const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const canSpin = !spinning && userCredits >= SPIN_COST;
      const N = SPIN_SEGMENTS.length, ARC = 360 / N, R = 172;
      const pt = (deg, r) => [(r * Math.sin(deg * Math.PI / 180)).toFixed(2), (-r * Math.cos(deg * Math.PI / 180)).toFixed(2)];

      const finish = useCallback(() => {
        const seg = pending.current;
        if (!seg) return;
        pending.current = null;
        clearTimeout(timer.current);
        setSpinning(false);
        setResult(seg);
        setActivity(a => [{ id: Date.now(), what: seg.prize ? `${seg.label} ${seg.sub}` : seg.label, you: true }, ...a.slice(0, 4)]);
        if (seg.prize && addNotification) {
          addNotification({ id: Date.now(), title: 'Spin & Win result', desc: `Congratulations! You won ${seg.label} Funded Account. (Prototype result)`, type: 'reward', time: 'Just now' });
        }
        playFinAudio(seg.prize ? 'win' : 'tick');
      }, [addNotification]);

      const handleSpin = () => {
        if (!canSpin) return;
        onCreditChange(-SPIN_COST);
        const idx = Math.floor(Math.random() * N);
        pending.current = SPIN_SEGMENTS[idx];
        setResult(null);
        setSpinning(true);
        const turns = 5 + Math.floor(Math.random() * 3);
        const target = rot - (rot % 360) + turns * 360 + ((360 - idx * ARC) % 360);
        setRot(target);
        timer.current = setTimeout(finish, reduce ? 400 : 5500); // fallback if transitionend is missed
      };

      useEffect(() => () => clearTimeout(timer.current), []);
      useEffect(() => {
        if (!result) return;
        closeRef.current && closeRef.current.focus();
        const onKey = (e) => { if (e.key === 'Escape') setResult(null); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
      }, [result]);

      const prizes = SPIN_SEGMENTS.filter(s => s.prize);

      return (
        <div className="cx-glass relative rounded-2xl p-5 sm:p-8 overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold tracking-widest bg-fin-warning/15 text-fin-warning border border-fin-warning/40">LIMITED EVENT</span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono text-slate-400 border border-surface-border">Prototype · outcome is simulated</span>
          </div>
          <h2 className="font-sora text-2xl sm:text-4xl font-extrabold text-white leading-tight">CAPTRIX Funded Spin & Win</h2>
          <p className="text-sm text-slate-400 mt-2 max-w-xl">Spin the wheel with credits for trading rewards, discounts and funded-account prizes.</p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-center">
            <div className="lg:col-span-7 flex flex-col items-center min-w-0">
              <div className="relative mx-auto w-full max-w-[360px] lg:max-w-[440px] aspect-square">
                <div className="absolute inset-[6%] rounded-full bg-brand-cyan/20 blur-3xl pointer-events-none" aria-hidden="true"></div>
                <svg viewBox="-208 -214 416 422" className="relative w-full h-full" role="img" aria-label={`Prize wheel with 8 segments: ${SPIN_SEGMENTS.map(s => s.prize ? s.label + ' account' : s.label).join(', ')}`}>
                  <defs>
                    <linearGradient id="cxPrize" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#11D6FF" stopOpacity=".42" /><stop offset="1" stopColor="#1478FF" stopOpacity=".3" /></linearGradient>
                    <radialGradient id="cxHub" cx=".35" cy=".3" r="1"><stop offset="0" stopColor="#5fe8ff" /><stop offset="1" stopColor="#1478FF" /></radialGradient>
                  </defs>
                  <circle r="196" className="cx-wheel-rim" strokeWidth="2" />
                  <g style={{ transform: `rotate(${rot}deg)`, transformOrigin: '0px 0px', transition: spinning && !reduce ? 'transform 5.2s cubic-bezier(.12,.6,.1,1)' : 'none', willChange: 'transform' }} onTransitionEnd={(e) => { if (e.target === e.currentTarget) finish(); }}>
                    {SPIN_SEGMENTS.map((s, i) => {
                      const [x1, y1] = pt(i * ARC - ARC / 2, R), [x2, y2] = pt(i * ARC + ARC / 2, R);
                      return (
                        <g key={i}>
                          <path d={`M0 0L${x1} ${y1}A${R} ${R} 0 0 1 ${x2} ${y2}Z`} className={s.prize ? 'cx-seg-prize' : 'cx-seg-miss'} strokeWidth="1.5" />
                          <text transform={`rotate(${i * ARC - 90})`} x={R - 16} y="0" textAnchor="end" dominantBaseline="central" className={s.prize ? 'cx-txt-prize' : 'cx-txt-miss'}>
                            {s.prize ? (<><tspan fontFamily="Sora, sans-serif" fontWeight="800" fontSize="24">{s.label}</tspan><tspan dx="6" fontFamily="JetBrains Mono, monospace" fontWeight="600" fontSize="9" letterSpacing="1">{s.sub}</tspan></>)
                              : (<tspan fontFamily="JetBrains Mono, monospace" fontWeight="600" fontSize="11" letterSpacing="1.5">{s.label}</tspan>)}
                          </text>
                        </g>
                      );
                    })}
                    {Array.from({ length: 48 }, (_, i) => { const [a, b] = pt(i * 7.5, 180), [c, d] = pt(i * 7.5, i % 6 === 0 ? 191 : 187); return <line key={i} x1={a} y1={b} x2={c} y2={d} className="cx-seg-line" strokeWidth={i % 6 === 0 ? 2 : 1} />; })}
                  </g>
                  <circle r="38" fill="#0b0c10" stroke="#11D6FF" strokeWidth="2.5" />
                  <image href="./assets/logo-dark.png" x="-27" y="-27" width="54" height="54" />
                  <polygon points="-13,-212 13,-212 0,-170" fill="#fff" stroke="#11D6FF" strokeWidth="2.5" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="mt-6 w-full max-w-[360px] flex flex-col items-stretch gap-2">
                <button onClick={handleSpin} disabled={!canSpin} className={`cx-spin-btn w-full min-h-[52px] px-6 rounded-xl font-sora font-bold text-sm tracking-wide uppercase transition-all ${canSpin ? 'bg-gradient-to-r from-brand-cyan to-brand-blue text-bg shadow-cyan-glow active:scale-[.985]' : 'bg-surface-elevated text-slate-500 cursor-not-allowed border border-surface-border'}`}>
                  {spinning ? 'Spinning…' : `SPIN NOW - ${SPIN_COST} CREDITS`}
                </button>
                <p className="text-xs font-mono text-slate-400 text-center" aria-live="polite">
                  Your balance: <span className="text-fin-profit font-bold">{userCredits} credits</span>
                  {userCredits < SPIN_COST && !spinning && <span className="block mt-1 text-fin-warning">You need {SPIN_COST} credits to spin. Earn more in Rewards.</span>}
                </p>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col gap-4 min-w-0">
              <div className="cx-inset rounded-xl p-4">
                <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400 mb-3">Prize board</div>
                <ul className="divide-y divide-surface-border/50">
                  {prizes.map(p => (
                    <li key={p.label} className="flex items-center justify-between py-2.5">
                      <span className="font-mono text-lg font-semibold text-white">{p.label} <span className="text-[11px] text-slate-400">{p.sub}</span></span>
                      <span className="text-[11px] font-mono text-brand-cyan">Funded account</span>
                    </li>
                  ))}
                  <li className="flex items-center justify-between py-2.5"><span className="font-mono text-sm text-slate-400">TRY AGAIN</span><span className="text-[11px] font-mono text-slate-500">No prize</span></li>
                </ul>
              </div>
              <div className="cx-inset rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400">Recent activity</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-fin-warning/40 text-fin-warning">Sample activity</span>
                </div>
                <ul className="space-y-2">
                  {activity.map(a => (
                    <li key={a.id} className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">{a.you ? 'You' : 'Sample trader'}</span>
                      <span className="font-mono text-brand-cyan">{a.what}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {result && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 cx-scrim" onClick={() => setResult(null)}>
              <div role="dialog" aria-modal="true" aria-label="Spin result" onClick={(e) => e.stopPropagation()} className="cx-glass cx-pop rounded-2xl p-6 sm:p-8 w-full max-w-md text-center">
                <span className={`text-[11px] font-mono tracking-widest ${result.prize ? 'text-fin-profit' : 'text-slate-400'}`}>{result.prize ? 'PROTOTYPE PRIZE' : 'NO PRIZE THIS TIME'}</span>
                <h3 className="font-sora text-4xl font-extrabold text-white mt-2">{result.prize ? `${result.label} ${result.sub}` : 'TRY AGAIN'}</h3>
                <p className="text-sm text-slate-400 mt-3">{result.prize ? 'Simulated result for this prototype. No real account was issued.' : 'Spin again to keep going.'}</p>
                <div className="mt-6 flex gap-3">
                  <button ref={closeRef} onClick={() => setResult(null)} className="flex-1 min-h-[48px] rounded-xl border border-surface-border text-white font-semibold text-sm">Close</button>
                  <button onClick={() => { setResult(null); setTimeout(handleSpin, 50); }} disabled={userCredits < SPIN_COST} className="flex-1 min-h-[48px] rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-bg font-sora font-bold text-sm disabled:opacity-40">Spin again</button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    };

    // ==========================================
    // BRAND LOGO + PUBLIC SITE MENU (right-hand drawer)
    // ==========================================
    const CaptrixLogo = ({ className = 'w-9 h-9' }) => (
      <span className={`cx-logo block shrink-0 ${className}`} aria-hidden="true">
        <img src="./assets/logo-dark.png" alt="" width="64" height="64" decoding="async" className="cx-logo-dark w-full h-full object-contain" />
        <img src="./assets/logo-light.png" alt="" width="64" height="64" decoding="async" className="cx-logo-light w-full h-full object-contain" />
      </span>
    );

    // Floating "back to top" arrow (public homepage only)
    const BackToTop = () => {
      const [show, setShow] = useState(false);
      useEffect(() => {
        const onScroll = () => setShow(window.scrollY > 600);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
      }, []);
      const goTop = () => {
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      };
      return (
        <button onClick={goTop} aria-label="Back to top" aria-hidden={!show} tabIndex={show ? 0 : -1} className={`cx-top ${show ? 'is-on' : ''}`}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 16V4M4.5 9.5L10 4l5.5 5.5" /></svg>
        </button>
      );
    };

    const SITE_MENU = [
      { href: '#corridor-hero', label: 'The Corridor', hint: 'Target, start balance and drawdown limits' },
      { href: '#marketplace', label: 'Challenges', hint: 'Pick a size and see every limit' },
      { href: '#how-it-works', label: 'How It Works', hint: 'From evaluation to funded account' },
      { href: '#faq', label: 'FAQ', hint: 'Quick answers' },
    ];

    const PublicDrawer = ({ open, onClose, onLogin, onGetFunded }) => {
      const closeRef = useRef(null);
      const closeFn = useRef(onClose);
      closeFn.current = onClose;
      useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        closeRef.current && closeRef.current.focus();
        const onKey = (e) => { if (e.key === 'Escape') closeFn.current(); };
        window.addEventListener('keydown', onKey);
        return () => { document.body.style.overflow = prev; window.removeEventListener('keydown', onKey); };
      }, [open]);
      if (!open) return null;
      return (
        <div id="cx-site-menu" className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-label="Site menu">
          <div className="cx-scrim absolute inset-0" onClick={onClose}></div>
          <aside className="cx-glass cx-drawer absolute right-0 top-0 h-full w-[min(24rem,92vw)] flex flex-col">
            <div className="flex items-center justify-between gap-3 p-5 pb-4 border-b border-surface-border">
              <div className="flex items-center gap-3 min-w-0">
                <CaptrixLogo className="w-10 h-10" />
                <span className="font-sora font-extrabold text-white tracking-wider truncate">CAPTRIX <span className="cx-grad-text">FUNDED</span></span>
              </div>
              <button ref={closeRef} onClick={onClose} aria-label="Close menu" className="cx-icon-btn">
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4l12 12M16 4L4 16" /></svg>
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto px-5 py-3" aria-label="Site">
              <ul>
                {SITE_MENU.map((it, i) => (
                  <li key={it.href}>
                    <a href={it.href} onClick={onClose} className="cx-nav-item" style={{ animationDelay: `${90 + i * 55}ms` }}>
                      <span className="min-w-0">
                        <span className="block font-sora font-bold text-xl text-white">{it.label}</span>
                        <span className="block text-xs text-slate-400 mt-0.5">{it.hint}</span>
                      </span>
                      <svg className="shrink-0 text-brand-cyan" width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10h11M11 5l5 5-5 5" /></svg>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="p-5 pt-4 border-t border-surface-border space-y-3" style={{ paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))' }}>
              <button onClick={() => { onClose(); onGetFunded(); }} className="w-full min-h-[52px] rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-bg font-sora font-bold text-sm uppercase tracking-wide">Get Funded</button>
              <button onClick={() => { onClose(); onLogin(); }} className="w-full min-h-[48px] rounded-xl border border-surface-border text-white font-mono text-xs uppercase tracking-wider">Login</button>
              <p className="text-center text-[11px] font-mono text-slate-500">Trade Bold. Get Funded.</p>
            </div>
          </aside>
        </div>
      );
    };

    // ==========================================
    // 5. INTERACTIVE CHALLENGE MARKETPLACE
    // ==========================================
    const ChallengeMarketplace = ({ onSelectTier, onCheckout }) => {
      const [stepFilter, setStepFilter] = useState('ALL'); // ALL, 1-Step, 2-Step, Instant Funded
      const [selectedId, setSelectedId] = useState('2s-100k');

      const filteredChallenges = useMemo(() => {
        if (stepFilter === 'ALL') return CHALLENGE_DATA;
        return CHALLENGE_DATA.filter(c => c.type === stepFilter);
      }, [stepFilter]);

      const activeChallenge = useMemo(() => {
        return CHALLENGE_DATA.find(c => c.id === selectedId) || CHALLENGE_DATA[5];
      }, [selectedId]);

      return (
        <div id="marketplace" className="py-12 sm:py-20 border-t border-surface-border relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <span className="text-xs font-mono font-medium tracking-widest text-brand-cyan uppercase bg-brand-cyan/10 px-3 py-1 rounded-full border border-brand-cyan/20">
                  PRODUCT CONFIGURATOR
                </span>
                <h2 className="font-sora text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-3 tracking-tight">
                  Select Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">Capital Scale</span>
                </h2>
                <p className="text-sm sm:text-base text-slate-400 mt-2 max-w-xl">
                  Choose between rapid 1-Step evaluations, institutional 2-Step programs, or Instant live allocation with up to 90% profit splits.
                </p>
              </div>

              {/* Filter Tabs */}
              <div className="flex flex-wrap gap-2 bg-surface-subtle p-1.5 rounded-xl border border-surface-border">
                {['ALL', '1-Step', '2-Step', 'Instant Funded'].map(type => (
                  <button
                    key={type}
                    onClick={() => {
                      playFinAudio('tick');
                      setStepFilter(type);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                      stepFilter === type
                        ? 'bg-brand-cyan text-bg shadow-cyan-sm'
                        : 'text-slate-400 hover:text-white hover:bg-surface'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Horizontal Account Selection Scroller */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-8">
              {filteredChallenges.map(c => {
                const isSelected = c.id === selectedId;
                return (
                  <button
                    key={c.id}
                    onClick={() => {
                      playFinAudio('tick');
                      setSelectedId(c.id);
                      if (onSelectTier) onSelectTier(c);
                    }}
                    className={`p-3.5 rounded-xl text-left transition-all border relative flex flex-col justify-between ${
                      isSelected
                        ? 'bg-surface-elevated border-brand-cyan shadow-cyan-sm'
                        : 'bg-surface border-surface-border hover:border-slate-600'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute -top-2 right-2 w-2 h-2 rounded-full bg-brand-cyan animate-ping"></span>
                    )}
                    <div>
                      <span className="text-[10px] font-mono uppercase text-slate-400 block">{c.type}</span>
                      <span className="font-sora text-base sm:text-lg font-bold text-white block mt-0.5">{c.label}</span>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-brand-cyan">${c.price}</span>
                      <span className="text-[10px] font-mono text-fin-profit">{c.profitSplit}% Split</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* In-Depth Technical Specification Engine & Corridor */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left 7 Columns: Real-Time Dynamic Corridor */}
              <div className="lg:col-span-7 space-y-6">
                <CaptrixCorridor challenge={activeChallenge} interactive={false} />
                
                {/* Rule Breakdown Card */}
                <div className="p-6 rounded-2xl bg-surface border border-surface-border">
                  <h4 className="font-sora text-sm font-semibold text-white uppercase tracking-wider font-mono mb-4 flex items-center gap-2">
                    <Icon name="shield" className="w-4 h-4 text-brand-cyan" />
                    Evaluation Risk Protocol: {activeChallenge.label} Tier
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border">
                      <span className="text-slate-400 block">Leverage</span>
                      <span className="text-white font-bold text-sm mt-1 block">{activeChallenge.leverage}</span>
                      <span className="text-slate-500 text-[10px]">FX, Indices & Crypto</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border">
                      <span className="text-slate-400 block">Trading Days</span>
                      <span className="text-white font-bold text-sm mt-1 block">{activeChallenge.tradingDays}</span>
                      <span className="text-slate-500 text-[10px]">No arbitrary time limits</span>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-subtle border border-surface-border">
                      <span className="text-slate-400 block">Profit Target</span>
                      <span className="text-fin-profit font-bold text-sm mt-1 block">${activeChallenge.targetAmount.toLocaleString()} ({activeChallenge.targetPercent}%)</span>
                      <span className="text-slate-500 text-[10px]">Phase pass watermark</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right 5 Columns: Pricing Checkout Configurator */}
              <div className="lg:col-span-5 bg-surface border border-surface-border rounded-2xl p-6 sm:p-7 shadow-2xl relative">
                <div className="absolute top-4 right-4">
                  <span className="px-2.5 py-1 rounded-full text-xs font-mono font-semibold bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/30">
                    {activeChallenge.badge}
                  </span>
                </div>

                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">{activeChallenge.type} Model</span>
                <h3 className="font-sora text-3xl font-extrabold text-white mt-1">
                  {activeChallenge.label} <span className="text-slate-400 font-normal text-base">Allocation</span>
                </h3>

                <div className="mt-6 flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-sora font-extrabold text-white tracking-tight">${activeChallenge.price}</span>
                  <span className="text-xs font-mono text-slate-400">One-time registration fee</span>
                </div>

                {/* Technical Metric List */}
                <div className="mt-6 space-y-3 py-4 border-y border-surface-border text-xs font-mono">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Profit Split Allocation</span>
                    <span className="text-fin-profit font-bold text-sm">{activeChallenge.profitSplit}% Trader Share</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Profit Target</span>
                    <span className="text-white font-bold">${activeChallenge.targetAmount.toLocaleString()} ({activeChallenge.targetPercent}%)</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Daily Drawdown Ceiling</span>
                    <span className="text-fin-warning font-bold">${activeChallenge.dailyDrawdown.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Max Overall Drawdown</span>
                    <span className="text-fin-loss font-bold">${activeChallenge.maxDrawdown.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Reward Credit Grant</span>
                    <span className="text-brand-cyan font-bold">+{(activeChallenge.price * 0.5).toFixed(0)} Spin Credits</span>
                  </div>
                </div>

                {/* Primary CTA button */}
                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => {
                      playFinAudio('tick');
                      onCheckout(activeChallenge);
                    }}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-cyan text-bg font-sora font-bold text-sm tracking-wide shadow-cyan-glow hover:shadow-cyan-glow hover:scale-[1.01] active:scale-[0.99] transition-all uppercase flex items-center justify-center gap-2"
                  >
                    <span>START {activeChallenge.label} EVALUATION</span>
                    <Icon name="arrowUpRight" className="w-4 h-4 text-bg" />
                  </button>

                  <p className="text-[11px] text-center font-mono text-slate-500">
                    Instant automated credentials setup • Zero hidden recurring platform fees
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    // ==========================================
    // 6. HOW IT WORKS / CINEMATIC TIMELINE
    // ==========================================
    const HowItWorksSection = () => {
      const steps = [
        {
          num: "01",
          title: "Select Your Capital Size",
          desc: "Choose an account ranging from $1,000 to $200,000 with 1-Step, 2-Step, or Instant allocation tailored to your risk management profile.",
          tag: "TIER SELECTION"
        },
        {
          num: "02",
          title: "Navigate The Captrix Corridor",
          desc: "Execute your strategy within defined risk boundaries. Keep daily drawdowns and max overall drawdowns disciplined while meeting the profit objective.",
          tag: "DISCIPLINED EXECUTION"
        },
        {
          num: "03",
          title: "Receive Verified Allocation",
          desc: "Once you pass the evaluation threshold, unlock your live funded account credentials with zero capital risk to your personal funds.",
          tag: "PROFIT SPLIT UP TO 90%"
        },
        {
          num: "04",
          title: "Bi-Weekly Payout Distribution",
          desc: "Request on-chain crypto or institutional bank wire payouts with transparent transaction timelines and verified smart accounting.",
          tag: "RELIABLE PAYOUTS"
        }
      ];

      return (
        <div id="how-it-works" className="py-20 border-t border-surface-border relative bg-surface-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-mono font-medium tracking-widest text-brand-cyan uppercase bg-brand-cyan/10 px-3 py-1 rounded-full border border-brand-cyan/20">
                PROVEN TRADER LIFECYCLE
              </span>
              <h2 className="font-sora text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mt-3">
                How Captrix Works
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mt-3">
                A seamless four-step institutional path designed to discover, fund, and scale consistently profitable market operators.
              </p>
            </div>

            {/* Stepper Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
              {steps.map((st, i) => (
                <div 
                  key={st.num}
                  className="bg-surface rounded-2xl border border-surface-border p-6 hover:border-brand-cyan/50 transition-all duration-300 relative group flex flex-col justify-between"
                >
                  <div className="absolute top-4 right-4 text-3xl font-sora font-extrabold text-surface-border group-hover:text-brand-cyan/20 transition-colors">
                    {st.num}
                  </div>
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-brand-cyan uppercase block mb-2">{st.tag}</span>
                    <h3 className="font-sora text-lg font-bold text-white mb-2">{st.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-surface-border/50 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-slate-500">Milestone Phase</span>
                    <div className="w-2 h-2 rounded-full bg-brand-cyan opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    // ==========================================
    // 7. TRADER DASHBOARD SHOWCASE PREVIEW
    // ==========================================
    const DashboardShowcase = ({ onGoToDashboard }) => {
      return (
        <div className="py-20 border-t border-surface-border relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5">
                <span className="text-xs font-mono font-medium tracking-widest text-brand-cyan uppercase bg-brand-cyan/10 px-3 py-1 rounded-full border border-brand-cyan/20">
                  INSTITUTIONAL APPLICATION SHELL
                </span>
                <h2 className="font-sora text-3xl sm:text-4xl font-extrabold text-white mt-3">
                  Your Whole Challenge, On One Screen.
                </h2>
                <p className="text-sm text-slate-400 mt-4 leading-relaxed">
                  The Captrix Dashboard equips traders with live equity trajectory charts, trailing drawdown corridor meters, high-frequency order logs, and instant payout execution.
                </p>

                <div className="mt-6 space-y-3 font-mono text-xs">
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Icon name="check" className="w-4 h-4 text-brand-cyan" />
                    <span>Live Corridor tracking with automated liquidation guards</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Icon name="check" className="w-4 h-4 text-brand-cyan" />
                    <span>Real-time position monitoring & high-density order books</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-slate-300">
                    <Icon name="check" className="w-4 h-4 text-brand-cyan" />
                    <span>Integrated Spin & Win reward terminal & affiliate vault</span>
                  </div>
                </div>

                <div className="mt-8 flex items-center gap-4">
                  <button
                    onClick={onGoToDashboard}
                    className="px-6 py-3.5 rounded-xl bg-brand-cyan text-bg font-sora font-bold text-xs uppercase tracking-wide hover:shadow-cyan-glow transition-all flex items-center gap-2"
                  >
                    <span>LOGIN TO YOUR DASHBOARD</span>
                    <Icon name="chevronRight" className="w-4 h-4 text-bg" />
                  </button>
                </div>
              </div>

              {/* Graphical Preview Card */}
              <div className="lg:col-span-7 bg-surface-subtle p-3 sm:p-5 rounded-2xl border border-surface-border shadow-2xl relative">
                <div className="flex items-center justify-between pb-3 border-b border-surface-border mb-4 px-2">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-fin-loss opacity-70"></div>
                    <div className="w-3 h-3 rounded-full bg-fin-warning opacity-70"></div>
                    <div className="w-3 h-3 rounded-full bg-fin-profit opacity-70"></div>
                    <span className="text-[11px] font-mono text-slate-400 ml-2">captrix-terminal-v4.2 // live</span>
                  </div>
                  <span className="font-mono text-xs text-brand-cyan">$100,000 Tier ACTIVE</span>
                </div>

                {/* Mocked mini terminal */}
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-surface rounded-xl border border-surface-border">
                      <span className="text-[10px] font-mono text-slate-400">Account Equity</span>
                      <span className="text-base font-mono font-bold text-white block mt-0.5">$107,450.20</span>
                      <span className="text-[10px] font-mono text-fin-profit">+7.45% Passed</span>
                    </div>
                    <div className="p-3 bg-surface rounded-xl border border-surface-border">
                      <span className="text-[10px] font-mono text-slate-400">Daily P/L</span>
                      <span className="text-base font-mono font-bold text-fin-profit block mt-0.5">+$1,420.00</span>
                      <span className="text-[10px] font-mono text-slate-400">Drawdown OK</span>
                    </div>
                    <div className="p-3 bg-surface rounded-xl border border-surface-border">
                      <span className="text-[10px] font-mono text-slate-400">Win Rate</span>
                      <span className="text-base font-mono font-bold text-brand-cyan block mt-0.5">68.4%</span>
                      <span className="text-[10px] font-mono text-slate-400">38 Executions</span>
                    </div>
                  </div>

                  {/* Visual Chart Wave */}
                  <div className="h-32 bg-surface rounded-xl p-3 border border-surface-border relative flex items-end">
                    <div className="absolute top-3 left-3 text-[10px] font-mono text-slate-500">TRAJECTORY RUN-UP (M15)</div>
                    <svg className="w-full h-24" viewBox="0 0 500 100" preserveAspectRatio="none">
                      <path 
                        d="M 0 80 Q 80 40 160 60 T 320 20 T 500 10" 
                        fill="none" 
                        stroke="#11D6FF" 
                        strokeWidth="2.5" 
                      />
                      <path 
                        d="M 0 80 Q 80 40 160 60 T 320 20 T 500 10 L 500 100 L 0 100 Z" 
                        fill="rgba(17, 214, 255, 0.08)" 
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    };

    // ==========================================
    // 8. FAQ ACCORDION
    // ==========================================
    const FAQSection = () => {
      const [openIdx, setOpenIdx] = useState(0);

      const faqs = [
        {
          q: "What is The Captrix Corridor and how does it safeguard my capital?",
          a: "The Captrix Corridor is our proprietary visual risk governance framework. It defines the exact trading space between your starting balance, required profit target, and drawdown floor. This guarantees clear boundaries without hidden stop-out triggers."
        },
        {
          q: "What are the rules regarding daily drawdown and max drawdown?",
          a: "Daily drawdown resets at 00:00 UTC based on starting daily balance or equity (whichever is higher). Max overall drawdown is fixed or trailing according to your selected tier (e.g., $10,000 max drawdown on the $100K 2-Step challenge)."
        },
        {
          q: "How does the Spin & Win feature work?",
          a: "Spin & Win is available inside your dashboard. Spend 100 CAPTRIX Credits per spin for a chance at trading rewards, discounts and funded-account prizes. Credits come from platform activity, referrals and community tasks."
        },
        {
          q: "When can I request my first profit payout?",
          a: "Payout schedules and withdrawal eligibility thresholds depend on the evaluation model selected [Captrix to supply specific schedule]. First payouts are accessible directly from your Trader Payout Center."
        },
        {
          q: "Is news trading and overnight weekend holding allowed?",
          a: "Yes, swing holding and major economic event execution are permitted across all standard accounts unless specifically designated by tier parameters [Captrix to supply exact specifications]."
        }
      ];

      return (
        <div id="faq" className="py-20 border-t border-surface-border">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-xs font-mono font-medium tracking-widest text-brand-cyan uppercase bg-brand-cyan/10 px-3 py-1 rounded-full border border-brand-cyan/20">
                KNOWLEDGE BASE
              </span>
              <h2 className="font-sora text-3xl sm:text-4xl font-extrabold text-white mt-3">
                Frequently Answered Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((f, i) => {
                const isOpen = openIdx === i;
                return (
                  <div 
                    key={i} 
                    className="rounded-xl border border-surface-border bg-surface overflow-hidden transition-colors hover:border-slate-700"
                  >
                    <button
                      onClick={() => setOpenIdx(isOpen ? -1 : i)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4"
                    >
                      <span className="font-sora font-semibold text-sm sm:text-base text-white">{f.q}</span>
                      <span className={`text-brand-cyan transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-400 font-mono leading-relaxed border-t border-surface-border/40 pt-3">
                        {f.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      );
    };

    // ==========================================
    // 9. COMPLETE DASHBOARD APPLICATION
    // ==========================================
    const TraderDashboardApp = ({
      initialView = 'overview',
      userCredits,
      onCreditChange,
      onAddNotification,
      onReturnToPublic,
      onOpenNewChallenge,
      notifications,
      onMarkNotificationsRead
    }) => {
      const [currentNav, setCurrentNav] = useState(initialView);
      const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
      const [selectedAccount, setSelectedAccount] = useState('CTX-100K-84920');
      const [themeMode, setThemeMode] = useState(() => {
        try {
          const saved = localStorage.getItem('captrix-theme');
          const mode = ['dark', 'light', 'system'].includes(saved) ? saved : 'dark';
          const effective = mode === 'system'
            ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
            : mode;
          // Apply immediately during initialization so the dashboard never
          // renders one frame in the wrong theme before useEffect runs.
          document.documentElement.dataset.theme = effective;
          return mode;
        } catch {
          document.documentElement.dataset.theme = 'dark';
          return 'dark';
        }
      });
      const [themeMenuOpen, setThemeMenuOpen] = useState(false);
      const themeMenuRef = useRef(null);

      useEffect(() => {
        const applyTheme = () => {
          let effective = themeMode;
          if (themeMode === 'system') {
            effective = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
          }
          document.documentElement.dataset.theme = effective;
          try { localStorage.setItem('captrix-theme', themeMode); } catch {}
        };

        applyTheme();

        if (themeMode === 'system') {
          const media = window.matchMedia('(prefers-color-scheme: light)');
          const handler = () => applyTheme();
          media.addEventListener?.('change', handler);
          return () => media.removeEventListener?.('change', handler);
        }
      }, [themeMode]);

      useEffect(() => {
        const handleOutsideThemeMenu = (event) => {
          if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
            setThemeMenuOpen(false);
          }
        };
        document.addEventListener('pointerdown', handleOutsideThemeMenu);
        return () => document.removeEventListener('pointerdown', handleOutsideThemeMenu);
      }, []);

      // Sample Accounts Data
      const accountsList = [
        { id: 'CTX-100K-84920', size: 100000, equity: 106450.00, balance: 105200.00, type: '2-Step ($100K)', status: 'Active Evaluation', target: 10000, targetCurrent: 6450, ddDaily: 1100, ddMax: 2400 },
        { id: 'CTX-25K-11204', size: 25000, equity: 26150.80, balance: 26150.80, type: '2-Step ($25K)', status: 'Funded Live', target: 2500, targetCurrent: 2500, ddDaily: 250, ddMax: 600 }
      ];

      const currentAcc = accountsList.find(a => a.id === selectedAccount) || accountsList[0];

      // Simulated Trade History Table
      const [orders, setOrders] = useState([
        { id: 'ORD-9841', symbol: 'EURUSD', side: 'BUY', size: '10.00', entry: '1.08420', exit: '1.08940', pl: '+5,200.00', time: '14:20:12 UTC', status: 'CLOSED' },
        { id: 'ORD-9839', symbol: 'NAS100', side: 'BUY', size: '5.00', entry: '18,120.00', exit: '18,240.50', pl: '+6,025.00', time: '11:05:44 UTC', status: 'CLOSED' },
        { id: 'ORD-9835', symbol: 'XAUUSD', side: 'SELL', size: '4.00', entry: '2,340.50', exit: '2,352.00', pl: '-4,600.00', time: 'Yesterday', status: 'CLOSED' },
        { id: 'ORD-9828', symbol: 'GBPUSD', side: 'BUY', size: '8.00', entry: '1.26100', exit: '1.26720', pl: '+4,960.00', time: 'Yesterday', status: 'CLOSED' },
        { id: 'ORD-9820', symbol: 'US30', side: 'SELL', size: '2.50', entry: '39,100.00', exit: '39,180.00', pl: '-2,000.00', time: '22 May', status: 'CLOSED' }
      ]);

      // Navigation Structure
      const navSections = [
        {
          heading: "TRADING",
          items: [
            { id: 'overview', label: 'Overview', icon: 'dashboard' },
            { id: 'challenges', label: 'Challenges', icon: 'trophy' },
            { id: 'terminal', label: 'Trading Desk', icon: 'terminal' },
            { id: 'accounts', label: 'Accounts', icon: 'wallet' },
          ]
        },
        {
          heading: "PERFORMANCE",
          items: [
            { id: 'analytics', label: 'Analytics', icon: 'chart' },
            { id: 'payouts', label: 'Payouts', icon: 'wallet' },
            { id: 'orders', label: 'Order Log', icon: 'terminal' },
            { id: 'certificates', label: 'Certificates', icon: 'award' },
          ]
        },
        {
          heading: "COMMUNITY",
          items: [
            { id: 'affiliate', label: 'Affiliate Portal', icon: 'user' },
            { id: 'rewards', label: 'Rewards Hub', icon: 'award' },
            { id: 'spin', label: 'Spin & Win', icon: 'spin' },
          ]
        },
        {
          heading: "ACCOUNT",
          items: [
            { id: 'profile', label: 'Trader Profile', icon: 'user' },
            { id: 'kyc', label: 'KYC Verification', icon: 'shield' },
            { id: 'security', label: 'Security & 2FA', icon: 'lock' },
          ]
        },
        {
          heading: "SUPPORT",
          items: [
            { id: 'support', label: 'Support Desk', icon: 'headset' },
          ]
        }
      ];

      return (
        <div className="min-h-screen bg-bg flex text-slate-200">
          {/* DESKTOP SIDEBAR */}
          <aside className="hidden lg:flex flex-col w-64 bg-surface border-r border-surface-border select-none shrink-0 h-screen sticky top-0 overflow-y-auto">
            {/* Logo */}
            <div className="p-5 border-b border-surface-border flex items-center justify-between">
              <button onClick={onReturnToPublic} className="flex items-center gap-3 text-left">
                <CaptrixLogo className="w-9 h-9" />
                <span className="font-sora font-extrabold text-lg text-white tracking-wider">
                  CAPTRIX <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">FUNDED</span>
                </span>
              </button>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/20">
                PORTAL
              </span>
            </div>

            {/* Persistent CTA: + New Challenge */}
            <div className="p-4">
              <button
                onClick={onOpenNewChallenge}
                className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-bg font-sora font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-cyan-sm hover:brightness-110 transition-all"
              >
                <span>+ NEW CHALLENGE</span>
              </button>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 px-3 py-2 space-y-6">
              {navSections.map(sec => (
                <div key={sec.heading}>
                  <div className="px-3 text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-1.5">
                    {sec.heading}
                  </div>
                  <div className="space-y-1">
                    {sec.items.map(item => {
                      const isActive = currentNav === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => {
                            playFinAudio('tick');
                            setCurrentNav(item.id);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-mono font-medium transition-all ${
                            isActive
                              ? 'bg-surface-elevated text-brand-cyan border border-brand-cyan/30 shadow-sm'
                              : 'text-slate-400 hover:text-white hover:bg-surface-elevated/50'
                          }`}
                        >
                          <Icon name={item.icon} className={`w-4 h-4 ${isActive ? 'text-brand-cyan' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Trader Mini Profile Footer */}
            <div className="p-4 border-t border-surface-border bg-surface-subtle">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan flex items-center justify-center font-mono font-bold text-xs">
                  CP
                </div>
                <div className="overflow-hidden">
                  <span className="font-sora text-xs font-semibold text-white block truncate">Captrix Verified</span>
                  <span className="font-mono text-[10px] text-slate-400 block truncate">trader@captrix.com</span>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* TOP BAR */}
            <header className="dashboard-topbar min-h-16 bg-surface border-b border-surface-border px-3 sm:px-6 py-2 flex items-center justify-between gap-2 shrink-0 sticky top-0 z-30">
              <div className="flex items-center gap-3">
                {/* Mobile Menu Trigger */}
                <button
                  onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                  className="lg:hidden p-2 rounded-lg bg-surface-elevated border border-surface-border text-slate-300"
                >
                  <span className="dashboard-menu-lines"><i></i><i></i><i></i></span>
                </button>

                {/* Account Switcher Dropdown */}
                <div className="dashboard-account-switch flex items-center gap-2 min-w-0">
                  <span className="text-xs font-mono text-slate-400 hidden sm:inline">ACCOUNT:</span>
                  <select
                    value={selectedAccount}
                    onChange={(e) => setSelectedAccount(e.target.value)}
                    className="dashboard-account-select bg-surface-elevated border border-surface-border rounded-lg text-xs font-mono text-white px-3 py-1.5 focus:outline-none focus:border-brand-cyan"
                  >
                    {accountsList.map(a => (
                      <option key={a.id} value={a.id}>{a.id} — {a.type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Right Controls */}
              <div className="flex items-center gap-3">
                {/* Return to Public Marketing Site */}
                <button
                  onClick={onReturnToPublic}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-surface-border text-xs font-mono text-slate-300 hover:text-brand-cyan hover:border-brand-cyan/50 transition-all"
                >
                  <span>Public Portal</span>
                  <Icon name="arrowUpRight" className="w-3.5 h-3.5" />
                </button>

                {/* Credits Badge */}
                <button 
                  onClick={() => setCurrentNav('spin')}
                  className="flex items-center gap-1.5 bg-brand-cyan/10 border border-brand-cyan/30 px-3 py-1.5 rounded-lg text-xs font-mono text-brand-cyan hover:bg-brand-cyan/20 transition-all"
                >
                  <Icon name="spin" className="w-3.5 h-3.5" />
                  <span>{userCredits} Credits</span>
                </button>

                {/* Theme selector — explicit Dark / Light / System choices */}
                <div className="relative" ref={themeMenuRef}>
                  <button
                    type="button"
                    onClick={() => setThemeMenuOpen(prev => !prev)}
                    title={`Theme: ${themeMode}`}
                    aria-label={`Theme: ${themeMode}. Open theme selector.`}
                    aria-haspopup="menu"
                    aria-expanded={themeMenuOpen}
                    className="dashboard-theme-toggle flex items-center gap-2 px-2.5 py-2 rounded-lg bg-surface-elevated border border-surface-border text-slate-300 hover:text-brand-cyan hover:border-brand-cyan/50 transition-all"
                  >
                    <Icon name={themeMode === 'dark' ? 'moon' : themeMode === 'light' ? 'sun' : 'monitor'} className="w-4 h-4" />
                    <span className="hidden xl:inline text-[10px] font-mono uppercase tracking-wider">{themeMode}</span>
                  </button>

                  {themeMenuOpen && (
                    <div
                      role="menu"
                      aria-label="Choose theme"
                      className="theme-selector-menu absolute right-0 top-full mt-2 w-48 rounded-xl border border-surface-border bg-surface p-1.5 shadow-2xl z-50"
                    >
                      {[
                        { id: 'dark', label: 'Dark', icon: 'moon', hint: 'Obsidian interface' },
                        { id: 'light', label: 'Light', icon: 'sun', hint: 'Bright interface' },
                        { id: 'system', label: 'System', icon: 'monitor', hint: 'Use device setting' }
                      ].map(option => (
                        <button
                          key={option.id}
                          type="button"
                          role="menuitemradio"
                          aria-checked={themeMode === option.id}
                          onClick={() => {
                            setThemeMode(option.id);
                            setThemeMenuOpen(false);
                          }}
                          className={`theme-selector-option w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                            themeMode === option.id
                              ? 'bg-brand-cyan/10 text-brand-cyan border border-brand-cyan/25'
                              : 'text-slate-300 hover:bg-surface-elevated hover:text-white border border-transparent'
                          }`}
                        >
                          <span className="shrink-0">
                            <Icon name={option.icon} className="w-4 h-4" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-xs font-semibold">{option.label}</span>
                            <span className="block text-[9px] font-mono text-slate-500 mt-0.5">{option.hint}</span>
                          </span>
                          {themeMode === option.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan shrink-0"></span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notifications Bell */}
                <div className="relative">
                  <button 
                    onClick={onMarkNotificationsRead}
                    className="p-2 rounded-lg bg-surface-elevated border border-surface-border text-slate-300 hover:text-white relative"
                  >
                    <Icon name="bell" className="w-4 h-4" />
                    {notifications.some(n => !n.read) && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
                    )}
                  </button>
                </div>
              </div>
            </header>

            {/* MOBILE SIDEBAR DRAWER */}
            {mobileSidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden flex">
                <div className="fixed inset-0 bg-bg/80 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)}></div>
                <div className="relative w-[min(20rem,88vw)] max-w-[88vw] bg-surface h-full z-10 p-4 sm:p-5 overflow-y-auto border-r border-surface-border flex flex-col">
                  <div className="flex items-center justify-between pb-4 border-b border-surface-border">
                    <span className="flex items-center gap-2.5 font-sora font-bold text-white"><CaptrixLogo className="w-8 h-8" />CAPTRIX FUNDED</span>
                    <button onClick={() => setMobileSidebarOpen(false)} className="text-slate-400 p-1">✕</button>
                  </div>

                  <div className="my-4">
                    <button
                      onClick={() => {
                        setMobileSidebarOpen(false);
                        onOpenNewChallenge();
                      }}
                      className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-bg font-sora font-bold text-xs uppercase"
                    >
                      + NEW CHALLENGE
                    </button>
                  </div>

                  <div className="space-y-4 flex-1">
                    {navSections.map(sec => (
                      <div key={sec.heading}>
                        <div className="text-[10px] font-mono tracking-widest text-slate-500 uppercase mb-1">
                          {sec.heading}
                        </div>
                        <div className="space-y-1">
                          {sec.items.map(item => (
                            <button
                              key={item.id}
                              onClick={() => {
                                setCurrentNav(item.id);
                                setMobileSidebarOpen(false);
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-mono ${
                                currentNav === item.id ? 'bg-brand-cyan text-bg font-bold' : 'text-slate-400'
                              }`}
                            >
                              <Icon name={item.icon} className="w-4 h-4" />
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setMobileSidebarOpen(false);
                      onReturnToPublic();
                    }}
                    className="mt-6 w-full py-2.5 rounded-lg border border-surface-border text-xs font-mono text-center text-slate-300"
                  >
                    Back to Public Site
                  </button>
                </div>
              </div>
            )}

            {/* DYNAMIC DASHBOARD VIEW CONTAINER */}
            <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
              {/* VIEW 1: OVERVIEW */}
              {currentNav === 'overview' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  {/* Account Overview Hero Stats */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-surface p-5 rounded-2xl border border-surface-border relative overflow-hidden">
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Total Net Equity</span>
                      <div className="text-2xl sm:text-3xl font-sora font-bold text-white mt-1">
                        ${currentAcc.equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-xs font-mono text-fin-profit">
                        <span>+$6,450.00 (+6.45%)</span>
                        <span className="text-slate-500">vs start</span>
                      </div>
                    </div>

                    <div className="bg-surface p-5 rounded-2xl border border-surface-border">
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Today's Profit/Loss</span>
                      <div className="text-2xl sm:text-3xl font-sora font-bold text-fin-profit mt-1">
                        +$1,420.00
                      </div>
                      <div className="mt-2 text-xs font-mono text-slate-400">
                        Daily Drawdown Safe (22% utilized)
                      </div>
                    </div>

                    <div className="bg-surface p-5 rounded-2xl border border-surface-border">
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Target Milestone</span>
                      <div className="text-2xl sm:text-3xl font-sora font-bold text-brand-cyan mt-1">
                        64.5%
                      </div>
                      <div className="mt-2 text-xs font-mono text-slate-400">
                        ${currentAcc.targetCurrent.toLocaleString()} / ${currentAcc.target.toLocaleString()} goal
                      </div>
                    </div>

                    <div className="bg-surface p-5 rounded-2xl border border-surface-border">
                      <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider block">Account Tier Status</span>
                      <div className="text-base sm:text-lg font-sora font-bold text-white mt-1 flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-fin-profit animate-pulse"></span>
                        {currentAcc.status}
                      </div>
                      <div className="mt-2 text-xs font-mono text-slate-400">
                        {currentAcc.id}
                      </div>
                    </div>
                  </div>

                  {/* Corridor Risk Engine on Overview */}
                  <CaptrixCorridor challenge={CHALLENGE_DATA[5]} interactive={false} />

                  {/* Interactive Performance Trajectory Chart */}
                  <div className="bg-surface p-5 sm:p-6 rounded-2xl border border-surface-border">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                      <div>
                        <h4 className="font-sora text-base font-bold text-white">Equity & Watermark Progression</h4>
                        <span className="text-xs font-mono text-slate-400">Continuous M5 balance audit stream</span>
                      </div>
                      <div className="flex items-center gap-2 bg-surface-subtle p-1 rounded-lg border border-surface-border">
                        {['1D', '1W', '1M', 'ALL'].map((period, i) => (
                          <button key={period} className={`px-2.5 py-1 text-xs font-mono rounded ${i === 2 ? 'bg-brand-cyan text-bg font-bold' : 'text-slate-400 hover:text-white'}`}>
                            {period}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* SVG Chart */}
                    <div className="h-64 w-full relative">
                      <svg className="w-full h-full" viewBox="0 0 800 240" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="eqFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#11D6FF" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#11D6FF" stopOpacity="0.0" />
                          </linearGradient>
                        </defs>
                        {/* Grid lines */}
                        <line x1="0" y1="60" x2="800" y2="60" stroke="#1f2433" strokeDasharray="4 4" />
                        <line x1="0" y1="120" x2="800" y2="120" stroke="#1f2433" strokeDasharray="4 4" />
                        <line x1="0" y1="180" x2="800" y2="180" stroke="#1f2433" strokeDasharray="4 4" />

                        {/* Chart Line */}
                        <path 
                          d="M 0 200 L 90 190 L 180 210 L 270 160 L 360 170 L 450 110 L 540 130 L 630 70 L 720 85 L 800 45" 
                          fill="none" 
                          stroke="#11D6FF" 
                          strokeWidth="2.5" 
                        />
                        {/* Fill */}
                        <path 
                          d="M 0 200 L 90 190 L 180 210 L 270 160 L 360 170 L 450 110 L 540 130 L 630 70 L 720 85 L 800 45 L 800 240 L 0 240 Z" 
                          fill="url(#eqFill)" 
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Recent Activity Table */}
                  <div className="bg-surface rounded-2xl border border-surface-border p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-sora text-sm font-bold text-white uppercase font-mono">Recent Executions</h4>
                      <button onClick={() => setCurrentNav('orders')} className="text-xs font-mono text-brand-cyan hover:underline">
                        View All Orders →
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-mono text-left">
                        <thead>
                          <tr className="border-b border-surface-border text-slate-400">
                            <th className="py-2.5 px-3">TICKET</th>
                            <th className="py-2.5 px-3">INSTRUMENT</th>
                            <th className="py-2.5 px-3">SIDE</th>
                            <th className="py-2.5 px-3">SIZE</th>
                            <th className="py-2.5 px-3">PROFIT/LOSS</th>
                            <th className="py-2.5 px-3">STATUS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-border/50">
                          {orders.slice(0, 3).map(o => (
                            <tr key={o.id} className="hover:bg-surface-elevated/40">
                              <td className="py-2.5 px-3 text-slate-300">{o.id}</td>
                              <td className="py-2.5 px-3 text-white font-bold">{o.symbol}</td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] ${o.side === 'BUY' ? 'bg-fin-profit/10 text-fin-profit' : 'bg-fin-loss/10 text-fin-loss'}`}>
                                  {o.side}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-300">{o.size} lots</td>
                              <td className={`py-2.5 px-3 font-bold ${o.pl.startsWith('+') ? 'text-fin-profit' : 'text-fin-loss'}`}>
                                {o.pl}
                              </td>
                              <td className="py-2.5 px-3 text-slate-400">{o.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 2: CHALLENGES */}
              {currentNav === 'challenges' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-sora text-2xl font-bold text-white">Active Evaluations</h3>
                      <p className="text-xs text-slate-400 font-mono mt-1">Real-time status across your funded pipeline</p>
                    </div>
                    <button onClick={onOpenNewChallenge} className="px-4 py-2 rounded-xl bg-brand-cyan text-bg font-mono font-bold text-xs uppercase">
                      + Add New Challenge
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {accountsList.map(acc => (
                      <div key={acc.id} className="bg-surface rounded-2xl border border-surface-border p-6 relative">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-mono font-bold text-brand-cyan">{acc.type}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-fin-profit/10 text-fin-profit border border-fin-profit/30">
                            {acc.status}
                          </span>
                        </div>

                        <div className="space-y-3 font-mono text-xs">
                          <div className="flex justify-between py-1 border-b border-surface-border/50">
                            <span className="text-slate-400">Account ID</span>
                            <span className="text-white font-bold">{acc.id}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-surface-border/50">
                            <span className="text-slate-400">Current Balance</span>
                            <span className="text-white font-bold">${acc.balance.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-surface-border/50">
                            <span className="text-slate-400">Milestone Progress</span>
                            <span className="text-brand-cyan font-bold">${acc.targetCurrent} / ${acc.target}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-400">Daily Drawdown Status</span>
                            <span className="text-fin-profit font-bold">Compliant (${acc.ddDaily} used)</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-4 pt-3 border-t border-surface-border">
                          <div className="w-full h-2 rounded-full bg-surface-subtle overflow-hidden">
                            <div className="h-full bg-brand-cyan rounded-full" style={{ width: `${(acc.targetCurrent / acc.target) * 100}%` }}></div>
                          </div>
                          <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                            <span>Phase 1 Progress</span>
                            <span>{((acc.targetCurrent / acc.target) * 100).toFixed(0)}%</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* VIEW 3: TRADING DESK */}
              {currentNav === 'terminal' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  <div className="bg-surface rounded-2xl border border-surface-border p-5">
                    <div className="flex items-center justify-between pb-4 border-b border-surface-border mb-4">
                      <div className="flex items-center gap-3">
                        <span className="font-sora font-bold text-white">EUR / USD</span>
                        <span className="font-mono text-xs text-fin-profit">1.08642 +0.24%</span>
                      </div>
                      <span className="text-xs font-mono text-slate-400">DEMO BROKER FEED // SIMULATED PASS-THROUGH</span>
                    </div>

                    {/* Technical Mock Trading Station */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                      <div className="lg:col-span-8 h-80 bg-surface-subtle rounded-xl p-4 border border-surface-border flex items-center justify-center relative">
                        <span className="text-xs font-mono text-slate-500">REAL-TIME INSTITUTIONAL CANDLESTICK TERMINAL</span>
                        {/* Static visual candles */}
                        <div className="absolute inset-4 flex items-end justify-between opacity-30 pointer-events-none">
                          {[40, 60, 55, 75, 80, 70, 90, 85, 110, 100, 130, 140, 120, 160].map((h, i) => (
                            <div key={i} className="w-3 bg-brand-cyan" style={{ height: `${h}px` }}></div>
                          ))}
                        </div>
                      </div>

                      {/* Mock Order Execution Ticket */}
                      <div className="lg:col-span-4 bg-surface-subtle p-4 rounded-xl border border-surface-border space-y-4">
                        <h4 className="font-mono text-xs uppercase text-slate-400">Rapid Order Ticket</h4>
                        <div>
                          <label className="text-[10px] font-mono text-slate-400 block mb-1">Volume (Lots)</label>
                          <input type="text" defaultValue="5.00" className="w-full bg-surface border border-surface-border rounded px-3 py-2 text-xs font-mono text-white" />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <button className="py-3 rounded bg-fin-loss text-white font-mono font-bold text-xs uppercase">
                            SELL @ 1.08640
                          </button>
                          <button className="py-3 rounded bg-fin-profit text-bg font-mono font-bold text-xs uppercase">
                            BUY @ 1.08644
                          </button>
                        </div>
                        <p className="text-[10px] font-mono text-slate-500 text-center">
                          Simulated frontend interface for testing order latency & risk limits.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 4: ACCOUNTS */}
              {currentNav === 'accounts' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  <h3 className="font-sora text-2xl font-bold text-white">Account Architecture</h3>
                  <div className="bg-surface rounded-2xl border border-surface-border overflow-hidden">
                    <div className="p-6 border-b border-surface-border">
                      <div className="text-xs font-mono text-slate-400">PRIMARY ALLOCATION</div>
                      <div className="font-sora text-2xl font-bold text-white mt-1">{currentAcc.id} — {currentAcc.type}</div>
                    </div>
                    <div className="p-6">
                      <CaptrixCorridor challenge={CHALLENGE_DATA[5]} interactive={false} />
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 5: ANALYTICS */}
              {currentNav === 'analytics' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  <h3 className="font-sora text-2xl font-bold text-white">Deep Trading Analytics</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-surface border border-surface-border">
                      <span className="text-xs font-mono text-slate-400 block">Win Rate</span>
                      <span className="font-sora text-3xl font-bold text-fin-profit mt-1 block">68.4%</span>
                      <span className="text-[10px] font-mono text-slate-500">26 Wins / 12 Losses</span>
                    </div>
                    <div className="p-5 rounded-2xl bg-surface border border-surface-border">
                      <span className="text-xs font-mono text-slate-400 block">Profit Factor</span>
                      <span className="font-sora text-3xl font-bold text-brand-cyan mt-1 block">2.42</span>
                      <span className="text-[10px] font-mono text-slate-500">Gross Win vs Gross Loss</span>
                    </div>
                    <div className="p-5 rounded-2xl bg-surface border border-surface-border">
                      <span className="text-xs font-mono text-slate-400 block">Average Win / Loss</span>
                      <span className="font-sora text-3xl font-bold text-white mt-1 block">1.85:1</span>
                      <span className="text-[10px] font-mono text-slate-500">Favorable expectancy</span>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 6: PAYOUTS */}
              {currentNav === 'payouts' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h3 className="font-sora text-2xl font-bold text-white">Trader Payout Center</h3>
                      <p className="text-xs text-slate-400 font-mono mt-1">On-chain crypto and bank transfer settlement</p>
                    </div>
                    <button 
                      onClick={() => alert("Payout request simulated! [Captrix to supply live integration]")}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-bg font-sora font-bold text-xs uppercase shadow-cyan-sm"
                    >
                      Request Payout ($6,450.00)
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-5 bg-surface rounded-2xl border border-surface-border">
                      <span className="text-xs font-mono text-slate-400">Available For Withdrawal</span>
                      <span className="font-sora text-2xl font-bold text-fin-profit mt-1 block">$6,450.00</span>
                      <span className="text-[10px] font-mono text-slate-500">80% profit share unlocked</span>
                    </div>
                    <div className="p-5 bg-surface rounded-2xl border border-surface-border">
                      <span className="text-xs font-mono text-slate-400">Total Lifetime Payouts</span>
                      <span className="font-sora text-2xl font-bold text-white mt-1 block">$18,240.00</span>
                      <span className="text-[10px] font-mono text-slate-500">3 Successful batches</span>
                    </div>
                    <div className="p-5 bg-surface rounded-2xl border border-surface-border">
                      <span className="text-xs font-mono text-slate-400">Next Payout Window</span>
                      <span className="font-sora text-2xl font-bold text-brand-cyan mt-1 block">Every 14 Days</span>
                      <span className="text-[10px] font-mono text-slate-500">[Captrix to supply schedule]</span>
                    </div>
                  </div>

                  <div className="bg-surface rounded-2xl border border-surface-border p-6">
                    <h4 className="font-mono text-xs uppercase text-slate-400 mb-4">Payout Transaction History</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-mono">
                        <thead>
                          <tr className="border-b border-surface-border text-slate-400 text-left">
                            <th className="py-2.5 px-3">BATCH ID</th>
                            <th className="py-2.5 px-3">AMOUNT</th>
                            <th className="py-2.5 px-3">DESTINATION</th>
                            <th className="py-2.5 px-3">TIMESTAMP</th>
                            <th className="py-2.5 px-3">STATUS</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-border/50">
                          <tr>
                            <td className="py-3 px-3 text-slate-300">CTX-PO-9021</td>
                            <td className="py-3 px-3 text-fin-profit font-bold">+$8,400.00</td>
                            <td className="py-3 px-3 text-slate-400">USDT (TRC20)</td>
                            <td className="py-3 px-3 text-slate-500">May 12, 2026</td>
                            <td className="py-3 px-3 text-fin-profit">COMPLETED</td>
                          </tr>
                          <tr>
                            <td className="py-3 px-3 text-slate-300">CTX-PO-8419</td>
                            <td className="py-3 px-3 text-fin-profit font-bold">+$9,840.00</td>
                            <td className="py-3 px-3 text-slate-400">Bank Wire (SWIFT)</td>
                            <td className="py-3 px-3 text-slate-500">Apr 28, 2026</td>
                            <td className="py-3 px-3 text-fin-profit">COMPLETED</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 7: ORDERS */}
              {currentNav === 'orders' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-sora text-2xl font-bold text-white">Full Trade Audit Log</h3>
                      <p className="text-xs text-slate-400 font-mono mt-1">Immutable ledger of closed and active executions</p>
                    </div>
                  </div>

                  <div className="bg-surface rounded-2xl border border-surface-border overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs font-mono text-left">
                        <thead className="bg-surface-subtle text-slate-400 border-b border-surface-border">
                          <tr>
                            <th className="py-3 px-4">TICKET</th>
                            <th className="py-3 px-4">PAIR</th>
                            <th className="py-3 px-4">TYPE</th>
                            <th className="py-3 px-4">SIZE</th>
                            <th className="py-3 px-4">ENTRY</th>
                            <th className="py-3 px-4">EXIT</th>
                            <th className="py-3 px-4">NET P/L</th>
                            <th className="py-3 px-4">TIMESTAMP</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-border/50">
                          {orders.map(o => (
                            <tr key={o.id} className="hover:bg-surface-elevated/40">
                              <td className="py-3 px-4 text-slate-300">{o.id}</td>
                              <td className="py-3 px-4 text-white font-bold">{o.symbol}</td>
                              <td className="py-3 px-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] ${o.side === 'BUY' ? 'bg-fin-profit/10 text-fin-profit' : 'bg-fin-loss/10 text-fin-loss'}`}>
                                  {o.side}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-slate-300">{o.size}</td>
                              <td className="py-3 px-4 text-slate-400">{o.entry}</td>
                              <td className="py-3 px-4 text-slate-400">{o.exit}</td>
                              <td className={`py-3 px-4 font-bold ${o.pl.startsWith('+') ? 'text-fin-profit' : 'text-fin-loss'}`}>
                                {o.pl}
                              </td>
                              <td className="py-3 px-4 text-slate-500">{o.time}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 8: CERTIFICATES */}
              {currentNav === 'certificates' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  <h3 className="font-sora text-2xl font-bold text-white">Trader Credentials & Certificates</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-surface rounded-2xl border border-brand-cyan/40 p-6 relative overflow-hidden shadow-cyan-glow">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-mono text-brand-cyan">PASS EVALUATION MILESTONE</span>
                        <Icon name="award" className="w-6 h-6 text-brand-cyan" />
                      </div>
                      <div className="p-4 bg-bg rounded-xl border border-surface-border text-center space-y-2">
                        <span className="text-[10px] font-mono text-slate-400">CERTIFICATE OF ALLOCATION</span>
                        <div className="font-sora text-lg font-bold text-white">CAPTRIX VERIFIED TRADER</div>
                        <div className="text-xs font-mono text-brand-cyan">$100,000 Institutional Tier</div>
                        <div className="text-[10px] font-mono text-slate-500">ID: CTX-CERT-8841-PASS</div>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button onClick={() => alert("Certificate downloaded (SVG/PDF prototype)")} className="flex-1 py-2 rounded-lg bg-brand-cyan text-bg font-mono font-bold text-xs uppercase">
                          Download Certificate
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 9: AFFILIATE PORTAL */}
              {currentNav === 'affiliate' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  <h3 className="font-sora text-2xl font-bold text-white">Institutional Affiliate Program</h3>
                  <div className="bg-surface p-6 rounded-2xl border border-surface-border space-y-4">
                    <span className="text-xs font-mono text-slate-400 uppercase">Your Unique Referral Link</span>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <input 
                        type="text" 
                        readOnly 
                        value="https://captrixfunded.com/ref/trader8492" 
                        className="flex-1 bg-surface-subtle border border-surface-border rounded-xl px-4 py-3 font-mono text-xs text-brand-cyan focus:outline-none"
                      />
                      <button 
                        onClick={() => {
                          playFinAudio('tick');
                          navigator.clipboard.writeText("https://captrixfunded.com/ref/trader8492");
                          alert("Affiliate link copied to clipboard!");
                        }}
                        className="px-6 py-3 rounded-xl bg-brand-cyan text-bg font-sora font-bold text-xs uppercase"
                      >
                        Copy Link
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-surface-border">
                      <div className="p-4 bg-surface-subtle rounded-xl border border-surface-border">
                        <span className="text-xs font-mono text-slate-400">Total Referrals</span>
                        <span className="font-sora text-2xl font-bold text-white mt-1 block">42</span>
                      </div>
                      <div className="p-4 bg-surface-subtle rounded-xl border border-surface-border">
                        <span className="text-xs font-mono text-slate-400">Earned Commissions</span>
                        <span className="font-sora text-2xl font-bold text-fin-profit mt-1 block">$3,420.00</span>
                      </div>
                      <div className="p-4 bg-surface-subtle rounded-xl border border-surface-border">
                        <span className="text-xs font-mono text-slate-400">Tier Commission Rate</span>
                        <span className="font-sora text-2xl font-bold text-brand-cyan mt-1 block">[Captrix to supply]</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 10: REWARDS HUB */}
              {currentNav === 'rewards' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-sora text-2xl font-bold text-white">CAPTRIX Rewards Vault</h3>
                      <p className="text-xs text-slate-400 font-mono mt-1">Earn credits with every executed lot and phase completion</p>
                    </div>
                    <div className="p-3 bg-surface rounded-xl border border-brand-cyan/40 text-right">
                      <span className="text-[10px] font-mono text-slate-400 block">YOUR VAULT BALANCE</span>
                      <span className="font-sora text-xl font-bold text-brand-cyan">{userCredits} Credits</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 rounded-2xl bg-surface border border-surface-border flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-mono text-brand-cyan">CLAIMABLE TOKEN</span>
                        <h4 className="font-sora text-lg font-bold text-white mt-1">Evaluation Retake Pass</h4>
                        <p className="text-xs text-slate-400 mt-2">Reset any failed stage without paying full registration fee.</p>
                      </div>
                      <button 
                        onClick={() => {
                          if (userCredits >= 150) {
                            onCreditChange(-150);
                            alert("Evaluation Retake Token claimed!");
                          } else {
                            alert("Insufficient credits (150 required).");
                          }
                        }}
                        className="mt-6 py-2.5 rounded-xl bg-surface-elevated border border-surface-border text-xs font-mono text-slate-300 hover:text-white"
                      >
                        Redeem (150 Credits)
                      </button>
                    </div>

                    <div className="p-6 rounded-2xl bg-surface border border-surface-border flex flex-col justify-between">
                      <div>
                        <span className="text-xs font-mono text-fin-profit">ACTIVE PERK</span>
                        <h4 className="font-sora text-lg font-bold text-white mt-1">90% Profit Split Boost</h4>
                        <p className="text-xs text-slate-400 mt-2">Permanently elevate profit split from 80% to 90%.</p>
                      </div>
                      <button 
                        disabled
                        className="mt-6 py-2.5 rounded-xl bg-fin-profit/10 border border-fin-profit/30 text-xs font-mono text-fin-profit"
                      >
                        Active On Account
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 11: SPIN & WIN (IN-APP) */}
              {currentNav === 'spin' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  <SpinAndWinEngine 
                    userCredits={userCredits} 
                    onCreditChange={onCreditChange} 
                    addNotification={onAddNotification}
                  />
                </div>
              )}

              {/* VIEW 12: PROFILE */}
              {currentNav === 'profile' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <h3 className="font-sora text-2xl font-bold text-white">Trader Profile</h3>
                  <div className="bg-surface p-6 rounded-2xl border border-surface-border space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-mono text-slate-400 block mb-1">Full Legal Name</label>
                        <input type="text" defaultValue="Alex Mercer" className="w-full bg-surface-subtle border border-surface-border rounded-xl px-4 py-2.5 text-xs font-mono text-white" />
                      </div>
                      <div>
                        <label className="text-xs font-mono text-slate-400 block mb-1">Email Address</label>
                        <input type="email" defaultValue="alex.mercer@trading.io" className="w-full bg-surface-subtle border border-surface-border rounded-xl px-4 py-2.5 text-xs font-mono text-white" />
                      </div>
                    </div>
                    <button onClick={() => alert("Profile updated successfully!")} className="py-2.5 px-6 rounded-xl bg-brand-cyan text-bg font-sora font-bold text-xs uppercase">
                      Save Profile
                    </button>
                  </div>
                </div>
              )}

              {/* VIEW 13: KYC */}
              {currentNav === 'kyc' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <h3 className="font-sora text-2xl font-bold text-white">Identity Verification (KYC)</h3>
                  <div className="bg-surface p-6 rounded-2xl border border-surface-border">
                    <div className="flex items-center gap-3 text-fin-profit mb-4">
                      <Icon name="shield" className="w-6 h-6" />
                      <span className="font-sora font-bold text-base">Level 2 Verified (Institutional Clearance)</span>
                    </div>
                    <p className="text-xs font-mono text-slate-400 leading-relaxed">
                      Your identity and residency documents have been cryptographically verified for unrestricted automated payouts.
                    </p>
                  </div>
                </div>
              )}

              {/* VIEW 14: SECURITY */}
              {currentNav === 'security' && (
                <div className="space-y-6 max-w-4xl mx-auto">
                  <h3 className="font-sora text-2xl font-bold text-white">Security & Access Management</h3>
                  <div className="bg-surface p-6 rounded-2xl border border-surface-border space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-sora text-sm font-bold text-white">Two-Factor Authentication (2FA)</h4>
                        <p className="text-xs text-slate-400 mt-1">Hardware TOTP authenticator app protection</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-mono bg-fin-profit/10 text-fin-profit border border-fin-profit/30 font-bold">
                        ENABLED
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* VIEW 15: SUPPORT TICKETS */}
              {currentNav === 'support' && (
                <div className="space-y-6 max-w-7xl mx-auto">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-sora text-2xl font-bold text-white">Support & Resolution Desk</h3>
                      <p className="text-xs text-slate-400 font-mono mt-1">Direct priority access to risk officers</p>
                    </div>
                    <button onClick={() => alert("Ticket creation modal opened")} className="px-4 py-2 rounded-xl bg-brand-cyan text-bg font-mono font-bold text-xs uppercase">
                      + Open New Ticket
                    </button>
                  </div>

                  <div className="bg-surface rounded-2xl border border-surface-border p-6">
                    <div className="text-xs font-mono text-slate-400 py-3 border-b border-surface-border flex justify-between">
                      <span>#TK-4410: Drawdown reset verification after server maintenance</span>
                      <span className="text-fin-profit">RESOLVED</span>
                    </div>
                    <div className="text-xs font-mono text-slate-400 py-3 flex justify-between">
                      <span>#TK-4389: API access token generation for cTrader</span>
                      <span className="text-brand-cyan">IN PROGRESS</span>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </div>
      );
    };

    // ==========================================
    // 10. AUTH MODAL / DRAWER (LOGIN & REGISTER)
    // ==========================================
    const AuthModal = ({ isOpen, initialMode = 'login', onClose, onLoginSuccess }) => {
      const [mode, setMode] = useState(initialMode);
      const [email, setEmail] = useState('');
      const [password, setPassword] = useState('');
      const [showPassword, setShowPassword] = useState(false);
      const [isLoading, setIsLoading] = useState(false);

      useEffect(() => {
        setMode(initialMode);
      }, [initialMode]);

      if (!isOpen) return null;

      const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        setTimeout(() => {
          setIsLoading(false);
          onLoginSuccess();
          onClose();
        }, 800);
      };

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/85 backdrop-blur-md">
          <div className="bg-surface border border-surface-border rounded-2xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>

            <div className="text-center mb-6">
              <CaptrixLogo className="w-14 h-14 mx-auto mb-3" />
              <span className="font-sora font-extrabold text-xl text-white tracking-wider">
                CAPTRIX <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">FUNDED</span>
              </span>
              <h3 className="font-sora text-xl font-bold text-white mt-3">
                {mode === 'login' ? 'Institutional Trader Login' : 'Create Trader Account'}
              </h3>
              <p className="text-xs font-mono text-slate-400 mt-1">
                Access live accounts, corridor metrics, and payouts
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="trader@captrix.com"
                  className="w-full bg-surface-subtle border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-surface-subtle border border-surface-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-cyan pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    <Icon name={showPassword ? 'eyeOff' : 'eye'} className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-cyan to-brand-blue text-bg font-sora font-bold text-xs uppercase tracking-wider hover:brightness-110 shadow-cyan-sm transition-all"
              >
                {isLoading ? 'AUTHENTICATING ENCRYPTED SESSION...' : mode === 'login' ? 'LOGIN' : 'CREATE CREDENTIALS'}
              </button>

              <div className="flex items-center justify-between text-[11px] pt-2">
                <button
                  type="button"
                  onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                  className="text-brand-cyan hover:underline"
                >
                  {mode === 'login' ? "Don't have an account? Register" : 'Already registered? Login'}
                </button>
                <a href="#reset" className="text-slate-500 hover:text-slate-300">Forgot Password?</a>
              </div>
            </form>
          </div>
        </div>
      );
    };

    // ==========================================
    // 11. CHECKOUT MODAL
    // ==========================================
    const CheckoutModal = ({ challenge, isOpen, onClose, onSuccess }) => {
      const [processing, setProcessing] = useState(false);

      if (!isOpen || !challenge) return null;

      const handleConfirm = () => {
        setProcessing(true);
        setTimeout(() => {
          setProcessing(false);
          onSuccess();
          onClose();
        }, 900);
      };

      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bg/85 backdrop-blur-md">
          <div className="bg-surface border border-surface-border rounded-2xl w-full max-w-lg p-6 sm:p-8 shadow-2xl relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white">✕</button>

            <span className="text-xs font-mono text-brand-cyan uppercase tracking-wider">CHECKOUT CONFIGURATION</span>
            <h3 className="font-sora text-2xl font-bold text-white mt-1">Confirm {challenge.label} Evaluation</h3>

            <div className="my-6 bg-surface-subtle p-4 rounded-xl border border-surface-border space-y-2 font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Account Model</span>
                <span className="text-white font-bold">{challenge.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Profit Target</span>
                <span className="text-fin-profit font-bold">+{challenge.targetPercent}% (${challenge.targetAmount.toLocaleString()})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Daily Drawdown Ceiling</span>
                <span className="text-fin-warning font-bold">-${challenge.dailyDrawdown.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Max Overall Drawdown</span>
                <span className="text-fin-loss font-bold">-${challenge.maxDrawdown.toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-surface-border text-sm">
                <span className="text-slate-300 font-bold">One-Time Fee</span>
                <span className="text-brand-cyan font-bold">${challenge.price}.00</span>
              </div>
            </div>

            <button
              onClick={handleConfirm}
              disabled={processing}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-cyan text-bg font-sora font-bold text-sm uppercase tracking-wide shadow-cyan-glow transition-all"
            >
              {processing ? 'ALLOCATING TRADING CREDENTIALS...' : `PROCEED TO CHECKOUT ($${challenge.price})`}
            </button>
            <p className="text-[10px] text-center font-mono text-slate-500 mt-3">
              Encrypted 256-bit checkout • Instant automated credentials delivery via email
            </p>
          </div>
        </div>
      );
    };

    // ==========================================
    // 12. COMPREHENSIVE SITE FOOTER
    // ==========================================
    const Footer = ({ onOpenAuth, onSelectNav }) => {
      return (
        <footer className="bg-surface-subtle border-t border-surface-border pt-16 pb-12 text-slate-400 font-mono text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-surface-border">
              {/* Brand Col */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-3 font-sora font-extrabold text-2xl text-white tracking-wider">
                  <CaptrixLogo className="w-11 h-11" />
                  <span>CAPTRIX <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">FUNDED</span></span>
                </div>
                <p className="text-sm font-sans text-slate-400 max-w-sm">
                  Trade Bold. Get Funded. The modern prop trading firm engineered with transparent corridors, algorithmic risk safeguards, and up to 90% profit payouts.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <span className="px-2.5 py-1 rounded bg-surface border border-surface-border text-brand-cyan text-[11px]">
                    7 Evaluation Tiers
                  </span>
                  <span className="px-2.5 py-1 rounded bg-surface border border-surface-border text-fin-profit text-[11px]">
                    $1K → $200K
                  </span>
                </div>
              </div>

              {/* Navigation Columns */}
              <div>
                <h4 className="text-white font-sora font-bold text-xs uppercase tracking-wider mb-4">Program Models</h4>
                <ul className="space-y-2.5">
                  <li><a href="#marketplace" className="hover:text-brand-cyan transition-colors">1-Step Fast Track</a></li>
                  <li><a href="#marketplace" className="hover:text-brand-cyan transition-colors">2-Step Institutional</a></li>
                  <li><a href="#marketplace" className="hover:text-brand-cyan transition-colors">Instant Funded ($200K)</a></li>
                  <li><a href="#marketplace" className="hover:text-brand-cyan transition-colors">Pricing Comparison</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-sora font-bold text-xs uppercase tracking-wider mb-4">Ecosystem</h4>
                <ul className="space-y-2.5">
                  <li><a href="#how-it-works" className="hover:text-brand-cyan transition-colors">Evaluation Rules</a></li>
                  <li><a href="#faq" className="hover:text-brand-cyan transition-colors">FAQ Knowledge Base</a></li>
                  <li><button onClick={() => onOpenAuth('login')} className="hover:text-brand-cyan transition-colors">Trader Dashboard</button></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-sora font-bold text-xs uppercase tracking-wider mb-4">Compliance</h4>
                <ul className="space-y-2.5">
                  <li><a href="#terms" className="hover:text-brand-cyan transition-colors">Terms of Service</a></li>
                  <li><a href="#privacy" className="hover:text-brand-cyan transition-colors">Privacy Policy</a></li>
                  <li><a href="#refund" className="hover:text-brand-cyan transition-colors">Refund Policy</a></li>
                  <li><a href="#risk" className="hover:text-brand-cyan transition-colors">Risk Disclaimer</a></li>
                </ul>
              </div>
            </div>

            {/* Factual Disclaimer Banner */}
            <div className="pt-8 text-[11px] text-slate-500 leading-relaxed space-y-2">
              <p>
                DISCLAIMER: All accounts provided by Captrix Funded are simulated evaluations operating in demo environments with fictitious capital. Hypothetical or simulated performance results have certain limitations. No actual real-money trading is performed directly by clients during evaluation stages unless specifically allocated under partner broker agreements [Captrix to supply partner entity details].
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-slate-500">
                <span>© 2026 CAPTRIX FUNDED. All rights reserved.</span>
                <span>Designed to institutional UI/UX standards.</span>
              </div>
            </div>
          </div>
        </footer>
      );
    };

    // ==========================================
    // 13. MASTER APPLICATION WRAPPER
    // ==========================================
    function App() {
      // Top Level State
      const [viewMode, setViewMode] = useState('public'); // 'public' or 'dashboard'
      const [dashboardView, setDashboardView] = useState('overview');
      const [heroChallenge, setHeroChallenge] = useState(CHALLENGE_DATA[5]); // Default $100K 2-Step
      const [userCredits, setUserCredits] = useState(125);
      const [authOpen, setAuthOpen] = useState(false);
      const [menuOpen, setMenuOpen] = useState(false);
      const [authInitialMode, setAuthInitialMode] = useState('login');
      const [checkoutOpen, setCheckoutOpen] = useState(false);
      const [selectedCheckoutTier, setSelectedCheckoutTier] = useState(CHALLENGE_DATA[5]);

      // Global Notification System
      const [notifications, setNotifications] = useState([
        { id: 1, title: 'Evaluation Active', desc: 'Phase 1 verification running on CTX-100K-84920', time: '10m ago', read: false },
        { id: 2, title: 'Spin & Win Drop', desc: 'Daily credits reset complete', time: '1h ago', read: false }
      ]);

      const handleAddNotification = (notif) => {
        setNotifications(prev => [notif, ...prev]);
      };

      const handleMarkNotificationsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      };

      const handleCreditChange = (delta) => {
        setUserCredits(prev => Math.max(0, prev + delta));
      };

      return (
        <div className="dashboard-app min-h-screen bg-bg text-slate-200">
          {viewMode === 'public' ? (
            <div>
              {/* PUBLIC HEADER NAVIGATION */}
              <header className="sticky top-0 z-40 bg-bg/80 backdrop-blur-xl border-b border-surface-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                  {/* Brand Logo */}
                  <a href="#" className="flex items-center gap-2 sm:gap-3 min-w-0" aria-label="CAPTRIX FUNDED home">
                    <CaptrixLogo className="w-8 h-8 sm:w-10 sm:h-10" />
                    <span className="font-sora font-extrabold text-[15px] max-[359px]:text-[13px] min-[400px]:text-xl sm:text-2xl text-white tracking-wider whitespace-nowrap">
                      CAPTRIX <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan to-brand-blue">FUNDED</span>
                    </span>
                  </a>

                  {/* Desktop Links */}
                  <nav className="hidden lg:flex items-center gap-8 font-mono text-xs">
                    <a href="#corridor-hero" className="text-slate-300 hover:text-brand-cyan transition-colors">The Corridor</a>
                    <a href="#marketplace" className="text-slate-300 hover:text-brand-cyan transition-colors">Challenges</a>
                    <a href="#how-it-works" className="text-slate-300 hover:text-brand-cyan transition-colors">How It Works</a>
                    <a href="#faq" className="text-slate-300 hover:text-brand-cyan transition-colors">FAQ</a>
                  </nav>

                  {/* Action CTAs */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    <button
                      onClick={() => { setAuthInitialMode('login'); setAuthOpen(true); }}
                      className="min-h-[44px] px-3 sm:px-4 rounded-xl border border-surface-border text-xs font-mono text-slate-300 hover:text-white hover:border-slate-600 transition-all"
                    >
                      Login
                    </button>
                    <button onClick={() => setMenuOpen(true)} aria-label="Open menu" aria-haspopup="dialog" aria-expanded={menuOpen} aria-controls="cx-site-menu" className="cx-burger">
                      <span></span><span></span><span></span>
                    </button>
                  </div>
                </div>
              </header>

              <BackToTop />

              <PublicDrawer
                open={menuOpen}
                onClose={() => setMenuOpen(false)}
                onLogin={() => { setAuthInitialMode('login'); setAuthOpen(true); }}
                onGetFunded={() => { setSelectedCheckoutTier(CHALLENGE_DATA[5]); setCheckoutOpen(true); }}
              />

              {/* HERO SECTION WITH THE CAPTRIX CORRIDOR CENTERPIECE */}
              <section id="corridor-hero" className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 overflow-hidden tech-grid">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="text-center max-w-3xl mx-auto mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-elevated border border-brand-cyan/30 text-brand-cyan text-xs font-mono font-medium mb-6">
                      <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse"></span>
                      TRADE BOLD. GET FUNDED.
                    </div>

                    <h1 className="font-sora text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
                      Trade The Space <br />
                      Between <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-cyan via-brand-blue to-fin-profit">Target & Floor.</span>
                    </h1>

                    <p className="mt-6 text-base sm:text-lg text-slate-300 font-sans max-w-2xl mx-auto leading-relaxed">
                      Captrix Funded equips disciplined operators with up to <strong className="text-white">$200,000</strong> in capital allocation across 1-Step, 2-Step, and Instant funding architectures.
                    </p>
                  </div>

                  {/* HERO CENTERPIECE: THE CAPTRIX CORRIDOR */}
                  <div className="max-w-5xl mx-auto">
                    <CaptrixCorridor 
                      challenge={heroChallenge} 
                      interactive={true} 
                      onSelectSize={(c) => setHeroChallenge(c)} 
                    />

                    {/* Quick Launch CTA beneath Corridor */}
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button
                        onClick={() => {
                          setSelectedCheckoutTier(heroChallenge);
                          setCheckoutOpen(true);
                        }}
                        className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-cyan text-bg font-sora font-bold text-sm tracking-wide shadow-cyan-glow hover:shadow-cyan-glow transition-all uppercase flex items-center justify-center gap-2"
                      >
                        <span>START {heroChallenge.label} EVALUATION (${heroChallenge.price})</span>
                        <Icon name="arrowUpRight" className="w-4 h-4 text-bg" />
                      </button>

                      <a
                        href="#marketplace"
                        className="w-full sm:w-auto px-6 py-4 rounded-xl bg-surface border border-surface-border text-slate-300 font-mono text-xs uppercase tracking-wider text-center hover:border-slate-500 transition-all"
                      >
                        Compare All 7 Tiers
                      </a>
                    </div>
                  </div>
                </div>
              </section>

              {/* PLATFORM FACTS STRIP (STRICTLY FACTUAL) */}
              <section className="border-y border-surface-border bg-surface-subtle py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center font-mono">
                    <div className="p-3">
                      <span className="text-2xl sm:text-3xl font-bold text-white block">7 Tiers</span>
                      <span className="text-xs text-slate-400 mt-1 block">$1,000 to $200,000</span>
                    </div>
                    <div className="p-3">
                      <span className="text-2xl sm:text-3xl font-bold text-brand-cyan block">3 Models</span>
                      <span className="text-xs text-slate-400 mt-1 block">1-Step / 2-Step / Instant</span>
                    </div>
                    <div className="p-3">
                      <span className="text-2xl sm:text-3xl font-bold text-fin-profit block">Up to 90%</span>
                      <span className="text-xs text-slate-400 mt-1 block">Trader Profit Share</span>
                    </div>
                    <div className="p-3">
                      <span className="text-2xl sm:text-3xl font-bold text-fin-warning block">1:100</span>
                      <span className="text-xs text-slate-400 mt-1 block">Institutional Leverage</span>
                    </div>
                  </div>
                </div>
              </section>

              {/* CHALLENGE MARKETPLACE COMPONENT */}
              <ChallengeMarketplace 
                onSelectTier={(tier) => setHeroChallenge(tier)} 
                onCheckout={(tier) => {
                  setSelectedCheckoutTier(tier);
                  setCheckoutOpen(true);
                }} 
              />

              {/* CINEMATIC HOW IT WORKS SECTION */}
              <HowItWorksSection />

              {/* TRADER DASHBOARD SHOWCASE */}
              <DashboardShowcase onGoToDashboard={() => { setAuthInitialMode('login'); setAuthOpen(true); }} />

              {/* FAQ ACCORDION SECTION */}
              <FAQSection />

              {/* FINAL CLOSING CTA SECTION */}
              <section className="py-20 border-t border-surface-border relative overflow-hidden bg-gradient-to-b from-bg to-surface">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                  <h2 className="font-sora text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                    Ready to Enter The Corridor?
                  </h2>
                  <p className="mt-4 text-slate-300 font-sans text-base max-w-xl mx-auto">
                    Select your capital allocation, pass the structured risk objectives, and start receiving your profit split.
                  </p>
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                      onClick={() => {
                        setSelectedCheckoutTier(CHALLENGE_DATA[5]);
                        setCheckoutOpen(true);
                      }}
                      className="px-8 py-4 rounded-xl bg-gradient-to-r from-brand-cyan via-brand-blue to-brand-cyan text-bg font-sora font-bold text-sm tracking-wide shadow-cyan-glow uppercase"
                    >
                      CHOOSE YOUR CHALLENGE
                    </button>
                  </div>
                </div>
              </section>

              {/* COMPREHENSIVE FOOTER */}
              <Footer 
                onOpenAuth={(mode) => {
                  setAuthInitialMode(mode);
                  setAuthOpen(true);
                }} 
              />
            </div>
          ) : (
            /* COMPLETE APPLICATION / DASHBOARD */
            <TraderDashboardApp 
              initialView={dashboardView}
              userCredits={userCredits}
              onCreditChange={handleCreditChange}
              onAddNotification={handleAddNotification}
              onReturnToPublic={() => setViewMode('public')}
              onOpenNewChallenge={() => {
                setSelectedCheckoutTier(CHALLENGE_DATA[5]);
                setCheckoutOpen(true);
              }}
              notifications={notifications}
              onMarkNotificationsRead={handleMarkNotificationsRead}
            />
          )}

          {/* GLOBAL AUTHENTICATION MODAL */}
          <AuthModal 
            isOpen={authOpen} 
            initialMode={authInitialMode} 
            onClose={() => setAuthOpen(false)} 
            onLoginSuccess={() => {
              setViewMode('dashboard');
              setDashboardView('overview');
            }} 
          />

          {/* CHECKOUT MODAL */}
          <CheckoutModal 
            challenge={selectedCheckoutTier} 
            isOpen={checkoutOpen} 
            onClose={() => setCheckoutOpen(false)} 
            onSuccess={() => {
              alert(`Credentials generated for ${selectedCheckoutTier.label} Evaluation! Redirecting to your Trader Dashboard.`);
              setViewMode('dashboard');
              setDashboardView('overview');
            }} 
          />
        </div>
      );
    }

    // Render the React application
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  