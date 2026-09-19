import { ComputerDesktopIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";

function niceMax(value: number) {
  if (value <= 5) return 5;
  if (value <= 10) return 10;
  if (value <= 20) return 20;
  if (value <= 50) return 50;
  return Math.ceil(value / 10) * 10;
}

export function LineChart({
  labels,
  values,
}: {
  labels: string[];
  values: number[];
}) {
  const width = 640;
  const height = 220;
  const left = 36;
  const right = 12;
  const top = 16;
  const bottom = 28;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const max = niceMax(Math.max(...values, 1));
  const points = values.map((value, index) => {
    const x = left + (index / Math.max(values.length - 1, 1)) * chartWidth;
    const y = top + chartHeight - (value / max) * chartHeight;
    return { x, y };
  });
  const polyline = points.map((point) => `${point.x},${point.y}`).join(" ");
  const area = `${left},${top + chartHeight} ${polyline} ${left + chartWidth},${top + chartHeight}`;
  const ticks = 5;
  const yTicks = Array.from({ length: ticks + 1 }, (_, index) => Math.round((max / ticks) * (ticks - index)));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full">
      {yTicks.map((tick, index) => {
        const y = top + (index / ticks) * chartHeight;
        return (
          <g key={tick}>
            <line x1={left} x2={left + chartWidth} y1={y} y2={y} stroke="#f3f4f6" strokeWidth="1" />
            <text x={left - 8} y={y + 3} textAnchor="end" className="fill-gray-400 text-[10px]">
              {tick}
            </text>
          </g>
        );
      })}
      <polygon points={area} fill="#f59e0b" opacity="0.12" />
      <polyline fill="none" stroke="#d97706" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" points={polyline} />
      {points.map((point, index) =>
        values[index] ? <circle key={`${labels[index]}-dot`} cx={point.x} cy={point.y} r="3" fill="#d97706" /> : null,
      )}
      {labels.map((label, index) => {
        if (index % 2 === 1 && labels.length > 16) return null;
        const x = left + (index / Math.max(labels.length - 1, 1)) * chartWidth;
        return (
          <text key={label} x={x} y={height - 8} textAnchor="middle" className="fill-gray-400 text-[9px]">
            D{label}
          </text>
        );
      })}
    </svg>
  );
}

export function DoughnutChart({
  slices,
  centerLabel,
  centerValue,
}: {
  slices: Array<{ label: string; value: number; color: string }>;
  centerLabel?: string;
  centerValue?: number | string;
}) {
  const total = slices.reduce((sum, item) => sum + item.value, 0) || 1;
  let cursor = 0;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
      <div className="relative h-40 w-40">
        <svg viewBox="0 0 140 140" className="h-40 w-40 -rotate-90">
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="18" />
          {slices.map((slice) => {
            const length = (slice.value / total) * circumference;
            const dash = `${length} ${circumference - length}`;
            const offset = -cursor;
            cursor += length;
            return (
              <circle
                key={slice.label}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={slice.color}
                strokeWidth="18"
                strokeDasharray={dash}
                strokeDashoffset={offset}
                strokeLinecap="butt"
              />
            );
          })}
        </svg>
        {centerLabel ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-[11px] text-gray-400">{centerLabel}</p>
            <p className="text-xl font-semibold text-gray-900">{centerValue ?? 0}</p>
          </div>
        ) : null}
      </div>
      <ul className="space-y-2.5 text-[13px]">
        {slices.map((slice) => (
          <li key={slice.label} className="flex items-center gap-2 text-gray-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: slice.color }} />
            {slice.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DeviceDonut({
  desktop,
  phone,
  desktopPercent,
  phonePercent,
}: {
  desktop: number;
  phone: number;
  desktopPercent: number;
  phonePercent: number;
}) {
  const total = desktop + phone || 1;
  const desktopLength = (desktop / total) * (2 * Math.PI * 46);
  const phoneLength = (phone / total) * (2 * Math.PI * 46);
  const circumference = 2 * Math.PI * 46;

  return (
    <div className="flex items-center gap-5">
      <svg viewBox="0 0 120 120" className="h-32 w-32 -rotate-90">
        <circle cx="60" cy="60" r="46" fill="none" stroke="#f3f4f6" strokeWidth="14" />
        <circle
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="14"
          strokeDasharray={`${desktopLength} ${circumference - desktopLength}`}
        />
        <circle
          cx="60"
          cy="60"
          r="46"
          fill="none"
          stroke="#fb7185"
          strokeWidth="14"
          strokeDasharray={`${phoneLength} ${circumference - phoneLength}`}
          strokeDashoffset={-desktopLength}
        />
      </svg>
      <div className="space-y-5 text-[13px]">
        <div className="flex items-start gap-2">
          <ComputerDesktopIcon className="mt-0.5 h-5 w-5 text-amber-500" />
          <div>
            <p className="text-lg font-semibold text-amber-600">{desktopPercent}%</p>
            <p className="text-gray-500">{desktop} lượt truy cập</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <DevicePhoneMobileIcon className="mt-0.5 h-5 w-5 text-rose-400" />
          <div>
            <p className="text-lg font-semibold text-rose-400">{phonePercent}%</p>
            <p className="text-gray-500">{phone} lượt truy cập</p>
          </div>
        </div>
      </div>
    </div>
  );
}
