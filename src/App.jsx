import React, { useEffect, useMemo, useRef, useState } from "react";

// ─── Design Tokens ─────────────────────────────────────────────────────────
const DARK = {
  bg:        "#0d1117",
  surface:   "#161b22",
  surfaceHi: "#1c2333",
  border:    "#30363d",
  borderHi:  "#484f58",
  text:      "#e6edf3",
  textMuted: "#7d8590",
  textDim:   "#484f58",
  green:     "#3fb950",
  greenBg:   "#0d2216",
  greenBdr:  "#238636",
  red:       "#f85149",
  redBg:     "#2d1318",
  redBdr:    "#da3633",
  yellow:    "#e3b341",
  yellowBg:  "#2b2006",
  yellowBdr: "#9e6a03",
  blue:      "#58a6ff",
  blueBg:    "#0c1929",
  blueBdr:   "#1f6feb",
  purple:    "#bc8cff",
  accent:    "#f0b429",
};

const LIGHT = {
  bg:        "#f6f8fa",
  surface:   "#ffffff",
  surfaceHi: "#f0f2f5",
  border:    "#d0d7de",
  borderHi:  "#afb8c1",
  text:      "#1f2328",
  textMuted: "#57606a",
  textDim:   "#afb8c1",
  green:     "#1a7f37",
  greenBg:   "#dafbe1",
  greenBdr:  "#82e09a",
  red:       "#cf222e",
  redBg:     "#ffebe9",
  redBdr:    "#ff8182",
  yellow:    "#9a6700",
  yellowBg:  "#fff8c5",
  yellowBdr: "#d4a72c",
  blue:      "#0969da",
  blueBg:    "#ddf4ff",
  blueBdr:   "#54aeff",
  purple:    "#8250df",
  accent:    "#9a6700",
};

const font = {
  mono: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
  sans: "'IBM Plex Sans', 'Segoe UI', system-ui, sans-serif",
};

// C wird dynamisch gesetzt (dark/light) – wird von App.jsx gesteuert
let C = DARK;
function setThemeTokens(theme) {
  C = theme === "light" ? LIGHT : DARK;
}


// ─── Styles & Komponenten ──────────────────────────────────────────────────

// ─── Typografie-System (4 Größen, 2 Gewichte) ─────────────────────────────────
// 20px  – Seitenüberschriften        fontWeight: 600
// 15px  – Fließtext, Fragen          fontWeight: 400
// 13px  – Labels, Buttons, InfoRows  fontWeight: 400 (label: 600)
// 11px  – Meta, Monospace-Details    fontWeight: 400
//
// Farb-Bedeutung (strikt):
// Blau   → immer klickbar (aktiver Tab, Hover, Links)
// Grün   → Erfolg + primäre Aktion (CTA, richtige Antwort)
// Rot    → Fehler / Gefahr (falsche Antwort, Reset)
// Gelb   → Hinweis / Warnung (Merksätze, Review-Banner)
// Grau   → alles andere (Boxen, Hintergründe, neutrale Info)

