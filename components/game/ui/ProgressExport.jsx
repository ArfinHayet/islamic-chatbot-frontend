"use client";

import React, { useState } from "react";
import { useGame } from "@/context/GameContext";
import { useLocale } from "@/context/LocaleContext";

export function ProgressExport() {
  const { exportProgress, importProgress } = useGame();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("export"); // 'export' | 'import'
  const [code, setCode] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  const handleOpenExport = () => {
    setMode("export");
    setCode(exportProgress());
    setStatusMsg("");
    setOpen(true);
  };

  const handleOpenImport = () => {
    setMode("import");
    setCode("");
    setStatusMsg("");
    setOpen(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setStatusMsg("Copied to clipboard!");
  };

  const handleDoImport = () => {
    if (!code.trim()) return;
    const ok = importProgress(code.trim());
    if (ok) {
      setStatusMsg("Progress imported successfully!");
      setTimeout(() => setOpen(false), 1000);
    } else {
      setStatusMsg("Invalid progress code.");
    }
  };

  return (
    <>
      <button className="game-control-btn" onClick={handleOpenExport} title={t("gameExport")}>
        💾
      </button>

      {open && (
        <div className="game-modal-backdrop" onClick={() => setOpen(false)}>
          <div className="game-modal" onClick={(e) => e.stopPropagation()}>
            <div className="game-modal-title">
              {mode === "export" ? t("gameExport") : t("gameImport")}
            </div>

            {mode === "export" ? (
              <>
                <textarea className="game-modal-textarea" readOnly value={code} />
                {statusMsg && <div style={{ fontSize: 12, color: "#5fd4a9", marginBottom: 10 }}>{statusMsg}</div>}
                <div className="game-modal-actions">
                  <button className="game-modal-btn game-modal-btn-secondary" onClick={() => setOpen(false)}>
                    Close
                  </button>
                  <button className="game-modal-btn game-modal-btn-primary" onClick={handleCopy}>
                    Copy Code
                  </button>
                  <button className="game-modal-btn game-modal-btn-secondary" onClick={handleOpenImport}>
                    Switch to Import
                  </button>
                </div>
              </>
            ) : (
              <>
                <textarea
                  className="game-modal-textarea"
                  placeholder="Paste your progress code here..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                {statusMsg && (
                  <div style={{ fontSize: 12, color: statusMsg.includes("success") ? "#5fd4a9" : "#ff6b6b", marginBottom: 10 }}>
                    {statusMsg}
                  </div>
                )}
                <div className="game-modal-actions">
                  <button className="game-modal-btn game-modal-btn-secondary" onClick={() => setOpen(false)}>
                    Cancel
                  </button>
                  <button className="game-modal-btn game-modal-btn-primary" onClick={handleDoImport}>
                    Import
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
