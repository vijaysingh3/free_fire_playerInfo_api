"use client";

import { useEffect } from "react";

export default function SiteSecurity() {
  useEffect(() => {
    // Disable right-click
    const blockContextMenu = (e: MouseEvent) => e.preventDefault();

    // Block DevTools keyboard shortcuts
    const blockKeyboard = (e: KeyboardEvent) => {
      if (e.key === "F12") { e.preventDefault(); return false; }
      if (e.ctrlKey && e.shiftKey && ["I", "i", "J", "j", "C", "c"].includes(e.key)) { e.preventDefault(); return false; }
      if (e.ctrlKey && (e.key === "u" || e.key === "U")) { e.preventDefault(); return false; }
      if (e.ctrlKey && (e.key === "s" || e.key === "S")) { e.preventDefault(); return false; }
      return true;
    };

    // Anti-debugger trap (detects DevTools opening)
    const antiDebug = () => {
      const threshold = 160;
      const start = performance.now();
      // This creates a breakpoint-like delay if DevTools is open
      (() => { debugger; })();
      const elapsed = performance.now() - start;
      if (elapsed > threshold) {
        // DevTools detected — clear the page
        document.body.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0a0a0a;color:#ef4444;font-family:monospace;text-align:center;padding:2rem;">
            <div>
              <h1 style="font-size:2rem;margin-bottom:1rem;">🚫 Access Denied</h1>
              <p style="color:#a1a1aa;">This site is protected. Unauthorized inspection is not allowed.</p>
            </div>
          </div>`;
      }
    };

    // Detect DevTools via window size difference
    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        // DevTools is likely open via docked mode
        document.body.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0a0a0a;color:#ef4444;font-family:monospace;text-align:center;padding:2rem;">
            <div>
              <h1 style="font-size:2rem;margin-bottom:1rem;">🚫 Access Denied</h1>
              <p style="color:#a1a1aa;">This site is protected. Unauthorized inspection is not allowed.</p>
            </div>
          </div>`;
      }
    };

    // Disable text selection on the entire page
    document.body.style.userSelect = "none";
    document.body.style.webkitUserSelect = "none";

    // Disable drag
    const blockDrag = (e: DragEvent) => e.preventDefault();

    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("keydown", blockKeyboard);
    document.addEventListener("dragstart", blockDrag as EventListener);

    // Periodic DevTools detection
    const devToolsInterval = setInterval(detectDevTools, 1000);

    // Anti-debugger (runs periodically but only traps if DevTools is open)
    const debugInterval = setInterval(antiDebug, 4000);

    return () => {
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("keydown", blockKeyboard);
      document.removeEventListener("dragstart", blockDrag as EventListener);
      clearInterval(devToolsInterval);
      clearInterval(debugInterval);
      document.body.style.userSelect = "";
      document.body.style.webkitUserSelect = "";
    };
  }, []);

  return null;
}
