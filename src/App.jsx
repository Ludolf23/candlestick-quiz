import React, { useState, useEffect, useMemo, useRef } from "react";
// ── Tokens ──────────────────────────────────────────────────────────────────
const DARK={bg:"#0d1117",surface:"#161b22",surfaceHi:"#1c2333",border:"#30363d",borderHi:"#484f58",text:"#e6edf3",textMuted:"#7d8590",textDim:"#484f58",green:"#3fb950",greenBg:"#0d2216",greenBdr:"#238636",red:"#f85149",redBg:"#2d1318",redBdr:"#da3633",yellow:"#e3b341",yellowBg:"#2b2006",yellowBdr:"#9e6a03",blue:"#58a6ff",blueBg:"#0c1929",blueBdr:"#1f6feb"};
const LIGHT={bg:"#f6f8fa",surface:"#ffffff",surfaceHi:"#f0f2f5",border:"#d0d7de",borderHi:"#afb8c1",text:"#1f2328",textMuted:"#57606a",textDim:"#afb8c1",green:"#1a7f37",greenBg:"#dafbe1",greenBdr:"#82e09a",red:"#cf222e",redBg:"#ffebe9",redBdr:"#ff8182",yellow:"#9a6700",yellowBg:"#fff8c5",yellowBdr:"#d4a72c",blue:"#0969da",blueBg:"#ddf4ff",blueBdr:"#54aeff"};
const font={mono:"'JetBrains Mono',monospace",sans:"'IBM Plex Sans','Segoe UI',system-ui,sans-serif"};
let C=LIGHT;
function setTok(t){C=t==="light"?LIGHT:DARK;}

const storage={get:k=>{try{return localStorage.getItem(k);}catch{return null;}},set:(k,v)=>{try{localStorage.setItem(k,v);}catch{}},remove:k=>{try{localStorage.removeItem(k);}catch{}}};

