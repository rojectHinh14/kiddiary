import { useEffect, useRef, useState } from "react";

export function BuntingGarland() {
  const pathRef = useRef(null);

  // Võng xuống (sag) & khoảng cách cờ cách dây
const SAG_Y = 135;   // 135 -> 120: vẫn võng nhưng cao hơn
  const DROP  = 8;     // 16 -> 6: cờ sát dây hơn

  // vị trí lá cờ dọc theo dây (0→1)
  const tList = [0.06, 0.22, 0.38, 0.54, 0.72, 0.90];
  const colors = ["#E27A41","#EAC04A","#78B763","#2FAF9F","#2D86A9","#2E6E86"];
  const [tfms, setTfms] = useState(Array(tList.length).fill(""));

  useEffect(() => {
    const path = pathRef.current;
    const L = path.getTotalLength();
    const eps = 1;

    setTfms(
      tList.map(t => {
        const s = L * t;
        const p = path.getPointAtLength(s);
        const q = path.getPointAtLength(Math.min(L, s + eps));
        const angle = Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI;
        return `translate(${p.x},${p.y}) rotate(${angle}) translate(0,${DROP})`;
      })
    );
  }, []);

  return (
    <svg
      viewBox="0 0 1440 180"
      preserveAspectRatio="none"
      className="w-full h-[140px]"
    >
      {/* Dây: một cung cong mượt, bám sát 2 mép (y≈40) và võng ở giữa (SAG_Y) */}
      <path
        ref={pathRef}
        d={`M -20,40 Q 720,${SAG_Y} 1460,40`}
        stroke="#E86F6F"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />

      {tList.map((_, i) => (
        <g key={i} transform={tfms[i]}>
          {/* tam giác đáy trên nằm đúng trên dây */}
          <polygon points="-28,0 28,0 0,86" fill={colors[i % colors.length]} />
        </g>
      ))}
    </svg>
  );
}

export default BuntingGarland;
