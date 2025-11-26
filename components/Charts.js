"use client";

import dynamic from "next/dynamic";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { useMemo } from "react";
import HeatmapEcharts from "./Heatmap";

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
  const heatmapData = useMemo(() => {
    const labels = charts?.bar?.labels || [];
    const proteinSeries = charts?.bar?.series?.[0]?.data || [];
    const carbsSeries = charts?.bar?.series?.[1]?.data || [];
    const fatSeries = charts?.bar?.series?.[2]?.data || [];

    if (!labels.length || !proteinSeries.length) return null;

    const xCats = ["Protein (g)", "Carbs (g)", "Fat (g)"];
    const yCats = labels;
    const matrix = labels.map((_, idx) => [
      Number(proteinSeries[idx] ?? 0),
      Number(carbsSeries[idx] ?? 0),
      Number(fatSeries[idx] ?? 0),
    ]);

    return { xCats, yCats, matrix };
  }, [charts?.bar?.labels, charts?.bar?.series]);

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
      axisLabel: { color: "#000000", fontSize: 12 },
    },
    yAxis: {
      type: "category",
      data: scatterMock.y,
      axisLine: { lineStyle: { color: "rgba(15,23,42,0.2)" } },
      axisLabel: { color: "#000000", fontSize: 12 },
    },
    series: [
      {
        type: "scatter",
        data: scatterPoints,
        symbolSize: function (val) {
          return 10 + (val[2] / maxScatter) * 25;
        },
        itemStyle: {
          color: "#ec4899",
        },
      },
    ],
  };

  return (
    <div className="px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* -------- BAR CHART -------- */}
        <div className="glass-card p-6 rounded-3xl backdrop-blur-3xl border border-white/20">
          <h2 className="text-lg font-semibold text-white mb-4 drop-shadow">
            Average Macros by Diet (Bar)
          </h2>
          <BarChart
            height={350}
            xAxis={[
              {
                data: charts?.bar?.labels || [],
                scaleType: "band",
                tickLabelStyle: { fill: "#111827" }, // dark text
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: { fill: "#111827" },
              },
            ]}
            grid={{
              vertical: false,
              horizontal: false,
            }}
            sx={{
              "& .MuiChartsAxis-line": {
                stroke: "rgba(15,23,42,0.2)",
              },
              "& .MuiChartsAxis-tick": {
                stroke: "rgba(15,23,42,0.2)",
              },
              "& .MuiChartsAxis-tickLabel": {
                fill: "rgba(15,23,42,0.8)", // dark text
              },
              "& .MuiChartsLegend-label": {
                fill: "rgba(15,23,42,0.8)",
              },
            }}
            series={[
              {
                label: "Protein",
                data: charts?.bar?.series?.[0]?.data || [],
                color: "#ec4899",
              },
              {
                label: "Carbs",
                data: charts?.bar?.series?.[1]?.data || [],
                color: "#f59e0b",
              },
              {
                label: "Fat",
                data: charts?.bar?.series?.[2]?.data || [],
                color: "#818cf8",
              },
            ]}
          />
        </div>

        {/* -------- HEATMAP -------- */}
        <div className="glass-card p-6 rounded-3xl backdrop-blur-xl border border-white/20">
          <h2 className="text-lg font-semibold text-white mb-4 drop-shadow">
            Average Macros Heatmap
          </h2>
          {heatmapData ? (
            <HeatmapEcharts
              xCats={heatmapData.xCats}
              yCats={heatmapData.yCats}
              matrix={heatmapData.matrix}
            />
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
            sx={{
              // legend text
              "& .MuiChartsLegend-label": {
                fill: "#111827",
              },
              // slice labels (if you ever show them)
              "& .MuiChartsPie-label": {
                fill: "#111827",
              },
            }}
            series={[
              {
                data: pieData.map((d, i) => ({
                  ...d,
                  color: [
                    "#ec4899", // protein
                    "#f59e0b", // carbs
                    "#818cf8", // fat
                    "#f472b6",
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
