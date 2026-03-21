import React, { useEffect, useMemo, useRef, useState } from "react";

/**
 * Candlestick-Quiz App (Swing-Trading) – Redesigned
 * Dark/Light Mode Toggle
 */

// ─── Design Tokens ───────────────────────────────────────────────────────────
const DARK = {
  bg: "#0d1117",
  surface: "#161b22",
  surfaceHi: "#1c2333",
  border: "#30363d",
  borderHi: "#484f58",
  text: "#e6edf3",
  textMuted: "#7d8590",
  textDim: "#484f58",
  green: "#3fb950",
  greenBg: "#0d2216",
  greenBdr: "#238636",
  red: "#f85149",
  redBg: "#2d1318",
  redBdr: "#da3633",
  yellow: "#e3b341",
  yellowBg: "#2b2006",
  yellowBdr: "#9e6a03",
  blue: "#58a6ff",
  blueBg: "#0c1929",
  blueBdr: "#1f6feb",
  purple: "#bc8cff",
  accent: "#f0b429",
};

const LIGHT = {
  bg: "#f6f8fa",
  surface: "#ffffff",
  surfaceHi: "#f0f2f5",
  border: "#d0d7de",
  borderHi: "#afb8c1",
  text: "#1f2328",
  textMuted: "#57606a",
  textDim: "#afb8c1",
  green: "#1a7f37",
  greenBg: "#dafbe1",
  greenBdr: "#82e09a",
  red: "#cf222e",
  redBg: "#ffebe9",
  redBdr: "#ff8182",
  yellow: "#9a6700",
  yellowBg: "#fff8c5",
  yellowBdr: "#d4a72c",
  blue: "#0969da",
  blueBg: "#ddf4ff",
  blueBdr: "#54aeff",
  purple: "#8250df",
  accent: "#9a6700",
};

// C is set dynamically — see ThemeProvider
let C = DARK;

const font = {
  mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  sans: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif",
};

