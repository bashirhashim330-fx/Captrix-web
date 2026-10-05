// Tiny single-accent trend line (no axes). Draw-in animation is CSS-only and
// disabled under prefers-reduced-motion (see .cx-spark-line in glass.css).
// `stretch` fills its container width (non-scaling stroke keeps the line crisp).
const Sparkline = ({ data, width = 120, height = 28, className = '', stretch = false }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data);
  const span = max - min || 1;
  const pad = 3;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * (width - pad * 2) + pad,
    height - pad - ((v - min) / span) * (height - pad * 2),
  ]);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)} ${height} L${pts[0][0].toFixed(1)} ${height} Z`;
  const [lx, ly] = pts[pts.length - 1];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} {...(stretch ? { preserveAspectRatio: 'none' } : { width, height })} className={`overflow-visible ${className}`} aria-hidden="true">
      <path d={area} className="cx-spark-area" />
      <path d={line} pathLength="1" fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" className="cx-spark-line" />
      {!stretch && <circle cx={lx} cy={ly} r="2.4" className="cx-spark-dot" />}
    </svg>
  );
};

export default Sparkline;
