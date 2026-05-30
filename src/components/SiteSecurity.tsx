"use client";

import { useEffect } from "react";

export default function SiteSecurity() {
  useEffect(() => {
    // Disable right-click
    const disableContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    // Disable DevTools keyboard shortcuts
    const disableKeyboard = (e: KeyboardEvent) => {
      // F12
      if (e.key === "F12") { e.preventDefault(); return false; }
      // Ctrl+Shift+I (Inspector)
      if (e.ctrlKey && e.shiftKey && (e.key === "I" || e.key === "i")) { e.preventDefault(); return false; }
      // Ctrl+Shift+J (Console)
      if (e.ctrlKey && e.shiftKey && (e.key === "J" || e.key === "j")) { e.preventDefault(); return false; }
      // Ctrl+Shift+C (Element picker)
      if (e.ctrlKey && e.shiftKey && (e.key === "C" || e.key === "c")) { e.preventDefault(); return false; }
      // Ctrl+U (View source)
      if (e.ctrlKey && (e.key === "u" || e.key === "U")) { e.preventDefault(); return false; }
      // Ctrl+S (Save)
      if (e.ctrlKey && (e.key === "s" || e.key === "S")) { e.preventDefault(); return false; }
    };

    // Override console methods to prevent leaking data
    const noop = () => {};
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const originalInfo = console.info;
    const originalDebug = console.debug;
    const originalTable = console.table;

    console.log = noop;
    console.warn = noop;
    console.error = noop;
    console.info = noop;
    console.debug = noop;
    console.table = noop;

    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("keydown", disableKeyboard);

    // Anti-debug: detect DevTools open via window size difference
    const checkDevTools = setInterval(() => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        // DevTools likely open - clear page
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;background:#0a0a0a;color:#ef4444;font-family:monospace;font-size:1.5rem;">Access Denied</div>';
        clearInterval(checkDevTools);
      }
    }, 1000);

    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("keydown", disableKeyboard);
      clearInterval(checkDevTools);

      // Restore console
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
      console.info = originalInfo;
      console.debug = originalDebug;
      console.table = originalTable;
    };
  }, []);

  // This component renders nothing visible
  return null;
}
