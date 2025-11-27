"use client";

import { Box, Alert, CircularProgress } from "@mui/material";
import Filter from "./Filter";
import Charts from "./Charts";
import Metadata from "./Metadata";
import RecipeBrowser from "./RecipeBrowser";

export default function Dashboard({
  charts,
  meta,
  loading,
  error,
  selectedDiet,
  onApply,
  filters,
  recipes = [],
  page = 1,
  pageSize = 10,
  totalRecipes = 0,
  onPageChange,
  activeFilters,
}) {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col">
      {meta && <Metadata metadata={meta} />}

      <Filter
        diets={filters?.diets || []}
        cuisines={filters?.cuisines || []}
        macroOptions={filters?.macroOptions || []}
        initial={activeFilters}
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

      <RecipeBrowser
        recipes={recipes}
        page={page}
        pageSize={pageSize}
        total={totalRecipes}
        onPageChange={onPageChange}
      />
    </div>
  );
}
