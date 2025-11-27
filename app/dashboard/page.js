"use client";

import { useState, useEffect, useCallback } from "react";
import Dashboard from "@/components/Dashboard";
import {
  fetchDietInsights,
  mapDietInsightsToCharts,
  fetchRecipes,
} from "@/src/api";

const DEFAULT_FILTERS = {
  search: "",
  diet: "",
  cuisine: "",
  macro: "",
  pageSize: 10,
};

export default function Home() {
  // current selected filters
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // charts + metadata
  const [charts, setCharts] = useState(null);
  const [meta, setMeta] = useState(null);
  const [selectedDiet, setSelectedDiet] = useState("");

  // recipe list + pagination
  const [recipes, setRecipes] = useState([]);
  const [page, setPage] = useState(1);
  const [totalRecipes, setTotalRecipes] = useState(0);

  // loading / error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // dropdown options coming from /api/diet-insights
  const [filterOptions, setFilterOptions] = useState({
    diets: [],
    cuisines: [],
    macroOptions: [],
  });

  const load = useCallback(
    async (nextFilters = filters, nextPage = page) => {
      setLoading(true);
      setError("");

      try {
        const pageSize = nextFilters.pageSize || 10;

        const [dietJson, recipesRes] = await Promise.all([
          fetchDietInsights(nextFilters),
          fetchRecipes(nextFilters, nextPage, pageSize),
        ]);

        // map diet-insights response
        const { charts, meta, filters: options } =
          mapDietInsightsToCharts(dietJson);

        setCharts(charts);
        setMeta(meta);
        setFilterOptions(options); // diets/cuisines/macroOptions

        // set default selected diet if none yet
        if (!selectedDiet && charts.diets?.length) {
          setSelectedDiet(charts.diets[0]);
        }

        // recipes + pagination
        setRecipes(recipesRes.recipes || []);
        setPage(recipesRes.page ?? nextPage);
        setTotalRecipes(
          recipesRes.total ?? (recipesRes.recipes?.length || 0)
        );
      } catch (e) {
        console.error(e);
        setError(String(e));
        setCharts(null);
        setRecipes([]);
        setTotalRecipes(0);
      } finally {
        setLoading(false);
      }
    },
    [filters, page, selectedDiet]
  );

  // Initial load
  useEffect(() => {
    load(DEFAULT_FILTERS, 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** When user changes filters from <Filter /> */
  const handleApply = (next) => {
    const merged = { ...filters, ...next };
    setFilters(merged);
    setPage(1); // reset pagination
    load(merged, 1);
  };

  // For pagination changes
  const handlePageChange = (newPage) => {
    setPage(newPage);
    load(filters, newPage);
  };

  return (
    <main className="min-h-screen flex flex-col">
      {/* <Header /> */}
      <section className="flex-1 overflow-y-auto">
        <Dashboard
          charts={charts}
          meta={meta}
          loading={loading}
          error={error}
          selectedDiet={selectedDiet}
          onApply={handleApply}
          filters={filterOptions}           
          recipes={recipes}
          page={page}
          pageSize={filters.pageSize}
          totalRecipes={totalRecipes}        
          onPageChange={handlePageChange}
          activeFilters={filters}
        />
      </section>
      {/* <Footer /> */}
    </main>
  );
}
