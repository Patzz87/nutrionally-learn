import React, { useState, useEffect, useMemo, createContext, useContext, useRef } from "react";

const StudyModeContext = createContext({ studyMode: false, setStudyMode: () => {} });
const F = "Plus Jakarta Sans, sans-serif";

const EXCHANGE_VALUES = {
  lac_semi:   { prot:8, lip:4, hc:12 },
  carne_baja: { prot:7, lip:2, hc:0  },
  carne_mod:  { prot:7, lip:5, hc:0  },
  carne_alta: { prot:7, lip:8, hc:0  },
  legum:      { prot:7, lip:1, hc:15 },
  cereal:     { prot:2, lip:1, hc:15 },
  verdura:    { prot:2, lip:0, hc:5  },
  fruta:      { prot:0, lip:0, hc:15 },
  grasa:      { prot:0, lip:5, hc:0  },
  acces:      { prot:0, lip:0, hc:10 },
};

const FOODS = [
  {id:1, cat:"lacteos",      es:"Leche entera",          en:"Whole Milk",          portion:{ES:"240 ml · 1 taza",      EN:"240 ml · 1 cup"},      prot:8,lip:8, hc:12},
  {id:2, cat:"lacteos",      es:"Leche semidescremada",  en:"Semi-skimmed Milk",   portion:{ES:"240 ml · 1 taza",      EN:"240 ml · 1 cup"},      prot:8,lip:4, hc:12},
  {id:3, cat:"lacteos",      es:"Leche descremada",      en:"Skimmed Milk",        portion:{ES:"240 ml · 1 taza",      EN:"240 ml · 1 cup"},      prot:8,lip:0, hc:12},
  {id:4, cat:"lacteos",      es:"Yogur natural entero",  en:"Plain Whole Yogurt",  portion:{ES:"240 ml",               EN:"240 ml"},              prot:8,lip:8, hc:12},
  {id:5, cat:"lacteos",      es:"Yogur descremado",      en:"Plain Skimmed Yogurt",portion:{ES:"240 ml",               EN:"240 ml"},              prot:8,lip:0, hc:12},
  {id:6, cat:"carnes_bajas", es:"Pechuga de pollo",      en:"Chicken Breast",      portion:{ES:"90 g · 3 oz cocido",   EN:"90 g · 3 oz cooked"},  prot:7,lip:2, hc:0 },
  {id:7, cat:"carnes_bajas", es:"Atun en agua",          en:"Tuna in Water",       portion:{ES:"90 g",                 EN:"90 g"},                prot:7,lip:2, hc:0 },
  {id:8, cat:"carnes_bajas", es:"Claras de huevo",       en:"Egg Whites",          portion:{ES:"2 claras",             EN:"2 whites"},            prot:7,lip:2, hc:0 },
  {id:9, cat:"carnes_bajas", es:"Pescado blanco",        en:"White Fish",          portion:{ES:"90 g",                 EN:"90 g"},                prot:7,lip:2, hc:0 },
  {id:10,cat:"carnes_bajas", es:"Pavo pechuga",          en:"Turkey Breast",       portion:{ES:"90 g",                 EN:"90 g"},                prot:7,lip:2, hc:0 },
  {id:11,cat:"carnes_mod",   es:"Huevo entero",          en:"Whole Egg",           portion:{ES:"1 unidad (50 g)",      EN:"1 unit (50 g)"},       prot:7,lip:5, hc:0 },
  {id:12,cat:"carnes_mod",   es:"Carne molida 90%",      en:"Ground Beef 90%",     portion:{ES:"90 g",                 EN:"90 g"},                prot:7,lip:5, hc:0 },
  {id:13,cat:"carnes_mod",   es:"Sardinas en aceite",    en:"Canned Sardines",     portion:{ES:"90 g",                 EN:"90 g"},                prot:7,lip:5, hc:0 },
  {id:14,cat:"carnes_altas", es:"Costillas de cerdo",    en:"Pork Ribs",           portion:{ES:"90 g",                 EN:"90 g"},                prot:7,lip:8, hc:0 },
  {id:15,cat:"carnes_altas", es:"Salchicha",             en:"Sausage",             portion:{ES:"90 g",                 EN:"90 g"},                prot:7,lip:8, hc:0 },
  {id:16,cat:"leguminosas",  es:"Frijoles negros",       en:"Black Beans",         portion:{ES:"1/2 taza (90 g)",      EN:"1/2 cup (90 g)"},      prot:7,lip:1, hc:15},
  {id:17,cat:"leguminosas",  es:"Lentejas",              en:"Lentils",             portion:{ES:"1/2 taza (90 g)",      EN:"1/2 cup (90 g)"},      prot:7,lip:1, hc:15},
  {id:18,cat:"leguminosas",  es:"Garbanzos",             en:"Chickpeas",           portion:{ES:"1/2 taza (90 g)",      EN:"1/2 cup (90 g)"},      prot:7,lip:1, hc:15},
  {id:19,cat:"leguminosas",  es:"Habichuelas rojas",     en:"Kidney Beans",        portion:{ES:"1/2 taza (90 g)",      EN:"1/2 cup (90 g)"},      prot:7,lip:1, hc:15},
  {id:20,cat:"cereales",     es:"Pan blanco",            en:"White Bread",         portion:{ES:"1 rebanada (25 g)",    EN:"1 slice (25 g)"},      prot:2,lip:1, hc:15},
  {id:21,cat:"cereales",     es:"Pan integral",          en:"Whole Grain Bread",   portion:{ES:"1 rebanada (25 g)",    EN:"1 slice (25 g)"},      prot:2,lip:1, hc:15},
  {id:22,cat:"cereales",     es:"Arroz cocido",          en:"Cooked Rice",         portion:{ES:"1/3 taza (50 g)",      EN:"1/3 cup (50 g)"},      prot:2,lip:1, hc:15},
  {id:23,cat:"cereales",     es:"Pasta cocida",          en:"Cooked Pasta",        portion:{ES:"1/3 taza (50 g)",      EN:"1/3 cup (50 g)"},      prot:2,lip:1, hc:15},
  {id:24,cat:"cereales",     es:"Avena cocida",          en:"Cooked Oats",         portion:{ES:"1/2 taza (120 g)",     EN:"1/2 cup (120 g)"},     prot:2,lip:1, hc:15},
  {id:25,cat:"cereales",     es:"Tortilla de maiz",      en:"Corn Tortilla",       portion:{ES:"1 unidad (30 g)",      EN:"1 unit (30 g)"},       prot:2,lip:1, hc:15},
  {id:26,cat:"cereales",     es:"Papa cocida",           en:"Cooked Potato",       portion:{ES:"1 pequena (80 g)",     EN:"1 small (80 g)"},      prot:2,lip:1, hc:15},
  {id:27,cat:"cereales",     es:"Cereal sin azucar",     en:"Unsweetened Cereal",  portion:{ES:"3/4 taza (30 g)",      EN:"3/4 cup (30 g)"},      prot:2,lip:1, hc:15},
  {id:28,cat:"verduras",     es:"Brocoli",               en:"Broccoli",            portion:{ES:"1/2 taza (80 g)",      EN:"1/2 cup (80 g)"},      prot:2,lip:0, hc:5 },
  {id:29,cat:"verduras",     es:"Espinaca",              en:"Spinach",             portion:{ES:"1 taza cruda (30 g)",  EN:"1 cup raw (30 g)"},    prot:2,lip:0, hc:5 },
  {id:30,cat:"verduras",     es:"Zanahoria",             en:"Carrot",              portion:{ES:"1/2 taza (80 g)",      EN:"1/2 cup (80 g)"},      prot:2,lip:0, hc:5 },
  {id:31,cat:"verduras",     es:"Tomate",                en:"Tomato",              portion:{ES:"1 mediano (120 g)",    EN:"1 medium (120 g)"},    prot:2,lip:0, hc:5 },
  {id:32,cat:"verduras",     es:"Pepino",                en:"Cucumber",            portion:{ES:"1 taza (130 g)",       EN:"1 cup (130 g)"},       prot:2,lip:0, hc:5 },
  {id:33,cat:"verduras",     es:"Lechuga",               en:"Lettuce",             portion:{ES:"1 taza (55 g)",        EN:"1 cup (55 g)"},        prot:2,lip:0, hc:5 },
  {id:34,cat:"verduras",     es:"Calabacin",             en:"Zucchini",            portion:{ES:"1/2 taza (80 g)",      EN:"1/2 cup (80 g)"},      prot:2,lip:0, hc:5 },
  {id:35,cat:"frutas",       es:"Manzana",               en:"Apple",               portion:{ES:"1 pequena (120 g)",    EN:"1 small (120 g)"},     prot:0,lip:0, hc:15},
  {id:36,cat:"frutas",       es:"Platano",               en:"Banana",              portion:{ES:"1/2 unidad (60 g)",    EN:"1/2 unit (60 g)"},     prot:0,lip:0, hc:15},
  {id:37,cat:"frutas",       es:"Naranja",               en:"Orange",              portion:{ES:"1 mediana (130 g)",    EN:"1 medium (130 g)"},    prot:0,lip:0, hc:15},
  {id:38,cat:"frutas",       es:"Fresa",                 en:"Strawberries",        portion:{ES:"1 taza (150 g)",       EN:"1 cup (150 g)"},       prot:0,lip:0, hc:15},
  {id:39,cat:"frutas",       es:"Uvas",                  en:"Grapes",              portion:{ES:"17 unidades (85 g)",   EN:"17 units (85 g)"},     prot:0,lip:0, hc:15},
  {id:40,cat:"frutas",       es:"Mango",                 en:"Mango",               portion:{ES:"1/2 taza (80 g)",      EN:"1/2 cup (80 g)"},      prot:0,lip:0, hc:15},
  {id:41,cat:"frutas",       es:"Pina",                  en:"Pineapple",           portion:{ES:"3/4 taza (120 g)",     EN:"3/4 cup (120 g)"},     prot:0,lip:0, hc:15},
  {id:42,cat:"grasas",       es:"Aceite de oliva",       en:"Olive Oil",           portion:{ES:"1 cdita (5 ml)",       EN:"1 tsp (5 ml)"},        prot:0,lip:5, hc:0 },
  {id:43,cat:"grasas",       es:"Aguacate",              en:"Avocado",             portion:{ES:"1/8 unidad (30 g)",    EN:"1/8 unit (30 g)"},     prot:0,lip:5, hc:0 },
  {id:44,cat:"grasas",       es:"Mantequilla de mani",   en:"Peanut Butter",       portion:{ES:"1 cdita (5 g)",        EN:"1 tsp (5 g)"},         prot:0,lip:5, hc:0 },
  {id:45,cat:"grasas",       es:"Nueces",                en:"Walnuts",             portion:{ES:"6 unidades (10 g)",    EN:"6 units (10 g)"},      prot:0,lip:5, hc:0 },
  {id:46,cat:"grasas",       es:"Almendras",             en:"Almonds",             portion:{ES:"6 unidades (10 g)",    EN:"6 units (10 g)"},      prot:0,lip:5, hc:0 },
  {id:47,cat:"grasas",       es:"Aderezo ensalada",      en:"Salad Dressing",      portion:{ES:"1 cda (15 ml)",        EN:"1 tbsp (15 ml)"},      prot:0,lip:5, hc:0 },
  {id:48,cat:"accesorios",   es:"Azucar",                en:"Sugar",               portion:{ES:"1 cdita (4 g)",        EN:"1 tsp (4 g)"},         prot:0,lip:0, hc:10},
  {id:49,cat:"accesorios",   es:"Miel",                  en:"Honey",               portion:{ES:"1 cdita (7 g)",        EN:"1 tsp (7 g)"},         prot:0,lip:0, hc:10},
  {id:50,cat:"accesorios",   es:"Mermelada",             en:"Jam",                 portion:{ES:"1 cda (20 g)",         EN:"1 tbsp (20 g)"},       prot:0,lip:0, hc:10},
  {id:51,cat:"accesorios",   es:"Refresco regular",      en:"Regular Soda",        portion:{ES:"120 ml",               EN:"120 ml"},              prot:0,lip:0, hc:10},
];

const CAT_STYLE = {
  lacteos:{bg:"#D4E3FF",text:"#0C447C"},carnes_bajas:{bg:"#FAEEDA",text:"#633806"},
  carnes_mod:{bg:"#FAEEDA",text:"#854F0B"},carnes_altas:{bg:"#FCEBEB",text:"#A32D2D"},
  leguminosas:{bg:"#E1F5EE",text:"#085041"},cereales:{bg:"#FEF9E7",text:"#7D3C98"},
  verduras:{bg:"#EAF3DE",text:"#27500A"},frutas:{bg:"#FBEAF0",text:"#72243E"},
  grasas:{bg:"#FCEBEB",text:"#A32D2D"},accesorios:{bg:"#F5F7FF",text:"#3A5BA0"},
};

const FOOD_CATS = [
  {key:"all",label:{ES:"Todos",EN:"All"}},
  {key:"lacteos",label:{ES:"1 · Lacteos",EN:"1 · Dairy"}},
  {key:"carnes_bajas",label:{ES:"2A · Carnes bajas",EN:"2A · Lean Meats"}},
  {key:"carnes_mod",label:{ES:"2B · Carnes mod.",EN:"2B · Medium Meats"}},
  {key:"carnes_altas",label:{ES:"2C · Carnes altas",EN:"2C · High-fat"}},
  {key:"leguminosas",label:{ES:"3 · Leguminosas",EN:"3 · Legumes"}},
  {key:"cereales",label:{ES:"4 · Cereales",EN:"4 · Cereals"}},
  {key:"verduras",label:{ES:"5 · Verduras",EN:"5 · Vegetables"}},
  {key:"frutas",label:{ES:"6 · Frutas",EN:"6 · Fruits"}},
  {key:"grasas",label:{ES:"7 · Grasas",EN:"7 · Fats"}},
  {key:"accesorios",label:{ES:"8 · Accesorios",EN:"8 · Accessories"}},
];

const FOOD_FILTERS = [
  {key:"all",label:{ES:"Todos",EN:"All"}},
  {key:"hiprot",label:{ES:"Alto proteina",EN:"High protein"}},
  {key:"lowfat",label:{ES:"Bajo en grasa",EN:"Low fat"}},
  {key:"nohc",label:{ES:"Sin HC",EN:"No carbs"}},
  {key:"vegan",label:{ES:"Vegano",EN:"Vegan"}},
];

function KpiDark({label,value,unit,sub,ok}) {
  return (
    <div style={{background:"#1E2D4E",border:"0.5px solid #2D4270",borderRadius:10,padding:"11px 14px"}}>
      <div style={{fontSize:9,fontWeight:500,color:"#93C5FD",textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:F,marginBottom:5}}>{label}</div>
      <div style={{display:"flex",alignItems:"baseline",gap:4}}>
        <span style={{fontSize:20,fontWeight:500,color:"#E2E8F0",fontFamily:F}}>{value}</span>
        {unit&&<span style={{fontSize:10,color:"#93C5FD",fontFamily:F}}>{unit}</span>}
      </div>
      {sub&&<div style={{fontSize:10,color:ok?"#4ade80":"#93C5FD",marginTop:3,fontFamily:F}}>{sub}</div>}
    </div>
  );
}

function CalcCell({value,unit,highlight}) {
  return (
    <div style={{background:highlight?"#EFF6FF":"#FEF9E7",border:`0.5px solid ${highlight?"#93C5FD":"#e8d89a"}`,borderRadius:5,padding:"3px 8px",fontFamily:F,fontWeight:500,fontSize:12,color:highlight?"#1E2D4E":"#7D3C98",textAlign:"center",minWidth:36,display:"inline-block"}}>
      {value}{unit&&<span style={{fontSize:10,marginLeft:2}}>{unit}</span>}
    </div>
  );
}

function MacroPill({value,type}) {
  const s = value===0?{bg:"#F5F7FF",text:"#3A5BA0"}:type==="prot"?{bg:"#EFF6FF",text:"#2563EB"}:type==="lip"?{bg:"#FAEEDA",text:"#854F0B"}:{bg:"#D4E3FF",text:"#0C447C"};
  return <span style={{display:"inline-block",padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:600,background:s.bg,color:s.text,fontFamily:F,minWidth:30,textAlign:"center"}}>{value}</span>;
}

function adecColor(p) {
  return p>=90&&p<=110?{bg:"#EFF6FF",text:"#2563EB"}:p>=75?{bg:"#FAEEDA",text:"#854F0B"}:{bg:"#FCEBEB",text:"#A32D2D"};
}

function hamwi(sex,heightIn) {
  if(sex==="F") return +(45.5+2.3*(heightIn-60)).toFixed(1);
  return +(48.0+2.7*(heightIn-60)).toFixed(1);
}

function Navbar({lang,setLang,screen,setScreen,isMobile,onUpgrade,setCaseStarted,onCases,casesLabel,casesCount,onNewCase}) {
  const {studyMode,setStudyMode} = useContext(StudyModeContext);
  return (
    <nav style={{background:"#1E2D4E",height:52,display:"flex",alignItems:"center",padding:"0 20px",gap:20,borderBottom:"0.5px solid #2D4270",position:"sticky",top:0,zIndex:200,flexShrink:0}}>
      <button onClick={()=>{setScreen("s1");setCaseStarted(false);}} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",padding:0,flexShrink:0}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:"#2563EB"}}/>
        <span style={{fontSize:15,fontWeight:600,color:"#E2E8F0",fontFamily:F}}>nutrionally <span style={{fontWeight:400,color:"#93C5FD",fontSize:13}}>learn</span></span>
      </button>
      <a href="https://nutrionally.com" target="_blank" rel="noopener noreferrer" style={{fontSize:11,color:"#93C5FD",fontFamily:F,textDecoration:"none",padding:"3px 8px",borderRadius:6,border:"0.5px solid #3A5BA0",marginLeft:4}}>nutrionally.com ↗</a>
      {!isMobile&&[{id:"s1",label:{ES:"Calculadora",EN:"Calculator"}},{id:"s4",label:{ES:"Lista de alimentos",EN:"Food list"}},{id:"s5",label:{ES:"NPT / NE",EN:"PN / EN"}},{id:"s6",label:{ES:"Fórmulas GEB",EN:"GEB Formulas"}},{id:"s7",label:{ES:"Bal. nitrogenado",EN:"N Balance"}},{id:"s8",label:{ES:"Ireton-Jones",EN:"Ireton-Jones"}}].map(item=>(
        <button key={item.id} onClick={()=>setScreen(item.id)} style={{fontSize:13,fontFamily:F,background:"none",border:"none",cursor:"pointer",color:screen===item.id?"#93C5FD":"#8B949E",fontWeight:screen===item.id?500:400,borderBottom:screen===item.id?"2px solid #2563EB":"2px solid transparent",paddingBottom:2,flexShrink:0}}>{item.label[lang]}</button>
      ))}
      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:6}}>
        <div style={{display:"flex",borderRadius:8,overflow:"hidden",border:`1.5px solid ${studyMode?"#7C3AED":"#3A5BA0"}`}}>
          {[{val:false,label:{ES:"Calculadora",EN:"Calculator"},icon:"⊞"},{val:true,label:{ES:"Study Mode",EN:"Study Mode"},icon:"◎"}].map(opt=>{
            const active=studyMode===opt.val;
            return (
              <button key={String(opt.val)} onClick={()=>setStudyMode(opt.val)} style={{padding:"5px 10px",fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:F,background:active?(opt.val?"#7C3AED":"#2563EB"):"transparent",color:active?"#fff":"#8B949E",border:"none",display:"flex",alignItems:"center",gap:5,whiteSpace:"nowrap"}}>
                <span style={{fontSize:12}}>{opt.icon}</span>
                
              </button>
            );
          })}
        </div>
        
        <div style={{display:"flex",border:"0.5px solid #3A5BA0",borderRadius:6,overflow:"hidden"}}>
          {["ES","EN"].map(l=>(
            <button key={l} onClick={()=>setLang(l)} style={{padding:"5px 10px",fontSize:12,fontWeight:500,cursor:"pointer",background:lang===l?"#2563EB":"transparent",color:lang===l?"#fff":"#93C5FD",border:"none",fontFamily:F}}>{l}</button>
          ))}
        </div>
        {onNewCase&&<button onClick={onNewCase} style={{fontSize:12,fontWeight:500,padding:"5px 10px",borderRadius:6,background:"transparent",color:"#93C5FD",border:"0.5px solid #3A5BA0",cursor:"pointer",fontFamily:F,flexShrink:0}}>{lang==="ES"?"+ Nuevo":"+ New"}</button>}{onCases&&<button onClick={onCases} style={{fontSize:12,fontWeight:500,padding:"5px 10px",borderRadius:6,background:"transparent",color:"#93C5FD",border:"0.5px solid #3A5BA0",cursor:"pointer",fontFamily:F,flexShrink:0}}>{casesLabel}{casesCount>0&&<span style={{background:"#2563EB",color:"#fff",borderRadius:10,padding:"1px 5px",fontSize:10,fontWeight:600,marginLeft:4}}>{casesCount}</span>}</button>}
      </div>
    </nav>
  );
}

