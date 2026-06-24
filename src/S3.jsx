import { useState, useMemo, createContext, useContext } from "react";
import { jsPDF } from "jspdf";

const StudyCtx = createContext({ studyMode: false });
const FONT = "Plus Jakarta Sans, sans-serif";

const EXCH = {
  lac_semi:   { prot:8,  lip:4, hc:12 },
  carne_baja: { prot:7,  lip:2, hc:0  },
  carne_mod:  { prot:7,  lip:5, hc:0  },
  carne_alta: { prot:7,  lip:8, hc:0  },
  legum:      { prot:7,  lip:1, hc:15 },
  cereal:     { prot:2,  lip:1, hc:15 },
  verdura:    { prot:2,  lip:0, hc:5  },
  fruta:      { prot:0,  lip:0, hc:15 },
  grasa:      { prot:0,  lip:5, hc:0  },
  acces:      { prot:0,  lip:0, hc:10 },
};

const GROUPS_ES = [
  {key:"lac_semi",   label:"Lacteos semidescremados", cat:"Lacteos"},
  {key:"carne_baja", label:"Carnes bajas en grasa",   cat:"Carnes"},
  {key:"carne_mod",  label:"Carnes moderadas en grasa",cat:"Carnes"},
  {key:"carne_alta", label:"Carnes altas en grasa",   cat:"Carnes"},
  {key:"legum",      label:"Leguminosas",              cat:"Leguminosas"},
  {key:"cereal",     label:"Cereales",                 cat:"Cereales"},
  {key:"verdura",    label:"Verduras",                 cat:"Verduras"},
  {key:"fruta",      label:"Frutas",                   cat:"Frutas"},
  {key:"grasa",      label:"Grasas",                   cat:"Grasas"},
  {key:"acces",      label:"Accesorios",               cat:"Accesorios"},
];
const GROUPS_EN = [
  {key:"lac_semi",   label:"Semi-skimmed dairy",  cat:"Dairy"},
  {key:"carne_baja", label:"Lean meats",          cat:"Meats"},
  {key:"carne_mod",  label:"Medium-fat meats",    cat:"Meats"},
  {key:"carne_alta", label:"High-fat meats",      cat:"Meats"},
  {key:"legum",      label:"Legumes",             cat:"Legumes"},
  {key:"cereal",     label:"Cereals",             cat:"Cereals"},
  {key:"verdura",    label:"Vegetables",          cat:"Vegetables"},
  {key:"fruta",      label:"Fruits",              cat:"Fruits"},
  {key:"grasa",      label:"Fats",                cat:"Fats"},
  {key:"acces",      label:"Accessories",         cat:"Accessories"},
];

const CAT_COLOR = {
  Lacteos:{bg:"#D4E3FF",tx:"#0C447C"},   Dairy:{bg:"#D4E3FF",tx:"#0C447C"},
  Carnes:{bg:"#FAEEDA",tx:"#633806"},    Meats:{bg:"#FAEEDA",tx:"#633806"},
  Leguminosas:{bg:"#E1F5EE",tx:"#085041"}, Legumes:{bg:"#E1F5EE",tx:"#085041"},
  Cereales:{bg:"#FEF9E7",tx:"#7D3C98"}, Cereals:{bg:"#FEF9E7",tx:"#7D3C98"},
  Verduras:{bg:"#EAF3DE",tx:"#27500A"}, Vegetables:{bg:"#EAF3DE",tx:"#27500A"},
  Frutas:{bg:"#FBEAF0",tx:"#72243E"},   Fruits:{bg:"#FBEAF0",tx:"#72243E"},
  Grasas:{bg:"#FCEBEB",tx:"#A32D2D"},   Fats:{bg:"#FCEBEB",tx:"#A32D2D"},
  Accesorios:{bg:"#F5F7FF",tx:"#3A5BA0"}, Accessories:{bg:"#F5F7FF",tx:"#3A5BA0"},
};

const MEAL_COLOR = {
  D:{bg:"#EFF6FF",tx:"#1E2D4E"},
  A:{bg:"#D4E3FF",tx:"#0C447C"},
  C:{bg:"#FAEEDA",tx:"#633806"},
  M:{bg:"#FBEAF0",tx:"#72243E"},
  M2:{bg:"#E1F5EE",tx:"#085041"},
};

const DEFAULT_EXC = {
  lac_semi:   {total:1, D:1,A:0,C:0,M:0,M2:0},
  carne_baja: {total:3, D:0,A:2,C:1,M:0,M2:0},
  carne_mod:  {total:1, D:0,A:1,C:0,M:0,M2:0},
  carne_alta: {total:0, D:0,A:0,C:0,M:0,M2:0},
  legum:      {total:1, D:0,A:1,C:0,M:0,M2:0},
  cereal:     {total:6, D:2,A:2,C:2,M:0,M2:0},
  verdura:    {total:3, D:0,A:2,C:1,M:0,M2:0},
  fruta:      {total:5, D:1,A:1,C:1,M:2,M2:0},
  grasa:      {total:6, D:2,A:3,C:1,M:0,M2:0},
  acces:      {total:0, D:0,A:0,C:0,M:0,M2:0},
};

const DEFAULT_PATIENT = {
  caseName:"", sex:"F", weightLb:145, heightIn:67, age:28, goal:"mantener",
  condition:"none", protPct:17, lipPct:30, hcPct:53, mealTimes:4,
  protG:67, lipG:53, hcG:210, vet:1582,
};

function adecColor(pct) {
  if (pct >= 90 && pct <= 110) return { bg:"#EFF6FF", tx:"#2563EB" };
  if (pct >= 75) return { bg:"#FAEEDA", tx:"#854F0B" };
  return { bg:"#FCEBEB", tx:"#A32D2D" };
}

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function NumButton({ value, onChange }) {
  return (
    <div style={{display:"flex", alignItems:"center", gap:3, justifyContent:"center"}}>
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        style={{width:20, height:20, borderRadius:4, border:"0.5px solid #D4E3FF", background:"#F5F7FF", color:"#2563EB", fontSize:14, fontWeight:600, cursor:"pointer", padding:0, lineHeight:1}}
      >-</button>
      <div style={{width:30, height:26, background:"#EFF6FF", border:"1px solid #2563EB", borderRadius:5, fontWeight:600, fontSize:12, color:"#1E2D4E", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FONT}}>
        {value}
      </div>
      <button
        onClick={() => onChange(value + 1)}
        style={{width:20, height:20, borderRadius:4, border:"0.5px solid #D4E3FF", background:"#F5F7FF", color:"#2563EB", fontSize:14, fontWeight:600, cursor:"pointer", padding:0, lineHeight:1}}
      >+</button>
    </div>
  );
}