const GlobalStyle = ({ theme }) => {
  setThemeTokens(theme);
  const c = theme === "light" ? LIGHT : DARK;
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&family=JetBrains+Mono:wght@400;500&display=swap');
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      body { background: ${c.bg}; color: ${c.text}; font-family: ${font.sans}; font-size: 15px; line-height: 1.6; }
      ::selection { background: ${c.blue}33; color: ${c.text}; }
      ::-webkit-scrollbar { width: 6px; height: 6px; }
      ::-webkit-scrollbar-track { background: ${c.bg}; }
      ::-webkit-scrollbar-thumb { background: ${c.border}; border-radius: 3px; }

      @keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
      @keyframes flashGreen { 0% { background:${c.greenBg}; } 100% { background:transparent; } }
      @keyframes flashRed   { 0% { background:${c.redBg};   } 100% { background:transparent; } }
      .flash-green { animation: flashGreen 0.4s ease forwards; }
      .flash-red   { animation: flashRed   0.4s ease forwards; }

      /* ── Antwort-Buttons ── */
      .choice-btn {
        width: 100%; padding: 11px 14px; border-radius: 6px;
        border: 1.5px solid ${c.border}; background: ${c.surface};
        color: ${c.text}; font-family: ${font.sans}; font-size: 13px;
        line-height: 1.5; text-align: left; cursor: pointer;
        transition: border-color 0.15s, background 0.15s, transform 0.1s, box-shadow 0.15s;
        display: flex; align-items: flex-start; gap: 10px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.18), 0 1px 3px rgba(0,0,0,0.12);
      }
      .choice-btn:hover:not(:disabled) { border-color: ${c.blue}; background: ${c.blueBg}; transform: translateX(2px); box-shadow: 0 4px 10px rgba(0,0,0,0.2); }
      .choice-btn:disabled { cursor: default; }
      .choice-btn.correct { border-color: ${c.greenBdr}; background: ${c.greenBg}; color: ${c.green}; }
      .choice-btn.wrong   { border-color: ${c.redBdr};   background: ${c.redBg};   color: ${c.red};   }
      .choice-btn.dimmed  { opacity: 0.35; }
      .choice-btn .badge {
        flex-shrink: 0; width: 20px; height: 20px; border-radius: 4px;
        border: 1px solid ${c.borderHi}; background: ${c.surfaceHi};
        display: flex; align-items: center; justify-content: center;
        font-family: ${font.mono}; font-size: 11px; color: ${c.textMuted}; margin-top: 1px;
      }
      .choice-btn.correct .badge { background: ${c.greenBdr}; border-color: ${c.green}; color: #fff; }
      .choice-btn.wrong   .badge { background: ${c.redBdr};   border-color: ${c.red};   color: #fff; }

      /* ── Nav-Buttons: Blau = aktiv/klickbar ── */
      .nav-btn {
        padding: 6px 13px; border-radius: 6px; border: 1.5px solid ${c.border};
        background: ${c.surface}; color: ${c.textMuted}; font-family: ${font.sans};
        font-size: 13px; font-weight: 400; cursor: pointer;
        transition: border-color 0.15s, color 0.15s, background 0.15s, box-shadow 0.15s;
        box-shadow: 0 2px 5px rgba(0,0,0,0.15);
      }
      .nav-btn:hover   { border-color: ${c.blue}; color: ${c.blue}; background: ${c.blueBg}; }
      .nav-btn.active  { border-color: ${c.blue}; color: ${c.blue}; background: ${c.blueBg}; }
      .nav-btn.primary { border-color: ${c.greenBdr}; color: ${c.green}; background: ${c.greenBg}; font-weight: 600; }
      .nav-btn.primary:hover { border-color: ${c.green}; }
      .nav-btn.danger  { border-color: ${c.redBdr}; color: ${c.red}; background: ${c.redBg}; }

      /* ── Karten ── */
      .card { background: ${c.surface}; border: 1.5px solid ${c.border}; border-radius: 10px; padding: 20px; animation: fadeIn 0.2s ease forwards; }
      .quiz-card { background: ${c.surface}; border: 1.5px solid ${c.blue}33; border-radius: 10px; padding: 20px; animation: fadeIn 0.2s ease forwards; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }

      /* ── Tags: nur für Status-Info, nicht klickbar ── */
      .tag { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 20px; font-size: 11px; font-family: ${font.mono}; letter-spacing: 0.02em; font-weight: 400; }
      .tag-green  { background: ${c.greenBg};   color: ${c.green};    border: 1px solid ${c.greenBdr}; }
      .tag-red    { background: ${c.redBg};     color: ${c.red};      border: 1px solid ${c.redBdr};   }
      .tag-gray   { background: ${c.surfaceHi}; color: ${c.textMuted}; border: 1px solid ${c.border};  }
      .tag-yellow { background: ${c.yellowBg};  color: ${c.yellow};   border: 1px solid ${c.yellowBdr}; }
      .tag-blue   { background: ${c.blueBg};    color: ${c.blue};     border: 1px solid ${c.blueBdr};  }

      /* ── Tabelle ── */
      table { border-collapse: collapse; width: 100%; }
      th, td { text-align: left; padding: 8px 12px; border-bottom: 1px solid ${c.border}; font-size: 13px; }
      th { color: ${c.textMuted}; font-weight: 400; font-family: ${font.mono}; font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em; }
      tr:last-child td { border-bottom: none; }
      tr:hover td { background: ${c.surfaceHi}; }

      /* ── Fortschritt ── */
      .progress-bar  { height: 3px; background: ${c.border}; border-radius: 2px; overflow: hidden; }
      .progress-fill { height: 100%; background: ${c.blue}; border-radius: 2px; transition: width 0.4s ease; }

      /* ── Auflösungsbox (grau, kein Blau) ── */
      .reveal-box { padding: 16px; border-radius: 8px; border: 1px solid ${c.border}; background: ${c.bg}; animation: fadeIn 0.2s ease forwards; }

      /* ── Info-Box (neutral grau statt blau) ── */
      .info-box { padding: 10px 14px; border-radius: 8px; background: ${c.surfaceHi}; border: 1px solid ${c.border}; font-size: 13px; color: ${c.textMuted}; line-height: 1.6; }

      /* ── Hinweis-Box (gelb, nur für Merksätze/Warnungen) ── */
      .hint-box { padding: 10px 14px; border-radius: 8px; background: ${c.yellowBg}; border: 1px solid ${c.yellowBdr}; font-size: 13px; color: ${c.yellow}; }

      /* ── Score-Badge ── */
      .score-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 6px; border: 1px solid ${c.border}; background: ${c.surfaceHi}; font-family: ${font.sans}; font-size: 13px; color: ${c.textMuted}; }
      .score-badge span { color: ${c.green}; font-weight: 600; }

      /* ── Flashcard ── */
      .flash-card { background: ${c.surface}; border: 1px solid ${c.border}; border-radius: 10px; padding: 16px; transition: border-color 0.2s; animation: fadeIn 0.2s ease forwards; }
      .flash-card:hover { border-color: ${c.borderHi}; }

      .divider { height: 1px; background: ${c.border}; margin: 12px 0; }
      .mono { font-family: ${font.mono}; font-size: 11px; }

      * { transition: background-color 0.2s ease, border-color 0.2s ease, color 0.15s ease; }
      button { transition: background-color 0.15s ease, border-color 0.15s ease, color 0.1s ease, transform 0.1s ease !important; }

      @media (max-width: 600px) {
        .choices-grid    { grid-template-columns: 1fr !important; }
        .flashcards-grid { grid-template-columns: 1fr !important; }
        .info-grid       { grid-template-columns: 1fr !important; }
        .hero-title      { font-size: 18px !important; }
        .header-nav      { gap: 6px !important; }
        .app-padding     { padding: 12px 12px 40px !important; }
        .cert-popup      { padding: 20px 16px !important; }
      }
    `}</style>
  );
};

// ─── Mini Candle SVG ──────────────────────────────────────────────────────────
const VIEW_WIDTH  = 28;
const VIEW_HEIGHT = 48;
const SVG_SCALE   = 0.85;

function MiniCandle({ bodyColor="#3fb950", core={top:3,bottom:1,bodyY:2,bodyH:0.5}, padding=4, wickMode="both", wickTopLenPx=null, bodyShiftPx=0, wickBottomTrimPx=0, wickJoinPx=0 }) {
  const drawable = VIEW_HEIGHT - padding * 2;
  const mapY = (v) => padding + (1 - v / 3.5) * drawable;
  const bodyH = Math.max(2, (core.bodyH / 3.5) * drawable);
  let bodyY = mapY(core.bodyY + core.bodyH) - bodyH;
  bodyY = Math.max(padding, Math.min(bodyY, VIEW_HEIGHT - padding - bodyH));
  if (bodyShiftPx) bodyY = Math.max(padding, Math.min(bodyY + bodyShiftPx, VIEW_HEIGHT - padding - bodyH));
  const bodyTopY = bodyY, bodyBottomY = bodyY + bodyH;
  let wickY1 = mapY(core.top), wickY2 = mapY(core.bottom);
  if (wickMode === "both" && wickBottomTrimPx > 0) wickY2 = Math.max(bodyBottomY, wickY2 - wickBottomTrimPx);
  if (wickMode === "top" && typeof wickTopLenPx === "number") { wickY1 = Math.max(padding, bodyTopY - wickTopLenPx); wickY2 = bodyTopY + (wickJoinPx||0); }
  else if (wickMode === "top") { wickY2 = bodyTopY + (wickJoinPx||0); }
  else if (wickMode === "bottom") { wickY1 = bodyBottomY - (wickJoinPx||0); }
  const strokeCol = bodyColor === "#3fb950" ? "#238636" : bodyColor === "#f85149" ? "#da3633" : "#484f58";
  return (
    <svg width={VIEW_WIDTH*SVG_SCALE} height={VIEW_HEIGHT*SVG_SCALE} viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}>
      {wickMode !== "none" && <line x1="14" x2="14" y1={wickY1} y2={wickY2} stroke="#484f58" strokeWidth="1.5" />}
      <rect x="8" y={bodyY} width="12" height={bodyH} fill={bodyColor} stroke={strokeCol} strokeWidth="0.5" rx="1.5" />
    </svg>
  );
}

function DragonflyDojiSVG() {
  return (
    <svg width={28*SVG_SCALE} height={48*SVG_SCALE} viewBox="0 0 28 48">
      <line x1="14" x2="14" y1="14" y2="42" stroke="#484f58" strokeWidth="1.5" />
      <line x1="9"  x2="19" y1="14" y2="14" stroke="#7d8590" strokeWidth="2.5" />
    </svg>
  );
}

function GravestoneDojiSVG({ wickTopLenPx=25 }) {
  const bodyY = 32, wickTop = Math.max(4, bodyY - wickTopLenPx);
  return (
    <svg width={28*SVG_SCALE} height={48*SVG_SCALE} viewBox="0 0 28 48">
      <line x1="14" x2="14" y1={wickTop} y2={bodyY} stroke="#484f58" strokeWidth="1.5" />
      <line x1="9"  x2="19" y1={bodyY}  y2={bodyY}  stroke="#7d8590" strokeWidth="2.5" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function displayName(candle) {
  const n = String(candle?.name||""), d = String(candle?.deName||"");
  return d && d !== n ? `${n} (${d})` : n;
}
function isNeutralTyp(typ) { return String(typ||"").toLowerCase().includes("neutral"); }
function colorTag(typ) {
  const t = String(typ||"").toLowerCase();
  if (t.includes("bullish")) return "tag-green";
  if (t.includes("bearish")) return "tag-red";
  return "tag-gray";
}

// ─── InfoRow: Label fett, Wert normal ─────────────────────────────────────────
function InfoRow({ label, value, fullWidth=false }) {
  if (!value) return null;
  return (
    <div style={{ display:"flex", gap:6, alignItems:"baseline", fontSize:13, lineHeight:1.6, gridColumn: fullWidth ? "1 / -1" : undefined }}>
      <span style={{ fontWeight:600, color:C.text, flexShrink:0, whiteSpace:"nowrap" }}>{label}:</span>
      <span style={{ color:C.textMuted }}>{value}</span>
    </div>
  );
}


// ─── Kontext-Chart Sequenzen ──────────────────────────────────────────────────
const GREEN = "#3fb950";
const RED   = "#f85149";
const GRAY  = "#7d8590";

function getChartSequence(name) {
  switch (name) {
    case "Hammer":
      return [
        { high: 110, low: 96,  open: 109, close: 98,  color: RED   },
        { high: 100, low: 88,  open: 99,  close: 90,  color: RED   },
        { high: 92,  low: 76,  open: 91,  close: 88,  color: GREEN, signal: true },
        { high: 94,  low: 86,  open: 88,  close: 93,  color: GREEN },
      ];
    case "Hanging Man":
      return [
        { high: 92,  low: 82,  open: 83,  close: 91,  color: GREEN },
        { high: 100, low: 90,  open: 91,  close: 99,  color: GREEN },
        { high: 101, low: 85,  open: 100, close: 97,  color: RED,   signal: true },
        { high: 98,  low: 88,  open: 97,  close: 89,  color: RED   },
      ];
    case "Inverted Hammer":
      return [
        { high: 112, low: 98,  open: 111, close: 100, color: RED   },
        { high: 102, low: 88,  open: 101, close: 90,  color: RED   },
        { high: 100, low: 84,  open: 86,  close: 88,  color: GREEN, signal: true },
        { high: 96,  low: 86,  open: 88,  close: 95,  color: GREEN },
      ];
    case "Shooting Star":
      return [
        { high: 94,  low: 84,  open: 85,  close: 93,  color: GREEN },
        { high: 102, low: 91,  open: 93,  close: 101, color: GREEN },
        { high: 116, low: 99,  open: 101, close: 103, color: RED,   signal: true },
        { high: 104, low: 94,  open: 103, close: 95,  color: RED   },
      ];
    case "Dragonfly Doji":
      return [
        { high: 108, low: 95,  open: 107, close: 97,  color: RED   },
        { high: 99,  low: 85,  open: 98,  close: 87,  color: RED   },
        { high: 88,  low: 74,  open: 88,  close: 88,  color: GRAY,  signal: true, doji: "dragonfly" },
        { high: 95,  low: 86,  open: 88,  close: 94,  color: GREEN },
      ];
    case "Gravestone Doji":
      return [
        { high: 95,  low: 85,  open: 86,  close: 94,  color: GREEN },
        { high: 104, low: 93,  open: 94,  close: 103, color: GREEN },
        { high: 116, low: 103, open: 103, close: 103, color: GRAY,  signal: true, doji: "gravestone" },
        { high: 104, low: 94,  open: 103, close: 95,  color: RED   },
      ];
    case "Doji":
      return [
        { high: 102, low: 92,  open: 93,  close: 101, color: GREEN },
        { high: 104, low: 94,  open: 102, close: 96,  color: RED   },
        { high: 106, low: 92,  open: 99,  close: 99,  color: GRAY,  signal: true, doji: "standard" },
      ];
    case "Spinning Top":
      return [
        { high: 104, low: 94,  open: 101, close: 97,  color: RED   },
        { high: 102, low: 92,  open: 93,  close: 100, color: GREEN },
        { high: 106, low: 90,  open: 98,  close: 100, color: GREEN, signal: true },
      ];
    case "Marubozu (grün)":
      return [
        { high: 92,  low: 84,  open: 85,  close: 91,  color: GREEN },
        { high: 100, low: 90,  open: 91,  close: 99,  color: GREEN },
        { high: 112, low: 100, open: 100, close: 112, color: GREEN, signal: true, marubozu: true },
        { high: 118, low: 110, open: 112, close: 117, color: GREEN },
      ];
    case "Marubozu (rot)":
      return [
        { high: 116, low: 106, open: 115, close: 107, color: RED   },
        { high: 108, low: 98,  open: 107, close: 99,  color: RED   },
        { high: 100, low: 88,  open: 100, close: 88,  color: RED,   signal: true, marubozu: true },
        { high: 90,  low: 78,  open: 88,  close: 80,  color: RED   },
      ];
    default:
      return null;
  }
}

// ─── Kontext-Chart ────────────────────────────────────────────────────────────
function ContextChart({ candle }) {
  if (!candle) return null;
  const seq = getChartSequence(candle.name);
  if (!seq) return null;
  const W=220, H=90, PAD_Y=8, candleW=14, gap=4;
  const startX = (W - (seq.length*candleW + (seq.length-1)*gap)) / 2;
  const allPrices = seq.flatMap(c=>[c.high,c.low]);
  const priceMin = Math.min(...allPrices);
  const priceRange = Math.max(...allPrices) - priceMin || 1;
  const toY = p => PAD_Y + (1-(p-priceMin)/priceRange)*(H-2*PAD_Y);
  const strokeCol = fill => fill==="#3fb950"?"#238636":fill==="#f85149"?"#da3633":"#6b7280";
  const markt = String(candle.markt||"").toLowerCase();
  const trendLabel = markt.includes("aufwärt") ? "↑ Aufwärtstrend" : markt.includes("abwärt") ? "↓ Abwärtstrend" : "↔ Seitwärts";
  return (
    <div style={{ marginTop:12 }}>
      <div style={{ fontSize:11, color:C.textDim, fontFamily:font.mono, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Kontext-Chart</div>
      <div style={{ background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, padding:"8px 4px 4px", display:"inline-block" }}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {seq.map((c,i) => {
            const cx=startX+i*(candleW+gap)+candleW/2, x=startX+i*(candleW+gap);
            const yHigh=toY(c.high), yLow=toY(c.low), yOpen=toY(c.open), yClose=toY(c.close);
            const yTop=Math.min(yOpen,yClose), yBot=Math.max(yOpen,yClose);
            const bodyH=Math.max(1.5,yBot-yTop);
            return (
              <g key={i}>
                {c.signal && <rect x={x-3} y={yHigh-4} width={candleW+6} height={yLow-yHigh+8} rx={3} fill={`${C.yellow}12`} stroke={C.yellow} strokeWidth="1" />}
                {!c.marubozu && <line x1={cx} x2={cx} y1={yHigh} y2={yTop}  stroke="#484f58" strokeWidth="1.5" strokeLinecap="round" />}
                {!c.marubozu && <line x1={cx} x2={cx} y1={yBot}  y2={yLow}  stroke="#484f58" strokeWidth="1.5" strokeLinecap="round" />}
                {c.doji
                  ? <line x1={x+2} x2={x+candleW-2} y1={yTop} y2={yTop} stroke="#7d8590" strokeWidth="2" strokeLinecap="round" />
                  : <rect x={x+1} y={yTop} width={candleW-2} height={bodyH} fill={c.color} stroke={strokeCol(c.color)} strokeWidth="0.5" rx="1" />
                }
              </g>
            );
          })}
        </svg>
        <div style={{ fontSize:11, color:C.textDim, fontFamily:font.mono, paddingLeft:6, paddingBottom:2 }}>{trendLabel}</div>
      </div>
    </div>
  );
}


// ─── Kerzenmuster-Daten ────────────────────────────────────────────────────
// ─── Kerzenmuster-Daten ───────────────────────────────────────────────────────
const candles = [
  {
    name: "Hammer",
    deName: "Hammer",
    merk: "Abverkauf wird gekauft – Käufer übernehmen.",
    color: "green",
    typ: "Bullish Reversal",
    markt: "Abwärtstrend",
    erklaerung: "Hammer signalisiert nach Abwärtstrend eine Abwehr der Verkäufer. Lange Lunte unten = Kaufdruck kommt zurück. Gute Bestätigung: grüne Folgekerze + Volumen.",
    psychologie: "Verkäufer in Panik, Käufer übernehmen.",
    intraday: "Zu Beginn dominieren die Verkäufer und drücken den Kurs tiefer. Im Verlauf werden die Tiefs aggressiv gekauft, der Kurs erholt sich deutlich vom Tagestief.",
    beschreibung: "Kleiner Körper, langer unterer Schatten.",
    bedeutung: "Käufer drehen den Markt – Bodenbildung.",
    bestaetigung: "Grüne Folgekerze, RSI steigt, Volumen stabil.",
    strategie: "Einstieg erst nach Bestätigung: grüne Folgekerze über dem Hammer-Hoch. Stop unter das Tief der Lunte, Ziel: nächster Widerstand oder MA20.",
    wirkung: "2–3",
    staerke: 5,
    svg: () => <svg width={24} height={41} viewBox="0 0 28 48"><line x1="14" x2="14" y1="8" y2="42" stroke="#484f58" strokeWidth="1.5"/><rect x="8" y="16" width="12" height="8" fill="#3fb950" stroke="#238636" strokeWidth="0.5" rx="1.5"/></svg>,
  },
  {
    name: "Inverted Hammer",
    deName: "Invertierter Hammer",
    merk: "Hoch wird getestet – Käufer zeigen erste Stärke.",
    color: "green",
    typ: "Bullish Reversal (schwach)",
    markt: "Abwärtstrend",
    erklaerung: "Käufer zeigen erste Stärke – intraday hochgekauft, Schluss noch tief. Mit Folgekerze bestätigen lassen.",
    psychologie: "Verkäufer verlieren Druck; Käufer testen Widerstand.",
    intraday: "Im Abwärtstrend drücken Verkäufer den Kurs zunächst tiefer. Käufer schaffen intraday eine deutliche Erholung nach oben, können das Niveau aber nicht halten.",
    beschreibung: "Kleiner Körper unten, langer oberer Schatten.",
    bedeutung: "Erste bullische Gegenwehr.",
    bestaetigung: "Grüne Folgekerze über Hoch des Inverted Hammer.",
    strategie: "Sehr konservativ: nur nach klarer grüner Bestätigungskerze über dem Hoch einsteigen. Stop unter dem Tief der Kerze.",
    wirkung: "2–3",
    staerke: 4,
    svg: () => <svg width={24} height={41} viewBox="0 0 28 48"><line x1="14" x2="14" y1="6" y2="30" stroke="#484f58" strokeWidth="1.5"/><rect x="8" y="30" width="12" height="8" fill="#3fb950" stroke="#238636" strokeWidth="0.5" rx="1.5"/></svg>,
  },
  {
    name: "Hanging Man",
    deName: "Hängender Mann",
    merk: "Abverkauf zeigt Schwäche – Käufer werden schwach.",
    color: "red",
    typ: "Bearish Reversal",
    markt: "Aufwärtstrend",
    erklaerung: "Hanging Man zeigt Schwäche im Aufwärtstrend. Lange Lunte = intraday Abverkauf. Erst mit roter Folgekerze als Top verlässlicher.",
    psychologie: "Käufer erschöpft, Smart Money verkauft in Stärke.",
    intraday: "Nach einem Aufwärtsmove treiben Käufer den Kurs zunächst höher. Im Verlauf kommt es zu einem deutlichen Abverkauf nach unten, der nur teilweise zurückgekauft wird.",
    beschreibung: "Wie Hammer, aber nach Aufwärtstrend.",
    bedeutung: "Verkäufer übernehmen – Topbildung möglich.",
    bestaetigung: "Rote Folgekerze, Volumenanstieg, RSI fällt.",
    strategie: "Swing-Trader warten auf eine rote Bestätigungskerze unterhalb des Hanging-Man-Körpers. Stop über dem Hoch, Ziel: nächster Support oder MA20.",
    wirkung: "2",
    staerke: 5,
    svg: () => <svg width={24} height={41} viewBox="0 0 28 48"><line x1="14" x2="14" y1="8" y2="42" stroke="#484f58" strokeWidth="1.5"/><rect x="8" y="12" width="12" height="8" fill="#f85149" stroke="#da3633" strokeWidth="0.5" rx="1.5"/></svg>,
  },
  {
    name: "Shooting Star",
    deName: "Sternschnuppe",
    merk: "Hoch wird verkauft – Käufer erschöpft.",
    color: "red",
    typ: "Bearish Reversal",
    markt: "Aufwärtstrend",
    erklaerung: "Aufwärtsmomentum lässt nach: Hoch ausgenutzt, danach deutlicher Abverkauf innerhalb der Kerze.",
    psychologie: "Käufer erschöpft, Smart Money verkauft in Stärke.",
    intraday: "Käufer treiben den Kurs nach oben auf ein neues Hoch. Danach übernehmen Verkäufer und drücken den Schlusskurs in die Nähe des Tagestiefs.",
    beschreibung: "Kleiner Körper unten, langer oberer Schatten.",
    bedeutung: "Topbildung – potenzielle Umkehr.",
    bestaetigung: "Rote Folgekerze unterhalb des Shooting Star mit Volumenanstieg.",
    strategie: "Short-Einstieg nach roter Bestätigungskerze unterhalb des Kerzenkörpers. Stop knapp über dem Hoch.",
    wirkung: "2–3",
    staerke: 5,
    svg: () => <svg width={24} height={41} viewBox="0 0 28 48"><line x1="14" x2="14" y1="6" y2="36" stroke="#484f58" strokeWidth="1.5"/><rect x="8" y="30" width="12" height="8" fill="#f85149" stroke="#da3633" strokeWidth="0.5" rx="1.5"/></svg>,
  },
  {
    name: "Dragonfly Doji",
    deName: "Libellen-Doji",
    merk: "Abverkauf neutralisiert – Entscheidung folgt.",
    color: "green",
    typ: "Bullish Reversal",
    markt: "Abwärtstrend",
    erklaerung: "Der Dragonfly Doji zeigt nach einem Abwärtstrend eine starke Reaktion der Käufer. Starker Rückkauf bis zum Schluss = bullische Stärke.",
    psychologie: "Verkäufer verlieren Momentum, Käufer übernehmen.",
    intraday: "Zu Beginn dominieren Verkäufer und drücken den Kurs deutlich nach unten. Im weiteren Verlauf steigen Käufer massiv ein und bringen den Schlusskurs in die Nähe des Hochs.",
    beschreibung: "Kein oder sehr kleiner Körper, langer unterer Schatten.",
    bedeutung: "Bodenbildung möglich – Käufer verteidigen Support.",
    bestaetigung: "Grüne Folgekerze über Hoch des Doji, RSI dreht nach oben.",
    strategie: "Long-Einstieg nur bei klarer bullischer Folgekerze, die das Hoch des Doji überbietet. Stop knapp unter dem Tief der Lunte.",
    wirkung: "2–3",
    staerke: 3,
    svg: () => <svg width={24} height={41} viewBox="0 0 28 48"><line x1="14" x2="14" y1="14" y2="42" stroke="#484f58" strokeWidth="1.5"/><line x1="9" x2="19" y1="14" y2="14" stroke="#7d8590" strokeWidth="2.5"/></svg>,
  },
  {
    name: "Gravestone Doji",
    deName: "Grabstein-Doji",
    merk: "Hoch wird komplett verkauft – Warnsignal.",
    color: "red",
    typ: "Bearish Reversal",
    markt: "Aufwärtstrend",
    erklaerung: "Am Ende eines Aufwärtstrends häufig: Käufer treiben den Kurs hoch, Verkäufer drücken ihn bis zum Schluss zurück – Zeichen für Erschöpfung der Bullen.",
    psychologie: "Käufer verlieren Kontrolle, Verkäufer übernehmen.",
    intraday: "Käufer eröffnen stark und treiben den Kurs deutlich nach oben. Später übernehmen Verkäufer komplett und drücken den Schlusskurs zurück zum Eröffnungsniveau.",
    beschreibung: "Kein oder sehr kleiner Körper, langer oberer Schatten.",
    bedeutung: "Topbildung – mögliche Umkehr.",
    bestaetigung: "Rote Folgekerze unterhalb des Doji, Volumenanstieg, Stochastik fällt.",
    strategie: "Short-Einstieg nach roter Bestätigungskerze, die unterhalb des Doji-Körpers schließt. Stop über dem Hoch des Doji.",
    wirkung: "2–3",
    staerke: 4,
    svg: () => <svg width={24} height={41} viewBox="0 0 28 48"><line x1="14" x2="14" y1="7" y2="32" stroke="#484f58" strokeWidth="1.5"/><line x1="9" x2="19" y1="32" y2="32" stroke="#7d8590" strokeWidth="2.5"/></svg>,
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
    intraday: "Vom Open bis zum Close dominieren Käufer die gesamte Handelsspanne. Der Kurs läuft fast nur nach oben, ohne nennenswerte Rücksetzer.",
    beschreibung: "Keine Schatten, langer grüner Körper.",
    bedeutung: "Trendfortsetzung wahrscheinlich.",
    bestaetigung: "Weitere grüne Kerze oder hohes Volumen.",
    strategie: "Warte auf eine grüne Bestätigungskerze nach dem Marubozu. Erst wenn diese schließt, long einsteigen. Stop knapp unter dem Tief des Marubozu, Ziel: nächster Widerstand.",
    wirkung: "3–5",
    staerke: 8,
    svg: () => <svg width={24} height={41} viewBox="0 0 28 48"><rect x="8" y="6" width="12" height="36" fill="#3fb950" stroke="#238636" strokeWidth="0.5" rx="1.5"/></svg>,
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
    intraday: "Vom Open bis zum Close dominieren Verkäufer den Markt. Der Kurs fällt nahezu durchgehend, es entstehen kaum Schatten.",
    beschreibung: "Keine Schatten, langer roter Körper.",
    bedeutung: "Abwärtstrend / Korrektur wahrscheinlich.",
    bestaetigung: "Weitere rote Kerze oder Volumenanstieg.",
    strategie: "Warte auf eine rote Bestätigungskerze nach dem Marubozu. Erst wenn diese schließt, short einsteigen. Stop knapp über dem Hoch des Marubozu, Ziel: nächste Unterstützungszone.",
    wirkung: "3–5",
    staerke: 8,
    svg: () => <svg width={24} height={41} viewBox="0 0 28 48"><rect x="8" y="6" width="12" height="36" fill="#f85149" stroke="#da3633" strokeWidth="0.5" rx="1.5"/></svg>,
  },
  {
    name: "Doji",
    deName: "Doji",
    merk: "Unentschlossenheit – Folgekerze entscheidet.",
    color: "gray",
    typ: "Neutral",
    markt: "Trendphase beliebig",
    erklaerung: "Unentschlossenheit: Käufer und Verkäufer gleichen sich aus – häufig Pause/Wechsel, v. a. nach starken Trends.",
    psychologie: "Gleichgewicht – niemand dominiert.",
    intraday: "Innerhalb der Kerze wechseln sich Käufe und Verkäufe ab. Der Kurs pendelt zwischen Hoch und Tief, schließt aber wieder nahe dem Eröffnungsniveau.",
    beschreibung: "Open ≈ Close, Schatten oben und unten.",
    bedeutung: "Unsicherheit oder Trendwechsel.",
    bestaetigung: "Folgekerze bestätigt Richtung.",
    strategie: "Dojis werden im konservativen Swing-Trading meist nicht direkt gehandelt. Erst die Folgekerze entscheidet.",
    wirkung: "1–2",
    staerke: null,
    svg: () => (
      <svg width={24} height={41} viewBox="0 0 28 48">
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
    erklaerung: "Gleichgewicht/Unsicherheit – Markt sammelt Kraft. Oft Vorbote einer größeren Bewegung mit steigendem Volumen.",
    psychologie: "Unentschlossenheit; Institutionelle warten.",
    intraday: "Mehrere Impulse nach oben und unten wechseln sich ab. Der kleine Kerzenkörper zeigt, dass weder Käufer noch Verkäufer sich klar durchsetzen.",
    beschreibung: "Kleiner Körper, obere & untere Schatten ähnlich lang.",
    bedeutung: "Trendpause oder Richtungsänderung möglich.",
    bestaetigung: "Bestätigung durch Folgekerze oder Volumenanstieg.",
    strategie: "Spinning Tops werden selten direkt gehandelt. Break nach oben → prozyklisch long; Break nach unten → prozyklisch short.",
    wirkung: "1–2",
    staerke: null,
    svg: () => <svg width={24} height={41} viewBox="0 0 28 48"><line x1="14" x2="14" y1="6" y2="42" stroke="#484f58" strokeWidth="1.5"/><rect x="8" y="18" width="12" height="8" fill="#7d8590" stroke="#6b7280" strokeWidth="0.5" rx="1.5"/></svg>,
  },
];


// ─── App ───────────────────────────────────────────────────────────────────
// ─── Quiz Engine ──────────────────────────────────────────────────────────────
const QUESTION_TYPES = ["name_from_description", "type_from_name", "market_from_name", "strength_from_name", "strategy_from_name"];
const ROUND_SIZE = 10;
const LABELS = ["A", "B", "C", "D"];

function pick(arr, k) {
  const a = [...arr], out = [];
  while (out.length < k && a.length) out.push(a.splice(Math.floor(Math.random() * a.length), 1)[0]);
  return out;
}

function buildQuestion() {
  for (let i = 0; i < 50; i++) {
    const qtype = pick(QUESTION_TYPES, 1)[0];
    const item  = pick(candles, 1)[0];
    if (qtype === "strength_from_name" && isNeutralTyp(item.typ)) continue;
    let prompt = "", choices = [], correct = "", renderGraphic = null;
    switch (qtype) {
      case "name_from_description":
        prompt = `Welche Kerze passt zur Beschreibung: „${item.beschreibung}" (Signal: ${item.bedeutung})?`;
        correct = item.name; choices = pick(candles.map((c) => c.name), 4);
        if (!choices.includes(correct)) choices[0] = correct;
        renderGraphic = item.svg; break;
      case "type_from_name":
        prompt = `Welches Signal gibt ${displayName(item)}?`;
        correct = item.typ; choices = pick([...new Set(candles.map((c) => c.typ))], 4);
        if (!choices.includes(correct)) choices[0] = correct;
        renderGraphic = item.svg; break;
      case "market_from_name":
        prompt = `In welchem Trend erscheint ${displayName(item)}?`;
        correct = item.markt; choices = pick([...new Set(candles.map((c) => c.markt))], 4);
        if (!choices.includes(correct)) choices[0] = correct;
        renderGraphic = item.svg; break;
      case "strength_from_name":
        prompt = `Welche Signalstärke (1–10) hat ${displayName(item)}?`;
        correct = String(item.staerke); choices = pick(["3","4","5","6","7","8","9","10"], 4);
        if (!choices.includes(correct)) choices[0] = correct;
        renderGraphic = item.svg; break;
      case "strategy_from_name":
        prompt = `Wie würdest du ${displayName(item)} als Swing-Trader handeln?`;
        correct = item.strategie;
        choices = [correct, ...pick(candles.filter((c) => c.name !== item.name).map((c) => c.strategie), 3)];
        renderGraphic = item.svg; break;
      default: break;
    }
    choices = pick(choices, choices.length);
    return { qtype, item, prompt, choices, correct, renderGraphic };
  }
  const item = candles[0];
  return { qtype: "name_from_description", item, prompt: `Welche Kerze passt zur Beschreibung: „${item.beschreibung}"?`, choices: pick(candles.map((c) => c.name), 4), correct: item.name, renderGraphic: item.svg };
}

