"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
});

export default function HeatmapEcharts({ xCats, yCats, matrix }) {
  const seriesData = useMemo(() => {
    const out = [];
    for (let y = 0; y < yCats.length; y++) {
      for (let x = 0; x < xCats.length; x++) {
        const row = matrix[y] || [];
        out.push([x, y, row[x] != null ? row[x] : 0]);
      }
    }
    return out;
  }, [xCats, yCats, matrix]);

  const maxVal =
    seriesData.length > 0
      ? Math.max.apply(
          null,
          seriesData.map((d) => d[2])
        )
      : 1;

  const option = {
    tooltip: { position: "top" },
    grid: {
      left: 30,
      right: 70,
      top: 30,
      bottom: 40,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xCats,
      splitArea: { show: true },
      axisLabel: { color: "rgba(15,23,42,0.8)", fontSize: 12 },
      axisLine: { lineStyle: { color: "rgba(15,23,42,0.2)" } },
    },
    yAxis: {
      type: "category",
      data: yCats,
      splitArea: { show: true },
      axisLabel: { color: "rgba(15,23,42,0.8)", fontSize: 12 },
      axisLine: { lineStyle: { color: "rgba(15,23,42,0.2)" } },
    },
    visualMap: {
      min: 0,
      max: maxVal,
      calculable: true,
      orient: "vertical",
      right: 0,
      top: "middle",
      inRange: {
        // soft pink → rose → violet (no green)
        color: ["#fee2e2", "#f9a8d4", "#c4b5fd"],
      },
    },
    series: [
      {
        type: "heatmap",
        data: seriesData,
        label: {
          show: true,
          color: "#111827",
          fontWeight: 600,
          fontSize: 12,
        },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: "rgba(0,0,0,0.4)" },
        },
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ width: "100%", height: 420 }} />
  );
}
