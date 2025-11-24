"use client";

import dynamic from "next/dynamic";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useMemo } from "react";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
});

export default function Charts({ charts, selectedDiet }) {
  // ------------------------
  // PIE CHART – selected diet
  // ------------------------
  const diets = charts?.bar?.labels || [];

  const pieIndex = useMemo(() => {
    const sel = (selectedDiet || "").toLowerCase();
    const idx = diets.findIndex((d) => d.toLowerCase() === sel);
    return idx >= 0 ? idx : 0;
  }, [diets, selectedDiet]);

  const pieData = charts?.pieForDiet?.(pieIndex) || [];

  // ------------------------
  // HEATMAP – safe guard so option is never undefined
  // ------------------------
  const heatmapOption = charts?.heatmapOption || null;

  // ------------------------
  // SCATTERMAP MOCK DATA
  // ------------------------
  const scatterMock = {
    x: ["Protein", "Carbs", "Fat", "Fiber"],
    y: ["Keto", "Dash", "Vegan", "Paleo"],
    values: [
      [40, 50, 30, 20],
      [60, 80, 20, 35],
      [30, 90, 25, 40],
      [70, 40, 15, 10],
    ],
  };

  const scatterPoints = [];
  for (let yi = 0; yi < scatterMock.y.length; yi++) {
    for (let xi = 0; xi < scatterMock.x.length; xi++) {
      scatterPoints.push([xi, yi, scatterMock.values[yi][xi]]);
    }
  }

  const maxScatter = scatterPoints.length
    ? Math.max.apply(
        null,
        scatterPoints.map((p) => p[2])
      )
    : 1;

  const scatterOption = {
    tooltip: {
      formatter: function (params) {
        const value = params.value || [];
        const xIndex = value[0];
        const yIndex = value[1];
        const val = value[2];
        return (
          "<strong>" +
          scatterMock.y[yIndex] +
          "</strong><br/>" +
          scatterMock.x[xIndex] +
          ": " +
          val
        );
      },
    },
    grid: { left: 40, right: 20, top: 30, bottom: 40, containLabel: true },
    xAxis: {
      type: "category",
      data: scatterMock.x,
      axisLine: { lineStyle: { color: "rgba(15,23,42,0.2)" } },
      axisLabel: { color: "rgba(15,23,42,0.8)", fontSize: 12 },
    },
    yAxis: {
      type: "category",
      data: scatterMock.y,
      axisLine: { lineStyle: { color: "rgba(15,23,42,0.2)" } },
      axisLabel: { color: "rgba(15,23,42,0.8)", fontSize: 12 },
    },
    series: [
      {
        type: "scatter",
        data: scatterPoints,
        symbolSize: function (val) {
          return 10 + (val[2] / maxScatter) * 25;
        },
        itemStyle: {
          color: "#fb7185", // rose, no green
        },
      },
    ],
  };

  return (
    <div className="px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* -------- BAR CHART -------- */}
        <div className="glass-card p-6 rounded-3xl backdrop-blur-xl border border-white/20">
          <h2 className="text-lg font-semibold text-white mb-4 drop-shadow">
            Average Macros by Diet (Bar)
          </h2>
          <BarChart
            height={350}
            xAxis={[
              {
                data: charts?.bar?.labels || [],
                scaleType: "band",
              },
            ]}
            series={[
              {
                label: "Protein",
                data: charts?.bar?.series?.[0]?.data || [],
                color: "#fb7185", // rose
              },
              {
                label: "Carbs",
                data: charts?.bar?.series?.[1]?.data || [],
                color: "#f97316", // orange
              },
              {
                label: "Fat",
                data: charts?.bar?.series?.[2]?.data || [],
                color: "#c4b5fd", // violet
              },
            ]}
          />
        </div>

        {/* -------- HEATMAP -------- */}
        <div className="glass-card p-6 rounded-3xl backdrop-blur-xl border border-white/20">
          <h2 className="text-lg font-semibold text-white mb-4 drop-shadow">
            Average Macros Heatmap
          </h2>
          {heatmapOption ? (
            <ReactECharts option={heatmapOption} style={{ height: 350 }} />
          ) : (
            <div className="flex h-[350px] items-center justify-center text-sm text-white/70">
              No heatmap data available.
            </div>
          )}
        </div>

        {/* -------- PIE CHART -------- */}
        <div className="glass-card p-6 rounded-3xl backdrop-blur-xl border border-white/20">
          <h2 className="text-lg font-semibold text-white mb-4 drop-shadow">
            Macronutrient Distribution — {diets[pieIndex] || "Diet"}
          </h2>

          <PieChart
            height={350}
            series={[
              {
                data: pieData.map((d, i) => ({
                  ...d,
                  color: [
                    "#fb7185", // rose
                    "#f97316", // orange
                    "#fbbf24", // amber
                    "#c4b5fd", // violet
                  ][i % 4],
                })),
              },
            ]}
          />
        </div>

        {/* -------- SCATTERMAP (MOCK) -------- */}
        <div className="glass-card p-6 rounded-3xl backdrop-blur-xl border border-white/20">
          <h2 className="text-lg font-semibold text-white mb-4 drop-shadow">
            Scattermap (Mock Data)
          </h2>
          <ReactECharts option={scatterOption} style={{ height: 350 }} />
        </div>
      </div>

      <style jsx>{`
        .glass-card {
          background: rgba(255, 255, 255, 0.12);
          box-shadow: 0 10px 32px rgba(15, 23, 42, 0.25);
        }
      `}</style>
    </div>
  );
}
