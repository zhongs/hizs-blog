import React, { useState, useEffect } from "react";

const TextSpacer = () => {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [options, setOptions] = useState({
    autoSpace: true,
    clearEmptyLines: false,
    fullToHalf: false,
  });
  const [copied, setCopied] = useState(false);

  const fullToHalf = (str: string) => {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      const code = str.charCodeAt(i);
      if (code >= 65281 && code <= 65374) {
        result += String.fromCharCode(code - 65248);
      } else if (code === 12288) {
        result += String.fromCharCode(32);
      } else {
        result += str.charAt(i);
      }
    }
    return result;
  };

  const autoSpacing = (text: string) => {
    // CJK followed by English/Number/Symbol
    let result = text.replace(
      /([\u4e00-\u9fa5\u3040-\u30ff])([a-zA-Z0-9`~!@#$%^&*()_+\-={}|[\]\\:";'<>?,./])/g,
      "$1 $2"
    );
    // English/Number/Symbol followed by CJK
    result = result.replace(
      /([a-zA-Z0-9`~!@#$%^&*()_+\-={}|[\]\\:";'<>?,./])([\u4e00-\u9fa5\u3040-\u30ff])/g,
      "$1 $2"
    );
    return result;
  };

  const processText = (text: string, currentOptions = options) => {
    let result = text;

    if (currentOptions.fullToHalf) {
      result = fullToHalf(result);
    }

    if (currentOptions.autoSpace) {
      result = autoSpacing(result);
    }

    if (currentOptions.clearEmptyLines) {
      result = result
        .split("\n")
        .filter((line) => line.trim() !== "")
        .join("\n");
    }

    setOutput(result);
  };

  useEffect(() => {
    processText(input);
  }, [input, options]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 rounded-xl border border-black/15 bg-white p-4 dark:border-white/20 dark:bg-neutral-900">
        <label className="flex cursor-pointer items-center gap-2 text-sm text-black dark:text-white">
          <input
            type="checkbox"
            checked={options.autoSpace}
            onChange={(e) =>
              setOptions({ ...options, autoSpace: e.target.checked })
            }
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black dark:border-neutral-700 dark:bg-neutral-800 dark:focus:ring-white"
          />
          Auto Space (中英文自动空格)
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-black dark:text-white">
          <input
            type="checkbox"
            checked={options.clearEmptyLines}
            onChange={(e) =>
              setOptions({ ...options, clearEmptyLines: e.target.checked })
            }
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black dark:border-neutral-700 dark:bg-neutral-800 dark:focus:ring-white"
          />
          Clear Empty Lines (清除空行)
        </label>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-black dark:text-white">
          <input
            type="checkbox"
            checked={options.fullToHalf}
            onChange={(e) =>
              setOptions({ ...options, fullToHalf: e.target.checked })
            }
            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black dark:border-neutral-700 dark:bg-neutral-800 dark:focus:ring-white"
          />
          Full to Half Width (全角转半角)
        </label>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-black/60 dark:text-white/60">
              Input Text
            </label>
            <button
              onClick={() => setInput("")}
              className="text-xs text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white"
            >
              Clear
            </button>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Paste your text here... (e.g., 你好Hello世界World)"
            className="h-[300px] w-full resize-none rounded-xl border border-black/15 bg-white p-4 font-mono text-sm outline-none focus:border-black dark:border-white/20 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
          />
        </div>

        {/* Output */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-black/60 dark:text-white/60">
              Output Text
            </label>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 text-xs font-medium text-black dark:text-white"
            >
              {copied ? (
                <>
                  <span className="text-green-500">✓ Copied</span>
                </>
              ) : (
                <>
                  <span>Copy Result</span>
                </>
              )}
            </button>
          </div>
          <textarea
            readOnly
            value={output}
            placeholder="Processed text will appear here..."
            className="h-[300px] w-full resize-none rounded-xl border border-black/15 bg-white p-4 font-mono text-sm outline-none focus:border-black dark:border-white/20 dark:bg-neutral-900 dark:text-white dark:focus:border-white"
          />
        </div>
      </div>
    </div>
  );
};

export default TextSpacer;
