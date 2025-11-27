"use client";

import { useState } from "react";
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
  IconButton,    
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function RecipeBrowser({
  recipes = [],
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
}) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const effectiveTotal = total;
  const totalPages = Math.max(1, Math.ceil(effectiveTotal / pageSize));
  const pageRecipes = recipes;

  const startIndex = effectiveTotal === 0 ? 0 : (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, effectiveTotal);

  const handleRowClick = (recipe) => {
    if (!recipe) return;
    setSelectedRecipe(recipe);
  };

  const handleCloseModal = () => setSelectedRecipe(null);

  const getMacroValue = (r, baseKey) => {
    const direct = r?.[baseKey];
    const suffixed = r?.[`${baseKey}_g`];
    const val = direct ?? suffixed;
    return val === undefined || val === null ? null : Number(val);
  };

  const getCalories = (r) => {
    const p = getMacroValue(r, "protein") || 0;
    const c = getMacroValue(r, "carbs") || 0;
    const f = getMacroValue(r, "fat") || 0;
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
                  <TableCell sx={{ ...thSx, textAlign: "center", width: "65%" }}>
                    Recipe
                  </TableCell>
                  <TableCell sx={{ ...thSx, textAlign: "center", width: "35%" }}>
                    Cuisine
                  </TableCell>
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
                      <TableCell sx={{ ...tdMainSx, width: "65%"}}>{r.recipe_name}</TableCell>
                      <TableCell sx={{ ...tdSx, textAlign: "center", width: "35%" }}>
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
            borderRadius: "28px",
            border: "1px solid rgba(255,255,255,0.65)",
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(244,114,182,0.22))",
            backdropFilter: "blur(26px)",
            boxShadow: "0 24px 70px rgba(15,23,42,0.65)",
          },
        }}
      >
        {selectedRecipe && (
          <>
            <DialogTitle
              sx={{
                fontWeight: 600,
                fontSize: "1rem",
                color: "#f9fafb",
                pb: 1.2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pr: 1, 
              }}
            >
              {selectedRecipe.recipe_name}
              <IconButton
                aria-label="close"
                onClick={handleCloseModal}
                sx={{
                  ml: 2,
                  color: "#e5e7eb",
                  "&:hover": {
                    color: "#ffffff",
                    backgroundColor: "rgba(15,23,42,0.35)",
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </DialogTitle>

            <Divider
              sx={{
                borderColor: "rgba(248,250,252,0.25)",
              }}
            />

            <DialogContent
              sx={{
                pt: 2,
                pb: 2.5,
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                color: "#e5e7eb",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontSize: "0.9rem", color: "#e5e7eb" }}
              >
                <strong>Diet Type:</strong> {selectedRecipe.diet_type || "—"}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontSize: "0.9rem", color: "#e5e7eb" }}
              >
                <strong>Cuisine:</strong> {selectedRecipe.cuisine_type || "—"}
              </Typography>

              <Box sx={{ mt: 1, mb: 1.5 }}>
                <Typography
                  sx={{
                    fontSize: "0.7rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                    color: "rgba(226,232,240,0.9)",
                    mb: 1.5,
                  }}
                >
                  Macros (per serving)
                </Typography>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ flexWrap: "wrap", rowGap: 1.5 }}
                >
                  <MacroPill
                    label="Protein"
                    value={getMacroValue(selectedRecipe, "protein")}
                    unit="g"
                    color="#ec4899"
                  />
                  <MacroPill
                    label="Carbs"
                    value={getMacroValue(selectedRecipe, "carbs")}
                    unit="g"
                    color="#f59e0b"
                  />
                  <MacroPill
                    label="Fat"
                    value={getMacroValue(selectedRecipe, "fat")}
                    unit="g"
                    color="#818cf8"
                  />
                  <MacroPill
                    label="Estimated kcal"
                    value={getCalories(selectedRecipe)}
                    unit="kcal"
                    color="#38bdf8"
                  />
                </Stack>
              </Box>
            </DialogContent>
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
        px: 2,
        py: 0.7,
        border: `1px solid ${color}`,
        background:
          "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.6))",
        boxShadow: "0 6px 14px rgba(15,23,42,0.7)",
      }}
    >
      <Typography
        sx={{
          fontSize: "0.65rem",
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: "rgba(226,232,240,0.85)",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: "0.9rem",
          fontWeight: 600,
          color: "#f9fafb",
        }}
      >
        {display}{" "}
        <span style={{ fontSize: "0.75rem", color: "#e5e7eb" }}>{unit}</span>
      </Typography>
    </Box>
  );
}
