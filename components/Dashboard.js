"use client";

import { Box, Alert, CircularProgress } from "@mui/material";
import Filter from "./Filter";
import Charts from "./Charts";
import Metadata from "./Metadata";

export default function Dashboard({
  charts,
  meta,
  loading,
  error,
  selectedDiet,
  onDietChange,
  onApply,
  filters,
}) {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col">
      {/* <h1 className="px-6 font-bold text-xl">Explore Nutritional Insights</h1> */}
      {meta && <Metadata metadata={meta} />}

      <Filter
        diets={charts?.diets || []}
        initial={filters}
        onApply={onApply}
        disabled={loading}
      />

      {error && (
        <Box sx={{ px: 3, mb: 2 }}>
          <Alert severity="error">Failed to load data: {error}</Alert>
        </Box>
      )}

      {loading && !charts ? (
        <Box sx={{ display: "grid", placeItems: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : charts ? (
        <Charts charts={charts} selectedDiet={selectedDiet} />
      ) : null}
    </div>
  );
}
