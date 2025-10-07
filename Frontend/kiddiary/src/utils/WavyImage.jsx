import React from "react";

/** Path hình chữ nhật bo góc + gợn sóng dọc 4 cạnh */
function wavyRectPath(w, h, r, amp = 8, period = 46) {
  const cmds = [];
  const step = period / 2;

  let x = r, y = 0;
  cmds.push(`M ${x},${y}`);

  // TOP →
  let dir = -1;
  for (; x + step <= w - r; x += step) {
    const cx = x + step / 2;
    const nx = x + step;
    const ny = y + dir * amp;
    cmds.push(`Q ${cx},${ny} ${nx},${y}`);
    dir *= -1;
  }
  cmds.push(`L ${w - r},${y}`);
  cmds.push(`A ${r},${r} 0 0 1 ${w},${r}`);

  // RIGHT ↓
  x = w; y = r; dir = 1;
  for (; y + step <= h - r; y += step) {
    const cy = y + step / 2;
    const nx = x + dir * amp;
    const ny = y + step;
    cmds.push(`Q ${nx},${cy} ${x},${ny}`);
    dir *= -1;
  }
  cmds.push(`L ${x},${h - r}`);
  cmds.push(`A ${r},${r} 0 0 1 ${w - r},${h}`);

  // BOTTOM ←
  x = w - r; y = h; dir = 1;
  for (; x - step >= r; x -= step) {
    const cx = x - step / 2;
    const nx = x - step;
    const ny = y + dir * amp;
    cmds.push(`Q ${cx},${ny} ${nx},${y}`);
    dir *= -1;
  }
  cmds.push(`L ${r},${y}`);
  cmds.push(`A ${r},${r} 0 0 1 0,${h - r}`);

  // LEFT ↑
  x = 0; y = h - r; dir = -1;
  for (; y - step >= r; y -= step) {
    const cy = y - step / 2;
    const nx = x + dir * amp;
    const ny = y - step;
    cmds.push(`Q ${nx},${cy} ${x},${ny}`);
    dir *= -1;
  }
  cmds.push(`L ${x},${r}`);
  cmds.push(`A ${r},${r} 0 0 1 ${r},0 Z`);

  return cmds.join(" ");
}

/**
 * WavyImage
 * - outer waves luôn gợn (mép ngoài)
 * - innerWave=true => mép trong cũng gợn (như khung “bánh quy”)
 */
export default function WavyImage({
  src,
  alt = "",
  width = 680,
  height = 360,
  radius = 28,          // bo góc ảnh
  inset = 12,           // khoảng cách viền tới ảnh
  band = 18,            // dày dải hồng
  stroke = "#F86AA5",
  amplitude = 10,       // gợn mép ngoài
  wavelength = 52,
  innerWave = true,     // << bật sóng bên trong
  innerAmplitude = 6,   // gợn mép trong (nhỏ hơn 1 chút cho đẹp)
  innerWavelength = 46,
  className = "",
}) {
  const outerW = width + (inset + band) * 2;
  const outerH = height + (inset + band) * 2;

  // Mép ngoài (gợn)
  const outerPath = wavyRectPath(
    outerW,
    outerH,
    radius + inset + band,
    amplitude,
    wavelength
  );

  // Lỗ bên trong (gợn hoặc bo trơn)
  const innerX = band + inset;
  const innerY = band + inset;
  const innerW = width;
  const innerH = height;

  const innerPath = innerWave
    ? wavyRectPath(
        innerW,
        innerH,
        Math.max(0, radius - 2),
        innerAmplitude,
        innerWavelength
      )
    : null;

  return (
    <div className={`relative inline-block ${className}`}>
      {/* Ảnh */}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="block max-w-full h-auto object-cover rounded-[28px] shadow-2xl relative z-[1]"
      />

      {/* Dải viền hồng: outer wavy MINUS inner (wavy/trơn) */}
      <svg
        className="pointer-events-none absolute z-0"
        style={{
          left: `-${inset + band}px`,
          top: `-${inset + band}px`,
          width: outerW,
          height: outerH,
        }}
        viewBox={`0 0 ${outerW} ${outerH}`}
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <mask id="wave-band">
            {/* Ẩn hết */}
            <rect width="100%" height="100%" fill="black" />
            {/* Hiện phần ngoài */}
            <path d={outerPath} fill="white" />
            {/* Đục phần trong */}
            {innerWave ? (
              <g transform={`translate(${innerX},${innerY})`}>
                <path d={innerPath} fill="black" />
              </g>
            ) : (
              <rect
                x={innerX}
                y={innerY}
                width={innerW}
                height={innerH}
                rx={radius}
                ry={radius}
                fill="black"
              />
            )}
          </mask>

          <filter id="band-shadow" x="-20%" y="-20%" width="140%" height="160%">
            <feDropShadow dx="0" dy="16" stdDeviation="16" floodColor="#000" floodOpacity="0.18" />
          </filter>
        </defs>

        <rect
          width="100%"
          height="100%"
          fill={stroke}
          mask="url(#wave-band)"
          filter="url(#band-shadow)"
        />
      </svg>
    </div>
  );
}
