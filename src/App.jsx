import { useState, useMemo, useEffect } from "react";

const SUPABASE_URL = "https://yoobeijjzzszltmhnsnr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvb2JlaWpqenpzemx0bWhuc25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjg4NTMsImV4cCI6MjA4ODc0NDg1M30.ld-Nw95O56F9YMrDZob4mSKP6Je9vto7GaYvjOQ8jPo";

const db = {
  async get() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/visitas?order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    const data = await res.json();
    return data.map(v => ({
      ...v,
      historico: v.historico || [],
      valorOrcamento: v.valor_orcamento,
      dataVisita: v.data_visita,
      horaVisita: v.hora_visita,
      opId: v.op_id,
      motivoCompra: v.motivo_compra,
      dataInstalacao: v.data_instalacao,
      dataCriacao: v.data_criacao
    }));
  },
  async insert(v) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/visitas`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ cliente: v.cliente, telefone: v.telefone, endereco: v.endereco, email: v.email, data_visita: v.dataVisita, hora_visita: v.horaVisita, op_id: v.opId, ambiente: v.ambiente, motivo_compra: v.motivoCompra, urgencia: v.urgencia, produtos: v.produtos, medidas: v.medidas, observacoes: v.observacoes, valor_orcamento: v.valorOrcamento, desconto: v.desconto, data_instalacao: v.dataInstalacao, status: v.status, historico: v.historico, data_criacao: v.dataCriacao })
    });
    return (await res.json())[0];
  },
  async update(id, v) {
    await fetch(`${SUPABASE_URL}/rest/v1/visitas?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ cliente: v.cliente, telefone: v.telefone, endereco: v.endereco, email: v.email, data_visita: v.dataVisita, hora_visita: v.horaVisita, op_id: v.opId, ambiente: v.ambiente, motivo_compra: v.motivoCompra, urgencia: v.urgencia, produtos: v.produtos, medidas: v.medidas, observacoes: v.observacoes, valor_orcamento: v.valorOrcamento, desconto: v.desconto, data_instalacao: v.dataInstalacao, status: v.status, historico: v.historico, data_criacao: v.dataCriacao })
    });
  },
  async delete(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/visitas?id=eq.${id}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
  }
};

const STATUS = {
  agendado: { label: "Agendado", color: "#3b82f6", bg: "#3b82f615", icon: "📅" },
  visitado: { label: "Visita Realizada", color: "#f59e0b", bg: "#f59e0b15", icon: "🏠" },
  orcamento_enviado: { label: "Orçamento Enviado", color: "#8b5cf6", bg: "#8b5cf615", icon: "📋" },
  fechado: { label: "Fechado ✓", color: "#10b981", bg: "#10b98115", icon: "✅" },
  perdido: { label: "Perdido", color: "#ef4444", bg: "#ef444415", icon: "❌" },
  reagendar: { label: "Reagendar", color: "#f97316", bg: "#f9731615", icon: "🔄" },
};

const empty = { cliente:"", telefone:"", endereco:"", email:"", dataVisita:"", horaVisita:"", opId:"", ambiente:"", motivoCompra:"", urgencia:"", produtos:"", medidas:"", observacoes:"", valorOrcamento:"", desconto:"", dataInstalacao:"", status:"agendado", historico:[], dataCriacao: new Date().toLocaleDateString("pt-BR") };
const fmt = (v) => Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
const valorFinal = (d) => { const v=Number(d.valorOrcamento||0); return v-(v*Number(d.desconto||0))/100; };

