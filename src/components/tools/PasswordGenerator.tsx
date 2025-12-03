import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export default function PasswordGenerator() {
  // Password Generator State
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied">("idle");

  // UUID Generator State
  const [uuid, setUuid] = useState("");
  const [uuidCopyStatus, setUuidCopyStatus] = useState<"idle" | "copied">("idle");

  const generatePassword = () => {
    const charset = {
      uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lowercase: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
    };

    let chars = "";
    if (options.uppercase) chars += charset.uppercase;
    if (options.lowercase) chars += charset.lowercase;
    if (options.numbers) chars += charset.numbers;
    if (options.symbols) chars += charset.symbols;

    if (chars === "") {
      setPassword("");
      return;
    }

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      generatedPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(generatedPassword);
    setCopyStatus("idle");
  };

  const generateUuid = () => {
    setUuid(uuidv4());
    setUuidCopyStatus("idle");
  };

  const handleCopy = async (text: string, setStatus: React.Dispatch<React.SetStateAction<"idle" | "copied">>) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setStatus("copied");
      setTimeout(() => setStatus("idle"), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  // Initial generation
  useEffect(() => {
    generatePassword();
    generateUuid();
  }, []);

  // Regenerate password when options change
  useEffect(() => {
    generatePassword();
  }, [length, options]);

  return (
    <div className="flex flex-col gap-8">
      {/* Password Generator Section */}
      <div className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            Password Generator 🔐
          </h2>
        </div>

        <div className="relative">
          <div className="flex h-14 w-full items-center rounded-lg border border-black/10 bg-neutral-50 px-4 text-lg font-mono text-black dark:border-white/10 dark:bg-neutral-800 dark:text-white">
            {password}
          </div>
          <button
            onClick={() => handleCopy(password, setCopyStatus)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-600"
          >
            {copyStatus === "copied" ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:gap-8">
          <div className="flex-1 space-y-4">
            <div>
              <div className="mb-2 flex justify-between text-sm font-medium text-black/60 dark:text-white/60">
                <label htmlFor="length-slider">Length</label>
                <span>{length}</span>
              </div>
              <input
                id="length-slider"
                type="range"
                min="8"
                max="32"
                value={length}
                onChange={(e) => setLength(parseInt(e.target.value))}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-neutral-200 dark:bg-neutral-700"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-black dark:text-white">
                <input
                  type="checkbox"
                  checked={options.uppercase}
                  onChange={(e) => setOptions({ ...options, uppercase: e.target.checked })}
                  className="rounded border-black/20 dark:border-white/20"
                />
                Uppercase (A-Z)
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-black dark:text-white">
                <input
                  type="checkbox"
                  checked={options.lowercase}
                  onChange={(e) => setOptions({ ...options, lowercase: e.target.checked })}
                  className="rounded border-black/20 dark:border-white/20"
                />
                Lowercase (a-z)
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-black dark:text-white">
                <input
                  type="checkbox"
                  checked={options.numbers}
                  onChange={(e) => setOptions({ ...options, numbers: e.target.checked })}
                  className="rounded border-black/20 dark:border-white/20"
                />
                Numbers (0-9)
              </label>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-black dark:text-white">
                <input
                  type="checkbox"
                  checked={options.symbols}
                  onChange={(e) => setOptions({ ...options, symbols: e.target.checked })}
                  className="rounded border-black/20 dark:border-white/20"
                />
                Symbols (!@#)
              </label>
            </div>
          </div>

          <div className="flex items-end justify-end">
            <button
              onClick={generatePassword}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
            >
              Regenerate
            </button>
          </div>
        </div>
      </div>

      {/* UUID Generator Section */}
      <div className="flex flex-col gap-4 rounded-xl border border-black/10 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-neutral-900">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-black dark:text-white">
            UUID Generator 🆔
          </h2>
        </div>

        <div className="relative">
          <div className="flex h-14 w-full items-center rounded-lg border border-black/10 bg-neutral-50 px-4 text-lg font-mono text-black dark:border-white/10 dark:bg-neutral-800 dark:text-white">
            {uuid}
          </div>
          <button
            onClick={() => handleCopy(uuid, setUuidCopyStatus)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-white px-3 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-neutral-100 dark:bg-neutral-700 dark:hover:bg-neutral-600"
          >
            {uuidCopyStatus === "copied" ? "Copied!" : "Copy"}
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={generateUuid}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-black/80 dark:bg-white dark:text-black dark:hover:bg-white/80"
          >
            Generate New UUID
          </button>
        </div>
      </div>
    </div>
  );
}
