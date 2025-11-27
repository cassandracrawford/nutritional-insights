const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
if (!BASE_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not set");
}

function buildQuery(params = {}) {
  const qs = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") {
      qs.set(k, String(v));
    }
  });
  const s = qs.toString();
  return s ? `?${s}` : "";
}

// /api/diet-insights
export async function fetchDietInsights(filters = {}) {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("NEXT_PUBLIC_API_URL is not set");

  const url = new URL("/api/diet-insights", base);
  const params = new URLSearchParams();

  if (filters.search) params.set("search", filters.search);
  if (filters.diet) params.set("diet", filters.diet);
  if (filters.cuisine) params.set("cuisine", filters.cuisine);
  if (filters.macro) params.set("macro", filters.macro);

  url.search = params.toString();

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(
      `diet-insights failed: ${res.status} ${res.statusText} ${txt}`
    );
  }
  return res.json();
}

export function mapDietInsightsToCharts(json) {
  const averages = json?.charts?.averages || [];

  const diets = averages.map((r) => r.diet_type || "");
  const protein = averages.map((r) => Number(r.avg_protein ?? 0));
  const carbs = averages.map((r) => Number(r.avg_carbs ?? 0));
  const fat = averages.map((r) => Number(r.avg_fat ?? 0));

  const scatterTop5 = json?.charts?.scatterTop5 || [];

  const charts = {
    bar: {
      labels: diets,
      series: [
        { label: "Protein (g)", data: protein },
        { label: "Carbs (g)", data: carbs },
        { label: "Fat (g)", data: fat },
      ],
    },
    pieForDiet: (i = 0) =>
      i >= 0 && i < diets.length
        ? [
            { id: 0, value: protein[i], label: "Protein (g)" },
            { id: 1, value: carbs[i], label: "Carbs (g)" },
            { id: 2, value: fat[i], label: "Fat (g)" },
          ]
        : [],
    diets,
    scatterTop5,
  };

  const m = json?.meta || json?.metadata || {};
  const meta = {
    execution_time_ms: m.execution_time_ms ?? null,
    record_count:
      m.filtered_count ?? m.original_count ?? m.record_count ?? null,
    generated_at: m.generated_at ?? null,
    data_source: m.data_source ?? "All_Diets.csv",
  };

  const filters = json?.filters || {
    diets,
    cuisines: [],
    macroOptions: [],
  };

  return { charts, meta, filters };
}

// /api/recipes

export async function fetchRecipes(filters = {}, page = 1, pageSize = 10) {
  const query = buildQuery({
    search: filters.search,
    diet: filters.diet,
    cuisine: filters.cuisine,
    macro: filters.macro,
    page,
    pageSize,
  });

  const res = await fetch(`${BASE_URL}/api/recipes${query}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`recipes failed: ${res.status} ${res.statusText} ${txt}`);
  }

  const json = await res.json();
  return {
    recipes: json.recipes || [],
    page: json.page ?? page,
    pageSize: json.pageSize ?? pageSize,
    total: json.total ?? (json.recipes?.length || 0),
  };
}
