// components/Metadata.jsx
export default function Metadata({ metadata }) {
  if (!metadata) return null;

  const {
    execution_time_ms,
    record_count,
    generated_at,
    data_source,
  } = metadata;

  const formattedTime =
    execution_time_ms != null
      ? `${Number(execution_time_ms).toFixed(2)} ms`
      : "—";

  const formattedDate = generated_at
    ? new Date(generated_at).toLocaleString()
    : "—";

  const stats = [
    {
      label: "Records processed",
      value: record_count ?? "—",
      helper: "Rows included in this result",
    },
    {
      label: "Execution time",
      value: formattedTime,
      helper: "End-to-end backend processing",
    },
    {
      label: "Generated at",
      value: formattedDate,
      helper: "Timestamp of the latest run",
    },
  ];

  return (
    <section className="w-full flex justify-center px-4 pt-6">
      <div
        className="
          w-full max-w-7xl
          rounded-3xl border border-white/25 bg-white/10
          backdrop-blur-2xl
          shadow-xl shadow-slate-900/40
          px-5 py-4 sm:px-8 sm:py-6
        "
      >
        {/* Small header row */}
        <div className="flex items-center justify-between mb-4 gap-4">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.18em] text-slate-100/80 font-light">
            Summary
          </p>

          {data_source && (
            <p className="text-[10px] sm:text-xs text-slate-100/80">
              Source:{" "}
              <span className="font-medium text-white/95">
                {data_source}
              </span>
            </p>
          )}
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {stats.map((item) => (
            <div
              key={item.label}
              className="
                rounded-2xl border border-white/25 bg-white/10
                backdrop-blur-xl
                shadow-md shadow-slate-900/30
                px-4 py-3 flex flex-col gap-1
              "
            >
              <span className="text-[10px] sm:text-xs uppercase tracking-[0.16em] text-slate-100/80">
                {item.label}
              </span>
              <span className="text-lg sm:text-xl font-semibold text-white">
                {item.value}
              </span>
              {item.helper && (
                <span className="text-[11px] sm:text-xs text-slate-100/70">
                  {item.helper}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