function buildRoundQuestions(size) {
  const out = [];
  const typePool = [];
  while (typePool.length < size) typePool.push(...[...QUESTION_TYPES].sort(() => Math.random() - 0.5));
  const typeQueue = typePool.slice(0, size);
  const candleQueue = [];
  while (candleQueue.length < size * 2) candleQueue.push(...[...candles].sort(() => Math.random() - 0.5));
  let ci = 0;
  for (let tries = 0; out.length < size && tries < 1000; tries++) {
    const qtype = typeQueue[out.length];
    const item  = candleQueue[ci % candleQueue.length]; ci++;
    if (qtype === "strength_from_name" && isNeutralTyp(item.typ)) continue;
    if (out.slice(-3).map((q) => q.item?.name).includes(item.name)) continue;
    let prompt = "", choices = [], correct = "", renderGraphic = null;
    switch (qtype) {
      case "name_from_description":
        prompt = `Welche Kerze passt zur Beschreibung: „${item.beschreibung}" (Signal: ${item.bedeutung})?`;
        correct = item.name; choices = pick(candles.map((c) => c.name), 4);
        if (!choices.includes(correct)) choices[0] = correct; renderGraphic = item.svg; break;
      case "type_from_name":
        prompt = `Welches Signal gibt ${displayName(item)}?`;
        correct = item.typ; choices = pick([...new Set(candles.map((c) => c.typ))], 4);
        if (!choices.includes(correct)) choices[0] = correct; renderGraphic = item.svg; break;
      case "market_from_name":
        prompt = `In welchem Trend erscheint ${displayName(item)}?`;
        correct = item.markt; choices = pick([...new Set(candles.map((c) => c.markt))], 4);
        if (!choices.includes(correct)) choices[0] = correct; renderGraphic = item.svg; break;
      case "strength_from_name":
        prompt = `Welche Signalstärke (1–10) hat ${displayName(item)}?`;
        correct = String(item.staerke); choices = pick(["3","4","5","6","7","8","9","10"], 4);
        if (!choices.includes(correct)) choices[0] = correct; renderGraphic = item.svg; break;
      case "strategy_from_name":
        prompt = `Wie würdest du ${displayName(item)} als Swing-Trader handeln?`;
        correct = item.strategie;
        choices = [correct, ...pick(candles.filter((c) => c.name !== item.name).map((c) => c.strategie), 3)];
        renderGraphic = item.svg; break;
      default: break;
    }
    choices = pick(choices, choices.length);
    out.push({ qtype, item, prompt, choices, correct, renderGraphic });
  }
  while (out.length < size) out.push(buildQuestion());
  return out;
}