function extrairEmail(texto) {
  const r = { cliente:"", telefone:"", endereco:"", ambiente:"", motivoCompra:"", urgencia:"", produtos:"", medidas:"", dataVisita:"", horaVisita:"", observacoes:"" };
  const tel=texto.match(/(\(?\d{2}\)?\s?\d{4,5}[-\s]?\d{4})/); if(tel) r.telefone=tel[0];
  const nome=texto.match(/(?:Olá|Ola)[,\s]+([^\n,!]+)/i); if(nome) r.cliente=nome[1].trim();
  const data=texto.match(/Data[:\s]+(\d{2}\/\d{2}\/\d{4})/i); if(data) r.dataVisita=data[1];
  const hora=texto.match(/Horário[:\s]+(\d{2}:\d{2})/i); if(hora) r.horaVisita=hora[1];
  const end=texto.match(/Endereço[:\s]+([^\n]+)/i); if(end) r.endereco=end[1].trim();
  const amb=texto.match(/Ambiente[s]?[:\s]+([^\n]+)/i); if(amb) r.ambiente=amb[1].trim();
  const mot=texto.match(/Motivo[^:]*[:\s]+([^\n]+)/i); if(mot) r.motivoCompra=mot[1].trim();
  const urg=texto.match(/Urgência[^:]*[:\s]+([^\n]+)/i); if(urg) r.urgencia=urg[1].trim();
  const prod=texto.match(/Produtos?[^:]*[:\s]+([^\n]+)/i); if(prod) r.produtos=prod[1].trim();
  const med=texto.match(/Medidas?[^:]*[:\s]+([^\n]+)/i); if(med) r.medidas=med[1].trim();
  r.observacoes=texto.slice(0,400);
  return r;
}

const hoje = new Date().toLocaleDateString("pt-BR");
const s = { fontFamily:"'Georgia', serif" };
const dm = { fontFamily:"'Segoe UI', sans-serif" };