// ─── Global Styles ────────────────────────────────────────────────────────────
const GlobalStyle = ({ theme }) => {
  C = theme === "light" ? LIGHT : DARK;
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: ${C.bg}; color: ${C.text}; font-family: ${font.sans}; }
      ::selection { background: ${C.blue}33; color: ${C.text}; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: ${C.bg}; }
      ::-webkit-scrollbar-thumb { background: ${C.border}; border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: ${C.borderHi}; }

      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(6px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      @keyframes flashGreen {
        0%   { background: ${C.greenBg}; }
        100% { background: transparent; }
      }
      @keyframes flashRed {
        0%   { background: ${C.redBg}; }
        100% { background: transparent; }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50%       { opacity: 0.4; }
      }
      .fade-in  { animation: fadeIn 0.25s ease forwards; }
      .flash-green { animation: flashGreen 0.4s ease forwards; }
      .flash-red   { animation: flashRed   0.4s ease forwards; }

      .choice-btn {
        width: 100%;
        padding: 12px 16px;
        border-radius: 6px;
        border: 1px solid ${C.border};
        background: ${C.surface};
        color: ${C.text};
        font-family: ${font.sans};
        font-size: 13px;
        line-height: 1.5;
        text-align: left;
        cursor: pointer;
        transition: border-color 0.15s, background 0.15s, transform 0.1s;
        display: flex;
        align-items: flex-start;
        gap: 10px;
      }
      .choice-btn:hover:not(:disabled) {
        border-color: ${C.blue};
        background: ${C.blueBg};
        transform: translateX(2px);
      }
      .choice-btn:disabled { cursor: default; }
      .choice-btn.correct {
        border-color: ${C.greenBdr};
        background: ${C.greenBg};
        color: ${C.green};
      }
      .choice-btn.wrong {
        border-color: ${C.redBdr};
        background: ${C.redBg};
        color: ${C.red};
      }
      .choice-btn.dimmed {
        opacity: 0.4;
      }
      .choice-btn .badge {
        flex-shrink: 0;
        width: 20px;
        height: 20px;
        border-radius: 4px;
        border: 1px solid ${C.borderHi};
        background: ${C.surfaceHi};
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: ${font.mono};
        font-size: 11px;
        color: ${C.textMuted};
        margin-top: 1px;
      }
      .choice-btn.correct .badge {
        background: ${C.greenBdr};
        border-color: ${C.green};
        color: #fff;
      }
      .choice-btn.wrong .badge {
        background: ${C.redBdr};
        border-color: ${C.red};
        color: #fff;
      }

      .nav-btn {
        padding: 7px 14px;
        border-radius: 6px;
        border: 1px solid ${C.border};
        background: ${C.surface};
        color: ${C.textMuted};
        font-family: ${font.sans};
        font-size: 13px;
        font-weight: 500;
        cursor: pointer;
        transition: border-color 0.15s, color 0.15s, background 0.15s;
      }
      .nav-btn:hover {
        border-color: ${C.borderHi};
        color: ${C.text};
        background: ${C.surfaceHi};
      }
      .nav-btn.active {
        border-color: ${C.blue};
        color: ${C.blue};
        background: ${C.blueBg};
      }
      .nav-btn.primary {
        border-color: ${C.greenBdr};
        color: ${C.green};
        background: ${C.greenBg};
      }
      .nav-btn.primary:hover {
        background: #0f2a1a;
      }
      .nav-btn.danger {
        border-color: ${C.redBdr};
        color: ${C.red};
        background: ${C.redBg};
      }

      .card {
        background: ${C.surface};
        border: 1px solid ${C.border};
        border-radius: 10px;
        padding: 20px;
        animation: fadeIn 0.2s ease forwards;
      }

      .tag {
        display: inline-flex;
        align-items: center;
        padding: 2px 8px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        font-family: ${font.mono};
        letter-spacing: 0.02em;
      }
      .tag-green { background: ${C.greenBg}; color: ${C.green}; border: 1px solid ${C.greenBdr}; }
      .tag-red   { background: ${C.redBg};   color: ${C.red};   border: 1px solid ${C.redBdr}; }
      .tag-gray  { background: ${C.surfaceHi}; color: ${C.textMuted}; border: 1px solid ${C.border}; }
      .tag-yellow { background: ${C.yellowBg}; color: ${C.yellow}; border: 1px solid ${C.yellowBdr}; }
      .tag-blue  { background: ${C.blueBg};  color: ${C.blue};  border: 1px solid ${C.blueBdr}; }

      table { border-collapse: collapse; width: 100%; }
      th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid ${C.border}; font-size: 13px; }
      th { color: ${C.textMuted}; font-weight: 500; font-family: ${font.mono}; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; }
      tr:last-child td { border-bottom: none; }
      tr:hover td { background: ${C.surfaceHi}; }

      .progress-bar {
        height: 3px;
        background: ${C.border};
        border-radius: 2px;
        overflow: hidden;
      }
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, ${C.blue}, ${C.purple});
        border-radius: 2px;
        transition: width 0.4s ease;
      }

      .reveal-box {
        padding: 16px;
        border-radius: 8px;
        border: 1px solid ${C.border};
        background: ${C.surfaceHi};
        animation: fadeIn 0.2s ease forwards;
      }

      .info-row {
        display: flex;
        gap: 6px;
        align-items: baseline;
        font-size: 13px;
        line-height: 1.6;
      }
      .info-label {
        color: ${C.textMuted};
        font-family: ${font.mono};
        font-size: 11px;
        flex-shrink: 0;
      }
      .info-value {
        color: ${C.text};
      }

      .score-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        border-radius: 6px;
        border: 1px solid ${C.border};
        background: ${C.surfaceHi};
        font-family: ${font.mono};
        font-size: 13px;
        color: ${C.textMuted};
      }
      .score-badge span { color: ${C.yellow}; font-weight: 600; }

      .context-chart {
        display: flex;
        align-items: flex-end;
        gap: 4px;
        padding: 10px 12px 8px;
        border-radius: 8px;
        background: ${C.bg};
        border: 1px solid ${C.border};
      }

      .flash-card {
        background: ${C.surface};
        border: 1px solid ${C.border};
        border-radius: 10px;
        padding: 16px;
        transition: border-color 0.2s;
        animation: fadeIn 0.2s ease forwards;
      }
      .flash-card:hover {
        border-color: ${C.borderHi};
      }

      .divider {
        height: 1px;
        background: ${C.border};
        margin: 12px 0;
      }

      .mono { font-family: ${font.mono}; }

      * { transition: background-color 0.2s ease, border-color 0.2s ease, color 0.15s ease; }
      button { transition: background-color 0.15s ease, border-color 0.15s ease, color 0.1s ease, transform 0.1s ease !important; }
    `}</style>
  );
};

// ─── Mini Candle ──────────────────────────────────────────────────────────────
const VIEW_WIDTH = 28;
const VIEW_HEIGHT = 48;
const SVG_SCALE = 0.85;

function MiniCandle({
  bodyColor = "#3fb950",
  core = { top: 3, bottom: 1, bodyY: 2, bodyH: 0.5 },
  padding = 4,
  wickMode = "both",
  wickTopLenPx = null,
  bodyShiftPx = 0,
  wickBottomTrimPx = 0,
  wickJoinPx = 0,
}) {
  const paddingTop = padding;
  const paddingBottom = padding;
  const drawable = VIEW_HEIGHT - paddingTop - paddingBottom;
  const mapY = (v) => paddingTop + (1 - v / 3.5) * drawable;
  const bodyH = Math.max(2, (core.bodyH / 3.5) * drawable);
  let bodyY = mapY(core.bodyY + core.bodyH) - bodyH;
  bodyY = Math.max(paddingTop, Math.min(bodyY, VIEW_HEIGHT - paddingBottom - bodyH));
  if (bodyShiftPx) bodyY = Math.max(paddingTop, Math.min(bodyY + bodyShiftPx, VIEW_HEIGHT - paddingBottom - bodyH));
  const bodyTopY = bodyY;
  const bodyBottomY = bodyY + bodyH;
  const yTopFromCore = mapY(core.top);
  const yBottomFromCore = mapY(core.bottom);
  let wickY1 = yTopFromCore, wickY2 = yBottomFromCore;
  if (wickMode === "both" && wickBottomTrimPx > 0) wickY2 = Math.max(bodyBottomY, wickY2 - wickBottomTrimPx);
  if (wickMode === "top" && typeof wickTopLenPx === "number") {
    wickY1 = Math.max(paddingTop, bodyTopY - wickTopLenPx);
    wickY2 = bodyTopY + (wickJoinPx || 0);
  } else if (wickMode === "top") {
    wickY1 = yTopFromCore;
    wickY2 = bodyTopY + (wickJoinPx || 0);
  } else if (wickMode === "bottom") {
    wickY1 = bodyBottomY - (wickJoinPx || 0);
    wickY2 = yBottomFromCore;
  }
  const showWick = wickMode !== "none";
  return (
    <svg width={VIEW_WIDTH * SVG_SCALE} height={VIEW_HEIGHT * SVG_SCALE} viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}>
      {showWick && <line x1="14" x2="14" y1={wickY1} y2={wickY2} stroke="#484f58" strokeWidth="1.5" />}
      <rect
        x="8"
        y={bodyY}
        width="12"
        height={bodyH}
        fill={bodyColor}
        stroke={bodyColor === "#3fb950" ? "#238636" : bodyColor === "#f85149" ? "#da3633" : "#484f58"}
        strokeWidth="0.5"
        rx="1.5"
      />
    </svg>
  );
}

function DragonflyDojiSVG() {
  return (
    <svg width={28 * SVG_SCALE} height={48 * SVG_SCALE} viewBox="0 0 28 48">
      <line x1="14" x2="14" y1="14" y2="42" stroke="#484f58" strokeWidth="1.5" />
      <line x1="9" x2="19" y1="14" y2="14" stroke="#7d8590" strokeWidth="2.5" />
    </svg>
  );
}

function GravestoneDojiSVG({ wickTopLenPx = 25 }) {
  const bodyY = 32;
  const wickTop = Math.max(4, bodyY - wickTopLenPx);
  return (
    <svg width={28 * SVG_SCALE} height={48 * SVG_SCALE} viewBox="0 0 28 48">
      <line x1="14" x2="14" y1={wickTop} y2={bodyY} stroke="#484f58" strokeWidth="1.5" />
      <line x1="9" x2="19" y1={bodyY} y2={bodyY} stroke="#7d8590" strokeWidth="2.5" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function displayName(c) {
  const n = String(c?.name || "");
  const d = String(c?.deName || "");
  return d && d !== n ? `${n} (${d})` : n;
}

function isNeutralTyp(typ) {
  return String(typ || "").toLowerCase().includes("neutral");
}

function colorTag(typ) {
  const t = String(typ || "").toLowerCase();
  if (t.includes("bullish")) return "tag-green";
  if (t.includes("bearish")) return "tag-red";
  return "tag-gray";
}

// ─── Candle Data ──────────────────────────────────────────────────────────────
const candles = [
  {
    name: "Hammer",
    deName: "Hammer",
    merk: "Abverkauf wird gekauft – Käufer übernehmen.",
    color: "green",
    typ: "Bullish Reversal",
    markt: "Abwärtstrend",
    erklaerung:
      "Hammer signalisiert nach Abwärtstrend eine Abwehr der Verkäufer. Lange Lunte unten = Kaufdruck kommt zurück. Gute Bestätigung: grüne Folgekerze + Volumen.",
    psychologie: "Verkäufer in Panik, Käufer übernehmen.",
    intraday:
      "Zu Beginn dominieren die Verkäufer und drücken den Kurs tiefer. Im Verlauf werden die Tiefs aggressiv gekauft, der Kurs erholt sich deutlich vom Tagestief.",
    beschreibung: "Kleiner Körper, langer unterer Schatten.",
    bedeutung: "Käufer drehen den Markt – Bodenbildung.",
    bestaetigung: "Grüne Folgekerze, RSI steigt, Volumen stabil.",
    strategie:
      "Einstieg erst nach Bestätigung: grüne Folgekerze über dem Hammer-Hoch. Stop unter das Tief der Lunte, Ziel: nächster Widerstand oder MA20.",
    wirkung: "2–3",
    staerke: 4,
    svg: () => <MiniCandle bodyColor="#3fb950" core={{ top: 2.6, bottom: 0.55, bodyY: 2.05, bodyH: 0.55 }} />,
  },
  {
    name: "Hanging Man",
    deName: "Hängender Mann",
    merk: "Abverkauf zeigt Schwäche – Käufer werden schwach.",
    color: "red",
    typ: "Bearish Reversal",
    markt: "Aufwärtstrend",
    erklaerung:
      "Hanging Man zeigt Schwäche im Aufwärtstrend. Lange Lunte = intraday Abverkauf. Erst mit roter Folgekerze als Top verlässlicher.",
    psychologie: "Käufer erschöpft, Smart Money verkauft in Stärke.",
    intraday:
      "Nach einem Aufwärtsmove treiben Käufer den Kurs zunächst höher. Im Verlauf kommt es zu einem deutlichen Abverkauf nach unten, der nur teilweise zurückgekauft wird.",
    beschreibung: "Wie Hammer, aber nach Aufwärtstrend.",
    bedeutung: "Verkäufer übernehmen – Topbildung möglich.",
    bestaetigung: "Rote Folgekerze, Volumenanstieg, RSI fällt.",
    strategie:
      "Swing-Trader warten auf eine rote Bestätigungskerze unterhalb des Hanging-Man-Körpers. Stop über dem Hoch, Ziel: nächster Support oder MA20.",
    wirkung: "2",
    staerke: 5,
    svg: () => <MiniCandle bodyColor="#f85149" core={{ top: 2.75, bottom: 0.55, bodyY: 2.05, bodyH: 0.55 }} />,
  },
  {
    name: "Dragonfly Doji",
    deName: "Libellen-Doji",
    merk: "Abverkauf neutralisiert – Entscheidung folgt.",
    color: "green",
    typ: "Bullish Reversal",
    markt: "Abwärtstrend",
    erklaerung:
      "Der Dragonfly Doji zeigt nach einem Abwärtstrend eine starke Reaktion der Käufer. Starker Rückkauf bis zum Schluss = bullische Stärke.",
    psychologie: "Verkäufer verlieren Momentum, Käufer übernehmen.",
    intraday:
      "Zu Beginn dominieren Verkäufer und drücken den Kurs deutlich nach unten. Im weiteren Verlauf steigen Käufer massiv ein und bringen den Schlusskurs in die Nähe des Hochs.",
    beschreibung: "Kein oder sehr kleiner Körper, langer unterer Schatten.",
    bedeutung: "Bodenbildung möglich – Käufer verteidigen Support.",
    bestaetigung: "Grüne Folgekerze über Hoch des Doji, RSI dreht nach oben.",
    strategie:
      "Long-Einstieg nur bei klarer bullischer Folgekerze, die das Hoch des Doji überbietet. Stop knapp unter dem Tief der Lunte.",
    wirkung: "2–3",
    staerke: 3,
    svg: () => <DragonflyDojiSVG />,
  },
  {
    name: "Gravestone Doji",
    deName: "Grabstein-Doji",
    merk: "Hoch wird komplett verkauft – Warnsignal.",
    color: "red",
    typ: "Bearish Reversal",
    markt: "Aufwärtstrend",
    erklaerung:
      "Am Ende eines Aufwärtstrends häufig: Käufer treiben den Kurs hoch, Verkäufer drücken ihn bis zum Schluss zurück – Zeichen für Erschöpfung der Bullen.",
    psychologie: "Käufer verlieren Kontrolle, Verkäufer übernehmen.",
    intraday:
      "Käufer eröffnen stark und treiben den Kurs deutlich nach oben. Später übernehmen Verkäufer komplett und drücken den Schlusskurs zurück zum Eröffnungsniveau.",
    beschreibung: "Kein oder sehr kleiner Körper, langer oberer Schatten.",
    bedeutung: "Topbildung – mögliche Umkehr.",
    bestaetigung: "Rote Folgekerze unterhalb des Doji, Volumenanstieg, Stochastik fällt.",
    strategie:
      "Short-Einstieg nach roter Bestätigungskerze, die unterhalb des Doji-Körpers schließt. Stop über dem Hoch des Doji.",
    wirkung: "2–3",
    staerke: 4,
    svg: () => <GravestoneDojiSVG wickTopLenPx={25} />,
  },
  {
    name: "Inverted Hammer",
    deName: "Invertierter Hammer",
    merk: "Hoch wird getestet – Käufer zeigen erste Stärke.",
    color: "green",
    typ: "Bullish Reversal (schwach)",
    markt: "Abwärtstrend",
    erklaerung:
      "Käufer zeigen erste Stärke – intraday hochgekauft, Schluss noch tief. Mit Folgekerze bestätigen lassen.",
    psychologie: "Verkäufer verlieren Druck; Käufer testen Widerstand.",
    intraday:
      "Im Abwärtstrend drücken Verkäufer den Kurs zunächst tiefer. Käufer schaffen intraday eine deutliche Erholung nach oben, können das Niveau aber nicht halten.",
    beschreibung: "Kleiner Körper unten, langer oberer Schatten.",
    bedeutung: "Erste bullische Gegenwehr.",
    bestaetigung: "Grüne Folgekerze über Hoch des Inverted Hammer.",
    strategie:
      "Sehr konservativ: nur nach klarer grüner Bestätigungskerze über dem Hoch einsteigen. Stop unter dem Tief der Kerze.",
    wirkung: "2–3",
    staerke: 4,
    svg: () => (
      <MiniCandle
        bodyColor="#3fb950"
        padding={4}
        wickMode="top"
        wickTopLenPx={25}
        wickJoinPx={1}
        core={{ top: 3.3, bottom: 1.0, bodyY: 1.15, bodyH: 0.55 }}
      />
    ),
  },
  {
    name: "Shooting Star",
    deName: "Sternschnuppe",
    merk: "Hoch wird verkauft – Käufer erschöpft.",
    color: "red",
    typ: "Bearish Reversal",
    markt: "Aufwärtstrend",
    erklaerung:
      "Aufwärtsmomentum lässt nach: Hoch ausgenutzt, danach deutlicher Abverkauf innerhalb der Kerze.",
    psychologie: "Käufer erschöpft, Smart Money verkauft in Stärke.",
    intraday:
      "Käufer treiben den Kurs nach oben auf ein neues Hoch. Danach übernehmen Verkäufer und drücken den Schlusskurs in die Nähe des Tagestiefs.",
    beschreibung: "Kleiner Körper unten, langer oberer Schatten.",
    bedeutung: "Topbildung – potenzielle Umkehr.",
    bestaetigung: "Rote Folgekerze unterhalb des Shooting Star mit Volumenanstieg.",
    strategie:
      "Short-Einstieg nach roter Bestätigungskerze unterhalb des Kerzenkörpers. Stop knapp über dem Hoch.",
    wirkung: "2–3",
    staerke: 5,
    svg: () => <MiniCandle bodyColor="#f85149" wickJoinPx={2} core={{ top: 3.4, bottom: 1.9, bodyY: 1.05, bodyH: 0.55 }} />,
  },
  {
    name: "Marubozu (grün)",
    deName: "Marubozu (grün)",
    merk: "Nur Kaufdruck – Trendstärke ohne Pause.",
    color: "green",
    typ: "Bullish Continuation",
    markt: "Aufwärtstrend",
    erklaerung: "Starke Kaufdominanz: keine Schatten – Käufer kontrollieren die gesamte Periode.",
    psychologie: "Bullen dominieren; Momentum/Volumen stark.",
    intraday:
      "Vom Open bis zum Close dominieren Käufer die gesamte Handelsspanne. Der Kurs läuft fast nur nach oben, ohne nennenswerte Rücksetzer.",
    beschreibung: "Keine Schatten, langer grüner Körper.",
    bedeutung: "Trendfortsetzung wahrscheinlich.",
    bestaetigung: "Weitere grüne Kerze oder hohes Volumen.",
    strategie:
      "Swing-Trader nutzen kleine Rücksetzer nach einem grünen Marubozu, um prozyklisch long zu gehen. Stop unter der Mitte der Kerze.",
    wirkung: "3–5",
    staerke: 8,
    svg: () => <MiniCandle wickMode="none" padding={2} bodyColor="#3fb950" core={{ top: 3.5, bottom: 0.0, bodyY: 0.0, bodyH: 3.5 }} />,
  },
  {
    name: "Marubozu (rot)",
    deName: "Marubozu (rot)",
    merk: "Nur Verkaufsdruck – Abwärtsdruck ohne Pause.",
    color: "red",
    typ: "Bearish Continuation",
    markt: "Abwärtstrend",
    erklaerung: "Starke Verkaufsdominanz: keine Schatten – Verkäufer kontrollieren die gesamte Periode.",
    psychologie: "Bären dominieren; Käufer ohne Gegenwehr.",
    intraday:
      "Vom Open bis zum Close dominieren Verkäufer den Markt. Der Kurs fällt nahezu durchgehend, es entstehen kaum Schatten.",
    beschreibung: "Keine Schatten, langer roter Körper.",
    bedeutung: "Abwärtstrend / Korrektur wahrscheinlich.",
    bestaetigung: "Weitere rote Kerze oder Volumenanstieg.",
    strategie:
      "Swing-Trader suchen nach einem kleinen Pullback nach oben, um Short-Positionen in Trendrichtung zu eröffnen.",
    wirkung: "3–5",
    staerke: 8,
    svg: () => <MiniCandle wickMode="none" padding={2} bodyColor="#f85149" core={{ top: 3.5, bottom: 0.0, bodyY: 0.0, bodyH: 3.5 }} />,
  },
  {
    name: "Doji",
    deName: "Doji",
    merk: "Unentschlossenheit – Folgekerze entscheidet.",
    color: "gray",
    typ: "Neutral",
    markt: "Trendphase beliebig",
    erklaerung:
      "Unentschlossenheit: Käufer und Verkäufer gleichen sich aus – häufig Pause/Wechsel, v. a. nach starken Trends.",
    psychologie: "Gleichgewicht – niemand dominiert.",
    intraday:
      "Innerhalb der Kerze wechseln sich Käufe und Verkäufe ab. Der Kurs pendelt zwischen Hoch und Tief, schließt aber wieder nahe dem Eröffnungsniveau.",
    beschreibung: "Open ≈ Close, Schatten oben und unten.",
    bedeutung: "Unsicherheit oder Trendwechsel.",
    bestaetigung: "Folgekerze bestätigt Richtung.",
    strategie: "Dojis werden im konservativen Swing-Trading meist nicht direkt gehandelt. Erst die Folgekerze entscheidet.",
    wirkung: "1–2",
    staerke: null,
    svg: () => (
      <svg width={28 * SVG_SCALE} height={48 * SVG_SCALE} viewBox="0 0 28 48">
        <line x1="14" x2="14" y1="6" y2="42" stroke="#484f58" strokeWidth="1.5" />
        <line x1="7" x2="21" y1="24" y2="24" stroke="#7d8590" strokeWidth="2.5" />
      </svg>
    ),
  },
  {
    name: "Spinning Top",
    deName: "Kreisel",
    merk: "Pause im Trend – Kraft sammelt sich.",
    color: "gray",
    typ: "Neutral / Trendpause",
    markt: "Seitwärtsphase oder Trendpause",
    erklaerung:
      "Gleichgewicht/Unsicherheit – Markt sammelt Kraft. Oft Vorbote einer größeren Bewegung mit steigendem Volumen.",
    psychologie: "Unentschlossenheit; Institutionelle warten.",
    intraday:
      "Mehrere Impulse nach oben und unten wechseln sich ab. Der kleine Kerzenkörper zeigt, dass weder Käufer noch Verkäufer sich klar durchsetzen.",
    beschreibung: "Kleiner Körper, obere & untere Schatten ähnlich lang.",
    bedeutung: "Trendpause oder Richtungsänderung möglich.",
    bestaetigung: "Bestätigung durch Folgekerze oder Volumenanstieg.",
    strategie:
      "Spinning Tops werden selten direkt gehandelt. Break nach oben → prozyklisch long; Break nach unten → prozyklisch short.",
    wirkung: "1–2",
    staerke: null,
    svg: () => <MiniCandle bodyColor="#7d8590" core={{ top: 3.4, bottom: 0.2, bodyY: 1.8, bodyH: 0.6 }} bodyShiftPx={11} />,
  },
];

// ─── Context Chart ────────────────────────────────────────────────────────────
const GREEN = "#3fb950";
const RED = "#f85149";
const GRAY = "#7d8590";

function getChartSequence(name) {
  switch (name) {
    case "Hammer":
      return [
        { high: 110, low: 96, open: 109, close: 98, color: RED },
        { high: 100, low: 88, open: 99, close: 90, color: RED },
        { high: 92, low: 76, open: 91, close: 88, color: GREEN, signal: true },
        { high: 94, low: 86, open: 88, close: 93, color: GREEN },
      ];
    case "Hanging Man":
      return [
        { high: 92, low: 82, open: 83, close: 91, color: GREEN },
        { high: 100, low: 90, open: 91, close: 99, color: GREEN },
        { high: 101, low: 85, open: 100, close: 97, color: RED, signal: true },
        { high: 98, low: 88, open: 97, close: 89, color: RED },
      ];
    case "Inverted Hammer":
      return [
        { high: 112, low: 98, open: 111, close: 100, color: RED },
        { high: 102, low: 88, open: 101, close: 90, color: RED },
        { high: 100, low: 84, open: 86, close: 88, color: GREEN, signal: true },
        { high: 96, low: 86, open: 88, close: 95, color: GREEN },
      ];
    case "Shooting Star":
      return [
        { high: 94, low: 84, open: 85, close: 93, color: GREEN },
        { high: 102, low: 91, open: 93, close: 101, color: GREEN },
        { high: 116, low: 99, open: 101, close: 103, color: RED, signal: true },
        { high: 104, low: 94, open: 103, close: 95, color: RED },
      ];
    case "Dragonfly Doji":
      return [
        { high: 108, low: 95, open: 107, close: 97, color: RED },
        { high: 99, low: 85, open: 98, close: 87, color: RED },
        { high: 88, low: 74, open: 88, close: 88, color: GRAY, signal: true, doji: "dragonfly" },
        { high: 95, low: 86, open: 88, close: 94, color: GREEN },
      ];
    case "Gravestone Doji":
      return [
        { high: 95, low: 85, open: 86, close: 94, color: GREEN },
        { high: 104, low: 93, open: 94, close: 103, color: GREEN },
        { high: 116, low: 103, open: 103, close: 103, color: GRAY, signal: true, doji: "gravestone" },
        { high: 104, low: 94, open: 103, close: 95, color: RED },
      ];
    case "Doji":
      return [
        { high: 102, low: 92, open: 93, close: 101, color: GREEN },
        { high: 104, low: 94, open: 102, close: 96, color: RED },
        { high: 106, low: 92, open: 99, close: 99, color: GRAY, signal: true, doji: "standard" },
      ];
    case "Spinning Top":
      return [
        { high: 104, low: 94, open: 101, close: 97, color: RED },
        { high: 102, low: 92, open: 93, close: 100, color: GREEN },
        { high: 106, low: 90, open: 98, close: 100, color: GREEN, signal: true },
      ];
    case "Marubozu (grün)":
      return [
        { high: 92, low: 84, open: 85, close: 91, color: GREEN },
        { high: 100, low: 90, open: 91, close: 99, color: GREEN },
        { high: 112, low: 100, open: 100, close: 112, color: GREEN, signal: true, marubozu: true },
        { high: 118, low: 110, open: 112, close: 117, color: GREEN },
      ];
    case "Marubozu (rot)":
      return [
        { high: 116, low: 106, open: 115, close: 107, color: RED },
        { high: 108, low: 98, open: 107, close: 99, color: RED },
        { high: 100, low: 88, open: 100, close: 88, color: RED, signal: true, marubozu: true },
        { high: 90, low: 78, open: 88, close: 80, color: RED },
      ];
    default:
      return null;
  }
}

function ContextChart({ candle }) {
  if (!candle) return null;
  const seq = getChartSequence(candle.name);
  if (!seq) return null;

  const W = 220;
  const H = 90;
  const PAD_X = 8;
  const PAD_Y = 8;
  const candleW = 14;
  const gap = 4;
  const n = seq.length;
  const totalCandleW = n * candleW + (n - 1) * gap;
  const startX = (W - totalCandleW) / 2;

  const allPrices = seq.flatMap((c) => [c.high, c.low]);
  const priceMin = Math.min(...allPrices);
  const priceMax = Math.max(...allPrices);
  const priceRange = priceMax - priceMin || 1;

  const toY = (price) => PAD_Y + (1 - (price - priceMin) / priceRange) * (H - 2 * PAD_Y);

  const wickColor = (isDark) => (isDark ? "#484f58" : "#afb8c1");
  const strokeColor = (fill) => (fill === GREEN ? "#238636" : fill === RED ? "#da3633" : "#6b7280");

  const markt = String(candle.markt || "").toLowerCase();
  const trendLabel = markt.includes("aufwärt")
    ? "↑ Aufwärtstrend"
    : markt.includes("abwärt")
    ? "↓ Abwärtstrend"
    : "↔ Seitwärts / Trendpause";

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 10, color: C.textDim, fontFamily: font.mono, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>
        Kontext-Chart
      </div>
      <div
        style={{
          background: C.bg,
          border: `1px solid ${C.border}`,
          borderRadius: 8,
          padding: "8px 4px 4px",
          display: "inline-block",
        }}
      >
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {seq.map((c, i) => {
            const cx = startX + i * (candleW + gap) + candleW / 2;
            const x = startX + i * (candleW + gap);
            const yHigh = toY(c.high);
            const yLow = toY(c.low);
            const yOpen = toY(c.open);
            const yClose = toY(c.close);
            const yTop = Math.min(yOpen, yClose);
            const yBot = Math.max(yOpen, yClose);
            const bodyH = Math.max(1.5, yBot - yTop);
            const isSignal = !!c.signal;

            return (
              <g key={i}>
                {isSignal && (
                  <rect
                    x={x - 3}
                    y={yHigh - 4}
                    width={candleW + 6}
                    height={yLow - yHigh + 8}
                    rx={3}
                    ry={3}
                    fill={`${C.yellow}12`}
                    stroke={C.yellow}
                    strokeWidth="1"
                  />
                )}

                {!c.marubozu && (
                  <line x1={cx} x2={cx} y1={yHigh} y2={yTop} stroke={wickColor(true)} strokeWidth="1.5" strokeLinecap="round" />
                )}
                {!c.marubozu && (
                  <line x1={cx} x2={cx} y1={yBot} y2={yLow} stroke={wickColor(true)} strokeWidth="1.5" strokeLinecap="round" />
                )}

                {c.doji ? (
                  <line
                    x1={x + 2}
                    x2={x + candleW - 2}
                    y1={yTop}
                    y2={yTop}
                    stroke={GRAY}
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                ) : (
                  <rect
                    x={x + 1}
                    y={yTop}
                    width={candleW - 2}
                    height={bodyH}
                    fill={c.color}
                    stroke={strokeColor(c.color)}
                    strokeWidth="0.5"
                    rx="1"
                  />
                )}
              </g>
            );
          })}
        </svg>
        <div style={{ fontSize: 10, color: C.textDim, fontFamily: font.mono, paddingLeft: 6, paddingBottom: 2 }}>
          {trendLabel}
        </div>
      </div>
    </div>
  );
}

// ─── Quiz Engine ──────────────────────────────────────────────────────────────
const QUESTION_TYPES = ["name_from_description", "type_from_name", "market_from_name", "strength_from_name", "strategy_from_name"];
const ROUND_SIZE = 10;
const LABELS = ["A", "B", "C", "D"];

function pick(arr, k) {
  const a = [...arr];
  const out = [];
  while (out.length < k && a.length) out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]);
  return out;
}

function buildQuestion() {
  for (let i = 0; i < 50; i++) {
    const qtype = pick(QUESTION_TYPES, 1)[0];
    const item = pick(candles, 1)[0];
    if (qtype === "strength_from_name" && isNeutralTyp(item.typ)) continue;
    let prompt = "",
      choices = [],
      correct = "",
      renderGraphic = null;
    switch (qtype) {
      case "name_from_description":
        prompt = `Welche Kerze passt zur Beschreibung: „${item.beschreibung}" (Signal: ${item.bedeutung})?`;
        correct = item.name;
        choices = pick(candles.map((c) => c.name), 4);
        if (!choices.includes(correct)) choices[0] = correct;
        renderGraphic = item.svg;
        break;
      case "type_from_name":
        prompt = `Welcher Typ (Signalart) passt zu ${displayName(item)}?`;
        correct = item.typ;
        choices = pick([...new Set(candles.map((c) => c.typ))], 4);
        if (!choices.includes(correct)) choices[0] = correct;
        renderGraphic = item.svg;
        break;
      case "market_from_name":
        prompt = `Aus welchem Trendkontext kommt ${displayName(item)}?`;
        correct = item.markt;
        choices = pick([...new Set(candles.map((c) => c.markt))], 4);
        if (!choices.includes(correct)) choices[0] = correct;
        renderGraphic = item.svg;
        break;
      case "strength_from_name":
        prompt = `Welche Signalstärke (1–10) hat ${displayName(item)}?`;
        correct = String(item.staerke);
        choices = pick(["3", "4", "5", "6", "7", "8", "9", "10"], 4);
        if (!choices.includes(correct)) choices[0] = correct;
        renderGraphic = item.svg;
        break;
      case "strategy_from_name":
        prompt = `Wie würdest du ${displayName(item)} als Swing-Trader handeln?`;
        correct = item.strategie;
        choices = [correct, ...pick(candles.filter((c) => c.name !== item.name).map((c) => c.strategie), 3)];
        renderGraphic = item.svg;
        break;
      default:
        break;
    }
    choices = pick(choices, choices.length);
    return { qtype, item, prompt, choices, correct, renderGraphic };
  }
  const item = candles[0];
  return {
    qtype: "name_from_description",
    item,
    prompt: `Welche Kerze passt zur Beschreibung: „${item.beschreibung}"?`,
    choices: pick(candles.map((c) => c.name), 4),
    correct: item.name,
    renderGraphic: item.svg,
  };
}

