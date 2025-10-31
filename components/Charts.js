"use client";

import { useState } from "react";
import {
  Box, Paper, Stack, Typography, IconButton, Divider,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { palette } from "@/src/styles/colors";
import HeatmapEcharts from "./Heatmap";

export default function Charts() {
  const [index, setIndex] = useState(0);

  // ---- heatmap data (declare, don't assign to an undeclared var) ----
  const heatmapConfig = {
    xCats: ["Protein (g)", "Carbs (g)", "Fat (g)"],
    yCats: ["Dash", "Keto", "Mediterranean", "Paleo", "Vegan"],
    matrix: [
      [22, 35, 12],
      [28, 10, 45],
      [20, 40, 18],
      [26, 20, 22],
      [18, 42, 15],
    ],
  };

  // sample data for other charts (consistent with heatmap)
  const diets = heatmapConfig.yCats;

  const cards = [
    {
      key: "bar",
      title: "Average Macros by Diet (Bar)",
      body: (
        <BarChart
          xAxis={[{ data: diets, scaleType: "band" }]}
          series={[
            { label: "Protein", data: heatmapConfig.matrix.map(r => r[0]), color: palette.primary },
            { label: "Carbs",   data: heatmapConfig.matrix.map(r => r[1]), color: "#8A9C25" },
            { label: "Fat",     data: heatmapConfig.matrix.map(r => r[2]), color: "#C1E899" },
          ]}
          height={360}
        />
      ),
    },
    {
      key: "scatter",
      title: "Top Protein Recipes by Cuisine (Scatter)",
      body: (
        <ScatterChart
          series={[
            { label: "Keto",  data: [{ x: "Italian", y: 45 }, { x: "French", y: 38 }] },
            { label: "Paleo", data: [{ x: "Asian", y: 34 }] },
            { label: "Dash",  data: [{ x: "American", y: 28 }] },
            { label: "Vegan", data: [{ x: "Indian", y: 24 }] },
          ]}
          xAxis={[{ scaleType: "band", data: ["Italian","French","Asian","American","Indian"] }]}
          yAxis={[{ label: "Protein (g)" }]}
          height={360}
        />
      ),
    },
    {
      key: "heatmap",
      title: "Average Macros Heatmap",
      body: (
        <HeatmapEcharts
          xCats={heatmapConfig.xCats}
          yCats={heatmapConfig.yCats}
          matrix={heatmapConfig.matrix}
        />
      ),
    },
    {
      key: "pie",
      title: "Macronutrient Distribution (Pie)",
      body: (
        <PieChart
          series={[{
            data: [
              { id: 0, value: 23, label: "Protein" },
              { id: 1, value: 36, label: "Carbs" },
              { id: 2, value: 17, label: "Fat" },
            ],
          }]}
          height={360}
        />
      ),
    },
  ];

  const prev = () => setIndex(i => (i - 1 + cards.length) % cards.length);
  const next = () => setIndex(i => (i + 1) % cards.length);

  return (
    <Box sx={{ p: 3 }}>
      <Paper elevation={2} sx={{ p: 3, bgcolor: palette.paper, borderRadius: 2 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: palette.primary }}>
            Data Visualizations — {cards[index].title}
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton onClick={prev} sx={{ color: palette.primary }}>
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>
            <IconButton onClick={next} sx={{ color: palette.primary }}>
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Stack>
        <Divider sx={{ mb: 2, borderColor: palette.primary, opacity: 0.3 }} />
        <Box sx={{ width: "100%" }}>{cards[index].body}</Box>
      </Paper>
    </Box>
  );
}