export default function CRM() {
  const [visitas, setVisitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState("dashboard");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({...empty});
  const [nota, setNota] = useState("");
  const [emailTexto, setEmailTexto] = useState("");
  const [importStep, setImportStep] = useState("colar");
  const [filtro, setFiltro] = useState("todos");
  const [search, setSearch] = useState("");

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    setLoading(true);
    try { setVisitas(await db.get()); } catch(e) { console.error(e); }
    setLoading(false);
  };

  const stats = useMemo(() => {
    const fechados = visitas.filter(v=>v.status==="fechado");
    return {
      total: visitas.length,
      fechados: fechados.length,
      pendentes: visitas.filter(v=>v.status==="orcamento_enviado").length,
      hoje: visitas.filter(v=>v.dataVisita===hoje).length,
      receita: fechados.reduce((a,v)=>a+valorFinal(v),0),
      conversao: visitas.length>0?((fechados.length/visitas.length)*100).toFixed(0):0
    };
  }, [visitas]);

  const filtradas = useMemo(() => visitas.filter(v => {
    const s1 = filtro==="todos" || v.status===filtro;
    const s2 = search==="" || v.cliente?.toLowerCase().includes(search.toLowerCase()) || v.telefone?.includes(search);
    return s1&&s2;
  }), [visitas, filtro, search]);

  const salvar = async () => {
    if (!form.cliente) return;
    setSaving(true);
    const log = { data: hoje, texto: form.id ? "Dados atualizados" : "Visita cadastrada" };
    const historico = [...(form.historico||[]), log];
    try {
      if (form.id) await db.update(form.id, {...form, historico});
      else await db.insert({...form, historico, dataCriacao: hoje});
      await carregar();
      setView("lista");
    } catch(e) { console.error(e); }
    setSaving(false);
  };

  const excluir = async (id) => {
    if (!window.confirm("Excluir esta visita?")) return;
    await db.delete(id);
    await carregar();
    setView("lista");
  };

  const addNota = async () => {
    if (!nota.trim()||!selected) return;
    const historico = [{data:hoje,texto:nota}, ...(selected.historico||[])];
    await db.update(selected.id, {...selected, historico});
    const att = {...selected, historico};
    setVisitas(visitas.map(v=>v.id===selected.id?att:v));
    setSelected(att);
    setNota("");
  };

  const mudarStatus = async (novoStatus) => {
    const log = {data:hoje, texto:`Status: ${STATUS[novoStatus].label}`};
    const historico = [log, ...(selected.historico||[])];
    await db.update(selected.id, {...selected, status:novoStatus, historico});
    const att = {...selected, status:novoStatus, historico};
    setVisitas(visitas.map(v=>v.id===selected.id?att:v));
    setSelected(att);
  };

  const Field = ({label, value, color}) => (
    <div style={{padding:"8px 0", borderBottom:"1px solid #1e1e28"}}>
      <div style={{...dm, fontSize:10, color:"#555", textTransform:"uppercase", letterSpacing:"1px", marginBottom:3}}>{label}</div>
      <div style={{...dm, fontSize:13, color:color||"#ccc"}}>{value||<span style={{color:"#444"}}>—</span>}</div>
    </div>
  );

  if (loading) return (
    <div style={{background:"#0a0a0f",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",...dm,color:"#c9a84c",fontSize:16}}>
      Conectando ao banco de dados... ⏳
    </div>
  );

  return (
    <div style={{...s, minHeight:"100vh", background:"#0a0a0f", color:"#e8e4dc", display:"flex"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        .btn{cursor:pointer;border:none;border-radius:6px;font-family:'Segoe UI',sans-serif;font-size:13px;font-weight:500;transition:all .18s}
        .bp{background:#c9a84c;color:#0a0a0f;padding:9px 18px}.bp:hover{background:#e0bf6a}.bp:disabled{opacity:.5;cursor:not-allowed}
        .bg{background:transparent;color:#888;padding:8px 14px;border:1px solid #2a2a35}.bg:hover{background:#1e1e2a;color:#e8e4dc}
        .bd{background:transparent;color:#ef4444;padding:8px 14px;border:1px solid #ef444440}.bd:hover{background:#ef444415}
        .inp{background:#15151f;border:1px solid #2a2a38;border-radius:7px;color:#e8e4dc;padding:9px 12px;font-family:'Segoe UI',sans-serif;font-size:13px;width:100%;outline:none;transition:border .2s}
        .inp:focus{border-color:#c9a84c}.inp::placeholder{color:#444}
        .nav{cursor:pointer;padding:9px 12px;border-radius:7px;font-family:'Segoe UI',sans-serif;font-size:13px;transition:all .18s;color:#777;display:flex;align-items:center;gap:8px}
        .nav:hover{background:#1a1a25;color:#e8e4dc}.nav.on{background:#c9a84c15;color:#c9a84c;border-left:2px solid #c9a84c}
        .card{background:#12121a;border:1px solid #22222e;border-radius:10px}
        .row{border-bottom:1px solid #1a1a24;padding:12px 16px;cursor:pointer;transition:background .15s;display:grid;gap:10px;align-items:center}
        .row:hover{background:#16161f}
        .tag{display:inline-flex;align-items:center;gap:4px;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:500}
        .sc{background:#12121a;border:1px solid #22222e;border-radius:10px;padding:18px;position:relative;overflow:hidden}
        .sc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#c9a84c,#e0bf6a)}
        textarea.inp{min-height:80px;resize:vertical}
        select.inp{cursor:pointer}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0a0a0f}::-webkit-scrollbar-thumb{background:#2a2a3a;border-radius:2px}
        .sb{cursor:pointer;border:1px solid #2a2a35;border-radius:6px;padding:7px 12px;font-family:'Segoe UI',sans-serif;font-size:12px;background:transparent;transition:all .15s}
        .sb:hover{transform:translateY(-1px)}
        .g2{display:grid;grid-template-columns:1fr 1fr;gap:12px}
      `}</style>

      {/* SIDEBAR */}
      <div style={{width:210,background:"#080810",borderRight:"1px solid #1a1a24",padding:"20px 10px",display:"flex",flexDirection:"column",gap:3,flexShrink:0}}>
        <div style={{padding:"4px 8px 20px",borderBottom:"1px solid #1a1a24",marginBottom:8}}>
          <div style={{...s,fontSize:18,color:"#c9a84c",fontWeight:700}}>Persianas</div>
          <div style={{...dm,fontSize:10,color:"#444",letterSpacing:"2px",textTransform:"uppercase"}}>CRM · Felipe P.</div>
        </div>
        <div className={`nav ${view==="dashboard"?"on":""}`} onClick={()=>setView("dashboard")}>▦ Dashboard</div>
        <div className={`nav ${view==="lista"||view==="detalhe"?"on":""}`} onClick={()=>setView("lista")}>📋 Visitas</div>
        <div className={`nav ${view==="importar"?"on":""}`} onClick={()=>{setImportStep("colar");setEmailTexto("");setView("importar")}}>✉ Importar E-mail</div>
        <div style={{flex:1}}/>
        <button className="btn bp" style={{width:"100%",padding:11}} onClick={()=>{setForm({...empty});setView("novo")}}>+ Nova Visita</button>
        <div style={{marginTop:14,padding:"12px 8px",borderTop:"1px solid #1a1a24"}}>
          <div style={{...dm,fontSize:10,color:"#444"}}>RECEITA DO MÊS</div>
          <div style={{...s,fontSize:16,color:"#10b981",marginTop:4}}>{fmt(stats.receita)}</div>
          <div style={{...dm,fontSize:10,color:"#444",marginTop:8}}>CONVERSÃO</div>
          <div style={{...s,fontSize:16,color:"#c9a84c",marginTop:4}}>{stats.conversao}%</div>
        </div>
      </div>

      {/* MAIN */}
      <div style={{flex:1,overflow:"auto",padding:"26px 28px"}}>

        {/* DASHBOARD */}
        {view==="dashboard" && (
          <div>
            <div style={{...s,fontSize:24,marginBottom:4}}>Bom dia, Felipe! 👋</div>
            <div style={{...dm,fontSize:13,color:"#555",marginBottom:24}}>Resumo de hoje — {hoje}</div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
              {[
                {label:"Visitas Hoje",value:stats.hoje,sub:"agendadas",color:"#3b82f6"},
                {label:"Orçamentos Pendentes",value:stats.pendentes,sub:"aguardando resposta",color:"#8b5cf6"},
                {label:"Taxa de Conversão",value:`${stats.conversao}%`,sub:`${stats.fechados} de ${stats.total} fechados`,color:"#c9a84c"},
                {label:"Receita do Mês",value:fmt(stats.receita),sub:"negócios fechados",color:"#10b981"},
              ].map((st,i)=>(
                <div key={i} className="sc">
                  <div style={{...dm,fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}>{st.label}</div>
                  <div style={{...s,fontSize:i===3?18:26,color:st.color}}>{st.value}</div>
                  <div style={{...dm,fontSize:11,color:"#444",marginTop:5}}>{st.sub}</div>
                </div>
              ))}
            </div>
            <div style={{...s,fontSize:17,marginBottom:12}}>📅 Agendadas</div>
            <div className="card" style={{marginBottom:24}}>
              {visitas.filter(v=>v.status==="agendado").length===0&&<div style={{padding:28,textAlign:"center",...dm,fontSize:13,color:"#444"}}>Nenhuma visita agendada</div>}
              {visitas.filter(v=>v.status==="agendado").map(v=>(
                <div key={v.id} className="row" style={{gridTemplateColumns:"2fr 1.5fr 1fr 1fr 60px"}} onClick={()=>{setSelected(v);setView("detalhe")}}>
                  <div><div style={{...dm,fontSize:14,fontWeight:600}}>{v.cliente}</div><div style={{...dm,fontSize:11,color:"#555",marginTop:2}}>{v.endereco?.slice(0,40)}</div></div>
                  <div style={{...dm,fontSize:12,color:"#777"}}>{v.dataVisita} às {v.horaVisita}</div>
                  <div style={{...dm,fontSize:12,color:"#888"}}>{v.telefone}</div>
                  <div style={{...dm,fontSize:11,color:"#3b82f6"}}>{v.ambiente}</div>
                  <span className="tag" style={{background:STATUS[v.status]?.bg,color:STATUS[v.status]?.color}}>{STATUS[v.status]?.icon}</span>
                </div>
              ))}
            </div>
            <div style={{...s,fontSize:17,marginBottom:12}}>📋 Orçamentos Pendentes</div>
            <div className="card">
              {visitas.filter(v=>v.status==="orcamento_enviado").length===0&&<div style={{padding:28,textAlign:"center",...dm,fontSize:13,color:"#444"}}>Nenhum orçamento pendente</div>}
              {visitas.filter(v=>v.status==="orcamento_enviado").map(v=>(
                <div key={v.id} className="row" style={{gridTemplateColumns:"2fr 1fr 1fr 1fr 60px"}} onClick={()=>{setSelected(v);setView("detalhe")}}>
                  <div><div style={{...dm,fontSize:14,fontWeight:600}}>{v.cliente}</div><div style={{...dm,fontSize:11,color:"#555"}}>{v.produtos}</div></div>
                  <div style={{...dm,fontSize:13,color:"#c9a84c"}}>{fmt(v.valorOrcamento)}</div>
                  <div style={{...dm,fontSize:13,color:"#ef4444"}}>-{v.desconto||0}%</div>
                  <div style={{...dm,fontSize:13,color:"#10b981",fontWeight:600}}>{fmt(valorFinal(v))}</div>
                  <span className="tag" style={{background:STATUS[v.status]?.bg,color:STATUS[v.status]?.color}}>{STATUS[v.status]?.icon}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LISTA */}
        {view==="lista" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:20}}>
              <div><div style={{...s,fontSize:24,marginBottom:3}}>Todas as Visitas</div><div style={{...dm,fontSize:13,color:"#555"}}>{filtradas.length} registros</div></div>
              <div style={{display:"flex",gap:10}}>
                <button className="btn bg" style={{color:"#818cf8",borderColor:"#6366f140"}} onClick={()=>{setImportStep("colar");setEmailTexto("");setView("importar")}}>✉ Importar</button>
                <button className="btn bp" onClick={()=>{setForm({...empty});setView("novo")}}>+ Nova Visita</button>
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:16}}>
              <input className="inp" placeholder="Buscar cliente ou telefone..." value={search} onChange={e=>setSearch(e.target.value)} style={{maxWidth:240}}/>
              <select className="inp" value={filtro} onChange={e=>setFiltro(e.target.value)} style={{maxWidth:200}}>
                <option value="todos">Todos os status</option>
                {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
            </div>
            <div className="card">
              <div className="row" style={{cursor:"default",gridTemplateColumns:"2fr 1.2fr 1fr 1fr 80px"}}>
                {["Cliente","Data da Visita","Orçamento","Valor Final","Status"].map(h=>(
                  <div key={h} style={{...dm,fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:"1px"}}>{h}</div>
                ))}
              </div>
              {filtradas.length===0&&<div style={{padding:36,textAlign:"center",color:"#444",...dm}}>Nenhum registro encontrado</div>}
              {filtradas.map(v=>(
                <div key={v.id} className="row" style={{gridTemplateColumns:"2fr 1.2fr 1fr 1fr 80px"}} onClick={()=>{setSelected(v);setView("detalhe")}}>
                  <div><div style={{...dm,fontSize:13,fontWeight:600}}>{v.cliente}</div><div style={{...dm,fontSize:11,color:"#555"}}>{v.telefone} · {v.opId}</div></div>
                  <div style={{...dm,fontSize:12,color:"#888"}}>{v.dataVisita} {v.horaVisita}</div>
                  <div style={{...dm,fontSize:13,color:"#c9a84c"}}>{v.valorOrcamento?fmt(v.valorOrcamento):<span style={{color:"#444"}}>—</span>}</div>
                  <div style={{...dm,fontSize:13,color:"#10b981",fontWeight:600}}>{v.valorOrcamento?fmt(valorFinal(v)):<span style={{color:"#444"}}>—</span>}</div>
                  <span className="tag" style={{background:STATUS[v.status]?.bg,color:STATUS[v.status]?.color}}>{STATUS[v.status]?.icon}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DETALHE */}
        {view==="detalhe" && selected && (
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:22}}>
              <button className="btn bg" onClick={()=>setView("lista")}>← Voltar</button>
              <div style={{flex:1}}><div style={{...s,fontSize:22}}>{selected.cliente}</div><div style={{...dm,fontSize:12,color:"#555"}}>{selected.telefone} · {selected.dataCriacao}</div></div>
              <button className="btn bg" onClick={()=>{setForm({...selected});setView("novo")}}>✎ Editar</button>
              <button className="btn bd" onClick={()=>excluir(selected.id)}>✕ Excluir</button>
            </div>
            <div className="card" style={{padding:16,marginBottom:16}}>
              <div style={{...dm,fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:12}}>Atualizar Status</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {Object.entries(STATUS).map(([k,v])=>(
                  <button key={k} className="sb" onClick={()=>mudarStatus(k)} style={{color:v.color,borderColor:selected.status===k?v.color:"#2a2a35",background:selected.status===k?v.bg:"transparent",fontWeight:selected.status===k?700:400}}>
                    {v.icon} {v.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div className="card" style={{padding:18}}>
                <div style={{...dm,fontSize:10,color:"#3b82f6",textTransform:"uppercase",letterSpacing:"1px",marginBottom:12}}>📅 Dados da Visita</div>
                <Field label="Data e Horário" value={`${selected.dataVisita} às ${selected.horaVisita}`}/>
                <Field label="Endereço" value={selected.endereco}/>
                <Field label="Telefone" value={selected.telefone} color="#c9a84c"/>
                <Field label="E-mail" value={selected.email}/>
                <Field label="OP_ID" value={selected.opId}/>
              </div>
              <div className="card" style={{padding:18}}>
                <div style={{...dm,fontSize:10,color:"#10b981",textTransform:"uppercase",letterSpacing:"1px",marginBottom:12}}>💰 Orçamento</div>
                <Field label="Valor do Orçamento" value={selected.valorOrcamento?fmt(selected.valorOrcamento):null} color="#c9a84c"/>
                <Field label="Desconto" value={selected.desconto?`${selected.desconto}% — ${fmt(Number(selected.valorOrcamento)*Number(selected.desconto)/100)}`:null} color="#ef4444"/>
                <Field label="Valor Final" value={selected.valorOrcamento?fmt(valorFinal(selected)):null} color="#10b981"/>
                <Field label="Data de Instalação" value={selected.dataInstalacao} color="#8b5cf6"/>
              </div>
              <div className="card" style={{padding:18}}>
                <div style={{...dm,fontSize:10,color:"#f59e0b",textTransform:"uppercase",letterSpacing:"1px",marginBottom:12}}>🏠 Contexto</div>
                <Field label="Ambiente" value={selected.ambiente}/>
                <Field label="Motivo da Compra" value={selected.motivoCompra}/>
                <Field label="Urgência / Prazo" value={selected.urgencia}/>
                <Field label="Produtos de Interesse" value={selected.produtos}/>
                <Field label="Medidas" value={selected.medidas}/>
              </div>
              <div className="card" style={{padding:18}}>
                <div style={{...dm,fontSize:10,color:"#8b5cf6",textTransform:"uppercase",letterSpacing:"1px",marginBottom:12}}>📝 Anotações & Histórico</div>
                <div style={{display:"flex",gap:8,marginBottom:12}}>
                  <input className="inp" placeholder="Nova anotação (Enter)..." value={nota} onChange={e=>setNota(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addNota()}/>
                  <button className="btn bp" onClick={addNota} style={{whiteSpace:"nowrap",padding:"9px 14px"}}>+</button>
                </div>
                <div style={{maxHeight:220,overflow:"auto"}}>
                  {(selected.historico||[]).length===0&&<div style={{...dm,fontSize:13,color:"#444"}}>Sem anotações.</div>}
                  {(selected.historico||[]).map((h,i)=>(
                    <div key={i} style={{padding:"8px 0",borderBottom:"1px solid #1a1a24"}}>
                      <div style={{...dm,fontSize:10,color:"#c9a84c",marginBottom:2}}>{h.data}</div>
                      <div style={{...dm,fontSize:13,color:"#bbb"}}>{h.texto}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* IMPORTAR */}
        {view==="importar" && (
          <div style={{maxWidth:700}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}>
              <button className="btn bg" onClick={()=>setView("dashboard")}>← Voltar</button>
              <div><div style={{...s,fontSize:22}}>✉ Importar Lead por E-mail</div><div style={{...dm,fontSize:13,color:"#555"}}>Cole o e-mail e extraímos tudo automaticamente</div></div>
            </div>
            {importStep==="colar" && (
              <div className="card" style={{padding:24}}>
                <textarea className="inp" style={{minHeight:240}} placeholder={"Cole aqui o e-mail...\n\nExemplo:\nOlá, Felipe P,\nData: 16/03/2026\nHorário: 13:00\nEndereço: Rua...\nTelefone: 11 99999-9999\nAmbiente(s): Sala\nMotivo principal da compra: Estética"} value={emailTexto} onChange={e=>setEmailTexto(e.target.value)}/>
                <div style={{display:"flex",gap:10,marginTop:16}}>
                  <button className="btn bp" onClick={()=>{if(!emailTexto.trim())return;setForm({...empty,...extrairEmail(emailTexto)});setImportStep("revisar")}} disabled={!emailTexto.trim()}>✨ Extrair Dados</button>
                  <button className="btn bg" onClick={()=>{setForm({...empty});setView("novo")}}>Preencher manualmente</button>
                </div>
              </div>
            )}
            {importStep==="revisar" && (
              <div className="card" style={{padding:20,borderColor:"#3b82f640"}}>
                <div style={{...dm,fontSize:11,color:"#3b82f6",textTransform:"uppercase",letterSpacing:"1px",marginBottom:16}}>✓ Revise os dados antes de salvar</div>
                <div className="g2">
                  {[{label:"Nome *",k:"cliente"},{label:"Telefone",k:"telefone"},{label:"Data",k:"dataVisita",ph:"DD/MM/AAAA"},{label:"Horário",k:"horaVisita",ph:"HH:MM"}].map(f=>(
                    <div key={f.k} style={{marginBottom:11}}>
                      <label style={{...dm,fontSize:11,color:"#777",display:"block",marginBottom:5}}>{f.label}</label>
                      <input className="inp" placeholder={f.ph||""} value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}/>
                    </div>
                  ))}
                  <div style={{marginBottom:11,gridColumn:"span 2"}}>
                    <label style={{...dm,fontSize:11,color:"#777",display:"block",marginBottom:5}}>Endereço</label>
                    <input className="inp" value={form.endereco} onChange={e=>setForm({...form,endereco:e.target.value})}/>
                  </div>
                  <div style={{marginBottom:11}}>
                    <label style={{...dm,fontSize:11,color:"#777",display:"block",marginBottom:5}}>Ambiente</label>
                    <input className="inp" value={form.ambiente} onChange={e=>setForm({...form,ambiente:e.target.value})}/>
                  </div>
                  <div style={{marginBottom:11}}>
                    <label style={{...dm,fontSize:11,color:"#777",display:"block",marginBottom:5}}>Motivo</label>
                    <input className="inp" value={form.motivoCompra} onChange={e=>setForm({...form,motivoCompra:e.target.value})}/>
                  </div>
                </div>
                <div style={{display:"flex",gap:10}}>
                  <button className="btn bp" onClick={salvar} disabled={!form.cliente||saving}>{saving?"Salvando...":"✓ Salvar no CRM"}</button>
                  <button className="btn bg" onClick={()=>setImportStep("colar")}>← Voltar</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FORMULÁRIO */}
        {view==="novo" && (
          <div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:22}}>
              <button className="btn bg" onClick={()=>setView(form.id?"detalhe":"lista")}>← Voltar</button>
              <div style={{...s,fontSize:22}}>{form.id?"Editar Visita":"Nova Visita"}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
              <div className="card" style={{padding:20}}>
                <div style={{...dm,fontSize:10,color:"#3b82f6",textTransform:"uppercase",letterSpacing:"1px",marginBottom:16}}>📅 Dados da Visita</div>
                <div className="g2">
                  {[{label:"Nome *",k:"cliente",col:2},{label:"Telefone",k:"telefone",col:1},{label:"E-mail",k:"email",col:1},{label:"Data",k:"dataVisita",ph:"DD/MM/AAAA",col:1},{label:"Horário",k:"horaVisita",ph:"HH:MM",col:1},{label:"OP_ID",k:"opId",col:2},{label:"Endereço",k:"endereco",col:2}].map(f=>(
                    <div key={f.k} style={{marginBottom:11,gridColumn:`span ${f.col}`}}>
                      <label style={{...dm,fontSize:11,color:"#777",display:"block",marginBottom:5}}>{f.label}</label>
                      <input className="inp" placeholder={f.ph||""} value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}/>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:16}}>
                <div className="card" style={{padding:20}}>
                  <div style={{...dm,fontSize:10,color:"#f59e0b",textTransform:"uppercase",letterSpacing:"1px",marginBottom:16}}>🏠 Contexto</div>
                  {[{label:"Ambiente(s)",k:"ambiente"},{label:"Motivo da Compra",k:"motivoCompra"},{label:"Urgência",k:"urgencia"},{label:"Produtos",k:"produtos"},{label:"Medidas",k:"medidas"}].map(f=>(
                    <div key={f.k} style={{marginBottom:11}}>
                      <label style={{...dm,fontSize:11,color:"#777",display:"block",marginBottom:5}}>{f.label}</label>
                      <input className="inp" value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}/>
                    </div>
                  ))}
                </div>
                <div className="card" style={{padding:20}}>
                  <div style={{...dm,fontSize:10,color:"#10b981",textTransform:"uppercase",letterSpacing:"1px",marginBottom:16}}>💰 Orçamento</div>
                  <div className="g2">
                    <div style={{marginBottom:11}}>
                      <label style={{...dm,fontSize:11,color:"#777",display:"block",marginBottom:5}}>Valor (R$)</label>
                      <input className="inp" type="number" value={form.valorOrcamento} onChange={e=>setForm({...form,valorOrcamento:e.target.value})}/>
                    </div>
                    <div style={{marginBottom:11}}>
                      <label style={{...dm,fontSize:11,color:"#777",display:"block",marginBottom:5}}>Desconto (%)</label>
                      <input className="inp" type="number" value={form.desconto} onChange={e=>setForm({...form,desconto:e.target.value})}/>
                    </div>
                  </div>
                  {form.valorOrcamento&&<div style={{background:"#10b98112",border:"1px solid #10b98130",borderRadius:8,padding:"10px 14px",marginBottom:11}}>
                    <div style={{...dm,fontSize:11,color:"#777"}}>Valor Final:</div>
                    <div style={{...s,fontSize:18,color:"#10b981"}}>{fmt(Number(form.valorOrcamento)-(Number(form.valorOrcamento)*Number(form.desconto||0))/100)}</div>
                  </div>}
                  <div style={{marginBottom:11}}>
                    <label style={{...dm,fontSize:11,color:"#777",display:"block",marginBottom:5}}>Data de Instalação</label>
                    <input className="inp" placeholder="DD/MM/AAAA" value={form.dataInstalacao} onChange={e=>setForm({...form,dataInstalacao:e.target.value})}/>
                  </div>
                  <div>
                    <label style={{...dm,fontSize:11,color:"#777",display:"block",marginBottom:5}}>Status</label>
                    <select className="inp" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                      {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginTop:18}}>
              <button className="btn bp" style={{padding:"11px 28px"}} onClick={salvar} disabled={saving}>{saving?"Salvando...":(form.id?"Salvar Alterações":"Cadastrar Visita")}</button>
              <button className="btn bg" onClick={()=>setView(form.id?"detalhe":"lista")}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
