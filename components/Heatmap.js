"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
});

const AXIS_GRAY = "rgba(15,23,42,0.2)"; 

export default function HeatmapEcharts({ xCats, yCats, matrix }) {
  const seriesData = useMemo(() => {
    const out = [];
    for (let y = 0; y < yCats.length; y++) {
      for (let x = 0; x < xCats.length; x++) {
        const row = matrix[y] || [];
        const raw = Number(row[x] ?? 0);
        const rounded = Math.round(raw * 10) / 10; // 1 decimal place
        out.push([x, y, rounded]);
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
    tooltip: {
      position: "top",
      formatter: (params) => {
        const [xIdx, yIdx, val] = params.value || [];
        return `
          <div>
            <strong>${yCats[yIdx] ?? ""}</strong><br/>
            ${xCats[xIdx] ?? ""}: <strong>${val?.toFixed(1) ?? "0.0"}</strong>
          </div>
        `;
      },
    },
    grid: {
      left: 40,
      right: 100,
      top: 40,
      bottom: 40,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xCats,
      // no splitArea here -> no extra stripes, only side axis
      axisLabel: {
        color: "#000000", // dark labels, like scattermap
        fontSize: 12,
      },
      axisLine: { lineStyle: { color: AXIS_GRAY } }, // same gray as scatter
    },
    yAxis: {
      type: "category",
      data: yCats,
      axisLabel: {
        color: "#000000",
        fontSize: 12,
      },
      axisLine: { lineStyle: { color: AXIS_GRAY } },
    },
    visualMap: {
      min: 0,
      max: maxVal,
      calculable: true,
      orient: "vertical",
      right: 0,
      top: "middle",
      textStyle: {
        color: "#000000",
        fontSize: 11,
      },
      inRange: {
        // keep your pink → rose → indigo ramp
        color: ["#ffe4e6", "#ec4899", "#818cf8"],
      },
    },
    series: [
      {
        type: "heatmap",
        data: seriesData,
        label: {
          show: true,
          formatter: (params) =>
            params.value && params.value[2] != null
              ? params.value[2].toFixed(1)
              : "",
          color: "#111827", // black numbers on tiles
          fontWeight: 500,
          fontSize: 10,
        },
        emphasis: {
          disabled: true,
          focus: "none",
        },
        animation: false,
        animationDurationUpdate: 0,
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ width: "100%", height: 350 }} />
  );
}
