"use client";

import { useState } from "react";
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
  onDietChange,
  onApply,
  filters,
  recipes = [],
}) {
  const [page, setPage] = useState(1);
  const pageSize = 10;

  // Optional: whenever filters change from parent, reset to page 1.
  // You can also do this at the place where you call <Dashboard />.

  const totalRecipes = recipes.length; // later you can use meta.total if backend sends it

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col">
      {meta && <Metadata metadata={meta} />}

      <Filter
        diets={charts?.diets || []}
        initial={filters}
        onApply={(f) => {
          setPage(1);      // reset pagination on new search/filter
          onApply?.(f);
        }}
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

      {/* NEW: Recipe browser with pagination */}
      <RecipeBrowser
        recipes={recipes}
        page={page}
        pageSize={pageSize}
        total={totalRecipes}
        onPageChange={setPage}
      />
    </div>
  );
}