function CalcCell({ value, unit, highlight }) {
  return (
    <div style={{
      background: highlight ? "#EFF6FF" : "#FEF9E7",
      border: `0.5px solid ${highlight ? "#93C5FD" : "#e8d89a"}`,
      borderRadius:5, padding:"3px 8px", fontFamily:FONT, fontWeight:500,
      fontSize:12, color: highlight ? "#1E2D4E" : "#7D3C98",
      textAlign:"center", minWidth:36, display:"inline-block",
    }}>
      {value}{unit && <span style={{fontSize:10, marginLeft:2}}>{unit}</span>}
    </div>
  );
}

function KpiCard({ label, value, unit, sub, ok }) {
  return (
    <div style={{background:"#1E2D4E", border:"0.5px solid #2D4270", borderRadius:10, padding:"11px 14px"}}>
      <div style={{fontSize:9, fontWeight:500, color:"#93C5FD", textTransform:"uppercase", letterSpacing:"0.05em", fontFamily:FONT, marginBottom:5}}>{label}</div>
      <div style={{display:"flex", alignItems:"baseline", gap:4}}>
        <span style={{fontSize:20, fontWeight:500, color:"#E2E8F0", fontFamily:FONT}}>{value}</span>
        {unit && <span style={{fontSize:10, color:"#93C5FD", fontFamily:FONT}}>{unit}</span>}
      </div>
      {sub && <div style={{fontSize:10, color: ok ? "#4ade80" : "#93C5FD", marginTop:3, fontFamily:FONT}}>{sub}</div>}
    </div>
  );
}