// ─── Gamification ─────────────────────────────────────────────────────────────
const FEEDBACK_CORRECT = ["✓ Stark! Genau erkannt.", "✓ Perfekt – du kennst deine Muster.", "✓ Sehr gut! Das sitzt.", "✓ Richtig! Trading-Instinkt bestätigt.", "✓ Exzellent – weiter so!"];
const FEEDBACK_WRONG   = ["✗ Knapp daneben – schau dir die Erklärung an.", "✗ Nicht ganz – das Muster ist tückisch.", "✗ Falsch, aber du lernst daraus.", "✗ Fast – lies die Details nochmal durch.", "✗ Noch nicht – Wiederholung macht den Meister."];
const randomFeedback = (ok) => { const a = ok ? FEEDBACK_CORRECT : FEEDBACK_WRONG; return a[Math.floor(Math.random() * a.length)]; };

function FaqItem({ question, answer }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div style={{ borderBottom: `1px solid ${C.border}` }}>
      <button onClick={() => setOpen(o => !o)} style={{ width:"100%", padding:"14px 0", display:"flex", justifyContent:"space-between", alignItems:"center", background:"none", border:"none", cursor:"pointer", color:C.text, fontSize:15, fontWeight:600, textAlign:"left", gap:12, boxShadow:"none" }}>
        <span>{question}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" style={{ flexShrink:0, transform:open?"rotate(180deg)":"rotate(0deg)", transition:"transform 0.2s" }}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open && <div style={{ fontSize:14, color:C.textMuted, lineHeight:1.7, paddingBottom:14, paddingRight:28 }}>{answer}</div>}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("cq_theme") || "light");
  setThemeTokens(theme);

  const [mode,         setMode]         = useState("quiz");
  const [answer,       setAnswer]       = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [score,        setScore]        = useState(() => Number(localStorage.getItem("cq_score") || 0));
  const [history,      setHistory]      = useState(() => { try { return JSON.parse(localStorage.getItem("cq_history") || "[]"); } catch { return []; } });
  const [lastRound,    setLastRound]    = useState(null);
  const [reviewMode,   setReviewMode]   = useState(false);
  const [reviewQueue,  setReviewQueue]  = useState([]);
  const [reviewIndex,  setReviewIndex]  = useState(0);
  const [round,        setRound]        = useState(() => ({ queue: buildRoundQuestions(ROUND_SIZE), index: 0 }));
  const [flash,        setFlash]        = useState(null);
  const [showResetConfirm,  setShowResetConfirm]  = useState(false);
  const [showReviewDone,    setShowReviewDone]    = useState(false);
  const [showCertificate,   setShowCertificate]   = useState(false);
  const [showFeedbackForm,  setShowFeedbackForm]  = useState(false);
  const [certEmail,     setCertEmail]     = useState("");
  const [certFirstName, setCertFirstName] = useState("");
  const [certLastName,  setCertLastName]  = useState("");
  const [certBirthdate, setCertBirthdate] = useState("");
  const [certPlz,       setCertPlz]       = useState("");
  const [certPrivacy,   setCertPrivacy]   = useState(false);
  const [certSent,      setCertSent]      = useState(false);
  const [certLevel,     setCertLevel]     = useState(null);
  const [roundStats,    setRoundStats]    = useState(() => { try { return JSON.parse(localStorage.getItem("cq_round_stats") || '{"rounds":[],"bronzeDone":false,"silberDone":false,"goldDone":false}'); } catch { return {rounds:[],bronzeDone:false,silberDone:false,goldDone:false}; } });
  const [isFirstVisit]                    = useState(() => !localStorage.getItem("cq_visited"));

  const flashRef = useRef(null);

  useEffect(() => () => { if (flashRef.current) clearTimeout(flashRef.current); }, []);
  useEffect(() => { localStorage.setItem("cq_visited", "1"); }, []);
  useEffect(() => {
    const f=[{q:"Was sind Candlestick Muster?",a:"Candlestick Muster sind grafische Darstellungen von Kursbewegungen. Bekannte Patterns wie Hammer, Doji oder Shooting Star helfen Tradern mögliche Trendwechsel zu erkennen."},{q:"Was sind Candlestick Patterns?",a:"Candlestick Patterns ist die englische Bezeichnung für Kerzenmuster wie Hammer, Shooting Star, Doji, Marubozu, Hanging Man, Dragonfly Doji und Gravestone Doji."},{q:"Was ist eine Flashcard?",a:"Eine Flashcard ist eine Karteikarte – eine bewährte Lernmethode. Im Candlestick Quiz zeigt jede Flashcard ein Kerzenmuster mit Beschreibung, Signal und Strategie."},{q:"Ist das Candlestick Quiz kostenlos?",a:"Ja, vollständig kostenlos und ohne Anmeldung nutzbar."},{q:"Gibt es ein Zertifikat?",a:"Ja! Bronze (70%+), Silber (80%+ in 3 Runden), Gold (90%+ in 5 Runden) – kostenlos per E-Mail."},{q:"Für wen ist das Quiz?",a:"Für Einsteiger die Trading lernen möchten und Fortgeschrittene die Candlestick Patterns auffrischen wollen."},{q:"Wie viele Candlestick Muster?",a:"10 Candlestick Muster: Hammer, Inverted Hammer, Hanging Man, Shooting Star, Dragonfly Doji, Gravestone Doji, Marubozu grün/rot, Doji und Spinning Top."},{q:"Unterschied Hammer und Hanging Man?",a:"Beide sehen identisch aus. Hammer nach Abwärtstrend bullisch, Hanging Man nach Aufwärtstrend bärisch."},{q:"Wie wird ein Candlestick Pattern bestätigt?",a:"Durch die Folgekerze die die Richtung bestätigt. RSI und Volumen helfen zusätzlich."}];
    const s=document.createElement("script");s.id="faq-schema";s.type="application/ld+json";
    s.textContent=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage","mainEntity":f.map(({q,a})=>({"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}}))});
    const e=document.getElementById("faq-schema");if(e)e.remove();
    document.head.appendChild(s);
    return()=>{const x=document.getElementById("faq-schema");if(x)x.remove();};
  }, []);

  useEffect(() => { localStorage.setItem("cq_theme",   theme); }, [theme]);
  useEffect(() => { localStorage.setItem("cq_score",   String(score)); }, [score]);

  const inReview        = reviewMode && reviewQueue.length > 0;
  const answeredCurrent = answer !== null;
  const q               = inReview ? reviewQueue[reviewIndex] : round.queue[round.index];
  const isNeutralNow    = isNeutralTyp(q?.item?.typ);
  const currentWasCorrect = answeredCurrent ? answer === q.correct : null;

  const progress = useMemo(() => {
    if (inReview) return 0;
    const mod = history.length % ROUND_SIZE;
    if (history.length > 0 && mod === 0) return 100;
    return mod * (100 / ROUND_SIZE);
  }, [history.length, inReview]);

  const curNum  = inReview ? reviewIndex + 1 : round.index + 1;
  const totalNum = inReview ? reviewQueue.length : ROUND_SIZE;

  function next() {
    setAnswer(null); setFlash(null); setFeedbackText("");
    if (inReview) { setReviewIndex((i) => (i + 1) % reviewQueue.length); return; }
    setRound((prev) => {
      const ni = prev.index + 1;
      return ni >= prev.queue.length ? { queue: buildRoundQuestions(ROUND_SIZE), index: 0 } : { ...prev, index: ni };
    });
  }

  function check(a) {
    if (answer !== null) return;
    const isCorrect = a === q.correct;
    setAnswer(a); setFeedbackText(randomFeedback(isCorrect));
    if (isCorrect) setScore((s) => s + 1);
    setFlash(isCorrect ? "correct" : "wrong");
    if (flashRef.current) clearTimeout(flashRef.current);
    flashRef.current = setTimeout(() => setFlash(null), 400);
    if (!inReview) {
      setHistory((prev) => {
        const nr = prev.length + 1;
        const entry = { nr, question: q, given: a, isCorrect, points: isCorrect ? 10 : 0 };
        const updated = [...prev, entry];
        localStorage.setItem("cq_history", JSON.stringify(updated.slice(-30)));
        if (nr % ROUND_SIZE === 0) {
          const roundEntries = updated.slice(nr - ROUND_SIZE, nr);
          const cc = roundEntries.filter((r) => r.isCorrect).length;
          const pct = Math.round((cc / ROUND_SIZE) * 100);
          setLastRound({ entries: roundEntries, correctCount: cc, percent: pct });
          setRoundStats(prev => {
            const rs=[...prev.rounds,pct],s={...prev,rounds:rs};
            if(!prev.goldDone&&rs.filter(p=>p>=90).length>=5){s.goldDone=true;setCertLevel("gold");setShowCertificate(true);}
            else if(!prev.silberDone&&rs.filter(p=>p>=80).length>=3){s.silberDone=true;setCertLevel("silber");setShowCertificate(true);}
            else if(!prev.bronzeDone&&rs.filter(p=>p>=70).length>=1){s.bronzeDone=true;setCertLevel("bronze");setShowCertificate(true);}
            localStorage.setItem("cq_round_stats",JSON.stringify(s));return s;
          });
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
    setReviewIndex(0); setReviewMode(true); setAnswer(null); setFlash(null);
  }

  function stopReview() {
    setReviewMode(false); setReviewQueue([]); setReviewIndex(0);
    setRound({ queue: buildRoundQuestions(ROUND_SIZE), index: 0 });
    setAnswer(null); setFlash(null); setFeedbackText(""); setShowReviewDone(true);
  }

  function resetAll() {
    setScore(0); setHistory([]); setLastRound(null);
    setReviewMode(false); setReviewQueue([]); setReviewIndex(0);
    setRound({ queue: buildRoundQuestions(ROUND_SIZE), index: 0 });
    setAnswer(null); setFlash(null); setFeedbackText("");
    localStorage.removeItem("cq_score"); localStorage.removeItem("cq_history");
    localStorage.removeItem("cq_round_stats");
    setRoundStats({rounds:[],bronzeDone:false,silberDone:false,goldDone:false});
    setCertLevel(null);
  }

  const inputStyle = {
    padding: "10px 14px", borderRadius: 6, fontSize: 13,
    border: `1px solid ${C.border}`, background: C.surfaceHi,
    color: C.text, outline: "none", width: "100%",
  };

  return (
    <>
      <GlobalStyle theme={theme} />
      <div className="app-padding" style={{ minHeight: "100vh", background: C.bg, color: C.text, padding: "20px 20px 48px", fontFamily: font.sans }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gap: 16 }}>

          {/* ── Header ── */}
          <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", paddingBottom: 16, borderBottom: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={{ display: "flex", gap: 3 }}>
                    {[...Array(3)].map((_, j) => (
                      <div key={j} style={{ width: 3, height: i === 1 ? 10 : i === 0 ? 6 : 14, background: i === 2 && j === 1 ? C.red : i === 0 && j === 1 ? C.green : C.border, borderRadius: 1 }} />
                    ))}
                  </div>
                ))}
              </div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1 }}>Candlestick Quiz</div>
                <div style={{ fontSize: 11, color: C.textMuted, fontFamily: font.mono, marginTop: 3 }}>Swing-Trading · {candles.length} Muster</div>
              </div>
            </div>
            <div className="header-nav" style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
              <div className="score-badge">Punkte <span>{score}</span></div>
              <div style={{ width: 1, height: 24, background: C.border }} />
              <button className="nav-btn" onClick={() => setTheme((t) => t === "dark" ? "light" : "dark")} title={theme === "dark" ? "Zu hellem Design wechseln" : "Zu dunklem Design wechseln"} style={{ fontSize: 15, padding: "5px 10px" }}>
                {theme === "dark" ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg> : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
              </button>
              <div style={{ width: 1, height: 24, background: C.border }} />
              <button className={`nav-btn${mode === "quiz"  ? " active" : ""}`} onClick={() => setMode("quiz")} title="Quiz: Beantworte 10 Fragen zu Candlestick Mustern">Quiz</button>
              <button className={`nav-btn${mode === "flash" ? " active" : ""}`} onClick={() => setMode("flash")} title="Flashcards: Alle 10 Muster auf einen Blick">Flashcards</button>
              <button className="nav-btn" onClick={() => setShowResetConfirm(true)} title="Quiz zurücksetzen – Punkte und Verlauf löschen">Reset</button>
              {inReview && <button className="nav-btn danger" onClick={stopReview}>Review ✕</button>}
            </div>
          </header>

          {/* ── Hero – nur beim ersten Besuch ── */}
          <section style={{ display: isFirstVisit ? "grid" : "none", gap: 20, padding: "24px 0 8px" }} aria-hidden={!isFirstVisit}>
              <div style={{ display: "grid", gap: 10 }}>
                <h1 className="hero-title" style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.2, color: C.text, margin: 0 }}>Candlestick Quiz – Kerzenmuster verstehen und Trading lernen</h1>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: C.textMuted, margin: 0 }}>Lerne die wichtigsten Candlestick Muster wie Hammer, Doji, Shooting Star und Marubozu interaktiv kennen. Verbessere deine Chartanalyse und dein Wissen im Swing Trading.</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 6 }}>
                  {["10 Kerzenmuster mit Kontext-Chart und Strategie","Für Anfänger und Fortgeschrittene geeignet","Kostenlos – ohne Anmeldung sofort starten"].map(t=>(
                    <li key={t} style={{ fontSize: 14, color: C.textMuted, display: "flex", gap: 8 }}><span style={{ color: C.green, flexShrink: 0 }}>✓</span><span>{t}</span></li>
                  ))}
                </ul>
              </div>
              <div>
                <button onClick={() => { setMode("quiz"); setTimeout(() => document.getElementById("quiz-anchor")?.scrollIntoView({ behavior: "smooth" }), 50); }}
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 24px", borderRadius: 8, background: C.green, color: "#fff", fontWeight: 600, fontSize: 15, border: "none", cursor: "pointer", transition: "opacity 0.15s, transform 0.15s" }}
                  onMouseEnter={e=>{e.currentTarget.style.opacity="0.85";e.currentTarget.style.transform="translateY(-2px)";}}
                  onMouseLeave={e=>{e.currentTarget.style.opacity="1";e.currentTarget.style.transform="translateY(0)";}}>
                  Quiz jetzt starten →
                </button>
              </div>
            </section>

          {/* ── Progress ── */}
          {mode === "quiz" && !inReview && (
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div className="progress-bar" style={{ flex: 1 }}>
                <div className="progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <div style={{ fontSize: 11, color: C.textMuted, fontFamily: font.mono, flexShrink: 0, whiteSpace: "nowrap" }}>
                Frage {curNum} von {totalNum}
              </div>
            </div>
          )}

          {/* ── Review Banner ── */}
          {inReview && (
            <div style={{ padding: "10px 16px", borderRadius: 8, background: C.yellowBg, border: `1px solid ${C.yellowBdr}`, fontSize: 13, color: C.yellow, display: "flex", alignItems: "center", gap: 10 }}>
              <span>⟳</span> Review-Modus — falsche Fragen ({reviewIndex + 1}/{reviewQueue.length})
            </div>
          )}

          {/* ── Quiz ── */}
          {mode === "quiz" && !inReview && (
            <div style={{ display:"flex", gap:8, flexWrap:"wrap", background:C.surfaceHi, borderRadius:10, padding:"12px", border:`1px solid ${C.border}` }}>
              {[{key:"bronze",label:"🥉 Bronze",desc:"70%+ in 1 Runde",done:roundStats.bronzeDone,count:roundStats.rounds.filter(p=>p>=70).length,need:1},{key:"silber",label:"🥈 Silber",desc:"80%+ in 3 Runden",done:roundStats.silberDone,count:roundStats.rounds.filter(p=>p>=80).length,need:3},{key:"gold",label:"🥇 Gold",desc:"90%+ in 5 Runden",done:roundStats.goldDone,count:roundStats.rounds.filter(p=>p>=90).length,need:5}].map(({key,label,desc,done,count,need})=>(
                <div key={key} style={{flex:1,minWidth:140,padding:"10px 14px",borderRadius:8,border:`1px solid ${done?C.greenBdr:C.border}`,background:done?C.greenBg:C.surfaceHi,display:"flex",flexDirection:"column",gap:4}}>
                  <div style={{fontSize:13,fontWeight:600,color:done?C.green:C.text}}>{label}</div>
                  <div style={{fontSize:11,color:C.textMuted}}>{desc}</div>
                  <div style={{height:4,background:C.border,borderRadius:2,overflow:"hidden",marginTop:2}}><div style={{height:"100%",width:`${Math.min(100,(count/need)*100)}%`,background:done?C.green:C.blue,borderRadius:2,transition:"width 0.4s"}}/></div>
                  <div style={{fontSize:11,color:C.textMuted,fontFamily:"monospace"}}>{done?"✓ Erreicht!":`${count} / ${need}`}</div>
                </div>
              ))}
            </div>
          )}
          <div id="quiz-anchor" />
          {mode === "quiz" && q && (
            <div className={`quiz-card${flash === "correct" ? " flash-green" : flash === "wrong" ? " flash-red" : ""}`}>
              <div style={{ display: "grid", gap: 20 }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
                  <div style={{ flexShrink: 0, background: C.surfaceHi, borderRadius: 8, padding: "10px 8px", border: `1px solid ${C.border}` }} role="img" aria-label={`Candlestick Pattern: ${q.item?.name || ""}`}>
                    {q.renderGraphic && <q.renderGraphic />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10, flexWrap: "wrap" }}>
                      <span style={{ fontFamily: font.mono, fontSize: 11, color: C.textDim }}>FRAGE {curNum}/{totalNum}</span>
                      <span className={`tag ${colorTag(q.item?.typ)}`}>{q.item?.typ}</span>
                    </div>
                    <p style={{ fontSize: 16, lineHeight: 1.6, color: C.text, fontWeight: 600 }}>{q.prompt}</p>
                  </div>
                </div>

                <div className="choices-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                  {q.choices.map((c, idx) => {
                    const chosen = answer === c, correct = q.correct === c;
                    let cls = "choice-btn";
                    if (answer) { if (correct) cls += " correct"; else if (chosen) cls += " wrong"; else cls += " dimmed"; }
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
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: currentWasCorrect ? C.green : C.red }}>{feedbackText}</div>
                      <button className="nav-btn primary" onClick={next} style={{ flexShrink: 0 }}>Nächste Frage →</button>
                    </div>
                    <div style={{ fontSize: 13, color: C.textMuted, marginBottom: 14 }}>
                      Korrekte Antwort: <span style={{ color: C.text, fontWeight: 600 }}>{q.correct}</span>
                    </div>
                    <div style={{ display: "grid", gap: 8, marginBottom: 14 }}>
                      {q.item.merk && (
                        <div style={{ padding: "10px 14px", borderRadius: 6, background: `${C.yellow}0a`, border: `1px solid ${C.yellowBdr}`, fontSize: 13, color: C.yellow }}>
                          💡 {q.item.merk}
                        </div>
                      )}
                      <div className="info-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px" }}>
                        <InfoRow label="Typ"           value={q.item.typ} />
                        <InfoRow label="Markt"         value={q.item.markt} />
                        <InfoRow label="Signalstärke"  value={isNeutralNow ? "— (neutral)" : `${q.item.staerke} / 10`} />
                        <InfoRow label="Wirkungsdauer" value={`${q.item.wirkung} Tage`} />
                        <InfoRow label="Bestätigung"   value={q.item.bestaetigung} fullWidth />
                        <InfoRow label="Psychologie"   value={q.item.psychologie}  fullWidth />
                        <InfoRow label="Strategie"     value={q.item.strategie}    fullWidth />
                      </div>
                    </div>
                    <ContextChart candle={q.item} />
                    {q.item.erklaerung && (
                      <div className="info-box" style={{ marginTop: 12, padding: "10px 14px", borderRadius: 6, lineHeight: 1.6 }}>
                        <span style={{ color: C.textMuted, fontWeight: 600 }}>Erklärung: </span>{q.item.erklaerung}
                      </div>
                    )}
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: 11, color: C.textDim, fontFamily: font.mono }}>{history.length} Fragen beantwortet · {score} Punkte</div>
                  {answer && <button className="nav-btn primary" onClick={next}>Nächste Frage →</button>}
                </div>
              </div>
            </div>
          )}

          {/* ── Flashcards ── */}
          {mode === "flash" && (
            <>
              <div className="info-box" style={{ padding: "10px 16px", borderRadius: 8 }}>
                📚 <strong style={{ color: C.text }}>Alle {candles.length} Muster auf einen Blick</strong> – ideal zur Wiederholung vor dem Quiz.
              </div>
              <div className="flashcards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
                {candles.map((c, i) => (
                  <div key={i} className="flash-card">
                    <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 12 }}>
                      <div style={{ flexShrink: 0, background: C.surfaceHi, borderRadius: 8, padding: "8px 6px", border: `1px solid ${C.border}` }} role="img" aria-label={`Candlestick Pattern: ${c.name}`}>
                        {c.svg && <c.svg />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 0 }}>{displayName(c)}</div>
                        {c.merk && <div style={{ fontSize: 13, color: C.yellow, lineHeight: 1.5 }}>{c.merk}</div>}
                        <div style={{ marginTop: 6, display: "flex", gap: 6, flexWrap: "wrap" }}>
                          <span className={`tag ${colorTag(c.typ)}`}>{c.typ}</span>
                          <span className="tag tag-gray">{isNeutralTyp(c.typ) ? "— neutral" : `★ ${c.staerke}/10`}</span>
                        </div>
                      </div>
                    </div>
                    <div className="divider" />
                    <div style={{ display: "grid", gap: 8 }}>
                      <InfoRow label="Markt"        value={c.markt}        fontSize={13} />
                      <InfoRow label="Beschreibung" value={c.beschreibung} fontSize={13} />
                      <InfoRow label="Bedeutung"    value={c.bedeutung}    fontSize={13} />
                      <InfoRow label="Bestätigung"  value={c.bestaetigung} fontSize={13} />
                      <InfoRow label="Psychologie"  value={c.psychologie}  fontSize={13} />
                      <InfoRow label="Strategie"    value={c.strategie}    fontSize={13} />
                    </div>
                    <ContextChart candle={c} />
                    {c.erklaerung && (
                      <div className="info-box" style={{ marginTop: 10, padding: "8px 12px", borderRadius: 6, lineHeight: 1.5 }}>
                        <span style={{ color: C.textMuted, fontWeight: 600 }}>Erklärung: </span>{c.erklaerung}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── Review Done ── */}
          {showReviewDone && mode === "quiz" && (
            <div className="card" style={{ border: `1px solid ${C.greenBdr}`, background: C.greenBg }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }}>
                <div style={{ fontSize: 20 }}>🏆</div>
                <div style={{ fontWeight: 600, fontSize: 15, color: C.green }}>Stark – du hast deine Fehler verbessert!</div>
                <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.6 }}>
                  Möchtest du den Test erneut machen und dir die Chance auf ein <strong style={{ color: C.text }}>Zertifikat</strong> sichern?
                </p>
                <button className="nav-btn primary" onClick={() => { setShowReviewDone(false); resetAll(); }}>Test neu starten →</button>
              </div>
            </div>
          )}

          {/* ── Rundenübersicht ── */}
          {lastRound && mode === "quiz" && (
            <div className="card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 15 }}>Rundenübersicht</div>
                  <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{lastRound.correctCount}/{ROUND_SIZE} richtig · {lastRound.percent}%</div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <div style={{ fontFamily: font.mono, fontSize: 20, fontWeight: 600, color: lastRound.percent >= 70 ? C.green : lastRound.percent >= 40 ? C.yellow : C.red }}>
                    {lastRound.percent}%
                  </div>
                  <button className="nav-btn" style={{ opacity: lastRound.entries.filter((e) => !e.isCorrect).length === 0 ? 0.4 : 1 }} disabled={lastRound.entries.filter((e) => !e.isCorrect).length === 0} onClick={startReviewWrong}>
                    Falsche wiederholen
                  </button>
                </div>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead><tr><th>#</th><th>Kerze</th><th>Frage (kurz)</th><th>Ergebnis</th><th>Punkte</th></tr></thead>
                  <tbody>
                    {lastRound.entries.map((e, idx) => {
                      const prompt = e.question?.prompt || "";
                      return (
                        <tr key={e.nr}>
                          <td style={{ color: C.textMuted, fontFamily: font.mono, fontSize: 11 }}>{idx + 1}</td>
                          <td style={{ fontWeight: 400, fontSize: 13 }}>{e.question?.item ? displayName(e.question.item) : ""}</td>
                          <td style={{ color: C.textMuted, fontSize: 11 }}>{prompt.length > 55 ? prompt.slice(0, 52) + "…" : prompt}</td>
                          <td style={{ color: e.isCorrect ? C.green : C.red, fontFamily: font.mono, fontSize: 13 }}>{e.isCorrect ? "✓" : "✗"}</td>
                          <td style={{ fontFamily: font.mono, fontSize: 11, color: e.isCorrect ? C.green : C.textMuted }}>{e.points}</td>
                        </tr>
                      );
                    })}
                    <tr style={{ fontWeight: 600 }}>
                      <td colSpan={3} style={{ color: C.textMuted, paddingTop: 12 }}>Gesamt</td>
                      <td style={{ paddingTop: 12, color: lastRound.percent >= 70 ? C.green : lastRound.percent >= 40 ? C.yellow : C.red }}>{lastRound.correctCount}/{ROUND_SIZE}</td>
                      <td style={{ paddingTop: 12, fontFamily: font.mono }}>{lastRound.percent}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── SEO Content ── */}
          <section style={{ display: "grid", gap: 18, background: C.surfaceHi, borderRadius: 10, padding: 20, border: `1px solid ${C.border}` }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 10 }}>Was sind Candlestick Muster?</div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: C.textMuted }}>
                Candlestick Muster, auch <strong style={{ color: C.text }}>Kerzenmuster</strong> genannt, sind ein zentrales Werkzeug der technischen Analyse. Sie helfen Tradern dabei, das Verhalten von Käufern und Verkäufern im Chart besser zu verstehen und mögliche Trendwechsel frühzeitig zu erkennen.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Warum ist ein Candlestick Quiz sinnvoll?</div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: C.textMuted }}>
                Viele Trader kennen Begriffe wie <strong style={{ color: C.text }}>Hammer</strong>, <strong style={{ color: C.text }}>Doji</strong> oder <strong style={{ color: C.text }}>Shooting Star</strong>, tun sich aber schwer, diese Muster im echten Chart schnell zu erkennen. Ein interaktives Quiz hilft dir dabei, Kerzenmuster nicht nur theoretisch zu lernen, sondern sie visuell zu trainieren.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Für wen ist dieses Trading Quiz geeignet?</div>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: C.textMuted }}>
                Dieses Quiz eignet sich für Anfänger die Trading von Grund auf lernen möchten, ebenso wie für fortgeschrittene Trader die ihr Wissen auffrischen wollen. Besonders im <strong style={{ color: C.text }}>Swing Trading</strong> ist das Verständnis von Kerzenmustern ein wertvoller Baustein.
              </p>
            </div>
          </section>


          {/* ── Bewertung + FAQ grau ── */}
          <div style={{ background: C.surfaceHi, borderRadius: 10, padding: "16px", border: `1px solid ${C.border}`, display:"grid", gap:14 }}>
          <div style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderRadius:8, background:C.surfaceHi, border:`1px solid ${C.border}` }}>
            <div style={{ display:"flex", gap:2 }}>{[1,2,3,4,5].map(i=><svg key={i} width="18" height="18" viewBox="0 0 24 24" fill="#e3b341" stroke="#e3b341" strokeWidth="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)}</div>
            <div><span style={{ fontSize:15, fontWeight:600, color:C.text }}>4.9 / 5</span><span style={{ fontSize:13, color:C.textMuted, marginLeft:8 }}>Nutzerfeedback · Kostenlos</span></div>
          </div>

          {/* ── FAQ ── */}
          <section style={{ display:"grid", gap:0 }}>
            <div style={{ fontSize:20, fontWeight:600, marginBottom:16 }}>Häufige Fragen zu Candlestick Mustern und Patterns</div>
            {[{q:"Was sind Candlestick Muster?",a:"Candlestick Muster (auch Kerzenmuster genannt) sind grafische Darstellungen von Kursbewegungen in einem bestimmten Zeitraum. Jede Kerze zeigt Eröffnungs-, Schluss-, Hoch- und Tiefstkurs. Bekannte Candlestick Patterns wie Hammer, Doji oder Shooting Star helfen Tradern dabei, mögliche Trendwechsel frühzeitig zu erkennen."},{q:"Was sind Candlestick Patterns auf Englisch?",a:"Candlestick Patterns sind die englische Bezeichnung für Kerzenmuster. Im Swing-Trading und in der technischen Analyse werden Begriffe wie Hammer, Shooting Star, Doji, Marubozu, Hanging Man, Dragonfly Doji, Gravestone Doji und Spinning Top international verwendet."},{q:"Was ist eine Flashcard?",a:"Eine Flashcard (Karteikarte) ist eine bewährte Lernmethode. Im Candlestick Quiz zeigt jede Flashcard ein Kerzenmuster mit Beschreibung, Signal, Bestätigung und Strategie – ideal um Candlestick Patterns schnell zu lernen und zu wiederholen."},{q:"Ist das Candlestick Quiz kostenlos?",a:"Ja, das Candlestick Quiz ist vollständig kostenlos und ohne Anmeldung nutzbar – auf Desktop und Mobilgeräten. Es fallen keine versteckten Kosten an."},{q:"Gibt es ein Zertifikat?",a:"Ja! Du kannst drei kostenlose Zertifikate erreichen: 🥉 Bronze (70%+ in 1 Runde), 🥈 Silber (80%+ in 3 Runden), 🥇 Gold (90%+ in 5 Runden). Das Zertifikat wird kostenlos per E-Mail zugeschickt."},{q:"Für wen ist dieses Quiz geeignet?",a:"Das Candlestick Quiz richtet sich an Einsteiger die Trading und Kerzenmuster von Grund auf lernen möchten, sowie an fortgeschrittene Trader die ihr Wissen zu Candlestick Patterns auffrischen und festigen wollen."},{q:"Wie viele Candlestick Muster sind enthalten?",a:"Das Quiz enthält 10 wichtige Candlestick Muster: Hammer, Inverted Hammer, Hanging Man, Shooting Star, Dragonfly Doji, Gravestone Doji, Marubozu (grün), Marubozu (rot), Doji und Spinning Top."},{q:"Unterschied Hammer und Hanging Man Candlestick?",a:"Beide Candlestick Muster sehen identisch aus – kleiner Körper oben, lange Lunte unten. Der Unterschied liegt im Kontext: Hammer erscheint nach Abwärtstrend (bullisches Signal), Hanging Man nach Aufwärtstrend (bärisches Signal)."},{q:"Wie wird ein Candlestick Muster bestätigt?",a:"Ein Candlestick Pattern gilt erst als bestätigt wenn die Folgekerze die erwartete Richtung bestätigt. Beim Hammer zum Beispiel eine grüne Kerze über dem Hammer-Hoch. RSI und Volumen helfen zusätzlich zur Bestätigung."}].map(({q,a},i)=><FaqItem key={i} question={q} answer={a}/>)}
          </section>

          </div>

          {/* ── Fehler melden ── */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="nav-btn" onClick={() => setShowFeedbackForm((v) => !v)} style={{ fontSize: 11 }}>⚑ Fehler melden</button>
          </div>
          {showFeedbackForm && (
            <div className="card" style={{ border: `1px solid ${C.border}` }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 12 }}>Fehler melden</div>
              <p style={{ fontSize: 13, color: C.textMuted, marginBottom: 14, lineHeight: 1.6 }}>Hast du einen Fehler entdeckt? Schreib mir kurz – ich freue mich über jedes Feedback.</p>
              <a href="mailto:gaucho0@web.de?subject=Fehler%20im%20Candlestick%20Quiz&body=Hallo%2C%0A%0Aich%20habe%20folgenden%20Fehler%20gefunden%3A%0A%0A"
                style={{ display: "inline-block", padding: "9px 18px", borderRadius: 6, background: C.surfaceHi, border: `1px solid ${C.border}`, color: C.text, fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
                ✉ E-Mail schreiben
              </a>
            </div>
          )}

          {/* ── Footer ── */}
          <footer style={{ fontSize: 11, color: C.textDim, fontFamily: font.mono, lineHeight: 1.8, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
            Legende: Signalstärke 1–10 · Neutral = Richtung erst durch Folgekerze · Wirkungsdauer in Tagen · Strategien für konservatives Swing-Trading
          </footer>
        </div>

        {/* ── Impressum ── */}
        <hr style={{ marginTop: "40px", opacity: 0.2 }} />
        <div style={{ fontSize: "11px", opacity: 0.7, padding: "20px" }}>
          <h3>Impressum</h3>
          <p>Angaben gemäß § 5 TMG:<br />Ludolf Schnittger<br />Mexikoring 15<br />22297 Hamburg</p>
          <p>Kontakt:<br />E-Mail: gaucho0@web.de</p>
          <p>Haftungsausschluss:<br />Die Inhalte dieses Candlestick Quiz dienen ausschließlich zu Lern- und Informationszwecken. Es handelt sich ausdrücklich nicht um Anlageberatung.</p>
          <p>© {new Date().getFullYear()} Candlestick Quiz – Kerzenmuster lernen</p>
        </div>

        {/* ── Reset Bestätigung ── */}
        {showResetConfirm && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 20 }}>
            <div style={{ background: C.surface, border: `1px solid ${C.redBdr}`, borderRadius: 12, padding: 24, maxWidth: 360, width: "100%", display: "grid", gap: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>Alles zurücksetzen?</div>
              <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.6 }}>Dein Punktestand und deine Lernhistorie werden gelöscht. Das kann nicht rückgängig gemacht werden.</p>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="nav-btn danger" style={{ flex: 1 }} onClick={() => { resetAll(); setShowResetConfirm(false); }}>Ja, alles löschen</button>
                <button className="nav-btn" style={{ flex: 1 }} onClick={() => setShowResetConfirm(false)}>Abbrechen</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Zertifikat Popup ── */}
        {showCertificate && (
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 20 }}>
            <div className="cert-popup" style={{ background: C.surface, border: `1px solid ${C.greenBdr}`, borderRadius: 14, padding: 28, maxWidth: 440, width: "100%", display: "grid", gap: 16, maxHeight: "90vh", overflowY: "auto" }}>
              {!certSent ? (
                <>
                  <div style={{ fontSize: 32, textAlign: "center" }}>🏆</div>
                  <div style={{ fontSize: 20, fontWeight: 600, textAlign: "center", color: C.green }}>Glückwunsch – 10/10 erreicht!</div>
                  <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.6, textAlign: "center" }}>Füll das Formular aus und ich schicke dir dein persönliches <strong style={{ color: C.text }}>Zertifikat</strong> zu.</p>
                  {[
                    { label: "Vorname",  value: certFirstName, set: setCertFirstName, placeholder: "z. B. Max" },
                    { label: "Nachname", value: certLastName,  set: setCertLastName,  placeholder: "z. B. Mustermann" },
                    { label: "E-Mail",   value: certEmail,     set: setCertEmail,     placeholder: "deine@email.de", type: "email" },
                  ].map(({ label, value, set, placeholder, type }) => (
                    <div key={label} style={{ display: "grid", gap: 5 }}>
                      <label style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>{label} <span style={{ color: C.red }}>*</span></label>
                      <input type={type || "text"} placeholder={placeholder} value={value} onChange={(e) => set(e.target.value)} style={inputStyle} />
                    </div>
                  ))}
                  <div style={{ display: "grid", gap: 5 }}>
                    <label style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>Geburtsdatum <span style={{ fontSize: 11, color: C.textDim, fontWeight: 400 }}>(optional)</span></label>
                    <input type="date" value={certBirthdate} onChange={(e) => setCertBirthdate(e.target.value)} style={inputStyle} />
                  </div>
                  <div style={{ display: "grid", gap: 5 }}>
                    <label style={{ fontSize: 11, color: C.textMuted, fontWeight: 600 }}>Postleitzahl <span style={{ fontSize: 11, color: C.textDim, fontWeight: 400 }}>(optional – für regionale Angebote)</span></label>
                    <input type="text" placeholder="z. B. 22297" value={certPlz} onChange={(e) => setCertPlz(e.target.value.replace(/\D/g, "").slice(0, 5))} maxLength={5} style={inputStyle} />
                  </div>
                  <label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 11, color: C.textMuted, cursor: "pointer" }}>
                    <input type="checkbox" checked={certPrivacy} onChange={(e) => setCertPrivacy(e.target.checked)} style={{ marginTop: 2, flexShrink: 0 }} />
                    Ich stimme zu, dass meine Daten zum Versand des Zertifikats verwendet werden. Kein Spam, keine Weitergabe.
                  </label>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="nav-btn primary" style={{ flex: 1, opacity: (!certFirstName || !certLastName || !certEmail || !certPrivacy) ? 0.4 : 1 }}
                      disabled={!certFirstName || !certLastName || !certEmail || !certPrivacy}
                      onClick={() => {
                        const heute = new Date().toLocaleDateString("de-DE");
                        const geburt = certBirthdate ? `\nGeburtsdatum: ${new Date(certBirthdate).toLocaleDateString("de-DE")} (auf Wunsch)` : "";
                        const plz    = certPlz ? `\nPostleitzahl: ${certPlz}` : "";
                        const body   = `Hallo,\n\nich habe gerade 10/10 im Candlestick Quiz erreicht und würde mich sehr über mein Zertifikat freuen.\n\nMein Name: ${certFirstName} ${certLastName}\nMeine E-Mail: ${certEmail}${geburt}${plz}\nWebseite: Candlestick Quiz\nDatum: ${heute}\n\nViele Grüße\n${certFirstName} ${certLastName}`;
                        window.location.href = `mailto:gaucho0@web.de?subject=${encodeURIComponent("Zertifikat Anfrage – Candlestick Quiz")}&body=${encodeURIComponent(body)}`;
                        setCertSent(true);
                      }}>
                      Zertifikat anfordern →
                    </button>
                    <button className="nav-btn" onClick={() => setShowCertificate(false)}>Schließen</button>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 32, textAlign: "center" }}>✉️</div>
                  <div style={{ fontSize: 15, fontWeight: 600, textAlign: "center", color: C.green }}>Anfrage wird gesendet!</div>
                  <p style={{ fontSize: 15, color: C.textMuted, lineHeight: 1.6, textAlign: "center" }}>Dein E-Mail-Programm öffnet sich gleich. Bitte auf <strong style={{ color: C.text }}>Senden</strong> klicken.</p>
                  <button className="nav-btn primary" onClick={() => { setShowCertificate(false); setCertSent(false); setCertEmail(""); setCertFirstName(""); setCertLastName(""); setCertBirthdate(""); setCertPlz(""); setCertPrivacy(false); }}>Schließen</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
