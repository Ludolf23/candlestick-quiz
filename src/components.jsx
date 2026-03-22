// ─── components.jsx ───────────────────────────────────────────────────────────
import React from "react";
import { C, DARK, LIGHT, font, setThemeTokens } from "./theme.js";

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

export const GlobalStyle = ({ theme }) => {
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
        border: 1px solid ${c.border}; background: ${c.surface};
        color: ${c.text}; font-family: ${font.sans}; font-size: 13px;
        line-height: 1.5; text-align: left; cursor: pointer;
        transition: border-color 0.15s, background 0.15s, transform 0.1s;
        display: flex; align-items: flex-start; gap: 10px;
      }
      .choice-btn:hover:not(:disabled) { border-color: ${c.blue}; background: ${c.blueBg}; transform: translateX(2px); }
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
        padding: 6px 13px; border-radius: 6px; border: 1px solid ${c.border};
        background: ${c.surface}; color: ${c.textMuted}; font-family: ${font.sans};
        font-size: 13px; font-weight: 400; cursor: pointer;
        transition: border-color 0.15s, color 0.15s, background 0.15s;
      }
      .nav-btn:hover   { border-color: ${c.blue}; color: ${c.blue}; background: ${c.blueBg}; }
      .nav-btn.active  { border-color: ${c.blue}; color: ${c.blue}; background: ${c.blueBg}; }
      .nav-btn.primary { border-color: ${c.greenBdr}; color: ${c.green}; background: ${c.greenBg}; font-weight: 600; }
      .nav-btn.primary:hover { border-color: ${c.green}; }
      .nav-btn.danger  { border-color: ${c.redBdr}; color: ${c.red}; background: ${c.redBg}; }

      /* ── Karten ── */
      .card { background: ${c.surface}; border: 1px solid ${c.border}; border-radius: 10px; padding: 20px; animation: fadeIn 0.2s ease forwards; }

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
      .reveal-box { padding: 16px; border-radius: 8px; border: 1px solid ${c.border}; background: ${c.surfaceHi}; animation: fadeIn 0.2s ease forwards; }

      /* ── Info-Box (neutral grau statt blau) ── */
      .info-box { padding: 10px 14px; border-radius: 8px; background: ${c.surfaceHi}; border: 1px solid ${c.border}; font-size: 13px; color: ${c.textMuted}; line-height: 1.6; }

      /* ── Hinweis-Box (gelb, nur für Merksätze/Warnungen) ── */
      .hint-box { padding: 10px 14px; border-radius: 8px; background: ${c.yellowBg}; border: 1px solid ${c.yellowBdr}; font-size: 13px; color: ${c.yellow}; }

      /* ── Score-Badge ── */
      .score-badge { display: inline-flex; align-items: center; gap: 6px; padding: 4px 12px; border-radius: 6px; border: 1px solid ${c.border}; background: ${c.surfaceHi}; font-family: ${font.mono}; font-size: 13px; color: ${c.textMuted}; }
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
export const VIEW_WIDTH  = 28;
export const VIEW_HEIGHT = 48;
export const SVG_SCALE   = 0.85;

export function MiniCandle({ bodyColor="#3fb950", core={top:3,bottom:1,bodyY:2,bodyH:0.5}, padding=4, wickMode="both", wickTopLenPx=null, bodyShiftPx=0, wickBottomTrimPx=0, wickJoinPx=0 }) {
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

export function DragonflyDojiSVG() {
  return (
    <svg width={28*SVG_SCALE} height={48*SVG_SCALE} viewBox="0 0 28 48">
      <line x1="14" x2="14" y1="14" y2="42" stroke="#484f58" strokeWidth="1.5" />
      <line x1="9"  x2="19" y1="14" y2="14" stroke="#7d8590" strokeWidth="2.5" />
    </svg>
  );
}

export function GravestoneDojiSVG({ wickTopLenPx=25 }) {
  const bodyY = 32, wickTop = Math.max(4, bodyY - wickTopLenPx);
  return (
    <svg width={28*SVG_SCALE} height={48*SVG_SCALE} viewBox="0 0 28 48">
      <line x1="14" x2="14" y1={wickTop} y2={bodyY} stroke="#484f58" strokeWidth="1.5" />
      <line x1="9"  x2="19" y1={bodyY}  y2={bodyY}  stroke="#7d8590" strokeWidth="2.5" />
    </svg>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
export function displayName(candle) {
  const n = String(candle?.name||""), d = String(candle?.deName||"");
  return d && d !== n ? `${n} (${d})` : n;
}
export function isNeutralTyp(typ) { return String(typ||"").toLowerCase().includes("neutral"); }
export function colorTag(typ) {
  const t = String(typ||"").toLowerCase();
  if (t.includes("bullish")) return "tag-green";
  if (t.includes("bearish")) return "tag-red";
  return "tag-gray";
}

// ─── InfoRow: Label fett, Wert normal ─────────────────────────────────────────
export function InfoRow({ label, value, fullWidth=false }) {
  if (!value) return null;
  return (
    <div style={{ display:"flex", gap:6, alignItems:"baseline", fontSize:13, lineHeight:1.6, gridColumn: fullWidth ? "1 / -1" : undefined }}>
      <span style={{ fontWeight:600, color:C.text, flexShrink:0, whiteSpace:"nowrap" }}>{label}:</span>
      <span style={{ color:C.textMuted }}>{value}</span>
    </div>
  );
}


const _GREEN = "#3fb950";
const _RED   = "#f85149";
const _GRAY  = "#7d8590";

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
export function ContextChart({ candle }) {
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
