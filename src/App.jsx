import UpgradeModal from "./UpgradeModal.jsx";
import { useState, useEffect, useMemo, createContext, useContext } from "react";

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

function Navbar({lang,setLang,screen,setScreen,isMobile,onUpgrade}) {
  const {studyMode,setStudyMode} = useContext(StudyModeContext);
  return (
    <nav style={{background:"#1E2D4E",height:52,display:"flex",alignItems:"center",padding:"0 20px",gap:20,borderBottom:"0.5px solid #2D4270",position:"sticky",top:0,zIndex:200,flexShrink:0}}>
      <button onClick={()=>{setScreen("s1");setCaseStarted(false);}} style={{display:"flex",alignItems:"center",gap:8,background:"none",border:"none",cursor:"pointer",padding:0,flexShrink:0}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:"#2563EB"}}/>
        <span style={{fontSize:15,fontWeight:600,color:"#E2E8F0",fontFamily:F}}>nutrionally <span style={{fontWeight:400,color:"#93C5FD",fontSize:13}}>learn</span></span>
      </button>
      {!isMobile&&[{id:"s1",label:{ES:"Calculadora",EN:"Calculator"}},{id:"s4",label:{ES:"Lista de alimentos",EN:"Food list"}}].map(item=>(
        <button key={item.id} onClick={()=>setScreen(item.id)} style={{fontSize:13,fontFamily:F,background:"none",border:"none",cursor:"pointer",color:screen===item.id?"#93C5FD":"#8B949E",fontWeight:screen===item.id?500:400,borderBottom:screen===item.id?"2px solid #2563EB":"2px solid transparent",paddingBottom:2,flexShrink:0}}>{item.label[lang]}</button>
      ))}
      <div style={{marginLeft:"auto",display:"flex",alignItems:"center",gap:10}}>
        <div style={{display:"flex",borderRadius:8,overflow:"hidden",border:`1.5px solid ${studyMode?"#7C3AED":"#3A5BA0"}`}}>
          {[{val:false,label:{ES:"Calculadora",EN:"Calculator"},icon:"⊞"},{val:true,label:{ES:"Study Mode",EN:"Study Mode"},icon:"◎"}].map(opt=>{
            const active=studyMode===opt.val;
            return (
              <button key={String(opt.val)} onClick={()=>setStudyMode(opt.val)} style={{padding:isMobile?"5px 10px":"5px 14px",fontSize:11,fontWeight:500,cursor:"pointer",fontFamily:F,background:active?(opt.val?"#7C3AED":"#2563EB"):"transparent",color:active?"#fff":"#8B949E",border:"none",display:"flex",alignItems:"center",gap:5}}>
                <span style={{fontSize:12}}>{opt.icon}</span>
                {!isMobile&&opt.label[lang]}
              </button>
            );
          })}
        </div>
        {studyMode&&<span style={{fontSize:10,fontWeight:600,padding:"3px 9px",background:"#7C3AED22",color:"#A78BFA",borderRadius:20,border:"0.5px solid #7C3AED",fontFamily:F,flexShrink:0}}>{lang==="ES"?"Panel edu. próximamente":"Edu panel coming soon"}</span>}
        <div style={{display:"flex",border:"0.5px solid #3A5BA0",borderRadius:6,overflow:"hidden"}}>
          {["ES","EN"].map(l=>(
            <button key={l} onClick={()=>setLang(l)} style={{padding:"5px 10px",fontSize:12,fontWeight:500,cursor:"pointer",background:lang===l?"#2563EB":"transparent",color:lang===l?"#fff":"#93C5FD",border:"none",fontFamily:F}}>{l}</button>
          ))}
        </div>
        <span onClick={onUpgrade} style={{fontSize:11,fontWeight:600,padding:"5px 12px",background:"#2563EB",color:"#fff",borderRadius:6,cursor:"pointer",fontFamily:F,flexShrink:0}}>Pro ↗</span>
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

function Screen1({lang,state,setState,setScreen,isMobile,caseStarted,setCaseStarted,FREE_LIMIT,setCaseCount,setShowUpgrade}) {
  const t=T1[lang];
  const {caseName,sex,weightLb,heightIn,age,waist,goal,activity,condition="none"}=state;
  const wkg=+(weightLb*0.4536).toFixed(1);
  const hm=+(heightIn*0.0254).toFixed(2);
  const hcm=+(heightIn*2.54).toFixed(1);
  const bmi=+(wkg/(hm**2)).toFixed(1);
  const bs=bmi<18.5?"bajo":bmi<25?"normal":bmi<30?"sobre":"obeso";
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
    return (
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <button onClick={()=>onCh(Math.max(min,val-1))} style={{width:32,height:32,borderRadius:6,border:"0.5px solid #3A5BA0",background:"#F5F7FF",color:"#2563EB",fontSize:18,fontWeight:600,cursor:"pointer",fontFamily:F,flexShrink:0}}>−</button>
        <div style={{flex:1,background:"#EFF6FF",border:"1px solid #2563EB",borderRadius:6,padding:"7px 12px",fontFamily:F,fontWeight:600,fontSize:14,color:"#1E2D4E",textAlign:"center",minWidth:50}}>{val}</div>
        <button onClick={()=>onCh(val+1)} style={{width:32,height:32,borderRadius:6,border:"0.5px solid #3A5BA0",background:"#F5F7FF",color:"#2563EB",fontSize:18,fontWeight:600,cursor:"pointer",fontFamily:F,flexShrink:0}}>+</button>
      </div>
    );
  }

  const ResultsPanel=()=>(
    <div style={{background:"#fff",borderRadius:12,border:"0.5px solid #D4E3FF",padding:18,position:"sticky",top:16}}>
      <div style={{fontSize:11,fontWeight:500,color:"#2D4270",textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:12,fontFamily:F,display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:"#2563EB"}}/>{t.results}
      </div>
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
        <h1 style={{fontSize:22,fontWeight:500,color:"#1E2D4E",margin:"0 0 4px",fontFamily:F}}>{t.title}</h1>
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
          <button onClick={()=>{if(caseStarted){setScreen("s2");return;}const c=loadLS("nl_case_count_v1",0);if(c>=FREE_LIMIT){setShowUpgrade(true);}else{const n=c+1;try{localStorage.setItem("nl_case_count_v1",JSON.stringify(n));}catch{}setCaseCount(n);setCaseStarted(true);setScreen("s2");}}} style={{marginTop:14,width:"100%",padding:"13px 0",borderRadius:8,background:"#2563EB",color:"#fff",fontSize:14,fontWeight:500,border:"none",cursor:"pointer",fontFamily:F}}>{t.next}</button>
        </div>
        {!isMobile&&<ResultsPanel/>}
      </div>
    </div>
  );
}

