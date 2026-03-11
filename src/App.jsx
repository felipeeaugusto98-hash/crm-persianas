import { useState, useMemo, useEffect } from "react";

const SUPABASE_URL = "https://yoobeijjzzszltmhnsnr.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlvb2JlaWpqenpzemx0bWhuc25yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNjg4NTMsImV4cCI6MjA4ODc0NDg1M30.ld-Nw95O56F9YMrDZob4mSKP6Je9vto7GaYvjOQ8jPo";
const META_MENSAL = 150000;

const db = {
  async get() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/visitas?order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    const data = await res.json();
    return data.map(v => ({
      ...v, historico: v.historico || [],
      valorOrcamento: v.valor_orcamento, dataVisita: v.data_visita,
      horaVisita: v.hora_visita, opId: v.op_id,
      motivoCompra: v.motivo_compra, dataInstalacao: v.data_instalacao,
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

const dbClientes = {
  async get() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/clientes?order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return await res.json();
  },
  async insert(c) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/clientes`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ nome: c.nome, telefone: c.telefone, email: c.email, endereco: c.endereco, bairro: c.bairro, cidade: c.cidade, observacoes: c.observacoes, origem: c.origem })
    });
    return (await res.json())[0];
  },
  async update(id, c) {
    await fetch(`${SUPABASE_URL}/rest/v1/clientes?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ nome: c.nome, telefone: c.telefone, email: c.email, endereco: c.endereco, bairro: c.bairro, cidade: c.cidade, observacoes: c.observacoes, origem: c.origem })
    });
  },
  async delete(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/clientes?id=eq.${id}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
  }
};

const emptyCliente = { nome:"", telefone:"", email:"", endereco:"", bairro:"", cidade:"", observacoes:"", origem:"" };

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

