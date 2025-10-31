// components/HeatmapEcharts.jsx
"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export default function HeatmapEcharts({ xCats, yCats, matrix }) {
  // convert matrix (rows=yCats, cols=xCats) into ECharts [xIndex, yIndex, value]
  const seriesData = useMemo(() => {
    const out = [];
    for (let y = 0; y < yCats.length; y++) {
      for (let x = 0; x < xCats.length; x++) {
        out.push([x, y, matrix[y][x] ?? 0]);
      }
    }
    return out;
  }, [xCats, yCats, matrix]);

  const option = {
    tooltip: { position: "top" },
    grid: {
      left: 20, 
      right: 80, 
      top: 20,
      bottom: 40,
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: xCats, // ["Protein (g)","Carbs (g)","Fat (g)"]
      splitArea: { show: true },
      axisLabel: { color: "#fff", fontSize: 12 },
    },
    yAxis: {
      type: "category",
      data: yCats, // ["Dash","Keto",...]
      splitArea: { show: true },
      axisLabel: { color: "#fff", fontSize: 12 },
    },
    visualMap: {
      min: 0,
      max: Math.max(...seriesData.map((d) => d[2])),
      calculable: true,
      orient: "vertical",
      right: 0,
      top: "middle",
      inRange: { color: ["#FFFFFF", "#8A9C25"] },
    },
    series: [
      {
        type: "heatmap",
        data: seriesData,
        label: { show: true, color: "#fff", fontWeight: 600, fontSize: 12 },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: "rgba(0,0,0,0.5)" },
        },
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ width: "100%", height: 420 }} />
  );
}