function buildRoundQuestions(size) {
  const out = [];
  for (let tries = 0; out.length < size && tries < 500; tries++) {
    const q = buildQuestion();
    const prev = out[out.length - 1];
    if (prev && (prev.item?.name === q.item?.name || prev.qtype === q.qtype)) continue;
    out.push(q);
  }
  while (out.length < size) out.push(buildQuestion());
  return out;
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState("dark");
  C = theme === "light" ? LIGHT : DARK;

  const [mode, setMode] = useState("quiz");
  const [answer, setAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);
  const [lastRound, setLastRound] = useState(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [round, setRound] = useState(() => ({ queue: buildRoundQuestions(ROUND_SIZE), index: 0 }));
  const [flash, setFlash] = useState(null);
  const flashRef = useRef(null);

  useEffect(() => () => {
    if (flashRef.current) clearTimeout(flashRef.current);
  }, []);

  const inReview = reviewMode && reviewQueue.length > 0;
  const answeredCurrent = answer !== null;
  const q = inReview ? reviewQueue[reviewIndex] : round.queue[round.index];
  const isNeutralNow = isNeutralTyp(q?.item?.typ);
  const currentWasCorrect = answeredCurrent ? answer === q.correct : null;

  const progress = useMemo(() => {
    if (inReview) return 0;
    const mod = history.length % ROUND_SIZE;
    if (history.length > 0 && mod === 0) return 100;
    return mod * (100 / ROUND_SIZE);
  }, [history.length, inReview]);

  const curNum = inReview ? reviewIndex + 1 : round.index + 1;
  const totalNum = inReview ? reviewQueue.length : ROUND_SIZE;

  function next() {
    setAnswer(null);
    setFlash(null);
    if (inReview) {
      setReviewIndex((i) => (i + 1) % reviewQueue.length);
      return;
    }
    setRound((prev) => {
      const ni = prev.index + 1;
      return ni >= prev.queue.length ? { queue: buildRoundQuestions(ROUND_SIZE), index: 0 } : { ...prev, index: ni };
    });
  }

  function check(a) {
    if (answer !== null) return;
    const isCorrect = a === q.correct;
    setAnswer(a);
    if (isCorrect) setScore((s) => s + 1);
    setFlash(isCorrect ? "correct" : "wrong");
    if (flashRef.current) clearTimeout(flashRef.current);
    flashRef.current = setTimeout(() => setFlash(null), 400);

    if (!inReview) {
      setHistory((prev) => {
        const nr = prev.length + 1;
        const entry = { nr, question: q, given: a, isCorrect, points: isCorrect ? 10 : 0 };
        const updated = [...prev, entry];
        if (nr % ROUND_SIZE === 0) {
          const roundEntries = updated.slice(nr - ROUND_SIZE, nr);
          const cc = roundEntries.filter((r) => r.isCorrect).length;
          setLastRound({ entries: roundEntries, correctCount: cc, percent: Math.round((cc / ROUND_SIZE) * 100) });
        }
        return updated;
      });
    }
  }

  function startReviewWrong() {
    if (!lastRound) return;
    const wrong = lastRound.entries.filter((e) => !e.isCorrect);
    if (!wrong.length) return;
    setReviewQueue(wrong.map((e) => e.question));
    setReviewIndex(0);
    setReviewMode(true);
    setAnswer(null);
    setFlash(null);
  }

  function stopReview() {
    setReviewMode(false);
    setReviewQueue([]);
    setReviewIndex(0);
    setRound({ queue: buildRoundQuestions(ROUND_SIZE), index: 0 });
    setAnswer(null);
    setFlash(null);
  }

  function resetAll() {
    setScore(0);
    setHistory([]);
    setLastRound(null);
    setReviewMode(false);
    setReviewQueue([]);
    setReviewIndex(0);
    setRound({ queue: buildRoundQuestions(ROUND_SIZE), index: 0 });
    setAnswer(null);
    setFlash(null);
  }

  return (
    <>
      <GlobalStyle theme={theme} />

      <div style={{ minHeight: "100vh", background: C.bg, color: C.text, padding: "20px 20px 48px", fontFamily: font.sans }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gap: 16 }}>
          {/* ── Header ── */}
          <header
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
              flexWrap: "wrap",
              paddingBottom: 16,
              borderBottom: `1px solid ${C.border}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={{ display: "flex", gap: 3 }}>
                    {[...Array(3)].map((_, j) => (
                      <div
                        key={j}
                        style={{
                          width: 3,
                          height: i === 1 ? 10 : i === 0 ? 6 : 14,
                          background: i === 2 && j === 1 ? C.red : i === 0 && j === 1 ? C.green : C.border,
                          borderRadius: 1,
                        }}
                      />
                    ))}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.01em", lineHeight: 1 }}>Candlestick Quiz</div>
                <div style={{ fontSize: 11, color: C.textMuted, fontFamily: font.mono, marginTop: 3 }}>
                  Swing-Trading · {candles.length} Muster
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <div className="score-badge">
                Punkte <span>{score}</span>
              </div>
              <div style={{ width: 1, height: 24, background: C.border }} />
              <button
                className="nav-btn"
                onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
                title="Theme wechseln"
                style={{ fontSize: 16, padding: "5px 10px" }}
              >
                {theme === "dark" ? "☀️" : "🌙"}
              </button>
              <div style={{ width: 1, height: 24, background: C.border }} />
              <button className={`nav-btn${mode === "quiz" ? " active" : ""}`} onClick={() => setMode("quiz")}>
                Quiz
              </button>
              <button className={`nav-btn${mode === "flash" ? " active" : ""}`} onClick={() => setMode("flash")}>
                Flashcards
              </button>
              <button className="nav-btn" onClick={resetAll}>
                Reset
              </button>
              {inReview && (
                <button className="nav-btn danger" onClick={stopReview}>
                  Review ✕
                </button>
              )}
            </div>
          </header>

          {/* ── Hero / SEO / Conversion ── */}
          <section className="card" style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <span className="tag tag-blue">Kostenlos</span>
              <span className="tag tag-green">Interaktiv</span>
              <span className="tag tag-yellow">Kerzenmuster lernen</span>
            </div>

            <div style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.15, letterSpacing: "-0.02em" }}>
              Candlestick Quiz – Kerzenmuster verstehen und Trading lernen
            </div>

            <p style={{ fontSize: 15, lineHeight: 1.75, color: C.textMuted }}>
              Lerne die wichtigsten <strong style={{ color: C.text }}>Candlestick Muster</strong> wie Hammer, Doji,
              Shooting Star und Marubozu interaktiv kennen. Dieses Quiz hilft dir dabei, deine
              <strong style={{ color: C.text }}> Chartanalyse</strong> zu verbessern, Marktbewegungen schneller zu
              verstehen und dein Wissen im <strong style={{ color: C.text }}>Swing Trading</strong> gezielt auszubauen.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: 10,
              }}
            >
              <div
                style={{
                  padding: "12px 14px",
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  background: C.surfaceHi,
                  fontSize: 13,
                  color: C.textMuted,
                  lineHeight: 1.6,
                }}
              >
                <strong style={{ color: C.text }}>Lerne echte Kerzenmuster</strong>
                <br />
                Hammer, Doji, Shooting Star, Marubozu und weitere wichtige Candlestick Patterns.
              </div>

              <div
                style={{
                  padding: "12px 14px",
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  background: C.surfaceHi,
                  fontSize: 13,
                  color: C.textMuted,
                  lineHeight: 1.6,
                }}
              >
                <strong style={{ color: C.text }}>Trainiere dein Trading-Auge</strong>
                <br />
                Verstehe, wie Käufer und Verkäufer im Chart agieren und welche Signale wirklich zählen.
              </div>

              <div
                style={{
                  padding: "12px 14px",
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  background: C.surfaceHi,
                  fontSize: 13,
                  color: C.textMuted,
                  lineHeight: 1.6,
                }}
              >
                <strong style={{ color: C.text }}>Ideal für Anfänger und Fortgeschrittene</strong>
                <br />
                Perfekt zum Lernen, Wiederholen und Vertiefen von Trading- und Chartanalyse-Grundlagen.
              </div>
            </div>
          </section>

          {/* ── Progress ── */}
          {mode === "quiz" && !inReview && (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="progress-bar" style={{ flex: 1 }}>
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, fontFamily: font.mono, flexShrink: 0 }}>
                {curNum}/{totalNum}
              </div>
            </div>
          )}

          {/* ── Review Banner ── */}
          {inReview && (
            <div
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                background: C.yellowBg,
                border: `1px solid ${C.yellowBdr}`,
                fontSize: 13,
                color: C.yellow,
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <span style={{ fontFamily: font.mono }}>⟳</span>
              Review-Modus — falsche Fragen aus der letzten Runde ({reviewIndex + 1}/{reviewQueue.length})
            </div>
          )}

          {/* ── Quiz Mode ── */}
          {mode === "quiz" && q && (
            <div className={`card${flash === "correct" ? " flash-green" : flash === "wrong" ? " flash-red" : ""}`}>
              <div style={{ display: "grid", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div
                    style={{
                      flexShrink: 0,
                      background: C.surfaceHi,
                      borderRadius: 8,
                      padding: "10px 8px",
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    {q.renderGraphic && <q.renderGraphic />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: font.mono, fontSize: 11, color: C.textDim }}>
                        FRAGE {curNum}/{totalNum}
                      </span>
                      <span className={`tag ${colorTag(q.item?.typ)}`}>{q.item?.typ}</span>
                    </div>
                    <p style={{ fontSize: 15, lineHeight: 1.6, color: C.text }}>{q.prompt}</p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                  {q.choices.map((c, idx) => {
                    const chosen = answer === c;
                    const correct = q.correct === c;
                    let cls = "choice-btn";
                    if (answer) {
                      if (correct) cls += " correct";
                      else if (chosen) cls += " wrong";
                      else cls += " dimmed";
                    }
                    return (
                      <button key={idx} className={cls} onClick={() => check(c)} disabled={!!answer}>
                        <span className="badge">{LABELS[idx]}</span>
                        <span style={{ flex: 1 }}>{c}</span>
                      </button>
                    );
                  })}
                </div>

                {answer && (
                  <div className="reveal-box">
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: currentWasCorrect ? C.green : C.red }}>
                        {currentWasCorrect ? "✓ Richtig" : "✗ Falsch"}
                      </div>
                      <div style={{ fontSize: 13, color: C.textMuted }}>
                        Korrekte Antwort: <span style={{ color: C.text }}>{q.correct}</span>
                      </div>
                    </div>

                    <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
                      {q.item.merk && (
                        <div
                          style={{
                            padding: "10px 14px",
                            borderRadius: 6,
                            background: `${C.yellow}0a`,
                            border: `1px solid ${C.yellowBdr}`,
                            fontSize: 13,
                            color: C.yellow,
                          }}
                        >
                          💡 {q.item.merk}
                        </div>
                      )}
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 20px" }}>
                        {[
                          ["Typ", q.item.typ],
                          ["Markt", q.item.markt],
                          ["Signalstärke", isNeutralNow ? "— (neutral)" : `${q.item.staerke} / 10`],
                          ["Wirkungsdauer", `${q.item.wirkung} Tage`],
                          ["Bestätigung", q.item.bestaetigung],
                          ["Psychologie", q.item.psychologie],
                        ].map(([label, val]) => (
                          <div key={label} className="info-row">
                            <span className="info-label">{label}</span>
                            <span className="info-value" style={{ fontSize: 13 }}>
                              {val}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="info-row" style={{ flexDirection: "column", gap: 2 }}>
                        <span className="info-label">Strategie</span>
                        <span className="info-value" style={{ fontSize: 13, color: C.textMuted }}>
                          {q.item.strategie}
                        </span>
                      </div>
                    </div>

                    <ContextChart candle={q.item} />

                    {q.item.erklaerung && (
                      <div
                        style={{
                          marginTop: 12,
                          padding: "10px 14px",
                          borderRadius: 6,
                          background: C.blueBg,
                          border: `1px solid ${C.blueBdr}`,
                          fontSize: 13,
                          lineHeight: 1.6,
                          color: C.textMuted,
                        }}
                      >
                        <span style={{ color: C.blue, fontWeight: 600 }}>Erklärung: </span>
                        {q.item.erklaerung}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 12, color: C.textDim, fontFamily: font.mono }}>
                    score:{score} · q:{history.length}
                  </div>
                  {answer && (
                    <button className="nav-btn primary" onClick={next}>
                      Nächste Frage →
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Flashcards ── */}
          {mode === "flash" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
              {candles.map((c, i) => {
                const neutral = isNeutralTyp(c.typ);
                return (
                  <div key={i} className="flash-card">
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 12 }}>
                      <div
                        style={{
                          flexShrink: 0,
                          background: C.surfaceHi,
                          borderRadius: 8,
                          padding: "8px 6px",
                          border: `1px solid ${C.border}`,
                        }}
                      >
                        {c.svg && <c.svg />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{displayName(c)}</div>
                        {c.merk && <div style={{ fontSize: 12, color: C.yellow, lineHeight: 1.5 }}>{c.merk}</div>}
                        <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <span className={`tag ${colorTag(c.typ)}`}>{c.typ}</span>
                          <span className="tag tag-gray">{neutral ? "— neutral" : `★ ${c.staerke}/10`}</span>
                        </div>
                      </div>
                    </div>
                    <div className="divider" />
                    <div style={{ display: "grid", gap: 6 }}>
                      {[
                        ["Markt", c.markt],
                        ["Beschreibung", c.beschreibung],
                        ["Bedeutung", c.bedeutung],
                        ["Bestätigung", c.bestaetigung],
                        ["Psychologie", c.psychologie],
                        ["Strategie", c.strategie],
                      ].map(([label, val]) => (
                        <div key={label} className="info-row">
                          <span className="info-label">{label}</span>
                          <span className="info-value" style={{ fontSize: 12, color: C.textMuted }}>
                            {val}
                          </span>
                        </div>
                      ))}
                    </div>
                    <ContextChart candle={c} />
                    {c.erklaerung && (
                      <div
                        style={{
                          marginTop: 10,
                          padding: "8px 12px",
                          borderRadius: 6,
                          background: C.blueBg,
                          border: `1px solid ${C.blueBdr}`,
                          fontSize: 12,
                          color: C.textMuted,
                          lineHeight: 1.5,
                        }}
                      >
                        <span style={{ color: C.blue, fontWeight: 600 }}>Erklärung: </span>
                        {c.erklaerung}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Round Summary ── */}
          {lastRound && mode === "quiz" && (
            <div className="card">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 16,
                  flexWrap: "wrap",
                  gap: 10,
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>Rundenübersicht</div>
                  <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>
                    {lastRound.correctCount}/{ROUND_SIZE} richtig · {lastRound.percent}%
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div
                    style={{
                      fontFamily: font.mono,
                      fontSize: 22,
                      fontWeight: 700,
                      color: lastRound.percent >= 70 ? C.green : lastRound.percent >= 40 ? C.yellow : C.red,
                    }}
                  >
                    {lastRound.percent}%
                  </div>
                  <button
                    className="nav-btn"
                    style={{ opacity: lastRound.entries.filter((e) => !e.isCorrect).length === 0 ? 0.4 : 1 }}
                    disabled={lastRound.entries.filter((e) => !e.isCorrect).length === 0}
                    onClick={startReviewWrong}
                  >
                    Falsche wiederholen
                  </button>
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Kerze</th>
                      <th>Frage (kurz)</th>
                      <th>Ergebnis</th>
                      <th>Punkte</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lastRound.entries.map((e, idx) => {
                      const prompt = e.question?.prompt || "";
                      return (
                        <tr key={e.nr}>
                          <td style={{ color: C.textMuted, fontFamily: font.mono, fontSize: 12 }}>{idx + 1}</td>
                          <td style={{ fontWeight: 500, fontSize: 13 }}>{e.question?.item ? displayName(e.question.item) : ""}</td>
                          <td style={{ color: C.textMuted, fontSize: 12 }}>
                            {prompt.length > 55 ? prompt.slice(0, 52) + "…" : prompt}
                          </td>
                          <td style={{ color: e.isCorrect ? C.green : C.red, fontFamily: font.mono, fontSize: 13 }}>
                            {e.isCorrect ? "✓" : "✗"}
                          </td>
                          <td style={{ fontFamily: font.mono, fontSize: 12, color: e.isCorrect ? C.green : C.textMuted }}>
                            {e.points}
                          </td>
                        </tr>
                      );
                    })}
                    <tr style={{ fontWeight: 700 }}>
                      <td colSpan={3} style={{ color: C.textMuted, paddingTop: 12 }}>
                        Gesamt
                      </td>
                      <td
                        style={{
                          paddingTop: 12,
                          color: lastRound.percent >= 70 ? C.green : lastRound.percent >= 40 ? C.yellow : C.red,
                        }}
                      >
                        {lastRound.correctCount}/{ROUND_SIZE}
                      </td>
                      <td style={{ paddingTop: 12, fontFamily: font.mono }}>{lastRound.percent}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── SEO Content Section ── */}
          <section className="card" style={{ display: "grid", gap: 18 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>
                Was sind Candlestick Muster?
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: C.textMuted }}>
                Candlestick Muster, auch <strong style={{ color: C.text }}>Kerzenmuster</strong> oder
                <strong style={{ color: C.text }}> Candlestick Patterns</strong> genannt, sind ein zentrales Werkzeug
                der technischen Analyse. Sie helfen Tradern dabei, das Verhalten von Käufern und Verkäufern im Chart
                besser zu verstehen und mögliche Trendwechsel oder Trendfortsetzungen frühzeitig zu erkennen.
              </p>
            </div>

            <div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                Warum ist ein Candlestick Quiz sinnvoll?
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: C.textMuted }}>
                Viele Trader kennen Begriffe wie <strong style={{ color: C.text }}>Hammer</strong>,
                <strong style={{ color: C.text }}> Doji</strong> oder
                <strong style={{ color: C.text }}> Shooting Star</strong>, tun sich aber schwer, diese Muster im
                echten Chart schnell zu erkennen. Ein interaktives Quiz hilft dir dabei, Kerzenmuster nicht nur
                theoretisch zu lernen, sondern sie visuell und praktisch zu trainieren.
              </p>
            </div>

            <div>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
                Für wen ist dieses Trading Quiz geeignet?
              </div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: C.textMuted }}>
                Dieses Quiz eignet sich für Anfänger, die Trading und Candlestick Muster von Grund auf lernen möchten,
                ebenso wie für fortgeschrittene Trader, die ihr Wissen auffrischen und ihre Sicherheit in der
                technischen Analyse verbessern wollen. Besonders im
                <strong style={{ color: C.text }}> Swing Trading</strong> ist das Verständnis von Kerzenmustern ein
                wertvoller Baustein für bessere Entscheidungen.
              </p>
            </div>
          </section>

          {/* ── Footer ── */}
          <footer
            style={{
              fontSize: 11,
              color: C.textDim,
              fontFamily: font.mono,
              lineHeight: 1.8,
              paddingTop: 8,
              borderTop: `1px solid ${C.border}`,
            }}
          >
            Legende: Signalstärke 1–10 · Neutral = Richtung erst durch Folgekerze · Wirkungsdauer in Tagen ·
            Strategien für konservatives Swing-Trading
          </footer>
        </div>

        <hr style={{ marginTop: "40px", opacity: 0.2 }} />

        <div style={{ fontSize: "12px", opacity: 0.7, padding: "20px" }}>
          <h3>Impressum</h3>

          <p>
            Angaben gemäß § 5 TMG:
            <br />
            Ludolf Schnittger
            <br />
            Mexikoring 15
            <br />
            22297 Hamburg
          </p>

          <p>
            Kontakt:
            <br />
            E-Mail: gaucho0@web.de
          </p>

          <p>
            Haftungsausschluss:
            <br />
            Die Inhalte dieses Candlestick Quiz dienen ausschließlich zu Lern- und Informationszwecken im Bereich
            Trading, Börse und technische Analyse. Es handelt sich ausdrücklich nicht um Anlageberatung oder eine
            Empfehlung zum Kauf oder Verkauf von Finanzinstrumenten.
          </p>

          <p>© {new Date().getFullYear()} Candlestick Quiz – Kerzenmuster lernen</p>
        </div>
      </div>
    </>
  );
}
