"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import type { Deal } from "@/lib/types";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";

export default function UploadPage() {
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [rowCount, setRowCount] = useState(0);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function parseFile(file: File) {
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a .csv file.");
      return;
    }
    setError("");
    Papa.parse<Deal>(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete(results) {
        const deals = results.data as Deal[];
        sessionStorage.setItem("deals", JSON.stringify(deals));
        setFileName(file.name);
        setRowCount(deals.length);
      },
      error() {
        setError("Failed to parse CSV. Please check the file format.");
      },
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) parseFile(file);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-black flex flex-col">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-full max-w-xl">
            <h1 className="text-2xl font-bold text-white mb-2">Upload Sales Data</h1>
            <p className="text-white/40 text-sm mb-8">
              Upload a CSV file matching the Meridian Health sales format.
            </p>

            <div
              className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-colors ${
                dragging
                  ? "border-[#00e5cc] bg-[#00e5cc]/5"
                  : "border-white/20 hover:border-[#00e5cc]/60"
              }`}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => inputRef.current?.click()}
            >
              <input
                ref={inputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
              <svg className="w-12 h-12 text-[#00e5cc] mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-white font-medium text-sm">
                {dragging ? "Drop to upload" : "Drag & drop your CSV here"}
              </p>
              <p className="text-white/40 text-xs mt-1">or click to browse</p>
            </div>

            {error && (
              <p className="mt-4 text-red-400 text-sm">{error}</p>
            )}

            {fileName && (
              <div className="mt-6 bg-[#0d0d0d] border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-white text-sm font-medium">{fileName}</p>
                  <p className="text-white/40 text-xs mt-0.5">{rowCount} deals loaded</p>
                </div>
                <button
                  onClick={() => router.push("/insights")}
                  className="bg-[#00e5cc] text-black text-sm font-semibold px-5 py-2 rounded-lg hover:bg-[#00c9b3] transition-colors cursor-pointer"
                >
                  View Insights →
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}