function StepPills({lang,current,setScreen}) {
  const steps=[{id:"s1",label:{ES:"Datos",EN:"Data"}},{id:"s2",label:{ES:"Macros",EN:"Macros"}},{id:"s3",label:{ES:"Intercambios",EN:"Exchanges"}}];
  const idx=steps.findIndex(s=>s.id===current);
  return (
    <div style={{background:"#fff",borderBottom:"0.5px solid #D4E3FF",padding:"9px 20px",display:"flex",alignItems:"center",gap:6,overflowX:"auto",flexShrink:0}}>
      {steps.map((step,i)=>(
        <div key={step.id} style={{display:"flex",alignItems:"center",gap:6,flexShrink:0}}>
          <button onClick={()=>i<=idx&&setScreen(step.id)} style={{fontSize:11,padding:"4px 14px",borderRadius:20,fontWeight:500,fontFamily:F,cursor:i<=idx?"pointer":"default",background:i<idx?"#F5F7FF":i===idx?"#2563EB":"#F5F7FF",color:i<idx?"#3A5BA0":i===idx?"#fff":"#3A5BA0",border:i<idx?"0.5px solid #D4E3FF":i===idx?"2px solid #2563EB":"0.5px solid #D4E3FF"}}>
            {i<idx?"✓ ":i===idx?`${i+1}. `:""}{step.label[lang]}
          </button>
          <span style={{fontSize:11,color:"#D4E3FF",flexShrink:0}}>→</span>
        </div>
      ))}
      <span style={{fontSize:11,padding:"4px 14px",borderRadius:20,fontWeight:500,fontFamily:F,background:"#F5F7FF",color:"#3A5BA0",border:"0.5px solid #D4E3FF",flexShrink:0}}>{lang==="ES"?"4. Exportar":"4. Export"}</span>
    </div>
  );
}

const T1={
  ES:{title:"Datos del caso",subtitle:"Ingresa los datos del paciente. Todo calcula en tiempo real.",caseName:"Nombre del caso",caseNamePH:"Ej. Paciente A — Caso 3",sex:"Sexo biologico",female:"Femenino",male:"Masculino",weight:"Peso",height:"Talla",age:"Edad",waist:"Cintura",years:"anos",goal:"Objetivo de peso",goals:[{key:"bajar",label:"Bajar peso",kcal:"20 Kcal/kg",icon:"↓"},{key:"mantener",label:"Mantener peso",kcal:"24 Kcal/kg",icon:"→"},{key:"subir",label:"Subir peso",kcal:"28 Kcal/kg",icon:"↑"}],activity:"Nivel de actividad",activities:["Muy sedentario","Poco activo","Activo","Muy activo"],condition:"Condicion de salud (opcional)",condOpts:[{key:"none",label:"Ninguna",disabled:false},{key:"dm2",label:"Diabetes tipo 2",disabled:false},{key:"obesity",label:"Obesidad",disabled:false},{key:"ped",label:"Pediatrico",disabled:true}],condNote:{dm2:"DM2: HC ajustado a 47% · 5 tiempos de comida (ADA 2024)",obesity:"Obesidad: se calcula el Peso Ideal segun Hamwi"},idealWeight:"Peso ideal (Hamwi)",results:"Resultados",bmi:"IMC",bmiS:{bajo:"Bajo peso",normal:"Normal",sobre:"Sobrepeso",obeso:"Obeso"},geb:"GEB (Metabolismo basal)",vet:"VET (Energia total)",kcalKg:"Kcal/kg asignadas",kcalDay:"kcal/dia",next:"Ver macronutrientes →",calc:"Calculado automaticamente",formula:"Harris-Benedict"},
  EN:{title:"Case data",subtitle:"Enter patient data. Everything calculates in real time.",caseName:"Case name",caseNamePH:"E.g. Patient A — Case 3",sex:"Biological sex",female:"Female",male:"Male",weight:"Weight",height:"Height",age:"Age",waist:"Waist",years:"years",goal:"Weight goal",goals:[{key:"bajar",label:"Lose weight",kcal:"20 Kcal/kg",icon:"↓"},{key:"mantener",label:"Maintain weight",kcal:"24 Kcal/kg",icon:"→"},{key:"subir",label:"Gain weight",kcal:"28 Kcal/kg",icon:"↑"}],activity:"Activity level",activities:["Sedentary","Lightly active","Active","Very active"],condition:"Health condition (optional)",condOpts:[{key:"none",label:"None",disabled:false},{key:"dm2",label:"Type 2 Diabetes",disabled:false},{key:"obesity",label:"Obesity",disabled:false},{key:"ped",label:"Pediatric",disabled:true}],condNote:{dm2:"T2D: CHO adjusted to 47% · 5 meal times (ADA 2024)",obesity:"Obesity: Ideal Body Weight calculated using Hamwi formula"},idealWeight:"Ideal weight (Hamwi)",results:"Results",bmi:"BMI",bmiS:{bajo:"Underweight",normal:"Normal",sobre:"Overweight",obeso:"Obese"},geb:"BMR (Basal metabolic rate)",vet:"TDEE (Total daily energy)",kcalKg:"Assigned Kcal/kg",kcalDay:"kcal/day",next:"View macronutrients →",calc:"Calculated automatically",formula:"Harris-Benedict"},
};

