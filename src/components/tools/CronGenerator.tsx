import React, { useState, useEffect } from "react";
import cronstrue from "cronstrue/i18n";

export default function CronGenerator() {
  const [expression, setExpression] = useState("* * * * *");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  // State for visual builder
  const [minute, setMinute] = useState("*");
  const [hour, setHour] = useState("*");
  const [dom, setDom] = useState("*");
  const [month, setMonth] = useState("*");
  const [dow, setDow] = useState("*");

  const [mode, setMode] = useState<"builder" | "manual">("builder");

  const presets = [
    { name: "Every minute", value: "* * * * *" },
    { name: "Every hour", value: "0 * * * *" },
    { name: "Every day at midnight", value: "0 0 * * *" },
    { name: "Every Monday at 1 AM", value: "0 1 * * 1" },
    { name: "Every 1st of month", value: "0 0 1 * *" },
  ];

  // Update description when expression changes
  useEffect(() => {
    try {
      const desc = cronstrue.toString(expression, { locale: "zh_CN" });
      setDescription(desc);
      setError("");
    } catch (err) {
      setDescription("");
      setError("Invalid cron expression");
    }
  }, [expression]);

  // Update expression when builder fields change
  useEffect(() => {
    if (mode === "builder") {
      const newExpr = `${minute} ${hour} ${dom} ${month} ${dow}`;
      if (newExpr !== expression) {
        setExpression(newExpr);
      }
    }
  }, [minute, hour, dom, month, dow, mode]);

  // Handle manual input change
  const handleManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setExpression(e.target.value);
    // Try to parse back to builder fields if simple enough
    const parts = e.target.value.split(" ");
    if (parts.length === 5) {
      setMinute(parts[0]);
      setHour(parts[1]);
      setDom(parts[2]);
      setMonth(parts[3]);
      setDow(parts[4]);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(expression);
    // Could add a toast here
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Display Section */}
      <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-black/60 dark:text-white/60">Generated Expression</h2>
            <div className="flex gap-2">
               <button
                onClick={() => setMode("builder")}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${mode === 'builder' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}
              >
                Visual
              </button>
              <button
                onClick={() => setMode("manual")}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${mode === 'manual' ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'}`}
              >
                Manual
              </button>
            </div>
          </div>
          
          <div className="relative">
            <input
              type="text"
              value={expression}
              onChange={handleManualChange}
              readOnly={mode === "builder"}
              className="w-full rounded-lg border border-black/10 bg-neutral-50 px-4 py-4 text-2xl font-mono text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-neutral-800 dark:text-white dark:focus:border-white dark:focus:ring-white"
            />
            <button
              onClick={copyToClipboard}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-600"
            >
              Copy
            </button>
          </div>

          {description && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/20 dark:text-green-300">
              <span className="text-lg">💡</span>
              <span className="font-medium">{description}</span>
            </div>
          )}
          
          {error && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/20 dark:text-red-300">
              <span className="text-lg">⚠️</span>
              <span className="font-medium">{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Builder Section */}
      {mode === "builder" && (
        <div className="grid gap-6 md:grid-cols-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black dark:text-white">Minute</label>
            <input
              type="text"
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="rounded-lg border border-black/10 bg-white px-3 py-2 text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
              placeholder="*"
            />
            <span className="text-xs text-black/40 dark:text-white/40">0-59 allowed</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black dark:text-white">Hour</label>
            <input
              type="text"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="rounded-lg border border-black/10 bg-white px-3 py-2 text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
              placeholder="*"
            />
            <span className="text-xs text-black/40 dark:text-white/40">0-23 allowed</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black dark:text-white">Day (Month)</label>
            <input
              type="text"
              value={dom}
              onChange={(e) => setDom(e.target.value)}
              className="rounded-lg border border-black/10 bg-white px-3 py-2 text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
              placeholder="*"
            />
            <span className="text-xs text-black/40 dark:text-white/40">1-31 allowed</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black dark:text-white">Month</label>
            <input
              type="text"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="rounded-lg border border-black/10 bg-white px-3 py-2 text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
              placeholder="*"
            />
            <span className="text-xs text-black/40 dark:text-white/40">1-12 allowed</span>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-black dark:text-white">Day (Week)</label>
            <input
              type="text"
              value={dow}
              onChange={(e) => setDow(e.target.value)}
              className="rounded-lg border border-black/10 bg-white px-3 py-2 text-black focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:focus:border-white dark:focus:ring-white"
              placeholder="*"
            />
            <span className="text-xs text-black/40 dark:text-white/40">0-6 (Sun-Sat)</span>
          </div>
        </div>
      )}

      {/* Presets */}
      <div className="rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900">
        <h3 className="mb-4 text-sm font-medium text-black/60 dark:text-white/60">Common Presets</h3>
        <div className="flex flex-wrap gap-3">
          {presets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => {
                setExpression(preset.value);
                const parts = preset.value.split(" ");
                setMinute(parts[0]);
                setHour(parts[1]);
                setDom(parts[2]);
                setMonth(parts[3]);
                setDow(parts[4]);
              }}
              className="rounded-lg bg-neutral-100 px-3 py-2 text-sm text-black hover:bg-neutral-200 dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-700"
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
