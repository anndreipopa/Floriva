import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function LineChart({ dataPoints }) {
  const data = dataPoints.map((p) => ({
    time: p.time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    value: p.value,
  }));

  // Stable unique gradient ID per chart instance
  const gradientId = useMemo(
    () => `chartGradient-${Math.random().toString(36).slice(2)}`,
    []
  );

  return (
   <div className="w-full h-[160px] sm:h-[240px] lg:h-[290px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E8252" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#1E8252" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid stroke="#e5e7eb" strokeDasharray="3 3" />

          <XAxis
            dataKey="time"
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            width={30}
            domain={["dataMin - 5", "dataMax + 5"]} // small padding so the area isn't squashed
            tick={{ fontSize: 10, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />

          <Tooltip
            contentStyle={{
              background: "white",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              fontSize: "12px",
            }}
          />

          {/* Line and gradient */}
          <Area
            type="monotone"
            dataKey="value"
            stroke="#1E8252"
            strokeWidth={3.5}
            fill={`url(#${gradientId})`}
            fillOpacity={1}
            dot={false}
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
