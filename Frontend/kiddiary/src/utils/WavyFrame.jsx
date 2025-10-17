import React from "react";
  const overlap = 1.5; // tránh viền cắt trùng nhau


/* Vẽ path chữ nhật bo góc + gợn sóng dọc 4 cạnh */
function wavyRectPath(w, h, r, amp = 6, period = 44) {
  const step = period / 2;
  const P = [];
  let x = r, y = 0, dir;

  P.push(`M ${x},${y}`);

  // TOP →
  dir = -1;
  for (; x + step <= w - r; x += step) {
    const cx = x + step / 2;
    const nx = x + step;
    const ny = y + dir * amp;
    P.push(`Q ${cx},${ny} ${nx},${y}`);
    dir *= -1;
  }
  P.push(`L ${w - r},${y}`);
  P.push(`A ${r},${r} 0 0 1 ${w},${r}`);

  // RIGHT ↓
  x = w; y = r; dir = 1;
  for (; y + step <= h - r; y += step) {
    const cy = y + step / 2;
    const nx = x + dir * amp;
    const ny = y + step;
    P.push(`Q ${nx},${cy} ${x},${ny}`);
    dir *= -1;
  }
  P.push(`L ${x},${h - r}`);
  P.push(`A ${r},${r} 0 0 1 ${w - r},${h}`);

  // BOTTOM ←
  x = w - r; y = h; dir = 1;
  for (; x - step >= r; x -= step) {
    const cx = x - step / 2;
    const nx = x - step;
    const ny = y + dir * amp;
    P.push(`Q ${cx},${ny} ${nx},${y}`);
    dir *= -1;
  }
  P.push(`L ${r},${y}`);
  P.push(`A ${r},${r} 0 0 1 0,${h - r}`);

  // LEFT ↑
  x = 0; y = h - r; dir = -1;
  for (; y - step >= r; y -= step) {
    const cy = y - step / 2;
    const nx = x + dir * amp;
    const ny = y - step;
    P.push(`Q ${nx},${cy} ${x},${ny}`);
    dir *= -1;
  }
  P.push(`L ${x},${r}`);
  P.push(`A ${r},${r} 0 0 1 ${r},0 Z`);

  return P.join(" ");
}

/** Khung viền gợn sóng ở ngoài; optional: gợn sóng ở mép trong */
export default function WavyFrame({
  width = 960,
  height = 540,
  radius = 20,
  inset = 4,             // ↓ mỏng hơn
  band = 8,              // ↓ mỏng hơn
  color = "#2CC1AE",
  amplitude = 6,
  wavelength = 48,
  innerWave = true,      // bật sóng trong
  innerAmplitude = 4,
  innerWavelength = 44,
  className = "",
  children,
}) {
  const outerW = width + (inset + band) * 2;
  const outerH = height + (inset + band) * 2;

  const outerPath = wavyRectPath(
    outerW, outerH,
    radius + inset + band,
    amplitude, wavelength
  );

  // mép trong (gợn nếu innerWave=true, ngược lại bo trơn)
  const innerPath = innerWave
    ? wavyRectPath(width, height, Math.max(0, radius - 2), innerAmplitude, innerWavelength)
    : null;

  return (
    <div className={`relative ${className}`}>
      {/* CONTENT */}
      <div className="relative z-[1] rounded-[20px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.12)]">
        {children}
      </div>

      {/* WAVY BAND */}
      <svg
        className="pointer-events-none absolute z-0"
        style={{
          left: `-${inset + band}px`,
          top: `-${inset + band}px`,
          width: `calc(100% + ${(inset + band) * 2}px)`,
          height: `calc(100% + ${(inset + band) * 2}px)`,
        }}
        viewBox={`0 0 ${outerW} ${outerH}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
         <mask id="wf-band">
  <rect width="100%" height="100%" fill="black" />
  <path d={outerPath} fill="white" />
  {/* inner cut (gợn hoặc trơn) */}
  {innerWave ? (
    <g transform={`translate(${inset + band + overlap}, ${inset + band + overlap})`}>
      <path
        d={wavyRectPath(
          width - overlap * 2,
          height - overlap * 2,
          Math.max(0, radius - 2),
          innerAmplitude,
          innerWavelength
        )}
        fill="black"
      />
    </g>
  ) : (
    <rect
      x={inset + band + overlap}
      y={inset + band + overlap}
      width={width - overlap * 2}
      height={height - overlap * 2}
      rx={radius}
      ry={radius}
      fill="black"
    />
  )}
</mask>

          <filter id="wf-shadow" x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow dx="0" dy="12" stdDeviation="14" floodColor="#000" floodOpacity="0.16" />
          </filter>
        </defs>

        <rect width="100%" height="100%" fill={color} mask="url(#wf-band)" filter="url(#wf-shadow)" />
      </svg>
    </div>
  );
}
