"use client";
import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Chip,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import { palette } from "@/src/styles/colors";

const selectSx = {
  "&.MuiFormControl-root": { minWidth: 150 },
  "& .MuiOutlinedInput-root": {
    bgcolor: palette.paper,
    "& fieldset": { borderColor: palette.primary },
    "&:hover fieldset": { borderColor: palette.primary },
    "&.Mui-focused fieldset": { borderColor: palette.primary, borderWidth: 2 },
    "& .MuiSelect-select": {
      fontSize: "0.9rem",
      paddingTop: "8px",
      paddingBottom: "8px",
    },
  },
  "& .MuiInputLabel-root": { color: palette.primary, fontSize: "0.85rem" },
  "& .MuiInputLabel-root.Mui-focused": { color: palette.primary },
  "& .MuiSelect-icon": { color: palette.primary },
};

const menuProps = {
  PaperProps: {
    sx: {
      bgcolor: palette.paper,
      "& .MuiMenuItem-root": {
        fontSize: "0.9rem",
        "&.Mui-selected": {
          backgroundColor: palette.primary,
          color: "#55883B",
          "&:hover": { backgroundColor: "#C1E899" },
        },
      },
    },
  },
};

const textFieldSx = {
  flexGrow: 1,
  "& .MuiOutlinedInput-root": {
    bgcolor: palette.paper,
    "& fieldset": { borderColor: palette.primary },
    "&:hover fieldset": { borderColor: palette.primary },
    "&.Mui-focused fieldset": { borderColor: palette.primary, borderWidth: 2 },
    "& input": { fontSize: "0.9rem", paddingTop: "8px", paddingBottom: "8px" },
  },
  "& .MuiInputLabel-root": { color: palette.primary, fontSize: "0.85rem" },
  "& .MuiInputLabel-root.Mui-focused": { color: palette.primary },
};

const DIET_TYPES = ["Dash", "Keto", "Mediterranean", "Paleo", "Vegan"];
const CUISINES = [
  "American",
  "Asian",
  "British",
  "Caribbean",
  "Central Europe",
  "Chinese",
  "Eastern Europe",
  "French",
  "Indian",
  "Italian",
  "Japanese",
  "Kosher",
  "Mediterranean",
  "Mexican",
  "Middle Eastern",
  "Nordic",
  "South American",
  "South East Asian",
  "World",
];

/**
 * Props:
 * - onApply({ diet, cuisine, search })
 * - onRefresh?(): optional manual refresh
 * - loading?: boolean (disable controls when fetching)
 * - showRefresh?: boolean (default true)
 * - initialFilters?: { diet?:string, cuisine?:string, search?:string }
 */
export default function FiltersBar({
  onApply,
  onRefresh,
  loading = false,
  showRefresh = true,
  initialFilters = {},
}) {
  const [diet, setDiet] = useState(initialFilters.diet ?? "");
  const [cuisine, setCuisine] = useState(initialFilters.cuisine ?? "");
  const [search, setSearch] = useState(initialFilters.search ?? "");

  // Debounced auto-apply whenever filters change
  useEffect(() => {
    const t = setTimeout(() => {
      onApply?.({ diet, cuisine, search });
    }, 500);
    return () => clearTimeout(t);
  }, [diet, cuisine, search, onApply]);

  const hasActive = useMemo(
    () => !!(diet || cuisine || search),
    [diet, cuisine, search]
  );

  const clearAll = () => {
    setDiet("");
    setCuisine("");
    setSearch("");
    // fire immediately so UI reflects cleared results fast
    onApply?.({ diet: "", cuisine: "", search: "" });
  };

  return (
    <Box sx={{ bgcolor: palette.background, p: 3 }}>
      <Paper
        elevation={2}
        sx={{ p: 3, bgcolor: palette.paper, borderRadius: 2 }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="stretch"
        >
          {/* Search */}
          <TextField
            fullWidth
            size="small"
            label="Search recipe, diet type, cuisine type"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={textFieldSx}
            disabled={loading}
          />

          {/* Diet */}
          <FormControl size="small" sx={selectSx} disabled={loading}>
            <InputLabel id="diet-type-label">Diet Type</InputLabel>
            <Select
              labelId="diet-type-label"
              id="diet-type-select"
              value={diet}
              label="Diet Type"
              onChange={(e) => setDiet(e.target.value)}
              MenuProps={menuProps}
            >
              <MenuItem value="">
                <em>All Diets</em>
              </MenuItem>
              {DIET_TYPES.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Cuisine */}
          <FormControl size="small" sx={selectSx} disabled={loading}>
            <InputLabel id="cuisine-type-label">Cuisine Type</InputLabel>
            <Select
              labelId="cuisine-type-label"
              id="cuisine-type-select"
              value={cuisine}
              label="Cuisine Type"
              onChange={(e) => setCuisine(e.target.value)}
              MenuProps={menuProps}
            >
              <MenuItem value="">
                <em>All Cuisines</em>
              </MenuItem>
              {CUISINES.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Actions */}

          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => onRefresh?.()}
            disabled={loading}
            sx={{
              textTransform: "none",
              borderColor: palette.primary,
              color: palette.primary,
              backgroundColor: "#9A6735",
              height: "40px",
              borderRadius: "8px",
              alignSelf: "center",
              padding: "2px",
              whiteSpace: "nowrap",
              minWidth: "100px",
            }}
          >
            Refresh
          </Button>
        </Stack>

        {/* Active filter chips (optional, nice UX) */}
        {hasActive && (
          <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: "wrap" }}>
            {diet && (
              <Chip
                label={`Diet: ${diet}`}
                onDelete={() => setDiet("")}
                sx={{ bgcolor: "#f1e6d6" }}
              />
            )}
            {cuisine && (
              <Chip
                label={`Cuisine: ${cuisine}`}
                onDelete={() => setCuisine("")}
                sx={{ bgcolor: "#f1e6d6" }}
              />
            )}
            {search && (
              <Chip
                label={`Search: ${search}`}
                onDelete={() => setSearch("")}
                sx={{ bgcolor: "#f1e6d6" }}
              />
            )}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