function GraficoLinha({ visitas }) {
  const meses = useMemo(() => {
    const map = {};
    const agora = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(agora.getFullYear(), agora.getMonth() - i, 1);
      const key = `${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
      const label = d.toLocaleString('pt-BR',{month:'short'}).replace('.','');
      map[key] = { label, receita: 0 };
    }
    visitas.forEach(v => {
      if (!v.dataCriacao) return;
      const parts = v.dataCriacao.split('/');
      if (parts.length < 3) return;
      const key = `${parts[1]}/${parts[2]}`;
      if (map[key] && v.status === 'fechado') map[key].receita += valorFinal(v);
    });
    return Object.values(map);
  }, [visitas]);

  const W = 400, H = 140, PAD = 30;
  const maxR = Math.max(...meses.map(m => m.receita), META_MENSAL);
  const pts = meses.map((m, i) => ({
    x: PAD + (i / (meses.length-1)) * (W - PAD*2),
    y: PAD + (1 - m.receita/maxR) * (H - PAD*2),
    ...m
  }));
  const path = pts.map((p,i) => `${i===0?'M':'L'}${p.x},${p.y}`).join(' ');
  const metaY = PAD + (1 - META_MENSAL/maxR) * (H - PAD*2);

  return (
    <div>
      <div style={{fontFamily:"'Segoe UI',sans-serif",fontSize:11,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}>📈 Receita Mensal</div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:'visible'}}>
        <defs><linearGradient id="lg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity="0.25"/><stop offset="100%" stopColor="#10b981" stopOpacity="0"/></linearGradient></defs>
        {[0,0.5,1].map(t => <line key={t} x1={PAD} y1={PAD+t*(H-PAD*2)} x2={W-PAD} y2={PAD+t*(H-PAD*2)} stroke="#1e1e28" strokeWidth="1"/>)}
        {META_MENSAL<=maxR && <>
          <line x1={PAD} y1={metaY} x2={W-PAD} y2={metaY} stroke="#c9a84c" strokeWidth="1" strokeDasharray="4,3"/>
          <text x={W-PAD+3} y={metaY+4} fill="#c9a84c" fontSize="8">meta</text>
        </>}
        <path d={`${path} L${pts[pts.length-1].x},${H-PAD} L${pts[0].x},${H-PAD} Z`} fill="url(#lg)"/>
        <path d={path} fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round"/>
        {pts.map((p,i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="3.5" fill="#10b981" stroke="#0a0a0f" strokeWidth="2"/>
            <text x={p.x} y={H-4} fill="#555" fontSize="8" textAnchor="middle">{p.label}</text>
            {p.receita>0 && <text x={p.x} y={p.y-7} fill="#10b981" fontSize="7" textAnchor="middle">{(p.receita/1000).toFixed(0)}k</text>}
          </g>
        ))}
      </svg>
    </div>
  );
}

function Funil({ visitas }) {
  const etapas = [
    {label:"Leads",key:null,color:"#3b82f6"},
    {label:"Visitado",key:"visitado",color:"#f59e0b"},
    {label:"Orçamento",key:"orcamento_enviado",color:"#8b5cf6"},
    {label:"Fechado",key:"fechado",color:"#10b981"},
  ];
  const counts = etapas.map(e => e.key===null ? visitas.length : visitas.filter(v=>v.status===e.key).length);
  const max = Math.max(counts[0],1);
  return (
    <div>
      <div style={{fontFamily:"'Segoe UI',sans-serif",fontSize:11,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:12}}>🔽 Funil de Conversão</div>
      {etapas.map((e,i) => (
        <div key={i} style={{marginBottom:9}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:3,fontFamily:"'Segoe UI',sans-serif"}}>
            <span style={{fontSize:11,color:"#aaa"}}>{e.label}</span>
            <span style={{fontSize:12,color:e.color,fontWeight:600}}>{counts[i]}{i>0&&counts[i-1]>0&&<span style={{fontSize:9,color:"#555",fontWeight:400}}> ({Math.round(counts[i]/counts[i-1]*100)}%)</span>}</span>
          </div>
          <div style={{background:"#1a1a24",borderRadius:4,height:6}}>
            <div style={{width:`${Math.round(counts[i]/max*100)}%`,height:"100%",background:e.color,borderRadius:4,transition:"width .6s"}}/>
          </div>
        </div>
      ))}
    </div>
  );
}

function MedidorMeta({ receita }) {
  const pct = Math.min(receita/META_MENSAL,1);
  const R=55,cx=70,cy=65;
  const x2=cx+R*Math.cos(Math.PI+pct*Math.PI), y2=cy+R*Math.sin(Math.PI+pct*Math.PI);
  const cor = pct>=1?"#10b981":pct>=0.6?"#c9a84c":"#ef4444";
  return (
    <div style={{textAlign:"center",fontFamily:"'Segoe UI',sans-serif"}}>
      <div style={{fontSize:11,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>🎯 Meta Mensal</div>
      <svg width="140" height="80" viewBox="0 0 140 80">
        <path d={`M ${cx-R} ${cy} A ${R} ${R} 0 0 1 ${cx+R} ${cy}`} fill="none" stroke="#1e1e28" strokeWidth="9" strokeLinecap="round"/>
        {pct>0&&<path d={`M ${cx-R} ${cy} A ${R} ${R} 0 ${pct>0.5?1:0} 1 ${x2} ${y2}`} fill="none" stroke={cor} strokeWidth="9" strokeLinecap="round"/>}
        <text x={cx} y={cy-8} textAnchor="middle" fill={cor} fontSize="15" fontWeight="bold">{Math.round(pct*100)}%</text>
        <text x={cx} y={cy+5} textAnchor="middle" fill="#555" fontSize="7">da meta</text>
      </svg>
      <div style={{fontSize:12,color:cor,fontWeight:600,marginTop:-6}}>{fmt(receita)}</div>
      <div style={{fontSize:10,color:"#444",marginTop:2}}>faltam {fmt(Math.max(META_MENSAL-receita,0))}</div>
    </div>
  );
}

export default function CRM() {
  const [visitas, setVisitas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({...empty});
  const [formCliente, setFormCliente] = useState({...emptyCliente});
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [nota, setNota] = useState("");
  const [emailTexto, setEmailTexto] = useState("");
  const [importStep, setImportStep] = useState("colar");
  const [filtro, setFiltro] = useState("todos");
  const [search, setSearch] = useState("");
  const [searchCliente, setSearchCliente] = useState("");

  useEffect(() => { carregar(); }, []);

  const carregar = async () => {
    setLoading(true);
    try {
      const [v, c] = await Promise.all([db.get(), dbClientes.get()]);
      setVisitas(v); setClientes(c);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  const salvarCliente = async () => {
    if (!formCliente.nome) return;
    setSaving(true);
    try {
      if (formCliente.id) await dbClientes.update(formCliente.id, formCliente);
      else await dbClientes.insert(formCliente);
      const c = await dbClientes.get(); setClientes(c);
      setView("clientes");
    } catch(e) { console.error(e); }
    setSaving(false);
  };

  const excluirCliente = async (id) => {
    if (!window.confirm("Excluir este cliente?")) return;
    await dbClientes.delete(id);
    const c = await dbClientes.get(); setClientes(c);
    setView("clientes");
  };

  const clientesFiltrados = clientes.filter(c =>
    searchCliente==="" || c.nome?.toLowerCase().includes(searchCliente.toLowerCase()) || c.telefone?.includes(searchCliente)
  );

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
    const s1=filtro==="todos"||v.status===filtro;
    const s2=search===""||v.cliente?.toLowerCase().includes(search.toLowerCase())||v.telefone?.includes(search);
    return s1&&s2;
  }), [visitas, filtro, search]);

  const salvar = async () => {
    if (!form.cliente) return;
    setSaving(true);
    const log={data:hoje,texto:form.id?"Dados atualizados":"Visita cadastrada"};
    const historico=[...(form.historico||[]),log];
    try {
      if (form.id) await db.update(form.id,{...form,historico});
      else await db.insert({...form,historico,dataCriacao:hoje});
      await carregar(); setView("lista");
    } catch(e) { console.error(e); }
    setSaving(false);
  };

  const excluir = async (id) => {
    if (!window.confirm("Excluir esta visita?")) return;
    await db.delete(id); await carregar(); setView("lista");
  };

  const addNota = async () => {
    if (!nota.trim()||!selected) return;
    const historico=[{data:hoje,texto:nota},...(selected.historico||[])];
    await db.update(selected.id,{...selected,historico});
    const att={...selected,historico};
    setVisitas(visitas.map(v=>v.id===selected.id?att:v));
    setSelected(att); setNota("");
  };

  const mudarStatus = async (novoStatus) => {
    const log={data:hoje,texto:`Status: ${STATUS[novoStatus].label}`};
    const historico=[log,...(selected.historico||[])];
    await db.update(selected.id,{...selected,status:novoStatus,historico});
    const att={...selected,status:novoStatus,historico};
    setVisitas(visitas.map(v=>v.id===selected.id?att:v));
    setSelected(att);
  };

  const comissao = useMemo(() => {
    const fechados = visitas.filter(v => v.status === "fechado");
    const totalVendas = fechados.reduce((a, v) => a + valorFinal(v), 0);
    const totalVisitas = visitas.length;
    const conversao = totalVisitas > 0 ? (fechados.length / totalVisitas) * 100 : 0;

    // Base 10%
    let pct = 10;

    // Premissa 1: volume de vendas
    if (totalVendas >= 120000) pct += 5;
    else if (totalVendas >= 100000) pct += 4;
    else if (totalVendas >= 80000) pct += 3;
    else if (totalVendas >= 60000) pct += 2;
    else if (totalVendas >= 40000) pct += 1;

    // Premissa 2: taxa de conversão
    if (conversao >= 90) pct += 5;
    else if (conversao >= 80) pct += 4;
    else if (conversao >= 70) pct += 3;
    else if (conversao >= 60) pct += 2;
    else if (conversao >= 50) pct += 1;

    pct = Math.min(pct, 20); // máximo 20%

    const bonus1 = totalVendas >= 120000 ? 5 : totalVendas >= 100000 ? 4 : totalVendas >= 80000 ? 3 : totalVendas >= 60000 ? 2 : totalVendas >= 40000 ? 1 : 0;
    const bonus2 = conversao >= 90 ? 5 : conversao >= 80 ? 4 : conversao >= 70 ? 3 : conversao >= 60 ? 2 : conversao >= 50 ? 1 : 0;

    return {
      pct, totalVendas, conversao: conversao.toFixed(1),
      valorComissao: totalVendas * pct / 100,
      bonus1, bonus2,
      proximaFaixaVenda: totalVendas < 40000 ? 40000 : totalVendas < 60000 ? 60000 : totalVendas < 80000 ? 80000 : totalVendas < 100000 ? 100000 : totalVendas < 120000 ? 120000 : null,
      proximaFaixaConv: conversao < 50 ? 50 : conversao < 60 ? 60 : conversao < 70 ? 70 : conversao < 80 ? 80 : conversao < 90 ? 90 : null,
    };
  }, [visitas]);

  const navTo = (v) => { setView(v); setMenuOpen(false); };

  const Field = ({label,value,color}) => (
    <div style={{padding:"8px 0",borderBottom:"1px solid #1e1e28"}}>
      <div style={{fontFamily:"'Segoe UI',sans-serif",fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:3}}>{label}</div>
      <div style={{fontFamily:"'Segoe UI',sans-serif",fontSize:13,color:color||"#ccc"}}>{value||<span style={{color:"#444"}}>—</span>}</div>
    </div>
  );

  if (loading) return (
    <div style={{background:"#0a0a0f",height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif",color:"#c9a84c",fontSize:16}}>
      Carregando... ⏳
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",color:"#e8e4dc",fontFamily:"'Segoe UI',sans-serif"}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        .btn{cursor:pointer;border:none;border-radius:8px;font-family:'Segoe UI',sans-serif;font-size:14px;font-weight:500;transition:all .18s}
        .bp{background:#c9a84c;color:#0a0a0f;padding:10px 20px}.bp:hover{background:#e0bf6a}.bp:disabled{opacity:.5;cursor:not-allowed}
        .bg{background:transparent;color:#888;padding:9px 16px;border:1px solid #2a2a35}.bg:hover{background:#1e1e2a;color:#e8e4dc}
        .bd{background:transparent;color:#ef4444;padding:9px 16px;border:1px solid #ef444440}.bd:hover{background:#ef444415}
        .inp{background:#15151f;border:1px solid #2a2a38;border-radius:8px;color:#e8e4dc;padding:11px 14px;font-family:'Segoe UI',sans-serif;font-size:14px;width:100%;outline:none;transition:border .2s}
        .inp:focus{border-color:#c9a84c}.inp::placeholder{color:#444}
        textarea.inp{min-height:100px;resize:vertical} select.inp{cursor:pointer}
        .card{background:#12121a;border:1px solid #22222e;border-radius:12px}
        .sc{background:#12121a;border:1px solid #22222e;border-radius:12px;padding:16px;position:relative;overflow:hidden}
        .sc::before{content:'';position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#c9a84c,#e0bf6a)}
        .tag{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:500}
        .sb{cursor:pointer;border:1px solid #2a2a35;border-radius:8px;padding:8px 14px;font-family:'Segoe UI',sans-serif;font-size:12px;background:transparent;transition:all .15s;white-space:nowrap}
        .sb:hover{transform:translateY(-1px)}
        ::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0a0a0f}::-webkit-scrollbar-thumb{background:#2a2a3a;border-radius:2px}

        /* TOPBAR mobile */
        .topbar{display:none;position:fixed;top:0;left:0;right:0;z-index:100;background:#080810;border-bottom:1px solid #1a1a24;padding:14px 16px;align-items:center;justify-content:space-between}
        .bottomnav{display:none}
        .overlay{display:none;position:fixed;inset:0;background:#00000080;z-index:150}
        .drawer{position:fixed;left:0;top:0;bottom:0;width:240px;background:#080810;border-right:1px solid #1a1a24;z-index:200;transform:translateX(-100%);transition:transform .25s;padding:20px 12px;display:flex;flex-direction:column;gap:4px}
        .drawer.open{transform:translateX(0)}
        .nav{cursor:pointer;padding:11px 14px;border-radius:8px;font-size:14px;transition:all .18s;color:#777;display:flex;align-items:center;gap:10px}
        .nav:hover{background:#1a1a25;color:#e8e4dc}.nav.on{background:#c9a84c15;color:#c9a84c;border-left:2px solid #c9a84c}

        /* SIDEBAR desktop */
        .sidebar{width:210px;background:#080810;border-right:1px solid #1a1a24;padding:20px 10px;display:flex;flex-direction:column;gap:3px;flex-shrink:0;position:fixed;left:0;top:0;bottom:0;overflow-y:auto}
        .main-content{margin-left:210px;padding:26px 32px;min-height:100vh;max-width:100%;width:calc(100vw - 210px)}

        .hamburger{background:none;border:none;color:#c9a84c;font-size:22px;cursor:pointer;padding:2px 6px}
        @media(max-width:768px){
          .sidebar{display:none}
          .topbar{display:flex}
          .bottomnav{display:flex;position:fixed;bottom:0;left:0;right:0;background:#080810;border-top:1px solid #1a1a24;z-index:100;padding:6px 0}
          .overlay{display:block}
          .main-content{margin-left:0;width:100vw;padding:80px 16px 100px}
          .bnav{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;padding:6px;cursor:pointer;color:#555;font-size:10px;border:none;background:none;transition:color .18s}
          .bnav.on{color:#c9a84c}
          .bnav span{font-size:20px}
          .grid-2col{grid-template-columns:1fr!important}
          .grid-4col{grid-template-columns:1fr 1fr!important}
          .graficos-grid{grid-template-columns:1fr!important}
          .hide-mobile{display:none!important}
        }
      `}</style>

      {/* TOPBAR mobile */}
      <div className="topbar">
        <div style={{fontFamily:"Georgia,serif",fontSize:17,color:"#c9a84c",fontWeight:700}}>Persianas CRM</div>
        <button className="hamburger" onClick={()=>setMenuOpen(!menuOpen)}>☰</button>
      </div>

      {/* OVERLAY + DRAWER mobile */}
      {menuOpen && <div className="overlay" onClick={()=>setMenuOpen(false)}/>}
      <div className={`drawer ${menuOpen?"open":""}`}>
        <div style={{fontFamily:"Georgia,serif",fontSize:17,color:"#c9a84c",fontWeight:700,padding:"4px 8px 16px",borderBottom:"1px solid #1a1a24",marginBottom:8}}>Persianas CRM</div>
        <div className={`nav ${view==="dashboard"?"on":""}`} onClick={()=>navTo("dashboard")}>▦ Dashboard</div>
        <div className={`nav ${view==="lista"||view==="detalhe"?"on":""}`} onClick={()=>navTo("lista")}>📋 Visitas</div>
        <div className={`nav ${view==="clientes"||view==="detalhe-cliente"?"on":""}`} onClick={()=>navTo("clientes")}>👥 Clientes</div>
        <div className={`nav ${view==="comissao"?"on":""}`} onClick={()=>navTo("comissao")}>💰 Comissão</div>
        <div className={`nav ${view==="importar"?"on":""}`} onClick={()=>navTo("importar")}>✉ Importar E-mail</div>
        <div style={{flex:1}}/>
        <button className="btn bp" style={{width:"100%",padding:12,marginTop:16}} onClick={()=>navTo("novo")}>+ Nova Visita</button>
        <div style={{marginTop:14,padding:"12px 8px",borderTop:"1px solid #1a1a24"}}>
          <div style={{fontSize:10,color:"#444"}}>RECEITA DO MÊS</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:15,color:"#10b981",marginTop:4}}>{fmt(stats.receita)}</div>
          <div style={{fontSize:10,color:"#444",marginTop:6}}>META</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:13,color:"#c9a84c",marginTop:3}}>{fmt(META_MENSAL)}</div>
        </div>
      </div>

      {/* SIDEBAR desktop */}
      <div className="sidebar">
        <div style={{padding:"4px 8px 20px",borderBottom:"1px solid #1a1a24",marginBottom:8}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#c9a84c",fontWeight:700}}>Persianas</div>
          <div style={{fontSize:10,color:"#444",letterSpacing:"2px",textTransform:"uppercase"}}>CRM · Felipe P.</div>
        </div>
        <div className={`nav ${view==="dashboard"?"on":""}`} onClick={()=>setView("dashboard")}>▦ Dashboard</div>
        <div className={`nav ${view==="lista"||view==="detalhe"?"on":""}`} onClick={()=>setView("lista")}>📋 Visitas</div>
        <div className={`nav ${view==="clientes"||view==="detalhe-cliente"?"on":""}`} onClick={()=>setView("clientes")}>👥 Clientes</div>
        <div className={`nav ${view==="comissao"?"on":""}`} onClick={()=>setView("comissao")}>💰 Comissão</div>
        <div className={`nav ${view==="importar"?"on":""}`} onClick={()=>{setImportStep("colar");setEmailTexto("");setView("importar")}}>✉ Importar E-mail</div>
        <div style={{flex:1}}/>
        <button className="btn bp" style={{width:"100%",padding:11}} onClick={()=>{setForm({...empty});setView("novo")}}>+ Nova Visita</button>
        <div style={{marginTop:14,padding:"12px 8px",borderTop:"1px solid #1a1a24"}}>
          <div style={{fontSize:10,color:"#444"}}>RECEITA DO MÊS</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:16,color:"#10b981",marginTop:4}}>{fmt(stats.receita)}</div>
          <div style={{fontSize:10,color:"#444",marginTop:8}}>META</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#c9a84c",marginTop:4}}>{fmt(META_MENSAL)}</div>
        </div>
      </div>

      {/* BOTTOM NAV mobile */}
      <div className="bottomnav">
        {[{icon:"▦",label:"Dashboard",v:"dashboard"},{icon:"📋",label:"Visitas",v:"lista"},{icon:"👥",label:"Clientes",v:"clientes"},{icon:"💰",label:"Comissão",v:"comissao"},{icon:"＋",label:"Nova",v:"novo"}].map(b=>(
          <button key={b.v} className={`bnav ${view===b.v?"on":""}`} onClick={()=>{if(b.v==="novo"){setForm({...empty});setView("novo")}else{setView(b.v)}}}>
            <span>{b.icon}</span>{b.label}
          </button>
        ))}
      </div>

      {/* MAIN */}
      <div className="main-content">

        {/* DASHBOARD */}
        {view==="dashboard" && (
          <div>
            <div style={{fontFamily:"Georgia,serif",fontSize:22,marginBottom:3}}>Bom dia, Felipe! 👋</div>
            <div style={{fontSize:12,color:"#555",marginBottom:20}}>{hoje}</div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:16}} className="grid-4col">
              {[
                {label:"Visitas Hoje",value:stats.hoje,color:"#3b82f6"},
                {label:"Pendentes",value:stats.pendentes,color:"#8b5cf6"},
                {label:"Conversão",value:`${stats.conversao}%`,color:"#c9a84c"},
                {label:"Receita",value:fmt(stats.receita),color:"#10b981"},
              ].map((st,i)=>(
                <div key={i} className="sc">
                  <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>{st.label}</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:i===3?16:22,color:st.color}}>{st.value}</div>
                </div>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"2fr 2fr 180px",gap:14,marginBottom:16}} className="graficos-grid">
              <div className="card" style={{padding:16}}><GraficoLinha visitas={visitas}/></div>
              <div className="card" style={{padding:16}}><Funil visitas={visitas}/></div>
              <div className="card" style={{padding:16,display:"flex",alignItems:"center",justifyContent:"center"}}><MedidorMeta receita={stats.receita}/></div>
            </div>

            <div style={{fontFamily:"Georgia,serif",fontSize:16,marginBottom:10}}>📅 Agendadas</div>
            <div className="card" style={{marginBottom:16}}>
              {visitas.filter(v=>v.status==="agendado").length===0&&<div style={{padding:24,textAlign:"center",fontSize:13,color:"#444"}}>Nenhuma visita agendada</div>}
              {visitas.filter(v=>v.status==="agendado").map(v=>(
                <div key={v.id} style={{padding:"12px 16px",borderBottom:"1px solid #1a1a24",cursor:"pointer"}} onClick={()=>{setSelected(v);setView("detalhe")}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:600}}>{v.cliente}</div>
                      <div style={{fontSize:11,color:"#555",marginTop:2}}>{v.dataVisita} às {v.horaVisita} · {v.ambiente}</div>
                    </div>
                    <span className="tag" style={{background:STATUS[v.status]?.bg,color:STATUS[v.status]?.color}}>{STATUS[v.status]?.icon}</span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{fontFamily:"Georgia,serif",fontSize:16,marginBottom:10}}>📋 Orçamentos Pendentes</div>
            <div className="card">
              {visitas.filter(v=>v.status==="orcamento_enviado").length===0&&<div style={{padding:24,textAlign:"center",fontSize:13,color:"#444"}}>Nenhum pendente</div>}
              {visitas.filter(v=>v.status==="orcamento_enviado").map(v=>(
                <div key={v.id} style={{padding:"12px 16px",borderBottom:"1px solid #1a1a24",cursor:"pointer"}} onClick={()=>{setSelected(v);setView("detalhe")}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:600}}>{v.cliente}</div>
                      <div style={{fontSize:11,color:"#555",marginTop:2}}>{v.produtos}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontSize:13,color:"#10b981",fontWeight:600}}>{fmt(valorFinal(v))}</div>
                      <div style={{fontSize:11,color:"#ef4444"}}>-{v.desconto||0}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* LISTA */}
        {view==="lista" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <div style={{fontFamily:"Georgia,serif",fontSize:22,marginBottom:2}}>Visitas</div>
                <div style={{fontSize:12,color:"#555"}}>{filtradas.length} registros</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button className="btn bg hide-mobile" style={{color:"#818cf8",borderColor:"#6366f140"}} onClick={()=>{setImportStep("colar");setEmailTexto("");setView("importar")}}>✉</button>
                <button className="btn bp" onClick={()=>{setForm({...empty});setView("novo")}}>+ Nova</button>
              </div>
            </div>
            <div style={{display:"flex",gap:8,marginBottom:14}}>
              <input className="inp" placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)} style={{flex:1}}/>
              <select className="inp" value={filtro} onChange={e=>setFiltro(e.target.value)} style={{maxWidth:140}}>
                <option value="todos">Todos</option>
                {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
            </div>
            <div className="card">
              {filtradas.length===0&&<div style={{padding:36,textAlign:"center",color:"#444"}}>Nenhum registro</div>}
              {filtradas.map(v=>(
                <div key={v.id} style={{padding:"13px 16px",borderBottom:"1px solid #1a1a24",cursor:"pointer"}} onClick={()=>{setSelected(v);setView("detalhe")}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:14,fontWeight:600}}>{v.cliente}</div>
                      <div style={{fontSize:11,color:"#555",marginTop:2}}>{v.telefone} · {v.dataVisita}</div>
                    </div>
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0,marginLeft:10}}>
                      <span className="tag" style={{background:STATUS[v.status]?.bg,color:STATUS[v.status]?.color}}>{STATUS[v.status]?.icon} {STATUS[v.status]?.label}</span>
                      {v.valorOrcamento&&<div style={{fontSize:12,color:"#10b981",fontWeight:600}}>{fmt(valorFinal(v))}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* DETALHE */}
        {view==="detalhe" && selected && (
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <button className="btn bg" onClick={()=>setView("lista")}>←</button>
              <div style={{flex:1}}>
                <div style={{fontFamily:"Georgia,serif",fontSize:20}}>{selected.cliente}</div>
                <div style={{fontSize:11,color:"#555"}}>{selected.telefone} · {selected.dataCriacao}</div>
              </div>
              <button className="btn bg" onClick={()=>{setForm({...selected});setView("novo")}}>✎</button>
              <button className="btn bd" onClick={()=>excluir(selected.id)}>✕</button>
            </div>

            <div className="card" style={{padding:14,marginBottom:14}}>
              <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}>Status</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {Object.entries(STATUS).map(([k,v])=>(
                  <button key={k} className="sb" onClick={()=>mudarStatus(k)} style={{color:v.color,borderColor:selected.status===k?v.color:"#2a2a35",background:selected.status===k?v.bg:"transparent",fontWeight:selected.status===k?700:400}}>
                    {v.icon} {v.label}
                  </button>
                ))}
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}} className="grid-2col">
              <div className="card" style={{padding:16}}>
                <div style={{fontSize:10,color:"#3b82f6",textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}>📅 Visita</div>
                <Field label="Data/Hora" value={`${selected.dataVisita} às ${selected.horaVisita}`}/>
                <Field label="Endereço" value={selected.endereco}/>
                <Field label="Telefone" value={selected.telefone} color="#c9a84c"/>
                <Field label="OP_ID" value={selected.opId}/>
              </div>
              <div className="card" style={{padding:16}}>
                <div style={{fontSize:10,color:"#10b981",textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}>💰 Orçamento</div>
                <Field label="Valor" value={selected.valorOrcamento?fmt(selected.valorOrcamento):null} color="#c9a84c"/>
                <Field label="Desconto" value={selected.desconto?`${selected.desconto}%`:null} color="#ef4444"/>
                <Field label="Valor Final" value={selected.valorOrcamento?fmt(valorFinal(selected)):null} color="#10b981"/>
                <Field label="Instalação" value={selected.dataInstalacao} color="#8b5cf6"/>
              </div>
              <div className="card" style={{padding:16}}>
                <div style={{fontSize:10,color:"#f59e0b",textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}>🏠 Contexto</div>
                <Field label="Ambiente" value={selected.ambiente}/>
                <Field label="Motivo" value={selected.motivoCompra}/>
                <Field label="Urgência" value={selected.urgencia}/>
                <Field label="Produtos" value={selected.produtos}/>
                <Field label="Medidas" value={selected.medidas}/>
              </div>
              <div className="card" style={{padding:16}}>
                <div style={{fontSize:10,color:"#8b5cf6",textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}>📝 Anotações</div>
                <div style={{display:"flex",gap:8,marginBottom:12}}>
                  <input className="inp" placeholder="Anotação (Enter)..." value={nota} onChange={e=>setNota(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addNota()}/>
                  <button className="btn bp" onClick={addNota} style={{padding:"10px 14px",flexShrink:0}}>+</button>
                </div>
                <div style={{maxHeight:200,overflow:"auto"}}>
                  {(selected.historico||[]).length===0&&<div style={{fontSize:13,color:"#444"}}>Sem anotações.</div>}
                  {(selected.historico||[]).map((h,i)=>(
                    <div key={i} style={{padding:"7px 0",borderBottom:"1px solid #1a1a24"}}>
                      <div style={{fontSize:10,color:"#c9a84c",marginBottom:2}}>{h.data}</div>
                      <div style={{fontSize:13,color:"#bbb"}}>{h.texto}</div>
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
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
              <button className="btn bg" onClick={()=>setView("dashboard")}>←</button>
              <div>
                <div style={{fontFamily:"Georgia,serif",fontSize:20}}>✉ Importar E-mail</div>
                <div style={{fontSize:12,color:"#555"}}>Cole o e-mail para extrair os dados</div>
              </div>
            </div>
            {importStep==="colar"&&(
              <div className="card" style={{padding:20}}>
                <textarea className="inp" style={{minHeight:200}} placeholder={"Cole aqui o e-mail...\n\nExemplo:\nOlá, Felipe P,\nData: 16/03/2026\nHorário: 13:00\nEndereço: Rua..."} value={emailTexto} onChange={e=>setEmailTexto(e.target.value)}/>
                <div style={{display:"flex",gap:10,marginTop:14,flexWrap:"wrap"}}>
                  <button className="btn bp" onClick={()=>{if(!emailTexto.trim())return;setForm({...empty,...extrairEmail(emailTexto)});setImportStep("revisar")}} disabled={!emailTexto.trim()}>✨ Extrair Dados</button>
                  <button className="btn bg" onClick={()=>{setForm({...empty});setView("novo")}}>Manual</button>
                </div>
              </div>
            )}
            {importStep==="revisar"&&(
              <div className="card" style={{padding:18,borderColor:"#3b82f640"}}>
                <div style={{fontSize:11,color:"#3b82f6",textTransform:"uppercase",letterSpacing:"1px",marginBottom:14}}>✓ Revise os dados</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}} className="grid-2col">
                  {[{label:"Nome *",k:"cliente"},{label:"Telefone",k:"telefone"},{label:"Data",k:"dataVisita",ph:"DD/MM/AAAA"},{label:"Horário",k:"horaVisita",ph:"HH:MM"}].map(f=>(
                    <div key={f.k} style={{marginBottom:10}}>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>{f.label}</label>
                      <input className="inp" placeholder={f.ph||""} value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}/>
                    </div>
                  ))}
                  <div style={{marginBottom:10,gridColumn:"span 2"}}>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Endereço</label>
                    <input className="inp" value={form.endereco} onChange={e=>setForm({...form,endereco:e.target.value})}/>
                  </div>
                  <div style={{marginBottom:10}}>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Ambiente</label>
                    <input className="inp" value={form.ambiente} onChange={e=>setForm({...form,ambiente:e.target.value})}/>
                  </div>
                  <div style={{marginBottom:10}}>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Motivo</label>
                    <input className="inp" value={form.motivoCompra} onChange={e=>setForm({...form,motivoCompra:e.target.value})}/>
                  </div>
                </div>
                <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                  <button className="btn bp" onClick={salvar} disabled={!form.cliente||saving}>{saving?"Salvando...":"✓ Salvar"}</button>
                  <button className="btn bg" onClick={()=>setImportStep("colar")}>← Voltar</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* COMISSÃO */}
        {view==="comissao" && (
          <div>
            <div style={{fontFamily:"Georgia,serif",fontSize:22,marginBottom:4}}>💰 Minha Comissão</div>
            <div style={{fontSize:12,color:"#555",marginBottom:24}}>Cálculo automático baseado nas vendas de {hoje.slice(3)}</div>

            {/* Card principal */}
            <div style={{background:"linear-gradient(135deg,#1a1a10,#12120a)",border:"1px solid #c9a84c40",borderRadius:16,padding:28,marginBottom:20,position:"relative",overflow:"hidden"}}>
              <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:"linear-gradient(90deg,#c9a84c,#f0d070)"}}/>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:20}} className="grid-4col">
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:11,color:"#888",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>Taxa de Comissão</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:48,color:"#c9a84c",lineHeight:1}}>{comissao.pct}%</div>
                  <div style={{fontSize:11,color:"#555",marginTop:6}}>base 10% + {comissao.bonus1+comissao.bonus2}% bônus</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:11,color:"#888",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>Valor da Comissão</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:32,color:"#10b981",lineHeight:1}}>{fmt(comissao.valorComissao)}</div>
                  <div style={{fontSize:11,color:"#555",marginTop:6}}>sobre {fmt(comissao.totalVendas)} vendidos</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:11,color:"#888",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>Conversão</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:40,color:"#8b5cf6",lineHeight:1}}>{comissao.conversao}%</div>
                  <div style={{fontSize:11,color:"#555",marginTop:6}}>{visitas.filter(v=>v.status==="fechado").length} de {visitas.length} fechados</div>
                </div>
              </div>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}} className="grid-2col">
              {/* Premissa 1 */}
              <div className="card" style={{padding:20}}>
                <div style={{fontSize:11,color:"#c9a84c",textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>📊 Premissa 1 — Volume de Vendas</div>
                <div style={{fontSize:12,color:"#555",marginBottom:16}}>Bônus atual: <span style={{color:"#c9a84c",fontWeight:600}}>+{comissao.bonus1}%</span></div>
                {[
                  {label:"R$ 40k – R$ 60k",bonus:"+1%",min:40000,max:60000},
                  {label:"R$ 60k – R$ 80k",bonus:"+2%",min:60000,max:80000},
                  {label:"R$ 80k – R$ 100k",bonus:"+3%",min:80000,max:100000},
                  {label:"R$ 100k – R$ 120k",bonus:"+4%",min:100000,max:120000},
                  {label:"R$ 120k ou mais",bonus:"+5%",min:120000,max:Infinity},
                ].map((f,i)=>{
                  const ativa = comissao.totalVendas >= f.min && (f.max===Infinity || comissao.totalVendas < f.max);
                  const passou = comissao.totalVendas >= f.max;
                  const pct = f.max===Infinity ? Math.min(comissao.totalVendas/f.min*100,100) : Math.min(Math.max((comissao.totalVendas-f.min)/(f.max-f.min)*100,0),100);
                  return (
                    <div key={i} style={{marginBottom:10,padding:"10px 12px",borderRadius:8,background:ativa?"#c9a84c10":passou?"#10b98108":"#0d0d15",border:`1px solid ${ativa?"#c9a84c40":passou?"#10b98130":"#1e1e28"}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                        <span style={{fontSize:12,color:passou?"#10b981":ativa?"#c9a84c":"#666"}}>{f.label}</span>
                        <span style={{fontSize:12,fontWeight:700,color:passou?"#10b981":ativa?"#c9a84c":"#555"}}>{f.bonus} {passou?"✓":ativa?"← você está aqui":""}</span>
                      </div>
                      {ativa && <div style={{background:"#1a1a24",borderRadius:4,height:5}}><div style={{width:`${pct}%`,height:"100%",background:"#c9a84c",borderRadius:4}}/></div>}
                    </div>
                  );
                })}
                {comissao.proximaFaixaVenda && (
                  <div style={{marginTop:12,padding:"10px 12px",background:"#3b82f608",border:"1px solid #3b82f630",borderRadius:8,fontSize:11,color:"#3b82f6"}}>
                    💡 Faltam {fmt(comissao.proximaFaixaVenda - comissao.totalVendas)} para o próximo bônus
                  </div>
                )}
              </div>

              {/* Premissa 2 */}
              <div className="card" style={{padding:20}}>
                <div style={{fontSize:11,color:"#8b5cf6",textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>🎯 Premissa 2 — Taxa de Conversão</div>
                <div style={{fontSize:12,color:"#555",marginBottom:16}}>Bônus atual: <span style={{color:"#8b5cf6",fontWeight:600}}>+{comissao.bonus2}%</span></div>
                {[
                  {label:"Acima de 50%",bonus:"+1%",min:50,max:60},
                  {label:"Acima de 60%",bonus:"+2%",min:60,max:70},
                  {label:"Acima de 70%",bonus:"+3%",min:70,max:80},
                  {label:"Acima de 80%",bonus:"+4%",min:80,max:90},
                  {label:"Acima de 90%",bonus:"+5%",min:90,max:Infinity},
                ].map((f,i)=>{
                  const conv = parseFloat(comissao.conversao);
                  const ativa = conv >= f.min && (f.max===Infinity || conv < f.max);
                  const passou = conv >= f.max;
                  const pct = f.max===Infinity ? Math.min(conv/f.min*100,100) : Math.min(Math.max((conv-f.min)/(f.max-f.min)*100,0),100);
                  return (
                    <div key={i} style={{marginBottom:10,padding:"10px 12px",borderRadius:8,background:ativa?"#8b5cf610":passou?"#10b98108":"#0d0d15",border:`1px solid ${ativa?"#8b5cf640":passou?"#10b98130":"#1e1e28"}`}}>
                      <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                        <span style={{fontSize:12,color:passou?"#10b981":ativa?"#8b5cf6":"#666"}}>{f.label}</span>
                        <span style={{fontSize:12,fontWeight:700,color:passou?"#10b981":ativa?"#8b5cf6":"#555"}}>{f.bonus} {passou?"✓":ativa?"← você está aqui":""}</span>
                      </div>
                      {ativa && <div style={{background:"#1a1a24",borderRadius:4,height:5}}><div style={{width:`${pct}%`,height:"100%",background:"#8b5cf6",borderRadius:4}}/></div>}
                    </div>
                  );
                })}
                {comissao.proximaFaixaConv && (
                  <div style={{marginTop:12,padding:"10px 12px",background:"#3b82f608",border:"1px solid #3b82f630",borderRadius:8,fontSize:11,color:"#3b82f6"}}>
                    💡 Faltam {(comissao.proximaFaixaConv - parseFloat(comissao.conversao)).toFixed(1)}% de conversão para o próximo bônus
                  </div>
                )}
              </div>
            </div>

            {/* Resumo */}
            <div className="card" style={{padding:20}}>
              <div style={{fontSize:11,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:14}}>📋 Resumo do Cálculo</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {[
                  {label:"Comissão base",valor:"10%",color:"#888"},
                  {label:`Bônus vendas (${fmt(comissao.totalVendas)})`,valor:`+${comissao.bonus1}%`,color:"#c9a84c"},
                  {label:`Bônus conversão (${comissao.conversao}%)`,valor:`+${comissao.bonus2}%`,color:"#8b5cf6"},
                ].map((r,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:"1px solid #1a1a24"}}>
                    <span style={{fontSize:13,color:"#aaa"}}>{r.label}</span>
                    <span style={{fontSize:13,fontWeight:600,color:r.color}}>{r.valor}</span>
                  </div>
                ))}
                <div style={{display:"flex",justifyContent:"space-between",padding:"12px 0",marginTop:4}}>
                  <span style={{fontSize:15,fontWeight:700,color:"#e8e4dc"}}>Total</span>
                  <span style={{fontFamily:"Georgia,serif",fontSize:20,color:"#c9a84c",fontWeight:700}}>{comissao.pct}% = {fmt(comissao.valorComissao)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CLIENTES - LISTA */}
        {view==="clientes" && (
          <div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div>
                <div style={{fontFamily:"Georgia,serif",fontSize:22,marginBottom:2}}>👥 Clientes</div>
                <div style={{fontSize:12,color:"#555"}}>{clientesFiltrados.length} cadastrados</div>
              </div>
              <button className="btn bp" onClick={()=>{setFormCliente({...emptyCliente});setView("novo-cliente")}}>+ Novo Cliente</button>
            </div>
            <input className="inp" placeholder="Buscar por nome ou telefone..." value={searchCliente} onChange={e=>setSearchCliente(e.target.value)} style={{marginBottom:14}}/>
            <div className="card">
              {clientesFiltrados.length===0 && <div style={{padding:36,textAlign:"center",color:"#444",fontSize:13}}>Nenhum cliente cadastrado</div>}
              {clientesFiltrados.map(c=>(
                <div key={c.id} style={{padding:"13px 16px",borderBottom:"1px solid #1a1a24",cursor:"pointer"}} onClick={()=>{setSelectedCliente(c);setView("detalhe-cliente")}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:14,fontWeight:600}}>{c.nome}</div>
                      <div style={{fontSize:11,color:"#555",marginTop:2}}>{c.telefone}{c.cidade?` · ${c.cidade}`:""}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      {c.origem && <span style={{fontSize:11,color:"#c9a84c",background:"#c9a84c15",padding:"3px 10px",borderRadius:20}}>{c.origem}</span>}
                      <div style={{fontSize:11,color:"#444",marginTop:4}}>{c.email}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CLIENTES - DETALHE */}
        {view==="detalhe-cliente" && selectedCliente && (
          <div style={{maxWidth:700}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20}}>
              <button className="btn bg" onClick={()=>setView("clientes")}>←</button>
              <div style={{flex:1}}>
                <div style={{fontFamily:"Georgia,serif",fontSize:20}}>{selectedCliente.nome}</div>
                <div style={{fontSize:11,color:"#555"}}>{selectedCliente.telefone}</div>
              </div>
              <button className="btn bg" onClick={()=>{setFormCliente({...selectedCliente});setView("novo-cliente")}}>✎ Editar</button>
              <button className="btn bd" onClick={()=>excluirCliente(selectedCliente.id)}>✕</button>
            </div>
            <div className="card" style={{padding:20,marginBottom:14}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}} className="grid-2col">
                {[
                  {label:"Nome",value:selectedCliente.nome},
                  {label:"Telefone",value:selectedCliente.telefone,color:"#c9a84c"},
                  {label:"E-mail",value:selectedCliente.email},
                  {label:"Origem",value:selectedCliente.origem,color:"#8b5cf6"},
                  {label:"Endereço",value:selectedCliente.endereco},
                  {label:"Bairro",value:selectedCliente.bairro},
                  {label:"Cidade",value:selectedCliente.cidade},
                ].map((f,i)=>(
                  <div key={i} style={{padding:"8px 0",borderBottom:"1px solid #1e1e28"}}>
                    <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:3}}>{f.label}</div>
                    <div style={{fontSize:13,color:f.color||"#ccc"}}>{f.value||<span style={{color:"#444"}}>—</span>}</div>
                  </div>
                ))}
              </div>
              {selectedCliente.observacoes && (
                <div style={{marginTop:16,padding:"12px",background:"#1a1a24",borderRadius:8}}>
                  <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>Observações</div>
                  <div style={{fontSize:13,color:"#bbb"}}>{selectedCliente.observacoes}</div>
                </div>
              )}
            </div>
            <button className="btn bp" style={{width:"100%",padding:12}} onClick={()=>{setForm({...empty,cliente:selectedCliente.nome,telefone:selectedCliente.telefone,email:selectedCliente.email,endereco:selectedCliente.endereco});setView("novo")}}>
              + Criar Visita para este Cliente
            </button>
          </div>
        )}

        {/* CLIENTES - FORMULÁRIO */}
        {view==="novo-cliente" && (
          <div style={{maxWidth:700}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
              <button className="btn bg" onClick={()=>setView(formCliente.id?"detalhe-cliente":"clientes")}>←</button>
              <div style={{fontFamily:"Georgia,serif",fontSize:20}}>{formCliente.id?"Editar Cliente":"Novo Cliente"}</div>
            </div>
            <div className="card" style={{padding:22}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}} className="grid-2col">
                {[
                  {label:"Nome *",k:"nome",col:2},
                  {label:"Telefone",k:"telefone",col:1},
                  {label:"E-mail",k:"email",col:1},
                ].map(f=>(
                  <div key={f.k} style={{marginBottom:12,gridColumn:`span ${f.col}`}}>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>{f.label}</label>
                    <input className="inp" value={formCliente[f.k]} onChange={e=>setFormCliente({...formCliente,[f.k]:e.target.value})}/>
                  </div>
                ))}

                {/* CEP com busca automática */}
                <div style={{marginBottom:12,gridColumn:"span 1"}}>
                  <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>CEP</label>
                  <div style={{display:"flex",gap:8}}>
                    <input
                      className="inp"
                      placeholder="00000-000"
                      value={formCliente.cep||""}
                      onChange={e=>setFormCliente({...formCliente,cep:e.target.value})}
                      onBlur={async e=>{
                        const cep=e.target.value.replace(/\D/g,"");
                        if(cep.length!==8) return;
                        try{
                          const r=await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                          const d=await r.json();
                          if(!d.erro) setFormCliente(f=>({...f,endereco:d.logradouro,bairro:d.bairro,cidade:d.localidade,cep:e.target.value}));
                        }catch(e){console.error(e);}
                      }}
                    />
                  </div>
                  <div style={{fontSize:10,color:"#444",marginTop:4}}>Digite e saia do campo para preencher automaticamente</div>
                </div>

                <div style={{marginBottom:12,gridColumn:"span 1"}}/>

                {[
                  {label:"Endereço",k:"endereco",col:2},
                  {label:"Bairro",k:"bairro",col:1},
                  {label:"Cidade",k:"cidade",col:1},
                ].map(f=>(
                  <div key={f.k} style={{marginBottom:12,gridColumn:`span ${f.col}`}}>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>{f.label}</label>
                    <input className="inp" value={formCliente[f.k]||""} onChange={e=>setFormCliente({...formCliente,[f.k]:e.target.value})}/>
                  </div>
                ))}

                <div style={{marginBottom:12,gridColumn:"span 2"}}>
                  <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Origem do Lead</label>
                  <select className="inp" value={formCliente.origem} onChange={e=>setFormCliente({...formCliente,origem:e.target.value})}>
                    <option value="">Selecionar...</option>
                    <option>Persianas em Casa</option>
                    <option>Indicação</option>
                    <option>Instagram</option>
                    <option>Google</option>
                    <option>WhatsApp</option>
                    <option>Outro</option>
                  </select>
                </div>
                <div style={{marginBottom:12,gridColumn:"span 2"}}>
                  <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Observações</label>
                  <textarea className="inp" value={formCliente.observacoes} onChange={e=>setFormCliente({...formCliente,observacoes:e.target.value})} style={{minHeight:80}}/>
                </div>
              </div>
              <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                <button className="btn bp" style={{padding:"12px 28px"}} onClick={salvarCliente} disabled={!formCliente.nome||saving}>{saving?"Salvando...":(formCliente.id?"Salvar":"Cadastrar")}</button>
                <button className="btn bg" onClick={()=>setView(formCliente.id?"detalhe-cliente":"clientes")}>Cancelar</button>
              </div>
            </div>
          </div>
        )}


        {view==="novo"&&(
          <div>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
              <button className="btn bg" onClick={()=>setView(form.id?"detalhe":"lista")}>←</button>
              <div style={{fontFamily:"Georgia,serif",fontSize:20}}>{form.id?"Editar":"Nova Visita"}</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}} className="grid-2col">
              <div className="card" style={{padding:18}}>
                <div style={{fontSize:10,color:"#3b82f6",textTransform:"uppercase",letterSpacing:"1px",marginBottom:14}}>📅 Dados da Visita</div>
                {[{label:"Nome *",k:"cliente"},{label:"Telefone",k:"telefone"},{label:"E-mail",k:"email"},{label:"Data",k:"dataVisita",ph:"DD/MM/AAAA"},{label:"Horário",k:"horaVisita",ph:"HH:MM"},{label:"OP_ID",k:"opId"},{label:"Endereço",k:"endereco"}].map(f=>(
                  <div key={f.k} style={{marginBottom:12}}>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>{f.label}</label>
                    <input className="inp" placeholder={f.ph||""} value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}/>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div className="card" style={{padding:18}}>
                  <div style={{fontSize:10,color:"#f59e0b",textTransform:"uppercase",letterSpacing:"1px",marginBottom:14}}>🏠 Contexto</div>
                  {[{label:"Ambiente(s)",k:"ambiente"},{label:"Motivo",k:"motivoCompra"},{label:"Urgência",k:"urgencia"},{label:"Produtos",k:"produtos"},{label:"Medidas",k:"medidas"}].map(f=>(
                    <div key={f.k} style={{marginBottom:12}}>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>{f.label}</label>
                      <input className="inp" value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}/>
                    </div>
                  ))}
                </div>
                <div className="card" style={{padding:18}}>
                  <div style={{fontSize:10,color:"#10b981",textTransform:"uppercase",letterSpacing:"1px",marginBottom:14}}>💰 Orçamento</div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Valor (R$)</label>
                      <input className="inp" type="number" value={form.valorOrcamento} onChange={e=>setForm({...form,valorOrcamento:e.target.value})}/>
                    </div>
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Desconto (%)</label>
                      <input className="inp" type="number" value={form.desconto} onChange={e=>setForm({...form,desconto:e.target.value})}/>
                    </div>
                  </div>
                  {form.valorOrcamento&&<div style={{background:"#10b98112",border:"1px solid #10b98130",borderRadius:8,padding:"10px 14px",marginBottom:12}}>
                    <div style={{fontSize:11,color:"#777"}}>Valor Final:</div>
                    <div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#10b981"}}>{fmt(Number(form.valorOrcamento)-(Number(form.valorOrcamento)*Number(form.desconto||0))/100)}</div>
                  </div>}
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Data de Instalação</label>
                    <input className="inp" placeholder="DD/MM/AAAA" value={form.dataInstalacao} onChange={e=>setForm({...form,dataInstalacao:e.target.value})}/>
                  </div>
                  <div>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Status</label>
                    <select className="inp" value={form.status} onChange={e=>setForm({...form,status:e.target.value})}>
                      {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <button className="btn bp" style={{padding:"12px 28px"}} onClick={salvar} disabled={saving}>{saving?"Salvando...":(form.id?"Salvar":"Cadastrar Visita")}</button>
              <button className="btn bg" onClick={()=>setView(form.id?"detalhe":"lista")}>Cancelar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
