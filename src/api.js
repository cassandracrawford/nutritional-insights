// src/api/index.js
export async function fetchDietData() {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) throw new Error("NEXT_PUBLIC_API_URL is not set");
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} ${txt}`);
  }
  return res.json(); // { metadata, data }
}

// Keep your existing mapping logic but make it reusable client-side:
export function buildCharts(raw, { diet = "", search = "" } = {}) {
  const rows = Array.isArray(raw?.data) ? raw.data : [];

  const norm = (x) => String(x || "").toLowerCase().trim();
  const dietFilter = norm(diet);
  const searchFilter = norm(search);

  const filtered = rows.filter(r => {
    const dn = norm(r.Diet_type);
    const passDiet = !dietFilter || dn === dietFilter;
    const passSearch = !searchFilter || dn.includes(searchFilter);
    return passDiet && passSearch;
  });

  const cap = (s) => (s ? s[0].toUpperCase() + s.slice(1) : s);
  const diets = filtered.map(r => cap(String(r.Diet_type || "")));
  const protein = filtered.map(r => Number(r["Protein(g)"] ?? 0));
  const carbs   = filtered.map(r => Number(r["Carbs(g)"]   ?? 0));
  const fat     = filtered.map(r => Number(r["Fat(g)"]     ?? 0));

  return {
    charts: {
      bar: {
        labels: diets,
        series: [
          { label: "Protein (g)", data: protein },
          { label: "Carbs (g)",   data: carbs   },
          { label: "Fat (g)",     data: fat     },
        ],
      },
      heatmap: {
        xCats: ["Protein (g)", "Carbs (g)", "Fat (g)"],
        yCats: diets,
        matrix: diets.map((_, i) => [protein[i], carbs[i], fat[i]]),
      },
      pieForDiet: (i = 0) => (i >= 0 && i < diets.length)
        ? [
            { id: 0, value: protein[i], label: "Protein (g)" },
            { id: 1, value: carbs[i],   label: "Carbs (g)"   },
            { id: 2, value: fat[i],     label: "Fat (g)"     },
          ]
        : [],
      diets,
    },
    meta: {
      execution_time_ms: raw?.metadata?.execution_time_ms ?? null,
      record_count: raw?.metadata?.record_count ?? null,
      generated_at: raw?.metadata?.generated_at ?? null,
    },
  };
}