// ── CSS ──────────────────────────────────────────────────────────────────────
const GlobalStyle=({theme})=>{
  setTok(theme);const c=theme==="light"?LIGHT:DARK;
  return <style>{`
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;600&family=JetBrains+Mono:wght@400;500&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    body{background:${c.bg};color:${c.text};font-family:${font.sans};font-size:15px;line-height:1.6}
    @keyframes fadeIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
    @keyframes flashG{0%{background:${c.greenBg}}100%{background:transparent}}
    @keyframes flashR{0%{background:${c.redBg}}100%{background:transparent}}
    @keyframes pulse{0%,100%{box-shadow:0 0 0 0 ${c.blue}55}50%{box-shadow:0 0 0 6px ${c.blue}00}}
    .flash-green{animation:flashG .4s ease forwards}
    .flash-red{animation:flashR .4s ease forwards}
    ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:${c.bg}}::-webkit-scrollbar-thumb{background:${c.border};border-radius:3px}
    .choice-btn{width:100%;padding:11px 14px;border-radius:6px;border:1.5px solid ${c.border};background:${c.surface};color:${c.text};font-family:${font.sans};font-size:13px;text-align:left;cursor:pointer;transition:border-color .15s,background .15s,transform .1s;display:flex;align-items:flex-start;gap:10px;box-shadow:0 2px 6px rgba(0,0,0,.15)}
    .choice-btn:hover:not(:disabled){border-color:${c.blue};background:${c.blueBg};transform:translateX(2px)}
    .choice-btn:disabled{cursor:default}
    .choice-btn.correct{border-color:${c.greenBdr};background:${c.greenBg};color:${c.green}}
    .choice-btn.wrong{border-color:${c.redBdr};background:${c.redBg};color:${c.red}}
    .choice-btn.dimmed{opacity:.35}
    .choice-btn .badge{flex-shrink:0;width:20px;height:20px;border-radius:4px;border:1px solid ${c.borderHi};background:${c.surfaceHi};display:flex;align-items:center;justify-content:center;font-family:${font.mono};font-size:11px;color:${c.textMuted};margin-top:1px}
    .choice-btn.correct .badge{background:${c.greenBdr};border-color:${c.green};color:#fff}
    .choice-btn.wrong .badge{background:${c.redBdr};border-color:${c.red};color:#fff}
    .nav-btn{padding:6px 13px;border-radius:6px;border:1.5px solid ${c.borderHi};background:${c.surface};color:${c.text};font-family:${font.sans};font-size:13px;cursor:pointer;transition:border-color .15s,color .15s,background .15s;box-shadow:0 1px 3px rgba(0,0,0,.1)}
    .nav-btn:hover{border-color:${c.blue};color:${c.blue};background:${c.blueBg}}
    .nav-btn.active{border-color:${c.blue};color:${c.blue};background:${c.blueBg};font-weight:600}
    .nav-btn.primary{border-color:${c.greenBdr};color:${c.green};background:${c.greenBg};font-weight:600}
    .nav-btn.primary:hover{border-color:${c.green}}
    .nav-btn.danger{border-color:${c.redBdr};color:${c.red};background:${c.redBg};font-weight:600}
    .nav-btn.secondary{border-color:${c.blueBdr};color:${c.blue};background:${c.blueBg};font-weight:600}
    .nav-btn.muted{border-color:${c.border};color:${c.textMuted};background:${c.surfaceHi};font-size:11px}
    .nav-btn.muted:hover{border-color:${c.borderHi};color:${c.text}}
    .cta-btn{display:inline-flex;align-items:center;gap:8px;padding:13px 28px;border-radius:8px;background:${c.green};color:#fff;font-weight:700;font-size:15px;border:none;cursor:pointer;box-shadow:0 4px 14px rgba(63,185,80,.4);transition:opacity .15s,transform .15s}
    .cta-btn:hover{opacity:.9;transform:translateY(-2px)}
    .card{background:${c.surface};border:1.5px solid ${c.border};border-radius:10px;padding:20px;animation:fadeIn .2s ease forwards}
    .quiz-card{background:${c.surface};border:1.5px solid ${c.blue}33;border-radius:10px;padding:20px;animation:fadeIn .2s ease forwards;box-shadow:0 2px 10px rgba(0,0,0,.08)}
    .tag{display:inline-flex;align-items:center;padding:2px 8px;border-radius:20px;font-size:11px;font-family:${font.mono}}
    .tag-green{background:${c.greenBg};color:${c.green};border:1px solid ${c.greenBdr}}
    .tag-red{background:${c.redBg};color:${c.red};border:1px solid ${c.redBdr}}
    .tag-gray{background:${c.surfaceHi};color:${c.textMuted};border:1px solid ${c.border}}
    .tag-blue{background:${c.blueBg};color:${c.blue};border:1px solid ${c.blueBdr}}
    table{border-collapse:collapse;width:100%}
    th,td{text-align:left;padding:8px 12px;border-bottom:1px solid ${c.border};font-size:13px}
    th{color:${c.textMuted};font-weight:400;font-family:${font.mono};font-size:11px;text-transform:uppercase;letter-spacing:.06em}
    tr:last-child td{border-bottom:none}
    tr:hover td{background:${c.surfaceHi}}
    .progress-bar{height:3px;background:${c.border};border-radius:2px;overflow:hidden}
    .progress-fill{height:100%;background:${c.blue};border-radius:2px;transition:width .4s ease}
    .reveal-box{padding:16px;border-radius:8px;border:1px solid ${c.border};background:${c.bg};animation:fadeIn .2s ease forwards}
    .info-box{padding:10px 14px;border-radius:8px;background:${c.surfaceHi};border:1px solid ${c.border};font-size:13px;color:${c.textMuted};line-height:1.6}
    .score-badge{display:inline-flex;align-items:center;gap:6px;padding:4px 12px;border-radius:6px;border:1px solid ${c.border};background:${c.surfaceHi};font-size:13px;color:${c.textMuted}}
    .score-badge span{color:${c.green};font-weight:600}
    .flash-card{background:${c.surface};border:1px solid ${c.border};border-radius:10px;padding:16px;transition:border-color .2s;animation:fadeIn .2s ease forwards}
    .flash-card:hover{border-color:${c.borderHi}}
    *{transition:background-color .2s ease,border-color .2s ease,color .15s ease}
    button{transition:background-color .15s,border-color .15s,color .1s,transform .1s !important}
    @media(max-width:600px){.choices-grid{grid-template-columns:1fr !important}.flashcards-grid{grid-template-columns:1fr !important}.info-grid{grid-template-columns:1fr !important}.app-padding{padding:12px 12px 40px !important}.header-nav{gap:6px !important}}
  `}</style>;
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function displayName(c){const n=String(c?.name||""),d=String(c?.deName||"");return d&&d!==n?`${n} (${d})`:n;}
function isNeutral(t){return String(t||"").toLowerCase().includes("neutral");}
function colorTag(t){const s=String(t||"").toLowerCase();if(s.includes("bullish"))return"tag-green";if(s.includes("bearish"))return"tag-red";return"tag-gray";}
function InfoRow({label,value,fullWidth=false}){
  if(!value)return null;
  return<div style={{display:"flex",gap:6,alignItems:"baseline",fontSize:13,lineHeight:1.6,gridColumn:fullWidth?"1 / -1":undefined}}><span style={{fontWeight:600,color:C.text,flexShrink:0,whiteSpace:"nowrap"}}>{label}:</span><span style={{color:C.textMuted}}>{value}</span></div>;
}

// ── Kontext-Chart ─────────────────────────────────────────────────────────────
const GR="#3fb950",RD="#f85149",GY="#7d8590";
function getSeq(name){
  switch(name){
    case"Hammer":return[{h:110,l:96,o:109,c:98,col:RD},{h:100,l:88,o:99,c:90,col:RD},{h:92,l:76,o:91,c:88,col:GR,sig:true},{h:94,l:86,o:88,c:93,col:GR}];
    case"Inverted Hammer":return[{h:112,l:98,o:111,c:100,col:RD},{h:102,l:88,o:101,c:90,col:RD},{h:100,l:84,o:86,c:88,col:GR,sig:true},{h:96,l:86,o:88,c:95,col:GR}];
    case"Hanging Man":return[{h:92,l:82,o:83,c:91,col:GR},{h:100,l:90,o:91,c:99,col:GR},{h:101,l:85,o:100,c:97,col:RD,sig:true},{h:98,l:88,o:97,c:89,col:RD}];
    case"Shooting Star":return[{h:94,l:84,o:85,c:93,col:GR},{h:102,l:91,o:93,c:101,col:GR},{h:116,l:99,o:101,c:103,col:RD,sig:true},{h:104,l:94,o:103,c:95,col:RD}];
    case"Dragonfly Doji":return[{h:108,l:95,o:107,c:97,col:RD},{h:99,l:85,o:98,c:87,col:RD},{h:88,l:74,o:88,c:88,col:GY,sig:true,doji:true},{h:95,l:86,o:88,c:94,col:GR}];
    case"Gravestone Doji":return[{h:95,l:85,o:86,c:94,col:GR},{h:104,l:93,o:94,c:103,col:GR},{h:116,l:103,o:103,c:103,col:GY,sig:true,doji:true},{h:104,l:94,o:103,c:95,col:RD}];
    case"Doji":return[{h:102,l:92,o:93,c:101,col:GR},{h:104,l:94,o:102,c:96,col:RD},{h:106,l:92,o:99,c:99,col:GY,sig:true,doji:true}];
    case"Spinning Top":return[{h:104,l:94,o:101,c:97,col:RD},{h:102,l:92,o:93,c:100,col:GR},{h:106,l:90,o:98,c:100,col:GR,sig:true}];
    case"Marubozu (grün)":return[{h:92,l:84,o:85,c:91,col:GR},{h:100,l:90,o:91,c:99,col:GR},{h:112,l:100,o:100,c:112,col:GR,sig:true,maru:true},{h:118,l:110,o:112,c:117,col:GR}];
    case"Marubozu (rot)":return[{h:116,l:106,o:115,c:107,col:RD},{h:108,l:98,o:107,c:99,col:RD},{h:100,l:88,o:100,c:88,col:RD,sig:true,maru:true},{h:90,l:78,o:88,c:80,col:RD}];
    default:return null;
  }
}
function ContextChart({candle}){
  const seq=getSeq(candle?.name);if(!seq)return null;
  const W=220,H=90,PY=8,cW=14,gap=4;
  const sx=(W-(seq.length*cW+(seq.length-1)*gap))/2;
  const allP=seq.flatMap(c=>[c.h,c.l]);
  const pMin=Math.min(...allP),pR=Math.max(...allP)-pMin||1;
  const toY=p=>PY+(1-(p-pMin)/pR)*(H-2*PY);
  const sc=f=>f===GR?"#238636":f===RD?"#da3633":"#6b7280";
  const m=String(candle.markt||"").toLowerCase();
  const tl=m.includes("aufwärt")?"↑ Aufwärtstrend":m.includes("abwärt")?"↓ Abwärtstrend":"↔ Seitwärts";
  return(
    <div style={{marginTop:12}}>
      <div style={{fontSize:11,color:C.textDim,fontFamily:font.mono,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Kontext-Chart</div>
      <div style={{background:C.bg,border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 4px 4px",display:"inline-block"}}>
        <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
          {seq.map((c,i)=>{
            const cx=sx+i*(cW+gap)+cW/2,x=sx+i*(cW+gap);
            const yH=toY(c.h),yL=toY(c.l),yO=toY(c.o),yC=toY(c.c);
            const yT=Math.min(yO,yC),yB=Math.max(yO,yC),bH=Math.max(1.5,yB-yT);
            return(<g key={i}>
              {c.sig&&<rect x={x-3} y={yH-4} width={cW+6} height={yL-yH+8} rx={3} fill={`${C.yellow}12`} stroke={C.yellow} strokeWidth="1"/>}
              {!c.maru&&<line x1={cx} x2={cx} y1={yH} y2={yT} stroke="#484f58" strokeWidth="1.5" strokeLinecap="round"/>}
              {!c.maru&&<line x1={cx} x2={cx} y1={yB} y2={yL} stroke="#484f58" strokeWidth="1.5" strokeLinecap="round"/>}
              {c.doji?<line x1={x+2} x2={x+cW-2} y1={yT} y2={yT} stroke="#7d8590" strokeWidth="2" strokeLinecap="round"/>
                     :<rect x={x+1} y={yT} width={cW-2} height={bH} fill={c.col} stroke={sc(c.col)} strokeWidth="0.5" rx="1"/>}
            </g>);
          })}
        </svg>
        <div style={{fontSize:11,color:C.textDim,fontFamily:font.mono,paddingLeft:6,paddingBottom:2}}>{tl}</div>
      </div>
    </div>
  );
}

// ── Candles Data ──────────────────────────────────────────────────────────────
const candles=[
  {name:"Hammer",deName:"Hammer",merk:"Abverkauf wird gekauft – Käufer übernehmen.",typ:"Bullish Reversal",markt:"Abwärtstrend",erklaerung:"Signalisiert nach Abwärtstrend eine Abwehr der Verkäufer. Lange Lunte unten = Kaufdruck kommt zurück.",beschreibung:"Kleiner Körper, langer unterer Schatten.",bedeutung:"Käufer drehen den Markt – Bodenbildung.",bestaetigung:"Grüne Folgekerze, RSI steigt.",strategie:"Einstieg nach grüner Folgekerze über dem Hammer-Hoch. Stop unter das Tief.",wirkung:"2–3",staerke:5,
   svg:()=><svg width={24} height={41} viewBox="0 0 28 48"><line x1="14" x2="14" y1="8" y2="42" stroke="#484f58" strokeWidth="1.5"/><rect x="8" y="16" width="12" height="8" fill="#3fb950" stroke="#238636" strokeWidth="0.5" rx="1.5"/></svg>},
  {name:"Inverted Hammer",deName:"Invertierter Hammer",merk:"Hoch wird getestet – Käufer zeigen erste Stärke.",typ:"Bullish Reversal (schwach)",markt:"Abwärtstrend",erklaerung:"Käufer zeigen erste Stärke – intraday hochgekauft, Schluss noch tief.",beschreibung:"Kleiner Körper unten, langer oberer Schatten.",bedeutung:"Erste bullische Gegenwehr.",bestaetigung:"Grüne Folgekerze über Hoch.",strategie:"Nur nach klarer grüner Bestätigungskerze einsteigen. Stop unter Tief.",wirkung:"2–3",staerke:4,
   svg:()=><svg width={24} height={41} viewBox="0 0 28 48"><line x1="14" x2="14" y1="6" y2="30" stroke="#484f58" strokeWidth="1.5"/><rect x="8" y="30" width="12" height="8" fill="#3fb950" stroke="#238636" strokeWidth="0.5" rx="1.5"/></svg>},
  {name:"Hanging Man",deName:"Hängender Mann",merk:"Abverkauf zeigt Schwäche – Käufer werden schwach.",typ:"Bearish Reversal",markt:"Aufwärtstrend",erklaerung:"Zeigt Schwäche im Aufwärtstrend. Lange Lunte = intraday Abverkauf.",beschreibung:"Wie Hammer, aber nach Aufwärtstrend.",bedeutung:"Verkäufer übernehmen – Topbildung möglich.",bestaetigung:"Rote Folgekerze, Volumenanstieg.",strategie:"Warten auf rote Bestätigungskerze unterhalb des Körpers. Stop über Hoch.",wirkung:"2",staerke:5,
   svg:()=><svg width={24} height={41} viewBox="0 0 28 48"><line x1="14" x2="14" y1="8" y2="42" stroke="#484f58" strokeWidth="1.5"/><rect x="8" y="12" width="12" height="8" fill="#f85149" stroke="#da3633" strokeWidth="0.5" rx="1.5"/></svg>},
  {name:"Shooting Star",deName:"Sternschnuppe",merk:"Hoch wird verkauft – Käufer erschöpft.",typ:"Bearish Reversal",markt:"Aufwärtstrend",erklaerung:"Aufwärtsmomentum lässt nach: Hoch ausgenutzt, danach deutlicher Abverkauf.",beschreibung:"Kleiner Körper unten, langer oberer Schatten.",bedeutung:"Topbildung – potenzielle Umkehr.",bestaetigung:"Rote Folgekerze mit Volumenanstieg.",strategie:"Short-Einstieg nach roter Bestätigungskerze. Stop über Hoch.",wirkung:"2–3",staerke:5,
   svg:()=><svg width={24} height={41} viewBox="0 0 28 48"><line x1="14" x2="14" y1="6" y2="36" stroke="#484f58" strokeWidth="1.5"/><rect x="8" y="30" width="12" height="8" fill="#f85149" stroke="#da3633" strokeWidth="0.5" rx="1.5"/></svg>},
  {name:"Dragonfly Doji",deName:"Libellen-Doji",merk:"Abverkauf neutralisiert – Entscheidung folgt.",typ:"Bullish Reversal",markt:"Abwärtstrend",erklaerung:"Starke Reaktion der Käufer. Rückkauf bis zum Schluss = bullische Stärke.",beschreibung:"Kein Körper, langer unterer Schatten.",bedeutung:"Bodenbildung möglich.",bestaetigung:"Grüne Folgekerze über Hoch des Doji.",strategie:"Long nur bei bullischer Folgekerze. Stop unter Tief.",wirkung:"2–3",staerke:3,
   svg:()=><svg width={24} height={41} viewBox="0 0 28 48"><line x1="14" x2="14" y1="14" y2="42" stroke="#484f58" strokeWidth="1.5"/><line x1="9" x2="19" y1="14" y2="14" stroke="#7d8590" strokeWidth="2.5"/></svg>},
  {name:"Gravestone Doji",deName:"Grabstein-Doji",merk:"Hoch wird komplett verkauft – Warnsignal.",typ:"Bearish Reversal",markt:"Aufwärtstrend",erklaerung:"Käufer treiben Kurs hoch, Verkäufer drücken ihn zurück – Erschöpfung der Bullen.",beschreibung:"Kein Körper, langer oberer Schatten.",bedeutung:"Topbildung – mögliche Umkehr.",bestaetigung:"Rote Folgekerze unterhalb des Doji.",strategie:"Short nach roter Bestätigungskerze. Stop über Hoch.",wirkung:"2–3",staerke:4,
   svg:()=><svg width={24} height={41} viewBox="0 0 28 48"><line x1="14" x2="14" y1="7" y2="32" stroke="#484f58" strokeWidth="1.5"/><line x1="9" x2="19" y1="32" y2="32" stroke="#7d8590" strokeWidth="2.5"/></svg>},
  {name:"Marubozu (grün)",deName:"Marubozu (grün)",merk:"Nur Kaufdruck – Trendstärke ohne Pause.",typ:"Bullish Continuation",markt:"Aufwärtstrend",erklaerung:"Keine Schatten – Käufer kontrollieren die gesamte Periode.",beschreibung:"Keine Schatten, langer grüner Körper.",bedeutung:"Trendfortsetzung wahrscheinlich.",bestaetigung:"Weitere grüne Kerze oder hohes Volumen.",strategie:"Nach grüner Bestätigungskerze long. Stop unter Tief des Marubozu.",wirkung:"3–5",staerke:8,
   svg:()=><svg width={24} height={41} viewBox="0 0 28 48"><rect x="8" y="6" width="12" height="36" fill="#3fb950" stroke="#238636" strokeWidth="0.5" rx="1.5"/></svg>},
  {name:"Marubozu (rot)",deName:"Marubozu (rot)",merk:"Nur Verkaufsdruck – Abwärtsdruck ohne Pause.",typ:"Bearish Continuation",markt:"Abwärtstrend",erklaerung:"Keine Schatten – Verkäufer kontrollieren die gesamte Periode.",beschreibung:"Keine Schatten, langer roter Körper.",bedeutung:"Abwärtstrend wahrscheinlich.",bestaetigung:"Weitere rote Kerze oder Volumenanstieg.",strategie:"Nach roter Bestätigungskerze short. Stop über Hoch des Marubozu.",wirkung:"3–5",staerke:8,
   svg:()=><svg width={24} height={41} viewBox="0 0 28 48"><rect x="8" y="6" width="12" height="36" fill="#f85149" stroke="#da3633" strokeWidth="0.5" rx="1.5"/></svg>},
  {name:"Doji",deName:"Doji",merk:"Unentschlossenheit – Folgekerze entscheidet.",typ:"Neutral",markt:"Trendphase beliebig",erklaerung:"Käufer und Verkäufer gleichen sich aus – häufig Pause oder Wechsel.",beschreibung:"Open ≈ Close, Schatten oben und unten.",bedeutung:"Unsicherheit oder Trendwechsel.",bestaetigung:"Folgekerze bestätigt Richtung.",strategie:"Nicht direkt handeln – erst Folgekerze abwarten.",wirkung:"1–2",staerke:null,
   svg:()=><svg width={24} height={41} viewBox="0 0 28 48"><line x1="14" x2="14" y1="6" y2="42" stroke="#484f58" strokeWidth="1.5"/><line x1="7" x2="21" y1="24" y2="24" stroke="#7d8590" strokeWidth="2.5"/></svg>},
  {name:"Spinning Top",deName:"Kreisel",merk:"Pause im Trend – Kraft sammelt sich.",typ:"Neutral / Trendpause",markt:"Seitwärtsphase oder Trendpause",erklaerung:"Gleichgewicht – Markt sammelt Kraft. Oft Vorbote einer größeren Bewegung.",beschreibung:"Kleiner Körper, Schatten oben & unten ähnlich lang.",bedeutung:"Trendpause oder Richtungsänderung möglich.",bestaetigung:"Folgekerze oder Volumenanstieg.",strategie:"Selten direkt handeln. Break nach oben → long; Break nach unten → short.",wirkung:"1–2",staerke:null,
   svg:()=><svg width={24} height={41} viewBox="0 0 28 48"><line x1="14" x2="14" y1="6" y2="42" stroke="#484f58" strokeWidth="1.5"/><rect x="8" y="18" width="12" height="8" fill="#7d8590" stroke="#6b7280" strokeWidth="0.5" rx="1.5"/></svg>},
];

// ── Quiz Engine ───────────────────────────────────────────────────────────────
const QTYPES=["name_from_desc","type_from_name","market_from_name","strength_from_name","strategy_from_name"];
const RS=10,LABELS=["A","B","C","D"];
function pick(arr,k){const a=[...arr],o=[];while(o.length<k&&a.length)o.push(a.splice(Math.floor(Math.random()*a.length),1)[0]);return o;}
function buildRound(size){
  const out=[],tq=[];
  while(tq.length<size)tq.push(...[...QTYPES].sort(()=>Math.random()-.5));
  const cq=[];while(cq.length<size*2)cq.push(...[...candles].sort(()=>Math.random()-.5));
  let ci=0;
  for(let t=0;out.length<size&&t<1000;t++){
    const qt=tq[out.length],item=cq[ci%cq.length];ci++;
    if(qt==="strength_from_name"&&isNeutral(item.typ))continue;
    if(out.slice(-3).map(q=>q.item?.name).includes(item.name))continue;
    let prompt="",choices=[],correct="";
    switch(qt){
      case"name_from_desc":prompt=`Welche Kerze passt zur Beschreibung: „${item.beschreibung}" (Signal: ${item.bedeutung})?`;correct=item.name;choices=pick(candles.map(c=>c.name),4);if(!choices.includes(correct))choices[0]=correct;break;
      case"type_from_name":prompt=`Welches Signal gibt ${displayName(item)}?`;correct=item.typ;choices=pick([...new Set(candles.map(c=>c.typ))],4);if(!choices.includes(correct))choices[0]=correct;break;
      case"market_from_name":prompt=`In welchem Trend erscheint ${displayName(item)}?`;correct=item.markt;choices=pick([...new Set(candles.map(c=>c.markt))],4);if(!choices.includes(correct))choices[0]=correct;break;
      case"strength_from_name":prompt=`Welche Signalstärke (1–10) hat ${displayName(item)}?`;correct=String(item.staerke);choices=pick(["3","4","5","6","7","8","9","10"],4);if(!choices.includes(correct))choices[0]=correct;break;
      case"strategy_from_name":prompt=`Wie würdest du ${displayName(item)} als Swing-Trader handeln?`;correct=item.strategie;choices=[correct,...pick(candles.filter(c=>c.name!==item.name).map(c=>c.strategie),3)];break;
    }
    out.push({qt,item,prompt,choices:pick(choices,choices.length),correct,svg:item.svg});
  }
  while(out.length<size){const item=candles[0];out.push({qt:"name_from_desc",item,prompt:`Welche Kerze: „${item.beschreibung}"?`,choices:pick(candles.map(c=>c.name),4),correct:item.name,svg:item.svg});}
  return out;
}
const FC=["✓ Stark!","✓ Perfekt!","✓ Sehr gut!","✓ Richtig!","✓ Exzellent!"];
const FW=["✗ Knapp daneben.","✗ Nicht ganz.","✗ Falsch – lern weiter!","✗ Fast – nochmal lesen.","✗ Wiederholung macht den Meister."];
const rndFb=ok=>(ok?FC:FW)[Math.floor(Math.random()*(ok?FC:FW).length)];

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FaqItem({q,a}){
  const[open,setOpen]=useState(false);
  return(
    <div style={{borderBottom:`1px solid ${C.border}`}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",padding:"14px 0",display:"flex",justifyContent:"space-between",alignItems:"center",background:"none",border:"none",cursor:"pointer",color:C.text,fontSize:15,fontWeight:600,textAlign:"left",gap:12,boxShadow:"none"}}>
        <span>{q}</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2" style={{flexShrink:0,transform:open?"rotate(180deg)":"none",transition:"transform .2s"}}><polyline points="6 9 12 15 18 9"/></svg>
      </button>
      {open&&<div style={{fontSize:14,color:C.textMuted,lineHeight:1.7,paddingBottom:14,paddingRight:28}}>{a}</div>}
    </div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
function App(){
  const[theme,setTheme]=useState(()=>storage.get("cq_theme")||"light");
  setTok(theme);
  const[mode,setMode]=useState("quiz");
  const[answer,setAnswer]=useState(null);
  const[fbText,setFbText]=useState("");
  const[score,setScore]=useState(()=>Number(storage.get("cq_score")||0));
  const[history,setHistory]=useState(()=>{try{return JSON.parse(storage.get("cq_history")||"[]");}catch{return[];}});
  const[lastRound,setLastRound]=useState(null);
  const[reviewMode,setReviewMode]=useState(false);
  const[reviewQueue,setReviewQueue]=useState([]);
  const[reviewIdx,setReviewIdx]=useState(0);
  const[round,setRound]=useState(()=>({queue:buildRound(RS),index:0}));
  const[flash,setFlash]=useState(null);
  const[showReset,setShowReset]=useState(false);
  const[showReviewDone,setShowReviewDone]=useState(false);
  const[showCert,setShowCert]=useState(false);
  const[showFeedback,setShowFeedback]=useState(false);
  const[certEmail,setCertEmail]=useState("");
  const[certFirst,setCertFirst]=useState("");
  const[certLast,setCertLast]=useState("");
  const[certPrivacy,setCertPrivacy]=useState(false);
  const[certSent,setCertSent]=useState(false);
  const[certLevel,setCertLevel]=useState("");
  const[isFirstVisit]=useState(()=>!storage.get("cq_visited"));
  const flashRef=useRef(null);

  useEffect(()=>{storage.set("cq_visited","1");},[]);
  useEffect(()=>()=>{if(flashRef.current)clearTimeout(flashRef.current);},[]);
  useEffect(()=>{storage.set("cq_theme",theme);},[theme]);
  useEffect(()=>{storage.set("cq_score",String(score));},[score]);

  const inReview=reviewMode&&reviewQueue.length>0;
  const q=inReview?reviewQueue[reviewIdx]:round.queue[round.index];
  const isNow=isNeutral(q?.item?.typ);
  const wasCorrect=answer!==null?answer===q.correct:null;
  const progress=useMemo(()=>{const m=history.length%RS;return(history.length>0&&m===0)?100:m*(100/RS);},[history.length]);
  const curNum=inReview?reviewIdx+1:round.index+1;

  function next(){
    setAnswer(null);setFlash(null);setFbText("");
    if(inReview){setReviewIdx(i=>(i+1)%reviewQueue.length);return;}
    setRound(prev=>{const ni=prev.index+1;return ni>=prev.queue.length?{queue:buildRound(RS),index:0}:{...prev,index:ni};});
  }

  function check(a){
    if(answer!==null)return;
    const ok=a===q.correct;
    setAnswer(a);setFbText(rndFb(ok));
    if(ok)setScore(s=>s+1);
    setFlash(ok?"correct":"wrong");
    if(flashRef.current)clearTimeout(flashRef.current);
    flashRef.current=setTimeout(()=>setFlash(null),400);
    if(!inReview){
      setHistory(prev=>{
        const nr=prev.length+1;
        const entry={nr,question:q,given:a,isCorrect:ok,points:ok?10:0};
        const updated=[...prev,entry];
        storage.set("cq_history",JSON.stringify(updated.slice(-30)));
        if(nr%RS===0){
          const re=updated.slice(nr-RS,nr);
          const cc=re.filter(r=>r.isCorrect).length;
          const pct=Math.round((cc/RS)*100);
          setLastRound({entries:re,correctCount:cc,percent:pct});
          // Zertifikat: pro Runde basierend auf diesem Ergebnis
          if(pct>=90){setCertLevel("🥇 Gold");setShowCert(true);}
          else if(pct>=80){setCertLevel("🥈 Silber");setShowCert(true);}
          else if(pct>=70){setCertLevel("🥉 Bronze");setShowCert(true);}
        }
        return updated;
      });
    }
  }

  function startReview(){
    if(!lastRound)return;
    const wrong=lastRound.entries.filter(e=>!e.isCorrect);
    if(!wrong.length)return;
    setReviewQueue(wrong.map(e=>e.question));
    setReviewIdx(0);setReviewMode(true);setAnswer(null);setFlash(null);
  }
  function stopReview(){
    setReviewMode(false);setReviewQueue([]);setReviewIdx(0);
    setRound({queue:buildRound(RS),index:0});
    setAnswer(null);setFlash(null);setFbText("");setShowReviewDone(true);
  }
  function resetAll(){
    setScore(0);setHistory([]);setLastRound(null);
    setReviewMode(false);setReviewQueue([]);setReviewIdx(0);
    setRound({queue:buildRound(RS),index:0});
    setAnswer(null);setFlash(null);setFbText("");
    storage.remove("cq_score");storage.remove("cq_history");
  }

  const inp={padding:"10px 14px",borderRadius:6,fontSize:13,border:`1px solid ${C.border}`,background:C.surfaceHi,color:C.text,outline:"none",width:"100%"};

  return(
    <>
      <GlobalStyle theme={theme}/>
      <div className="app-padding" style={{minHeight:"100vh",background:C.bg,color:C.text,padding:"20px 20px 48px",fontFamily:font.sans}}>
        <div style={{maxWidth:900,margin:"0 auto",display:"grid",gap:16}}>

          {/* Header */}
          <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
            <div style={{display:"flex",alignItems:"center",gap:14}}>
              <div style={{display:"flex",flexDirection:"column",gap:2}}>
                {[...Array(3)].map((_,i)=>(
                  <div key={i} style={{display:"flex",gap:3}}>
                    {[...Array(3)].map((_,j)=>(
                      <div key={j} style={{width:3,height:i===1?10:i===0?6:14,background:i===2&&j===1?C.red:i===0&&j===1?C.green:C.border,borderRadius:1}}/>
                    ))}
                  </div>
                ))}
              </div>
              <div>
                <div style={{fontSize:15,fontWeight:600,letterSpacing:"-0.01em",lineHeight:1}}>Candlestick Quiz</div>
                <div style={{fontSize:11,color:C.textMuted,fontFamily:font.mono,marginTop:3}}>Swing-Trading · {candles.length} Muster</div>
              </div>
            </div>
            <div className="header-nav" style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              <div className="score-badge">Punkte <span>{score}</span></div>
              <div style={{width:1,height:24,background:C.border}}/>
              <button className="nav-btn muted" onClick={()=>setTheme(t=>t==="dark"?"light":"dark")} style={{fontSize:15,padding:"5px 10px"}}>
                {theme==="dark"?<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/></svg>:<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>}
              </button>
              <div style={{width:1,height:24,background:C.border}}/>
              <button className={`nav-btn${mode==="quiz"?" active":""}`} onClick={()=>setMode("quiz")}>Quiz</button>
              <button className={`nav-btn${mode==="lernen"?" active":""}`} onClick={()=>setMode("lernen")} style={isFirstVisit&&mode!=="lernen"?{borderColor:C.blue,color:C.blue,animation:"pulse 1.5s ease-in-out 3"}:{}}>
                Lernen{isFirstVisit&&mode!=="lernen"&&<span style={{fontSize:9,background:C.blue,color:"#fff",borderRadius:10,padding:"1px 5px",marginLeft:4}}>NEU</span>}
              </button>
              <button className={`nav-btn${mode==="flash"?" active":""}`} onClick={()=>setMode("flash")}>Flashcards</button>
              <button className="nav-btn danger" onClick={()=>setShowReset(true)}>Reset</button>
              {inReview&&<button className="nav-btn danger" onClick={stopReview}>Review ✕</button>}
            </div>
          </header>

          {/* Onboarding Banner */}
          {isFirstVisit&&mode==="quiz"&&(
            <div style={{padding:"14px 18px",borderRadius:10,background:C.blueBg,border:`1.5px solid ${C.blueBdr}`,display:"flex",alignItems:"center",justifyContent:"space-between",gap:14,flexWrap:"wrap",animation:"fadeIn .3s ease forwards"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <span style={{fontSize:22}}>👋</span>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:C.text}}>Neu hier? Starte mit dem Lernen-Tab!</div>
                  <div style={{fontSize:12,color:C.textMuted,marginTop:2}}>Lerne zuerst was Kerzen sind – dann macht das Quiz viel mehr Sinn.</div>
                </div>
              </div>
              <button className="cta-btn" style={{fontSize:13,padding:"9px 18px"}} onClick={()=>setMode("lernen")}>Jetzt lernen →</button>
            </div>
          )}

          {/* Progress */}
          {mode==="quiz"&&!inReview&&(
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div className="progress-bar" style={{flex:1}}><div className="progress-fill" style={{width:`${progress}%`}}/></div>
              <div style={{fontSize:11,color:C.textMuted,fontFamily:font.mono,flexShrink:0}}>Frage {curNum} von {RS}</div>
            </div>
          )}

          {/* Review Banner */}
          {inReview&&(
            <div style={{padding:"10px 16px",borderRadius:8,background:C.yellowBg,border:`1px solid ${C.yellowBdr}`,fontSize:13,color:C.yellow,display:"flex",alignItems:"center",gap:10}}>
              ⟳ Review-Modus — falsche Fragen ({reviewIdx+1}/{reviewQueue.length})
            </div>
          )}

          {/* Zertifikat-Info */}
          {mode==="quiz"&&!inReview&&(
            <div style={{padding:"12px 16px",borderRadius:10,background:C.surfaceHi,border:`1px solid ${C.border}`,display:"flex",gap:12,flexWrap:"wrap",alignItems:"center"}}>
              <div style={{fontSize:13,color:C.textMuted}}>Zertifikat pro Runde:</div>
              {[{l:"🥉 Bronze",d:"70%+",c:C.yellow},{l:"🥈 Silber",d:"80%+",c:"#9ca3af"},{l:"🥇 Gold",d:"90%+",c:C.yellow}].map(({l,d,c})=>(
                <div key={l} style={{display:"flex",alignItems:"center",gap:6,padding:"4px 10px",borderRadius:6,background:C.surface,border:`1px solid ${C.border}`}}>
                  <span style={{fontSize:13,fontWeight:600,color:c}}>{l}</span>
                  <span style={{fontSize:11,color:C.textMuted,fontFamily:font.mono}}>{d}</span>
                </div>
              ))}
            </div>
          )}

          {/* Quiz */}
          <div id="quiz-anchor"/>
          {mode==="quiz"&&q&&(
            <div className={`quiz-card${flash==="correct"?" flash-green":flash==="wrong"?" flash-red":""}`}>
              <div style={{display:"grid",gap:20}}>
                <div style={{display:"flex",alignItems:"flex-start",gap:16}}>
                  <div style={{flexShrink:0,background:C.surfaceHi,borderRadius:8,padding:"10px 8px",border:`1px solid ${C.border}`}}>
                    {q.svg&&<q.svg/>}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:10,flexWrap:"wrap"}}>
                      <span style={{fontFamily:font.mono,fontSize:11,color:C.textDim}}>FRAGE {curNum}/{RS}</span>
                      <span className={`tag ${colorTag(q.item?.typ)}`}>{q.item?.typ}</span>
                    </div>
                    <p style={{fontSize:16,lineHeight:1.6,color:C.text,fontWeight:600}}>{q.prompt}</p>
                  </div>
                </div>
                <div className="choices-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10}}>
                  {q.choices.map((c,idx)=>{
                    const chosen=answer===c,correct=q.correct===c;
                    let cls="choice-btn";
                    if(answer){if(correct)cls+=" correct";else if(chosen)cls+=" wrong";else cls+=" dimmed";}
                    return(<button key={idx} className={cls} onClick={()=>check(c)} disabled={!!answer}>
                      <span className="badge">{LABELS[idx]}</span>
                      <span style={{flex:1}}>{c}</span>
                    </button>);
                  })}
                </div>
                {answer&&(
                  <div className="reveal-box">
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,marginBottom:14,flexWrap:"wrap"}}>
                      <div style={{fontSize:13,fontWeight:600,color:wasCorrect?C.green:C.red}}>{fbText}</div>
                      <button className="nav-btn primary" onClick={next}>Nächste Frage →</button>
                    </div>
                    <div style={{fontSize:13,color:C.textMuted,marginBottom:14}}>Korrekte Antwort: <span style={{color:C.text,fontWeight:600}}>{q.correct}</span></div>
                    <div style={{display:"grid",gap:8,marginBottom:14}}>
                      {q.item.merk&&<div style={{padding:"10px 14px",borderRadius:6,background:`${C.yellow}0a`,border:`1px solid ${C.yellowBdr}`,fontSize:13,color:C.yellow}}>💡 {q.item.merk}</div>}
                      <div className="info-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"8px 24px"}}>
                        <InfoRow label="Typ" value={q.item.typ}/>
                        <InfoRow label="Markt" value={q.item.markt}/>
                        <InfoRow label="Signalstärke" value={isNow?"— (neutral)":`${q.item.staerke} / 10`}/>
                        <InfoRow label="Wirkung" value={`${q.item.wirkung} Tage`}/>
                        <InfoRow label="Bestätigung" value={q.item.bestaetigung} fullWidth/>
                        <InfoRow label="Strategie" value={q.item.strategie} fullWidth/>
                      </div>
                    </div>
                    <ContextChart candle={q.item}/>
                    {q.item.erklaerung&&<div className="info-box" style={{marginTop:12}}><span style={{fontWeight:600}}>Erklärung: </span>{q.item.erklaerung}</div>}
                  </div>
                )}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{fontSize:11,color:C.textDim,fontFamily:font.mono}}>{history.length} beantwortet · {score} Punkte</div>
                  {answer&&<button className="nav-btn primary" onClick={next}>Nächste Frage →</button>}
                </div>
              </div>
            </div>
          )}

          {/* Lernen Tab */}
          {mode==="lernen"&&(
            <div style={{display:"grid",gap:20,animation:"fadeIn .2s ease forwards"}}>
              <div style={{padding:"24px",borderRadius:10,background:C.surface,border:`1.5px solid ${C.blueBdr}`,display:"grid",gap:12}}>
                <div style={{fontSize:11,color:C.blue,fontFamily:font.mono,textTransform:"uppercase",letterSpacing:"0.08em"}}>Einstieg · Absolute Anfänger</div>
                <h2 style={{fontSize:20,fontWeight:600,color:C.text,lineHeight:1.3}}>Kerzencharts lesen lernen – das Fundament des Tradings</h2>
                <p style={{fontSize:15,lineHeight:1.8,color:C.textMuted}}>Bevor du den ersten Trade machst, lerne die <strong style={{color:C.text}}>Sprache des Marktes</strong>. Jede Kerze erzählt dir in Echtzeit was Käufer und Verkäufer denken.</p>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {["Kein Vorwissen nötig","~10 Min. Lesezeit","Direkt zum Quiz danach"].map(t=>(
                    <span key={t} style={{fontSize:12,padding:"3px 10px",borderRadius:20,background:C.blueBg,color:C.blue,border:`1px solid ${C.blueBdr}`,fontFamily:font.mono}}>{t}</span>
                  ))}
                </div>
              </div>

              <div style={{padding:"20px",borderRadius:10,background:C.surface,border:`1.5px solid ${C.border}`}}>
                <div style={{fontSize:15,fontWeight:600,color:C.text,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{background:C.blueBg,color:C.blue,borderRadius:6,padding:"2px 10px",fontSize:12,fontFamily:font.mono,border:`1px solid ${C.blueBdr}`}}>01</span>Was ist eine Kerze?
                </div>
                <p style={{fontSize:14,lineHeight:1.8,color:C.textMuted,marginBottom:16}}>Eine <strong style={{color:C.text}}>Kerze</strong> zeigt die Kursbewegung in einem Zeitraum – z.B. einem Tag. Sie besteht aus vier Werten:</p>
                <div style={{display:"flex",gap:24,flexWrap:"wrap",alignItems:"flex-start",marginBottom:16}}>
                  {[{col:"#3fb950",label:"Grüne Kerze",sub:"Schluss > Eröffnung · Käufer gewinnen ↑",yO:120,yC:40},{col:"#f85149",label:"Rote Kerze",sub:"Schluss < Eröffnung · Verkäufer gewinnen ↓",yO:40,yC:120}].map(({col,label,sub,yO,yC})=>(
                    <div key={label} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                      <div style={{fontSize:12,fontWeight:600,color:col}}>{label}</div>
                      <svg width="80" height="160" viewBox="0 0 80 160">
                        <line x1="40" x2="40" y1="10" y2="40" stroke="#484f58" strokeWidth="2"/>
                        <rect x="20" y="40" width="40" height="80" fill={col} stroke={col==="#3fb950"?"#238636":"#da3633"} strokeWidth="1" rx="2"/>
                        <line x1="40" x2="40" y1="120" y2="148" stroke="#484f58" strokeWidth="2"/>
                        <text x="68" y="14" fontSize="9" fill="#7d8590" fontFamily="monospace">Hoch</text>
                        <text x="68" y={yO===40?44:124} fontSize="9" fill={col} fontFamily="monospace">{yO===40?"Schluss":"Eröffnung"}</text>
                        <text x="68" y={yO===40?124:44} fontSize="9" fill={col} fontFamily="monospace">{yO===40?"Eröffnung":"Schluss"}</text>
                        <text x="68" y="150" fontSize="9" fill="#7d8590" fontFamily="monospace">Tief</text>
                      </svg>
                      <div style={{fontSize:11,color:col,fontFamily:font.mono,textAlign:"center"}}>{sub}</div>
                    </div>
                  ))}
                  <div style={{flex:1,minWidth:200,display:"grid",gap:8}}>
                    {[
                      {t:"Hoch",e:"Der höchste Kurs im Zeitraum – Spitze des oberen Dochts.",a:"#58a6ff",svg:<svg width="36" height="60" viewBox="0 0 36 60"><line x1="18" x2="18" y1="4" y2="14" stroke="#58a6ff" strokeWidth="2.5"/><rect x="9" y="14" width="18" height="24" fill="#3fb950" stroke="#238636" strokeWidth="0.5" rx="1.5" opacity="0.25"/><line x1="18" x2="18" y1="38" y2="52" stroke="#484f58" strokeWidth="1.5" opacity="0.3"/><circle cx="18" cy="4" r="3" fill="#58a6ff"/></svg>},
                      {t:"Oberer Docht",e:"Vom Körper bis zum Hoch. Käufer hochgetrieben, Verkäufer zurückgedrückt.",a:"#f85149",svg:<svg width="36" height="60" viewBox="0 0 36 60"><line x1="18" x2="18" y1="4" y2="14" stroke="#f85149" strokeWidth="2.5"/><rect x="9" y="14" width="18" height="24" fill="#3fb950" opacity="0.25" rx="1.5"/><line x1="18" x2="18" y1="38" y2="52" stroke="#484f58" strokeWidth="1.5" opacity="0.3"/><rect x="14" y="2" width="8" height="14" rx="2" fill="none" stroke="#f85149" strokeWidth="1.5" strokeDasharray="3,2"/></svg>},
                      {t:"Körper",e:"Bereich zwischen Eröffnung und Schluss – die Hauptbewegung. Grün = Käufer, Rot = Verkäufer.",a:"#3fb950",svg:<svg width="36" height="60" viewBox="0 0 36 60"><line x1="18" x2="18" y1="4" y2="14" stroke="#484f58" strokeWidth="1.5" opacity="0.3"/><rect x="9" y="14" width="18" height="24" fill="#3fb950" stroke="#238636" strokeWidth="0.5" rx="1.5"/><line x1="18" x2="18" y1="38" y2="52" stroke="#484f58" strokeWidth="1.5" opacity="0.3"/><rect x="6" y="11" width="24" height="30" rx="3" fill="none" stroke="#3fb950" strokeWidth="2" strokeDasharray="4,2"/></svg>},
                      {t:"Unterer Docht",e:"Vom Körper bis zum Tief. Verkäufer gedrückt, Käufer zurückgekauft.",a:"#e3b341",svg:<svg width="36" height="60" viewBox="0 0 36 60"><line x1="18" x2="18" y1="4" y2="14" stroke="#484f58" strokeWidth="1.5" opacity="0.3"/><rect x="9" y="14" width="18" height="24" fill="#3fb950" opacity="0.25" rx="1.5"/><line x1="18" x2="18" y1="38" y2="52" stroke="#e3b341" strokeWidth="2.5"/><rect x="14" y="36" width="8" height="18" rx="2" fill="none" stroke="#e3b341" strokeWidth="1.5" strokeDasharray="3,2"/></svg>},
                      {t:"Tief",e:"Der tiefste Kurs im Zeitraum – Spitze des unteren Dochts.",a:"#7d8590",svg:<svg width="36" height="60" viewBox="0 0 36 60"><line x1="18" x2="18" y1="4" y2="14" stroke="#484f58" strokeWidth="1.5" opacity="0.3"/><rect x="9" y="14" width="18" height="24" fill="#3fb950" opacity="0.25" rx="1.5"/><line x1="18" x2="18" y1="38" y2="52" stroke="#484f58" strokeWidth="1.5" opacity="0.3"/><circle cx="18" cy="52" r="3" fill="#7d8590"/></svg>},
                    ].map(({t,e,a,svg})=>(
                      <div key={t} style={{padding:"10px 12px",borderRadius:6,background:C.surfaceHi,border:`1px solid ${C.border}`,display:"flex",gap:12,alignItems:"center"}}>
                        <div style={{flexShrink:0,background:C.bg,borderRadius:6,padding:"4px",border:`1px solid ${C.border}`,width:48,height:68,display:"flex",alignItems:"center",justifyContent:"center"}}>{svg}</div>
                        <div><div style={{fontSize:12,fontWeight:600,color:a,marginBottom:2}}>{t}</div><div style={{fontSize:12,color:C.textMuted,lineHeight:1.5}}>{e}</div></div>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{padding:"10px 14px",borderRadius:6,background:C.yellowBg,border:`1px solid ${C.yellowBdr}`,fontSize:13,color:C.yellow}}>💡 <strong>Merksatz:</strong> Grüne Kerze = Käufer haben gewonnen. Rote Kerze = Verkäufer haben gewonnen.</div>
              </div>

              <div style={{padding:"20px",borderRadius:10,background:C.surface,border:`1.5px solid ${C.border}`}}>
                <div style={{fontSize:15,fontWeight:600,color:C.text,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{background:C.blueBg,color:C.blue,borderRadius:6,padding:"2px 10px",fontSize:12,fontFamily:font.mono,border:`1px solid ${C.blueBdr}`}}>02</span>Warum Kerzenanalyse?
                </div>
                <div style={{display:"grid",gap:10}}>
                  {[{e:"😰",t:"Panik der Verkäufer",d:"Lange untere Dochte: Kurs wurde abverkauft, Käufer haben zurückgeschlagen – mögliche Bodenbildung."},{e:"🤑",t:"Erschöpfung der Käufer",d:"Lange obere Dochte: Kurs hochgekauft, Verkäufer haben zurückgedrückt – mögliche Topbildung."},{e:"⚖️",t:"Gleichgewicht",d:"Kleine Körper (Doji): Käufer und Verkäufer gleich stark – Unentschlossenheit vor großer Bewegung."},{e:"💪",t:"Dominanz",d:"Große Körper ohne Dochte (Marubozu): Eine Seite dominiert komplett."}].map(({e,t,d})=>(
                    <div key={t} style={{padding:"12px 14px",borderRadius:8,background:C.surfaceHi,border:`1px solid ${C.border}`,display:"flex",gap:12,alignItems:"flex-start"}}>
                      <span style={{fontSize:20,flexShrink:0}}>{e}</span>
                      <div><div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:3}}>{t}</div><div style={{fontSize:13,color:C.textMuted,lineHeight:1.6}}>{d}</div></div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{padding:"20px",borderRadius:10,background:C.surface,border:`1.5px solid ${C.border}`}}>
                <div style={{fontSize:15,fontWeight:600,color:C.text,marginBottom:14,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{background:C.blueBg,color:C.blue,borderRadius:6,padding:"2px 10px",fontSize:12,fontFamily:font.mono,border:`1px solid ${C.blueBdr}`}}>03</span>Glossar
                </div>
                <div style={{display:"grid",gap:8}}>
                  {[["Bullish 🟢","Steigende Erwartung – Käufer sind aktiv."],["Bearish 🔴","Fallende Erwartung – Verkäufer sind aktiv."],["Trend","Allgemeine Richtung: Aufwärtstrend (steigt), Abwärtstrend (fällt), Seitwärts."],["Aufwärtstrend","Jedes neue Hoch und Tief ist höher als das vorherige."],["Abwärtstrend","Jedes neue Hoch und Tief ist tiefer als das vorherige."],["Support","Zone wo Käufer wiederholt kaufen – Kurs prallt nach oben ab."],["Widerstand","Zone wo Verkäufer aktiv werden – Kurs dreht nach unten."],["Reversal","Trendwechsel – z.B. von Abwärts- zu Aufwärtstrend."],["Bestätigung","Folgekerze die das Signal bestätigt – erst dann handeln."],["Volumen","Anzahl gehandelter Wertpapiere. Hohes Volumen = stärkeres Signal."]].map(([b,e])=>(
                    <div key={b} style={{display:"grid",gridTemplateColumns:"160px 1fr",gap:12,padding:"10px 14px",borderRadius:6,background:C.surfaceHi,border:`1px solid ${C.border}`,alignItems:"baseline"}}>
                      <div style={{fontSize:13,fontWeight:600,color:C.text,fontFamily:font.mono}}>{b}</div>
                      <div style={{fontSize:13,color:C.textMuted,lineHeight:1.6}}>{e}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{padding:"20px",borderRadius:10,background:C.surface,border:`1.5px solid ${C.border}`}}>
                <div style={{fontSize:15,fontWeight:600,color:C.text,marginBottom:6,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{background:C.blueBg,color:C.blue,borderRadius:6,padding:"2px 10px",fontSize:12,fontFamily:font.mono,border:`1px solid ${C.blueBdr}`}}>04</span>Welche Muster gibt es?
                </div>
                <p style={{fontSize:14,color:C.textMuted,lineHeight:1.8,marginBottom:14}}>Es gibt <strong style={{color:C.text}}>vier Grundtypen</strong> von Kerzenmustern:</p>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
                  {[{t:"🟢 Bullish Reversal",d:"Abwärtstrend dreht nach oben. Beispiele: Hammer, Inverted Hammer, Dragonfly Doji",c:C.green,bg:C.greenBg,b:C.greenBdr},{t:"🔴 Bearish Reversal",d:"Aufwärtstrend dreht nach unten. Beispiele: Shooting Star, Hanging Man, Gravestone Doji",c:C.red,bg:C.redBg,b:C.redBdr},{t:"⚪ Neutral",d:"Unentschlossenheit – Folgekerze entscheidet. Beispiele: Doji, Spinning Top",c:C.textMuted,bg:C.surfaceHi,b:C.border},{t:"📈 Continuation",d:"Trend setzt sich fort. Beispiele: Marubozu grün/rot",c:C.blue,bg:C.blueBg,b:C.blueBdr}].map(({t,d,c,bg,b})=>(
                    <div key={t} style={{padding:"14px",borderRadius:8,background:bg,border:`1px solid ${b}`}}>
                      <div style={{fontSize:13,fontWeight:600,color:c,marginBottom:6}}>{t}</div>
                      <div style={{fontSize:12,color:C.textMuted,lineHeight:1.6}}>{d}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{padding:"24px",borderRadius:10,background:C.greenBg,border:`1.5px solid ${C.greenBdr}`,textAlign:"center",display:"grid",gap:12}}>
                <div style={{fontSize:18,fontWeight:600,color:C.green}}>Bereit für den Quiz? 🚀</div>
                <p style={{fontSize:14,color:C.textMuted,lineHeight:1.6}}>Du kennst jetzt die Grundlagen. Teste dein Wissen mit <strong style={{color:C.text}}>10 Fragen</strong>.</p>
                <div><button className="cta-btn" onClick={()=>setMode("quiz")}>Quiz jetzt starten →</button></div>
              </div>
            </div>
          )}

          {/* Flashcards */}
          {mode==="flash"&&(
            <>
              <div className="info-box" style={{padding:"10px 16px",borderRadius:8}}>📚 <strong style={{color:C.text}}>Alle {candles.length} Muster auf einen Blick</strong> – ideal zur Wiederholung.</div>
              <div className="flashcards-grid" style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:14}}>
                {candles.map((c,i)=>(
                  <div key={i} className="flash-card">
                    <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:12}}>
                      <div style={{flexShrink:0,background:C.surfaceHi,borderRadius:8,padding:"8px 6px",border:`1px solid ${C.border}`}}>{c.svg&&<c.svg/>}</div>
                      <div style={{flex:1,minWidth:0}}>
                        <div style={{fontWeight:600,fontSize:15}}>{displayName(c)}</div>
                        {c.merk&&<div style={{fontSize:13,color:C.yellow,lineHeight:1.5}}>{c.merk}</div>}
                        <div style={{marginTop:6,display:"flex",gap:6,flexWrap:"wrap"}}>
                          <span className={`tag ${colorTag(c.typ)}`}>{c.typ}</span>
                          <span className="tag tag-gray">{isNeutral(c.typ)?"— neutral":`★ ${c.staerke}/10`}</span>
                        </div>
                      </div>
                    </div>
                    <div style={{height:1,background:C.border,margin:"12px 0"}}/>
                    <div style={{display:"grid",gap:8}}>
                      <InfoRow label="Markt" value={c.markt}/>
                      <InfoRow label="Beschreibung" value={c.beschreibung}/>
                      <InfoRow label="Bedeutung" value={c.bedeutung}/>
                      <InfoRow label="Bestätigung" value={c.bestaetigung}/>
                      <InfoRow label="Strategie" value={c.strategie}/>
                    </div>
                    <ContextChart candle={c}/>
                    {c.erklaerung&&<div className="info-box" style={{marginTop:10}}><span style={{fontWeight:600}}>Erklärung: </span>{c.erklaerung}</div>}
                  </div>
                ))}
              </div>
              <div style={{padding:"24px",borderRadius:10,background:C.greenBg,border:`1.5px solid ${C.greenBdr}`,textAlign:"center",display:"grid",gap:12,marginTop:4}}>
                <div style={{fontSize:18,fontWeight:600,color:C.green}}>Wissen testen? 🎯</div>
                <p style={{fontSize:14,color:C.textMuted,lineHeight:1.6}}>Du hast alle Muster gesehen – jetzt der Praxistest.</p>
                <div><button className="cta-btn" onClick={()=>setMode("quiz")}>Quiz jetzt starten →</button></div>
              </div>
            </>
          )}

          {/* Review Done */}
          {showReviewDone&&mode==="quiz"&&(
            <div className="card" style={{border:`1px solid ${C.greenBdr}`,background:C.greenBg}}>
              <div style={{display:"flex",flexDirection:"column",gap:12,alignItems:"flex-start"}}>
                <div style={{fontSize:20}}>🏆</div>
                <div style={{fontWeight:600,fontSize:15,color:C.green}}>Stark – du hast deine Fehler verbessert!</div>
                <button className="cta-btn" style={{fontSize:13,padding:"10px 20px"}} onClick={()=>{setShowReviewDone(false);resetAll();}}>Neue Runde →</button>
              </div>
            </div>
          )}

          {/* Rundenübersicht */}
          {lastRound&&mode==="quiz"&&(
            <div className="card">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontWeight:600,fontSize:15}}>Rundenübersicht</div>
                  <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>{lastRound.correctCount}/{RS} richtig</div>
                </div>
                <div style={{display:"flex",gap:10,alignItems:"center"}}>
                  <div style={{fontFamily:font.mono,fontSize:20,fontWeight:600,color:lastRound.percent>=70?C.green:lastRound.percent>=40?C.yellow:C.red}}>{lastRound.percent}%</div>
                  <button className="nav-btn secondary" style={{opacity:lastRound.entries.filter(e=>!e.isCorrect).length===0?.4:1}} disabled={lastRound.entries.filter(e=>!e.isCorrect).length===0} onClick={startReview}>Falsche wiederholen</button>
                </div>
              </div>
              <div style={{overflowX:"auto"}}>
                <table>
                  <thead><tr><th>#</th><th>Kerze</th><th>Frage</th><th>OK</th><th>Pkt</th></tr></thead>
                  <tbody>
                    {lastRound.entries.map((e,idx)=>(
                      <tr key={e.nr}>
                        <td style={{color:C.textMuted,fontFamily:font.mono,fontSize:11}}>{idx+1}</td>
                        <td style={{fontSize:13}}>{e.question?.item?displayName(e.question.item):""}</td>
                        <td style={{color:C.textMuted,fontSize:11}}>{(e.question?.prompt||"").slice(0,52)}…</td>
                        <td style={{color:e.isCorrect?C.green:C.red,fontFamily:font.mono,fontSize:13}}>{e.isCorrect?"✓":"✗"}</td>
                        <td style={{fontFamily:font.mono,fontSize:11,color:e.isCorrect?C.green:C.textMuted}}>{e.points}</td>
                      </tr>
                    ))}
                    <tr style={{fontWeight:600}}>
                      <td colSpan={3} style={{color:C.textMuted,paddingTop:12}}>Gesamt</td>
                      <td style={{paddingTop:12,color:lastRound.percent>=70?C.green:lastRound.percent>=40?C.yellow:C.red}}>{lastRound.correctCount}/{RS}</td>
                      <td style={{paddingTop:12,fontFamily:font.mono}}>{lastRound.percent}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* CTA nach Runde */}
          {lastRound&&mode==="quiz"&&(
            <div style={{padding:"20px 24px",borderRadius:10,background:C.greenBg,border:`1.5px solid ${C.greenBdr}`,display:"flex",alignItems:"center",justifyContent:"space-between",flexWrap:"wrap",gap:14}}>
              <div>
                <div style={{fontSize:15,fontWeight:600,color:C.green}}>Nächste Runde 🔄</div>
                <div style={{fontSize:13,color:C.textMuted,marginTop:3}}>Jede Runde ist eine neue Chance auf Bronze, Silber oder Gold.</div>
              </div>
              <button className="cta-btn" onClick={()=>{setLastRound(null);setRound({queue:buildRound(RS),index:0});setAnswer(null);}}>Neue Runde →</button>
            </div>
          )}

          {/* SEO + FAQ */}
          <section style={{display:"grid",gap:18,background:C.surfaceHi,borderRadius:10,padding:20,border:`1px solid ${C.border}`}}>
            <div>
              <div style={{fontSize:20,fontWeight:600,marginBottom:10}}>Was sind Candlestick Muster?</div>
              <p style={{fontSize:15,lineHeight:1.8,color:C.textMuted}}>Candlestick Muster, auch <strong style={{color:C.text}}>Kerzenmuster</strong> genannt, sind ein zentrales Werkzeug der technischen Analyse. Sie helfen Tradern dabei, das Verhalten von Käufern und Verkäufern im Chart besser zu verstehen und mögliche Trendwechsel frühzeitig zu erkennen.</p>
            </div>
            <div>
              <div style={{fontSize:15,fontWeight:600,marginBottom:8}}>Warum ist ein Candlestick Quiz sinnvoll?</div>
              <p style={{fontSize:15,lineHeight:1.8,color:C.textMuted}}>Viele Trader kennen Begriffe wie <strong style={{color:C.text}}>Hammer</strong>, <strong style={{color:C.text}}>Doji</strong> oder <strong style={{color:C.text}}>Shooting Star</strong>, tun sich aber schwer diese Muster im echten Chart schnell zu erkennen. Ein interaktives Quiz hilft dir dabei, Kerzenmuster nicht nur theoretisch zu lernen sondern sie visuell zu trainieren – genau so wie es professionelle Trader tun.</p>
            </div>
            <div>
              <div style={{fontSize:15,fontWeight:600,marginBottom:8}}>Für wen ist dieses Trading Quiz geeignet?</div>
              <p style={{fontSize:15,lineHeight:1.8,color:C.textMuted}}>Dieses Quiz eignet sich für <strong style={{color:C.text}}>Anfänger</strong> die Trading von Grund auf lernen möchten, ebenso wie für fortgeschrittene Trader die ihr Wissen zu Candlestick Patterns auffrischen wollen. Besonders im <strong style={{color:C.text}}>Swing Trading</strong> ist das Verständnis von Kerzenmustern ein wertvoller Baustein für bessere Handelsentscheidungen.</p>
            </div>
          </section>

          <div style={{background:C.surfaceHi,borderRadius:10,padding:16,border:`1px solid ${C.border}`,display:"grid",gap:14}}>
            <div style={{fontSize:20,fontWeight:600}}>Häufige Fragen</div>
            {[["Was sind Candlestick Muster?","Kerzenmuster zeigen Kursbewegungen grafisch. Patterns wie Hammer, Doji oder Shooting Star helfen Tradern Trendwechsel zu erkennen."],["Ist das Quiz kostenlos?","Ja, vollständig kostenlos und ohne Anmeldung nutzbar."],["Wie funktioniert das Zertifikat?","Nach jeder Runde: Bronze bei 70%+, Silber bei 80%+, Gold bei 90%+. Du kannst beliebig viele Runden spielen."],["Unterschied Hammer und Hanging Man?","Beide sehen identisch aus. Hammer nach Abwärtstrend = bullisch. Hanging Man nach Aufwärtstrend = bärisch."],["Wie wird ein Muster bestätigt?","Durch die Folgekerze die die Richtung bestätigt. RSI und Volumen helfen zusätzlich."]].map(([q,a])=><FaqItem key={q} q={q} a={a}/>)}
          </div>

          <div style={{display:"flex",justifyContent:"flex-end"}}>
            <button className="nav-btn muted" onClick={()=>setShowFeedback(v=>!v)}>⚑ Fehler melden</button>
          </div>
          {showFeedback&&(
            <div className="card">
              <div style={{fontWeight:600,fontSize:15,marginBottom:12}}>Fehler melden</div>
              <a href="mailto:gaucho0@web.de?subject=Fehler%20im%20Candlestick%20Quiz" style={{display:"inline-block",padding:"9px 18px",borderRadius:6,background:C.surfaceHi,border:`1px solid ${C.border}`,color:C.text,fontSize:13,fontWeight:600,textDecoration:"none"}}>✉ E-Mail schreiben</a>
            </div>
          )}

          <footer style={{fontSize:11,color:C.textDim,fontFamily:font.mono,lineHeight:1.8,paddingTop:8,borderTop:`1px solid ${C.border}`}}>
            Signalstärke 1–10 · Neutral = Richtung erst durch Folgekerze · Wirkungsdauer in Tagen
          </footer>
        </div>

        <hr style={{marginTop:40,opacity:.2}}/>
        <div style={{fontSize:11,opacity:.7,padding:20}}>
          <strong>Impressum</strong><br/>Ludolf Schnittger · Mexikoring 15 · 22297 Hamburg · gaucho0@web.de<br/>
          Die Inhalte dienen ausschließlich Lern- und Informationszwecken. Keine Anlageberatung.<br/>
          © {new Date().getFullYear()} Candlestick Quiz
        </div>

        {/* Reset Popup */}
        {showReset&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:999,padding:20}}>
            <div style={{background:C.surface,border:`1px solid ${C.redBdr}`,borderRadius:12,padding:24,maxWidth:360,width:"100%",display:"grid",gap:14}}>
              <div style={{fontSize:15,fontWeight:600}}>Alles zurücksetzen?</div>
              <p style={{fontSize:15,color:C.textMuted,lineHeight:1.6}}>Punktestand und Lernhistorie werden gelöscht.</p>
              <div style={{display:"flex",gap:10}}>
                <button className="nav-btn danger" style={{flex:1}} onClick={()=>{resetAll();setShowReset(false);}}>Ja, löschen</button>
                <button className="nav-btn" style={{flex:1}} onClick={()=>setShowReset(false)}>Abbrechen</button>
              </div>
            </div>
          </div>
        )}

        {/* Zertifikat Popup */}
        {showCert&&(
          <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,padding:20}}>
            <div style={{background:C.surface,border:`1px solid ${C.greenBdr}`,borderRadius:14,padding:28,maxWidth:440,width:"100%",display:"grid",gap:16,maxHeight:"90vh",overflowY:"auto"}}>
              {!certSent?(
                <>
                  <div style={{fontSize:32,textAlign:"center"}}>{certLevel.split(" ")[0]}</div>
                  <div style={{fontSize:20,fontWeight:600,textAlign:"center",color:C.green}}>Glückwunsch – {certLevel} erreicht!</div>
                  <p style={{fontSize:15,color:C.textMuted,lineHeight:1.6,textAlign:"center"}}>Füll das Formular aus – ich schicke dir dein <strong style={{color:C.text}}>Zertifikat</strong> zu.</p>
                  {[{l:"Vorname",v:certFirst,s:setCertFirst,p:"z. B. Max"},{l:"Nachname",v:certLast,s:setCertLast,p:"z. B. Mustermann"},{l:"E-Mail",v:certEmail,s:setCertEmail,p:"deine@email.de",t:"email"}].map(({l,v,s,p,t})=>(
                    <div key={l} style={{display:"grid",gap:5}}>
                      <label style={{fontSize:11,color:C.textMuted,fontWeight:600}}>{l} <span style={{color:C.red}}>*</span></label>
                      <input type={t||"text"} placeholder={p} value={v} onChange={e=>s(e.target.value)} style={inp}/>
                    </div>
                  ))}
                  <label style={{display:"flex",alignItems:"flex-start",gap:10,fontSize:11,color:C.textMuted,cursor:"pointer"}}>
                    <input type="checkbox" checked={certPrivacy} onChange={e=>setCertPrivacy(e.target.checked)} style={{marginTop:2,flexShrink:0}}/>
                    Ich stimme zu, dass meine Daten zum Versand des Zertifikats verwendet werden.
                  </label>
                  <div style={{display:"flex",gap:10}}>
                    <button className="nav-btn primary" style={{flex:1,opacity:(!certFirst||!certLast||!certEmail||!certPrivacy)?.4:1}}
                      disabled={!certFirst||!certLast||!certEmail||!certPrivacy}
                      onClick={async()=>{
                        try{
                          await fetch("https://formspree.io/f/mkopzqqz",{
                            method:"POST",
                            headers:{"Content-Type":"application/json"},
                            body:JSON.stringify({
                              vorname:certFirst,
                              nachname:certLast,
                              email:certEmail,
                              zertifikat:certLevel,
                              datum:new Date().toLocaleDateString("de-DE"),
                              _subject:`Zertifikat ${certLevel} – ${certFirst} ${certLast}`,
                            })
                          });
                        }catch(e){console.error(e);}
                        setCertSent(true);
                      }}>Zertifikat anfordern →</button>
                    <button className="nav-btn" onClick={()=>setShowCert(false)}>Schließen</button>
                  </div>
                </>
              ):(
                <>
                  <div style={{fontSize:32,textAlign:"center"}}>✉️</div>
                  <div style={{fontSize:15,fontWeight:600,textAlign:"center",color:C.green}}>Anfrage gesendet!</div>
                  <p style={{fontSize:15,color:C.textMuted,lineHeight:1.6,textAlign:"center"}}>Ich schicke dir dein <strong style={{color:C.text}}>{certLevel} Zertifikat</strong> so schnell wie möglich an <strong style={{color:C.text}}>{certEmail}</strong>.</p>
                  <button className="nav-btn primary" onClick={()=>{setShowCert(false);setCertSent(false);setCertEmail("");setCertFirst("");setCertLast("");setCertPrivacy(false);}}>Schließen</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
