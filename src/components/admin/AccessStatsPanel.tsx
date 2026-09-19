"use client";

import { ComputerDesktopIcon, DevicePhoneMobileIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { DeviceDonut, DoughnutChart, LineChart } from "@/components/admin/charts";
import { CmsButton, CmsCard, CmsSelect } from "@/components/admin/ui";
import { accessStats } from "@/lib/cms-access";
import type { CmsAccessLog } from "@/lib/cms-records";

const BROWSER_COLORS: Record<string, string> = {
  Chrome: "#f59e0b",
  "Microsoft Edge": "#38bdf8",
  "Internet Explorer": "#818cf8",
  "Mozilla Firefox": "#fb923c",
  Safari: "#34d399",
};

export default function AccessStatsPanel({ logs }: { logs: CmsAccessLog[] }) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [applied, setApplied] = useState({ month: now.getMonth() + 1, year: now.getFullYear() });
  const stats = useMemo(() => accessStats(logs, applied.month, applied.year), [logs, applied]);
  const labels = stats.byDay.map((_, index) => String(index + 1).padStart(2, "0"));

  function applyFilter() {
    setApplied({ month, year });
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-5 xl:grid-cols-[1.45fr_0.75fr]">
        <CmsCard
          title={`Thống kê truy cập tháng ${String(applied.month).padStart(2, "0")}/${applied.year}`}
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <CmsSelect value={String(month)} onChange={(event) => setMonth(Number(event.target.value))} className="w-28">
                {Array.from({ length: 12 }, (_, index) => (
                  <option key={index + 1} value={index + 1}>
                    Tháng {index + 1}
                  </option>
                ))}
              </CmsSelect>
              <CmsSelect value={String(year)} onChange={(event) => setYear(Number(event.target.value))} className="w-28">
                {[now.getFullYear(), now.getFullYear() - 1].map((value) => (
                  <option key={value} value={value}>
                    Năm {value}
                  </option>
                ))}
              </CmsSelect>
              <CmsButton type="button" onClick={applyFilter}>
                Thống kê
              </CmsButton>
            </div>
          }
        >
          <LineChart labels={labels} values={stats.byDay} />
        </CmsCard>
        <CmsCard title="Thống kê truy cập">
          <DoughnutChart
            centerLabel="Đang online"
            centerValue={stats.online}
            slices={[
              { label: "Đang online", value: Math.max(stats.online, 0), color: "#d97706" },
              { label: "Trong tuần", value: stats.week, color: "#fbbf24" },
              { label: "Trong tháng", value: stats.month, color: "#38bdf8" },
              { label: "Tổng truy cập", value: stats.total, color: "#fb7185" },
            ]}
          />
        </CmsCard>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <CmsCard title="Thống kê trình duyệt">
          <ul className="space-y-3">
            {stats.browsers.map((item) => (
              <li key={item.name} className="flex items-center justify-between text-[13px]">
                <span className="flex items-center gap-2.5 text-gray-600">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ background: BROWSER_COLORS[item.name] || "#9ca3af" }} />
                  {item.name}
                </span>
                <strong className="text-gray-900">{item.count}</strong>
              </li>
            ))}
          </ul>
        </CmsCard>

        <CmsCard title="Thống kê thiết bị">
          <DeviceDonut
            desktop={stats.devices.desktop}
            phone={stats.devices.phone}
            desktopPercent={stats.devices.desktopPercent}
            phonePercent={stats.devices.phonePercent}
          />
          <div className="mt-4 flex gap-4 text-[12px] text-gray-400">
            <span className="inline-flex items-center gap-1.5">
              <ComputerDesktopIcon className="h-4 w-4 text-amber-500" />
              Máy tính
            </span>
            <span className="inline-flex items-center gap-1.5">
              <DevicePhoneMobileIcon className="h-4 w-4 text-rose-400" />
              Điện thoại
            </span>
          </div>
        </CmsCard>

        <CmsCard title="Thống kê IP">
          {stats.ips.length ? (
            <ul className="space-y-3">
              {stats.ips.map((item) => (
                <li key={item.ip} className="flex items-center justify-between text-[13px]">
                  <span className="flex items-center gap-2 font-mono text-gray-600">
                    <GlobeAltIcon className="h-4 w-4 text-amber-500" />
                    {item.ip}
                  </span>
                  <span className="text-gray-500">{item.count} lần</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[13px] text-gray-400">Chưa có lượt truy cập trong tháng này.</p>
          )}
        </CmsCard>
      </div>
    </div>
  );
}
