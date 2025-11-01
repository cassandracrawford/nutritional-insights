"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Dashboard from "@/components/Dashboard";
import { fetchDietData, buildCharts } from "@/src/api";

export default function Home() {
  const [raw, setRaw] = useState(null);              // raw API payload
  const [filters, setFilters] = useState({ diet: "", search: "" });
  const [selectedDiet, setSelectedDiet] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch once (and on Refresh)
  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const payload = await fetchDietData();
      setRaw(payload);
    } catch (e) {
      setError(String(e));
      setRaw(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);  // initial fetch

  // Derive charts + meta from raw + filters (no extra state, no double compute)
  const { charts, meta } = useMemo(
    () => (raw ? buildCharts(raw, filters) : { charts: null, meta: null }),
    [raw, filters]
  );

  // If no selection yet, choose the first available diet
  useEffect(() => {
    if (!selectedDiet && charts?.diets?.length) {
      setSelectedDiet(charts.diets[0]);
    }
  }, [charts?.diets, selectedDiet]);

  const handleApply = (next) => setFilters(next);

  return (
    <main className="min-h-screen grid grid-rows-[auto,1fr,auto]">
      <Header />
      <section className="overflow-y-auto">
        <Dashboard
          charts={charts}
          meta={meta}
          loading={loading}
          error={error}
          selectedDiet={selectedDiet}
          onDietChange={setSelectedDiet}
          onApply={handleApply}
          filters={filters}
        />
      </section>
      <Footer />
    </main>
  );
}