function Screen2({lang,state,setState,setScreen,isMobile}) {
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
  const protGkg=+(protG/wkg).toFixed(2);
  const lipGkg=+(lipG/wkg).toFixed(2);
  const hcGkg=+(hcG/wkg).toFixed(2);
  const enp=+((vet*lipPct/100+vet*hcPct/100)/(protG*0.16)).toFixed(1);

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
          <div style={{background:"#1E2D4E",borderRadius:10,padding:"12px 14px"}}>
            <div style={{fontSize:9,color:"#93C5FD",fontWeight:500,textTransform:"uppercase",letterSpacing:"0.05em",fontFamily:F,marginBottom:8}}>Harris-Benedict</div>
            <div style={{fontSize:10,color:"#D4E3FF",fontFamily:"monospace",lineHeight:1.9}}>
              <div>F: 655+(9.6xkg)+(1.9xcm)-(4.7xedad)</div>
              <div style={{color:"#3A5BA0"}}>────</div>
              <div style={{color:"#8B949E"}}>M: 66+(13.8xkg)+(5xcm)-(6.8xedad)</div>
            </div>
          </div>
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
function loadLS(key,fallback){try{const v=localStorage.getItem(key);return v?JSON.parse(v):fallback;}catch{return fallback;}}

const DEFAULT_PATIENT={caseName:"",sex:"F",weightLb:145,heightIn:67,age:28,waist:89,goal:"mantener",activity:0,condition:"none",protPct:17,lipPct:30,hcPct:53,mealTimes:4,protG:67,lipG:53,hcG:210,vet:1582,geb:1479,exchanges:null};

export default function App() {
  const [lang,setLang]=useState("ES");
  const [screen,setScreen]=useState("s1");
  const [isMobile,setIsMobile]=useState(false);
  const [showUpgrade,setShowUpgrade]=useState(false);
  const FREE_LIMIT=6;
  const [caseCount,setCaseCount]=useState(()=>loadLS("nl_case_count_v1",0));
  const [caseStarted,setCaseStarted]=useState(false);
  const [studyMode,setStudyModeRaw]=useState(()=>loadLS(LS_KEY_STUDY,false));
  const [patientState,setPatientStateRaw]=useState(()=>loadLS(LS_KEY_PATIENT,DEFAULT_PATIENT));

  function setStudyMode(val){setStudyModeRaw(val);try{localStorage.setItem(LS_KEY_STUDY,JSON.stringify(val));}catch{}}
  function setPatientState(updater){setPatientStateRaw(prev=>{const next=typeof updater==="function"?updater(prev):updater;try{localStorage.setItem(LS_KEY_PATIENT,JSON.stringify(next));}catch{}return next;});}

  useEffect(()=>{const check=()=>setIsMobile(window.innerWidth<768);check();window.addEventListener("resize",check);return()=>window.removeEventListener("resize",check);},[]);

  const isCalcScreen=["s1","s2","s3"].includes(screen);

  return (
    <StudyModeContext.Provider value={{studyMode,setStudyMode}}>
      <div style={{fontFamily:F,background:"#F5F7FF",minHeight:"100vh",display:"flex",flexDirection:"column"}}>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet"/>
        <Navbar lang={lang} setLang={setLang} screen={screen} setScreen={setScreen} isMobile={isMobile} onUpgrade={()=>setShowUpgrade(true)}/>
        {studyMode&&(
          <div style={{background:"#1E1040",borderBottom:"1px solid #7C3AED",padding:"8px 20px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <span style={{fontSize:13}}>◎</span>
            <span style={{fontSize:12,color:"#C4B5FD",fontFamily:F,fontWeight:500}}>{lang==="ES"?"Study Mode activo — panel educativo próximamente.":"Study Mode active — educational panel coming soon."}</span>
            <span style={{marginLeft:"auto",fontSize:10,color:"#7C3AED",fontFamily:F,background:"#2D1B69",padding:"2px 8px",borderRadius:20,border:"0.5px solid #7C3AED"}}>{lang==="ES"?"Fase 2":"Phase 2"}</span>
          </div>
        )}
        {isCalcScreen&&<StepPills lang={lang} current={screen} setScreen={setScreen}/>}
        <div style={{flex:1,overflowY:screen==="s4"?"hidden":"auto",display:"flex",flexDirection:"column"}}>
          {screen==="s1"&&<Screen1 lang={lang} state={patientState} setState={setPatientState} setScreen={setScreen} isMobile={isMobile} caseStarted={caseStarted} setCaseStarted={setCaseStarted} FREE_LIMIT={FREE_LIMIT} setCaseCount={setCaseCount} setShowUpgrade={setShowUpgrade}/>}
          {screen==="s2"&&<Screen2 lang={lang} state={patientState} setState={setPatientState} setScreen={setScreen} isMobile={isMobile}/>}
          {screen==="s3"&&<Screen3Wrapper lang={lang} state={patientState} setScreen={setScreen} studyMode={studyMode}/>}
          {screen==="s4"&&<Screen4 lang={lang} isMobile={isMobile}/>}
        </div>
      </div>
    {showUpgrade&&<UpgradeModal isES={lang==="ES"} onClose={()=>setShowUpgrade(false)} caseCount={caseCount} freeLimit={FREE_LIMIT}/>}
    </StudyModeContext.Provider>
  );
}