function Screen1({lang,state,setState,setScreen,isMobile,caseStarted,setCaseStarted}) {
  const {studyMode}=useContext(StudyModeContext);
  const t=T1[lang];
  const {caseName,sex,weightLb,heightIn,age,waist,goal,activity,condition="none"}=state;
  const wkg=+(weightLb*0.4536).toFixed(1);
  const hm=+(heightIn*0.0254).toFixed(2);
  const hcm=+(heightIn*2.54).toFixed(1);
  const hasData=weightLb>0&&heightIn>0&&age>0;
  const bmi=hasData?+(wkg/(hm**2)).toFixed(1):0;
  const bs=!hasData?"normal":bmi<18.5?"bajo":bmi<25?"normal":bmi<30?"sobre":"obeso";
  const bmiC={bajo:{bg:"#E2E8F0",text:"#475569"},normal:{bg:"#EFF6FF",text:"#2563EB"},sobre:{bg:"#FAEEDA",text:"#854F0B"},obeso:{bg:"#FCEBEB",text:"#A32D2D"}};
  const geb=Math.round(sex==="F"?(655+9.6*wkg+1.9*hcm-4.7*age):(66+13.8*wkg+5*hcm-6.8*age));
  const kcalMap={bajar:20,mantener:24,subir:28};
  const vet=Math.round(kcalMap[goal]*wkg);
  const idealKg=hamwi(sex,heightIn);

  useEffect(()=>{
    if(condition==="dm2") setState(p=>({...p,protPct:p.protPct||17,lipPct:p.lipPct||36,hcPct:47,mealTimes:5}));
    else if(condition==="none") setState(p=>({...p,hcPct:53,mealTimes:4}));
  },[condition]);

  const ls={fontSize:10,fontWeight:500,color:"#2D4270",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6,display:"block",fontFamily:F};
  const inp={background:"#EFF6FF",border:"1px solid #2563EB",borderRadius:6,padding:"8px 12px",fontFamily:F,fontWeight:600,fontSize:14,color:"#1E2D4E",width:"100%",boxSizing:"border-box",outline:"none"};

  function Stepper({val,onCh,min=1}) {
    const ref=useRef(null);
    useEffect(()=>{if(ref.current&&document.activeElement!==ref.current)ref.current.value=String(val);},[val]);
    return (
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <button onClick={()=>{const n=Math.max(min,val-1);onCh(n);if(ref.current)ref.current.value=String(n);}} style={{width:32,height:32,borderRadius:6,border:"0.5px solid #3A5BA0",background:"#F5F7FF",color:"#2563EB",fontSize:18,fontWeight:600,cursor:"pointer",fontFamily:F,flexShrink:0}}>−</button>
        <input ref={ref} type="number" defaultValue={val} onChange={e=>{const v=parseInt(e.target.value);if(!isNaN(v)&&v>=min)onCh(v);}} style={{flex:1,background:"#EFF6FF",border:"1px solid #2563EB",borderRadius:6,padding:"7px 12px",fontFamily:F,fontWeight:600,fontSize:14,color:"#1E2D4E",textAlign:"center",minWidth:50,width:"100%",outline:"none"}}/>
        <button onClick={()=>onCh(val+1)} style={{width:32,height:32,borderRadius:6,border:"0.5px solid #3A5BA0",background:"#F5F7FF",color:"#2563EB",fontSize:18,fontWeight:600,cursor:"pointer",fontFamily:F,flexShrink:0}}>+</button>
      </div>
    );
  }

  const ResultsPanel=()=>(
    <div style={{background:"#fff",borderRadius:12,border:"0.5px solid #D4E3FF",padding:18,position:"sticky",top:16}}>
      <div style={{fontSize:11,fontWeight:500,color:"#2D4270",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:12,fontFamily:F,display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:"#2563EB"}}/>{t.results}
      </div>
      {studyMode&&hasData&&<StudyPanel isES={lang==="ES"} patient={state} geb={geb} vet={state.vet||0} bmi={bmi} bs={bs} hasData={hasData} F={F}/>}
      {[{label:t.bmi,value:bmi,badge:t.bmiS[bs],badgeColor:bmiC[bs]},{label:t.geb,value:geb.toLocaleString(),unit:t.kcalDay},{label:t.vet,value:vet.toLocaleString(),unit:t.kcalDay}].map(k=>(
        <div key={k.label} style={{background:"#1E2D4E",border:"0.5px solid #2D4270",borderRadius:10,padding:"11px 14px",marginBottom:8}}>
          <div style={{fontSize:9,fontWeight:500,color:"#93C5FD",textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:F,marginBottom:5}}>{k.label}</div>
          <div style={{display:"flex",alignItems:"baseline",gap:5}}>
            <span style={{fontSize:20,fontWeight:500,color:"#E2E8F0",fontFamily:F}}>{k.value}</span>
            {k.unit&&<span style={{fontSize:10,color:"#93C5FD",fontFamily:F}}>{k.unit}</span>}
            {k.badge&&<span style={{fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:20,background:k.badgeColor?.bg,color:k.badgeColor?.text,fontFamily:F,marginLeft:4}}>{k.badge}</span>}
          </div>
        </div>
      ))}
      {condition==="obesity"&&(
        <div style={{background:"#1E2D4E",border:"0.5px solid #7C3AED",borderRadius:10,padding:"11px 14px",marginBottom:8}}>
          <div style={{fontSize:9,fontWeight:500,color:"#A78BFA",textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:F,marginBottom:5}}>{t.idealWeight}</div>
          <div style={{display:"flex",alignItems:"baseline",gap:5}}>
            <span style={{fontSize:20,fontWeight:500,color:"#E2E8F0",fontFamily:F}}>{idealKg}</span>
            <span style={{fontSize:10,color:"#A78BFA",fontFamily:F}}>kg</span>
            <span style={{fontSize:10,color:"#A78BFA",fontFamily:F,marginLeft:4}}>({+(idealKg/0.4536).toFixed(0)} lb)</span>
          </div>
          <div style={{fontSize:9,color:"#7C3AED",marginTop:3,fontFamily:F}}>Hamwi · diferencia: {+(wkg-idealKg).toFixed(1)} kg</div>
        </div>
      )}
      <div style={{background:"#F5F7FF",border:"0.5px solid #D4E3FF",borderRadius:8,padding:"10px 14px",marginBottom:8}}>
        <div style={{fontSize:9,fontWeight:500,color:"#3A5BA0",textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:F,marginBottom:4}}>{t.kcalKg}</div>
        <div style={{fontSize:18,fontWeight:500,color:"#1E2D4E",fontFamily:F}}>{kcalMap[goal]} <span style={{fontSize:10,color:"#3A5BA0"}}>Kcal/kg</span></div>
      </div>
      {condition==="dm2"&&(
        <div style={{background:"#EFF6FF",border:"0.5px solid #2563EB",borderRadius:8,padding:"10px 12px",marginBottom:8}}>
          <div style={{fontSize:10,fontWeight:600,color:"#2563EB",fontFamily:F,marginBottom:6}}>Ajustes DM2 activos</div>
          {[["HC","47%","↓ de 53%"],["Tiempos","5","↑ de 4"],["IG","Bajo","ADA 2024"]].map(([k,v,s])=>(
            <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#2D4270",fontFamily:F,marginBottom:3}}>
              <span>{k}</span><span style={{fontWeight:600,color:"#1E2D4E"}}>{v} <span style={{color:"#2563EB",fontWeight:400}}>{s}</span></span>
            </div>
          ))}
        </div>
      )}
      <div style={{background:"#F5F7FF",border:"0.5px solid #D4E3FF",borderRadius:8,padding:"12px 14px",marginTop:10}}>
        <div style={{fontSize:9,fontWeight:500,color:"#3A5BA0",textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:F,marginBottom:10}}>Macros (17/{condition==="dm2"?36:30}/{condition==="dm2"?47:53}%)</div>
        {[{label:"Proteinas",pct:17,g:Math.round(vet*0.17/4),color:"#2563EB"},{label:"Lipidos",pct:condition==="dm2"?36:30,g:Math.round(vet*(condition==="dm2"?0.36:0.30)/9),color:"#3A5BA0"},{label:"HC",pct:condition==="dm2"?47:53,g:Math.round(vet*(condition==="dm2"?0.47:0.53)/4),color:"#93C5FD"}].map(m=>(
          <div key={m.label} style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
              <span style={{fontSize:11,color:"#2D4270",fontFamily:F}}>{m.label} {m.pct}%</span>
              <span style={{fontSize:11,fontWeight:500,color:"#1E2D4E",fontFamily:F}}>{m.g} g</span>
            </div>
            <div style={{height:6,background:"#D4E3FF",borderRadius:3,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${m.pct}%`,background:m.color,borderRadius:3,transition:"width 0.4s"}}/>
            </div>
          </div>
        ))}
      </div>
      <div style={{fontSize:10,color:"#3A5BA0",marginTop:8,fontFamily:F}}>{t.calc} · {t.formula}</div>
    </div>
  );

  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:isMobile?"14px 12px":"22px 24px"}}>
      <div style={{marginBottom:18}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}><h1 style={{fontSize:22,fontWeight:500,color:"#1E2D4E",margin:0,fontFamily:F}}>{t.title}</h1><button onClick={()=>{setState({...DEFAULT_PATIENT});setCaseStarted(false);try{localStorage.removeItem("nl_patient_v1");}catch{}}} style={{padding:"7px 14px",borderRadius:8,background:"#F5F7FF",color:"#3A5BA0",fontSize:12,fontWeight:500,border:"0.5px solid #D4E3FF",cursor:"pointer",fontFamily:F}}>{lang==="ES"?"+ Nuevo caso":"+ New case"}</button></div>
        <p style={{fontSize:13,color:"#3A5BA0",margin:0,fontFamily:F}}>{t.subtitle}</p>
      </div>
      <div style={{display:isMobile?"block":"grid",gridTemplateColumns:"1fr 300px",gap:18}}>
        <div>
          <div style={{background:"#fff",borderRadius:12,border:"0.5px solid #D4E3FF",padding:20}}>
            <div style={{marginBottom:18}}>
              <label style={ls}>{t.caseName}</label>
              <input value={caseName} onChange={e=>setState(p=>({...p,caseName:e.target.value}))} placeholder={t.caseNamePH} style={{...inp,fontWeight:500}}/>
            </div>
            <div style={{marginBottom:18}}>
              <label style={ls}>{t.sex}</label>
              <div style={{display:"flex",gap:8}}>
                {[{v:"F",l:t.female},{v:"M",l:t.male}].map(o=>(
                  <button key={o.v} onClick={()=>setState(p=>({...p,sex:o.v}))} style={{flex:1,padding:"8px 0",borderRadius:6,cursor:"pointer",fontFamily:F,fontSize:13,fontWeight:500,border:sex===o.v?"2px solid #2563EB":"0.5px solid #D4E3FF",background:sex===o.v?"#EFF6FF":"#F5F7FF",color:sex===o.v?"#2563EB":"#3A5BA0"}}>{o.l}</button>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18}}>
              <div><label style={ls}>{t.weight}</label><Stepper val={weightLb} onCh={v=>setState(p=>({...p,weightLb:v}))} min={30}/><div style={{fontSize:11,color:"#2D4270",marginTop:4}}>{weightLb} lb → <strong style={{color:"#2563EB"}}>{wkg} kg</strong></div></div>
              <div><label style={ls}>{t.height}</label><Stepper val={heightIn} onCh={v=>setState(p=>({...p,heightIn:v}))} min={40}/><div style={{fontSize:11,color:"#2D4270",marginTop:4}}>{heightIn} pulg → <strong style={{color:"#2563EB"}}>{hm} m</strong></div></div>
              <div><label style={ls}>{t.age}</label><Stepper val={age} onCh={v=>setState(p=>({...p,age:v}))} min={1}/><div style={{fontSize:11,color:"#2D4270",marginTop:4}}>{age} {t.years}</div></div>
              <div><label style={ls}>{t.waist}</label><Stepper val={waist} onCh={v=>setState(p=>({...p,waist:v}))} min={40}/><div style={{fontSize:11,color:"#2D4270",marginTop:4}}>{waist} cm</div></div>
            </div>
            <div style={{marginBottom:18}}>
              <label style={ls}>{t.goal}</label>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
                {t.goals.map(g=>(
                  <button key={g.key} onClick={()=>setState(p=>({...p,goal:g.key}))} style={{border:goal===g.key?"2px solid #2563EB":"0.5px solid #D4E3FF",borderRadius:10,padding:"12px 8px",cursor:"pointer",textAlign:"center",background:goal===g.key?"#2563EB":"#F5F7FF",color:goal===g.key?"#fff":"#3A5BA0",fontFamily:F,transition:"all 0.15s"}}>
                    <div style={{fontSize:20,marginBottom:4}}>{g.icon}</div>
                    <div style={{fontSize:11,fontWeight:500}}>{g.label}</div>
                    <div style={{fontSize:10,opacity:0.8,marginTop:2}}>{g.kcal}</div>
                  </button>
                ))}
              </div>
            </div>
            <div style={{marginBottom:18}}>
              <label style={ls}>{t.activity}</label>
              <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                {t.activities.map((a,i)=>(
                  <button key={i} onClick={()=>setState(p=>({...p,activity:i}))} style={{padding:"7px 14px",borderRadius:20,cursor:"pointer",fontFamily:F,fontSize:12,fontWeight:500,border:activity===i?"2px solid #2563EB":"0.5px solid #D4E3FF",background:activity===i?"#2563EB":"#F5F7FF",color:activity===i?"#fff":"#3A5BA0",transition:"all 0.15s"}}>{a}</button>
                ))}
              </div>
            </div>
            <div>
              <label style={ls}>{t.condition}</label>
              <div style={{position:"relative"}}>
                <select value={condition} onChange={e=>setState(p=>({...p,condition:e.target.value}))} style={{width:"100%",padding:"9px 36px 9px 12px",borderRadius:8,border:`1.5px solid ${condition!=="none"?"#2563EB":"#D4E3FF"}`,background:condition!=="none"?"#EFF6FF":"#F5F7FF",fontFamily:F,fontSize:13,fontWeight:condition!=="none"?600:400,color:condition!=="none"?"#1E2D4E":"#3A5BA0",outline:"none",appearance:"none",cursor:"pointer"}}>
                  {t.condOpts.map(o=>(<option key={o.key} value={o.key} disabled={o.disabled}>{o.label}{o.disabled?" (próximamente)":""}</option>))}
                </select>
                <span style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",fontSize:12,color:condition!=="none"?"#2563EB":"#3A5BA0",pointerEvents:"none"}}>▾</span>
              </div>
              {condition!=="none"&&t.condNote[condition]&&(
                <div style={{marginTop:10,padding:"9px 12px",borderRadius:8,background:condition==="dm2"?"#EFF6FF":"#F3E8FF",border:`1px solid ${condition==="dm2"?"#2563EB":"#7C3AED"}`,display:"flex",alignItems:"flex-start",gap:8}}>
                  <span style={{fontSize:14,flexShrink:0}}>{condition==="dm2"?"💉":"⚖️"}</span>
                  <span style={{fontSize:11,color:condition==="dm2"?"#1E2D4E":"#4C1D95",fontFamily:F,lineHeight:1.5}}>{t.condNote[condition]}</span>
                </div>
              )}
            </div>
          </div>
          {isMobile&&<div style={{marginTop:14}}><ResultsPanel/></div>}
          <button onClick={()=>{setCaseStarted(true);setScreen("s2");}} style={{marginTop:14,width:"100%",padding:"13px 0",borderRadius:8,background:"#2563EB",color:"#fff",fontSize:14,fontWeight:500,border:"none",cursor:"pointer",fontFamily:F}}>{t.next}</button>
        </div>
        {!isMobile&&<ResultsPanel/>}
      </div>
    </div>
  );
}

function Screen2({lang,state,setState,setScreen,isMobile}) {
  const {studyMode}=useContext(StudyModeContext);
  const {weightLb,heightIn,age,sex,goal}=state;
  const wkg=+(weightLb*0.4536).toFixed(1);
  const hcm=+(heightIn*2.54).toFixed(1);
  const kcalMap={bajar:20,mantener:24,subir:28};
  const vet=Math.round(kcalMap[goal]*wkg);
  const geb=Math.round(sex==="F"?(655+9.6*wkg+1.9*hcm-4.7*age):(66+13.8*wkg+5*hcm-6.8*age));
  const isDM2=state.condition==="dm2";
  const [protPct,setProtPct]=useState(()=>isDM2?22:(state.protPct||17));
  const [lipPct,setLipPct]=useState(()=>isDM2?31:(state.lipPct||30));
  const hcPct=Math.max(0,100-protPct-lipPct);
  const protG=+(vet*protPct/100/4).toFixed(1);
  const lipG=+(vet*lipPct/100/9).toFixed(1);
  const hcG=+(vet*hcPct/100/4).toFixed(1);
  const protGkg=wkg>0?+(protG/wkg).toFixed(2):0;
  const lipGkg=wkg>0?+(lipG/wkg).toFixed(2):0;
  const hcGkg=wkg>0?+(hcG/wkg).toFixed(2):0;
  const enp=protG>0?+((vet*lipPct/100+vet*hcPct/100)/(protG*0.16)).toFixed(1):0;

  useEffect(()=>{
    if(state.condition==="dm2"){setProtPct(22);setLipPct(31);}
  },[state.condition]);
  useEffect(()=>{setState(p=>({...p,protPct,lipPct,hcPct,protG,lipG,hcG,vet,geb}));},[protPct,lipPct]);

  const ls={fontSize:10,fontWeight:500,color:"#3A5BA0",textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:F};
  const maxP=99-lipPct,maxL=99-protPct;
  const isES=lang==="ES";

  function PctInput({val,onCh,max}) {
    return (
      <div style={{position:"relative",display:"inline-flex",alignItems:"center"}}>
        <input type="number" min={1} max={max} value={val} onChange={e=>onCh(Math.max(1,Math.min(max,+e.target.value)))} style={{width:52,padding:"5px 20px 5px 8px",borderRadius:6,border:"1px solid #2563EB",background:"#EFF6FF",fontFamily:F,fontWeight:600,fontSize:14,color:"#1E2D4E",outline:"none",textAlign:"center"}}/>
        <span style={{position:"absolute",right:8,fontSize:12,color:"#2563EB",fontWeight:600,pointerEvents:"none"}}>%</span>
      </div>
    );
  }

  const rows=[
    {label:isES?"Proteinas":"Proteins",pct:protPct,onCh:v=>setProtPct(Math.min(v,maxP)),max:maxP,kcal:Math.round(vet*protPct/100),g:protG,gkg:protGkg,color:"#2563EB",editable:true},
    {label:isES?"Lipidos":"Lipids",pct:lipPct,onCh:v=>setLipPct(Math.min(v,maxL)),max:maxL,kcal:Math.round(vet*lipPct/100),g:lipG,gkg:lipGkg,color:"#3A5BA0",editable:true},
    {label:"HC",pct:hcPct,onCh:null,max:0,kcal:Math.round(vet*hcPct/100),g:hcG,gkg:hcGkg,color:"#93C5FD",editable:false},
  ];

  return (
    <div style={{maxWidth:1100,margin:"0 auto",padding:isMobile?"14px 12px":"22px 24px"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:18,flexWrap:"wrap",gap:12}}>
        <div>
          <h1 style={{fontSize:22,fontWeight:500,color:"#1E2D4E",margin:"0 0 4px",fontFamily:F}}>{isES?"Macronutrientes":"Macronutrients"}</h1>
          <p style={{fontSize:13,color:"#3A5BA0",margin:0,fontFamily:F}}>{isES?"Ajusta la distribucion calorica.":"Adjust caloric distribution."}</p>
        </div>
        <div style={{background:"#1E2D4E",border:"0.5px solid #2D4270",borderRadius:10,padding:"10px 16px",display:"flex",gap:18,flexWrap:"wrap"}}>
          {[{l:"VET",v:`${vet.toLocaleString()} kcal`},{l:"GEB",v:`${geb.toLocaleString()} kcal`},{l:isES?"Objetivo":"Goal",v:isES?goal==="bajar"?"Bajar":goal==="mantener"?"Mantener":"Subir":goal==="bajar"?"Lose":goal==="mantener"?"Maintain":"Gain"}].map(i=>(
            <div key={i.l}><div style={{fontSize:9,color:"#93C5FD",textTransform:"uppercase",letterSpacing:"0.05em",fontWeight:500,fontFamily:F,marginBottom:2}}>{i.l}</div><div style={{fontSize:12,color:"#E2E8F0",fontWeight:500,fontFamily:F}}>{i.v}</div></div>
          ))}
        </div>
      </div>
      <div style={{display:isMobile?"block":"grid",gridTemplateColumns:"1fr 296px",gap:14}}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:"#fff",border:"0.5px solid #D4E3FF",borderRadius:12,overflow:"hidden"}}>
            <div style={{padding:"13px 18px",borderBottom:"0.5px solid #D4E3FF",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,fontWeight:500,color:"#1E2D4E",fontFamily:F}}>{isES?"Distribucion de macronutrientes":"Macronutrient distribution"}</span>
              <div style={{display:"flex",gap:10}}>
                {[{c:"#EFF6FF",b:"#2563EB",l:"Editable"},{c:"#FEF9E7",b:"#e8d89a",l:isES?"Calculado":"Calculated"},{c:"#D4E3FF",b:"#93C5FD",l:isES?"Heredado":"Inherited"}].map(leg=>(
                  <div key={leg.l} style={{display:"flex",alignItems:"center",gap:4}}><div style={{width:10,height:10,borderRadius:3,background:leg.c,border:`0.5px solid ${leg.b}`}}/><span style={{fontSize:10,color:"#3A5BA0",fontFamily:F}}>{leg.l}</span></div>
                ))}
              </div>
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontFamily:F,fontSize:13}}>
                <thead>
                  <tr style={{background:"#F5F7FF"}}>
                    {[isES?"Nutriente":"Nutrient","%","Kcal","g","g/kg"].map(h=>(
                      <th key={h} style={{padding:"8px 14px",textAlign:h==="%"||h==="Kcal"||h==="g"||h==="g/kg"?"center":"left",...ls,fontWeight:500,borderBottom:"0.5px solid #D4E3FF"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row=>(
                    <tr key={row.label} style={{borderBottom:"0.5px solid #F0F4FF"}}>
                      <td style={{padding:"11px 14px"}}>
                        <div style={{display:"flex",alignItems:"center",gap:8}}>
                          <div style={{width:10,height:10,borderRadius:"50%",background:row.color,flexShrink:0}}/>
                          <span style={{fontWeight:500,color:"#1E2D4E"}}>{row.label}</span>
                          {!row.editable&&<span style={{fontSize:10,color:"#3A5BA0"}}>{isES?"(calculado)":"(auto)"}</span>}
                        </div>
                      </td>
                      <td style={{textAlign:"center",padding:"11px 14px"}}>
                        {row.editable?<PctInput val={row.pct} onCh={row.onCh} max={row.max}/>:<div style={{display:"inline-block",padding:"5px 10px",background:"#D4E3FF",border:"0.5px solid #93C5FD",borderRadius:6,fontFamily:F,fontWeight:600,fontSize:14,color:"#1E2D4E",minWidth:48,textAlign:"center"}}>{row.pct}%</div>}
                      </td>
                      <td style={{textAlign:"center",padding:"11px 14px"}}><CalcCell value={row.kcal}/></td>
                      <td style={{textAlign:"center",padding:"11px 14px"}}><CalcCell value={row.g} unit="g"/></td>
                      <td style={{textAlign:"center",padding:"11px 14px"}}><CalcCell value={row.gkg} unit="g/kg"/></td>
                    </tr>
                  ))}
                  <tr style={{background:"#F5F7FF",borderTop:"0.5px solid #D4E3FF"}}>
                    <td style={{padding:"10px 14px",fontWeight:600,color:"#1E2D4E",fontSize:13}}>Total</td>
                    <td style={{textAlign:"center",padding:"10px 14px",fontWeight:600,color:"#1E2D4E"}}>100%</td>
                    <td style={{textAlign:"center",padding:"10px 14px",fontWeight:600,color:"#1E2D4E"}}>{vet}</td>
                    <td style={{textAlign:"center",padding:"10px 14px",fontSize:11,color:"#3A5BA0"}}>ENP: <strong style={{color:"#1E2D4E"}}>{enp}</strong></td>
                    <td style={{textAlign:"center",padding:"10px 14px"}}><span style={{display:"inline-block",padding:"2px 8px",borderRadius:20,fontSize:11,fontWeight:600,...adecColor(100)}}>100%</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{padding:"9px 18px",borderTop:"0.5px solid #D4E3FF",background:"#F5F7FF",fontSize:11,color:"#3A5BA0",fontFamily:F}}>
              ℹ {isES?"Proteinas y Lipidos son editables. HC se calcula automaticamente.":"Protein and Lipid % are editable. CHO is calculated automatically."}
            </div>
          </div>
          <div style={{background:"#fff",border:"0.5px solid #D4E3FF",borderRadius:12,padding:"16px 18px"}}>
            {rows.map(row=>(
              <div key={row.label} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,color:"#2D4270",fontFamily:F}}>{row.label} <strong style={{color:"#1E2D4E"}}>{row.pct}%</strong></span>
                  <span style={{fontSize:12,fontWeight:500,color:"#1E2D4E",fontFamily:F}}>{row.g} g</span>
                </div>
                <div style={{height:8,background:"#D4E3FF",borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.min(row.pct,100)}%`,background:row.color,borderRadius:4,transition:"width 0.3s"}}/>
                </div>
              </div>
            ))}
            <div style={{height:16,borderRadius:8,overflow:"hidden",display:"flex",marginTop:14}}>
              {rows.map(r=><div key={r.label} style={{width:`${r.pct}%`,background:r.color,transition:"width 0.3s"}}/>)}
            </div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:isMobile?14:0}}>
          <KpiDark label={isES?"VET / Energia total":"TDEE / Total energy"} value={vet.toLocaleString()} unit="kcal/dia"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <KpiDark label={`${isES?"Proteinas":"Proteins"} (${protPct}%)`} value={protG} unit={`g · ${protGkg}g/kg`}/>
            <KpiDark label={`${isES?"Lipidos":"Lipids"} (${lipPct}%)`} value={lipG} unit={`g · ${lipGkg}g/kg`}/>
          </div>
          <KpiDark label={`HC (${hcPct}%)`} value={hcG} unit={`g · ${hcGkg}g/kg`}/>
          <div style={{background:"#F5F7FF",border:"0.5px solid #D4E3FF",borderRadius:10,padding:"12px 14px"}}>
            <div style={{fontSize:9,fontWeight:500,color:"#3A5BA0",textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:F,marginBottom:5}}>ENP / N2</div>
            <div style={{fontSize:20,fontWeight:500,color:"#1E2D4E",fontFamily:F}}>{enp}</div>
            <div style={{fontSize:10,color:"#3A5BA0",marginTop:3,fontFamily:F}}>= (Kcal lip + Kcal HC) / (g prot x 0.16)</div>
          </div>
          {studyMode&&<div style={{background:"#1E2D4E",borderRadius:10,padding:"12px 14px"}}>
            <div style={{fontSize:9,color:"#93C5FD",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:F,marginBottom:8}}>Harris-Benedict</div>
            <div style={{fontSize:10,color:"#D4E3FF",fontFamily:"monospace",lineHeight:1.9}}>
              <div>F: 655+(9.6xkg)+(1.9xcm)-(4.7xedad)</div>
              <div style={{color:"#3A5BA0"}}>────</div>
              <div style={{color:"#8B949E"}}>M: 66+(13.8xkg)+(5xcm)-(6.8xedad)</div>
            </div>
          </div>}
          <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:4}}>
            <button onClick={()=>window.location.href="/intercambios"} style={{padding:"11px 0",borderRadius:8,background:"#2563EB",color:"#fff",fontSize:13,fontWeight:500,border:"none",cursor:"pointer",fontFamily:F}}>
              {isES?"Ver plan de intercambios →":"View exchange plan →"}
            </button>
            <button onClick={()=>setScreen("s1")} style={{padding:"9px 0",borderRadius:8,background:"transparent",color:"#3A5BA0",fontSize:12,fontWeight:500,border:"0.5px solid #D4E3FF",cursor:"pointer",fontFamily:F}}>
              {isES?"← Datos del caso":"← Case data"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Screen3Wrapper({lang, state, setState, setScreen, isMobile, studyMode}) {
  const isES = lang === "ES";
  const groups = isES ? [
    {key:"lac_semi",label:"Lacteos semidescremados",cat:"Lacteos"},
    {key:"carne_baja",label:"Carnes bajas en grasa",cat:"Carnes"},
    {key:"carne_mod",label:"Carnes moderadas en grasa",cat:"Carnes"},
    {key:"carne_alta",label:"Carnes altas en grasa",cat:"Carnes"},
    {key:"legum",label:"Leguminosas",cat:"Leguminosas"},
    {key:"cereal",label:"Cereales",cat:"Cereales"},
    {key:"verdura",label:"Verduras",cat:"Verduras"},
    {key:"fruta",label:"Frutas",cat:"Frutas"},
    {key:"grasa",label:"Grasas",cat:"Grasas"},
    {key:"acces",label:"Accesorios",cat:"Accesorios"},
  ] : [
    {key:"lac_semi",label:"Semi-skimmed dairy",cat:"Dairy"},
    {key:"carne_baja",label:"Lean meats",cat:"Meats"},
    {key:"carne_mod",label:"Medium-fat meats",cat:"Meats"},
    {key:"carne_alta",label:"High-fat meats",cat:"Meats"},
    {key:"legum",label:"Legumes",cat:"Legumes"},
    {key:"cereal",label:"Cereals",cat:"Cereals"},
    {key:"verdura",label:"Vegetables",cat:"Vegetables"},
    {key:"fruta",label:"Fruits",cat:"Fruits"},
    {key:"grasa",label:"Fats",cat:"Fats"},
    {key:"acces",label:"Accessories",cat:"Accessories"},
  ];
  const CAT_CLR = {
    Lacteos:{bg:"#D4E3FF",tx:"#0C447C"},Dairy:{bg:"#D4E3FF",tx:"#0C447C"},
    Carnes:{bg:"#FAEEDA",tx:"#633806"},Meats:{bg:"#FAEEDA",tx:"#633806"},
    Leguminosas:{bg:"#E1F5EE",tx:"#085041"},Legumes:{bg:"#E1F5EE",tx:"#085041"},
    Cereales:{bg:"#FEF9E7",tx:"#7D3C98"},Cereals:{bg:"#FEF9E7",tx:"#7D3C98"},
    Verduras:{bg:"#EAF3DE",tx:"#27500A"},Vegetables:{bg:"#EAF3DE",tx:"#27500A"},
    Frutas:{bg:"#FBEAF0",tx:"#72243E"},Fruits:{bg:"#FBEAF0",tx:"#72243E"},
    Grasas:{bg:"#FCEBEB",tx:"#A32D2D"},Fats:{bg:"#FCEBEB",tx:"#A32D2D"},
    Accesorios:{bg:"#F5F7FF",tx:"#3A5BA0"},Accessories:{bg:"#F5F7FF",tx:"#3A5BA0"},
  };
  const MEAL_CLR = {
    D:{bg:"#EFF6FF",tx:"#1E2D4E"},A:{bg:"#D4E3FF",tx:"#0C447C"},
    C:{bg:"#FAEEDA",tx:"#633806"},M:{bg:"#FBEAF0",tx:"#72243E"},M2:{bg:"#E1F5EE",tx:"#085041"},
  };
  const EXC_V = {
    lac_semi:{prot:8,lip:4,hc:12},carne_baja:{prot:7,lip:2,hc:0},
    carne_mod:{prot:7,lip:5,hc:0},carne_alta:{prot:7,lip:8,hc:0},
    legum:{prot:7,lip:1,hc:15},cereal:{prot:2,lip:1,hc:15},
    verdura:{prot:2,lip:0,hc:5},fruta:{prot:0,lip:0,hc:15},
    grasa:{prot:0,lip:5,hc:0},acces:{prot:0,lip:0,hc:10},
  };
  const DEF_EXC = {
    lac_semi:{total:1,D:1,A:0,C:0,M:0,M2:0},carne_baja:{total:3,D:0,A:2,C:1,M:0,M2:0},
    carne_mod:{total:1,D:0,A:1,C:0,M:0,M2:0},carne_alta:{total:0,D:0,A:0,C:0,M:0,M2:0},
    legum:{total:1,D:0,A:1,C:0,M:0,M2:0},cereal:{total:6,D:2,A:2,C:2,M:0,M2:0},
    verdura:{total:3,D:0,A:2,C:1,M:0,M2:0},fruta:{total:5,D:1,A:1,C:1,M:2,M2:0},
    grasa:{total:6,D:2,A:3,C:1,M:0,M2:0},acces:{total:0,D:0,A:0,C:0,M:0,M2:0},
  };
  const aClr = (p) => p>=90&&p<=110?{bg:"#EFF6FF",tx:"#2563EB"}:p>=75?{bg:"#FAEEDA",tx:"#854F0B"}:{bg:"#FCEBEB",tx:"#A32D2D"};
  const has5 = (state.mealTimes||4) >= 5;
  const mealKeys = has5 ? ["D","A","C","M","M2"] : ["D","A","C","M"];
  const mealLbl = {D:isES?"Desayuno":"Breakfast",A:isES?"Almuerzo":"Lunch",C:isES?"Cena":"Dinner",M:isES?"Merienda":"Snack",M2:isES?"Merienda 2":"Snack 2"};
  const meta = {prot:state.protG||67,lip:state.lipG||53,hc:state.hcG||210,kcal:state.vet||1582};
  const [exc, setExc] = useState(() => {
    const saved = state.exchanges;
    if (!saved) return JSON.parse(JSON.stringify(DEF_EXC));
    const m = {};
    Object.keys(DEF_EXC).forEach(k => { m[k] = {M2:0,...DEF_EXC[k],...saved[k]}; });
    return m;
  });
  useEffect(() => { setState(p => ({...p, exchanges: exc})); }, [exc]);
  function setE(key, field, val) {
    setExc(prev => {
      const u = {...prev[key], [field]: val};
      if (field !== "total") u.total = mealKeys.reduce((s,mk) => s+(u[mk]||0), 0);
      return {...prev, [key]: u};
    });
  }
  const tot = useMemo(() => {
    let p=0,l=0,h=0;
    Object.keys(EXC_V).forEach(k => {
      const ev=EXC_V[k]; const n=(exc[k]?.total)||0;
      p+=n*ev.prot; l+=n*ev.lip; h+=n*ev.hc;
    });
    return {p,l,h,kcal:p*4+l*9+h*4};
  }, [exc]);
  function mKcal(mk) {
    let k=0;
    Object.keys(EXC_V).forEach(key => {
      const ev=EXC_V[key]; const n=(exc[key]?.[mk])||0;
      k+=n*(ev.prot*4+ev.lip*9+ev.hc*4);
    });
    return k;
  }
  const adecP=Math.round(tot.p/meta.prot*100);
  const adecL=Math.round(tot.l/meta.lip*100);
  const adecH=Math.round(tot.h/meta.hc*100);
  const vetMin = state.sex==="F" ? 1200 : 1500;
  const thS = {padding:"7px 12px",fontSize:10,fontWeight:500,color:"#3A5BA0",textTransform:"uppercase",letterSpacing:"0.05em",borderBottom:"0.5px solid #D4E3FF",fontFamily:F};
  const tdC = {padding:"8px 12px",textAlign:"center",fontFamily:F};

  function NBtn({val, onCh}) {
    return (
      <div style={{display:"flex",alignItems:"center",gap:3,justifyContent:"center"}}>
        <button onClick={()=>onCh(Math.max(0,val-1))} style={{width:20,height:20,borderRadius:4,border:"0.5px solid #D4E3FF",background:"#F5F7FF",color:"#2563EB",fontSize:14,fontWeight:600,cursor:"pointer",padding:0}}>-</button>
        <div style={{width:30,height:26,background:"#EFF6FF",border:"1px solid #2563EB",borderRadius:5,fontWeight:600,fontSize:12,color:"#1E2D4E",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:F}}>{val}</div>
        <button onClick={()=>onCh(val+1)} style={{width:20,height:20,borderRadius:4,border:"0.5px solid #D4E3FF",background:"#F5F7FF",color:"#2563EB",fontSize:14,fontWeight:600,cursor:"pointer",padding:0}}>+</button>
      </div>
    );
  }
  function CCell({val, hi}) {
    return <div style={{background:hi?"#EFF6FF":"#FEF9E7",border:`0.5px solid ${hi?"#93C5FD":"#e8d89a"}`,borderRadius:5,padding:"3px 8px",fontFamily:F,fontWeight:500,fontSize:12,color:hi?"#1E2D4E":"#7D3C98",textAlign:"center",minWidth:36,display:"inline-block"}}>{val}</div>;
  }

  const lacProt = EXC_V.lac_semi.prot*exc.lac_semi.total;
  const meatProt = EXC_V.carne_baja.prot*exc.carne_baja.total + EXC_V.carne_mod.prot*(exc.carne_mod?.total||0) + EXC_V.carne_alta.prot*(exc.carne_alta?.total||0);
  const animalPct = tot.p>0 ? Math.round((lacProt+meatProt)/tot.p*100) : 0;
  const vegFatPct = tot.l>0 ? Math.round((EXC_V.grasa.lip*exc.grasa.total)/tot.l*100) : 0;
  const sugarPct  = tot.kcal>0 ? Math.round((EXC_V.acces.hc*exc.acces.total*4)/tot.kcal*100) : 0;

  return (
    <div style={{maxWidth:1140,margin:"0 auto",padding:isMobile?"14px 10px":"22px 24px"}}>
      <div style={{marginBottom:16}}>
        <h1 style={{fontSize:22,fontWeight:500,color:"#1E2D4E",margin:"0 0 4px",fontFamily:F}}>{isES?"Plan de intercambios":"Exchange plan"}</h1>
        <p style={{fontSize:13,color:"#3A5BA0",margin:0,fontFamily:F}}>{state.caseName||"—"} · VET {(state.vet||1582).toLocaleString()} kcal</p>
      </div>
      <div style={{display:isMobile?"block":"grid",gridTemplateColumns:"1fr 270px",gap:14}}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:"#fff",border:"0.5px solid #D4E3FF",borderRadius:12,overflow:"hidden"}}>
            <div style={{padding:"12px 16px",borderBottom:"0.5px solid #D4E3FF"}}><span style={{fontSize:13,fontWeight:500,color:"#1E2D4E",fontFamily:F}}>{isES?"Grupos de alimentos":"Food groups"}</span></div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontFamily:F}}>
                <thead><tr style={{background:"#F5F7FF"}}>
                  {[isES?"Grupo":"Group",isES?"Interc.":"Exch.","Prot",isES?"Lip":"Fat","HC"].map((h,i)=><th key={h} style={{...thS,textAlign:i===0?"left":"center"}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {groups.map(g=>{const ev=EXC_V[g.key];const n=exc[g.key].total;const cs=CAT_CLR[g.cat]||{bg:"#F5F7FF",tx:"#3A5BA0"};return(
                    <tr key={g.key} style={{borderBottom:"0.5px solid #F0F4FF"}}>
                      <td style={{padding:"8px 12px"}}><span style={{display:"inline-block",fontSize:11,fontWeight:500,padding:"3px 10px",borderRadius:20,background:cs.bg,color:cs.tx}}>{g.label}</span></td>
                      <td style={tdC}><NBtn val={n} onCh={v=>setE(g.key,"total",v)}/></td>
                      <td style={tdC}><CCell val={n*ev.prot}/></td>
                      <td style={tdC}><CCell val={n*ev.lip}/></td>
                      <td style={tdC}><CCell val={n*ev.hc}/></td>
                    </tr>
                  );})}
                  <tr style={{background:"#F5F7FF",borderTop:"0.5px solid #D4E3FF"}}>
                    <td style={{padding:"9px 12px",fontWeight:600,color:"#1E2D4E",fontSize:13}}>Total</td>
                    <td style={{...tdC,fontWeight:600,color:"#1E2D4E"}}>{Object.values(exc).reduce((s,e)=>s+e.total,0)}</td>
                    <td style={tdC}><CCell val={tot.p} hi/></td><td style={tdC}><CCell val={tot.l} hi/></td><td style={tdC}><CCell val={tot.h} hi/></td>
                  </tr>
                  <tr style={{background:"#EFF6FF",borderTop:"0.5px solid #D4E3FF"}}>
                    <td style={{padding:"7px 12px",fontSize:11,color:"#2563EB",fontWeight:500}}>{isES?"Meta":"Goal"}</td><td/>
                    {[meta.prot,meta.lip,meta.hc].map((v,i)=><td key={i} style={{...tdC,fontSize:12,fontWeight:600,color:"#2563EB"}}>{Math.round(v)}</td>)}
                  </tr>
                  <tr style={{borderTop:"0.5px solid #D4E3FF"}}>
                    <td style={{padding:"7px 12px",fontSize:11,color:"#3A5BA0"}}>% {isES?"Adec.":"Adec."}</td><td/>
                    {[adecP,adecL,adecH].map((v,i)=>{const c=aClr(v);return<td key={i} style={tdC}><span style={{display:"inline-block",padding:"2px 7px",borderRadius:20,fontSize:11,fontWeight:600,background:c.bg,color:c.tx}}>{v}%</span></td>;})}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div style={{background:"#fff",border:"0.5px solid #D4E3FF",borderRadius:12,overflow:"hidden"}}>
            <div style={{padding:"12px 16px",borderBottom:"0.5px solid #D4E3FF",display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:13,fontWeight:500,color:"#1E2D4E",fontFamily:F}}>{isES?"Distribucion por tiempo":"Meal distribution"}</span>
              {has5&&<span style={{fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:20,background:"#EFF6FF",color:"#2563EB",border:"0.5px solid #2563EB",fontFamily:F}}>DM2 · 5 tiempos</span>}
            </div>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontFamily:F}}>
                <thead><tr style={{background:"#F5F7FF"}}>
                  <th style={{...thS,textAlign:"left"}}>{isES?"Grupo":"Group"}</th>
                  {mealKeys.map(mk=>{const mc=MEAL_CLR[mk];return<th key={mk} style={{...thS,textAlign:"center"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:3}}>
                      <div style={{width:20,height:20,borderRadius:"50%",background:mc.bg,color:mc.tx,fontSize:9,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center"}}>{mk}</div>
                      <span style={{fontSize:10,color:"#3A5BA0"}}>{mealLbl[mk]}</span>
                    </div>
                  </th>;})}
                  <th style={{...thS,textAlign:"center"}}>Total</th>
                </tr></thead>
                <tbody>
                  {groups.map(g=>{const row=exc[g.key];const cs=CAT_CLR[g.cat]||{bg:"#F5F7FF",tx:"#3A5BA0"};const ms=mealKeys.reduce((s,mk)=>s+(row[mk]||0),0);return(
                    <tr key={g.key} style={{borderBottom:"0.5px solid #F0F4FF"}}>
                      <td style={{padding:"7px 12px"}}><span style={{display:"inline-block",fontSize:11,fontWeight:500,padding:"2px 8px",borderRadius:20,background:cs.bg,color:cs.tx}}>{g.label}</span></td>
                      {mealKeys.map(mk=><td key={mk} style={tdC}><NBtn val={row[mk]||0} onCh={v=>setE(g.key,mk,v)}/></td>)}
                      <td style={tdC}><CCell val={ms} hi={ms===row.total}/></td>
                    </tr>
                  );})}
                  <tr style={{background:"#F5F7FF",borderTop:"0.5px solid #D4E3FF"}}>
                    <td style={{padding:"8px 12px",fontWeight:600,color:"#1E2D4E",fontSize:11}}>~kcal</td>
                    {mealKeys.map(mk=><td key={mk} style={{...tdC,fontSize:12,fontWeight:500,color:"#1E2D4E"}}>{mKcal(mk)}</td>)}
                    <td style={{...tdC,fontSize:12,fontWeight:600,color:"#1E2D4E"}}>{tot.kcal}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          {adecP<75&&<div style={{padding:"10px 14px",borderRadius:8,display:"flex",gap:10,background:"#FCEBEB",border:"0.5px solid #F09595"}}><span style={{fontSize:16}}>⚠</span><span style={{display:"inline-block",fontSize:11,fontWeight:600,padding:"2px 9px",borderRadius:20,background:"#FCEBEB",color:"#A32D2D",border:"0.5px solid #F09595",fontFamily:F}}>{isES?"Proteinas < 75%":"Proteins < 75%"}</span></div>}
          {tot.kcal<vetMin&&<div style={{padding:"10px 14px",borderRadius:8,display:"flex",gap:10,background:"#FCEBEB",border:"0.5px solid #F09595"}}><span style={{fontSize:16}}>⚠</span><span style={{display:"inline-block",fontSize:11,fontWeight:600,padding:"2px 9px",borderRadius:20,background:"#FCEBEB",color:"#A32D2D",border:"0.5px solid #F09595",fontFamily:F}}>{isES?`VET < ${vetMin} kcal`:`TDEE < ${vetMin} kcal`}</span></div>}
          {state.condition==="dm2"&&adecH>110&&<div style={{padding:"10px 14px",borderRadius:8,display:"flex",gap:10,background:"#FAEEDA",border:"0.5px solid #EF9F27"}}><span style={{fontSize:16}}>!</span><span style={{display:"inline-block",fontSize:11,fontWeight:600,padding:"2px 9px",borderRadius:20,background:"#FAEEDA",color:"#854F0B",border:"0.5px solid #EF9F27",fontFamily:F}}>{isES?"HC > 110% en DM2":"CHO > 110% in T2D"}</span></div>}
          <div style={{background:"#fff",border:"0.5px solid #D4E3FF",borderRadius:12,padding:"16px 18px"}}>
            <div style={{fontSize:13,fontWeight:500,color:"#1E2D4E",marginBottom:14,fontFamily:F}}>{isES?"Naturaleza de los nutrimentos":"Nutrient origin"}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {[{l:isES?"Proteina animal":"Animal protein",v:animalPct,s:isES?"del total proteico":"of total protein",c:"#2563EB"},{l:isES?"Grasa vegetal":"Vegetable fat",v:vegFatPct,s:isES?"del total lipidos":"of total lipids",c:"#3A5BA0"},{l:isES?"Azucares simples":"Simple sugars",v:sugarPct,s:isES?"del VET":"of TDEE",c:sugarPct===0?"#22c55e":"#A32D2D"}].map(stat=>(
                <div key={stat.l} style={{background:"#F5F7FF",border:"0.5px solid #D4E3FF",borderRadius:10,padding:"13px 14px"}}>
                  <div style={{fontSize:9,fontWeight:500,color:"#3A5BA0",textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:F,marginBottom:6}}>{stat.l}</div>
                  <div style={{fontSize:24,fontWeight:500,color:stat.c,fontFamily:F}}>{stat.v}<span style={{fontSize:12,color:"#3A5BA0",marginLeft:2}}>%</span></div>
                  <div style={{fontSize:10,color:"#3A5BA0",marginTop:3,fontFamily:F}}>{stat.s}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:10,marginTop:isMobile?14:0}}>
          <KpiDark label={isES?"Energia total":"Total energy"} value={tot.kcal.toLocaleString()} unit="kcal/dia" sub={`${Math.round(tot.kcal/(state.vet||1582)*100)}% VET`} ok={true}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
            <KpiDark label="Prot" value={tot.p} unit="g" sub={`${adecP}%`} ok={adecP>=90}/>
            <KpiDark label={isES?"Lip":"Fat"} value={tot.l} unit="g" sub={`${adecL}%`} ok={adecL>=90}/>
          </div>
          <KpiDark label="HC" value={tot.h} unit="g" sub={`${adecH}%`} ok={adecH>=90}/>
          <div style={{background:"#fff",border:"0.5px solid #D4E3FF",borderRadius:12,padding:"14px"}}>
            <div style={{fontSize:11,fontWeight:500,color:"#1E2D4E",marginBottom:12,fontFamily:F}}>{isES?"Kcal por tiempo":"Kcal by meal"}</div>
            {mealKeys.map(mk=>{const kcal=mKcal(mk);const pct=tot.kcal>0?Math.round(kcal/tot.kcal*100):0;const mc=MEAL_CLR[mk];return(
              <div key={mk} style={{marginBottom:10}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:5}}>
                    <div style={{width:20,height:20,borderRadius:"50%",background:mc.bg,color:mc.tx,fontSize:9,fontWeight:600,display:"flex",alignItems:"center",justifyContent:"center"}}>{mk}</div>
                    <span style={{fontSize:11,color:"#2D4270",fontFamily:F}}>{mealLbl[mk]}</span>
                  </div>
                  <span style={{fontSize:11,fontWeight:500,color:"#1E2D4E",fontFamily:F}}>{kcal} kcal</span>
                </div>
                <div style={{height:6,background:"#D4E3FF",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${pct}%`,background:"#2563EB",borderRadius:3}}/>
                </div>
                <div style={{fontSize:9,color:"#3A5BA0",marginTop:1,textAlign:"right",fontFamily:F}}>{pct}% VET</div>
              </div>
            );})}
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            <button onClick={()=>window.location.href="/"} style={{padding:"9px 0",borderRadius:8,background:"transparent",color:"#3A5BA0",fontSize:12,fontWeight:500,border:"0.5px solid #D4E3FF",cursor:"pointer",fontFamily:F}}>
              {isES?"← Macronutrientes":"← Macronutrients"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}



function Screen4({lang,isMobile}) {
  const [search,setSearch]=useState("");
  const [activeCat,setActiveCat]=useState("all");
  const [activeF,setActiveF]=useState("all");
  const [added,setAdded]=useState({});
  const [toast,setToast]=useState(null);
  const isES=lang==="ES";

  function matchF(food,f){return f==="all"?true:f==="hiprot"?food.prot>=7:f==="lowfat"?food.lip<=2:f==="nohc"?food.hc===0:f==="vegan"?!["lacteos","carnes_bajas","carnes_mod","carnes_altas"].includes(food.cat):true;}
  const filtered=useMemo(()=>FOODS.filter(f=>{const name=lang==="ES"?f.es:f.en;return name.toLowerCase().includes(search.toLowerCase())&&(activeCat==="all"||f.cat===activeCat)&&matchF(f,activeF);}),[search,activeCat,activeF,lang]);
  const grouped=useMemo(()=>{const m={};filtered.forEach(f=>{if(!m[f.cat])m[f.cat]=[];m[f.cat].push(f);});return m;},[filtered]);

  const CAT_TO_KEY = {
    lacteos:"lac_semi", carnes_bajas:"carne_baja", carnes_mod:"carne_mod",
    carnes_altas:"carne_alta", leguminosas:"legum", cereales:"cereal",
    verduras:"verdura", frutas:"fruta", grasas:"grasa", accesorios:"acces",
  };
  function handleAdd(food){
    setAdded(p=>({...p,[food.id]:true}));
    setToast(lang==="ES"?food.es:food.en);
    setTimeout(()=>setToast(null),2200);
    try {
      const key = CAT_TO_KEY[food.cat];
      if (!key) return;
      const saved = localStorage.getItem("nl_exc_v1");
      const exc = saved ? JSON.parse(saved) : null;
      if (!exc || !exc[key]) return;
      exc[key].total = (exc[key].total||0) + 1;
      localStorage.setItem("nl_exc_v1", JSON.stringify(exc));
    } catch {}
  }

  const LS={fontSize:10,fontWeight:500,color:"#3A5BA0",textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:F};

  return (
    <div style={{display:"flex",height:"calc(100vh - 104px)",overflow:"hidden",position:"relative"}}>
      {toast&&<div style={{position:"fixed",top:64,left:"50%",transform:"translateX(-50%)",background:"#1E2D4E",color:"#E2E8F0",padding:"9px 18px",borderRadius:8,fontSize:12,fontFamily:F,zIndex:9999,border:"0.5px solid #2563EB",whiteSpace:"nowrap"}}>+ <strong>{toast}</strong> {isES?"agregado":"added"}</div>}
      {!isMobile&&(
        <div style={{width:210,flexShrink:0,borderRight:"0.5px solid #D4E3FF",background:"#fff",overflowY:"auto",padding:"14px 0"}}>
          <div style={{padding:"0 12px",marginBottom:14}}>
            <div style={{...LS,marginBottom:8,display:"block"}}>{isES?"Grupo":"Group"}</div>
            {FOOD_CATS.map(cat=>{
              const cnt=cat.key==="all"?filtered.length:filtered.filter(f=>f.cat===cat.key).length;
              const active=activeCat===cat.key;
              return(<div key={cat.key} onClick={()=>setActiveCat(cat.key)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 8px",borderRadius:6,cursor:"pointer",marginBottom:2,background:active?"#EFF6FF":"transparent"}}>
                <span style={{fontSize:12,color:active?"#2563EB":"#2D4270",fontWeight:active?500:400,fontFamily:F}}>{cat.label[lang]}</span>
                <span style={{fontSize:10,padding:"1px 6px",borderRadius:10,background:active?"#2563EB":"#F5F7FF",color:active?"#fff":"#3A5BA0",fontFamily:F}}>{cnt}</span>
              </div>);
            })}
          </div>
          <div style={{padding:"0 12px",borderTop:"0.5px solid #D4E3FF",paddingTop:12}}>
            <div style={{...LS,marginBottom:8,display:"block"}}>{isES?"Filtrar por":"Filter by"}</div>
            {FOOD_FILTERS.map(ff=>(<div key={ff.key} onClick={()=>setActiveF(ff.key)} style={{padding:"6px 8px",borderRadius:6,cursor:"pointer",marginBottom:2,background:activeF===ff.key?"#EFF6FF":"transparent"}}>
              <span style={{fontSize:12,color:activeF===ff.key?"#2563EB":"#2D4270",fontWeight:activeF===ff.key?500:400,fontFamily:F}}>{ff.label[lang]}</span>
            </div>))}
          </div>
        </div>
      )}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{background:"#fff",borderBottom:"0.5px solid #D4E3FF",padding:"11px 18px",display:"flex",gap:10,alignItems:"center",flexShrink:0}}>
          <div style={{flex:1,display:"flex",alignItems:"center",gap:8,background:"#F5F7FF",border:"0.5px solid #D4E3FF",borderRadius:8,padding:"8px 14px"}}>
            <span style={{fontSize:13,color:"#3A5BA0"}}>⌕</span>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder={isES?"Buscar alimento...":"Search food..."} style={{flex:1,border:"none",background:"transparent",fontFamily:F,fontSize:13,color:"#1E2D4E",outline:"none"}}/>
            {search&&<button onClick={()=>setSearch("")} style={{border:"none",background:"none",cursor:"pointer",color:"#3A5BA0",fontSize:14,padding:0}}>x</button>}
          </div>
          {isMobile&&<select value={activeCat} onChange={e=>setActiveCat(e.target.value)} style={{padding:"8px 10px",borderRadius:7,border:"0.5px solid #D4E3FF",background:"#F5F7FF",fontFamily:F,fontSize:12,color:"#1E2D4E"}}>
            {FOOD_CATS.map(c=><option key={c.key} value={c.key}>{c.label[lang]}</option>)}
          </select>}
        </div>
        <div style={{background:"#F5F7FF",borderBottom:"0.5px solid #D4E3FF",padding:"6px 18px",display:"flex",justifyContent:"space-between",flexShrink:0}}>
          <span style={{fontSize:11,color:"#3A5BA0",fontFamily:F}}>{filtered.length} {isES?"alimentos":"foods"} · 1 {isES?"intercambio = porcion indicada":"exchange = indicated portion"}</span>
          <span style={{fontSize:11,color:"#3A5BA0",fontFamily:F}}>INCAP / USDA</span>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontFamily:F}}>
            <thead style={{position:"sticky",top:0,zIndex:10}}>
              <tr style={{background:"#F5F7FF",borderBottom:"0.5px solid #D4E3FF"}}>
                {[isES?"Alimento":"Food",isES?"Porcion (1 intercambio)":"Portion (1 exchange)","Prot (g)",isES?"Lip (g)":"Fat (g)","HC (g)",""].map((h,i)=>(
                  <th key={i} style={{padding:"8px 14px",textAlign:i<2?"left":"center",...LS,fontWeight:500}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Object.entries(grouped).map(([catKey,foods])=>{
                const cs=CAT_STYLE[catKey]||{bg:"#F5F7FF",text:"#3A5BA0"};
                const catObj=FOOD_CATS.find(c=>c.key===catKey);
                return [
                  <tr key={"h-"+catKey}><td colSpan={6} style={{padding:"7px 14px",background:cs.bg}}><span style={{fontSize:11,fontWeight:600,color:cs.text,fontFamily:F}}>{catObj?catObj.label[lang]:catKey}</span></td></tr>,
                  ...foods.map(food=>{
                    const name=lang==="ES"?food.es:food.en;
                    const isAdded=added[food.id];
                    return(
                      <tr key={food.id} style={{borderBottom:"0.5px solid #F0F4FF"}} onMouseEnter={e=>e.currentTarget.style.background="#F8FAFF"} onMouseLeave={e=>e.currentTarget.style.background=""}>
                        <td style={{padding:"9px 14px"}}><div style={{fontSize:13,fontWeight:500,color:"#1E2D4E"}}>{name}</div></td>
                        <td style={{padding:"9px 14px",fontSize:11,color:"#3A5BA0"}}>{food.portion[lang]}</td>
                        <td style={{padding:"9px 14px",textAlign:"center"}}><MacroPill value={food.prot} type="prot"/></td>
                        <td style={{padding:"9px 14px",textAlign:"center"}}><MacroPill value={food.lip} type="lip"/></td>
                        <td style={{padding:"9px 14px",textAlign:"center"}}><MacroPill value={food.hc} type="hc"/></td>
                        <td style={{padding:"9px 14px",textAlign:"center"}}>
                          <button onClick={()=>handleAdd(food)} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:6,cursor:"pointer",fontFamily:F,fontSize:11,fontWeight:500,background:isAdded?"#EFF6FF":"#F5F7FF",color:isAdded?"#2563EB":"#3A5BA0",border:isAdded?"0.5px solid #2563EB":"0.5px solid #D4E3FF",transition:"all 0.15s"}}>
                            {isAdded?"✓ ":"+ "}{isES?"Usar":"Use"}
                          </button>
                        </td>
                      </tr>
                    );
                  }),
                ];
              })}
              {filtered.length===0&&<tr><td colSpan={6} style={{padding:"48px",textAlign:"center",color:"#3A5BA0",fontFamily:F,fontSize:13}}>{isES?"Sin resultados.":"No results."}</td></tr>}
            </tbody>
          </table>
        </div>
        <div style={{background:"#fff",borderTop:"0.5px solid #D4E3FF",padding:"9px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",flexShrink:0}}>
          <span style={{fontSize:11,color:"#3A5BA0",fontFamily:F}}>{isES?"Valores por 1 intercambio · INCAP / USDA":"Values per 1 exchange · INCAP / USDA"}</span>
        </div>
      </div>
    </div>
  );
}

const LS_KEY_PATIENT="nl_patient_v1";
const LS_KEY_STUDY="nl_study_v1";
const LS_KEY_CASES="nl_cases_v1";
function loadLS(key,fallback){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback;}catch{return fallback;}}

const DEFAULT_PATIENT={caseName:"",sex:"F",weightLb:0,heightIn:0,age:0,waist:0,goal:"mantener",activity:0,condition:"none",protPct:17,lipPct:30,hcPct:53,mealTimes:4,protG:0,lipG:0,hcG:0,vet:0,geb:0,exchanges:null};

const DEMO_PATIENT_M={caseName:"Paciente M",sex:"M",weightLb:185,heightIn:70,age:35,waist:98,goal:"bajar",activity:1,condition:"obesity",protPct:20,lipPct:25,hcPct:55,mealTimes:4,protG:0,lipG:0,hcG:0,vet:0,geb:0};
const DEMO_PATIENT_DM2={caseName:"Carlos — DM2",sex:"M",weightLb:198,heightIn:67,age:52,waist:105,goal:"bajar",activity:1,condition:"dm2",protPct:20,lipPct:30,hcPct:50,mealTimes:4,protG:0,lipG:0,hcG:0,vet:0,geb:0,exchanges:null};
const DEMO_PATIENT_ERC={caseName:"Elena — ERC",sex:"F",weightLb:154,heightIn:63,age:65,waist:92,goal:"mantener",activity:1,condition:"renal",protPct:10,lipPct:35,hcPct:55,mealTimes:4,protG:0,lipG:0,hcG:0,vet:0,geb:0,exchanges:null};
const DEMO_PATIENT_OB={caseName:"Roberto — Obesidad",sex:"M",weightLb:264,heightIn:69,age:44,waist:118,goal:"bajar",activity:1,condition:"obesity",protPct:25,lipPct:30,hcPct:45,mealTimes:5,protG:0,lipG:0,hcG:0,vet:0,geb:0,exchanges:null};
const DEMO_PATIENT={caseName:"Maria (Ejemplo)",sex:"F",weightLb:185,heightIn:65,age:28,waist:95,goal:"mantener",activity:1,condition:"obesity",protPct:17,lipPct:30,hcPct:53,mealTimes:4,protG:0,lipG:0,hcG:0,vet:0,geb:0,exchanges:null};

function PortfolioModal({isES,cases,onClose,isMobile}) {
  const [groupBy,setGroupBy]=React.useState("condition");
  const condLabel={"none":isES?"Normal":"Normal","dm2":"DM2","obesity":isES?"Obesidad":"Obesity"};
  const goalLabel={"bajar":isES?"Bajar peso":"Lose weight","mantener":isES?"Mantener":"Maintain","subir":isES?"Subir peso":"Gain weight"};
  const sexLabel={"F":isES?"Femenino":"Female","M":isES?"Masculino":"Male"};
  function getKey(cas){if(groupBy==="condition")return cas.snapshot&&cas.snapshot.condition?cas.snapshot.condition:"none";if(groupBy==="sex")return cas.sex||"F";return cas.goal||"mantener";}
  function getLabel(k){if(groupBy==="condition")return condLabel[k]||k;if(groupBy==="sex")return sexLabel[k]||k;return goalLabel[k]||k;}
  const groups={};
  cases.forEach(function(cas,i){var k=getKey(cas);if(!groups[k])groups[k]=[];groups[k].push(Object.assign({},cas,{_idx:i}));});
  const avgVet=cases.length>0?Math.round(cases.reduce(function(s,cas){return s+(cas.vet||0);},0)/cases.length):0;
  const avgVetF=cases.filter(function(c){return c.sex==="F";}).length>0?Math.round(cases.filter(function(c){return c.sex==="F";}).reduce(function(s,c){return s+(c.vet||0);},0)/cases.filter(function(c){return c.sex==="F";}).length):0;
  const avgVetM=cases.filter(function(c){return c.sex==="M";}).length>0?Math.round(cases.filter(function(c){return c.sex==="M";}).reduce(function(s,c){return s+(c.vet||0);},0)/cases.filter(function(c){return c.sex==="M";}).length):0;
  const condCounts={};cases.forEach(function(c){var k=c.snapshot&&c.snapshot.condition?c.snapshot.condition:"none";condCounts[k]=(condCounts[k]||0)+1;});
  const goalCounts={};cases.forEach(function(c){goalCounts[c.goal||"mantener"]=(goalCounts[c.goal||"mantener"]||0)+1;});
  const topCond=Object.entries(condCounts).sort(function(a,b){return b[1]-a[1];})[0];
  const topGoal=Object.entries(goalCounts).sort(function(a,b){return b[1]-a[1];})[0];
  function exportCSV(){
    var headers=["Nombre","Fecha","Sexo","VET (kcal)","Objetivo","Condicion","Prot%","Lip%","HC%"];
    var rows=cases.map(function(c){return [c.name||"",c.date||"",c.sex||"",c.vet||"",c.goal||"",c.snapshot&&c.snapshot.condition?c.snapshot.condition:"none",c.snapshot&&c.snapshot.protPct?c.snapshot.protPct:"",c.snapshot&&c.snapshot.lipPct?c.snapshot.lipPct:"",c.snapshot&&c.snapshot.hcPct?c.snapshot.hcPct:""].join(",");});
    var csv=[headers.join(",")].concat(rows).join("\n");
    var blob=new Blob([csv],{type:"text/csv"});
    var url=URL.createObjectURL(blob);
    var a=document.createElement("a");a.href=url;a.download="portafolio-nutrionally.csv";a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div style={{position:"fixed",inset:0,zIndex:2100,display:"flex",alignItems:"flex-start",justifyContent:"center",background:"rgba(0,0,0,0.45)",padding:"20px",overflowY:"auto"}}>
      <div style={{background:"#fff",borderRadius:16,width:"100%",maxWidth:600,fontFamily:F,marginTop:20,marginBottom:20}}>
        <div style={{padding:"18px 20px",borderBottom:"0.5px solid #D4E3FF",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{fontSize:15,fontWeight:600,color:"#1E2D4E"}}>{isES?"Portafolio academico":"Academic portfolio"}</div>
            <div style={{fontSize:11,color:"#3A5BA0",marginTop:2}}>{cases.length} {isES?"casos":"cases"} · avg VET {avgVet} kcal</div>
          </div>
          <button onClick={onClose} style={{border:"none",background:"#F5F7FF",borderRadius:6,padding:"6px 10px",cursor:"pointer",fontSize:14,color:"#3A5BA0"}}>&#x2715;</button>
        </div>
        <div style={{padding:"14px 20px",borderBottom:"0.5px solid #D4E3FF",display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8}}>
          <div style={{background:"#F5F7FF",borderRadius:10,padding:"10px 12px",border:"0.5px solid #D4E3FF"}}>
            <div style={{fontSize:9,color:"#3A5BA0",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>{isES?"VET promedio":"Avg VET"}</div>
            <div style={{fontSize:14,fontWeight:600,color:"#1E2D4E"}}>{avgVet} <span style={{fontSize:10,color:"#3A5BA0"}}>kcal</span></div>
            <div style={{fontSize:10,color:"#3A5BA0",marginTop:2}}>F: {avgVetF} · M: {avgVetM} kcal</div>
          </div>
          <div style={{background:"#F5F7FF",borderRadius:10,padding:"10px 12px",border:"0.5px solid #D4E3FF"}}>
            <div style={{fontSize:9,color:"#3A5BA0",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:4}}>{isES?"Distribucion":"Distribution"}</div>
            <div style={{fontSize:11,color:"#1E2D4E"}}>{isES?"Cond. frec.:":"Top cond.:"} <strong>{topCond?topCond[0]:"—"}</strong> ({topCond?topCond[1]:0})</div>
            <div style={{fontSize:11,color:"#1E2D4E",marginTop:2}}>{isES?"Obj. frec.:":"Top goal:"} <strong>{topGoal?topGoal[0]:"—"}</strong> ({topGoal?topGoal[1]:0})</div>
          </div>
          <div style={{gridColumn:"1/-1",display:"flex",gap:8}}>
            {[{k:"condition",l:isES?"Condicion":"Condition"},{k:"sex",l:isES?"Sexo":"Sex"},{k:"goal",l:isES?"Objetivo":"Goal"}].map(function(opt){return(
              <button key={opt.k} onClick={function(){setGroupBy(opt.k);}} style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:F,border:groupBy===opt.k?"2px solid #2563EB":"0.5px solid #D4E3FF",background:groupBy===opt.k?"#2563EB":"#F5F7FF",color:groupBy===opt.k?"#fff":"#3A5BA0"}}>{opt.l}</button>
            );})}
            {cases.length>0&&<button onClick={exportCSV} style={{marginLeft:"auto",padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:F,border:"0.5px solid #22c55e",background:"#f0fdf4",color:"#16a34a"}}>CSV</button>}
          </div>
        </div>
        <div style={{padding:"14px 20px",borderBottom:"0.5px solid #D4E3FF",display:"none"}}>
          {[{k:"condition",l:isES?"Condicion":"Condition"},{k:"sex",l:isES?"Sexo":"Sex"},{k:"goal",l:isES?"Objetivo":"Goal"}].map(function(opt){return(
            <button key={opt.k} onClick={function(){setGroupBy(opt.k);}} style={{padding:"6px 14px",borderRadius:20,fontSize:12,fontWeight:500,cursor:"pointer",fontFamily:F,border:groupBy===opt.k?"2px solid #2563EB":"0.5px solid #D4E3FF",background:groupBy===opt.k?"#2563EB":"#F5F7FF",color:groupBy===opt.k?"#fff":"#3A5BA0"}}>{opt.l}</button>
          );})}
        </div>
        <div style={{padding:"14px 20px",maxHeight:"55vh",overflowY:"auto"}}>
          {cases.length===0&&<div style={{textAlign:"center",padding:"40px",color:"#3A5BA0",fontSize:13}}>{isES?"Aun no hay casos.":"No cases yet."}</div>}
          {Object.entries(groups).map(function([key,grp]){return(
            <div key={key} style={{marginBottom:18}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                <span style={{fontSize:11,fontWeight:600,color:"#1E2D4E",textTransform:"uppercase",letterSpacing:"0.05em"}}>{getLabel(key)}</span>
                <span style={{fontSize:10,color:"#3A5BA0",background:"#F5F7FF",border:"0.5px solid #D4E3FF",borderRadius:10,padding:"1px 7px"}}>{grp.length}</span>
              </div>
              {grp.map(function(cas){
                return (
                  <div key={cas.id} style={{position:"relative",marginBottom:6}}>
                    <div style={{background:"#F5F7FF",border:"0.5px solid #D4E3FF",borderRadius:10,padding:"10px 12px",display:"flex",alignItems:"center",gap:10,filter:"none",pointerEvents:"auto"}}>
                      <div style={{flex:1}}>
                        <div style={{fontSize:12,fontWeight:600,color:"#1E2D4E"}}>{cas.name||"—"}</div>
                        <div style={{fontSize:10,color:"#3A5BA0",marginTop:1}}>{cas.date}</div>
                      </div>
                      <div style={{display:"flex",gap:6}}>
                        {[{l:"VET",v:cas.vet+" kcal"},{l:isES?"Sexo":"Sex",v:cas.sex},{l:isES?"Obj":"Goal",v:cas.goal==="bajar"?"↓":cas.goal==="subir"?"↑":"→"}].map(function(kv){return(
                          <div key={kv.l} style={{background:"#fff",border:"0.5px solid #D4E3FF",borderRadius:6,padding:"3px 7px",textAlign:"center"}}>
                            <div style={{fontSize:8,color:"#3A5BA0",textTransform:"uppercase"}}>{kv.l}</div>
                            <div style={{fontSize:10,fontWeight:600,color:"#1E2D4E"}}>{kv.v}</div>
                          </div>
                        );})}
                      </div>
                    </div>
                    
                  </div>
                );
              })}
            </div>
          );})}
        </div>
        
      </div>
    </div>
  );
}

function CasesDrawer({isES, cases, onLoad, onDelete, onClose, onPortfolio, isMobile}) {
  return (
    <div style={{position:"fixed",top:0,right:0,bottom:0,zIndex:2000,display:"flex"}}>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.25)"}}/>
      <div style={{position:"relative",marginLeft:"auto",width:isMobile?"100vw":340,background:"#fff",boxShadow:"-4px 0 24px rgba(30,45,78,0.13)",display:"flex",flexDirection:"column",height:"100%"}}>
        <div style={{padding:"16px 18px",borderBottom:"0.5px solid #D4E3FF",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div>
            <div style={{fontSize:14,fontWeight:600,color:"#1E2D4E",fontFamily:F}}>{isES?"Casos guardados":"Saved cases"}</div>
            <div style={{fontSize:11,color:"#3A5BA0",fontFamily:F,marginTop:2}}>{cases.length} {isES?"caso(s)":"case(s)"}</div>
          </div>
          <button onClick={onClose} style={{border:"none",background:"#F5F7FF",borderRadius:6,padding:"6px 10px",cursor:"pointer",fontSize:14,color:"#3A5BA0"}}>✕</button>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:"12px"}}>
          {cases.length===0 && (
            <div style={{textAlign:"center",padding:"40px 20px",color:"#3A5BA0",fontSize:13,fontFamily:F}}>
              {isES?"Aun no hay casos guardados.":"No saved cases yet."}
            </div>
          )}
          {cases.map((c,i)=>(
            <div key={c.id} style={{background:"#F5F7FF",border:"0.5px solid #D4E3FF",borderRadius:10,padding:"13px 14px",marginBottom:8}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                <div>
                  <div style={{fontSize:13,fontWeight:600,color:"#1E2D4E",fontFamily:F}}>{c.name||"—"}</div>
                  <div style={{fontSize:10,color:"#3A5BA0",fontFamily:F,marginTop:2}}>{c.date}</div>
                </div>
                <button onClick={()=>onDelete(c.id)} style={{border:"none",background:"transparent",cursor:"pointer",fontSize:12,color:"#CBD5E1",padding:"2px 4px"}}>✕</button>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:10}}>
                {[{l:"VET",v:c.vet+" kcal"},{l:isES?"Sexo":"Sex",v:c.sex==="F"?(isES?"Fem":"F"):(isES?"Masc":"M")},{l:isES?"Objetivo":"Goal",v:c.goal==="bajar"?(isES?"Bajar":"Lose"):c.goal==="subir"?(isES?"Subir":"Gain"):(isES?"Mantener":"Maintain")}].map(kv=>(
                  <div key={kv.l} style={{background:"#fff",borderRadius:6,padding:"6px 8px",border:"0.5px solid #D4E3FF"}}>
                    <div style={{fontSize:9,color:"#3A5BA0",fontFamily:F,textTransform:"uppercase",letterSpacing:"0.05em"}}>{kv.l}</div>
                    <div style={{fontSize:11,fontWeight:600,color:"#1E2D4E",fontFamily:F,marginTop:2}}>{kv.v}</div>
                  </div>
                ))}
              </div>
              <button onClick={()=>onLoad(c)} style={{width:"100%",padding:"8px 0",borderRadius:7,background:"#2563EB",color:"#fff",fontSize:12,fontWeight:500,border:"none",cursor:"pointer",fontFamily:F}}>
                {isES?"Cargar caso":"Load case"}
              </button>
            </div>
          ))}
        </div>
        <div style={{padding:"12px",borderTop:"0.5px solid #D4E3FF",flexShrink:0}}>
          <button onClick={onPortfolio} style={{width:"100%",padding:"10px",borderRadius:8,background:"#1E2D4E",color:"#E2E8F0",fontSize:12,fontWeight:500,border:"none",cursor:"pointer",fontFamily:F}}>
            {isES?"📋 Ver portafolio academico":"📋 View academic portfolio"}
          </button>
        </div>
      </div>
    </div>
  );
}

function FirstRunHint({isES, onDemoF, onDemoM}) {
  return (
    <div style={{background:"linear-gradient(135deg,#EFF6FF,#F5F7FF)",border:"0.5px solid #D4E3FF",borderRadius:12,padding:"16px 18px",marginBottom:16}}>
      <div style={{fontSize:12,fontWeight:600,color:"#1E2D4E",fontFamily:F,marginBottom:10}}>{isES?"Como funciona Nutrionally Learn":"How Nutrionally Learn works"}</div>
      <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
        {[{n:"1",l:isES?"Ingresa los datos del paciente":"Enter patient data",c:"#2563EB"},{n:"2",l:isES?"Revisa macronutrientes":"Review macronutrients",c:"#3A5BA0"},{n:"3",l:isES?"Arma el plan de intercambios":"Build exchange plan",c:"#0C447C"},{n:"4",l:isES?"Exporta el PDF educativo":"Export educational PDF",c:"#1E2D4E"}].map((step,i)=>(
          <div key={step.n} style={{display:"flex",alignItems:"center",gap:6}}>
            <div style={{display:"flex",alignItems:"center",gap:6,background:"#fff",border:`0.5px solid ${step.c}22`,borderRadius:20,padding:"4px 10px 4px 4px"}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:step.c,color:"#fff",fontSize:10,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{step.n}</div>
              <span style={{fontSize:11,color:"#1E2D4E",fontFamily:F,fontWeight:500}}>{step.l}</span>
            </div>
            {i<3&&<span style={{fontSize:11,color:"#D4E3FF"}}>→</span>}
          </div>
        ))}
      </div>
      {onDemoF&&<button onClick={onDemoF} style={{marginTop:12,padding:"8px 18px",borderRadius:8,background:"#2563EB",color:"#fff",fontSize:12,fontWeight:500,border:"none",cursor:"pointer",fontFamily:"Plus Jakarta Sans, sans-serif"}}>{isES?"Paciente F (ejemplo)":"Female patient (example)"}</button>}
      {onDemoM&&<button onClick={()=>onDemoM()} style={{marginTop:8,padding:"8px 16px",borderRadius:8,background:"#1E2D4E",color:"#E2E8F0",fontSize:12,fontWeight:500,border:"none",cursor:"pointer",fontFamily:"Plus Jakarta Sans, sans-serif"}}>{isES?"Paciente M (ejemplo)":"Male patient (example)"}</button>}
      {onDemoM&&<button onClick={()=>onDemoM("dm2")} style={{marginTop:8,padding:"8px 16px",borderRadius:8,background:"#7C3AED",color:"#fff",fontSize:12,fontWeight:500,border:"none",cursor:"pointer",fontFamily:"Plus Jakarta Sans, sans-serif"}}>{isES?"Carlos — DM2 (ejemplo)":"Carlos — T2D (example)"}</button>}
      {onDemoM&&<button onClick={()=>onDemoM("erc")} style={{marginTop:8,padding:"8px 16px",borderRadius:8,background:"#0F6E56",color:"#fff",fontSize:12,fontWeight:500,border:"none",cursor:"pointer",fontFamily:"Plus Jakarta Sans, sans-serif"}}>{isES?"Elena — ERC (ejemplo)":"Elena — CKD (example)"}</button>}
      {onDemoM&&<button onClick={()=>onDemoM("ob")} style={{marginTop:8,padding:"8px 16px",borderRadius:8,background:"#B45309",color:"#fff",fontSize:12,fontWeight:500,border:"none",cursor:"pointer",fontFamily:"Plus Jakarta Sans, sans-serif"}}>{isES?"Roberto — Obesidad (ejemplo)":"Roberto — Obesity (example)"}</button>}
    </div>
  );
}


function Screen5({lang}) {
  const isES = lang === "ES";
  const F = "Plus Jakarta Sans, sans-serif";
  const TEAL = "#2A9D8F";
  const NAVY = "#1E2D4E";
  const BLUE = "#2563EB";
  const [tab, setTab] = React.useState("npt");
  const [weight, setWeight] = React.useState("");
  const [condition, setCondition] = React.useState("normal");
  const [kcalKg, setKcalKg] = React.useState("25");
  const [dexPct, setDexPct] = React.useState("20");
  const [lipPct, setLipPct] = React.useState("20");
  const [aaPct, setAaPct] = React.useState("10");
  const [vol, setVol] = React.useState("1000");
  const [formula, setFormula] = React.useState("standard");
  const [mlhr, setMlhr] = React.useState("");
  const [hours, setHours] = React.useState("24");

  const inp = {padding:"8px 12px",borderRadius:8,border:"0.5px solid #D4E3FF",fontSize:13,fontFamily:F,outline:"none",color:NAVY,background:"#F5F7FF",width:"100%",boxSizing:"border-box"};
  const sel = {...inp,background:"#fff"};
  const lab = {fontSize:12,color:"#3A5BA0",fontFamily:F,display:"block",marginBottom:4};

  const conditions = [
    {value:"normal", label:isES?"Normal / Sin estrés":"Normal / No stress", prot:"0.8-1.0"},
    {value:"mild", label:isES?"Estrés leve (cirugía menor)":"Mild stress (minor surgery)", prot:"1.0-1.2"},
    {value:"moderate", label:isES?"Estrés moderado (trauma, sepsis leve)":"Moderate stress (trauma, mild sepsis)", prot:"1.2-1.5"},
    {value:"severe", label:isES?"Estrés severo (quemados, sepsis severa)":"Severe stress (burns, severe sepsis)", prot:"1.5-2.0"},
    {value:"renal", label:isES?"Enfermedad renal sin diálisis":"Renal disease without dialysis", prot:"0.6-0.8"},
    {value:"dialysis", label:isES?"Diálisis":"Dialysis", prot:"1.2-1.5"},
  ];

  const formulas = [
    {value:"standard", label:isES?"Estándar (1.0 kcal/mL)":"Standard (1.0 kcal/mL)", kcal:1.0, prot:40},
    {value:"hypercal", label:isES?"Hipercalórica (1.5 kcal/mL)":"Hypercaloric (1.5 kcal/mL)", kcal:1.5, prot:60},
    {value:"hyper2", label:isES?"Hipercalórica 2.0 (2.0 kcal/mL)":"Hypercaloric 2.0 (2.0 kcal/mL)", kcal:2.0, prot:75},
    {value:"peptide", label:isES?"Peptídica / Elemental":"Peptide / Elemental", kcal:1.0, prot:40},
    {value:"renal", label:isES?"Renal (bajo K, P)":"Renal (low K, P)", kcal:2.0, prot:45},
    {value:"diabetic", label:isES?"Diabética (bajo CHO)":"Diabetic (low CHO)", kcal:1.0, prot:42},
    {value:"ensure", label:"Ensure Plus (1.5 kcal/mL)", kcal:1.5, prot:55},
    {value:"fresubin", label:"Fresubin Energy (1.5 kcal/mL)", kcal:1.5, prot:56},
    {value:"nutren", label:"Nutren 1.0 (1.0 kcal/mL)", kcal:1.0, prot:40},
    {value:"novasource", label:"Novasource Renal (2.0 kcal/mL)", kcal:2.0, prot:74},
  ];

  const w = parseFloat(weight);
  const totalKcal = w > 0 ? Math.round(w * parseFloat(kcalKg)) : null;
  const condObj = conditions.find(c=>c.value===condition);
  const protRange = condObj ? condObj.prot : "1.0-1.2";
  const protMin = w > 0 ? +(w * parseFloat(protRange.split("-")[0])).toFixed(1) : null;
  const protMax = w > 0 ? +(w * parseFloat(protRange.split("-")[1])).toFixed(1) : null;

  const v = parseFloat(vol);
  const dex = v > 0 ? +(v * parseFloat(dexPct)/100).toFixed(0) : null;
  const dexKcal = dex ? Math.round(dex * 3.4) : null;
  const aa = v > 0 ? +(v * parseFloat(aaPct)/100).toFixed(0) : null;
  const aaKcal = aa ? Math.round(aa * 4) : null;
  const lip = v > 0 ? +(v * parseFloat(lipPct)/100).toFixed(0) : null;
  const lipKcal = lip ? Math.round(lip * 10) : null;
  const totalNptKcal = (dexKcal&&aaKcal&&lipKcal) ? dexKcal+aaKcal+lipKcal : null;
  const osm = (dex&&aa) ? Math.round(dex*50 + aa*100) : null;

  const fObj = formulas.find(f=>f.value===formula);
  const mlh = parseFloat(mlhr);
  const h = parseFloat(hours);
  const totalNEml = mlh > 0 && h > 0 ? Math.round(mlh * h) : null;
  const totalNEkcal = totalNEml && fObj ? Math.round(totalNEml * fObj.kcal) : null;
  const totalNEprot = totalNEml && fObj ? Math.round(totalNEml * fObj.prot / 1000) : null;

  const card = {background:"#fff",border:"0.5px solid #D4E3FF",borderRadius:12,padding:20,marginBottom:12};
  const res = (label,value,unit,color=BLUE,bg="#EFF6FF") => (
    <div style={{background:bg,borderRadius:8,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
      <span style={{fontSize:12,color:NAVY,fontFamily:F}}>{label}</span>
      <span style={{fontSize:15,fontWeight:500,color,fontFamily:F}}>{value} <span style={{fontSize:11}}>{unit}</span></span>
    </div>
  );

  return (
    <div style={{padding:"24px 32px",maxWidth:900,margin:"0 auto"}}>
      <div style={{fontSize:11,fontWeight:500,color:TEAL,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:4,fontFamily:F}}>{isES?"Nutrición clínica especializada":"Specialized clinical nutrition"}</div>
      <div style={{fontSize:22,fontWeight:500,color:NAVY,marginBottom:4,fontFamily:F}}>{isES?"Nutrición Parenteral y Enteral":"Parenteral and Enteral Nutrition"}</div>
      <div style={{fontSize:12,color:"#3A5BA0",marginBottom:20,fontFamily:F}}>{isES?"Basado en guías ASPEN 2022":"Based on ASPEN 2022 guidelines"}</div>

      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[{id:"npt",es:"Parenteral (NPT)",en:"Parenteral (TPN)"},{id:"ne",es:"Enteral (NE)",en:"Enteral (EN)"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"8px 20px",borderRadius:20,border:"0.5px solid #D4E3FF",background:tab===t.id?NAVY:"#fff",color:tab===t.id?"#E2E8F0":NAVY,fontSize:13,fontWeight:tab===t.id?500:400,fontFamily:F,cursor:"pointer"}}>
            {isES?t.es:t.en}
          </button>
        ))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        <div>
          <div style={card}>
            <div style={{fontSize:13,fontWeight:500,color:NAVY,marginBottom:12,fontFamily:F}}>{isES?"Datos del paciente":"Patient data"}</div>
            <label style={lab}>{isES?"Peso (kg)":"Weight (kg)"}</label>
            <input style={{...inp,marginBottom:10}} type="number" value={weight} onChange={e=>setWeight(e.target.value)} placeholder="70" />
            <label style={lab}>{isES?"Condición clínica":"Clinical condition"}</label>
            <select style={{...sel,marginBottom:10}} value={condition} onChange={e=>setCondition(e.target.value)}>
              {conditions.map(c=><option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            <label style={lab}>{isES?"Meta calórica (kcal/kg/día)":"Caloric goal (kcal/kg/day)"}</label>
            <select style={sel} value={kcalKg} onChange={e=>setKcalKg(e.target.value)}>
              <option value="20">20 kcal/kg — {isES?"estrés severo/obesidad":"severe stress/obesity"}</option>
              <option value="25">25 kcal/kg — {isES?"mantenimiento":"maintenance"}</option>
              <option value="30">30 kcal/kg — {isES?"repleción moderada":"moderate repletion"}</option>
              <option value="35">35 kcal/kg — {isES?"repleción agresiva":"aggressive repletion"}</option>
            </select>
          </div>

          {tab==="npt"&&(
            <div style={card}>
              <div style={{fontSize:13,fontWeight:500,color:NAVY,marginBottom:12,fontFamily:F}}>{isES?"Componentes NPT":"TPN components"}</div>
              <label style={lab}>{isES?"Volumen total (mL)":"Total volume (mL)"}</label>
              <input style={{...inp,marginBottom:10}} type="number" value={vol} onChange={e=>setVol(e.target.value)} />
              <label style={lab}>{isES?"Dextrosa (% concentración)":"Dextrose (% concentration)"}</label>
              <select style={{...sel,marginBottom:10}} value={dexPct} onChange={e=>setDexPct(e.target.value)}>
                {["5","10","15","20","25","30","35","40","50","70"].map(v=><option key={v} value={v}>{v}% — {Math.round(parseFloat(vol||1000)*parseFloat(v)/100)}g</option>)}
              </select>
              <label style={lab}>{isES?"Aminoácidos (% concentración)":"Amino acids (% concentration)"}</label>
              <select style={{...sel,marginBottom:10}} value={aaPct} onChange={e=>setAaPct(e.target.value)}>
                {["3.5","5","7","8.5","10","15"].map(v=><option key={v} value={v}>{v}%</option>)}
              </select>
              <label style={lab}>{isES?"Lípidos (% concentración)":"Lipids (% concentration)"}</label>
              <select style={sel} value={lipPct} onChange={e=>setLipPct(e.target.value)}>
                {["10","20","30"].map(v=><option key={v} value={v}>{v}%</option>)}
              </select>
            </div>
          )}

          {tab==="ne"&&(
            <div style={card}>
              <div style={{fontSize:13,fontWeight:500,color:NAVY,marginBottom:12,fontFamily:F}}>{isES?"Parámetros de infusión":"Infusion parameters"}</div>
              <label style={lab}>{isES?"Fórmula enteral":"Enteral formula"}</label>
              <select style={{...sel,marginBottom:10}} value={formula} onChange={e=>setFormula(e.target.value)}>
                {formulas.map(f=><option key={f.value} value={f.value}>{f.label}</option>)}
              </select>
              <label style={lab}>{isES?"Velocidad de infusión (mL/hr)":"Infusion rate (mL/hr)"}</label>
              <input style={{...inp,marginBottom:10}} type="number" value={mlhr} onChange={e=>setMlhr(e.target.value)} placeholder="60" />
              <label style={lab}>{isES?"Horas de infusión/día":"Infusion hours/day"}</label>
              <select style={sel} value={hours} onChange={e=>setHours(e.target.value)}>
                {["8","12","16","20","24"].map(h=><option key={h} value={h}>{h} {isES?"horas":"hours"}</option>)}
              </select>
            </div>
          )}
        </div>

        <div>
          {w>0&&(
            <div style={card}>
              <div style={{fontSize:13,fontWeight:500,color:NAVY,marginBottom:12,fontFamily:F}}>{isES?"Requerimientos del paciente":"Patient requirements"}</div>
              {res(isES?"Meta calórica total":"Total caloric goal", totalKcal?.toLocaleString(), "kcal/día")}
              {res(isES?"Proteínas recomendadas (ASPEN)":"Recommended protein (ASPEN)", `${protMin}–${protMax}`, "g/día", "#0F6E56", "#E1F5EE")}
              {res(isES?"Rango g/kg/día":"Range g/kg/day", protRange, "g/kg/día", "#0F6E56", "#E1F5EE")}
              <div style={{fontSize:10,color:"#3A5BA0",fontFamily:F,marginTop:8,padding:"6px 10px",background:"#F5F7FF",borderRadius:6}}>
                {isES?"Fuente: ASPEN Clinical Guidelines 2022":"Source: ASPEN Clinical Guidelines 2022"}
              </div>
            </div>
          )}

          {tab==="npt"&&v>0&&(
            <div style={card}>
              <div style={{fontSize:13,fontWeight:500,color:NAVY,marginBottom:12,fontFamily:F}}>{isES?"Aporte NPT calculado":"Calculated TPN supply"}</div>
              {res("Dextrosa", `${dex}g`, `→ ${dexKcal} kcal`)}
              {res(isES?"Aminoácidos":"Amino acids", `${aa}g`, `→ ${aaKcal} kcal`, "#0F6E56", "#E1F5EE")}
              {res(isES?"Lípidos":"Lipids", `${lip}g`, `→ ${lipKcal} kcal`, "#854F0B", "#FAEEDA")}
              {res(isES?"Total calórico NPT":"Total TPN calories", totalNptKcal?.toLocaleString(), "kcal", NAVY, "#F5F7FF")}
              {osm&&(
                <div style={{marginTop:8,padding:"8px 12px",borderRadius:8,background:osm>900?"#FCEBEB":"#E1F5EE",border:`0.5px solid ${osm>900?"#A32D2D":"#0F6E56"}`}}>
                  <span style={{fontSize:12,fontFamily:F,color:osm>900?"#A32D2D":"#0F6E56",fontWeight:500}}>
                    {isES?"Osmolaridad estimada":"Estimated osmolarity"}: {osm} mOsm/L
                    {osm>900?(isES?" — Vía central requerida":" — Central access required"):(isES?" — Periférica posible":" — Peripheral possible")}
                  </span>
                </div>
              )}
            </div>
          )}

          {tab==="ne"&&mlh>0&&(
            <div style={card}>
              <div style={{fontSize:13,fontWeight:500,color:NAVY,marginBottom:12,fontFamily:F}}>{isES?"Aporte enteral calculado":"Calculated enteral supply"}</div>
              {res(isES?"Volumen total/día":"Total volume/day", totalNEml?.toLocaleString(), "mL/día")}
              {res(isES?"Calorías aportadas":"Calories provided", totalNEkcal?.toLocaleString(), "kcal/día", "#0F6E56", "#E1F5EE")}
              {res(isES?"Proteínas aportadas":"Protein provided", totalNEprot, "g/día", "#854F0B", "#FAEEDA")}
              {fObj&&res(isES?"Densidad calórica":"Caloric density", fObj.kcal, "kcal/mL", NAVY, "#F5F7FF")}
              {w>0&&totalNEkcal&&(
                <div style={{marginTop:8,padding:"8px 12px",borderRadius:8,background:totalNEkcal>=totalKcal*0.8?"#E1F5EE":"#FAEEDA"}}>
                  <span style={{fontSize:12,fontFamily:F,color:totalNEkcal>=totalKcal*0.8?"#0F6E56":"#854F0B",fontWeight:500}}>
                    {Math.round(totalNEkcal/totalKcal*100)}% {isES?"de la meta calórica":"of caloric goal"}
                    {totalNEkcal>=totalKcal*0.8?(isES?" — Meta alcanzada":" — Goal reached"):(isES?" — Aumentar velocidad":" — Increase rate")}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StudyPanel({isES, patient, geb, vet, bmi, bs, hasData, F}) {
  if (!hasData) return null;
  const wkg = +(patient.weightLb * 0.453592).toFixed(1);
  const hm = +(patient.heightIn * 0.0254).toFixed(3);
  const isF = patient.sex === "F";
  const actLabels = ["Sedentario (x1.2)","Ligero (x1.375)","Moderado (x1.55)","Activo (x1.725)","Muy activo (x1.9)"];
  const actLabelsEN = ["Sedentary (x1.2)","Light (x1.375)","Moderate (x1.55)","Active (x1.725)","Very active (x1.9)"];
  const actF = [1.2,1.375,1.55,1.725,1.9];
  const af = actF[patient.activity||0];
  const gebF = isF ? 655.1 : 66.5;
  const gebW = isF ? 9.563 : 13.75;
  const gebH = isF ? 1.850 : 5.003;
  const gebA = isF ? 4.676 : 6.775;
  const condNote = patient.condition === "dm2"
    ? (isES ? "DM2: se recomienda restriccion moderada de HC (45-60%). Proteina 15-20%, lipidos 25-35%." : "DM2: moderate HC restriction recommended (45-60%). Protein 15-20%, fat 25-35%.")
    : patient.condition === "obesity"
    ? (isES ? "Obesidad: deficit calorico de 500-1000 kcal/dia. Proteina alta (1.2-1.5 g/kg) para preservar masa muscular." : "Obesity: 500-1000 kcal/day deficit. High protein (1.2-1.5 g/kg) to preserve lean mass.")
    : null;
  return (
    <div style={{background:"linear-gradient(135deg,#EFF6FF,#F0FDF4)",border:"0.5px solid #93C5FD",borderRadius:12,padding:"14px 16px",marginTop:12,fontFamily:F}}>
      <div style={{fontSize:10,fontWeight:600,color:"#2563EB",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10}}>
        {isES ? "Modo estudio — Harris-Benedict" : "Study mode — Harris-Benedict"}
      </div>
      <div style={{fontSize:11,color:"#1E2D4E",lineHeight:1.7,marginBottom:8}}>
        <div style={{fontWeight:500,marginBottom:4}}>{isES?"Formula:":"Formula:"}</div>
        <div style={{background:"#fff",borderRadius:8,padding:"8px 10px",fontSize:11,color:"#3A5BA0",border:"0.5px solid #D4E3FF"}}>
          {isF
            ? `GEB = 655.1 + (9.563 × ${wkg}kg) + (1.850 × ${(hm*100).toFixed(0)}cm) − (4.676 × ${patient.age}años)`
            : `GEB = 66.5 + (13.75 × ${wkg}kg) + (5.003 × ${(hm*100).toFixed(0)}cm) − (6.775 × ${patient.age}años)`
          }
        </div>
        <div style={{background:"#fff",borderRadius:8,padding:"8px 10px",fontSize:11,color:"#1E2D4E",border:"0.5px solid #D4E3FF",marginTop:4}}>
          {isF
            ? `= ${gebF} + ${(gebW*wkg).toFixed(1)} + ${(gebH*hm*100).toFixed(1)} − ${(gebA*patient.age).toFixed(1)} = ${geb} kcal`
            : `= ${gebF} + ${(gebW*wkg).toFixed(1)} + ${(gebH*hm*100).toFixed(1)} − ${(gebA*patient.age).toFixed(1)} = ${geb} kcal`
          }
        </div>
        <div style={{background:"#fff",borderRadius:8,padding:"8px 10px",fontSize:11,color:"#1E2D4E",border:"0.5px solid #D4E3FF",marginTop:4}}>
          {`VET = ${geb} × ${af} (${isES?actLabels[patient.activity||0]:actLabelsEN[patient.activity||0]}) = ${vet} kcal`}
        </div>
      </div>
      <div style={{display:"flex",gap:8,marginBottom:condNote?8:0}}>
        <div style={{flex:1,background:"#fff",borderRadius:8,padding:"8px 10px",border:"0.5px solid #D4E3FF"}}>
          <div style={{fontSize:9,color:"#3A5BA0",textTransform:"uppercase",marginBottom:2}}>IMC</div>
          <div style={{fontSize:13,fontWeight:600,color:"#1E2D4E"}}>{bmi}</div>
          <div style={{fontSize:10,color:bs==="obeso"?"#dc2626":bs==="sobre"?"#d97706":bs==="bajo"?"#7c3aed":"#16a34a"}}>{isES?bs:bs==="bajo"?"underweight":bs==="normal"?"normal":bs==="sobre"?"overweight":"obese"}</div>
        </div>
        <div style={{flex:1,background:"#fff",borderRadius:8,padding:"8px 10px",border:"0.5px solid #D4E3FF"}}>
          <div style={{fontSize:9,color:"#3A5BA0",textTransform:"uppercase",marginBottom:2}}>{isES?"Prot g/kg":"Prot g/kg"}</div>
          <div style={{fontSize:13,fontWeight:600,color:"#1E2D4E"}}>{wkg>0?(patient.protG/wkg).toFixed(1):"—"}</div>
          <div style={{fontSize:10,color:"#3A5BA0"}}>{isES?"Ref: 0.8-2.0 g/kg":"Ref: 0.8-2.0 g/kg"}</div>
        </div>
        <div style={{flex:1,background:"#fff",borderRadius:8,padding:"8px 10px",border:"0.5px solid #D4E3FF"}}>
          <div style={{fontSize:9,color:"#3A5BA0",textTransform:"uppercase",marginBottom:2}}>{isES?"kcal/kg":"kcal/kg"}</div>
          <div style={{fontSize:13,fontWeight:600,color:"#1E2D4E"}}>{wkg>0?Math.round(vet/wkg):"—"}</div>
          <div style={{fontSize:10,color:"#3A5BA0"}}>{isES?"Ref: 25-35 kcal/kg":"Ref: 25-35 kcal/kg"}</div>
        </div>
      </div>
      {condNote&&<div style={{background:"#FEF9E7",border:"0.5px solid #fcd34d",borderRadius:8,padding:"8px 10px",fontSize:11,color:"#854F0B",lineHeight:1.5}}>{condNote}</div>}
    </div>
  );
}


function Screen8({lang}) {
  const isES = lang === "ES";
  const F = "Plus Jakarta Sans, sans-serif";
  const TEAL = "#2A9D8F";
  const NAVY = "#1E2D4E";
  const BLUE = "#2563EB";
  const [tab, setTab] = React.useState("spontaneous");
  const [weight, setWeight] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [age, setAge] = React.useState("");
  const [sex, setSex] = React.useState("F");
  const [obese, setObese] = React.useState(false);
  const [trauma, setTrauma] = React.useState(false);
  const [burn, setBurn] = React.useState(false);
  const [ventilated, setVentilated] = React.useState(false);

  const w=parseFloat(weight), h=parseFloat(height), a=parseInt(age);

  const inputStyle = {width:"100%",padding:"8px 12px",borderRadius:8,border:"0.5px solid #D4E3FF",background:"#fff",color:NAVY,fontSize:13,fontFamily:F,outline:"none",boxSizing:"border-box"};
  const labelStyle = {fontSize:11,color:"#3A5BA0",fontFamily:F,display:"block",marginBottom:4};
  const resultBox = (label,value,unit,color=TEAL) => (
    <div style={{background:"#F5F7FF",borderRadius:8,padding:"10px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:12,color:NAVY,fontFamily:F}}>{label}</span>
      <span style={{fontSize:15,fontWeight:500,color,fontFamily:F}}>{value} <span style={{fontSize:11}}>{unit}</span></span>
    </div>
  );

  // Ireton-Jones 1992 (spontaneous breathing)
  // EEE = 629 - 11(A) + 25(W) - 609(O)
  // Ireton-Jones 1992 (ventilated)
  // EEE = 1784 - 11(A) + 5(W) + 244(S) + 239(T) + 804(B)
  // S: sex (M=1, F=0), T: trauma (1/0), B: burn (1/0), O: obese (1/0)

  let result = null;
  if (w && a) {
    const S = sex === "M" ? 1 : 0;
    const O = obese ? 1 : 0;
    const T = trauma ? 1 : 0;
    const B = burn ? 1 : 0;
    if (tab === "spontaneous") {
      result = Math.round(629 - 11*a + 25*w - 609*O);
    } else {
      result = Math.round(1784 - 11*a + 5*w + 244*S + 239*T + 804*B);
    }
  }

  return (
    <div style={{padding:"24px",maxWidth:700,margin:"0 auto"}}>
      <div style={{fontSize:11,fontWeight:500,color:TEAL,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6,fontFamily:F}}>{isES?"Fórmulas de GEB / GET":"BMR / TEE Formulas"}</div>
      <div style={{fontSize:20,fontWeight:500,color:NAVY,marginBottom:4,fontFamily:F}}>Ireton-Jones (1992)</div>
      <div style={{fontSize:12,color:"#3A5BA0",marginBottom:20,fontFamily:F}}>{isES?"Estimación de gasto energético en pacientes hospitalizados":"Energy expenditure estimation in hospitalized patients"}</div>

      <div style={{background:"#EFF6FF",borderRadius:10,padding:16,marginBottom:16,fontSize:12,color:"#3A5BA0",fontFamily:F}}>
        <strong style={{color:BLUE}}>{isES?"Respiración espontánea":"Spontaneous breathing"}</strong><br/>
        <span style={{color:NAVY}}>EEE = 629 − 11(edad) + 25(peso kg) − 609(obesidad)</span><br/><br/>
        <strong style={{color:BLUE}}>{isES?"Ventilación mecánica":"Mechanical ventilation"}</strong><br/>
        <span style={{color:NAVY}}>EEE = 1784 − 11(edad) + 5(peso kg) + 244(sexo M) + 239(trauma) + 804(quemadura)</span><br/><br/>
        <span style={{color:"#8B949E"}}>{isES?"Variables dicotómicas: 1=sí, 0=no":"Dichotomous variables: 1=yes, 0=no"}</span>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[{id:"spontaneous",es:"Respiración espontánea",en:"Spontaneous breathing"},{id:"ventilated",es:"Ventilación mecánica",en:"Mechanical ventilation"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"7px 16px",borderRadius:20,border:"0.5px solid #2A3F5F",background:tab===t.id?TEAL:"transparent",color:tab===t.id?"#fff":"#8B949E",fontSize:12,fontFamily:F,cursor:"pointer"}}>{isES?t.es:t.en}</button>
        ))}
      </div>

      <div style={{display:"flex",gap:8,marginBottom:12}}>
        {["F","M"].map(s=>(<button key={s} onClick={()=>setSex(s)} style={{padding:"6px 14px",borderRadius:20,border:"0.5px solid #2A3F5F",background:sex===s?BLUE:"transparent",color:sex===s?"#fff":"#8B949E",fontSize:12,fontFamily:F,cursor:"pointer"}}>{s==="F"?(isES?"Femenino":"Female"):(isES?"Masculino":"Male")}</button>))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        <div><label style={labelStyle}>{isES?"Peso (kg)":"Weight (kg)"}</label><input type="number" value={weight} onChange={e=>setWeight(e.target.value)} style={inputStyle}/></div>
        <div><label style={labelStyle}>{isES?"Edad (años)":"Age (years)"}</label><input type="number" value={age} onChange={e=>setAge(e.target.value)} style={inputStyle}/></div>
      </div>

      <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:16}}>
        {tab==="spontaneous"&&(
          <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:NAVY,fontFamily:F,cursor:"pointer"}}>
            <input type="checkbox" checked={obese} onChange={e=>setObese(e.target.checked)} style={{accentColor:TEAL}}/>
            {isES?"Obesidad (IMC > 30)":"Obesity (BMI > 30)"}
          </label>
        )}
        {tab==="ventilated"&&(<>
          <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:NAVY,fontFamily:F,cursor:"pointer"}}>
            <input type="checkbox" checked={trauma} onChange={e=>setTrauma(e.target.checked)} style={{accentColor:TEAL}}/>
            {isES?"Trauma":"Trauma"}
          </label>
          <label style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:NAVY,fontFamily:F,cursor:"pointer"}}>
            <input type="checkbox" checked={burn} onChange={e=>setBurn(e.target.checked)} style={{accentColor:TEAL}}/>
            {isES?"Quemadura":"Burn"}
          </label>
        </>)}
      </div>

      {result!==null&&(<div style={{marginTop:12}}>
        {resultBox(isES?"Gasto energético estimado (Ireton-Jones)":"Estimated energy expenditure (Ireton-Jones)", result.toLocaleString(), "kcal/día", "#F4C542")}
        <div style={{fontSize:11,color:"#8B949E",fontFamily:F,padding:"8px 12px",background:"#F5F7FF",borderRadius:6,marginTop:4}}>
          {isES
            ? "Referencia: Ireton-Jones CS, et al. Equations for the estimation of energy expenditures in patients with burns. J Burn Care Rehabil. 1992."
            : "Reference: Ireton-Jones CS, et al. Equations for the estimation of energy expenditures in patients with burns. J Burn Care Rehabil. 1992."}
        </div>
      </div>)}
    </div>
  );
}

function Screen6({lang}) {
  const isES = lang === "ES";
  const F = "Plus Jakarta Sans, sans-serif";
  const TEAL = "#2A9D8F";
  const NAVY = "#1E2D4E";
  const BLUE = "#2563EB";
  const [tab, setTab] = React.useState("mifflin");
  const [weight, setWeight] = React.useState("");
  const [height, setHeight] = React.useState("");
  const [age, setAge] = React.useState("");
  const [sex, setSex] = React.useState("F");
  const [activity, setActivity] = React.useState("1.2");
  const [temp, setTemp] = React.useState("");
  const [ve, setVe] = React.useState("");
  const [condition, setCondition] = React.useState("normal");

  const w=parseFloat(weight), h=parseFloat(height), a=parseInt(age);
  const actOpts=[{value:"1.2",label:isES?"Sedentario":"Sedentary"},{value:"1.375",label:isES?"Ligero (1-3d)":"Light (1-3d)"},{value:"1.55",label:isES?"Moderado (3-5d)":"Moderate (3-5d)"},{value:"1.725",label:isES?"Activo (6-7d)":"Active (6-7d)"},{value:"1.9",label:isES?"Muy activo":"Very active"}];
  const stressOpts=[{value:"normal",label:isES?"Sin estrés":"No stress",factor:1.0},{value:"mild",label:isES?"Estrés leve (cirugía menor)":"Mild stress (minor surgery)",factor:1.2},{value:"moderate",label:isES?"Estrés moderado (cirugía mayor)":"Moderate stress (major surgery)",factor:1.35},{value:"severe",label:isES?"Estrés severo (sepsis, trauma)":"Severe stress (sepsis, trauma)",factor:1.5},{value:"burns",label:isES?"Quemaduras graves":"Severe burns",factor:1.8}];
  const stress = stressOpts.find(s=>s.value===condition);

  let mifflin=null, mifflin_tdee=null, mifflin_vet=null;
  if(w&&h&&a){
    mifflin = sex==="F" ? Math.round(10*w+6.25*h-5*a-161) : Math.round(10*w+6.25*h-5*a+5);
    mifflin_tdee = Math.round(mifflin*parseFloat(activity));
    mifflin_vet = Math.round(mifflin_tdee*stress.factor);
  }

  let pennState=null;
  const t=parseFloat(temp), ve_val=parseFloat(ve);
  if(w&&t&&ve_val){
    const hb_m = sex==="F" ? Math.round(655+9.6*w+1.9*h-4.7*a) : Math.round(66+13.8*w+5*h-6.8*a);
    pennState = Math.round(0.85*hb_m + 175*t + 33*ve_val - 6433);
  }

  const inputStyle = {width:"100%",padding:"8px 12px",borderRadius:8,border:"0.5px solid #D4E3FF",background:"#fff",color:NAVY,fontSize:13,fontFamily:F,outline:"none",boxSizing:"border-box"};
  const labelStyle = {fontSize:11,color:"#3A5BA0",fontFamily:F,display:"block",marginBottom:4};
  const resultBox = (label,value,unit,color=TEAL) => (
    <div style={{background:"#F5F7FF",borderRadius:8,padding:"10px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:12,color:NAVY,fontFamily:F}}>{label}</span>
      <span style={{fontSize:15,fontWeight:500,color,fontFamily:F}}>{value} <span style={{fontSize:11}}>{unit}</span></span>
    </div>
  );

  return (
    <div style={{padding:"24px",maxWidth:700,margin:"0 auto"}}>
      <div style={{fontSize:11,fontWeight:500,color:TEAL,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6,fontFamily:F}}>{isES?"Fórmulas de GEB / GET":"BMR / TEE Formulas"}</div>
      <div style={{fontSize:20,fontWeight:500,color:NAVY,marginBottom:4,fontFamily:F}}>{isES?"Mifflin-St.Jeor y Penn State":"Mifflin-St.Jeor and Penn State"}</div>
      <div style={{fontSize:12,color:"#3A5BA0",marginBottom:20,fontFamily:F}}>{isES?"Fórmulas para pacientes no críticos y ventilados":"Formulas for non-critical and ventilated patients"}</div>

      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {[{id:"mifflin",label:"Mifflin-St.Jeor"},{id:"pennstate",label:"Penn State"}].map(t=>(<button key={t.id} onClick={()=>setTab(t.id)} style={{padding:"7px 16px",borderRadius:20,border:"0.5px solid #2A3F5F",background:tab===t.id?TEAL:"transparent",color:tab===t.id?"#fff":"#8B949E",fontSize:12,fontFamily:F,cursor:"pointer"}}>{t.label}</button>))}
      </div>

      {tab==="mifflin"&&(<div>
        <div style={{background:"#EFF6FF",borderRadius:10,padding:16,marginBottom:12,fontSize:12,color:"#3A5BA0",fontFamily:F}}>
          <strong style={{color:BLUE}}>Mifflin-St.Jeor</strong> — {isES?"Más precisa que Harris-Benedict en pacientes no críticos. Fórmula:":"More accurate than Harris-Benedict in non-critical patients. Formula:"}<br/>
          <span style={{color:NAVY}}>♀ GEB = (10 × kg) + (6.25 × cm) − (5 × edad) − 161</span><br/>
          <span style={{color:NAVY}}>♂ GEB = (10 × kg) + (6.25 × cm) − (5 × edad) + 5</span>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {["F","M"].map(s=>(<button key={s} onClick={()=>setSex(s)} style={{padding:"6px 14px",borderRadius:20,border:"0.5px solid #2A3F5F",background:sex===s?BLUE:"transparent",color:sex===s?"#fff":"#8B949E",fontSize:12,fontFamily:F,cursor:"pointer"}}>{s==="F"?(isES?"Femenino":"Female"):(isES?"Masculino":"Male")}</button>))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <div><label style={labelStyle}>{isES?"Peso (kg)":"Weight (kg)"}</label><input type="number" value={weight} onChange={e=>setWeight(e.target.value)} style={inputStyle}/></div>
          <div><label style={labelStyle}>{isES?"Talla (cm)":"Height (cm)"}</label><input type="number" value={height} onChange={e=>setHeight(e.target.value)} style={inputStyle}/></div>
          <div><label style={labelStyle}>{isES?"Edad (años)":"Age (years)"}</label><input type="number" value={age} onChange={e=>setAge(e.target.value)} style={inputStyle}/></div>
          <div><label style={labelStyle}>{isES?"Actividad":"Activity"}</label><select value={activity} onChange={e=>setActivity(e.target.value)} style={inputStyle}>{actOpts.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}</select></div>
        </div>
        <div style={{marginBottom:12}}><label style={labelStyle}>{isES?"Factor de estrés clínico":"Clinical stress factor"}</label><select value={condition} onChange={e=>setCondition(e.target.value)} style={inputStyle}>{stressOpts.map(o=><option key={o.value} value={o.value}>{o.label} (×{o.factor})</option>)}</select></div>
        {mifflin&&(<div style={{marginTop:12}}>
          {resultBox(isES?"GEB (Mifflin-St.Jeor)":"BMR (Mifflin-St.Jeor)", mifflin.toLocaleString(), "kcal/día")}
          {resultBox(isES?"GET (con actividad)":"TEE (with activity)", mifflin_tdee.toLocaleString(), "kcal/día", BLUE)}
          {resultBox(isES?"VET (con estrés clínico)":"TEE (with stress factor)", mifflin_vet.toLocaleString(), "kcal/día", "#F4C542")}
          <div style={{fontSize:11,color:"#8B949E",fontFamily:F,padding:"8px 12px",background:"#F5F7FF",borderRadius:6,marginTop:4}}>
            {isES?"Factor de estrés aplicado: ×"+stress.factor+" ("+stress.label+")":"Applied stress factor: ×"+stress.factor+" ("+stress.label+")"}
          </div>
        </div>)}
      </div>)}

      {tab==="pennstate"&&(<div>
        <div style={{background:"#EFF6FF",borderRadius:10,padding:16,marginBottom:12,fontSize:12,color:"#3A5BA0",fontFamily:F}}>
          <strong style={{color:BLUE}}>Penn State (2003b)</strong> — {isES?"Para pacientes en ventilación mecánica. Fórmula:":"For mechanically ventilated patients. Formula:"}<br/>
          <span style={{color:NAVY}}>VET = 0.85 × HB + 175 × Temp(°C) + 33 × Ve(L/min) − 6433</span>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:12}}>
          {["F","M"].map(s=>(<button key={s} onClick={()=>setSex(s)} style={{padding:"6px 14px",borderRadius:20,border:"0.5px solid #2A3F5F",background:sex===s?BLUE:"transparent",color:sex===s?"#fff":"#8B949E",fontSize:12,fontFamily:F,cursor:"pointer"}}>{s==="F"?(isES?"Femenino":"Female"):(isES?"Masculino":"Male")}</button>))}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
          <div><label style={labelStyle}>{isES?"Peso (kg)":"Weight (kg)"}</label><input type="number" value={weight} onChange={e=>setWeight(e.target.value)} style={inputStyle}/></div>
          <div><label style={labelStyle}>{isES?"Talla (cm)":"Height (cm)"}</label><input type="number" value={height} onChange={e=>setHeight(e.target.value)} style={inputStyle}/></div>
          <div><label style={labelStyle}>{isES?"Edad (años)":"Age (years)"}</label><input type="number" value={age} onChange={e=>setAge(e.target.value)} style={inputStyle}/></div>
          <div><label style={labelStyle}>{isES?"Temperatura máxima (°C)":"Max temperature (°C)"}</label><input type="number" value={temp} onChange={e=>setTemp(e.target.value)} placeholder="37.5" style={inputStyle}/></div>
          <div><label style={labelStyle}>{isES?"Ventilación minuto — Ve (L/min)":"Minute ventilation — Ve (L/min)"}</label><input type="number" value={ve} onChange={e=>setVe(e.target.value)} placeholder="8.5" style={inputStyle}/></div>
        </div>
        {pennState&&resultBox(isES?"VET Penn State (2003b)":"TEE Penn State (2003b)", pennState.toLocaleString(), "kcal/día", "#F4C542")}
        {!pennState&&w&&(<div style={{fontSize:11,color:"#3A5BA0",fontFamily:F,padding:"8px 12px",background:"#F5F7FF",borderRadius:6}}>{isES?"Introduce temperatura máxima y ventilación minuto para calcular.":"Enter maximum temperature and minute ventilation to calculate."}</div>)}
      </div>)}
    </div>
  );
}

function Screen7({lang}) {
  const isES = lang === "ES";
  const F = "Plus Jakarta Sans, sans-serif";
  const TEAL = "#2A9D8F";
  const NAVY = "#1E2D4E";
  const BLUE = "#2563EB";
  const [weight, setWeight] = React.useState("");
  const [protInput, setProtInput] = React.useState("");
  const [nitInput, setNitInput] = React.useState("");
  const [method, setMethod] = React.useState("protein");

  const inputStyle = {width:"100%",padding:"8px 12px",borderRadius:8,border:"0.5px solid #D4E3FF",background:"#fff",color:"#1e293b",fontSize:13,fontFamily:F,outline:"none",boxSizing:"border-box"};
  const labelStyle = {fontSize:11,color:"#3A5BA0",fontFamily:F,display:"block",marginBottom:4};
  const resultBox = (label,value,unit,color=TEAL) => (
    <div style={{background:"#1C2733",borderRadius:8,padding:"10px 14px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <span style={{fontSize:12,color:"#8B949E",fontFamily:F}}>{label}</span>
      <span style={{fontSize:15,fontWeight:500,color,fontFamily:F}}>{value} <span style={{fontSize:11}}>{unit}</span></span>
    </div>
  );

  const w=parseFloat(weight);
  const prot=parseFloat(protInput);
  const nit=parseFloat(nitInput);

  let bn=null, nIntake=null, nLoss=null;
  if(method==="protein"&&w&&prot){
    nIntake = +(prot/6.25).toFixed(1);
    nLoss = +(w*0.1+2).toFixed(1);
    bn = +(nIntake-nLoss).toFixed(1);
  } else if(method==="nitrogen"&&nit){
    nIntake = nit;
    nLoss = w ? +(w*0.1+2).toFixed(1) : null;
    bn = nLoss ? +(nit-nLoss).toFixed(1) : null;
  }

  const bnColor = bn===null?TEAL:bn>=0?"#0F6E56":"#A32D2D";
  const bnBg = bn===null?"#F5F7FF":bn>=0?"#E1F5EE":"#FCEBEB";
  const bnLabel = bn===null?"—":bn>2?(isES?"Anabolismo":"Anabolism"):bn>=-2?(isES?"Equilibrio":"Equilibrium"):(isES?"Catabolismo":"Catabolism");

  return (
    <div style={{padding:"24px",maxWidth:700,margin:"0 auto"}}>
      <div style={{fontSize:11,fontWeight:500,color:TEAL,textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6,fontFamily:F}}>{isES?"Nutrición clínica":"Clinical nutrition"}</div>
      <div style={{fontSize:20,fontWeight:500,color:NAVY,marginBottom:4,fontFamily:F}}>{isES?"Balance nitrogenado":"Nitrogen balance"}</div>
      <div style={{fontSize:12,color:"#3A5BA0",marginBottom:20,fontFamily:F}}>{isES?"Evaluación del estado anabólico/catabólico del paciente":"Assessment of patient anabolic/catabolic state"}</div>

      <div style={{background:"#EFF6FF",borderRadius:10,padding:16,marginBottom:16,fontSize:12,color:"#3A5BA0",fontFamily:F}}>
        <strong style={{color:BLUE}}>{isES?"Fórmula:":"Formula:"}</strong><br/>
        <span style={{color:NAVY}}>BN = N ingesta − N pérdidas</span><br/>
        <span style={{color:NAVY}}>N ingesta = Proteínas (g) ÷ 6.25</span><br/>
        <span style={{color:NAVY}}>N pérdidas = NUU (g/24h) + 2-4g {isES?"pérdidas insensibles":"insensible losses"}</span><br/>
        <div style={{marginTop:8,display:"flex",gap:16}}>
          <span>🟢 BN &gt; +2 = {isES?"Anabolismo":"Anabolism"}</span>
          <span>🟡 BN −2 a +2 = {isES?"Equilibrio":"Equilibrium"}</span>
          <span>🔴 BN &lt; −2 = {isES?"Catabolismo":"Catabolism"}</span>
        </div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:16}}>
        {[{id:"protein",label:isES?"Ingresar proteínas":"Enter protein"},{id:"nitrogen",label:isES?"Ingresar N directo":"Enter N directly"}].map(m=>(<button key={m.id} onClick={()=>setMethod(m.id)} style={{padding:"7px 16px",borderRadius:20,border:"0.5px solid #2A3F5F",background:method===m.id?TEAL:"transparent",color:method===m.id?"#fff":"#8B949E",fontSize:12,fontFamily:F,cursor:"pointer"}}>{m.label}</button>))}
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        <div><label style={labelStyle}>{isES?"Peso del paciente (kg)":"Patient weight (kg)"}</label><input type="number" value={weight} onChange={e=>setWeight(e.target.value)} style={inputStyle}/></div>
        {method==="protein"
          ?<div><label style={labelStyle}>{isES?"Proteínas administradas (g/día)":"Protein administered (g/day)"}</label><input type="number" value={protInput} onChange={e=>setProtInput(e.target.value)} style={inputStyle}/></div>
          :<div><label style={labelStyle}>{isES?"Nitrógeno urinario en 24h (g)":"24h urinary nitrogen (g)"}</label><input type="number" value={nitInput} onChange={e=>setNitInput(e.target.value)} style={inputStyle}/></div>
        }
      </div>

      {nIntake&&(<div style={{marginTop:4}}>
        {resultBox(isES?"Nitrógeno administrado":"Nitrogen administered", nIntake, "g N/día")}
        {nLoss&&resultBox(isES?"Nitrógeno perdido (estimado)":"Nitrogen lost (estimated)", nLoss, "g N/día", "#854F0B")}
        {bn!==null&&(<div style={{background:bnBg,borderRadius:8,padding:"14px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center",border:`0.5px solid ${bnColor}`}}>
          <span style={{fontSize:13,color:"#E2E8F0",fontFamily:F,fontWeight:500}}>{isES?"Balance nitrogenado":"Nitrogen balance"}</span>
          <div style={{textAlign:"right"}}>
            <span style={{fontSize:20,fontWeight:500,color:bnColor,fontFamily:F}}>{bn>0?"+":""}{bn} g N/día</span>
            <div style={{fontSize:11,color:bnColor,fontFamily:F}}>{bnLabel}</div>
          </div>
        </div>)}
        <div style={{fontSize:11,color:"#3A5BA0",fontFamily:F,padding:"8px 12px",background:"#F5F7FF",borderRadius:6}}>
          {isES?"Meta clínica: BN ≥ 0 (equilibrio). En catabolismo severo buscar BN +4 a +6 g N/día. En UCI: puede requerir 1.5-2.5 g proteína/kg/día.":"Clinical goal: BN ≥ 0 (equilibrium). In severe catabolism aim for BN +4 to +6 g N/day. In ICU: may require 1.5-2.5 g protein/kg/day."}
        </div>
      </div>)}
    </div>
  );
}

export default function App() {
  const [lang,setLang]=useState("ES");
  const [screen,setScreen]=useState("s1");
  const [isMobile,setIsMobile]=useState(false);
    const [caseStarted,setCaseStarted]=useState(false);
  const [studyMode,setStudyModeRaw]=useState(()=>loadLS(LS_KEY_STUDY,false));
  const [patientState,setPatientStateRaw]=useState(()=>loadLS(LS_KEY_PATIENT,DEFAULT_PATIENT));

  function setStudyMode(val){setStudyModeRaw(val);try{localStorage.setItem(LS_KEY_STUDY,JSON.stringify(val));}catch{}}
  const [savedCases,setSavedCasesRaw]=useState(()=>loadLS(LS_KEY_CASES,[]));
  const [showCases,setShowCases]=useState(false);
  const [showPortfolio,setShowPortfolio]=useState(false);
  function setSavedCases(val){setSavedCasesRaw(val);try{localStorage.setItem(LS_KEY_CASES,JSON.stringify(val));}catch{}}
  function saveCurrentCase(){
    if(!patientState.caseName) return;
    const entry={id:Date.now(),name:patientState.caseName,date:new Date().toLocaleDateString("es-ES",{year:"numeric",month:"short",day:"numeric"}),sex:patientState.sex,vet:patientState.vet,goal:patientState.goal,snapshot:{...patientState}};
    setSavedCases([entry,...savedCases.filter(c=>c.name!==patientState.caseName).slice(0,19)]);
  }
  function loadCase(c){setPatientState(c.snapshot);setShowCases(false);}
  function deleteCase(id){setSavedCases(savedCases.filter(c=>c.id!==id));}
  const isFirstRun = savedCases.length===0;
  useEffect(()=>{const h=window.location.hash.replace("#","");if(["s1","s2","s4","s5"].includes(h))setScreen(h);},[]);
  function setPatientState(updater){setPatientStateRaw(prev=>{const next=typeof updater==="function"?updater(prev):updater;try{localStorage.setItem(LS_KEY_PATIENT,JSON.stringify(next));}catch{}return next;});}

  useEffect(()=>{const check=()=>setIsMobile(window.innerWidth<768);check();window.addEventListener("resize",check);return()=>window.removeEventListener("resize",check);},[]);

  const isCalcScreen=["s1","s2","s3"].includes(screen);

  return (
    <StudyModeContext.Provider value={{studyMode,setStudyMode}}>
      <div style={{fontFamily:F,background:"#F5F7FF",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
        <Navbar lang={lang} setLang={setLang} screen={screen} setScreen={setScreen} isMobile={isMobile} setCaseStarted={setCaseStarted}onCases={()=>{saveCurrentCase();setShowCases(true);}} casesLabel={lang==="ES"?"Casos":"Cases"} casesCount={savedCases.length} onNewCase={()=>{setPatientState({...DEFAULT_PATIENT});setCaseStarted(false);setScreen("s1");try{localStorage.removeItem("nl_patient_v1");}catch{}}}/>
        {isCalcScreen&&<StepPills lang={lang} current={screen} setScreen={setScreen}/>}
        <div style={{flex:1,overflowY:screen==="s4"?"hidden":"auto",display:"flex",flexDirection:"column"}}>
          {screen==="s1"&&isFirstRun&&<div style={{maxWidth:900,margin:"0 auto",padding:isMobile?"14px 10px 0":"22px 24px 0",width:"100%"}}><FirstRunHint isES={lang==="ES"} onDemoF={()=>{setPatientState({...DEMO_PATIENT});setCaseStarted(false);}} onDemoM={(type)=>{
              if(type==="dm2"){setPatientState({...DEMO_PATIENT_DM2});}
              else if(type==="erc"){setPatientState({...DEMO_PATIENT_ERC});}
              else if(type==="ob"){setPatientState({...DEMO_PATIENT_OB});}
              else{setPatientState({...DEMO_PATIENT_M});}
              setCaseStarted(false);}}/></div>}
          {screen==="s1"&&<Screen1 lang={lang} state={patientState} setState={setPatientState} setScreen={setScreen} isMobile={isMobile} caseStarted={caseStarted} setCaseStarted={setCaseStarted}/>
          }
          {screen==="s2"&&<Screen2 lang={lang} state={patientState} setState={setPatientState} setScreen={setScreen} isMobile={isMobile}/>}
          {screen==="s3"&&<Screen3Wrapper lang={lang} state={patientState} setScreen={setScreen} studyMode={studyMode}/>}
          {screen==="s4"&&<Screen4 lang={lang} isMobile={isMobile}/>}
          {screen==="s5"&&<Screen5 lang={lang}/>}
      {screen==="s6"&&<Screen6 lang={lang}/>}
      {screen==="s7"&&<Screen7 lang={lang}/>}
      {screen==="s8"&&<Screen8 lang={lang}/>}
        </div>
      </div>
    {showCases&&<CasesDrawer isES={lang==="ES"} cases={savedCases} onLoad={loadCase} onDelete={deleteCase} onClose={()=>setShowCases(false)} onPortfolio={()=>{setShowCases(false);setShowPortfolio(true);}} isMobile={isMobile}/>}
    {showPortfolio&&<PortfolioModal isES={lang==="ES"} cases={savedCases} onClose={()=>setShowPortfolio(false)} isMobile={isMobile}/>}
    </StudyModeContext.Provider>
  );
}
