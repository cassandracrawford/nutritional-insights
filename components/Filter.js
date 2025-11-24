"use client";

import { useState, useEffect } from "react";
import {
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";

// Glass-style colours (no palette import)
const glassFieldBg = "rgba(255, 255, 255, 0.14)";
const glassBorder = "rgba(255, 255, 255, 0.55)";
const labelColor = "rgba(255, 255, 255, 0.9)";
const textColor = "#FFFFFF";
const placeholderColor = "rgba(241, 245, 249, 0.8)";

const selectSx = {
  "&.MuiFormControl-root": { minWidth: 150 },
  "& .MuiInputBase-root": {
    height: 40,
    color: textColor,
  },
  "& .MuiOutlinedInput-root": {
    bgcolor: glassFieldBg,
    borderRadius: "999px",
    "& fieldset": { borderColor: glassBorder },
    "&:hover fieldset": { borderColor: glassBorder },
    "&.Mui-focused fieldset": { borderColor: "#FFFFFF", borderWidth: 1.5 },
    "& .MuiSelect-select": {
      fontSize: "0.9rem",
      paddingTop: "8px",
      paddingBottom: "8px",
    },
  },
  "& .MuiInputLabel-root": {
    color: labelColor,
    fontSize: "0.85rem",
  },
  "& .MuiInputLabel-root.Mui-focused": { color: labelColor },
  "& .MuiSelect-icon": { color: labelColor },
};

const menuProps = {
  PaperProps: {
    sx: {
      mt: 1,
      borderRadius: "20px",
      bgcolor: "rgba(255, 255, 255, 0.16)", // light glass
      backdropFilter: "blur(24px)",
      border: "1px solid rgba(255, 255, 255, 0.7)",
      boxShadow: "0 18px 40px rgba(15, 23, 42, 0.35)",
      overflow: "hidden",

      "& .MuiMenuItem-root": {
        fontSize: "0.9rem",
        paddingY: 1,
        color: "#FFFFFF", // dark text for contrast
        "&.Mui-selected": {
          backgroundColor: "rgba(255, 255, 255, 0.32)",
          color: "#111827",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.4)",
          },
        },
        "&:hover": {
          backgroundColor: "rgba(255, 255, 255, 0.24)",
        },
      },
    },
  },
};

const textFieldSx = {
  flexGrow: 1,
  "& .MuiInputBase-root": {
    height: 40,
    color: textColor,
  },
  "& .MuiOutlinedInput-root": {
    bgcolor: glassFieldBg,
    borderRadius: "999px",
    "& fieldset": { borderColor: glassBorder },
    "&:hover fieldset": { borderColor: glassBorder },
    "&.Mui-focused fieldset": { borderColor: "#FFFFFF", borderWidth: 1.5 },
    "& input": {
      fontSize: "0.9rem",
      paddingTop: "8px",
      paddingBottom: "8px",
      "::placeholder": {
        color: placeholderColor,
        opacity: 1,
      },
    },
  },
  "& .MuiInputLabel-root": { color: labelColor, fontSize: "0.85rem" },
  "& .MuiInputLabel-root.Mui-focused": { color: labelColor },
};

/**
 * Props:
 * - diets: string[]
 * - initial: { diet?: string, search?: string }
 * - onApply({ diet, search })
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

  // Debounce filter changes
  useEffect(() => {
    const t = setTimeout(() => {
      onApply?.({ diet, search });
    }, 400);

    return () => clearTimeout(t);
  }, [diet, search, onApply]);

  return (
    <section className="w-full flex justify-center px-4 pt-4">
      {/* Glass container to match login/dashboard cards */}
      <div
        className="
          w-full max-w-7xl
          rounded-3xl border border-white/25 bg-white/10
          backdrop-blur-2xl
          shadow-xl shadow-slate-900/40
          px-4 py-4 sm:px-6 sm:py-5
        "
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems="stretch"
        >
          {/* Search field */}
          <TextField
            size="small"
            label="Search diet type..."
            placeholder="e.g., keto, vegan…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={textFieldSx}
            disabled={disabled}
          />

          {/* Diet type select */}
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

          {/* Reset button */}
          <Button
            variant="contained"
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
              height: 40,
              borderRadius: "999px",
              px: 3,
              minWidth: "120px",

              // Logout-style look: light pill, dark text, subtle border
              fontWeight: 500,
              color: "#111827",
              backgroundColor: "rgba(255, 255, 255, 0.96)",
              border: "1px solid rgba(255, 255, 255, 0.8)",
              boxShadow: "0 3px 8px rgba(15, 23, 42, 0.18)",

              "&:hover": {
                backgroundColor: "#ffffff",
                borderColor: "rgba(255, 255, 255, 1)",
                boxShadow: "0 4px 12px rgba(15, 23, 42, 0.22)",
              },
              "&.Mui-disabled": {
                backgroundColor: "rgba(255, 255, 255, 0.7)",
                color: "rgba(15, 23, 42, 0.4)",
                boxShadow: "none",
              },
            }}
          >
            Reset
          </Button>
        </Stack>
      </div>
    </section>
  );
}
