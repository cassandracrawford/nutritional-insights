"use client";

import { useState, useEffect } from "react";
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
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { palette } from "@/src/styles/colors"; // ← your palette, unchanged

const selectSx = {
  "&.MuiFormControl-root": { minWidth: 150 },
  "& .MuiInputBase-root": {
    height: 40,
  },
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
  "& .MuiInputBase-root": {
    height: 40,
  },
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

/**
 * Props:
 * - diets: string[]
 * - initial: { diet?: string, search?: string }
 * - onApply({ diet, search })
 * - onRefresh()
 * - disabled?: boolean
 */
export default function Filter({
  diets = [],
  initial = { diet: "", search: "" },
  onApply,
  disabled = false,
}) {
  const [diet, setDiet] = useState(initial.diet || "");
  const [search, setSearch] = useState(initial.search || "");

  // Debounce apply
  useEffect(() => {
    const t = setTimeout(() => onApply?.({ diet, search }), 400);
    return () => clearTimeout(t);
  }, [diet, search, onApply]);

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
          {/* Search (kept) */}
          <TextField
            size="small"
            label="Search diet type..."
            placeholder="e.g., keto, vegan…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={textFieldSx}
            disabled={disabled}
          />

          {/* Diet Type (kept) */}
          <FormControl
            size="small"
            sx={selectSx}
            disabled={disabled || !diets.length}
          >
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
              {diets.map((d) => (
                <MenuItem key={d} value={d.toLowerCase()}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Refresh (kept) */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={() => {
              setDiet("");
              setSearch("");
              onApply?.({ diet: "", search: "" });
            }}
            disabled={disabled}
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
            Reset
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}
