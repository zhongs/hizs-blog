import React, { useState, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";

export default function JsonEditor() {
  const editorRef = useRef<any>(null);
  const [status, setStatus] = useState<"IDLE" | "ERROR" | "SUCCESS">("IDLE");
  const [message, setMessage] = useState("");

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Add command for formatting (Ctrl/Cmd + S or Alt+Shift+F is default, but we can add custom too)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      handleFormat();
    });
  };

  const handleFormat = () => {
    if (!editorRef.current) return;
    const value = editorRef.current.getValue();
    try {
      const parsed = JSON.parse(value);
      const formatted = JSON.stringify(parsed, null, 2);
      editorRef.current.setValue(formatted);
      setStatus("SUCCESS");
      setMessage("JSON formatted successfully ✨");
    } catch (error: any) {
      setStatus("ERROR");
      setMessage(`Invalid JSON: ${error.message}`);
    }
  };

  const handleMinify = () => {
    if (!editorRef.current) return;
    const value = editorRef.current.getValue();
    try {
      const parsed = JSON.parse(value);
      const minified = JSON.stringify(parsed);
      editorRef.current.setValue(minified);
      setStatus("SUCCESS");
      setMessage("JSON minified successfully 📦");
    } catch (error: any) {
      setStatus("ERROR");
      setMessage(`Invalid JSON: ${error.message}`);
    }
  };

  const handleCopy = async () => {
    if (!editorRef.current) return;
    const value = editorRef.current.getValue();
    try {
      await navigator.clipboard.writeText(value);
      const originalStatus = status;
      const originalMessage = message;
      setStatus("SUCCESS");
      setMessage("Copied to clipboard! 📋");
      setTimeout(() => {
        setStatus(originalStatus);
        setMessage(originalMessage);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleClear = () => {
    if (editorRef.current) {
      editorRef.current.setValue("");
      setStatus("IDLE");
      setMessage("");
    }
  };

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-200px)] min-h-[500px]">
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-black/10 bg-white p-3 dark:border-white/10 dark:bg-neutral-900">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="flex h-3 w-3 rounded-full bg-red-500"></span>
            <span className="flex h-3 w-3 rounded-full bg-yellow-500"></span>
            <span className="flex h-3 w-3 rounded-full bg-green-500"></span>
          </div>
          <span className="ml-2 text-sm font-medium text-black/60 dark:text-white/60">
            JSON Editor
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleFormat}
            className="rounded px-3 py-1.5 text-xs font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Format
          </button>
          <button
            onClick={handleMinify}
            className="rounded px-3 py-1.5 text-xs font-medium bg-neutral-200 text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            Minify
          </button>
          <button
            onClick={handleCopy}
            className="rounded px-3 py-1.5 text-xs font-medium bg-neutral-200 text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          >
            Copy
          </button>
          <button
            onClick={handleClear}
            className="rounded px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden rounded-lg border border-black/10 shadow-sm dark:border-white/10">
        <Editor
          height="100%"
          defaultLanguage="json"
          defaultValue="{}"
          theme="vs-dark" // We can toggle this based on system preference if needed, but vs-dark looks cool
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            wordWrap: "on",
            formatOnPaste: true,
            automaticLayout: true,
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      <div
        className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
          status === "ERROR"
            ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            : status === "SUCCESS"
            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            : "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
        }`}
      >
        {status === "ERROR" ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8 5a1 1 0 01-1-1v-1a1 1 0 112 0v1a1 1 0 01-1 1zm1-4a1 1 0 10-2 0V6a1 1 0 102 0v5z" clipRule="evenodd" />
          </svg>
        ) : status === "SUCCESS" ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        )}
        {message || "Ready to format JSON"}
      </div>
    </div>
  );
}
