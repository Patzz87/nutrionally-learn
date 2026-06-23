const MONTHLY_URL = "https://nutrionally.lemonsqueezy.com/checkout/buy/c51e1318-e378-4c21-a5a7-f0a3be17ce69";
const LIFETIME_URL = "https://nutrionally.lemonsqueezy.com/checkout/buy/807fc3f2-9f9c-4417-bb99-38ef801a5f0e";
const FONT = "Plus Jakarta Sans, sans-serif";

export default function UpgradeModal({ isES, onClose, caseCount, freeLimit }) {
  const count = caseCount || 0;
  const limit = freeLimit || 6;

  return (
    <div
      onClick={onClose}
      style={{
        position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:1000,
        display:"flex", alignItems:"center", justifyContent:"center", padding:"20px",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background:"#fff", borderRadius:16, padding:"32px 28px", maxWidth:420, width:"100%",
          fontFamily:FONT,
        }}
      >
        {/* Header */}
        <div style={{textAlign:"center", marginBottom:20}}>
          <div style={{display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:8}}>
            <div style={{width:8, height:8, borderRadius:"50%", background:"#2563EB"}}/>
            <span style={{fontSize:15, fontWeight:600, color:"#1E2D4E"}}>nutrionally</span>
            <span style={{fontSize:13, color:"#93C5FD", fontWeight:400}}>learn</span>
          </div>
          <h2 style={{fontSize:20, fontWeight:600, color:"#1E2D4E", margin:"0 0 8px"}}>
            {isES ? "Desbloquea el plan completo" : "Unlock the full plan"}
          </h2>
          <p style={{fontSize:13, color:"#3A5BA0", margin:0, lineHeight:1.5}}>
            {isES
              ? "Calcula casos ilimitados, exporta PDF con estudio y accede a todos los módulos clínicos."
              : "Calculate unlimited cases, export study PDFs, and access all clinical modules."}
          </p>
        </div>

        {/* Case count indicator */}
        <div style={{
          background:"#FEF9E7", border:"0.5px solid #e8d89a", borderRadius:8,
          padding:"10px 14px", marginBottom:20, display:"flex", alignItems:"center", gap:10,
        }}>
          <div style={{flex:1}}>
            <div style={{fontSize:11, color:"#7D3C98", fontWeight:500, marginBottom:4}}>
              {isES ? `Casos gratuitos usados` : `Free cases used`}
            </div>
            <div style={{height:6, background:"#D4E3FF", borderRadius:3, overflow:"hidden"}}>
              <div style={{height:"100%", width:`${Math.min(count/limit*100,100)}%`, background:"#2563EB", borderRadius:3}}/>
            </div>
          </div>
          <div style={{fontSize:14, fontWeight:600, color:"#1E2D4E", minWidth:40, textAlign:"right"}}>
            {count}/{limit}
          </div>
        </div>

        {/* Features */}
        <div style={{background:"#F5F7FF", borderRadius:10, padding:"14px 16px", marginBottom:20}}>
          {[
            isES ? "✓ Casos ilimitados" : "✓ Unlimited cases",
            isES ? "✓ PDF educativo + PDF Study Mode" : "✓ Educational PDF + Study Mode PDF",
            isES ? "✓ Módulo de condiciones y alergias" : "✓ Conditions & allergies module",
            isES ? "✓ Nutrición parenteral y enteral" : "✓ Parenteral & enteral nutrition",
            isES ? "✓ Portafolio académico" : "✓ Academic portfolio",
            isES ? "✓ Bilingüe ES / EN" : "✓ Bilingual ES / EN",
          ].map((f, i) => (
            <div key={i} style={{fontSize:12, color:"#1E2D4E", padding:"4px 0", fontWeight: i === 0 ? 500 : 400}}>
              {f}
            </div>
          ))}
        </div>

        {/* Pricing options */}
        <div style={{display:"flex", flexDirection:"column", gap:10, marginBottom:16}}>
          <a
            href={MONTHLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:"block", padding:"14px 18px", borderRadius:10,
              background:"#2563EB", color:"#fff", textDecoration:"none", textAlign:"center",
            }}
          >
            <div style={{fontSize:14, fontWeight:600, marginBottom:2}}>
              {isES ? "Suscripción mensual — $8/mes" : "Monthly subscription — $8/mo"}
            </div>
            <div style={{fontSize:11, color:"#93C5FD"}}>
              {isES ? "Cancela cuando quieras" : "Cancel anytime"}
            </div>
          </a>

          <a
            href={LIFETIME_URL}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display:"block", padding:"14px 18px", borderRadius:10,
              background:"#EFF6FF", border:"1.5px solid #2563EB", color:"#1E2D4E",
              textDecoration:"none", textAlign:"center", position:"relative",
            }}
          >
            <div style={{
              position:"absolute", top:-10, left:"50%", transform:"translateX(-50%)",
              background:"#2563EB", color:"#fff", fontSize:10, fontWeight:600,
              padding:"2px 10px", borderRadius:20,
            }}>
              {isES ? "MEJOR VALOR" : "BEST VALUE"}
            </div>
            <div style={{fontSize:14, fontWeight:600, color:"#1E2D4E", marginBottom:2}}>
              {isES ? "Acceso de por vida — $79" : "Lifetime access — $79"}
            </div>
            <div style={{fontSize:11, color:"#3A5BA0"}}>
              {isES ? "Pago único · tuyo para siempre" : "One-time payment · yours forever"}
            </div>
          </a>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            width:"100%", padding:"10px", borderRadius:8, border:"0.5px solid #D4E3FF",
            background:"transparent", color:"#3A5BA0", fontSize:12, cursor:"pointer",
            fontFamily:FONT,
          }}
        >
          {isES ? "Seguir con el plan gratuito" : "Continue with free plan"}
        </button>
      </div>
    </div>
  );
}
