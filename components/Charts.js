"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";
import HeatmapEcharts from "./Heatmap";
import { palette } from "@/src/styles/colors";

export default function Charts({ charts, selectedDiet }) {
  const [index, setIndex] = useState(0);
  const diets = charts?.bar?.labels || [];

  const pieIndex = useMemo(() => {
    const sel = (selectedDiet || "").toLowerCase();
    const idx = diets.findIndex((d) => d.toLowerCase() === sel);
    return idx >= 0 ? idx : 0;
  }, [diets, selectedDiet]);
  const titleDiet = useMemo(() => diets[pieIndex] || "", [diets, pieIndex]);

  const pieData = charts?.pieForDiet?.(pieIndex) || [];

  const cards = [
    {
      key: "bar",
      title: "Average Macros by Diet (Bar)",
      body: (
        <BarChart
          xAxis={[{ data: charts?.bar?.labels || [], scaleType: "band" }]}
          series={[
            {
              label: "Protein (g)",
              data: charts?.bar?.series[0].data,
              color: palette.primary,
            },
            {
              label: "Carbs (g)",
              data: charts?.bar?.series[1].data,
              color: "#8A9C25",
            },
            {
              label: "Fat (g)",
              data: charts?.bar?.series[2].data,
              color: "#C1E899",
            },
          ]}
          height={360}
        />
      ),
    },
    {
      key: "heatmap",
      title: "Average Macros Heatmap",
      body: (
        <HeatmapEcharts
          xCats={charts?.heatmap?.xCats || []}
          yCats={charts?.heatmap?.yCats || []}
          matrix={charts?.heatmap?.matrix || []}
        />
      ),
    },
    {
      key: "pie",
      title: `Macronutrient Distribution — ${titleDiet}`,
      body: (
        <PieChart
          series={[
            {
              data: (pieData || []).map((d, i) => ({
                ...d,
                color: ["#3E721D", "#6DAE3E", "#A2D45E", "#C8E6A3", "#E8F5E9"][
                  i % 5
                ],
              })),
            },
          ]}
          height={360}
        />
      ),
    },
  ];

  const prev = () => setIndex((i) => (i - 1 + cards.length) % cards.length);
  const next = () => setIndex((i) => (i + 1) % cards.length);

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        elevation={2}
        sx={{
          p: 3,
          borderRadius: 2,
          bgcolor: palette.paper,
          color: palette.textSecondary,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ mb: 1 }}
        >
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Data Visualizations — {cards[index].title}
          </Typography>
          <Stack direction="row" spacing={1}>
            <IconButton onClick={prev}>
              <ArrowBackIosNewIcon fontSize="small" sx={{ color: "#E6F0DC" }} />
            </IconButton>
            <IconButton onClick={next}>
              <ArrowForwardIosIcon fontSize="small" sx={{ color: "#E6F0DC" }} />
            </IconButton>
          </Stack>
        </Stack>
        <Divider sx={{ mb: 2, borderColor: palette.primary, opacity: 0.3 }} />
        <Box sx={{ width: "100%" }}>{cards[index].body}</Box>
      </Paper>
    </Box>
  );
}
