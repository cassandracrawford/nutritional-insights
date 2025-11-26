// components/RecipeBrowser.jsx
"use client";

import { useMemo, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
  Typography,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Divider,
} from "@mui/material";

/**
 * Props:
 * - recipes: array of:
 *    {
 *      id: string | number,
 *      recipe_name: string,
 *      diet_type: string,
 *      cuisine_type?: string,
 *      protein_g?: number,
 *      carbs_g?: number,
 *      fat_g?: number,
 *    }
 * - page: current page (1-based)
 * - pageSize: number of rows per page
 * - total: total number of recipes (for pagination)
 * - onPageChange(newPage: number)
 */
export default function RecipeBrowser({
  recipes = [],
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
}) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const totalPages = Math.max(1, Math.ceil((total || recipes.length) / pageSize));
  const effectiveTotal = total || recipes.length;

  const pageRecipes = useMemo(() => {
    const start = (page - 1) * pageSize;
    return recipes.slice(start, start + pageSize);
  }, [recipes, page, pageSize]);

  const startIndex = effectiveTotal === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, effectiveTotal);

  const handleRowClick = (recipe) => {
    if (!recipe) return;
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => setSelectedRecipe(null);

  // helper to compute calories if you want to show it
  const getCalories = (r) => {
    const p = Number(r.protein_g ?? 0);
    const c = Number(r.carbs_g ?? 0);
    const f = Number(r.fat_g ?? 0);
    return Math.round(p * 4 + c * 4 + f * 9);
  };

  return (
    <>
      {/* MAIN TABLE */}
      <section className="w-full flex justify-center px-4 pt-6 pb-8">
        <div
          className="
            w-full max-w-7xl
            rounded-3xl border border-white/25 bg-white/10
            backdrop-blur-3xl
            shadow-xl shadow-slate-900/40
            px-4 py-4 sm:px-6 sm:py-5
          "
        >
          <div className="flex items-center justify-between mb-3 gap-2">
            <Typography
              variant="body2"
              sx={{
                fontSize: "0.75rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                color: "rgba(241,245,249,0.85)",
              }}
            >
              Browse Recipes
            </Typography>

            <Typography
              variant="body2"
              sx={{ fontSize: "0.8rem", color: "rgba(241,245,249,0.9)" }}
            >
              {effectiveTotal > 0 ? (
                <>
                  Showing{" "}
                  <span className="font-semibold text-white">
                    {startIndex}–{endIndex}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-white">
                    {effectiveTotal}
                  </span>{" "}
                  recipes
                </>
              ) : (
                "No recipes match the current filters."
              )}
            </Typography>
          </div>

          <TableContainer
            sx={{
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,0.25)",
              backgroundColor: "rgba(15,23,42,0.25)",
              backdropFilter: "blur(18px)",
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ ...thSx, textAlign: "center" }}>Recipe</TableCell>
                  <TableCell sx={{ ...thSx, textAlign: "center" }}>Cuisine</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pageRecipes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      sx={{
                        color: "rgba(241,245,249,0.9)",
                        fontSize: "0.85rem",
                        textAlign: "center",
                        py: 3,
                      }}
                    >
                      No recipes to display.
                    </TableCell>
                  </TableRow>
                ) : (
                  pageRecipes.map((r) => (
                    <TableRow
                      key={r.id ?? r.recipe_name}
                      hover
                      onClick={() => handleRowClick(r)}
                      sx={{
                        cursor: "pointer",
                        "&:nth-of-type(odd)": {
                          backgroundColor: "rgba(15,23,42,0.32)",
                        },
                        "&:hover": {
                          backgroundColor: "rgba(15,23,42,0.5)",
                        },
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell sx={tdMainSx}>{r.recipe_name}</TableCell>
                      <TableCell sx={tdSx}>
                        {r.cuisine_type || "—"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3 }}>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="center"
              spacing={2}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={(_, newPage) => onPageChange?.(newPage)}
                shape="rounded"
                size="small"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "rgba(241,245,249,0.9)",
                  },
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "rgba(255,255,255,0.9)",
                    color: "#111827",
                  },
                }}
              />
            </Stack>
          </Box>
        </div>
      </section>

      {/* DETAIL MODAL */}
      <Dialog
        open={!!selectedRecipe}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "24px",
            background:
              "radial-gradient(circle at top left, rgba(248,250,252,0.98), rgba(241,245,249,0.96))",
            boxShadow: "0 22px 60px rgba(15,23,42,0.45)",
          },
        }}
      >
        {selectedRecipe && (
          <>
            <DialogTitle
              sx={{
                fontWeight: 600,
                fontSize: "1.1rem",
                color: "#0f172a",
              }}
            >
              {selectedRecipe.recipe_name}
            </DialogTitle>
            <Divider />
            <DialogContent
              sx={{
                pt: 2,
                pb: 1,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
              }}
            >
              <Typography
                variant="body2"
                sx={{ color: "#4b5563", fontSize: "0.9rem" }}
              >
                <strong>Diet Type:</strong>{" "}
                {selectedRecipe.diet_type || "—"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "#4b5563", fontSize: "0.9rem" }}
              >
                <strong>Cuisine:</strong>{" "}
                {selectedRecipe.cuisine_type || "—"}
              </Typography>

              <Box sx={{ mt: 1 }}>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    color: "#6b7280",
                    mb: 0.5,
                  }}
                >
                  Macros (per serving)
                </Typography>
                <Stack direction="row" spacing={3}>
                  <MacroPill label="Protein" value={selectedRecipe.protein_g} unit="g" color="#ec4899" />
                  <MacroPill label="Carbs" value={selectedRecipe.carbs_g} unit="g" color="#f59e0b" />
                  <MacroPill label="Fat" value={selectedRecipe.fat_g} unit="g" color="#818cf8" />
                  <MacroPill label="Estimated kcal" value={getCalories(selectedRecipe)} unit="kcal" color="#0ea5e9" />
                </Stack>
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
              <Button
                onClick={handleCloseModal}
                variant="contained"
                sx={{
                  textTransform: "none",
                  borderRadius: "999px",
                  px: 3,
                  backgroundColor: "#0f172a",
                  "&:hover": { backgroundColor: "#020617" },
                }}
              >
                Close
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </>
  );
}

/* --- styles --- */

const thSx = {
  fontSize: "0.75rem",
  textTransform: "uppercase",
  letterSpacing: "0.12em",
  color: "rgba(241,245,249,0.85)",
  borderBottom: "1px solid rgba(148,163,184,0.4)",
};

const tdSx = {
  fontSize: "0.85rem",
  color: "rgba(241,245,249,0.95)",
  borderBottom: "1px solid rgba(148,163,184,0.2)",
};

const tdMainSx = {
  ...tdSx,
  fontWeight: 500,
};

/* helper component for macro badges */
function MacroPill({ label, value, unit, color }) {
  const display =
    value === null || value === undefined || Number.isNaN(Number(value))
      ? "—"
      : Number(value).toFixed(1).replace(/\.0$/, "");

  return (
    <Box
      sx={{
        borderRadius: "999px",
        px: 1.8,
        py: 0.6,
        border: `1px solid ${color}`,
        backgroundColor: "rgba(248,250,252,0.9)",
      }}
    >
      <Typography
        sx={{
          fontSize: "0.65rem",
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "#6b7280",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.9rem",
          fontWeight: 600,
          color: "#111827",
        }}
      >
        {display}{" "}
        <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>{unit}</span>
      </Typography>
    </Box>
  );
}
