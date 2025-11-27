// components/Filter.jsx
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
    fontSize: "0.9rem",
  },
  "& .MuiInputLabel-root.Mui-focused": { color: labelColor },
  "& .MuiSelect-icon": { color: labelColor },

  // Disabled styling
  "& .Mui-disabled": {
    color: "rgba(255,255,255,0.45) !important",
    WebkitTextFillColor: "rgba(255,255,255,0.45) !important",
  },
  "& .MuiInputLabel-root.Mui-disabled": {
    color: "rgba(255,255,255,0.45) !important",
  },
  "& .MuiOutlinedInput-root.Mui-disabled fieldset": {
    borderColor: "rgba(255,255,255,0.35) !important",
  },
  "& .MuiSelect-icon": {
    color: "rgba(255,255,255,0.45) !important",
  },
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
        color: "#FFFFFF",
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
  "& .MuiInputLabel-root": { color: labelColor, fontSize: "0.9rem" },
  "& .MuiInputLabel-root.Mui-focused": { color: labelColor },
  "& .Mui-disabled": {
    color: "rgba(255,255,255,0.45) !important",
    WebkitTextFillColor: "rgba(255,255,255,0.45) !important",
  },
  "& .MuiInputLabel-root.Mui-disabled": {
    color: "rgba(255,255,255,0.45) !important",
  },
  "& .MuiOutlinedInput-root.Mui-disabled fieldset": {
    borderColor: "rgba(255,255,255,0.35) !important",
  },
};

export default function Filter({
  diets = [],
  cuisines = [],
  macroOptions = [],
  initial = {},
  onApply,
  disabled = false,
}) {
  const [search, setSearch] = useState(initial.search || "");
  const [diet, setDiet] = useState(initial.diet || "");
  const [cuisine, setCuisine] = useState(initial.cuisine || "");
  const [macro, setMacro] = useState(initial.macro || "");
  const [pageSize, setPageSize] = useState(initial.pageSize || 10);

  useEffect(() => {
    setSearch(initial.search || "");
    setDiet(initial.diet || "");
    setCuisine(initial.cuisine || "");
    setMacro(initial.macro || "");
    setPageSize(initial.pageSize || 10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Small helper to send the full current filter set
  const apply = (overrides = {}) => {
    const payload = {
      search,
      diet,
      cuisine,
      macro,
      pageSize,
      ...overrides,
    };
    onApply?.(payload);
  };

  const handleReset = () => {
    setSearch("");
    setDiet("");
    setCuisine("");
    setMacro("");
    setPageSize(10);

    apply({
      search: "",
      diet: "",
      cuisine: "",
      macro: "",
      pageSize: 10,
    });
  };

  return (
    <section className="w-full flex justify-center px-4 pt-4">
      <div
        className="
          w-full max-w-7xl
          rounded-3xl border border-white/25 bg-white/10
          backdrop-blur-3xl
          shadow-xl shadow-slate-900/40
          px-4 py-4 sm:px-6 sm:py-5
        "
      >
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems="stretch"
        >
          {/* Search field */}
          <TextField
            size="small"
            label="Keyword Search"
            placeholder="Search recipes, ingredients, keywords…"
            value={search}
            onChange={(e) => {
              const v = e.target.value;
              setSearch(v);
              apply({ search: v });
            }}
            sx={textFieldSx}
          />

          {/* Diet type select */}
          <FormControl size="small" sx={selectSx} disabled={!diets.length}>
            <InputLabel id="diet-type-label">Diet Type</InputLabel>
            <Select
              labelId="diet-type-label"
              id="diet-type-select"
              value={diet}
              label="Diet Type"
              onChange={(e) => {
                const v = e.target.value;
                setDiet(v);
                apply({ diet: v });
              }}
              MenuProps={menuProps}
            >
              <MenuItem value="">
                <em>All diets</em>
              </MenuItem>
              {diets.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Cuisine select */}
          <FormControl size="small" sx={selectSx} disabled={!cuisines.length}>
            <InputLabel id="cuisine-label">Cuisine</InputLabel>
            <Select
              labelId="cuisine-label"
              id="cuisine-select"
              value={cuisine}
              label="Cuisine"
              onChange={(e) => {
                const v = e.target.value;
                setCuisine(v);
                apply({ cuisine: v });
              }}
              MenuProps={menuProps}
            >
              <MenuItem value="">
                <em>All cuisines</em>
              </MenuItem>
              {cuisines.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Macro focus select */}
          <FormControl
            size="small"
            sx={selectSx}
            disabled={!macroOptions.length}
          >
            <InputLabel id="macro-label">Macronutrient</InputLabel>
            <Select
              labelId="macro-label"
              id="macro-select"
              value={macro}
              label="Macronutrient"
              onChange={(e) => {
                const v = e.target.value;
                setMacro(v);
                apply({ macro: v });
              }}
              MenuProps={menuProps}
            >
              <MenuItem value="">
                <em>Any macro</em>
              </MenuItem>
              {macroOptions.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Per-page selector */}
          <FormControl
            size="small"
            sx={{ ...selectSx, minWidth: 110 }}
            disabled={disabled}
          >
            <InputLabel id="per-page-label">Per page</InputLabel>
            <Select
              labelId="per-page-label"
              id="per-page-select"
              value={pageSize}
              label="Per page"
              onChange={(e) => {
                const n = Number(e.target.value);
                setPageSize(n);
                apply({ pageSize: n });
              }}
              MenuProps={menuProps}
            >
              {[5, 10, 20, 50].map((n) => (
                <MenuItem key={n} value={n}>
                  {n}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Reset button */}
          <Button
            variant="contained"
            size="small"
            startIcon={<RefreshIcon />}
            onClick={handleReset}
            disabled={disabled}
            sx={{
              textTransform: "none",
              height: 40,
              borderRadius: "999px",
              px: 3,
              minWidth: "120px",
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