function NatureCard({ isES, exchanges, totals }) {
  const lacProt   = EXCH.lac_semi.prot   * exchanges.lac_semi.total;
  const cbProt    = EXCH.carne_baja.prot * exchanges.carne_baja.total;
  const cmProt    = EXCH.carne_mod.prot  * (exchanges.carne_mod?.total || 0);
  const caProt    = EXCH.carne_alta.prot * (exchanges.carne_alta?.total || 0);
  const animalPct = totals.prot > 0 ? Math.round((lacProt + cbProt + cmProt + caProt) / totals.prot * 100) : 0;
  const vegFatPct = totals.lip  > 0 ? Math.round((EXCH.grasa.lip * exchanges.grasa.total) / totals.lip * 100) : 0;
  const sugarKcal = EXCH.acces.hc * exchanges.acces.total * 4;
  const sugarPct  = totals.kcal > 0 ? Math.round(sugarKcal / totals.kcal * 100) : 0;

  const stats = [
    { label: isES ? "Proteina animal"  : "Animal protein", value: animalPct, sub: isES ? "del total proteico" : "of total protein", color:"#2563EB" },
    { label: isES ? "Grasa vegetal"    : "Vegetable fat",  value: vegFatPct, sub: isES ? "del total lipidos"  : "of total lipids",  color:"#3A5BA0" },
    { label: isES ? "Azucares simples" : "Simple sugars",  value: sugarPct,  sub: isES ? "del VET"            : "of TDEE",          color: sugarPct === 0 ? "#22c55e" : "#A32D2D" },
  ];

  return (
    <div style={{background:"#fff", border:"0.5px solid #D4E3FF", borderRadius:12, padding:"16px 18px"}}>
      <div style={{fontSize:13, fontWeight:500, color:"#1E2D4E", marginBottom:14, fontFamily:FONT}}>
        {isES ? "Naturaleza de los nutrimentos" : "Nutrient origin"}
      </div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10}}>
        {stats.map(stat => (
          <div key={stat.label} style={{background:"#F5F7FF", border:"0.5px solid #D4E3FF", borderRadius:10, padding:"13px 14px"}}>
            <div style={{fontSize:9, fontWeight:500, color:"#3A5BA0", textTransform:"uppercase", letterSpacing:"0.05em", fontFamily:FONT, marginBottom:6}}>{stat.label}</div>
            <div style={{fontSize:24, fontWeight:500, color:stat.color, fontFamily:FONT}}>
              {stat.value}<span style={{fontSize:12, color:"#3A5BA0", marginLeft:2}}>%</span>
            </div>
            <div style={{fontSize:10, color:"#3A5BA0", marginTop:3, fontFamily:FONT}}>{stat.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AlertBox({ level, badge, explain, studyMode }) {
  const isError = level === "error";
  return (
    <div style={{
      padding:"10px 14px", borderRadius:8, display:"flex", alignItems:"flex-start", gap:10,
      background: isError ? "#FCEBEB" : "#FAEEDA",
      border: `0.5px solid ${isError ? "#F09595" : "#EF9F27"}`,
    }}>
      <span style={{fontSize:16, flexShrink:0}}>{isError ? "⚠" : "!"}</span>
      <div>
        <span style={{
          display:"inline-block", fontSize:11, fontWeight:600, padding:"2px 9px", borderRadius:20,
          background: isError ? "#FCEBEB" : "#FAEEDA",
          color: isError ? "#A32D2D" : "#854F0B",
          border: `0.5px solid ${isError ? "#F09595" : "#EF9F27"}`,
          fontFamily:FONT,
        }}>{badge}</span>
        {studyMode && explain && (
          <p style={{margin:"5px 0 0", fontSize:11, color: isError ? "#7F1D1D" : "#78350F", fontFamily:FONT, lineHeight:1.6}}>
            {explain}
          </p>
        )}
      </div>
    </div>
  );
}

function EquivPanel({isES}) {
  const [open, setOpen] = useState(false);
  const rows = [
    {g:isES?"Lacteos semidescremados":"Semi-skimmed dairy", prot:8, lip:4, hc:12, por:"240 ml"},
    {g:isES?"Carnes bajas en grasa":"Lean meats", prot:7, lip:2, hc:0, por:"90 g"},
    {g:isES?"Carnes moderadas":"Medium-fat meats", prot:7, lip:5, hc:0, por:"90 g"},
    {g:isES?"Carnes altas en grasa":"High-fat meats", prot:7, lip:8, hc:0, por:"90 g"},
    {g:isES?"Leguminosas":"Legumes", prot:7, lip:1, hc:15, por:isES?"1/2 taza":"1/2 cup"},
    {g:isES?"Cereales":"Cereals", prot:2, lip:1, hc:15, por:isES?"varía":"varies"},
    {g:isES?"Verduras":"Vegetables", prot:2, lip:0, hc:5, por:isES?"1/2 taza":"1/2 cup"},
    {g:isES?"Frutas":"Fruits", prot:0, lip:0, hc:15, por:isES?"varía":"varies"},
    {g:isES?"Grasas":"Fats", prot:0, lip:5, hc:0, por:isES?"1 cdita":"1 tsp"},
    {g:isES?"Accesorios":"Accessories", prot:0, lip:0, hc:10, por:isES?"varía":"varies"},
  ];
  return (
    <div style={{background:"#fff", border:"0.5px solid #D4E3FF", borderRadius:12, overflow:"hidden"}}>
      <div onClick={()=>setOpen(!open)} style={{padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", cursor:"pointer", borderBottom: open?"0.5px solid #D4E3FF":"none"}}>
        <span style={{fontSize:13, fontWeight:500, color:"#1E2D4E", fontFamily:FONT}}>{isES?"Equivalencias de alimentos":"Food equivalencies"}</span>
        <span style={{fontSize:14, color:"#3A5BA0"}}>{open?"▲":"▼"}</span>
      </div>
      {open && (
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%", borderCollapse:"collapse", fontFamily:FONT}}>
            <thead>
              <tr style={{background:"#F5F7FF"}}>
                {[isES?"Grupo":"Group", isES?"Porcion":"Portion", "Prot", isES?"Lip":"Fat", "HC"].map((h,i)=>(
                  <th key={i} style={{padding:"7px 12px", fontSize:10, fontWeight:500, color:"#3A5BA0", textTransform:"uppercase", letterSpacing:"0.05em", borderBottom:"0.5px solid #D4E3FF", textAlign:i===0?"left":"center"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r,i)=>(
                <tr key={i} style={{borderBottom:"0.5px solid #F0F4FF", background:i%2===0?"#fff":"#F9FBFF"}}>
                  <td style={{padding:"7px 12px", fontSize:12, color:"#1E2D4E", fontWeight:500}}>{r.g}</td>
                  <td style={{padding:"7px 12px", fontSize:11, color:"#3A5BA0", textAlign:"center"}}>{r.por}</td>
                  <td style={{padding:"7px 12px", textAlign:"center"}}><span style={{display:"inline-block", padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, background:"#EFF6FF", color:"#2563EB"}}>{r.prot}</span></td>
                  <td style={{padding:"7px 12px", textAlign:"center"}}><span style={{display:"inline-block", padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, background:"#FAEEDA", color:"#854F0B"}}>{r.lip}</span></td>
                  <td style={{padding:"7px 12px", textAlign:"center"}}><span style={{display:"inline-block", padding:"2px 8px", borderRadius:20, fontSize:11, fontWeight:600, background:"#D4E3FF", color:"#0C447C"}}>{r.hc}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{padding:"8px 16px", background:"#F5F7FF", fontSize:10, color:"#3A5BA0", fontFamily:FONT}}>{isES?"Valores por 1 intercambio · INCAP / USDA":"Values per 1 exchange · INCAP / USDA"}</div>
        </div>
      )}
    </div>
  );
}

function exportPDF(patient, exchanges, totals, isES, withStudy) {
  const doc = new jsPDF({unit:"mm", format:"a4"});
  const W=210, MG=14; let y=14;
  const NAVY=[30,45,78], BLUE=[37,99,235], WHITE=[255,255,255], GRAY=[90,100,120], LIGHT=[245,247,255];
  const PURPLE=[124,58,237], PURPLE_LIGHT=[245,240,255], PURPLE_MID=[76,29,149];
  const GREEN=[22,163,74], GREEN_LIGHT=[240,253,244];
  const ORANGE=[180,83,9], ORANGE_LIGHT=[255,251,235];
  const sf = (sz,st,col) => { doc.setFontSize(sz); doc.setFont("helvetica",st||"normal"); doc.setTextColor(...(col||NAVY)); };
  const rc = (x,yy,w,h,fill) => { doc.setFillColor(...fill); doc.setDrawColor(...fill); doc.roundedRect(x,yy,w,h,1,1,"F"); };
  const wkg = +(patient.weightLb*0.4536).toFixed(1);
  const hcm2 = +(patient.heightIn*2.54).toFixed(1);
  const vet = patient.vet||1582;
  const isF = patient.sex==="F";
  const geb = Math.round(isF?(655+9.6*wkg+1.9*hcm2-4.7*patient.age):(66+13.8*wkg+5*hcm2-6.8*patient.age));
  const kcalPerKg = {bajar:20,mantener:24,subir:28}[patient.goal||"mantener"];
  const dateStr = new Date().toLocaleDateString(isES?"es-ES":"en-US",{year:"numeric",month:"short",day:"numeric"});

  doc.setFillColor(...NAVY); doc.rect(0,0,W,22,"F");
  sf(15,"bold",WHITE); doc.text("nutrionally",MG,14);
  sf(10,"normal",[147,197,253]); doc.text("learn",MG+34,14);
  sf(8,"normal",[147,197,253]); doc.text(isES?"Plan Nutricional Educativo":"Educational Nutrition Plan",MG,19);
  doc.text(dateStr,W-MG,19,{align:"right"}); y=30;

  rc(MG,y,W-2*MG,13,LIGHT);
  [{l:isES?"Caso":"Case",v:patient.caseName||"—"},{l:isES?"Sexo":"Sex",v:patient.sex==="F"?(isES?"Fem":"F"):(isES?"Masc":"M")},{l:isES?"Peso":"Weight",v:wkg+"kg"},{l:isES?"Talla":"Height",v:hcm2+"cm"},{l:"VET",v:vet+"kcal"},{l:isES?"Cond.":"Cond.",v:patient.condition==="dm2"?"DM2":patient.condition==="obesity"?(isES?"Obeso":"Obese"):(isES?"Normal":"Normal")}].forEach((inf,i)=>{
    const x=MG+i*(W-2*MG)/6+1; sf(7,"normal",GRAY); doc.text(inf.l.toUpperCase(),x,y+4); sf(8,"bold",NAVY); doc.text(String(inf.v),x,y+10);
  }); y+=19;

  // ── HARRIS-BENEDICT SECTION (always shown) ──────────────────────────────
  sf(9,"bold",NAVY); doc.text(isES?"Calculo del Gasto Energetico Basal (GEB)":"Basal Energy Expenditure (BEE) Calculation",MG,y); y+=4;
  doc.setDrawColor(...BLUE); doc.setLineWidth(0.3); doc.line(MG,y,W-MG,y); y+=5;

  // Step 1 box — formula generic
  rc(MG,y,W-2*MG,9,LIGHT);
  sf(7,"bold",NAVY); doc.text(isES?"Paso 1 — Formula Harris-Benedict (1919)":"Step 1 — Harris-Benedict Formula (1919)",MG+2,y+3.5);
  sf(7,"normal",GRAY);
  const genericFormula = isF
    ? (isES?"GEB (mujer) = 655 + (9.6 x kg) + (1.9 x cm) - (4.7 x edad)":"BEE (female) = 655 + (9.6 x kg) + (1.9 x cm) - (4.7 x age)")
    : (isES?"GEB (hombre) = 66 + (13.8 x kg) + (5 x cm) - (6.8 x edad)":"BEE (male) = 66 + (13.8 x kg) + (5 x cm) - (6.8 x age)");
  doc.text(genericFormula,MG+2,y+7.5);
  y+=12;

  // Step 2 box — substituting values
  rc(MG,y,W-2*MG,11,PURPLE_LIGHT);
  sf(7,"bold",PURPLE_MID); doc.text(isES?"Paso 2 — Sustituyendo valores del paciente":"Step 2 — Substituting patient values",MG+2,y+4);
  sf(7,"normal",PURPLE_MID);
  const step2line = isF
    ? (isES
        ? `GEB = 655 + (9.6 x ${wkg}) + (1.9 x ${hcm2}) - (4.7 x ${patient.age})`
        : `BEE = 655 + (9.6 x ${wkg}) + (1.9 x ${hcm2}) - (4.7 x ${patient.age})`)
    : (isES
        ? `GEB = 66 + (13.8 x ${wkg}) + (5 x ${hcm2}) - (6.8 x ${patient.age})`
        : `BEE = 66 + (13.8 x ${wkg}) + (5 x ${hcm2}) - (6.8 x ${patient.age})`);
  doc.text(step2line,MG+2,y+8.5);
  y+=14;

  // Step 3 box — arithmetic breakdown
  rc(MG,y,W-2*MG,13,PURPLE_LIGHT);
  sf(7,"bold",PURPLE_MID); doc.text(isES?"Paso 3 — Operaciones":"Step 3 — Arithmetic",MG+2,y+4);
  sf(7,"normal",PURPLE_MID);
  const t1 = isF ? 655 : 66;
  const t2 = +(9.6*wkg).toFixed(1); const t2m = isF ? 9.6 : 13.8; const t2v = +(t2m*wkg).toFixed(1);
  const t3m = isF ? 1.9 : 5.0;   const t3v = +(t3m*hcm2).toFixed(1);
  const t4m = isF ? 4.7 : 6.8;   const t4v = +(t4m*patient.age).toFixed(1);
  const arith = isF
    ? `${t1} + ${t2v} + ${t3v} - ${t4v} = ${geb} kcal/dia`
    : `${t1} + ${t2v} + ${t3v} - ${t4v} = ${geb} kcal/dia`;
  doc.text(arith,MG+2,y+8.5);
  y+=16;

  // Step 4 box — VET calculation
  rc(MG,y,W-2*MG,13,GREEN_LIGHT);
  sf(7,"bold",GREEN); doc.text(isES?"Paso 4 — Calculo del VET (Valor Energetico Total)":"Step 4 — TDEE (Total Daily Energy Expenditure)",MG+2,y+4);
  sf(7,"normal",[21,128,61]);
  const goalLabel = isES
    ? (patient.goal==="bajar"?"bajar peso":patient.goal==="subir"?"subir peso":"mantener peso")
    : (patient.goal==="bajar"?"weight loss":patient.goal==="subir"?"weight gain":"weight maintenance");
  doc.text(`VET = ${kcalPerKg} kcal/kg  x  ${wkg} kg  =  ${vet} kcal/dia`,MG+2,y+8.5);
  sf(7,"normal",GRAY); doc.text(`(${kcalPerKg} kcal/kg ${isES?"asignado por objetivo:":"assigned for:"} ${goalLabel})`,MG+2,y+12.5);
  y+=16;

  // Adequacy note box
  const adecNote = isES
    ? "Rango optimo de adecuacion: 90-110%. < 75% indica deficit moderado; < 60% deficit severo."
    : "Optimal adequacy range: 90-110%. < 75% indicates moderate deficit; < 60% severe deficit.";
  rc(MG,y,W-2*MG,8,ORANGE_LIGHT);
  sf(6.5,"normal",ORANGE); doc.text(isES?"Nota clinica:":"Clinical note:",MG+2,y+5);
  sf(6.5,"normal",[120,53,15]); doc.text(adecNote,MG+22,y+5);
  y+=12;

  if (withStudy) {
    rc(MG,y,W-2*MG,8,[237,233,254]);
    sf(7,"bold",PURPLE); doc.text(isES?"[SM] Study Mode — Referencia":"[SM] Study Mode — Reference",MG+2,y+3.5);
    sf(6.5,"normal",PURPLE_MID);
    doc.text(isES?"Harris-Benedict, 1919. Rev. Mifflin-St Jeor, 1990. Factor actividad: sedentario=1.2, ligero=1.375, activo=1.55, muy activo=1.725":"Harris-Benedict, 1919. Rev. Mifflin-St Jeor, 1990. Activity factor: sedentary=1.2, light=1.375, active=1.55, very active=1.725",MG+2,y+7);
    y+=12;
  }

  sf(10,"bold",NAVY); doc.text(isES?"Plan de Intercambios":"Exchange Plan",MG,y); y+=5;
  doc.setDrawColor(212,227,255); doc.setLineWidth(0.2); doc.line(MG,y,W-MG,y); y+=3;

  const eTH=["Grupo","N","Prot","Lip","HC"], eTW=[52,15,15,15,15]; let mx=MG;
  eTH.forEach((h,i)=>{ rc(mx,y,eTW[i],6,BLUE); sf(7,"bold",WHITE); doc.text(h,mx+eTW[i]/2,y+4.5,{align:"center"}); mx+=eTW[i]; }); y+=7;

  const GRP=[{key:"lac_semi",label:"Lacteos"},{key:"carne_baja",label:"Carnes bajas"},{key:"carne_mod",label:"Carnes mod."},{key:"carne_alta",label:"Carnes altas"},{key:"legum",label:"Leguminosas"},{key:"cereal",label:"Cereales"},{key:"verdura",label:"Verduras"},{key:"fruta",label:"Frutas"},{key:"grasa",label:"Grasas"},{key:"acces",label:"Accesorios"}];
  const EV2={lac_semi:{prot:8,lip:4,hc:12},carne_baja:{prot:7,lip:2,hc:0},carne_mod:{prot:7,lip:5,hc:0},carne_alta:{prot:7,lip:8,hc:0},legum:{prot:7,lip:1,hc:15},cereal:{prot:2,lip:1,hc:15},verdura:{prot:2,lip:0,hc:5},fruta:{prot:0,lip:0,hc:15},grasa:{prot:0,lip:5,hc:0},acces:{prot:0,lip:0,hc:10}};

  GRP.forEach((g,gi)=>{
    const ev=EV2[g.key]; if(!ev) return;
    const n=(exchanges[g.key]?.total)||0;
    const bg=gi%2===0?[252,253,255]:WHITE; mx=MG;
    [g.label,String(n),String(n*ev.prot),String(n*ev.lip),String(n*ev.hc)].forEach((v,i)=>{
      rc(mx,y,eTW[i],5,bg); sf(7,i===0?"bold":"normal",NAVY);
      doc.text(v,mx+eTW[i]/2,y+4,{align:"center"}); mx+=eTW[i];
    }); y+=5;
  });

  rc(MG,y,112,6,BLUE); mx=MG;
  [{v:"Total",b:true},{v:String(Object.values(exchanges).reduce((s,e)=>s+(e?.total||0),0)),b:true},{v:String(totals.prot),b:false},{v:String(totals.lip),b:false},{v:String(totals.hc),b:false}].forEach((cell,i)=>{
    sf(7,cell.b?"bold":"normal",WHITE);
    doc.text(cell.v,mx+eTW[i]/2,y+4.5,{align:"center"}); mx+=eTW[i];
  }); y+=11;

  const has5pdf = (patient.mealTimes||4) >= 5;
  const mealKeysPDF = has5pdf ? ["D","A","C","M","M2"] : ["D","A","C","M"];
  const mealLblPDF = {D:isES?"Desayuno":"Breakfast",A:isES?"Almuerzo":"Lunch",C:isES?"Cena":"Dinner",M:isES?"Merienda":"Snack",M2:isES?"Merienda 2":"Snack 2"};
  function getMealKcalPDF(mk) {
    let k=0;
    GRP.forEach(g=>{ const ev=EV2[g.key]; if(!ev) return; const n=(exchanges[g.key]?.[mk])||0; k+=n*(ev.prot*4+ev.lip*9+ev.hc*4); });
    return k;
  }

  sf(10,"bold",NAVY); doc.text(isES?"Distribucion por tiempo de comida":"Meal time distribution",MG,y); y+=5;
  doc.setDrawColor(212,227,255); doc.setLineWidth(0.2); doc.line(MG,y,W-MG,y); y+=3;

  const totalKcalPDF = totals.prot*4 + totals.lip*9 + totals.hc*4;
  const mealColorsPDF = {D:[37,99,235],A:[8,145,178],C:[234,179,8],M:[168,85,247],M2:[34,197,94]};
  mealKeysPDF.forEach(mk=>{
    const kcal = getMealKcalPDF(mk);
    const pct = totalKcalPDF>0 ? Math.round(kcal/totalKcalPDF*100) : 0;
    const barW = Math.round((W-2*MG) * pct/100);
    const clr = mealColorsPDF[mk]||BLUE;
    rc(MG,y,W-2*MG,7,LIGHT);
    if(barW>0) rc(MG,y,barW,7,clr);
    sf(7,"bold",WHITE); doc.text(mealLblPDF[mk],MG+2,y+5);
    sf(7,"bold",NAVY); doc.text(`${kcal} kcal (${pct}%)`,W-MG,y+5,{align:"right"});
    y+=9;
  });

  rc(MG,y,W-2*MG,7,NAVY);
  sf(7,"bold",WHITE); doc.text(isES?"Total":"Total",MG+2,y+5);
  sf(7,"bold",WHITE); doc.text(`${totalKcalPDF} kcal`,W-MG,y+5,{align:"right"});
  y+=12;

  doc.setFillColor(...NAVY); doc.rect(0,285,W,12,"F");
  sf(7,"normal",[147,197,253]);
  doc.text("nutrionally.com/learn",MG,291);
  doc.text(isES?"Documento educativo — no apto para uso clinico real":"Educational document — not for clinical use",W/2,291,{align:"center"});
  doc.text(dateStr,W-MG,291,{align:"right"});

  doc.save(`nutrionally-learn-${patient.caseName||"caso"}.pdf`);
}

export default function App() {
  const [patient]   = useState(() => ({ ...DEFAULT_PATIENT, ...loadFromStorage("nl_patient_v1", {}) }));
  const [studyMode] = useState(() => loadFromStorage("nl_study_v1", false));
  const [lang, setLang] = useState("ES");
  const [exchanges, setExchanges] = useState(() => {
    const saved = patient.exchanges || loadFromStorage("nl_exc_v1", null);
    if (!saved) return JSON.parse(JSON.stringify(DEFAULT_EXC));
    const migrated = {};
    Object.keys(DEFAULT_EXC).forEach(key => {
      migrated[key] = { M2:0, ...DEFAULT_EXC[key], ...saved[key] };
    });
    return migrated;
  });

  const isES      = lang === "ES";
  const groups    = isES ? GROUPS_ES : GROUPS_EN;
  const has5meals = (patient.mealTimes || 4) >= 5;
  const mealKeys  = has5meals ? ["D","A","C","M","M2"] : ["D","A","C","M"];
  const mealLabel = { D: isES?"Desayuno":"Breakfast", A: isES?"Almuerzo":"Lunch", C: isES?"Cena":"Dinner", M: isES?"Merienda":"Snack", M2: isES?"Merienda 2":"Snack 2" };

  function updateExchange(groupKey, field, newVal) {
    setExchanges(prev => {
      const updated = { ...prev[groupKey], [field]: newVal };
      if (field !== "total") {
        updated.total = mealKeys.reduce((sum, mk) => sum + (updated[mk] || 0), 0);
      }
      const next = { ...prev, [groupKey]: updated };
      try { localStorage.setItem("nl_exc_v1", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  const totals = useMemo(() => {
    let prot = 0, lip = 0, hc = 0;
    GROUPS_ES.forEach(group => {
      const ev = EXCH[group.key];
      if (!ev) return;
      const qty = (exchanges[group.key]?.total) || 0;
      prot += qty * ev.prot;
      lip  += qty * ev.lip;
      hc   += qty * ev.hc;
    });
    return { prot, lip, hc, kcal: prot*4 + lip*9 + hc*4 };
  }, [exchanges]);

  function getMealKcal(mealKey) {
    let total = 0;
    GROUPS_ES.forEach(group => {
      const ev = EXCH[group.key];
      if (!ev) return;
      const qty = (exchanges[group.key]?.[mealKey]) || 0;
      total += qty * (ev.prot*4 + ev.lip*9 + ev.hc*4);
    });
    return total;
  }

  const meta = {
    prot: patient.protG || 67,
    lip:  patient.lipG  || 53,
    hc:   patient.hcG   || 210,
    kcal: patient.vet   || 1582,
  };
  const adecProt = Math.round(totals.prot / meta.prot * 100);
  const adecLip  = Math.round(totals.lip  / meta.lip  * 100);
  const adecHC   = Math.round(totals.hc   / meta.hc   * 100);
  const vetMin   = patient.sex === "F" ? 1200 : 1500;
  const totalExchanges = Object.values(exchanges).reduce((sum, ex) => sum + ex.total, 0);

  const thStyle = { padding:"7px 12px", fontSize:10, fontWeight:500, color:"#3A5BA0", textTransform:"uppercase", letterSpacing:"0.05em", borderBottom:"0.5px solid #D4E3FF", fontFamily:FONT };
  const tdCenter = { padding:"8px 12px", textAlign:"center", fontFamily:FONT };

  return (
    <StudyCtx.Provider value={{ studyMode }}>
      <div style={{fontFamily:FONT, background:"#F5F7FF", minHeight:"100vh"}}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>

        <div style={{background:"#1E2D4E", height:44, display:"flex", alignItems:"center", padding:"0 20px", gap:12, borderBottom:"0.5px solid #2D4270", position:"sticky", top:0, zIndex:100}}>
          <div style={{width:8, height:8, borderRadius:"50%", background:"#2563EB"}}/>
          <span style={{fontSize:14, fontWeight:600, color:"#E2E8F0", fontFamily:FONT}}>
            nutrionally <span style={{fontWeight:400, color:"#93C5FD", fontSize:12}}>learn</span>
          </span>
          <span style={{fontSize:10, padding:"2px 10px", borderRadius:20, background:"#2563EB22", color:"#93C5FD", border:"0.5px solid #2563EB", fontFamily:FONT}}>
            {isES ? "Plan de intercambios" : "Exchange plan"}
          </span>
          {studyMode && (
            <span style={{fontSize:10, padding:"2px 8px", borderRadius:20, background:"#7C3AED22", color:"#A78BFA", border:"0.5px solid #7C3AED", fontFamily:FONT}}>◎ Study Mode</span>
          )}
          <div style={{marginLeft:"auto", display:"flex", gap:4}}>
            {["ES","EN"].map(lng => (
              <button key={lng} onClick={() => setLang(lng)} style={{padding:"3px 9px", fontSize:11, fontWeight:500, cursor:"pointer", background: lang===lng ? "#2563EB" : "transparent", color: lang===lng ? "#fff" : "#93C5FD", border:"0.5px solid #3A5BA0", borderRadius:4, fontFamily:FONT}}>{lng}</button>
            ))}
          </div>
        </div>

        <div style={{maxWidth:1140, margin:"0 auto", padding:"22px 24px"}}>
          <div style={{marginBottom:16}}>
            <h1 style={{fontSize:22, fontWeight:500, color:"#1E2D4E", margin:"0 0 4px", fontFamily:FONT}}>
              {isES ? "Plan de intercambios" : "Exchange plan"}
            </h1>
            <p style={{fontSize:13, color:"#3A5BA0", margin:0, fontFamily:FONT}}>
              {patient.caseName || "—"} · VET {(patient.vet||1582).toLocaleString()} kcal · {patient.condition==="dm2" ? "DM2" : patient.condition==="obesity" ? (isES?"Obesidad":"Obesity") : (isES?"Sin condicion":"No condition")}
            </p>
          </div>

          <div style={{display:"grid", gridTemplateColumns:"1fr 270px", gap:14}}>
            <div style={{display:"flex", flexDirection:"column", gap:12}}>

              <div style={{background:"#fff", border:"0.5px solid #D4E3FF", borderRadius:12, overflow:"hidden"}}>
                <div style={{padding:"12px 16px", borderBottom:"0.5px solid #D4E3FF"}}>
                  <span style={{fontSize:13, fontWeight:500, color:"#1E2D4E", fontFamily:FONT}}>{isES ? "Grupos de alimentos" : "Food groups"}</span>
                </div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%", borderCollapse:"collapse", fontFamily:FONT}}>
                    <thead>
                      <tr style={{background:"#F5F7FF"}}>
                        <th style={{...thStyle, textAlign:"left"}}>{isES ? "Grupo" : "Group"}</th>
                        <th style={{...thStyle, textAlign:"center"}}>{isES ? "Interc." : "Exch."}</th>
                        <th style={{...thStyle, textAlign:"center"}}>Prot</th>
                        <th style={{...thStyle, textAlign:"center"}}>{isES ? "Lip" : "Fat"}</th>
                        <th style={{...thStyle, textAlign:"center"}}>HC</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groups.map(group => {
                        const ev  = EXCH[group.key];
                        const qty = exchanges[group.key].total;
                        const cs  = CAT_COLOR[group.cat] || { bg:"#F5F7FF", tx:"#3A5BA0" };
                        return (
                          <tr key={group.key} style={{borderBottom:"0.5px solid #F0F4FF"}}>
                            <td style={{padding:"8px 12px"}}>
                              <span style={{display:"inline-block", fontSize:11, fontWeight:500, padding:"3px 10px", borderRadius:20, background:cs.bg, color:cs.tx}}>
                                {group.label}
                              </span>
                            </td>
                            <td style={tdCenter}><NumButton value={qty} onChange={val => updateExchange(group.key, "total", val)}/></td>
                            <td style={tdCenter}><CalcCell value={qty * ev.prot}/></td>
                            <td style={tdCenter}><CalcCell value={qty * ev.lip}/></td>
                            <td style={tdCenter}><CalcCell value={qty * ev.hc}/></td>
                          </tr>
                        );
                      })}
                      <tr style={{background:"#F5F7FF", borderTop:"0.5px solid #D4E3FF"}}>
                        <td style={{padding:"9px 12px", fontWeight:600, color:"#1E2D4E", fontSize:13}}>Total</td>
                        <td style={{...tdCenter, fontWeight:600, color:"#1E2D4E"}}>{totalExchanges}</td>
                        <td style={tdCenter}><CalcCell value={totals.prot} highlight/></td>
                        <td style={tdCenter}><CalcCell value={totals.lip}  highlight/></td>
                        <td style={tdCenter}><CalcCell value={totals.hc}   highlight/></td>
                      </tr>
                      <tr style={{background:"#EFF6FF", borderTop:"0.5px solid #D4E3FF"}}>
                        <td style={{padding:"7px 12px", fontSize:11, color:"#2563EB", fontWeight:500}}>{isES ? "Meta" : "Goal"}</td>
                        <td/>
                        {[meta.prot, meta.lip, meta.hc].map((val, idx) => (
                          <td key={idx} style={{...tdCenter, fontSize:12, fontWeight:600, color:"#2563EB"}}>{Math.round(val)}</td>
                        ))}
                      </tr>
                      <tr style={{borderTop:"0.5px solid #D4E3FF"}}>
                        <td style={{padding:"7px 12px", fontSize:11, color:"#3A5BA0"}}>% {isES ? "Adec." : "Adec."}</td>
                        <td/>
                        {[adecProt, adecLip, adecHC].map((val, idx) => {
                          const col = adecColor(val);
                          return (
                            <td key={idx} style={tdCenter}>
                              <span style={{display:"inline-block", padding:"2px 7px", borderRadius:20, fontSize:11, fontWeight:600, background:col.bg, color:col.tx}}>
                                {val}%
                              </span>
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{background:"#fff", border:"0.5px solid #D4E3FF", borderRadius:12, overflow:"hidden"}}>
                <div style={{padding:"12px 16px", borderBottom:"0.5px solid #D4E3FF", display:"flex", alignItems:"center", gap:8}}>
                  <span style={{fontSize:13, fontWeight:500, color:"#1E2D4E", fontFamily:FONT}}>{isES ? "Distribucion por tiempo de comida" : "Meal time distribution"}</span>
                  {has5meals && <span style={{fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:20, background:"#EFF6FF", color:"#2563EB", border:"0.5px solid #2563EB", fontFamily:FONT}}>DM2 · 5 tiempos</span>}
                </div>
                <div style={{overflowX:"auto"}}>
                  <table style={{width:"100%", borderCollapse:"collapse", fontFamily:FONT}}>
                    <thead>
                      <tr style={{background:"#F5F7FF"}}>
                        <th style={{...thStyle, textAlign:"left"}}>{isES ? "Grupo" : "Group"}</th>
                        {mealKeys.map(mk => {
                          const mc = MEAL_COLOR[mk];
                          return (
                            <th key={mk} style={{...thStyle, textAlign:"center"}}>
                              <div style={{display:"flex", alignItems:"center", justifyContent:"center", gap:4}}>
                                <div style={{width:20, height:20, borderRadius:"50%", background:mc.bg, color:mc.tx, fontSize:9, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center"}}>{mk}</div>
                                <span style={{fontSize:10, color:"#3A5BA0"}}>{mealLabel[mk]}</span>
                              </div>
                            </th>
                          );
                        })}
                        <th style={{...thStyle, textAlign:"center"}}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groups.map(group => {
                        const row = exchanges[group.key];
                        const cs  = CAT_COLOR[group.cat] || { bg:"#F5F7FF", tx:"#3A5BA0" };
                        const mealSum = mealKeys.reduce((sum, mk) => sum + (row[mk] || 0), 0);
                        return (
                          <tr key={group.key} style={{borderBottom:"0.5px solid #F0F4FF"}}>
                            <td style={{padding:"7px 12px"}}>
                              <span style={{display:"inline-block", fontSize:11, fontWeight:500, padding:"2px 8px", borderRadius:20, background:cs.bg, color:cs.tx}}>
                                {group.label}
                              </span>
                            </td>
                            {mealKeys.map(mk => (
                              <td key={mk} style={tdCenter}>
                                <NumButton value={row[mk] || 0} onChange={val => updateExchange(group.key, mk, val)}/>
                              </td>
                            ))}
                            <td style={tdCenter}><CalcCell value={mealSum} highlight={mealSum === row.total}/></td>
                          </tr>
                        );
                      })}
                      <tr style={{background:"#F5F7FF", borderTop:"0.5px solid #D4E3FF"}}>
                        <td style={{padding:"8px 12px", fontWeight:600, color:"#1E2D4E", fontSize:11}}>~kcal</td>
                        {mealKeys.map(mk => (
                          <td key={mk} style={{...tdCenter, fontSize:12, fontWeight:500, color:"#1E2D4E"}}>{getMealKcal(mk)}</td>
                        ))}
                        <td style={{...tdCenter, fontSize:12, fontWeight:600, color:"#1E2D4E"}}>{totals.kcal}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {adecProt < 75 && (
                <AlertBox level="error" badge={isES ? "Proteinas < 75%" : "Proteins < 75%"} studyMode={studyMode}
                  explain={isES ? "Adecuacion proteica baja. Riesgo de catabolismo muscular. Revisar carnes y lacteos." : "Low protein adequacy. Risk of muscle catabolism. Review meats and dairy."}/>
              )}
              {totals.kcal < vetMin && (
                <AlertBox level="error" badge={isES ? `VET < ${vetMin} kcal` : `TDEE < ${vetMin} kcal`} studyMode={studyMode}
                  explain={isES ? `VET (${totals.kcal} kcal) por debajo del minimo (${vetMin} kcal).` : `TDEE (${totals.kcal} kcal) below minimum (${vetMin} kcal).`}/>
              )}
              {patient.condition === "dm2" && adecHC > 110 && (
                <AlertBox level="warning" badge={isES ? "HC > 110% en DM2" : "CHO > 110% in T2D"} studyMode={studyMode}
                  explain={isES ? `HC al ${adecHC}%. Riesgo de hiperglucemia postprandial.` : `CHO at ${adecHC}%. Risk of postprandial hyperglycemia.`}/>
              )}

              <NatureCard isES={isES} exchanges={exchanges} totals={totals}/>
              <EquivPanel isES={isES}/>

            </div>

            <div style={{display:"flex", flexDirection:"column", gap:10}}>
              <KpiCard label={isES ? "Energia total" : "Total energy"} value={totals.kcal.toLocaleString()} unit="kcal/dia" sub={`${Math.round(totals.kcal / (patient.vet||1582) * 100)}% VET`} ok={true}/>
              <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:8}}>
                <KpiCard label="Prot" value={totals.prot} unit="g" sub={`${adecProt}%`} ok={adecProt >= 90}/>
                <KpiCard label={isES ? "Lip" : "Fat"} value={totals.lip} unit="g" sub={`${adecLip}%`} ok={adecLip >= 90}/>
              </div>
              <KpiCard label="HC" value={totals.hc} unit="g" sub={`${adecHC}%`} ok={adecHC >= 90}/>

              <div style={{background:"#fff", border:"0.5px solid #D4E3FF", borderRadius:12, padding:"14px"}}>
                <div style={{fontSize:11, fontWeight:500, color:"#1E2D4E", marginBottom:12, fontFamily:FONT}}>
                  {isES ? "Kcal por tiempo" : "Kcal by meal"}
                </div>
                {mealKeys.map(mk => {
                  const kcal = getMealKcal(mk);
                  const pct  = totals.kcal > 0 ? Math.round(kcal / totals.kcal * 100) : 0;
                  const mc   = MEAL_COLOR[mk];
                  return (
                    <div key={mk} style={{marginBottom:10}}>
                      <div style={{display:"flex", justifyContent:"space-between", marginBottom:3, alignItems:"center"}}>
                        <div style={{display:"flex", alignItems:"center", gap:5}}>
                          <div style={{width:20, height:20, borderRadius:"50%", background:mc.bg, color:mc.tx, fontSize:9, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center"}}>{mk}</div>
                          <span style={{fontSize:11, color:"#2D4270", fontFamily:FONT}}>{mealLabel[mk]}</span>
                        </div>
                        <span style={{fontSize:11, fontWeight:500, color:"#1E2D4E", fontFamily:FONT}}>{kcal} kcal</span>
                      </div>
                      <div style={{height:6, background:"#D4E3FF", borderRadius:3, overflow:"hidden"}}>
                        <div style={{height:"100%", width:`${pct}%`, background:"#2563EB", borderRadius:3, transition:"width 0.3s"}}/>
                      </div>
                      <div style={{fontSize:9, color:"#3A5BA0", marginTop:1, textAlign:"right", fontFamily:FONT}}>{pct}% VET</div>
                    </div>
                  );
                })}
              </div>

              <div style={{display:"flex", flexDirection:"column", gap:8}}>
                <button
                  onClick={() => exportPDF(patient, exchanges, totals, isES, false)}
                  style={{padding:"10px 0", borderRadius:8, background:"#EFF6FF", color:"#2563EB", fontSize:12, fontWeight:500, border:"0.5px solid #2563EB", cursor:"pointer", fontFamily:FONT}}
                >
                  ↓ {isES ? "Descargar PDF" : "Download PDF"}
                </button>
                <button
                  onClick={() => exportPDF(patient, exchanges, totals, isES, true)}
                  style={{padding:"10px 0", borderRadius:8, background: studyMode ? "#F3E8FF" : "#F5F7FF", color: studyMode ? "#7C3AED" : "#3A5BA0", fontSize:12, fontWeight:500, border: studyMode ? "0.5px solid #7C3AED" : "0.5px solid #D4E3FF", cursor:"pointer", fontFamily:FONT}}
                >
                  ◎ PDF Study
                </button>
              </div>
                <button onClick={()=>window.location.href="/"} style={{padding:"9px 0",borderRadius:8,background:"transparent",color:"#3A5BA0",fontSize:12,fontWeight:500,border:"0.5px solid #D4E3FF",cursor:"pointer",fontFamily:FONT,marginTop:4}}>{isES?"← Calculadora":"← Calculator"}</button>
            </div>
          </div>
        </div>
      </div>
    </StudyCtx.Provider>
  );
}
