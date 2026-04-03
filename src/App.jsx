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
      body: JSON.stringify({ cliente: v.cliente, telefone: v.telefone, endereco: v.endereco, email: v.email, data_visita: v.dataVisita, hora_visita: v.horaVisita, op_id: v.opId, ambiente: v.ambiente, motivo_compra: v.motivoCompra, urgencia: v.urgencia, produtos: v.produtos, medidas: v.medidas, observacoes: v.observacoes, valor_orcamento: v.valorOrcamento, desconto: v.desconto, data_instalacao: v.dataInstalacao, link_orcamento: v.linkOrcamento, status: v.status, historico: v.historico, data_criacao: v.dataCriacao })
    });
    return (await res.json())[0];
  },
  async update(id, v) {
    await fetch(`${SUPABASE_URL}/rest/v1/visitas?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ cliente: v.cliente, telefone: v.telefone, endereco: v.endereco, email: v.email, data_visita: v.dataVisita, hora_visita: v.horaVisita, op_id: v.opId, ambiente: v.ambiente, motivo_compra: v.motivoCompra, urgencia: v.urgencia, produtos: v.produtos, medidas: v.medidas, observacoes: v.observacoes, valor_orcamento: v.valorOrcamento, desconto: v.desconto, data_instalacao: v.dataInstalacao, link_orcamento: v.linkOrcamento, status: v.status, historico: v.historico, data_criacao: v.dataCriacao })
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
      body: JSON.stringify({ nome: c.nome, telefone: c.telefone, email: c.email, endereco: c.endereco, bairro: c.bairro, cidade: c.cidade, observacoes: c.observacoes, origem: c.origem, cpf: c.cpf, data_nascimento: c.dataNascimento, cep: c.cep })
    });
    return (await res.json())[0];
  },
  async update(id, c) {
    await fetch(`${SUPABASE_URL}/rest/v1/clientes?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ nome: c.nome, telefone: c.telefone, email: c.email, endereco: c.endereco, bairro: c.bairro, cidade: c.cidade, observacoes: c.observacoes, origem: c.origem, cpf: c.cpf, data_nascimento: c.dataNascimento, cep: c.cep })
    });
  },
  async delete(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/clientes?id=eq.${id}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
  }
};

const dbOcorrencias = {
  async get() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ocorrencias?order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return await res.json();
  },
  async insert(o) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ocorrencias`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ cliente: o.cliente, telefone: o.telefone, visita_id: o.visita_id, tipo: o.tipo, descricao: o.descricao, status_oc: o.status_oc, previsao: o.previsao, resolucao: o.resolucao, data_abertura: o.data_abertura })
    });
    return (await res.json())[0];
  },
  async update(id, o) {
    await fetch(`${SUPABASE_URL}/rest/v1/ocorrencias?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ cliente: o.cliente, telefone: o.telefone, visita_id: o.visita_id, tipo: o.tipo, descricao: o.descricao, status_oc: o.status_oc, previsao: o.previsao, resolucao: o.resolucao, data_abertura: o.data_abertura })
    });
  },
  async delete(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/ocorrencias?id=eq.${id}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
  }
};

const dbTickets = {
  async get() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/tickets?order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return (await res.json()).map(t => ({...t, dataAbertura: t.data_abertura, quemAbriu: t.quem_abriu}));
  },
  async insert(t) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/tickets`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ numero: t.numero, data_abertura: t.dataAbertura, tipo: t.tipo, descricao: t.descricao, status: t.status, quem_abriu: t.quemAbriu, observacoes: t.observacoes })
    });
    return (await res.json())[0];
  },
  async update(id, t) {
    await fetch(`${SUPABASE_URL}/rest/v1/tickets?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ numero: t.numero, data_abertura: t.dataAbertura, tipo: t.tipo, descricao: t.descricao, status: t.status, quem_abriu: t.quemAbriu, observacoes: t.observacoes })
    });
  },
  async delete(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/tickets?id=eq.${id}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
  }
};

const dbNotas = {
  async get() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/notas?order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return await res.json();
  },
  async insert(n) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/notas`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ titulo: n.titulo, texto: n.texto, categoria: n.categoria, fixada: n.fixada, data: n.data, cor: n.cor })
    });
    return (await res.json())[0];
  },
  async update(id, n) {
    await fetch(`${SUPABASE_URL}/rest/v1/notas?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ titulo: n.titulo, texto: n.texto, categoria: n.categoria, fixada: n.fixada, data: n.data, cor: n.cor })
    });
  },
  async delete(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/notas?id=eq.${id}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
  }
};

const dbPedidos = {
  async get() {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/pedidos_fabrica?order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    return (await res.json()).map(p => ({...p, numeroPedido: p.numero_pedido, dataEnvio: p.data_envio, statusFabrica: p.status_fabrica, previsaoEntrega: p.previsao_entrega, dataEntregaReal: p.data_entrega_real, valorPedido: p.valor_pedido}));
  },
  async insert(p) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/pedidos_fabrica`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=representation" },
      body: JSON.stringify({ numero_pedido: p.numeroPedido, data_envio: p.dataEnvio, produtos: p.produtos, status_fabrica: p.statusFabrica, previsao_entrega: p.previsaoEntrega, data_entrega_real: p.dataEntregaReal, observacoes: p.observacoes, cliente: p.cliente, visita_id: p.visita_id, valor_pedido: p.valorPedido||0 })
    });
    return (await res.json())[0];
  },
  async update(id, p) {
    await fetch(`${SUPABASE_URL}/rest/v1/pedidos_fabrica?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ numero_pedido: p.numeroPedido, data_envio: p.dataEnvio, produtos: p.produtos, status_fabrica: p.statusFabrica, previsao_entrega: p.previsaoEntrega, data_entrega_real: p.dataEntregaReal, observacoes: p.observacoes, cliente: p.cliente, visita_id: p.visita_id, valor_pedido: p.valorPedido||0 })
    });
  },
  async delete(id) {
    await fetch(`${SUPABASE_URL}/rest/v1/pedidos_fabrica?id=eq.${id}`, {
      method: "DELETE",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
  }
};

const emptyCliente = { nome:"", telefone:"", email:"", endereco:"", bairro:"", cidade:"", observacoes:"", origem:"", cpf:"", dataNascimento:"" };

const STATUS = {
  agendado: { label: "Agendado", color: "#3b82f6", bg: "#3b82f615", icon: "📅" },
  visitado: { label: "Visita Realizada", color: "#f59e0b", bg: "#f59e0b15", icon: "🏠" },
  orcamento_enviado: { label: "Orçamento Enviado", color: "#8b5cf6", bg: "#8b5cf615", icon: "📋" },
  fechado: { label: "Fechado ✓", color: "#10b981", bg: "#10b98115", icon: "✅" },
  perdido: { label: "Perdido", color: "#ef4444", bg: "#ef444415", icon: "❌" },
  reagendar: { label: "Reagendar", color: "#f97316", bg: "#f9731615", icon: "🔄" },
  cancelado: { label: "Cancelado", color: "#6b7280", bg: "#6b728015", icon: "🚫" },
};

const empty = { cliente:"", telefone:"", endereco:"", email:"", dataVisita:"", horaVisita:"", opId:"", ambiente:"", motivoCompra:"", urgencia:"", produtos:"", medidas:"", observacoes:"", valorOrcamento:"", desconto:"", dataInstalacao:"", linkOrcamento:"", status:"agendado", historico:[], dataCriacao: new Date().toLocaleDateString("pt-BR") };
const fmt = (v) => Number(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
// Conversores de data: DD/MM/AAAA <-> YYYY-MM-DD
const brToIso = (br) => { if(!br) return ""; const p=br.split("/"); return p.length===3?`${p[2]}-${p[1]}-${p[0]}`:""; };
const isoToBr = (iso) => { if(!iso) return ""; const p=iso.split("-"); return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:""; };
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
  const ativas = visitas.filter(v=>v.status!=="cancelado");
  const etapas = [
    {label:"Leads",key:null,color:"#3b82f6"},
    {label:"Visitado",key:"visitado",color:"#f59e0b"},
    {label:"Orçamento",key:"orcamento_enviado",color:"#8b5cf6"},
    {label:"Fechado",key:"fechado",color:"#10b981"},
  ];
  const counts = etapas.map(e => e.key===null ? ativas.length : ativas.filter(v=>v.status===e.key).length);
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

const auth = {
  async login(email, senha) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: senha })
    });
    return await res.json();
  },
  async logout(token) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` }
    });
  },
  async getUser(token) {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` }
    });
    return await res.json();
  }
};

export default function CRM() {
  const [sessao, setSessao] = useState(() => { try { return JSON.parse(localStorage.getItem("crm_sessao")||"null"); } catch{return null;} });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginSenha, setLoginSenha] = useState("");
  const [loginErro, setLoginErro] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [visitas, setVisitas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [view, setView] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [clienteInfo, setClienteInfo] = useState(null);
  const [form, setForm] = useState({...empty});
  const [formCliente, setFormCliente] = useState({...emptyCliente});
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [nota, setNota] = useState("");
  const [emailTexto, setEmailTexto] = useState("");
  const [importStep, setImportStep] = useState("colar");
  const [filtro, setFiltro] = useState("todos");
  const [search, setSearch] = useState("");
  const [searchCliente, setSearchCliente] = useState("");
  const [calMes, setCalMes] = useState(new Date().getMonth());
  const [calAno, setCalAno] = useState(new Date().getFullYear());
  const [diaSelected, setDiaSelected] = useState(null);
  const [showLembrete, setShowLembrete] = useState(false);
  const [ocorrencias, setOcorrencias] = useState([]);
  const [formOcorrencia, setFormOcorrencia] = useState(null);
  const emptyOc = { cliente:"", telefone:"", visita_id:"", tipo:"", descricao:"", status_oc:"aberto", previsao:"", resolucao:"", data_abertura: new Date().toLocaleDateString("pt-BR") };
  const [simValor, setSimValor] = useState("");
  const [simDesc, setSimDesc] = useState(0);
  const [checklist, setChecklist] = useState({trena:false,amostras:false,tablet:false,cartao:false,contrato:false,caneta:false,uniforme:false});

  // Mapa de usuários
  const USUARIOS = {
    "felipeeaugusto98@gmail.com": { nome: "Felipe", nomeCompleto: "Felipe Augusto de Oliveira Pereira", apelido: "Felipe P." },
    "rafaela.castro@crm.com.br": { nome: "Rafaela", nomeCompleto: "Rafaela Castro", apelido: "Rafaela C." },
  };
  const userInfo = USUARIOS[sessao?.email] || { nome: sessao?.email?.split("@")[0] || "Usuário", nomeCompleto: sessao?.email || "Usuário", apelido: sessao?.email?.split("@")[0] || "Usuário" };

  const emptyTicket = {numero:"", dataAbertura:hoje, tipo:"", descricao:"", status:"aberto", quemAbriu:userInfo.nome, observacoes:""};
  const [tickets, setTickets] = useState([]);
  const [formTicket, setFormTicket] = useState(null);
  const recarregarTickets = async () => { try { setTickets(await dbTickets.get()); } catch(e) { console.error(e); } };
  const CATS_NOTA = ["💼 Trabalho","💡 Ideias","📞 Ligações","🎯 Metas","📦 Produtos","🔧 Pendências","📌 Geral"];
  const emptyNota = {titulo:"", texto:"", categoria:"📌 Geral", fixada:false, data:hoje, cor:"1e1e28"};
  const [notas, setNotas] = useState([]);
  const [formNota, setFormNota] = useState(null);
  const [filtroNota, setFiltroNota] = useState("Todas");
  const recarregarNotas = async () => { try { setNotas(await dbNotas.get()); } catch(e) { console.error(e); } };

  const STATUS_FABRICA = {
    aguardando:  {label:"⏳ Aguardando envio",  color:"#777",    bg:"#77777715"},
    enviado:     {label:"📦 Enviado p/ fábrica", color:"#3b82f6", bg:"#3b82f615"},
    producao:    {label:"⚙️ Em produção",        color:"#f59e0b", bg:"#f59e0b15"},
    pronto:      {label:"✅ Pronto p/ entrega",  color:"#10b981", bg:"#10b98115"},
    entregue:    {label:"🚚 Entregue",           color:"#8b5cf6", bg:"#8b5cf615"},
    instalado:   {label:"🏠 Instalado",          color:"#c9a84c", bg:"#c9a84c15"},
  };
  const emptyPedido = {numeroPedido:"", dataEnvio:hoje, produtos:"", statusFabrica:"aguardando", previsaoEntrega:"", dataEntregaReal:"", observacoes:"", cliente:"", visita_id:"", valorPedido:""};
  const [pedidosFabrica, setPedidosFabrica] = useState([]);
  const [formPedido, setFormPedido] = useState(null);
  const recarregarPedidos = async () => { try { setPedidosFabrica(await dbPedidos.get()); } catch(e) { console.error(e); } };

  // Toast de confirmação
  const [toast, setToast] = useState(null);
  const showToast = (msg, tipo="sucesso") => { setToast({msg,tipo}); setTimeout(()=>setToast(null), 3000); };

  // Buscas para seções migradas
  const [searchOcorrencia, setSearchOcorrencia] = useState("");
  const [searchTicket, setSearchTicket] = useState("");
  const [searchPedido, setSearchPedido] = useState("");

  // Converter PDF
  const [convFile, setConvFile] = useState(null);
  const [convLoading, setConvLoading] = useState(false);
  const [convResult, setConvResult] = useState(null);
  const [convErro, setConvErro] = useState("");
  const [convCliente, setConvCliente] = useState("");
  const [convTelefone, setConvTelefone] = useState("");
  const [convPrazo, setConvPrazo] = useState("auto");
  const [convHistorico, setConvHistorico] = useState([]);
  const [convObs, setConvObs] = useState(`Nota fiscal será entregue junto com o produto no ato da instalação
Garantia de 3 anos em todos os produtos
Prazo de entrega de 15 a 20 dias úteis para persianas
Prazo de entrega de 20 a 25 dias úteis para cortinas
Orientações de instalação: Instalação será agendada dentro do horário comercial (período: manhã ou tarde)
O cancelamento ou reagendamento pode ser feito até 24 horas antes.
Não cobramos custo adicional para mão de obra e instalação do produto em SP-SP
Estão excluídos os serviços de alvenaria, instalações de rede elétrica, papel de parede, cimento e frete de peças para grandes vão
No caso do instalador não conseguir efetuar a instalação por algum motivo técnico e precise de reagendamento, será cobrada uma taxa de R$ 120,00.
O instalador pode ficar esperando até 15 minutos para entrar no cliente.`);
  const carregarHistoricoConv = async () => { try { const res = await fetch(`${SUPABASE_URL}/rest/v1/historico_conversoes?order=created_at.desc&limit=20`, { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }); setConvHistorico(await res.json()); } catch(e){} };
  const salvarHistoricoConv = async (cliente, numero, usuario) => { try { await fetch(`${SUPABASE_URL}/rest/v1/historico_conversoes`, { method: "POST", headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ cliente, numero_pedido: numero, data_conversao: hoje, usuario }) }); carregarHistoricoConv(); } catch(e){} };

  // Visualizador IA
  const [vizModelo, setVizModelo] = useState("Persiana Rolo");
  const [vizBlackout, setVizBlackout] = useState(false);
  const [vizFotoAmbiente, setVizFotoAmbiente] = useState(null);
  const [vizFotoTecido, setVizFotoTecido] = useState(null);
  const [vizResultado, setVizResultado] = useState(null);
  const [vizLoading, setVizLoading] = useState(false);
  const [vizErro, setVizErro] = useState("");

  const [vizOpenaiKey, setVizOpenaiKey] = useState("");
  const salvarOpenaiKey = async (k) => {
    setVizOpenaiKey(k);
    try {
      // Tenta update primeiro, se não existe faz insert
      const res = await fetch(`${SUPABASE_URL}/rest/v1/configs?chave=eq.openai_key`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
      });
      const existing = await res.json();
      if(existing.length > 0) {
        await fetch(`${SUPABASE_URL}/rest/v1/configs?chave=eq.openai_key`, {
          method: "PATCH",
          headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ valor: k })
        });
      } else {
        await fetch(`${SUPABASE_URL}/rest/v1/configs`, {
          method: "POST",
          headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({ chave: "openai_key", valor: k })
        });
      }
    } catch(e) { console.error(e); }
  };
  const carregarOpenaiKey = async () => {
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/configs?chave=eq.openai_key`, {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
      });
      const data = await res.json();
      if(data[0]?.valor) setVizOpenaiKey(data[0].valor);
    } catch(e) { console.error(e); }
  };

  const gerarSimulacao = async () => {
    if(!vizFotoAmbiente||!vizFotoTecido||!vizOpenaiKey) return;
    setVizLoading(true); setVizErro(""); setVizResultado(null);
    try {
      // Usar Responses API com image_generation tool - mantém fidelidade à foto original
      const res = await fetch("https://api.openai.com/v1/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${vizOpenaiKey}` },
        body: JSON.stringify({
          model: "gpt-4o",
          input: [
            {
              role: "user",
              content: [
                { type: "input_image", image_url: vizFotoAmbiente },
                { type: "input_image", image_url: vizFotoTecido },
                { type: "input_text", text: `Edit the FIRST image (the room/window photo). Keep the room EXACTLY as it is - same walls, floor, furniture, lighting, everything. ONLY add a "${vizModelo}"${vizBlackout?" (blackout fabric)":""} installed on the window.

The fabric of the ${vizModelo} must match the SECOND image (the fabric close-up) - use the exact same color, texture and pattern from that fabric photo.

Show proper installation with mounting rail at top. The blind/curtain should look naturally installed. Do NOT change the room, do NOT change the walls, do NOT change the window frame. ONLY add the window treatment product.` }
              ]
            }
          ],
          tools: [{ 
            type: "image_generation",
            quality: "high",
            input_fidelity: "high",
            size: "1024x1024"
          }]
        })
      });
      const data = await res.json();
      
      // Procurar o resultado da imagem gerada
      const imgOutput = data.output?.find(o => o.type === "image_generation_call" && o.result);
      if(imgOutput?.result) {
        setVizResultado(`data:image/png;base64,${imgOutput.result}`);
      } else {
        const errMsg = data.error?.message || data.output?.find(o=>o.type==="text")?.text || "Erro ao gerar imagem. Tente novamente.";
        setVizErro(errMsg);
      }
    } catch(e) {
      console.error(e);
      setVizErro("Erro de conexão. Verifique sua internet e tente novamente.");
    }
    setVizLoading(false);
  };

  const fileToBase64 = (file) => new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

  const calcPrazo = (dataEnvio, produtos) => {
    if(!dataEnvio) return null;
    const [d,m,a] = dataEnvio.split("/");
    if(!d||!m||!a) return null;
    const base = new Date(+a, +m-1, +d);
    const temCortina = (produtos||"").toLowerCase().includes("cortina");
    let diasUteis = temCortina ? 25 : 20;
    let count = 0; let dt = new Date(base);
    while(count < diasUteis) {
      dt.setDate(dt.getDate()+1);
      if(dt.getDay()!==0 && dt.getDay()!==6) count++;
    }
    return dt.toLocaleDateString("pt-BR");
  };

  const carregar = async () => {
    setLoading(true);
    try {
      const [v, c, oc, tk, nt, pf] = await Promise.all([
        db.get(), dbClientes.get(), dbOcorrencias.get(), dbTickets.get(), dbNotas.get(), dbPedidos.get()
      ]);
      setVisitas(v); setClientes(c); setOcorrencias(oc); setTickets(tk); setNotas(nt); setPedidosFabrica(pf);
      carregarOpenaiKey();
      carregarHistoricoConv();
      const h = new Date().toLocaleDateString("pt-BR");
      const temHoje = v.filter(x=>x.dataVisita===h && x.status==="agendado").length>0;
      if(temHoje) setShowLembrete(true);
    } catch(e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { if(sessao) carregar(); }, [sessao]);

  const parseData = (str) => { if(!str) return null; const p=str.split("/"); if(p.length!==3) return null; const d=+p[0],m=+p[1],a=+p[2]; if(!d||!m||!a) return null; return new Date(a, m-1, d); };

  // Filtrar visitas do mês atual
  const visitasMes = useMemo(() => {
    const agora = new Date();
    const mesAtual = agora.getMonth();
    const anoAtual = agora.getFullYear();
    return visitas.filter(v => {
      const d = parseData(v.dataVisita || v.dataCriacao);
      return d && d.getMonth() === mesAtual && d.getFullYear() === anoAtual;
    });
  }, [visitas]);

  const stats = useMemo(() => {
    const ativas = visitasMes.filter(v=>v.status!=="cancelado");
    const fechados = ativas.filter(v=>v.status==="fechado");
    const agora = new Date();
    const diaSemana = agora.getDay();
    const inicioSemana = new Date(agora);
    inicioSemana.setDate(agora.getDate() - (diaSemana===0?6:diaSemana-1));
    inicioSemana.setHours(0,0,0,0);
    const fimSemana = new Date(inicioSemana);
    fimSemana.setDate(inicioSemana.getDate()+6);
    fimSemana.setHours(23,59,59,999);

    const fechadosSemana = fechados.filter(v=>{
      const d = parseData(v.dataVisita);
      return d && d>=inicioSemana && d<=fimSemana;
    });
    const ativasSemana = ativas.filter(v=>{
      const d = parseData(v.dataVisita);
      return d && d>=inicioSemana && d<=fimSemana;
    });

    return {
      total: ativas.length,
      totalGeral: visitas.filter(v=>v.status!=="cancelado").length,
      cancelados: visitasMes.filter(v=>v.status==="cancelado").length,
      fechados: fechados.length,
      pendentes: ativas.filter(v=>v.status==="orcamento_enviado").length,
      hoje: visitas.filter(v=>v.dataVisita===hoje&&v.status!=="cancelado").length,
      receita: fechados.reduce((a,v)=>a+valorFinal(v),0),
      conversao: ativas.length>0?((fechados.length/ativas.length)*100).toFixed(0):0,
      semana: {
        receita: fechadosSemana.reduce((a,v)=>a+valorFinal(v),0),
        vendas: fechadosSemana.length,
        visitas: ativasSemana.length,
        conversao: ativasSemana.length>0?Math.round(fechadosSemana.length/ativasSemana.length*100):0,
        inicio: inicioSemana.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"}),
        fim: fimSemana.toLocaleDateString("pt-BR",{day:"2-digit",month:"2-digit"}),
      }
    };
  }, [visitas, visitasMes]);

  const rankingProdutos = useMemo(()=>{
    const mapa = {};
    visitasMes.forEach(v=>{
      (v.produtos||"").split(",").forEach(p=>{
        const pt=p.trim(); if(!pt) return;
        if(!mapa[pt]) mapa[pt]={total:0,fechados:0,receita:0};
        mapa[pt].total++;
        if(v.status==="fechado"){mapa[pt].fechados++;mapa[pt].receita+=valorFinal(v);}
      });
    });
    return Object.entries(mapa).map(([nome,d])=>({
      nome, total:d.total, fechados:d.fechados,
      receita:d.receita,
      conversao:d.total>0?Math.round(d.fechados/d.total*100):0
    })).sort((a,b)=>b.receita-a.receita);
  }, [visitasMes]);

  const tempoMedio = useMemo(()=>{
    const fechados = visitasMes.filter(v=>v.status==="fechado"&&v.dataVisita&&v.dataCriacao);
    const dias = fechados.map(v=>{
      const criacao=parseData(v.dataCriacao); const visita=parseData(v.dataVisita);
      if(!criacao||!visita) return null;
      return Math.abs(Math.floor((visita-criacao)/(1000*60*60*24)));
    }).filter(d=>d!==null&&d>=0&&d<=90);
    return dias.length>0?Math.round(dias.reduce((a,b)=>a+b,0)/dias.length):null;
  }, [visitasMes]);

  const filtradas = useMemo(() => visitas.filter(v => {
    const s1=filtro==="todos"||v.status===filtro;
    const s2=search===""||v.cliente?.toLowerCase().includes(search.toLowerCase())||v.telefone?.includes(search);
    return s1&&s2;
  }), [visitas, filtro, search]);

  const comissao = useMemo(() => {
    const ativas = visitasMes.filter(v=>v.status!=="cancelado");
    const fechados = ativas.filter(v => v.status === "fechado");
    const totalVendas = fechados.reduce((a, v) => a + valorFinal(v), 0);
    const totalVisitas = ativas.length;
    const conversao = totalVisitas > 0 ? (fechados.length / totalVisitas) * 100 : 0;

    let pct = 10;

    if (totalVendas >= 120000) pct += 5;
    else if (totalVendas >= 100000) pct += 4;
    else if (totalVendas >= 80000) pct += 3;
    else if (totalVendas >= 60000) pct += 2;
    else if (totalVendas >= 40000) pct += 1;

    if (conversao >= 90) pct += 5;
    else if (conversao >= 80) pct += 4;
    else if (conversao >= 70) pct += 3;
    else if (conversao >= 60) pct += 2;
    else if (conversao >= 50) pct += 1;

    pct = Math.min(pct, 20);

    const bonus1 = totalVendas >= 120000 ? 5 : totalVendas >= 100000 ? 4 : totalVendas >= 80000 ? 3 : totalVendas >= 60000 ? 2 : totalVendas >= 40000 ? 1 : 0;
    const bonus2 = conversao >= 90 ? 5 : conversao >= 80 ? 4 : conversao >= 70 ? 3 : conversao >= 60 ? 2 : conversao >= 50 ? 1 : 0;

    return {
      pct, totalVendas, conversao: conversao.toFixed(1),
      valorComissao: totalVendas * pct / 100,
      bonus1, bonus2,
      proximaFaixaVenda: totalVendas < 40000 ? 40000 : totalVendas < 60000 ? 60000 : totalVendas < 80000 ? 80000 : totalVendas < 100000 ? 100000 : totalVendas < 120000 ? 120000 : null,
      proximaFaixaConv: conversao < 50 ? 50 : conversao < 60 ? 60 : conversao < 70 ? 70 : conversao < 80 ? 80 : conversao < 90 ? 90 : null,
    };
  }, [visitasMes]);

  // Alertas de pedidos perto do prazo / atrasados
  const pedidosAlerta = useMemo(() => {
    const hj = new Date(); hj.setHours(0,0,0,0);
    const em3dias = new Date(hj); em3dias.setDate(em3dias.getDate()+3);
    const parseData = (str) => { if(!str) return null; const [d,m,a]=str.split("/"); return new Date(+a, +m-1, +d); };
    const emAndamento = pedidosFabrica.filter(p=>!["entregue","instalado"].includes(p.statusFabrica));
    const atrasados = emAndamento.filter(p=>{ const d=parseData(p.previsaoEntrega); return d && d<hj; });
    const proximos = emAndamento.filter(p=>{ const d=parseData(p.previsaoEntrega); return d && d>=hj && d<=em3dias; });
    return { atrasados, proximos };
  }, [pedidosFabrica]);

  const fazerLogin = async () => {
    if(!loginEmail||!loginSenha) return;
    setLoginLoading(true); setLoginErro("");
    const data = await auth.login(loginEmail, loginSenha);
    if(data.access_token) {
      const s = {token: data.access_token, email: data.user?.email, nome: data.user?.user_metadata?.nome||data.user?.email};
      setSessao(s);
      localStorage.setItem("crm_sessao", JSON.stringify(s));
    } else {
      setLoginErro("E-mail ou senha incorretos.");
    }
    setLoginLoading(false);
  };

  const fazerLogout = async () => {
    if(sessao?.token) await auth.logout(sessao.token);
    setSessao(null);
    localStorage.removeItem("crm_sessao");
  };

  // Tela de login
  if(!sessao) return (
    <div style={{minHeight:"100vh",width:"100vw",background:"#0d0d1a",display:"flex",alignItems:"center",justifyContent:"center",padding:20,boxSizing:"border-box"}}>
      <div style={{width:"100%",maxWidth:420}}>
        {/* Logo */}
        <div style={{textAlign:"center",marginBottom:40}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:36,color:"#c9a84c",fontWeight:700,letterSpacing:2}}>Persianas</div>
          <div style={{fontSize:11,color:"#444",letterSpacing:"4px",textTransform:"uppercase",marginTop:4}}>CRM · Sistema de Gestão</div>
        </div>

        {/* Card login */}
        <div style={{background:"#13131f",border:"1px solid #1e1e28",borderRadius:16,padding:32,boxShadow:"0 20px 60px rgba(0,0,0,0.5)"}}>
          <div style={{fontFamily:"Georgia,serif",fontSize:22,color:"#e8e4dc",marginBottom:6}}>Bem-vindo de volta</div>
          <div style={{fontSize:12,color:"#555",marginBottom:28}}>Entre com suas credenciais para acessar</div>

          <div style={{marginBottom:16}}>
            <label style={{fontSize:11,color:"#777",display:"block",marginBottom:8,textTransform:"uppercase",letterSpacing:"1px"}}>E-mail</label>
            <input
              style={{width:"100%",padding:"12px 14px",background:"#0d0d1a",border:"1px solid #2a2a3a",borderRadius:8,color:"#e8e4dc",fontSize:14,outline:"none",boxSizing:"border-box",transition:"border .2s"}}
              type="email" placeholder="seu@email.com" value={loginEmail}
              onChange={e=>setLoginEmail(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&fazerLogin()}
            />
          </div>

          <div style={{marginBottom:24}}>
            <label style={{fontSize:11,color:"#777",display:"block",marginBottom:8,textTransform:"uppercase",letterSpacing:"1px"}}>Senha</label>
            <input
              style={{width:"100%",padding:"12px 14px",background:"#0d0d1a",border:"1px solid #2a2a3a",borderRadius:8,color:"#e8e4dc",fontSize:14,outline:"none",boxSizing:"border-box",transition:"border .2s"}}
              type="password" placeholder="••••••••" value={loginSenha}
              onChange={e=>setLoginSenha(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&fazerLogin()}
            />
          </div>

          {loginErro && (
            <div style={{padding:"10px 14px",background:"#ef444415",border:"1px solid #ef444430",borderRadius:8,color:"#ef4444",fontSize:13,marginBottom:16}}>
              ⚠️ {loginErro}
            </div>
          )}

          <button
            onClick={fazerLogin} disabled={loginLoading||!loginEmail||!loginSenha}
            style={{width:"100%",padding:"14px",background:loginLoading||!loginEmail||!loginSenha?"#2a2a3a":"#c9a84c",color:loginLoading||!loginEmail||!loginSenha?"#555":"#0d0d1a",border:"none",borderRadius:8,fontSize:16,fontWeight:700,cursor:loginLoading?"wait":"pointer",transition:"all .2s",fontFamily:"Georgia,serif",letterSpacing:1}}
          >
            {loginLoading ? "Entrando..." : "Entrar →"}
          </button>
        </div>

        <div style={{textAlign:"center",marginTop:24,fontSize:11,color:"#333"}}>
          Persianas em Casa · Sistema interno
        </div>
      </div>
    </div>
  );

  const salvarCliente = async () => {
    if (!formCliente.nome) return;
    setSaving(true);
    try {
      if (formCliente.id) await dbClientes.update(formCliente.id, formCliente);
      else await dbClientes.insert(formCliente);
      const c = await dbClientes.get(); setClientes(c);
      setFormCliente({...emptyCliente});
      setView("clientes");
      showToast("Cliente salvo com sucesso!");
    } catch(e) { console.error(e); showToast("Erro ao salvar cliente","erro"); }
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

  const salvar = async () => {
    if (!form.cliente) return;
    setSaving(true);
    const log={data:hoje,texto:form.id?"Dados atualizados":"Visita cadastrada"};
    const historico=[...(form.historico||[]),log];
    try {
      if (form.id) await db.update(form.id,{...form,historico});
      else await db.insert({...form,historico,dataCriacao:hoje});
      await carregar(); setForm({...empty}); setView("lista");
      showToast("Visita salva com sucesso!");
    } catch(e) { console.error(e); showToast("Erro ao salvar visita","erro"); }
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
        input[type="date"].inp,input[type="time"].inp{color-scheme:dark}
        input[type="date"].inp::-webkit-calendar-picker-indicator,input[type="time"].inp::-webkit-calendar-picker-indicator{filter:invert(0.7);cursor:pointer}
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
        .drawer{position:fixed;left:0;top:0;bottom:0;width:240px;background:#080810;border-right:1px solid #1a1a24;z-index:200;transform:translateX(-100%);transition:transform .25s;padding:20px 12px 40px;display:flex;flex-direction:column;gap:4px;overflow-y:auto}
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
        @keyframes toastIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}
        @keyframes toastOut{from{transform:translateX(0);opacity:1}to{transform:translateX(100%);opacity:0}}
        .toast{position:fixed;top:20px;right:20px;z-index:9999;padding:14px 22px;border-radius:10px;font-size:13px;font-weight:500;animation:toastIn .3s ease;box-shadow:0 8px 32px rgba(0,0,0,0.4);display:flex;align-items:center;gap:10px}
        .toast.saindo{animation:toastOut .3s ease forwards}
        .toast-sucesso{background:#10b98125;border:1px solid #10b98150;color:#10b981}
        .toast-erro{background:#ef444425;border:1px solid #ef444450;color:#ef4444}
        .toast-aviso{background:#f59e0b25;border:1px solid #f59e0b50;color:#f59e0b}
      `}</style>

      {/* TOAST */}
      {toast && (
        <div className={`toast toast-${toast.tipo}`}>
          {toast.tipo==="sucesso"?"✅":toast.tipo==="erro"?"❌":"⚠️"} {toast.msg}
        </div>
      )}

      {/* TOPBAR mobile */}
      <div className="topbar">
        <div style={{fontFamily:"Georgia,serif",fontSize:17,color:"#c9a84c",fontWeight:700}}>Persianas CRM</div>
        <button className="hamburger" onClick={()=>setMenuOpen(!menuOpen)}>☰</button>
      </div>

      {/* LEMBRETE DO DIA */}
      {showLembrete && (()=>{
        const visitasHoje = visitas.filter(v=>v.dataVisita===hoje && v.status==="agendado").sort((a,b)=>a.horaVisita?.localeCompare(b.horaVisita));
        return (
          <div style={{position:"fixed",inset:0,background:"#00000090",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
            <div style={{background:"#12121a",border:"1px solid #c9a84c40",borderRadius:16,padding:28,maxWidth:420,width:"100%",boxShadow:"0 20px 60px #000"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:20,color:"#c9a84c"}}>☀️ Bom dia, {userInfo.nome}!</div>
                  <div style={{fontSize:12,color:"#555",marginTop:2}}>Você tem {visitasHoje.length} visita{visitasHoje.length!==1?"s":""} hoje</div>
                </div>
                <button className="btn bg" style={{fontSize:18,padding:"4px 10px"}} onClick={()=>setShowLembrete(false)}>✕</button>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:20}}>
                {visitasHoje.map(v=>(
                  <div key={v.id} style={{padding:"12px 14px",borderRadius:10,background:"#0d0d15",border:"1px solid #c9a84c30",cursor:"pointer"}} onClick={()=>{setSelected(v);setView("detalhe");setShowLembrete(false)}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:14,fontWeight:600,color:"#e8e4dc"}}>{v.cliente}</div>
                        <div style={{fontSize:11,color:"#555",marginTop:2}}>🕐 {v.horaVisita} · 📍 {v.endereco?.slice(0,35)}</div>
                        <div style={{fontSize:11,color:"#777",marginTop:1}}>🏠 {v.ambiente} · {v.produtos||"—"}</div>
                      </div>
                      <div style={{fontSize:11,color:"#c9a84c",fontWeight:700}}>{v.horaVisita}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="btn bp" style={{width:"100%",padding:12}} onClick={()=>setShowLembrete(false)}>Entendido, vamos lá! 💪</button>
            </div>
          </div>
        );
      })()}

      {/* OVERLAY + DRAWER mobile */}
      {menuOpen && <div className="overlay" onClick={()=>setMenuOpen(false)}/>}
      <div className={`drawer ${menuOpen?"open":""}`}>
        <div style={{fontFamily:"Georgia,serif",fontSize:17,color:"#c9a84c",fontWeight:700,padding:"4px 8px 16px",borderBottom:"1px solid #1a1a24",marginBottom:8}}>Persianas CRM</div>
        <div className={`nav ${view==="dashboard"?"on":""}`} onClick={()=>navTo("dashboard")}>▦ Dashboard</div>
        <div className={`nav ${view==="lista"||view==="detalhe"?"on":""}`} onClick={()=>navTo("lista")}>📋 Visitas</div>
        <div className={`nav ${view==="calendario"?"on":""}`} onClick={()=>navTo("calendario")}>📅 Calendário</div>
        <div className={`nav ${view==="rota"?"on":""}`} onClick={()=>navTo("rota")}>🗺️ Rota do Dia</div>
        <div className={`nav ${view==="clientes"||view==="detalhe-cliente"?"on":""}`} onClick={()=>navTo("clientes")}>👥 Clientes</div>
        <div className={`nav ${view==="comissao"?"on":""}`} onClick={()=>navTo("comissao")}>💰 Comissão</div>
        <div className={`nav ${view==="fechados"?"on":""}`} onClick={()=>navTo("fechados")}>✅ Fechados</div>
        <div className={`nav ${view==="simulador"?"on":""}`} onClick={()=>navTo("simulador")}>🧮 Simulador</div>
        <div className={`nav ${view==="cancelamentos"?"on":""}`} onClick={()=>navTo("cancelamentos")}>📊 Cancelamentos</div>
        <div className={`nav ${view==="ocorrencias"?"on":""}`} onClick={()=>navTo("ocorrencias")}>🔧 Ocorrências</div>
        <div className={`nav ${view==="tickets"?"on":""}`} onClick={()=>navTo("tickets")}>🎫 Tickets</div>
        <div className={`nav ${view==="notas"?"on":""}`} onClick={()=>navTo("notas")}>📝 Notas</div>
        <div className={`nav ${view==="fabrica"?"on":""}`} onClick={()=>navTo("fabrica")}>🏭 Pedidos Fábrica</div>
        <div className={`nav ${view==="producao"?"on":""}`} onClick={()=>navTo("producao")}>💰 Produção</div>
        <div className={`nav ${view==="gerente"?"on":""}`} onClick={()=>navTo("gerente")}>👔 Painel Gerente</div>
        <div className={`nav ${view==="importar"?"on":""}`} onClick={()=>navTo("importar")}>✉ Importar E-mail</div>
        <div className={`nav ${view==="visualizador"?"on":""}`} onClick={()=>navTo("visualizador")}>🎨 Visualizador</div>
        <div className={`nav ${view==="converter"?"on":""}`} onClick={()=>navTo("converter")}>📄 Converter PDF</div>
        <div style={{marginTop:12}}/>
        <button className="btn bp" style={{width:"100%",padding:12}} onClick={()=>navTo("novo")}>+ Nova Visita</button>
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
          <div style={{fontSize:10,color:"#444",letterSpacing:"2px",textTransform:"uppercase"}}>CRM · {userInfo.apelido}</div>
        </div>
        <div className={`nav ${view==="dashboard"?"on":""}`} onClick={()=>setView("dashboard")}>▦ Dashboard</div>
        <div className={`nav ${view==="lista"||view==="detalhe"?"on":""}`} onClick={()=>setView("lista")}>📋 Visitas</div>
        <div className={`nav ${view==="calendario"?"on":""}`} onClick={()=>setView("calendario")}>📅 Calendário</div>
        <div className={`nav ${view==="rota"?"on":""}`} onClick={()=>setView("rota")}>🗺️ Rota do Dia</div>
        <div className={`nav ${view==="clientes"||view==="detalhe-cliente"?"on":""}`} onClick={()=>setView("clientes")}>👥 Clientes</div>
        <div className={`nav ${view==="comissao"?"on":""}`} onClick={()=>setView("comissao")}>💰 Comissão</div>
        <div className={`nav ${view==="fechados"?"on":""}`} onClick={()=>setView("fechados")}>✅ Fechados</div>
        <div className={`nav ${view==="simulador"?"on":""}`} onClick={()=>setView("simulador")}>🧮 Simulador</div>
        <div className={`nav ${view==="cancelamentos"?"on":""}`} onClick={()=>setView("cancelamentos")}>📊 Cancelamentos</div>
        <div className={`nav ${view==="ocorrencias"?"on":""}`} onClick={()=>setView("ocorrencias")}>🔧 Ocorrências</div>
        <div className={`nav ${view==="tickets"?"on":""}`} onClick={()=>setView("tickets")}>🎫 Tickets</div>
        <div className={`nav ${view==="notas"?"on":""}`} onClick={()=>setView("notas")}>📝 Notas</div>
        <div className={`nav ${view==="fabrica"?"on":""}`} onClick={()=>setView("fabrica")}>🏭 Pedidos Fábrica</div>
        <div className={`nav ${view==="producao"?"on":""}`} onClick={()=>setView("producao")}>💰 Produção</div>
        <div className={`nav ${view==="gerente"?"on":""}`} onClick={()=>setView("gerente")}>👔 Painel Gerente</div>
        <div className={`nav ${view==="importar"?"on":""}`} onClick={()=>{setImportStep("colar");setEmailTexto("");setView("importar")}}>✉ Importar E-mail</div>
        <div className={`nav ${view==="visualizador"?"on":""}`} onClick={()=>setView("visualizador")}>🎨 Visualizador</div>
        <div className={`nav ${view==="converter"?"on":""}`} onClick={()=>setView("converter")}>📄 Converter PDF</div>
        <div style={{flex:1}}/>
        <button className="btn bp" style={{width:"100%",padding:11}} onClick={()=>{if(!form.cliente)setForm({...empty});setView("novo")}}>+ Nova Visita{form.cliente&&!form.id?" (rascunho)":""}</button>
        <div style={{marginTop:14,padding:"12px 8px",borderTop:"1px solid #1a1a24"}}>
          <div style={{fontSize:10,color:"#444"}}>RECEITA DO MÊS</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:16,color:"#10b981",marginTop:4}}>{fmt(stats.receita)}</div>
          <div style={{fontSize:10,color:"#444",marginTop:8}}>META</div>
          <div style={{fontFamily:"Georgia,serif",fontSize:14,color:"#c9a84c",marginTop:4}}>{fmt(META_MENSAL)}</div>
          <div style={{marginTop:16,paddingTop:12,borderTop:"1px solid #1a1a24"}}>
            <div style={{fontSize:10,color:"#444",marginBottom:6}}>👤 {sessao?.email}</div>
            <button onClick={fazerLogout} style={{width:"100%",padding:"8px",background:"transparent",border:"1px solid #2a2a3a",borderRadius:6,color:"#555",fontSize:11,cursor:"pointer"}}>Sair →</button>
          </div>
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

        {/* CALENDÁRIO */}
        {view==="calendario" && (() => {
          const primeiroDia = new Date(calAno, calMes, 1).getDay();
          const diasNoMes = new Date(calAno, calMes+1, 0).getDate();
          const nomeMes = new Date(calAno, calMes).toLocaleString('pt-BR',{month:'long',year:'numeric'});
          const agora = new Date();

          const visitasDoDia = (dia) => {
            const d = String(dia).padStart(2,'0');
            const m = String(calMes+1).padStart(2,'0');
            const dataStr = `${d}/${m}/${calAno}`;
            return visitas.filter(v => v.dataVisita === dataStr);
          };

          const visitasSelecionadas = diaSelected ? visitasDoDia(diaSelected) : [];

          return (
            <div>
              <div style={{fontFamily:"Georgia,serif",fontSize:22,marginBottom:4}}>📅 Calendário de Visitas</div>
              <div style={{fontSize:12,color:"#555",marginBottom:20}}>Visualize suas visitas por dia</div>

              <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
                <button className="btn bg" style={{padding:"8px 16px"}} onClick={()=>{if(calMes===0){setCalMes(11);setCalAno(calAno-1)}else setCalMes(calMes-1);setDiaSelected(null)}}>←</button>
                <div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#c9a84c",textTransform:"capitalize",flex:1,textAlign:"center"}}>{nomeMes}</div>
                <button className="btn bg" style={{padding:"8px 16px"}} onClick={()=>{if(calMes===11){setCalMes(0);setCalAno(calAno+1)}else setCalMes(calMes+1);setDiaSelected(null)}}>→</button>
              </div>

              <div className="card" style={{padding:16,marginBottom:16}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4,marginBottom:8}}>
                  {["Dom","Seg","Ter","Qua","Qui","Sex","Sáb"].map(d=>(
                    <div key={d} style={{textAlign:"center",fontSize:11,color:"#555",padding:"6px 0",fontWeight:600}}>{d}</div>
                  ))}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
                  {Array(primeiroDia).fill(null).map((_,i)=><div key={`e${i}`}/>)}
                  {Array(diasNoMes).fill(null).map((_,i)=>{
                    const dia = i+1;
                    const vsDia = visitasDoDia(dia);
                    const isHoje = dia===agora.getDate() && calMes===agora.getMonth() && calAno===agora.getFullYear();
                    const isSel = diaSelected===dia;
                    return (
                      <div key={dia} onClick={()=>setDiaSelected(isSel?null:dia)} style={{
                        minHeight:56,padding:"6px 4px",borderRadius:8,cursor:"pointer",
                        background:isSel?"#c9a84c20":isHoje?"#3b82f610":"#0d0d15",
                        border:`1px solid ${isSel?"#c9a84c":isHoje?"#3b82f640":"#1e1e28"}`,
                        transition:"all .15s"
                      }}>
                        <div style={{fontSize:12,fontWeight:isHoje?700:400,color:isHoje?"#3b82f6":isSel?"#c9a84c":"#aaa",marginBottom:3}}>{dia}</div>
                        {vsDia.slice(0,2).map((v,vi)=>(
                          <div key={vi} style={{fontSize:9,padding:"2px 4px",borderRadius:3,marginBottom:2,
                            background:STATUS[v.status]?.bg,color:STATUS[v.status]?.color,
                            overflow:"hidden",whiteSpace:"nowrap",textOverflow:"ellipsis"}}>
                            {v.horaVisita} {v.cliente?.split(" ")[0]}
                          </div>
                        ))}
                        {vsDia.length>2 && <div style={{fontSize:9,color:"#555"}}>+{vsDia.length-2}</div>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {diaSelected && (
                <div className="card" style={{padding:18}}>
                  <div style={{fontSize:13,color:"#c9a84c",fontWeight:600,marginBottom:12}}>
                    {String(diaSelected).padStart(2,'0')}/{String(calMes+1).padStart(2,'0')}/{calAno} — {visitasSelecionadas.length} visita{visitasSelecionadas.length!==1?"s":""}
                  </div>
                  {visitasSelecionadas.length===0 && <div style={{fontSize:13,color:"#444",marginBottom:12}}>Nenhuma visita neste dia.</div>}
                  {visitasSelecionadas.map(v=>(
                    <div key={v.id} style={{padding:"12px",borderRadius:8,background:"#0d0d15",border:"1px solid #1e1e28",marginBottom:8,cursor:"pointer"}} onClick={()=>{setSelected(v);setView("detalhe")}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:14,fontWeight:600}}>{v.cliente}</div>
                          <div style={{fontSize:11,color:"#555",marginTop:2}}>{v.horaVisita} · {v.ambiente}</div>
                        </div>
                        <span className="tag" style={{background:STATUS[v.status]?.bg,color:STATUS[v.status]?.color}}>{STATUS[v.status]?.icon} {STATUS[v.status]?.label}</span>
                      </div>
                    </div>
                  ))}
                  <button className="btn bp" style={{marginTop:8,width:"100%"}} onClick={()=>{setForm({...empty,dataVisita:`${String(diaSelected).padStart(2,'0')}/${String(calMes+1).padStart(2,'0')}/${calAno}`});setView("novo")}}>
                    + Agendar visita neste dia
                  </button>
                </div>
              )}
            </div>
          );
        })()}

        {/* DASHBOARD */}
        {view==="dashboard" && (
          <div>
            <div style={{fontFamily:"Georgia,serif",fontSize:22,marginBottom:3}}>Bom dia, {userInfo.nome}! 👋</div>
            <div style={{fontSize:12,color:"#555",marginBottom:20}}>{hoje} · <span style={{color:"#c9a84c",textTransform:"capitalize"}}>{new Date().toLocaleString("pt-BR",{month:"long",year:"numeric"})}</span></div>

            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:16}} className="grid-4col">
              {[
                {label:"Visitas Realizadas",value:visitasMes.filter(v=>["visitado","orcamento_enviado","fechado","perdido"].includes(v.status)).length,color:"#3b82f6"},
                {label:"Fechados (mês)",value:stats.fechados,color:"#10b981"},
                {label:"Conversão (mês)",value:`${stats.conversao}%`,color:"#c9a84c"},
                {label:"Receita (mês)",value:fmt(stats.receita),color:"#10b981"},
              ].map((st,i)=>(
                <div key={i} className="sc">
                  <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>{st.label}</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:i===3?16:22,color:st.color}}>{st.value}</div>
                </div>
              ))}
            </div>

            <div style={{display:"grid",gridTemplateColumns:"2fr 2fr 180px",gap:14,marginBottom:16}} className="graficos-grid">
              <div className="card" style={{padding:16}}><GraficoLinha visitas={visitas}/></div>
              <div className="card" style={{padding:16}}><Funil visitas={visitasMes}/></div>
              <div className="card" style={{padding:16,display:"flex",alignItems:"center",justifyContent:"center"}}><MedidorMeta receita={stats.receita}/></div>
            </div>

            {/* META SEMANAL */}
            {(()=>{
              const META_SEMANAL = META_MENSAL / 4;
              const pct = Math.min(stats.semana.receita / META_SEMANAL, 1);
              const cor = pct>=1?"#10b981":pct>=0.6?"#c9a84c":"#ef4444";
              return (
                <div className="card" style={{padding:18,marginBottom:16,borderColor:cor+"40"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14,flexWrap:"wrap",gap:8}}>
                    <div>
                      <div style={{fontSize:11,color:cor,textTransform:"uppercase",letterSpacing:"1px",marginBottom:2}}>🎯 Meta Semanal — {stats.semana.inicio} a {stats.semana.fim}</div>
                      <div style={{fontSize:11,color:"#444"}}>Meta: {fmt(META_SEMANAL)} · {stats.semana.visitas} visitas · {stats.semana.vendas} fechadas · {stats.semana.conversao}% conversão</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{fontFamily:"Georgia,serif",fontSize:22,color:cor}}>{fmt(stats.semana.receita)}</div>
                      <div style={{fontSize:11,color:"#555"}}>{Math.round(pct*100)}% da meta</div>
                    </div>
                  </div>
                  <div style={{height:8,background:"#1a1a24",borderRadius:4,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${Math.round(pct*100)}%`,background:`linear-gradient(90deg,${cor},${cor}aa)`,borderRadius:4,transition:"width .8s"}}/>
                  </div>
                  {pct<1 && (
                    <div style={{fontSize:11,color:"#555",marginTop:8}}>
                      💡 Faltam <span style={{color:cor,fontWeight:600}}>{fmt(META_SEMANAL-stats.semana.receita)}</span> para bater a meta semanal
                    </div>
                  )}
                  {pct>=1 && (
                    <div style={{fontSize:12,color:"#10b981",marginTop:8,fontWeight:600}}>🏆 Meta semanal batida!</div>
                  )}
                </div>
              );
            })()}

            {/* ALERTA ORÇAMENTO PENDENTE */}
            {(()=>{
              const semOrcamento = visitas.filter(v=>v.status==="visitado");
              if(semOrcamento.length===0) return null;
              return (
                <div className="card" style={{padding:16,marginBottom:16,borderColor:"#f59e0b40"}}>
                  <div style={{fontSize:11,color:"#f59e0b",textTransform:"uppercase",letterSpacing:"1px",marginBottom:10,fontWeight:600}}>📋 Orçamentos Pendentes ({semOrcamento.length})</div>
                  <div style={{fontSize:12,color:"#777",marginBottom:12}}>Visitas realizadas aguardando envio de orçamento</div>
                  {semOrcamento.map((v,i)=>(
                    <div key={v.id||i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:i<semOrcamento.length-1?"1px solid #1a1a24":"none",flexWrap:"wrap",gap:8}}>
                      <div>
                        <span style={{fontSize:14,fontWeight:600}}>{v.cliente}</span>
                        <span style={{fontSize:11,color:"#555",marginLeft:8}}>Visita em {v.dataVisita||"—"}</span>
                        {v.valorOrcamento && <span style={{fontSize:11,color:"#10b981",marginLeft:8}}>{fmt(valorFinal(v))}</span>}
                      </div>
                      <div style={{display:"flex",gap:8}}>
                        {v.telefone && (
                          <a href={`https://wa.me/55${v.telefone?.replace(/\D/g,"")}?text=${encodeURIComponent(`Olá, ${v.cliente?.split(" ")[0]}! Tudo bem?\n\nSegue o orçamento conforme combinamos na visita.\n\nQualquer dúvida estou à disposição!\n\n${userInfo.nome} - Persianas em Casa`)}`} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                            <button className="sb" style={{fontSize:11,color:"#25d366",borderColor:"#25d36640"}}>💬 Enviar</button>
                          </a>
                        )}
                        <button className="sb" style={{fontSize:11}} onClick={()=>{setSelected(v);setView("detalhe")}}>📋 Ver</button>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* ALERTA PEDIDOS FÁBRICA */}
            {(pedidosAlerta.atrasados.length>0 || pedidosAlerta.proximos.length>0) && (
              <div style={{marginBottom:16}}>
                {pedidosAlerta.atrasados.length>0 && (
                  <div className="card" style={{padding:16,marginBottom:10,borderColor:"#ef444440"}}>
                    <div style={{fontSize:11,color:"#ef4444",textTransform:"uppercase",letterSpacing:"1px",marginBottom:10,fontWeight:600}}>🚨 Pedidos Atrasados ({pedidosAlerta.atrasados.length})</div>
                    {pedidosAlerta.atrasados.map((p,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<pedidosAlerta.atrasados.length-1?"1px solid #1a1a24":"none",flexWrap:"wrap",gap:8}}>
                        <div>
                          <span style={{fontFamily:"Georgia,serif",color:"#c9a84c",fontWeight:700,marginRight:8}}>#{p.numeroPedido}</span>
                          <span style={{fontSize:13}}>{p.cliente}</span>
                          <span style={{fontSize:11,color:"#ef4444",marginLeft:8}}>Prazo: {p.previsaoEntrega}</span>
                        </div>
                        <div style={{display:"flex",gap:8}}>
                          {p.telefone && <a href={`https://wa.me/55${(p.telefone||"").replace(/\D/g,"")}?text=${encodeURIComponent(`Olá! Estou verificando o status do pedido #${p.numeroPedido}. Em breve retorno com atualizações.`)}`} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}><button className="sb" style={{fontSize:11,color:"#25d366",borderColor:"#25d36640"}}>💬 WhatsApp</button></a>}
                          <button className="sb" style={{fontSize:11}} onClick={()=>{setView("fabrica");setFormPedido({...p})}}>✏️ Editar</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {pedidosAlerta.proximos.length>0 && (
                  <div className="card" style={{padding:16,borderColor:"#f59e0b40"}}>
                    <div style={{fontSize:11,color:"#f59e0b",textTransform:"uppercase",letterSpacing:"1px",marginBottom:10,fontWeight:600}}>⚠️ Vencem em até 3 dias ({pedidosAlerta.proximos.length})</div>
                    {pedidosAlerta.proximos.map((p,i)=>(
                      <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:i<pedidosAlerta.proximos.length-1?"1px solid #1a1a24":"none",flexWrap:"wrap",gap:8}}>
                        <div>
                          <span style={{fontFamily:"Georgia,serif",color:"#c9a84c",fontWeight:700,marginRight:8}}>#{p.numeroPedido}</span>
                          <span style={{fontSize:13}}>{p.cliente}</span>
                          <span style={{fontSize:11,color:"#f59e0b",marginLeft:8}}>Prazo: {p.previsaoEntrega}</span>
                        </div>
                        <button className="sb" style={{fontSize:11}} onClick={()=>{setView("fabrica");setFormPedido({...p})}}>📋 Ver</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

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

            {/* ALERTAS FOLLOW-UP */}
            {(()=>{
              const hoje2 = new Date();
              const parseData = (str) => {
                if(!str) return null;
                const [d,m,a] = str.split("/");
                return new Date(+a, +m-1, +d);
              };
              const alertas = visitas.filter(v=>{
                if(["fechado","perdido"].includes(v.status)) return false;
                const data = parseData(v.dataVisita);
                if(!data) return false;
                const dias = Math.floor((hoje2-data)/(1000*60*60*24));
                return dias >= 3;
              }).map(v=>{
                const data = parseData(v.dataVisita);
                const dias = Math.floor((hoje2-data)/(1000*60*60*24));
                return {...v, diasSemUpdate: dias};
              }).sort((a,b)=>b.diasSemUpdate-a.diasSemUpdate);

              if(alertas.length===0) return null;
              return (
                <div style={{marginBottom:16}}>
                  <div style={{fontFamily:"Georgia,serif",fontSize:16,marginBottom:10,color:"#f97316"}}>🔔 Precisam de Follow-up ({alertas.length})</div>
                  <div className="card" style={{borderColor:"#f9731630"}}>
                    {alertas.map(v=>(
                      <div key={v.id} style={{padding:"12px 16px",borderBottom:"1px solid #1a1a24",cursor:"pointer"}} onClick={()=>{setSelected(v);setView("detalhe")}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <div style={{fontSize:14,fontWeight:600}}>{v.cliente}</div>
                            <div style={{fontSize:11,color:"#555",marginTop:2}}>{v.dataVisita} · {v.ambiente}</div>
                          </div>
                          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
                            <span className="tag" style={{background:STATUS[v.status]?.bg,color:STATUS[v.status]?.color}}>{STATUS[v.status]?.icon} {STATUS[v.status]?.label}</span>
                            <span style={{fontSize:11,color:v.diasSemUpdate>=7?"#ef4444":"#f97316",fontWeight:600}}>
                              {v.diasSemUpdate}d sem atualização
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

            {/* ANIVERSÁRIOS */}
            {(()=>{
              const diaHoje = hoje.slice(0,5); // DD/MM
              const amanha = new Date(); amanha.setDate(amanha.getDate()+1);
              const diaAmanha = amanha.toLocaleDateString("pt-BR").slice(0,5);
              const anivHoje = clientes.filter(c=>c.data_nascimento?.slice(0,5)===diaHoje);
              const anivAmanha = clientes.filter(c=>c.data_nascimento?.slice(0,5)===diaAmanha);
              if(anivHoje.length===0 && anivAmanha.length===0) return null;
              return (
                <div style={{marginBottom:16}}>
                  <div style={{fontFamily:"Georgia,serif",fontSize:16,marginBottom:10,color:"#f59e0b"}}>🎂 Aniversários</div>
                  <div className="card" style={{borderColor:"#f59e0b30"}}>
                    {anivHoje.map(c=>(
                      <div key={c.id} style={{padding:"12px 16px",borderBottom:"1px solid #1a1a24",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:14,fontWeight:600,color:"#f59e0b"}}>🎉 {c.nome}</div>
                          <div style={{fontSize:11,color:"#555",marginTop:2}}>Aniversário HOJE!</div>
                        </div>
                        <a href={`https://wa.me/55${c.telefone?.replace(/\D/g,"")}?text=${encodeURIComponent(`Olá, ${c.nome?.split(" ")[0]}! 🎉🎂\n\nA equipe Persianas em Casa deseja a você um feliz aniversário! Que seu dia seja incrível!\n\nAbraços,\n${userInfo.nome} - Persianas em Casa`)}`} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                          <button className="btn bp" style={{fontSize:12,padding:"7px 14px"}}>🎂 Parabenizar</button>
                        </a>
                      </div>
                    ))}
                    {anivAmanha.map(c=>(
                      <div key={c.id} style={{padding:"12px 16px",borderBottom:"1px solid #1a1a24",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                        <div>
                          <div style={{fontSize:14,fontWeight:600}}>{c.nome}</div>
                          <div style={{fontSize:11,color:"#f59e0b",marginTop:2}}>⏰ Aniversário amanhã</div>
                        </div>
                        <a href={`https://wa.me/55${c.telefone?.replace(/\D/g,"")}?text=${encodeURIComponent(`Olá, ${c.nome?.split(" ")[0]}! 🎉🎂\n\nA equipe Persianas em Casa deseja a você um feliz aniversário! Que seu dia seja incrível!\n\nAbraços,\n${userInfo.nome} - Persianas em Casa`)}`} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                          <button className="sb" style={{fontSize:12,color:"#f59e0b",borderColor:"#f59e0b40"}}>🎂 Preparar</button>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

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

            {/* RANKING PRODUTOS + TEMPO MÉDIO */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginTop:16}} className="grid-2col">
              <div className="card" style={{padding:18}}>
                <div style={{fontSize:11,color:"#c9a84c",textTransform:"uppercase",letterSpacing:"1px",marginBottom:14}}>🏆 Ranking de Produtos</div>
                {rankingProdutos.length===0 && <div style={{fontSize:12,color:"#444"}}>Sem dados ainda</div>}
                {rankingProdutos.slice(0,6).map((p,i)=>(
                  <div key={p.nome} style={{marginBottom:12}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:12,color:"#c9a84c",fontWeight:700,width:16}}>{i+1}.</span>
                        <span style={{fontSize:12,color:"#e8e4dc"}}>{p.nome}</span>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <span style={{fontSize:11,color:"#10b981",fontWeight:600}}>{p.conversao}%</span>
                        <span style={{fontSize:10,color:"#444",marginLeft:6}}>{p.fechados}/{p.total}</span>
                      </div>
                    </div>
                    <div style={{height:4,background:"#1a1a24",borderRadius:2}}>
                      <div style={{height:4,borderRadius:2,background:"#c9a84c",width:`${p.conversao}%`}}/>
                    </div>
                    <div style={{fontSize:10,color:"#555",marginTop:2}}>{fmt(p.receita)} gerados</div>
                  </div>
                ))}
              </div>
              <div className="card" style={{padding:18}}>
                <div style={{fontSize:11,color:"#3b82f6",textTransform:"uppercase",letterSpacing:"1px",marginBottom:14}}>⏱ Tempo Médio de Fechamento</div>
                <div style={{textAlign:"center",padding:"20px 0"}}>
                  {tempoMedio===null ? (
                    <div style={{fontSize:13,color:"#444"}}>Sem dados suficientes</div>
                  ):(
                    <>
                      <div style={{fontFamily:"Georgia,serif",fontSize:48,color:"#3b82f6",lineHeight:1}}>{tempoMedio}</div>
                      <div style={{fontSize:14,color:"#555",marginTop:4}}>dias do lead ao fechamento</div>
                      <div style={{fontSize:11,color:"#444",marginTop:16,padding:"10px",background:"#3b82f610",borderRadius:8,border:"1px solid #3b82f620"}}>
                        {tempoMedio<=7?"🔥 Excelente velocidade de fechamento!":tempoMedio<=14?"✅ Tempo dentro do esperado":tempoMedio<=30?"⚠️ Considere acelerar o follow-up":"🐢 Muitos leads demorando para fechar"}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FECHADOS */}
        {view==="fechados" && (()=>{
          const fechados = visitas.filter(v=>v.status==="fechado").sort((a,b)=>{
            const parseD=(s)=>{if(!s)return 0;const[d,m,a]=s.split("/");return new Date(+a, +m-1, +d).getTime();};
            return parseD(b.dataVisita)-parseD(a.dataVisita);
          });
          const [searchFechado, setSearchFechado] = [search, setSearch];
          const receitaTotal = fechados.reduce((a,v)=>a+valorFinal(v),0);
          const ticketMedio = fechados.length>0?receitaTotal/fechados.length:0;

          const filtrados = fechados.filter(v=>
            searchFechado===""||v.cliente?.toLowerCase().includes(searchFechado.toLowerCase())||v.telefone?.includes(searchFechado)||v.produtos?.toLowerCase().includes(searchFechado.toLowerCase())
          );

          return (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:22}}>✅ Negócios Fechados</div>
                  <div style={{fontSize:12,color:"#555",marginTop:2}}>{fechados.length} negócio{fechados.length!==1?"s":""} fechado{fechados.length!==1?"s":""}</div>
                </div>
              </div>

              {/* KPIs */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}} className="grid-4col">
                {[
                  {label:"Total Fechados",value:fechados.length,color:"#10b981"},
                  {label:"Receita Total",value:fmt(receitaTotal),color:"#c9a84c"},
                  {label:"Ticket Médio",value:fmt(ticketMedio),color:"#8b5cf6"},
                  {label:"Conversão Geral",value:`${stats.conversao}%`,color:"#3b82f6"},
                ].map((st,i)=>(
                  <div key={i} className="sc">
                    <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>{st.label}</div>
                    <div style={{fontFamily:"Georgia,serif",fontSize:i===1||i===2?16:22,color:st.color}}>{st.value}</div>
                  </div>
                ))}
              </div>

              {/* Busca */}
              <input className="inp" placeholder="🔍 Buscar por cliente, telefone, produto..." value={searchFechado} onChange={e=>setSearch(e.target.value)} style={{marginBottom:16}}/>

              {/* Lista */}
              {filtrados.length===0 ? (
                <div className="card" style={{padding:36,textAlign:"center",color:"#444",fontSize:13}}>Nenhum negócio fechado encontrado</div>
              ) : (
                <div className="card">
                  {filtrados.map((v,i)=>(
                    <div key={v.id||i} style={{padding:"16px",borderBottom:"1px solid #1a1a24",cursor:"pointer"}} onClick={()=>{setSelected(v);setView("detalhe")}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
                        <div style={{flex:1,minWidth:200}}>
                          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4,flexWrap:"wrap"}}>
                            <span style={{fontSize:15,fontWeight:700,color:"#e8e4dc"}}>{v.cliente}</span>
                            <span className="tag" style={{background:"#10b98115",color:"#10b981"}}>✅ Fechado</span>
                          </div>
                          <div style={{fontSize:12,color:"#777",marginTop:2}}>
                            {v.dataVisita}{v.ambiente?` · ${v.ambiente}`:""}{v.produtos?` · ${v.produtos}`:""}
                          </div>
                          <div style={{fontSize:11,color:"#555",marginTop:4}}>
                            📞 {v.telefone||"—"}{v.endereco?` · 📍 ${v.endereco}`:""}
                          </div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#10b981",fontWeight:700}}>{fmt(valorFinal(v))}</div>
                          {Number(v.desconto)>0 && <div style={{fontSize:11,color:"#f59e0b",marginTop:2}}>Desconto: {v.desconto}%</div>}
                          <div style={{fontSize:11,color:"#555",marginTop:4}}>Criado: {v.dataCriacao||"—"}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {/* Totalizador */}
                  <div style={{padding:"16px",background:"#0a0a12",borderTop:"2px solid #10b98140",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                    <div style={{fontSize:13,color:"#aaa",fontWeight:600}}>TOTAL — {filtrados.length} negócio{filtrados.length!==1?"s":""}</div>
                    <div style={{fontFamily:"Georgia,serif",fontSize:20,color:"#10b981"}}>{fmt(filtrados.reduce((a,v)=>a+valorFinal(v),0))}</div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* CANCELAMENTOS */}
        {view==="cancelamentos" && (()=>{
          const perdidos = visitas.filter(v=>v.status==="perdido");
          const total = visitas.length;

          // Motivos de compra dos perdidos
          const porMotivo = perdidos.reduce((acc,v)=>{
            const m = v.motivoCompra||"Não informado";
            acc[m]=(acc[m]||0)+1; return acc;
          },{});

          // Produtos dos perdidos
          const porProduto = perdidos.reduce((acc,v)=>{
            (v.produtos||"Não informado").split(",").forEach(p=>{
              const pt=p.trim()||"Não informado";
              acc[pt]=(acc[pt]||0)+1;
            }); return acc;
          },{});

          // Urgência dos perdidos
          const porUrgencia = perdidos.reduce((acc,v)=>{
            const u=v.urgencia||"Não informado";
            acc[u]=(acc[u]||0)+1; return acc;
          },{});

          // Valor médio perdido
          const valorPerdido = perdidos.reduce((acc,v)=>acc+valorFinal(v),0);

          const BarItem = ({label,count,total,color})=>(
            <div style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <span style={{fontSize:12,color:"#aaa"}}>{label}</span>
                <span style={{fontSize:12,color,fontWeight:600}}>{count} ({Math.round(count/total*100)}%)</span>
              </div>
              <div style={{height:6,background:"#1a1a24",borderRadius:3}}>
                <div style={{height:6,borderRadius:3,background:color,width:`${Math.round(count/total*100)}%`,transition:"width .5s"}}/>
              </div>
            </div>
          );

          return (
            <div>
              <div style={{fontFamily:"Georgia,serif",fontSize:22,marginBottom:4}}>📊 Análise de Cancelamentos</div>
              <div style={{fontSize:12,color:"#555",marginBottom:20}}>Entenda por que você está perdendo vendas</div>

              {/* KPIs */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14,marginBottom:20}} className="grid-4col">
                <div className="sc">
                  <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>Total Perdidos</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:28,color:"#ef4444"}}>{perdidos.length}</div>
                </div>
                <div className="sc">
                  <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>Taxa de Perda</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:28,color:"#f97316"}}>{total>0?Math.round(perdidos.length/total*100):0}%</div>
                </div>
                <div className="sc">
                  <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>Receita Perdida</div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:20,color:"#ef4444"}}>{fmt(valorPerdido)}</div>
                </div>
              </div>

              {perdidos.length===0 && <div className="card" style={{padding:36,textAlign:"center",color:"#444",fontSize:14}}>Nenhuma venda perdida! 🎉</div>}

              {perdidos.length>0 && (
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}} className="grid-2col">
                  <div className="card" style={{padding:18}}>
                    <div style={{fontSize:11,color:"#ef4444",textTransform:"uppercase",letterSpacing:"1px",marginBottom:14}}>Por Motivo de Compra</div>
                    {Object.entries(porMotivo).sort((a,b)=>b[1]-a[1]).map(([k,v])=>(
                      <BarItem key={k} label={k} count={v} total={perdidos.length} color="#ef4444"/>
                    ))}
                  </div>
                  <div className="card" style={{padding:18}}>
                    <div style={{fontSize:11,color:"#f97316",textTransform:"uppercase",letterSpacing:"1px",marginBottom:14}}>Por Produto</div>
                    {Object.entries(porProduto).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>(
                      <BarItem key={k} label={k} count={v} total={perdidos.length} color="#f97316"/>
                    ))}
                  </div>
                  <div className="card" style={{padding:18,gridColumn:"span 2"}} style={{padding:18}}>
                    <div style={{fontSize:11,color:"#8b5cf6",textTransform:"uppercase",letterSpacing:"1px",marginBottom:14}}>Por Urgência</div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                      {Object.entries(porUrgencia).sort((a,b)=>b[1]-a[1]).map(([k,v])=>(
                        <BarItem key={k} label={k} count={v} total={perdidos.length} color="#8b5cf6"/>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {perdidos.length>0 && (
                <div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:16,marginBottom:10}}>❌ Vendas Perdidas</div>
                  <div className="card">
                    {perdidos.map(v=>(
                      <div key={v.id} style={{padding:"12px 16px",borderBottom:"1px solid #1a1a24",cursor:"pointer"}} onClick={()=>{setSelected(v);setView("detalhe")}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <div style={{fontSize:14,fontWeight:600}}>{v.cliente}</div>
                            <div style={{fontSize:11,color:"#555",marginTop:2}}>{v.dataVisita} · {v.produtos||"—"} · {v.motivoCompra||"—"}</div>
                          </div>
                          {v.valorOrcamento&&<div style={{fontSize:13,color:"#ef4444",fontWeight:600}}>-{fmt(valorFinal(v))}</div>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* OCORRÊNCIAS */}
        {view==="ocorrencias" && (()=>{
          const TIPOS = ["Peça a pedir","Erro de fábrica","Erro de medida","Defeito no produto","Problema na instalação","Retrabalho","Outro"];
          const STATUS_OC = {
            aberto:    {label:"Aberto",    color:"#ef4444", bg:"#ef444415", icon:"🔴"},
            andamento: {label:"Em andamento", color:"#f59e0b", bg:"#f59e0b15", icon:"🟡"},
            aguardando:{label:"Aguardando peça", color:"#8b5cf6", bg:"#8b5cf615", icon:"🟣"},
            resolvido: {label:"Resolvido", color:"#10b981", bg:"#10b98115", icon:"✅"},
          };

          const salvarOc = async () => {
            if(!formOcorrencia.cliente||!formOcorrencia.tipo) return;
            try {
              if(formOcorrencia.id){
                await dbOcorrencias.update(formOcorrencia.id, formOcorrencia);
              } else {
                await dbOcorrencias.insert(formOcorrencia);
              }
              setOcorrencias(await dbOcorrencias.get());
              showToast("Ocorrência salva!");
            } catch(e) { console.error(e); showToast("Erro ao salvar","erro"); }
            setFormOcorrencia(null);
          };

          const abertas = ocorrencias.filter(o=>o.status_oc!=="resolvido").length;

          return (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4,flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:22}}>🔧 Ocorrências</div>
                  <div style={{fontSize:12,color:"#555",marginTop:2}}>{abertas} em aberto · {ocorrencias.length} total</div>
                </div>
                <button className="btn bp" onClick={()=>setFormOcorrencia({...emptyOc})}>+ Nova Ocorrência</button>
              </div>

              {/* Busca */}
              <input className="inp" placeholder="🔍 Buscar por cliente, tipo..." value={searchOcorrencia} onChange={e=>setSearchOcorrencia(e.target.value)} style={{marginBottom:16,marginTop:10}}/>

              {/* Formulário */}
              {formOcorrencia && (
                <div className="card" style={{padding:20,marginBottom:16,borderColor:"#ef444440",marginTop:16}}>
                  <div style={{fontSize:11,color:"#ef4444",textTransform:"uppercase",letterSpacing:"1px",marginBottom:16}}>
                    {formOcorrencia.id?"✎ Editar":"+ Nova"} Ocorrência
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}} className="grid-2col">
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Cliente *</label>
                      <input className="inp" placeholder="Nome do cliente" value={formOcorrencia.cliente} onChange={e=>setFormOcorrencia({...formOcorrencia,cliente:e.target.value})}/>
                    </div>
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Telefone</label>
                      <input className="inp" placeholder="(11) 99999-9999" value={formOcorrencia.telefone} onChange={e=>setFormOcorrencia({...formOcorrencia,telefone:e.target.value})}/>
                    </div>
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Tipo de Problema *</label>
                      <select className="inp" value={formOcorrencia.tipo} onChange={e=>setFormOcorrencia({...formOcorrencia,tipo:e.target.value})}>
                        <option value="">Selecionar...</option>
                        {TIPOS.map(t=><option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Status</label>
                      <select className="inp" value={formOcorrencia.status_oc} onChange={e=>setFormOcorrencia({...formOcorrencia,status_oc:e.target.value})}>
                        {Object.entries(STATUS_OC).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Previsão de Resolução</label>
                      <input className="inp" type="date" value={brToIso(formOcorrencia.previsao)} onChange={e=>setFormOcorrencia({...formOcorrencia,previsao:isoToBr(e.target.value)})}/>
                    </div>
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Data de Abertura</label>
                      <input className="inp" value={formOcorrencia.data_abertura} onChange={e=>setFormOcorrencia({...formOcorrencia,data_abertura:e.target.value})}/>
                    </div>
                    <div style={{gridColumn:"span 2"}}>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Descrição do Problema</label>
                      <textarea className="inp" placeholder="Descreva o problema detalhadamente..." value={formOcorrencia.descricao} onChange={e=>setFormOcorrencia({...formOcorrencia,descricao:e.target.value})} style={{minHeight:80}}/>
                    </div>
                    {formOcorrencia.status_oc==="resolvido" && (
                      <div style={{gridColumn:"span 2"}}>
                        <label style={{fontSize:11,color:"#10b981",display:"block",marginBottom:5}}>Como foi resolvido?</label>
                        <textarea className="inp" placeholder="Descreva a solução..." value={formOcorrencia.resolucao} onChange={e=>setFormOcorrencia({...formOcorrencia,resolucao:e.target.value})} style={{minHeight:60,borderColor:"#10b98140"}}/>
                      </div>
                    )}
                  </div>

                  {/* WhatsApp para o cliente da ocorrência */}
                  {formOcorrencia.telefone && (
                    <div style={{marginBottom:12}}>
                      <label style={{fontSize:11,color:"#25d366",display:"block",marginBottom:6}}>💬 Avisar cliente pelo WhatsApp</label>
                      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                        {[
                          {label:"Informar problema", msg:`Olá, ${formOcorrencia.cliente?.split(" ")[0]}! Tudo bem?\n\nEstou entrando em contato para informar que identificamos um problema com seu pedido: *${formOcorrencia.tipo}*.\n\nJá estamos providenciando a solução e em breve retornaremos com uma previsão.\n\n${userInfo.nome} - Persianas em Casa`},
                          {label:"Dar prazo", msg:`Olá, ${formOcorrencia.cliente?.split(" ")[0]}! Tudo bem?\n\nPassando para informar que a previsão de resolução do seu problema é *${formOcorrencia.previsao||"em breve"}*.\n\nQualquer dúvida estou à disposição!\n\n${userInfo.nome} - Persianas em Casa`},
                          {label:"Resolver", msg:`Olá, ${formOcorrencia.cliente?.split(" ")[0]}! Tudo bem?\n\nBoa notícia! O problema com seu pedido foi resolvido. ✅\n\nEntre em contato para agendarmos a próxima etapa.\n\n${userInfo.nome} - Persianas em Casa`},
                        ].map(t=>(
                          <a key={t.label} href={`https://wa.me/55${formOcorrencia.telefone?.replace(/\D/g,"")}?text=${encodeURIComponent(t.msg)}`} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                            <button className="sb" style={{color:"#25d366",borderColor:"#25d36640",fontSize:12}}>💬 {t.label}</button>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div style={{display:"flex",gap:10}}>
                    <button className="btn bp" onClick={salvarOc} disabled={!formOcorrencia.cliente||!formOcorrencia.tipo}>Salvar</button>
                    <button className="btn bg" onClick={()=>setFormOcorrencia(null)}>Cancelar</button>
                  </div>
                </div>
              )}

              {/* KPIs */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,margin:"16px 0"}} className="grid-4col">
                {Object.entries(STATUS_OC).map(([k,s])=>(
                  <div key={k} className="sc" style={{borderTop:`2px solid ${s.color}`}}>
                    <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:6}}>{s.icon} {s.label}</div>
                    <div style={{fontFamily:"Georgia,serif",fontSize:24,color:s.color}}>{ocorrencias.filter(o=>o.status_oc===k).length}</div>
                  </div>
                ))}
              </div>

              {/* Lista */}
              {ocorrencias.length===0 && !formOcorrencia && (
                <div className="card" style={{padding:36,textAlign:"center",color:"#444",fontSize:13}}>Nenhuma ocorrência registrada 🎉</div>
              )}
              <div className="card">
                {ocorrencias.filter(oc=>searchOcorrencia===""||oc.cliente?.toLowerCase().includes(searchOcorrencia.toLowerCase())||oc.tipo?.toLowerCase().includes(searchOcorrencia.toLowerCase())||oc.descricao?.toLowerCase().includes(searchOcorrencia.toLowerCase())).map((oc,idx)=>(
                  <div key={oc.id||idx} style={{padding:"14px 16px",borderBottom:"1px solid #1a1a24"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:10}}>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4,flexWrap:"wrap"}}>
                          <span style={{fontSize:14,fontWeight:600}}>{oc.cliente}</span>
                          <span className="tag" style={{background:STATUS_OC[oc.status_oc]?.bg,color:STATUS_OC[oc.status_oc]?.color}}>
                            {STATUS_OC[oc.status_oc]?.icon} {STATUS_OC[oc.status_oc]?.label}
                          </span>
                          <span style={{fontSize:11,padding:"3px 8px",borderRadius:20,background:"#1a1a24",color:"#777"}}>{oc.tipo}</span>
                        </div>
                        {oc.descricao && <div style={{fontSize:12,color:"#666",marginBottom:4}}>{oc.descricao}</div>}
                        {oc.resolucao && <div style={{fontSize:12,color:"#10b981",marginBottom:4}}>✅ {oc.resolucao}</div>}
                        <div style={{fontSize:11,color:"#444"}}>
                          Aberto em {oc.data_abertura}
                          {oc.previsao&&<span> · Previsão: {oc.previsao}</span>}
                          {oc.telefone&&<span> · {oc.telefone}</span>}
                        </div>
                      </div>
                      <div style={{display:"flex",gap:6,flexShrink:0}}>
                        <button className="btn bg" style={{fontSize:12,padding:"6px 10px"}} onClick={()=>setFormOcorrencia({...oc})}>✎</button>
                        <button className="btn bd" style={{fontSize:12,padding:"6px 10px"}} onClick={async()=>{if(window.confirm("Excluir?")){await dbOcorrencias.delete(oc.id);setOcorrencias(await dbOcorrencias.get());showToast("Ocorrência excluída!");}}}>✕</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* ROTA DO DIA */}
        {view==="rota" && (()=>{
          const visitasHoje = visitas.filter(v=>v.dataVisita===hoje).sort((a,b)=>a.horaVisita?.localeCompare(b.horaVisita));
          const enderecos = visitasHoje.map(v=>encodeURIComponent(v.endereco||"")).filter(Boolean);
          const urlMaps = enderecos.length>0 ? `https://www.google.com/maps/dir/${enderecos.join("/")}` : null;
          const itens = [{k:"trena",l:"📏 Trena"},{k:"amostras",l:"🎨 Amostras de tecido"},{k:"tablet",l:"📱 Tablet/celular carregado"},{k:"cartao",l:"💳 Cartão de visita"},{k:"contrato",l:"📄 Contrato/proposta"},{k:"caneta",l:"✏️ Caneta"},{k:"uniforme",l:"👔 Uniforme"}];
          const prontos = Object.values(checklist).filter(Boolean).length;
          return (
            <div>
              <div style={{fontFamily:"Georgia,serif",fontSize:22,marginBottom:4}}>🗺️ Rota do Dia</div>
              <div style={{fontSize:12,color:"#555",marginBottom:20}}>{hoje} · {visitasHoje.length} visita{visitasHoje.length!==1?"s":""}</div>

              {/* Checklist de saída */}
              <div className="card" style={{padding:18,marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                  <div style={{fontSize:11,color:"#c9a84c",textTransform:"uppercase",letterSpacing:"1px"}}>✅ Checklist de Saída</div>
                  <div style={{fontSize:12,color:prontos===itens.length?"#10b981":"#f59e0b",fontWeight:600}}>{prontos}/{itens.length} itens</div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                  {itens.map(({k,l})=>(
                    <label key={k} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,background:checklist[k]?"#10b98110":"#0d0d15",border:`1px solid ${checklist[k]?"#10b98140":"#1e1e28"}`,cursor:"pointer",transition:"all .15s"}}>
                      <input type="checkbox" checked={checklist[k]} onChange={()=>setChecklist({...checklist,[k]:!checklist[k]})} style={{accentColor:"#10b981",width:16,height:16}}/>
                      <span style={{fontSize:13,color:checklist[k]?"#10b981":"#aaa"}}>{l}</span>
                    </label>
                  ))}
                </div>
                {prontos===itens.length && <div style={{marginTop:12,padding:"10px",background:"#10b98115",border:"1px solid #10b98130",borderRadius:8,textAlign:"center",fontSize:13,color:"#10b981",fontWeight:600}}>🚀 Tudo pronto! Boa visita!</div>}
              </div>

              {/* Visitas do dia */}
              <div className="card" style={{marginBottom:16}}>
                {visitasHoje.length===0 && <div style={{padding:32,textAlign:"center",color:"#444",fontSize:13}}>Nenhuma visita agendada para hoje</div>}
                {visitasHoje.map((v,i)=>(
                  <div key={v.id} style={{padding:"14px 16px",borderBottom:"1px solid #1a1a24"}}>
                    <div style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                      <div style={{width:28,height:28,borderRadius:"50%",background:"#c9a84c20",border:"1px solid #c9a84c40",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"#c9a84c",fontWeight:700,flexShrink:0}}>{i+1}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:14,fontWeight:600}}>{v.cliente}</div>
                        <div style={{fontSize:12,color:"#c9a84c",marginTop:2}}>🕐 {v.horaVisita}</div>
                        <div style={{fontSize:11,color:"#555",marginTop:2}}>📍 {v.endereco}</div>
                        <div style={{fontSize:11,color:"#777",marginTop:1}}>🏠 {v.ambiente} · {v.produtos||"—"}</div>
                      </div>
                      <div style={{display:"flex",flexDirection:"column",gap:6}}>
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(v.endereco||"")}`} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                          <button className="sb" style={{color:"#3b82f6",borderColor:"#3b82f640",fontSize:11}}>📍 Maps</button>
                        </a>
                        <a href={`https://wa.me/55${v.telefone?.replace(/\D/g,"")}?text=${encodeURIComponent(`Olá, ${v.cliente?.split(" ")[0]}! Estou a caminho para nossa visita às ${v.horaVisita}. Até logo! 😊\n\n${userInfo.nome} - Persianas em Casa`)}`} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                          <button className="sb" style={{color:"#25d366",borderColor:"#25d36640",fontSize:11}}>💬 Aviso</button>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botão rota completa */}
              {urlMaps && (
                <a href={urlMaps} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                  <button className="btn bp" style={{width:"100%",padding:14,fontSize:15}}>🗺️ Abrir Rota Completa no Google Maps</button>
                </a>
              )}
            </div>
          );
        })()}

        {/* SIMULADOR DE DESCONTO */}
        {view==="simulador" && (()=>{
          const pct = comissao.pct;
          const vFinal = simValor ? Number(simValor)*(1-simDesc/100) : 0;
          const comissaoSim = vFinal * pct / 100;
          const faixas = [0,5,10,15,20];
          return (
            <div>
              <div style={{fontFamily:"Georgia,serif",fontSize:22,marginBottom:4}}>🧮 Simulador de Desconto</div>
              <div style={{fontSize:12,color:"#555",marginBottom:20}}>Calcule o impacto do desconto na sua comissão em tempo real</div>

              <div className="card" style={{padding:24,marginBottom:16}}>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}} className="grid-2col">
                  <div>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:8}}>Valor do Orçamento (R$)</label>
                    <input className="inp" type="number" placeholder="Ex: 15000" value={simValor} onChange={e=>setSimValor(e.target.value)} style={{fontSize:18}}/>
                  </div>
                  <div>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:8}}>Desconto: <span style={{color:"#ef4444",fontWeight:600}}>{simDesc}%</span></label>
                    <input type="range" min={0} max={30} value={simDesc} onChange={e=>setSimDesc(Number(e.target.value))} style={{width:"100%",accentColor:"#c9a84c",marginTop:8}}/>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#444",marginTop:4}}><span>0%</span><span>15%</span><span>30%</span></div>
                  </div>
                </div>

                {simValor && (
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12,marginBottom:20}}>
                    <div style={{padding:16,borderRadius:10,background:"#0d0d15",border:"1px solid #1e1e28",textAlign:"center"}}>
                      <div style={{fontSize:10,color:"#555",marginBottom:6}}>VALOR FINAL</div>
                      <div style={{fontFamily:"Georgia,serif",fontSize:20,color:"#e8e4dc"}}>{fmt(vFinal)}</div>
                    </div>
                    <div style={{padding:16,borderRadius:10,background:"#c9a84c10",border:"1px solid #c9a84c30",textAlign:"center"}}>
                      <div style={{fontSize:10,color:"#c9a84c",marginBottom:6}}>SUA COMISSÃO ({pct}%)</div>
                      <div style={{fontFamily:"Georgia,serif",fontSize:20,color:"#c9a84c"}}>{fmt(comissaoSim)}</div>
                    </div>
                    <div style={{padding:16,borderRadius:10,background:simDesc>0?"#ef444410":"#10b98110",border:`1px solid ${simDesc>0?"#ef444430":"#10b98130"}`,textAlign:"center"}}>
                      <div style={{fontSize:10,color:simDesc>0?"#ef4444":"#10b981",marginBottom:6}}>DESCONTO DADO</div>
                      <div style={{fontFamily:"Georgia,serif",fontSize:20,color:simDesc>0?"#ef4444":"#10b981"}}>{fmt(Number(simValor)*simDesc/100)}</div>
                    </div>
                  </div>
                )}

                {simValor && (
                  <div>
                    <div style={{fontSize:11,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:12}}>Comparativo de Descontos</div>
                    <div style={{display:"flex",flexDirection:"column",gap:6}}>
                      {faixas.map(d=>{
                        const vf=Number(simValor)*(1-d/100);
                        const com=vf*pct/100;
                        const isAtual=d===simDesc;
                        return (
                          <div key={d} onClick={()=>setSimDesc(d)} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 14px",borderRadius:8,background:isAtual?"#c9a84c15":"#0d0d15",border:`1px solid ${isAtual?"#c9a84c":"#1e1e28"}`,cursor:"pointer",transition:"all .15s"}}>
                            <span style={{fontSize:13,color:isAtual?"#c9a84c":"#aaa",fontWeight:isAtual?700:400}}>{d}% desconto</span>
                            <div style={{textAlign:"right"}}>
                              <div style={{fontSize:13,color:"#e8e4dc"}}>{fmt(vf)}</div>
                              <div style={{fontSize:11,color:"#10b981"}}>comissão: {fmt(com)}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

        {/* TICKETS */}
        {view==="tickets" && (()=>{
          const STATUS_TK = {
            aberto:      {label:"🔴 Aberto",      color:"#ef4444", bg:"#ef444415"},
            andamento:   {label:"🟡 Em andamento", color:"#f59e0b", bg:"#f59e0b15"},
            aguardando:  {label:"🟣 Aguardando",   color:"#8b5cf6", bg:"#8b5cf615"},
            resolvido:   {label:"✅ Resolvido",    color:"#10b981", bg:"#10b98115"},
          };
          const TIPOS = ["Instalação","Produto/Estoque","Sistema/Tecnologia","Pagamento/Financeiro","Relacionamento com cliente","Outro"];
          const abertos = tickets.filter(t=>t.status==="aberto").length;
          const andamento = tickets.filter(t=>t.status==="andamento").length;
          const resolvidos = tickets.filter(t=>t.status==="resolvido").length;

          const salvarTicket = async () => {
            if (!formTicket.descricao||!formTicket.tipo) return;
            try {
              if (formTicket.id) {
                await dbTickets.update(formTicket.id, formTicket);
              } else {
                const num = `TK-${String(tickets.length+1).padStart(4,"0")}`;
                await dbTickets.insert({...formTicket, numero:num});
              }
              setTickets(await dbTickets.get());
              showToast("Ticket salvo!");
            } catch(e) { console.error(e); showToast("Erro ao salvar","erro"); }
            setFormTicket(null);
          };

          return (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:22}}>🎫 Tickets</div>
                  <div style={{fontSize:12,color:"#555",marginTop:2}}>{tickets.length} ticket{tickets.length!==1?"s":""} registrado{tickets.length!==1?"s":""}</div>
                </div>
                <button className="btn bp" onClick={()=>setFormTicket({...emptyTicket})}>+ Novo Ticket</button>
              </div>

              {/* Busca */}
              <input className="inp" placeholder="🔍 Buscar por descrição, tipo..." value={searchTicket} onChange={e=>setSearchTicket(e.target.value)} style={{marginBottom:16}}/>

              {/* KPIs */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}} className="grid-4col">
                {[
                  {l:"Abertos",    v:abertos,    c:"#ef4444"},
                  {l:"Em andamento",v:andamento,  c:"#f59e0b"},
                  {l:"Resolvidos", v:resolvidos,  c:"#10b981"},
                  {l:"Total",      v:tickets.length, c:"#c9a84c"},
                ].map((k,i)=>(
                  <div key={i} className="sc" style={{textAlign:"center"}}>
                    <div style={{fontFamily:"Georgia,serif",fontSize:28,color:k.c}}>{k.v}</div>
                    <div style={{fontSize:10,color:"#555",marginTop:4,textTransform:"uppercase",letterSpacing:"1px"}}>{k.l}</div>
                  </div>
                ))}
              </div>

              {/* Formulário novo/editar */}
              {formTicket && (
                <div className="card" style={{padding:20,marginBottom:20,border:"1px solid #c9a84c40"}}>
                  <div style={{fontSize:13,color:"#c9a84c",fontWeight:700,marginBottom:16}}>
                    {formTicket.id?"✏️ Editar Ticket":"🆕 Novo Ticket"}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}} className="grid-2col">
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6}}>Tipo do Problema *</label>
                      <select className="inp" value={formTicket.tipo} onChange={e=>setFormTicket({...formTicket,tipo:e.target.value})}>
                        <option value="">Selecione...</option>
                        {TIPOS.map(t=><option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6}}>Status</label>
                      <select className="inp" value={formTicket.status} onChange={e=>setFormTicket({...formTicket,status:e.target.value})}>
                        {Object.entries(STATUS_TK).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6}}>Data de Abertura</label>
                      <input className="inp" value={formTicket.dataAbertura} onChange={e=>setFormTicket({...formTicket,dataAbertura:e.target.value})}/>
                    </div>
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6}}>Quem Abriu</label>
                      <input className="inp" value={formTicket.quemAbriu} onChange={e=>setFormTicket({...formTicket,quemAbriu:e.target.value})}/>
                    </div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6}}>Descrição do Problema *</label>
                    <textarea className="inp" rows={3} style={{resize:"vertical"}} placeholder="Descreva o problema com detalhes..." value={formTicket.descricao} onChange={e=>setFormTicket({...formTicket,descricao:e.target.value})}/>
                  </div>
                  <div style={{marginBottom:16}}>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6}}>Observações / Atualizações</label>
                    <textarea className="inp" rows={2} style={{resize:"vertical"}} placeholder="Atualizações, respostas recebidas..." value={formTicket.observacoes} onChange={e=>setFormTicket({...formTicket,observacoes:e.target.value})}/>
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <button className="btn bp" onClick={salvarTicket}>💾 Salvar</button>
                    <button className="btn bg" style={{color:"#777",borderColor:"#333"}} onClick={()=>setFormTicket(null)}>Cancelar</button>
                  </div>
                </div>
              )}

              {/* Lista de tickets */}
              <div className="card">
                {tickets.length===0 && (
                  <div style={{padding:40,textAlign:"center",color:"#444",fontSize:13}}>
                    <div style={{fontSize:32,marginBottom:8}}>🎫</div>
                    Nenhum ticket registrado ainda
                  </div>
                )}
                {tickets.filter(t=>searchTicket===""||t.descricao?.toLowerCase().includes(searchTicket.toLowerCase())||t.tipo?.toLowerCase().includes(searchTicket.toLowerCase())||t.numero?.toLowerCase().includes(searchTicket.toLowerCase())).map((t,i)=>{
                  const st = STATUS_TK[t.status]||STATUS_TK.aberto;
                  return (
                    <div key={i} style={{padding:"16px",borderBottom:"1px solid #1a1a24"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                            <span style={{fontFamily:"Georgia,serif",fontSize:13,color:"#c9a84c",fontWeight:700}}>{t.numero}</span>
                            <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:st.bg,color:st.color,fontWeight:600}}>{st.label}</span>
                            <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:"#1e1e28",color:"#aaa"}}>{t.tipo}</span>
                          </div>
                          <div style={{fontSize:13,color:"#e8e4dc",marginBottom:4}}>{t.descricao}</div>
                          {t.observacoes && <div style={{fontSize:11,color:"#777",fontStyle:"italic",marginTop:4}}>💬 {t.observacoes}</div>}
                          <div style={{fontSize:10,color:"#444",marginTop:6}}>📅 {t.dataAbertura} · 👤 {t.quemAbriu}</div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                          <button className="sb" style={{fontSize:11}} onClick={()=>setFormTicket({...t})}>✏️ Editar</button>
                          {t.status!=="resolvido" && (
                            <button className="sb" style={{fontSize:11,color:"#10b981",borderColor:"#10b98140"}} onClick={async()=>{
                              await dbTickets.update(t.id,{...t,status:"resolvido"});
                              setTickets(await dbTickets.get());
                              showToast("Ticket resolvido!");
                            }}>✅ Resolver</button>
                          )}
                          <button className="sb" style={{fontSize:11,color:"#ef4444",borderColor:"#ef444440"}} onClick={async()=>{
                            if(!window.confirm("Excluir este ticket?")) return;
                            await dbTickets.delete(t.id);
                            setTickets(await dbTickets.get());
                          }}>🗑️ Excluir</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* NOTAS */}
        {view==="notas" && (()=>{
          const CORES = [
            {label:"Escuro",  val:"1e1e28"},
            {label:"Azul",    val:"0d1b3e"},
            {label:"Verde",   val:"0a2a1a"},
            {label:"Dourado", val:"2a1f00"},
            {label:"Roxo",    val:"1a0a2e"},
            {label:"Vermelho",val:"2a0a0a"},
          ];
          const notasFiltradas = notas
            .filter(n => filtroNota==="Todas" || n.categoria===filtroNota)
            .sort((a,b) => (b.fixada?1:0)-(a.fixada?1:0));

          const salvarNota = async () => {
            if (!formNota.titulo.trim()) return;
            try {
              if (formNota.id) {
                await dbNotas.update(formNota.id, formNota);
              } else {
                await dbNotas.insert({...formNota, data:hoje});
              }
              setNotas(await dbNotas.get());
              showToast("Nota salva!");
            } catch(e) { console.error(e); showToast("Erro ao salvar","erro"); }
            setFormNota(null);
          };

          return (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:22}}>📝 Notas</div>
                  <div style={{fontSize:12,color:"#555",marginTop:2}}>{notas.filter(n=>n.fixada).length} fixada{notas.filter(n=>n.fixada).length!==1?"s":""} · {notas.length} no total</div>
                </div>
                <button className="btn bp" onClick={()=>setFormNota({...emptyNota})}>+ Nova Nota</button>
              </div>

              {/* Filtro por categoria */}
              <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
                {["Todas",...CATS_NOTA].map(c=>(
                  <button key={c} onClick={()=>setFiltroNota(c)} style={{padding:"5px 12px",borderRadius:20,border:`1px solid ${filtroNota===c?"#c9a84c":"#2a2a3a"}`,background:filtroNota===c?"#c9a84c20":"transparent",color:filtroNota===c?"#c9a84c":"#777",fontSize:11,cursor:"pointer",transition:"all .15s"}}>
                    {c}
                  </button>
                ))}
              </div>

              {/* Formulário */}
              {formNota && (
                <div className="card" style={{padding:20,marginBottom:20,border:"1px solid #c9a84c40"}}>
                  <div style={{fontSize:13,color:"#c9a84c",fontWeight:700,marginBottom:14}}>
                    {formNota.id?"✏️ Editar Nota":"🆕 Nova Nota"}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}} className="grid-2col">
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6}}>Título *</label>
                      <input className="inp" placeholder="Ex: Ideias para fechar mais..." value={formNota.titulo} onChange={e=>setFormNota({...formNota,titulo:e.target.value})}/>
                    </div>
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6}}>Categoria</label>
                      <select className="inp" value={formNota.categoria} onChange={e=>setFormNota({...formNota,categoria:e.target.value})}>
                        {CATS_NOTA.map(c=><option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6}}>Conteúdo da nota</label>
                    <textarea className="inp" rows={5} style={{resize:"vertical",fontFamily:"monospace",fontSize:13}} placeholder="Escreva aqui..." value={formNota.texto} onChange={e=>setFormNota({...formNota,texto:e.target.value})}/>
                  </div>
                  <div style={{marginBottom:16}}>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:8}}>Cor da nota</label>
                    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                      {CORES.map(c=>(
                        <div key={c.val} onClick={()=>setFormNota({...formNota,cor:c.val})} style={{width:28,height:28,borderRadius:8,background:`#${c.val}`,border:`2px solid ${formNota.cor===c.val?"#c9a84c":"#333"}`,cursor:"pointer",transition:"all .15s"}} title={c.label}/>
                      ))}
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
                    <label style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
                      <input type="checkbox" checked={formNota.fixada} onChange={e=>setFormNota({...formNota,fixada:e.target.checked})} style={{accentColor:"#c9a84c",width:16,height:16}}/>
                      <span style={{fontSize:13,color:"#aaa"}}>📌 Fixar esta nota no topo</span>
                    </label>
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <button className="btn bp" onClick={salvarNota}>💾 Salvar</button>
                    <button className="btn bg" style={{color:"#777",borderColor:"#333"}} onClick={()=>setFormNota(null)}>Cancelar</button>
                  </div>
                </div>
              )}

              {/* Grid de notas */}
              {notasFiltradas.length===0 && (
                <div style={{padding:40,textAlign:"center",color:"#444",fontSize:13}}>
                  <div style={{fontSize:36,marginBottom:8}}>📝</div>
                  Nenhuma nota encontrada
                </div>
              )}
              <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:14}}>
                {notasFiltradas.map((n,i)=>{
                  const idxReal = notas.indexOf(n);
                  return (
                    <div key={i} style={{background:`#${n.cor}`,border:`1px solid ${n.fixada?"#c9a84c40":"#2a2a3a"}`,borderRadius:12,padding:16,position:"relative",transition:"all .2s"}}>
                      {n.fixada && <div style={{position:"absolute",top:10,right:12,fontSize:14}}>📌</div>}
                      <div style={{fontSize:11,color:"#c9a84c",marginBottom:6}}>{n.categoria}</div>
                      <div style={{fontFamily:"Georgia,serif",fontSize:15,fontWeight:700,color:"#e8e4dc",marginBottom:8,paddingRight:20}}>{n.titulo}</div>
                      {n.texto && <div style={{fontSize:12,color:"#aaa",lineHeight:1.6,whiteSpace:"pre-wrap",marginBottom:12,maxHeight:120,overflow:"hidden"}}>{n.texto}</div>}
                      <div style={{fontSize:10,color:"#444",marginBottom:10}}>📅 {n.data}</div>
                      <div style={{display:"flex",gap:8}}>
                        <button className="sb" style={{fontSize:11,flex:1}} onClick={()=>setFormNota({...n})}>✏️ Editar</button>
                        <button className="sb" style={{fontSize:11,color:n.fixada?"#f59e0b":"#aaa",borderColor:n.fixada?"#f59e0b40":"#333"}} onClick={async()=>{
                          await dbNotas.update(n.id,{...n,fixada:!n.fixada});
                          setNotas(await dbNotas.get());
                        }}>📌</button>
                        <button className="sb" style={{fontSize:11,color:"#ef4444",borderColor:"#ef444440"}} onClick={async()=>{
                          if(!window.confirm("Excluir esta nota?")) return;
                          await dbNotas.delete(n.id);
                          setNotas(await dbNotas.get());
                        }}>🗑️</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

        {/* PEDIDOS FÁBRICA */}
        {view==="fabrica" && (()=>{
          const emAndamento = pedidosFabrica.filter(p=>!["entregue","instalado"].includes(p.statusFabrica));
          const concluidos = pedidosFabrica.filter(p=>["entregue","instalado"].includes(p.statusFabrica));
          const atrasados = emAndamento.filter(p=>{
            if(!p.previsaoEntrega) return false;
            const [d,m,a] = p.previsaoEntrega.split("/");
            return new Date(+a, +m-1, +d) < new Date();
          });

          const salvarPedido = async () => {
            if(!formPedido.numeroPedido||!formPedido.cliente) return;
            const prazo = calcPrazo(formPedido.dataEnvio, formPedido.produtos);
            const pedido = {...formPedido, previsaoEntrega: formPedido.previsaoEntrega||prazo||""};
            try {
              if(formPedido.id) {
                await dbPedidos.update(formPedido.id, pedido);
              } else {
                await dbPedidos.insert(pedido);
              }
              setPedidosFabrica(await dbPedidos.get());
              showToast("Pedido salvo!");
            } catch(e) { console.error(e); showToast("Erro ao salvar","erro"); }
            setFormPedido(null);
          };

          return (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:22}}>🏭 Pedidos Fábrica</div>
                  <div style={{fontSize:12,color:"#555",marginTop:2}}>{emAndamento.length} em andamento · {atrasados.length} atrasado{atrasados.length!==1?"s":""}</div>
                </div>
                <button className="btn bp" onClick={()=>setFormPedido({...emptyPedido})}>+ Novo Pedido</button>
              </div>

              {/* Busca */}
              <input className="inp" placeholder="🔍 Buscar por cliente, nº pedido, produto..." value={searchPedido} onChange={e=>setSearchPedido(e.target.value)} style={{marginBottom:16}}/>
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}} className="grid-4col">
                {[
                  {l:"Em andamento", v:emAndamento.length,      c:"#3b82f6"},
                  {l:"Atrasados",    v:atrasados.length,        c:"#ef4444"},
                  {l:"Prontos",      v:pedidosFabrica.filter(p=>p.statusFabrica==="pronto").length, c:"#10b981"},
                  {l:"Concluídos",   v:concluidos.length,       c:"#c9a84c"},
                ].map((k,i)=>(
                  <div key={i} className="sc" style={{textAlign:"center"}}>
                    <div style={{fontFamily:"Georgia,serif",fontSize:28,color:k.c}}>{k.v}</div>
                    <div style={{fontSize:10,color:"#555",marginTop:4,textTransform:"uppercase",letterSpacing:"1px"}}>{k.l}</div>
                  </div>
                ))}
              </div>

              {/* Formulário */}
              {formPedido && (
                <div className="card" style={{padding:20,marginBottom:20,border:"1px solid #c9a84c40"}}>
                  <div style={{fontSize:13,color:"#c9a84c",fontWeight:700,marginBottom:16}}>
                    {formPedido.id?"✏️ Editar Pedido":"🆕 Novo Pedido"}
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:12}} className="grid-2col">
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6}}>Nº do Pedido *</label>
                      <input className="inp" placeholder="Ex: 000415" value={formPedido.numeroPedido} onChange={e=>setFormPedido({...formPedido,numeroPedido:e.target.value})}/>
                    </div>
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6}}>Cliente *</label>
                      <input className="inp" placeholder="Nome do cliente" value={formPedido.cliente} onChange={e=>setFormPedido({...formPedido,cliente:e.target.value})}/>
                    </div>
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6}}>Valor do Pedido (R$) *</label>
                      <input className="inp" type="number" placeholder="0,00" value={formPedido.valorPedido} onChange={e=>setFormPedido({...formPedido,valorPedido:e.target.value})}/>
                    </div>
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6}}>Data de Envio</label>
                      <input className="inp" type="date" value={brToIso(formPedido.dataEnvio)} onChange={e=>{
                        const novaData = isoToBr(e.target.value);
                        const novoPrazo = calcPrazo(novaData, formPedido.produtos);
                        setFormPedido({...formPedido, dataEnvio:novaData, previsaoEntrega:novoPrazo||formPedido.previsaoEntrega});
                      }}/>
                    </div>
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6}}>Status</label>
                      <select className="inp" value={formPedido.statusFabrica} onChange={e=>setFormPedido({...formPedido,statusFabrica:e.target.value})}>
                        {Object.entries(STATUS_FABRICA).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                      </select>
                    </div>
                    <div style={{gridColumn:"span 2"}}>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6}}>Produtos</label>
                      <input className="inp" placeholder="Ex: Rolo Motorizado, Cortina..." value={formPedido.produtos} onChange={e=>{
                        const novoProd = e.target.value;
                        const novoPrazo = calcPrazo(formPedido.dataEnvio, novoProd);
                        setFormPedido({...formPedido, produtos:novoProd, previsaoEntrega:novoPrazo||formPedido.previsaoEntrega});
                      }}/>
                      {formPedido.dataEnvio && (
                        <div style={{fontSize:11,color:"#c9a84c",marginTop:6}}>
                          📅 Prazo automático: <strong>{calcPrazo(formPedido.dataEnvio, formPedido.produtos)||"—"}</strong>
                          {(formPedido.produtos||"").toLowerCase().includes("cortina") ? " (25 dias úteis — cortina)" : " (20 dias úteis — persiana)"}
                        </div>
                      )}
                    </div>
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6}}>Previsão de Entrega</label>
                      <input className="inp" type="date" value={brToIso(formPedido.previsaoEntrega)} onChange={e=>setFormPedido({...formPedido,previsaoEntrega:isoToBr(e.target.value)})}/>
                    </div>
                    <div>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6}}>Data Entrega Real</label>
                      <input className="inp" type="date" value={brToIso(formPedido.dataEntregaReal)} onChange={e=>setFormPedido({...formPedido,dataEntregaReal:isoToBr(e.target.value)})}/>
                    </div>
                    <div style={{gridColumn:"span 2"}}>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6}}>Observações</label>
                      <textarea className="inp" rows={2} style={{resize:"vertical"}} placeholder="Atualizações, pendências..." value={formPedido.observacoes} onChange={e=>setFormPedido({...formPedido,observacoes:e.target.value})}/>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <button className="btn bp" onClick={salvarPedido}>💾 Salvar</button>
                    <button className="btn bg" style={{color:"#777",borderColor:"#333"}} onClick={()=>setFormPedido(null)}>Cancelar</button>
                  </div>
                </div>
              )}

              {/* Lista em andamento */}
              {emAndamento.length>0 && (
                <div style={{marginBottom:20}}>
                  <div style={{fontSize:11,color:"#c9a84c",textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}>Em Andamento</div>
                  <div className="card">
                    {emAndamento.filter(p=>searchPedido===""||p.cliente?.toLowerCase().includes(searchPedido.toLowerCase())||p.numeroPedido?.toLowerCase().includes(searchPedido.toLowerCase())||p.produtos?.toLowerCase().includes(searchPedido.toLowerCase())).map((p,i)=>{
                      const st = STATUS_FABRICA[p.statusFabrica]||STATUS_FABRICA.aguardando;
                      const idxReal = pedidosFabrica.indexOf(p);
                      const atrasado = p.previsaoEntrega && (()=>{
                        const [d,m,a]=p.previsaoEntrega.split("/");
                        return new Date(+a, +m-1, +d) < new Date();
                      })();
                      return (
                        <div key={i} style={{padding:"14px 16px",borderBottom:"1px solid #1a1a24"}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12,flexWrap:"wrap"}}>
                            <div style={{flex:1}}>
                              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6,flexWrap:"wrap"}}>
                                <span style={{fontFamily:"Georgia,serif",color:"#c9a84c",fontWeight:700}}>#{p.numeroPedido}</span>
                                <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:st.bg,color:st.color,fontWeight:600}}>{st.label}</span>
                                {atrasado && <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:"#ef444415",color:"#ef4444",fontWeight:600}}>⚠️ Atrasado</span>}
                              </div>
                              <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>{p.cliente}</div>
                              <div style={{fontSize:12,color:"#777"}}>{p.produtos}</div>
                              {Number(p.valorPedido)>0 && <div style={{fontSize:13,color:"#10b981",fontWeight:600,marginTop:2}}>{fmt(Number(p.valorPedido))}</div>}
                              <div style={{display:"flex",gap:16,marginTop:6,flexWrap:"wrap"}}>
                                <span style={{fontSize:11,color:"#555"}}>📦 Enviado: {p.dataEnvio}</span>
                                <span style={{fontSize:11,color:atrasado?"#ef4444":"#c9a84c",fontWeight:atrasado?700:400}}>📅 Prazo: {p.previsaoEntrega||"—"}</span>
                              </div>
                              {p.observacoes && <div style={{fontSize:11,color:"#555",marginTop:4,fontStyle:"italic"}}>💬 {p.observacoes}</div>}
                            </div>
                            <div style={{display:"flex",flexDirection:"column",gap:6,flexShrink:0}}>
                              <button className="sb" style={{fontSize:11}} onClick={()=>setFormPedido({...p})}>✏️ Editar</button>
                              <select style={{padding:"5px 8px",background:"#1e1e28",border:"1px solid #2a2a3a",borderRadius:6,color:"#aaa",fontSize:11,cursor:"pointer"}}
                                value={p.statusFabrica} onChange={async e=>{
                                  await dbPedidos.update(p.id,{...p,statusFabrica:e.target.value});
                                  setPedidosFabrica(await dbPedidos.get());
                                }}>
                                {Object.entries(STATUS_FABRICA).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Concluídos */}
              {concluidos.length>0 && (
                <div>
                  <div style={{fontSize:11,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}>Concluídos ({concluidos.length})</div>
                  <div className="card">
                    {concluidos.filter(p=>searchPedido===""||p.cliente?.toLowerCase().includes(searchPedido.toLowerCase())||p.numeroPedido?.toLowerCase().includes(searchPedido.toLowerCase())||p.produtos?.toLowerCase().includes(searchPedido.toLowerCase())).map((p,i)=>{
                      const st = STATUS_FABRICA[p.statusFabrica];
                      const idxReal = pedidosFabrica.indexOf(p);
                      return (
                        <div key={i} style={{padding:"12px 16px",borderBottom:"1px solid #1a1a24",opacity:0.6}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                            <div>
                              <span style={{fontFamily:"Georgia,serif",color:"#c9a84c",fontWeight:700,marginRight:10}}>#{p.numeroPedido}</span>
                              <span style={{fontSize:13,color:"#aaa"}}>{p.cliente}</span>
                              <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:st.bg,color:st.color,marginLeft:8}}>{st.label}</span>
                            </div>
                            <div style={{display:"flex",gap:8,alignItems:"center"}}>
                              {p.dataEntregaReal && <span style={{fontSize:11,color:"#555"}}>Entregue: {p.dataEntregaReal}</span>}
                              <button className="sb" style={{fontSize:11}} onClick={()=>setFormPedido({...p})}>✏️</button>
                              <button className="sb" style={{fontSize:11,color:"#ef4444",borderColor:"#ef444440"}} onClick={async()=>{
                                if(!window.confirm("Excluir?")) return;
                                await dbPedidos.delete(p.id);
                                setPedidosFabrica(await dbPedidos.get());
                              }}>🗑️</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {pedidosFabrica.length===0 && (
                <div style={{padding:40,textAlign:"center",color:"#444",fontSize:13}}>
                  <div style={{fontSize:36,marginBottom:8}}>🏭</div>
                  Nenhum pedido registrado ainda
                </div>
              )}
            </div>
          );
        })()}

        {/* PRODUÇÃO / PAGAMENTO */}
        {view==="producao" && (()=>{
          const meses = [];
          for(let i=5;i>=0;i--){ const d=new Date(); d.setMonth(d.getMonth()-i); meses.push({mes:d.getMonth(),ano:d.getFullYear(),label:d.toLocaleString("pt-BR",{month:"long",year:"numeric"})});}
          const [mesSel, setMesSel] = [calMes, setCalMes]; // reusa state
          const [anoSel, setAnoSel] = [calAno, setCalAno];
          const mesAtual = meses.find(m=>m.mes===mesSel&&m.ano===anoSel) || meses[meses.length-1];

          const parseData=(str)=>{if(!str)return null;const[d,m,a]=str.split("/");if(!d||!m||!a)return null;return{dia:+d,mes:+m-1,ano:+a};};

          // Pedidos produzidos = status pronto, entregue ou instalado
          // Mês = usa dataEntregaReal se tiver, senão previsaoEntrega
          const produzidos = pedidosFabrica.filter(p=>{
            if(!["pronto","entregue","instalado"].includes(p.statusFabrica)) return false;
            const dt = parseData(p.dataEntregaReal||p.previsaoEntrega);
            if(!dt) return false;
            return dt.mes===mesSel && dt.ano===anoSel;
          });

          const totalProduzido = produzidos.reduce((a,p)=>a+Number(p.valorPedido||0),0);

          // Comissão (mesma lógica do CRM)
          const totalVendasGeral = visitas.filter(v=>v.status==="fechado").reduce((a,v)=>a+valorFinal(v),0);
          const totalVisitasGeral = visitas.length;
          const conversaoGeral = totalVisitasGeral>0?(visitas.filter(v=>v.status==="fechado").length/totalVisitasGeral)*100:0;
          let pctComissao = 10;
          if(totalVendasGeral>=120000) pctComissao+=5; else if(totalVendasGeral>=100000) pctComissao+=4; else if(totalVendasGeral>=80000) pctComissao+=3; else if(totalVendasGeral>=60000) pctComissao+=2; else if(totalVendasGeral>=40000) pctComissao+=1;
          if(conversaoGeral>=90) pctComissao+=5; else if(conversaoGeral>=80) pctComissao+=4; else if(conversaoGeral>=70) pctComissao+=3; else if(conversaoGeral>=60) pctComissao+=2; else if(conversaoGeral>=50) pctComissao+=1;
          pctComissao = Math.min(pctComissao, 20);
          const valorComissaoMes = totalProduzido * pctComissao / 100;

          return (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20,flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:22}}>💰 Produção & Pagamento</div>
                  <div style={{fontSize:12,color:"#555",marginTop:2}}>Controle mensal do que foi produzido e quanto você recebe</div>
                </div>
              </div>

              {/* Seletor de mês */}
              <div style={{display:"flex",gap:8,marginBottom:20,flexWrap:"wrap"}}>
                {meses.map((m,i)=>{
                  const ativo = m.mes===mesSel && m.ano===anoSel;
                  return (
                    <button key={i} onClick={()=>{setCalMes(m.mes);setCalAno(m.ano);}} style={{padding:"8px 16px",borderRadius:20,border:`1px solid ${ativo?"#c9a84c":"#2a2a3a"}`,background:ativo?"#c9a84c20":"transparent",color:ativo?"#c9a84c":"#777",fontSize:12,cursor:"pointer",transition:"all .15s",textTransform:"capitalize"}}>
                      {m.label}
                    </button>
                  );
                })}
              </div>

              {/* KPIs do mês */}
              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:20}} className="grid-4col">
                {[
                  {label:"Pedidos Produzidos",value:produzidos.length,color:"#3b82f6"},
                  {label:"Total Produzido",value:fmt(totalProduzido),color:"#10b981"},
                  {label:"Sua Comissão ("+pctComissao+"%)",value:fmt(valorComissaoMes),color:"#c9a84c"},
                  {label:"Ticket Médio",value:produzidos.length>0?fmt(totalProduzido/produzidos.length):"—",color:"#8b5cf6"},
                ].map((st,i)=>(
                  <div key={i} className="sc">
                    <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>{st.label}</div>
                    <div style={{fontFamily:"Georgia,serif",fontSize:i===1||i===2?16:22,color:st.color}}>{st.value}</div>
                  </div>
                ))}
              </div>

              {/* Barra de progresso da comissão */}
              <div className="card" style={{padding:18,marginBottom:20,borderColor:"#c9a84c40"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div>
                    <div style={{fontSize:11,color:"#c9a84c",textTransform:"uppercase",letterSpacing:"1px"}}>💎 Comissão do Mês</div>
                    <div style={{fontSize:11,color:"#555",marginTop:2}}>Base {pctComissao}% sobre {fmt(totalProduzido)} produzido</div>
                  </div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:26,color:"#c9a84c"}}>{fmt(valorComissaoMes)}</div>
                </div>
                <div style={{height:8,background:"#1a1a24",borderRadius:4,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${Math.min(totalProduzido/META_MENSAL*100,100)}%`,background:"linear-gradient(90deg,#c9a84c,#e0bf6a)",borderRadius:4,transition:"width .8s"}}/>
                </div>
                <div style={{fontSize:11,color:"#555",marginTop:6}}>{Math.round(totalProduzido/META_MENSAL*100)}% da meta de produção ({fmt(META_MENSAL)})</div>
              </div>

              {/* Lista de pedidos produzidos */}
              <div style={{fontSize:11,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}>Pedidos produzidos no mês ({produzidos.length})</div>
              {produzidos.length===0 ? (
                <div className="card" style={{padding:36,textAlign:"center",color:"#444",fontSize:13}}>Nenhum pedido produzido neste mês</div>
              ) : (
                <div className="card">
                  {produzidos.map((p,i)=>{
                    const st = STATUS_FABRICA[p.statusFabrica];
                    return (
                      <div key={p.id||i} style={{padding:"14px 16px",borderBottom:"1px solid #1a1a24"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
                              <span style={{fontFamily:"Georgia,serif",color:"#c9a84c",fontWeight:700}}>#{p.numeroPedido}</span>
                              <span style={{fontSize:11,padding:"3px 10px",borderRadius:20,background:st?.bg,color:st?.color}}>{st?.label}</span>
                            </div>
                            <div style={{fontSize:14,fontWeight:600}}>{p.cliente}</div>
                            <div style={{fontSize:12,color:"#777",marginTop:2}}>{p.produtos}</div>
                            <div style={{fontSize:11,color:"#555",marginTop:4}}>
                              📦 Enviado: {p.dataEnvio} · 📅 Entrega: {p.dataEntregaReal||p.previsaoEntrega||"—"}
                            </div>
                          </div>
                          <div style={{textAlign:"right"}}>
                            <div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#10b981",fontWeight:700}}>{fmt(Number(p.valorPedido||0))}</div>
                            <div style={{fontSize:11,color:"#c9a84c",marginTop:2}}>Comissão: {fmt(Number(p.valorPedido||0)*pctComissao/100)}</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {/* Totalizador */}
                  <div style={{padding:"16px",background:"#0a0a12",borderTop:"2px solid #c9a84c40",display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:8}}>
                    <div style={{fontSize:13,color:"#aaa",fontWeight:600}}>TOTAL DO MÊS</div>
                    <div style={{display:"flex",gap:24}}>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:10,color:"#555",textTransform:"uppercase"}}>Produzido</div>
                        <div style={{fontFamily:"Georgia,serif",fontSize:16,color:"#10b981"}}>{fmt(totalProduzido)}</div>
                      </div>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:10,color:"#555",textTransform:"uppercase"}}>Comissão ({pctComissao}%)</div>
                        <div style={{fontFamily:"Georgia,serif",fontSize:16,color:"#c9a84c"}}>{fmt(valorComissaoMes)}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* PAINEL GERENTE */}
        {view==="gerente" && (()=>{
          const fechados = visitas.filter(v=>v.status==="fechado");
          const perdidos = visitas.filter(v=>v.status==="perdido");
          const totalVisitas = visitas.length;
          const receitaTotal = fechados.reduce((a,v)=>a+valorFinal(v),0);
          const ticketMedio = fechados.length>0?receitaTotal/fechados.length:0;
          const conversaoG = totalVisitas>0?Math.round(fechados.length/totalVisitas*100):0;
          return (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4,flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontFamily:"Georgia,serif",fontSize:22}}>👔 Painel do Gerente</div>
                  <div style={{fontSize:12,color:"#555",marginTop:2}}>Resumo executivo — {hoje.slice(3)}</div>
                </div>
                <button className="btn bg" style={{color:"#c9a84c",borderColor:"#c9a84c40",fontSize:12}} onClick={()=>{
                  const txt = `RELATÓRIO MENSAL — ${hoje.slice(3)}\n${userInfo.nomeCompleto}\n${"─".repeat(40)}\n\nVISITAS\nTotal: ${totalVisitas} | Fechadas: ${fechados.length} | Perdidas: ${perdidos.length}\nConversão: ${conversaoG}%\n\nRECEITA\nTotal vendido: ${fmt(receitaTotal)}\nTicket médio: ${fmt(ticketMedio)}\nMeta mensal: ${fmt(META_MENSAL)}\nAtingimento: ${Math.round(receitaTotal/META_MENSAL*100)}%\n\nCOMISSÃO\nPercentual: ${comissao.pct}%\nValor: ${fmt(comissao.valorComissao)}\n\n${"─".repeat(40)}\nFECHAMENTOS:\n${fechados.map((v,i)=>`${i+1}. ${v.cliente} — ${fmt(valorFinal(v))}`).join("\n")}`;
                  navigator.clipboard.writeText(txt).then(()=>alert("Copiado!"));
                }}>📋 Copiar Relatório</button>
              </div>

              <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,margin:"20px 0"}} className="grid-4col">
                {[
                  {l:"Visitas Realizadas",v:totalVisitas,c:"#3b82f6"},
                  {l:"Vendas Fechadas",v:fechados.length,c:"#10b981"},
                  {l:"Taxa de Conversão",v:`${conversaoG}%`,c:"#c9a84c"},
                  {l:"Receita Total",v:fmt(receitaTotal),c:"#10b981"},
                ].map((k,i)=>(
                  <div key={i} className="sc">
                    <div style={{fontSize:10,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:8}}>{k.l}</div>
                    <div style={{fontFamily:"Georgia,serif",fontSize:i===3?16:24,color:k.c}}>{k.v}</div>
                  </div>
                ))}
              </div>

              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}} className="grid-2col">
                <div className="card" style={{padding:18}}>
                  <div style={{fontSize:11,color:"#c9a84c",textTransform:"uppercase",letterSpacing:"1px",marginBottom:14}}>🎯 Atingimento de Meta</div>
                  {[{l:"Meta Mensal",meta:META_MENSAL,atual:receitaTotal},{l:"Meta Semanal",meta:META_MENSAL/4,atual:stats.semana.receita}].map(({l,meta,atual})=>{
                    const p=Math.min(Math.round(atual/meta*100),100);
                    const c=p>=100?"#10b981":p>=60?"#c9a84c":"#ef4444";
                    return (
                      <div key={l} style={{marginBottom:14}}>
                        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                          <span style={{fontSize:12,color:"#aaa"}}>{l}</span>
                          <span style={{fontSize:12,color:c,fontWeight:600}}>{p}% — {fmt(atual)}</span>
                        </div>
                        <div style={{height:8,background:"#1a1a24",borderRadius:4}}>
                          <div style={{height:8,borderRadius:4,background:c,width:`${p}%`,transition:"width .8s"}}/>
                        </div>
                        <div style={{fontSize:10,color:"#444",marginTop:4}}>Meta: {fmt(meta)}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="card" style={{padding:18}}>
                  <div style={{fontSize:11,color:"#10b981",textTransform:"uppercase",letterSpacing:"1px",marginBottom:14}}>💰 Comissão do Período</div>
                  <div style={{textAlign:"center",padding:"10px 0"}}>
                    <div style={{fontFamily:"Georgia,serif",fontSize:40,color:"#10b981",lineHeight:1}}>{fmt(comissao.valorComissao)}</div>
                    <div style={{fontSize:14,color:"#555",marginTop:4}}>percentual: {comissao.pct}%</div>
                    <div style={{marginTop:16,display:"flex",flexDirection:"column",gap:6}}>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span style={{color:"#777"}}>Base</span><span style={{color:"#888"}}>10%</span></div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span style={{color:"#777"}}>Bônus vendas</span><span style={{color:"#c9a84c"}}>+{comissao.bonus1}%</span></div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:12}}><span style={{color:"#777"}}>Bônus conversão</span><span style={{color:"#8b5cf6"}}>+{comissao.bonus2}%</span></div>
                      <div style={{display:"flex",justifyContent:"space-between",fontSize:13,paddingTop:8,borderTop:"1px solid #1a1a24"}}><span style={{color:"#e8e4dc",fontWeight:600}}>Total</span><span style={{color:"#10b981",fontWeight:700}}>{comissao.pct}%</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card" style={{padding:18}}>
                <div style={{fontSize:11,color:"#c9a84c",textTransform:"uppercase",letterSpacing:"1px",marginBottom:14}}>📋 Fechamentos do Mês</div>
                <div style={{display:"grid",gridTemplateColumns:"2fr 1.5fr 1fr 1fr",gap:8,padding:"8px 12px",background:"#0d0d15",borderRadius:6,marginBottom:8}}>
                  {["Cliente","Produtos","Valor","Comissão"].map(h=>(
                    <div key={h} style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:"1px"}}>{h}</div>
                  ))}
                </div>
                {fechados.length===0 && <div style={{padding:20,textAlign:"center",color:"#444",fontSize:13}}>Nenhuma venda fechada</div>}
                {fechados.map(v=>(
                  <div key={v.id} style={{display:"grid",gridTemplateColumns:"2fr 1.5fr 1fr 1fr",gap:8,padding:"11px 12px",borderBottom:"1px solid #1a1a24",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:13,fontWeight:600}}>{v.cliente}</div>
                      <div style={{fontSize:10,color:"#444"}}>{v.dataVisita}</div>
                    </div>
                    <div style={{fontSize:11,color:"#777"}}>{v.produtos||"—"}</div>
                    <div style={{fontSize:13,color:"#c9a84c",fontWeight:600}}>{fmt(valorFinal(v))}</div>
                    <div style={{fontSize:13,color:"#10b981",fontWeight:700}}>{fmt(valorFinal(v)*comissao.pct/100)}</div>
                  </div>
                ))}
                {fechados.length>0 && (
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1.5fr 1fr 1fr",gap:8,padding:"12px",marginTop:4,background:"#10b98108",borderRadius:8,border:"1px solid #10b98130"}}>
                    <div style={{fontSize:13,fontWeight:700,gridColumn:"span 2"}}>TOTAL</div>
                    <div style={{fontSize:14,color:"#c9a84c",fontWeight:700}}>{fmt(receitaTotal)}</div>
                    <div style={{fontSize:14,color:"#10b981",fontWeight:700}}>{fmt(comissao.valorComissao)}</div>
                  </div>
                )}
              </div>
            </div>
          );
        })()}

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
                <button className="btn bp" onClick={()=>{if(!form.cliente)setForm({...empty});setView("novo")}}>+ Nova{form.cliente&&!form.id?" (rascunho)":""}</button>
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
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:20,flexWrap:"wrap"}}>
              <button className="btn bg" onClick={()=>setView("lista")}>←</button>
              <div style={{flex:1}}>
                <div style={{fontFamily:"Georgia,serif",fontSize:20,cursor:"pointer",textDecoration:"underline",textDecorationColor:"#c9a84c40",textUnderlineOffset:4}} onClick={()=>{
                  const c = clientes.find(cl=>cl.telefone===selected.telefone||cl.nome?.toLowerCase()===selected.cliente?.toLowerCase());
                  if(c) setClienteInfo(c);
                  else showToast("Cliente não encontrado no cadastro. Cadastre primeiro.","aviso");
                }}>{selected.cliente}</div>
                <div style={{fontSize:11,color:"#555"}}>{selected.telefone} · {selected.dataCriacao} {clientes.find(cl=>cl.telefone===selected.telefone)?"· 👤 Cadastrado":""}</div>
              </div>
              <button className="btn bg" onClick={()=>{setForm({...selected});setView("novo")}}>✎</button>
              <button className="btn bd" onClick={()=>excluir(selected.id)}>✕</button>
            </div>

            {/* Score do Lead */}
            {/* Modal dados do cliente */}
            {clienteInfo && (
              <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:16}} onClick={()=>setClienteInfo(null)}>
                <div style={{background:"#12121a",border:"1px solid #2a2a3a",borderRadius:16,padding:24,maxWidth:500,width:"100%",maxHeight:"85vh",overflowY:"auto"}} onClick={e=>e.stopPropagation()}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
                    <div style={{fontFamily:"Georgia,serif",fontSize:18,color:"#c9a84c"}}>👤 Dados do Cliente</div>
                    <button className="btn bg" onClick={()=>setClienteInfo(null)} style={{fontSize:16,padding:"4px 10px"}}>✕</button>
                  </div>
                  <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                    {[
                      {l:"NOME",v:clienteInfo.nome},
                      {l:"TELEFONE",v:clienteInfo.telefone},
                      {l:"E-MAIL",v:clienteInfo.email},
                      {l:"ORIGEM",v:clienteInfo.origem,cor:"#c9a84c"},
                      {l:"CPF",v:clienteInfo.cpf},
                      {l:"DATA DE NASCIMENTO",v:clienteInfo.dataNascimento,icon:"🎂"},
                      {l:"ENDEREÇO",v:clienteInfo.endereco},
                      {l:"CEP",v:clienteInfo.cep},
                      {l:"BAIRRO",v:clienteInfo.bairro},
                      {l:"CIDADE",v:clienteInfo.cidade},
                    ].map((campo,i)=>(
                      <div key={i} style={campo.l==="ENDEREÇO"?{gridColumn:"span 2"}:{}}>
                        <div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:4}}>{campo.icon||""} {campo.l}</div>
                        <div style={{fontSize:14,color:campo.cor||"#e8e4dc",fontWeight:500}}>{campo.v||"—"}</div>
                      </div>
                    ))}
                  </div>
                  {clienteInfo.observacoes && (
                    <div style={{marginTop:14,padding:12,background:"#1a1d27",borderRadius:8}}>
                      <div style={{fontSize:9,color:"#555",textTransform:"uppercase",letterSpacing:"1.5px",marginBottom:4}}>OBSERVAÇÕES</div>
                      <div style={{fontSize:13,color:"#aaa"}}>{clienteInfo.observacoes}</div>
                    </div>
                  )}
                  <div style={{display:"flex",gap:10,marginTop:16}}>
                    {clienteInfo.telefone && (
                      <a href={`https://wa.me/55${clienteInfo.telefone.replace(/\D/g,"")}`} target="_blank" rel="noreferrer" style={{textDecoration:"none",flex:1}}>
                        <button className="btn bg" style={{width:"100%",color:"#25d366",borderColor:"#25d36640"}}>💬 WhatsApp</button>
                      </a>
                    )}
                    <button className="btn bg" style={{flex:1}} onClick={()=>{
                      const cli = clientes.find(c=>c.id===clienteInfo.id);
                      if(cli){setSelected(null);setView("clientes");}
                      setClienteInfo(null);
                    }}>📋 Ver Cadastro Completo</button>
                  </div>
                </div>
              </div>
            )}
            {(()=>{
              // Se já fechou, score é 100. Se perdido, mostra diferente.
              if(selected.status==="fechado"){
                return (
                  <div className="card" style={{padding:14,marginBottom:14,borderColor:"#10b98140"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:10,color:"#10b981",textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>🎯 Score do Lead</div>
                        <div style={{fontSize:13,color:"#10b981"}}>✅ Cliente Fechado</div>
                        <div style={{fontSize:11,color:"#444",marginTop:4}}>Negócio concluído · {fmt(valorFinal(selected))}</div>
                      </div>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontFamily:"Georgia,serif",fontSize:36,color:"#10b981",lineHeight:1}}>100</div>
                        <div style={{fontSize:10,color:"#444"}}>/ 100</div>
                      </div>
                    </div>
                    <div style={{height:6,background:"#1a1a24",borderRadius:3,marginTop:10}}>
                      <div style={{height:6,borderRadius:3,background:"#10b981",width:"100%"}}/>
                    </div>
                  </div>
                );
              }
              if(selected.status==="perdido"||selected.status==="cancelado"){
                return (
                  <div className="card" style={{padding:14,marginBottom:14,borderColor:selected.status==="cancelado"?"#6b728040":"#ef444440"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <div style={{fontSize:10,color:selected.status==="cancelado"?"#6b7280":"#ef4444",textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>🎯 Score do Lead</div>
                        <div style={{fontSize:13,color:selected.status==="cancelado"?"#6b7280":"#ef4444"}}>{selected.status==="cancelado"?"🚫 Visita Cancelada":"❌ Lead Perdido"}</div>
                        <div style={{fontSize:11,color:"#444",marginTop:4}}>{selected.status==="cancelado"?"Visita não realizada":"Negócio não concluído"}</div>
                      </div>
                      <div style={{textAlign:"center"}}>
                        <div style={{fontFamily:"Georgia,serif",fontSize:36,color:selected.status==="cancelado"?"#6b7280":"#ef4444",lineHeight:1}}>0</div>
                        <div style={{fontSize:10,color:"#444"}}>/ 100</div>
                      </div>
                    </div>
                    <div style={{height:6,background:"#1a1a24",borderRadius:3,marginTop:10}}>
                      <div style={{height:6,borderRadius:3,background:selected.status==="cancelado"?"#6b7280":"#ef4444",width:"0%"}}/>
                    </div>
                  </div>
                );
              }
              const urgPts = {"Imediato":30,"Alta":20,"Média":10,"Baixa":5}[selected.urgencia]||0;
              const motPts = {"Reforma":25,"Casa nova":25,"Escritório":20,"Presente":15,"Outro":5}[selected.motivoCompra]||10;
              const valPts = valorFinal(selected)>=20000?25:valorFinal(selected)>=10000?15:valorFinal(selected)>=5000?10:5;
              const prodPts = (selected.produtos||"").toLowerCase().includes("motorizado")?15:selected.produtos?10:0;
              // Bônus por status avançado
              const statusPts = selected.status==="orcamento_enviado"?10:selected.status==="visitado"?5:0;
              const score = Math.min(urgPts+motPts+valPts+prodPts+statusPts,100);
              const cor = score>=70?"#10b981":score>=40?"#c9a84c":"#ef4444";
              const label = score>=70?"🔥 Lead Quente":score>=40?"⚡ Lead Morno":"❄️ Lead Frio";
              return (
                <div className="card" style={{padding:14,marginBottom:14,borderColor:cor+"40"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontSize:10,color:cor,textTransform:"uppercase",letterSpacing:"1px",marginBottom:4}}>🎯 Score do Lead</div>
                      <div style={{fontSize:13,color:"#aaa"}}>{label}</div>
                      <div style={{fontSize:11,color:"#444",marginTop:4}}>
                        Urgência: +{urgPts} · Motivo: +{motPts} · Valor: +{valPts} · Produto: +{prodPts}{statusPts>0?` · Status: +${statusPts}`:""}
                      </div>
                    </div>
                    <div style={{textAlign:"center"}}>
                      <div style={{fontFamily:"Georgia,serif",fontSize:36,color:cor,lineHeight:1}}>{score}</div>
                      <div style={{fontSize:10,color:"#444"}}>/ 100</div>
                    </div>
                  </div>
                  <div style={{height:6,background:"#1a1a24",borderRadius:3,marginTop:10}}>
                    <div style={{height:6,borderRadius:3,background:cor,width:`${score}%`,transition:"width .8s"}}/>
                  </div>
                </div>
              );
            })()}

            {/* WhatsApp Templates */}
            <div className="card" style={{padding:14,marginBottom:14,borderColor:"#25d36640"}}>
              <div style={{fontSize:10,color:"#25d366",textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}>💬 Enviar WhatsApp</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {[
                  {label:"Confirmar Visita", msg:()=>`Olá, ${selected.cliente?.split(" ")[0]}! Tudo bem? 😊\n\nPrazer me chamo ${userInfo.nomeCompleto} e sou consultor(a) da Persianas em Casa!\n\nPassando para confirmar sua visita agendada para *${selected.dataVisita} às ${selected.horaVisita}*. Estarei no endereço: ${selected.endereco}`},
                  {label:"Enviar Orçamento", msg:()=>`Olá, ${selected.cliente?.split(" ")[0]}! 😊\n\nSegue o orçamento conforme combinado:\n\n📦 Produtos: ${selected.produtos||"—"}\n🏠 Ambiente: ${selected.ambiente||"—"}\n💰 Valor: *${fmt(valorFinal(selected))}*${selected.desconto&&Number(selected.desconto)>0?`\n✅ Desconto aplicado: ${selected.desconto}%`:""}${selected.linkOrcamento?`\n\n🔗 Orçamento completo: ${selected.linkOrcamento}`:""}\n\nFico à disposição para qualquer dúvida!\n\n${userInfo.nome} - Persianas em Casa`},
                  {label:"Follow-up", msg:()=>`Olá, ${selected.cliente?.split(" ")[0]}! Tudo bem? 😊\n\nPassando para saber se ficou alguma dúvida sobre o orçamento que enviei.\n\nEstou à disposição para ajudar!\n\n${userInfo.nome} - Persianas em Casa`},
                  {label:"Confirmar Instalação", msg:()=>`Olá, ${selected.cliente?.split(" ")[0]}! 😊\n\nPassando para confirmar a instalação agendada para *${selected.dataInstalacao||"—"}*.\n\nQualquer dúvida é só chamar!\n\n${userInfo.nome} - Persianas em Casa`},
                ].map(t=>{
                  const tel = selected.telefone?.replace(/\D/g,"");
                  const url = `https://wa.me/55${tel}?text=${encodeURIComponent(t.msg())}`;
                  return (
                    <a key={t.label} href={url} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                      <button className="sb" style={{color:"#25d366",borderColor:"#25d36640",background:"#25d36608",fontSize:12}}>
                        💬 {t.label}
                      </button>
                    </a>
                  );
                })}
              </div>
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
                {selected.status==="fechado" && (()=>{
                  const prazo = calcPrazo(selected.dataVisita, selected.produtos);
                  const temCortina = (selected.produtos||"").toLowerCase().includes("cortina");
                  return (
                    <div style={{marginTop:10,padding:"10px 12px",borderRadius:8,background:"#c9a84c10",border:"1px solid #c9a84c30"}}>
                      <div style={{fontSize:10,color:"#c9a84c",marginBottom:4}}>🏭 PRAZO FÁBRICA</div>
                      <div style={{fontSize:13,color:"#e8e4dc",fontWeight:600}}>{prazo||"Definir ao criar pedido"}</div>
                      <div style={{fontSize:11,color:"#777",marginTop:2}}>{temCortina?"25 dias úteis — Cortina":"20 dias úteis — Persiana"}</div>
                      <button className="btn bp" style={{width:"100%",marginTop:10,fontSize:12,padding:"8px"}} onClick={()=>{
                        const prazoAuto = calcPrazo(hoje, selected.produtos||"");
                        setFormPedido({...emptyPedido, cliente:selected.cliente, visita_id:selected.id, produtos:selected.produtos||"", dataEnvio:hoje, previsaoEntrega:prazoAuto||"", valorPedido:String(valorFinal(selected)||"")});
                        setView("fabrica");
                      }}>🏭 Criar Pedido na Fábrica</button>
                    </div>
                  );
                })()}
                {selected.status!=="orcamento_enviado" && selected.status!=="fechado" && (
                  <button className="btn bg" style={{width:"100%",marginTop:10,color:"#8b5cf6",borderColor:"#8b5cf640",fontSize:12}} onClick={async()=>{
                    const nota = `📋 Orçamento enviado ao cliente — ${new Date().toLocaleString("pt-BR")}`;
                    const novoHist = [...(selected.historico||[]), {texto:nota, data:new Date().toLocaleString("pt-BR")}];
                    await db.update(selected.id, {...selected, status:"orcamento_enviado", historico:novoHist});
                    const atualizado = {...selected, status:"orcamento_enviado", historico:novoHist};
                    setSelected(atualizado);
                    setVisitas(vs=>vs.map(v=>v.id===selected.id?atualizado:v));
                  }}>📋 Marcar Orçamento como Enviado</button>
                )}
                {selected.status==="orcamento_enviado" && (
                  <div style={{marginTop:10,padding:"8px 12px",borderRadius:8,background:"#8b5cf615",border:"1px solid #8b5cf640",fontSize:12,color:"#8b5cf6",textAlign:"center"}}>✓ Orçamento já enviado</div>
                )}
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

            {/* Botão salvar como cliente */}
            <div style={{marginTop:16,padding:"14px 16px",background:"#0d1b2a",border:"1px solid #3b82f640",borderRadius:12,display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:10}}>
              <div>
                <div style={{fontSize:13,color:"#3b82f6",fontWeight:600}}>👥 Salvar como Cliente</div>
                <div style={{fontSize:11,color:"#555",marginTop:2}}>Adiciona {selected.cliente} à sua base de clientes</div>
              </div>
              <button className="btn" style={{background:"#3b82f620",border:"1px solid #3b82f640",color:"#3b82f6",padding:"9px 18px",fontSize:13}} onClick={async ()=>{
                const jaExiste = clientes.find(c=>c.telefone===selected.telefone||c.nome===selected.cliente);
                if(jaExiste){ alert(`${selected.cliente} já está cadastrado como cliente!`); return; }
                if(!window.confirm(`Cadastrar ${selected.cliente} como cliente?`)) return;
                await dbClientes.insert({nome:selected.cliente,telefone:selected.telefone,email:selected.email||"",endereco:selected.endereco||"",bairro:"",cidade:"",observacoes:`Origem: visita em ${selected.dataVisita}`,origem:"Persianas em Casa",cpf:"",dataNascimento:"",cep:""});
                const c = await dbClientes.get(); setClientes(c);
                alert(`✅ ${selected.cliente} adicionado à base de clientes!`);
              }}>👥 Cadastrar Cliente</button>
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
                <textarea className="inp" style={{minHeight:200}} placeholder={`Cole aqui o e-mail...\n\nExemplo:\nOlá, ${userInfo.apelido},\nData: 16/03/2026\nHorário: 13:00\nEndereço: Rua...`} value={emailTexto} onChange={e=>setEmailTexto(e.target.value)}/>
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
                  {[{label:"Nome *",k:"cliente"},{label:"Telefone",k:"telefone"}].map(f=>(
                    <div key={f.k} style={{marginBottom:10}}>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>{f.label}</label>
                      <input className="inp" value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}/>
                    </div>
                  ))}
                  <div style={{marginBottom:10}}>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Data</label>
                    <input className="inp" type="date" value={brToIso(form.dataVisita)} onChange={e=>setForm({...form,dataVisita:isoToBr(e.target.value)})}/>
                  </div>
                  <div style={{marginBottom:10}}>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Horário</label>
                    <input className="inp" type="time" value={form.horaVisita||""} onChange={e=>setForm({...form,horaVisita:e.target.value})}/>
                  </div>
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
            <div className="card" style={{padding:20,marginBottom:20}}>
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

            {/* Fechamento Mensal */}
            <div className="card" style={{padding:20}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,flexWrap:"wrap",gap:10}}>
                <div>
                  <div style={{fontSize:11,color:"#10b981",textTransform:"uppercase",letterSpacing:"1px",marginBottom:2}}>📄 Fechamento Mensal — Apresentação ao Gerente</div>
                  <div style={{fontSize:11,color:"#444"}}>{visitas.filter(v=>v.status==="fechado").length} vendas fechadas · comissão de {comissao.pct}%</div>
                </div>
                <button className="btn bg" style={{fontSize:12,padding:"7px 14px",color:"#10b981",borderColor:"#10b98140"}} onClick={()=>{
                  const fechados = visitas.filter(v=>v.status==="fechado");
                  const linhas = fechados.map((v,i)=>`${i+1}. ${v.cliente} | Produtos: ${v.produtos||"—"} | Valor: ${fmt(valorFinal(v))} | Comissão (${comissao.pct}%): ${fmt(valorFinal(v)*comissao.pct/100)}`).join("\n");
                  const texto = `FECHAMENTO MENSAL — ${hoje.slice(3)}\n${userInfo.nomeCompleto}\n${"─".repeat(50)}\n\n${linhas}\n\n${"─".repeat(50)}\nTotal vendido: ${fmt(comissao.totalVendas)}\nComissão (${comissao.pct}%): ${fmt(comissao.valorComissao)}\nConversão: ${comissao.conversao}%`;
                  navigator.clipboard.writeText(texto).then(()=>alert("Copiado! Cole no e-mail ou WhatsApp para o gerente."));
                }}>📋 Copiar Relatório</button>
              </div>

              {/* Cabeçalho tabela */}
              <div style={{display:"grid",gridTemplateColumns:"2fr 1.5fr 1fr 1fr 1fr",gap:8,padding:"8px 12px",background:"#0d0d15",borderRadius:6,marginBottom:8}}>
                {["Cliente","Produtos","Valor Venda","Desconto","Comissão"].map(h=>(
                  <div key={h} style={{fontSize:10,color:"#444",textTransform:"uppercase",letterSpacing:"1px"}}>{h}</div>
                ))}
              </div>

              {visitas.filter(v=>v.status==="fechado").length===0 && (
                <div style={{padding:28,textAlign:"center",color:"#444",fontSize:13}}>Nenhuma venda fechada ainda este mês</div>
              )}

              {visitas.filter(v=>v.status==="fechado").map((v,i)=>(
                <div key={v.id} style={{display:"grid",gridTemplateColumns:"2fr 1.5fr 1fr 1fr 1fr",gap:8,padding:"11px 12px",borderBottom:"1px solid #1a1a24",alignItems:"center"}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:"#e8e4dc"}}>{v.cliente}</div>
                    <div style={{fontSize:10,color:"#555",marginTop:2}}>{v.dataVisita} · {v.ambiente}</div>
                  </div>
                  <div style={{fontSize:12,color:"#888"}}>{v.produtos||"—"}</div>
                  <div style={{fontSize:13,color:"#c9a84c",fontWeight:600}}>{fmt(valorFinal(v))}</div>
                  <div style={{fontSize:12,color:Number(v.desconto)>0?"#ef4444":"#555"}}>{v.desconto||0}%</div>
                  <div style={{fontSize:13,color:"#10b981",fontWeight:700}}>{fmt(valorFinal(v)*comissao.pct/100)}</div>
                </div>
              ))}

              {visitas.filter(v=>v.status==="fechado").length>0 && (
                <div style={{display:"grid",gridTemplateColumns:"2fr 1.5fr 1fr 1fr 1fr",gap:8,padding:"14px 12px",marginTop:4,background:"#10b98108",borderRadius:8,border:"1px solid #10b98130"}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#e8e4dc",gridColumn:"span 2"}}>TOTAL</div>
                  <div style={{fontSize:14,color:"#c9a84c",fontWeight:700}}>{fmt(comissao.totalVendas)}</div>
                  <div/>
                  <div style={{fontSize:14,color:"#10b981",fontWeight:700}}>{fmt(comissao.valorComissao)}</div>
                </div>
              )}
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
              <button className="btn bp" onClick={()=>{if(!formCliente.nome)setFormCliente({...emptyCliente});setView("novo-cliente")}}>+ Novo Cliente{formCliente.nome&&!formCliente.id?" (rascunho)":""}</button>
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
              <button className="btn bg" onClick={()=>{setFormCliente({...selectedCliente, dataNascimento: selectedCliente.data_nascimento||""});setView("novo-cliente")}}>✎ Editar</button>
              <button className="btn bd" onClick={()=>excluirCliente(selectedCliente.id)}>✕</button>
            </div>
            <div className="card" style={{padding:20,marginBottom:14}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}} className="grid-2col">
                {[
                  {label:"Nome",value:selectedCliente.nome},
                  {label:"Telefone",value:selectedCliente.telefone,color:"#c9a84c"},
                  {label:"E-mail",value:selectedCliente.email},
                  {label:"Origem",value:selectedCliente.origem,color:"#8b5cf6"},
                  {label:"CPF",value:selectedCliente.cpf},
                  {label:"🎂 Data de Nascimento",value:selectedCliente.data_nascimento},
                  {label:"Endereço",value:selectedCliente.endereco},
                  {label:"CEP",value:selectedCliente.cep},
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

                {/* CPF */}
                <div style={{marginBottom:12,gridColumn:"span 1"}}>
                  <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>CPF</label>
                  <input className="inp" placeholder="000.000.000-00" value={formCliente.cpf||""} onChange={e=>{
                    let v=e.target.value.replace(/\D/g,"");
                    if(v.length>11) v=v.slice(0,11);
                    v=v.replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d)/,"$1.$2").replace(/(\d{3})(\d{1,2})$/,"$1-$2");
                    setFormCliente({...formCliente,cpf:v});
                  }}/>
                </div>

                {/* Data de Nascimento */}
                <div style={{marginBottom:12,gridColumn:"span 1"}}>
                  <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>🎂 Data de Nascimento</label>
                  <input className="inp" type="date" value={brToIso(formCliente.dataNascimento||"")} onChange={e=>setFormCliente({...formCliente,dataNascimento:isoToBr(e.target.value)})}/>
                </div>

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
                <button className="btn bg" onClick={()=>setView(formCliente.id?"detalhe-cliente":"clientes")}>← Voltar</button>
                <button className="btn bg" style={{color:"#f59e0b",borderColor:"#f59e0b40"}} onClick={()=>{if(window.confirm("Limpar todos os campos?"))setFormCliente({...emptyCliente})}}>🗑️ Limpar</button>
              </div>
            </div>
          </div>
        )}


        {/* VISUALIZADOR IA */}
        {view==="visualizador" && (
          <div style={{maxWidth:700}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:22,marginBottom:4}}>🎨 Simulador de Ambientes</div>
            <div style={{fontSize:12,color:"#555",marginBottom:24}}>Gere uma simulação realista com inteligência artificial</div>

            {/* Config chave OpenAI */}
            {!vizOpenaiKey ? (
              <div className="card" style={{padding:24,marginBottom:20,borderColor:"#f59e0b40"}}>
                <div style={{fontSize:11,color:"#f59e0b",textTransform:"uppercase",letterSpacing:"1px",marginBottom:12}}>🔑 Configurar Chave OpenAI</div>
                <div style={{fontSize:12,color:"#aaa",marginBottom:12}}>Para usar o simulador, cole sua chave de API da OpenAI. A chave fica salva no seu navegador (só precisa colar uma vez).</div>
                <input className="inp" placeholder="sk-proj-..." onChange={e=>{
                  const v=e.target.value.trim();
                  if(v.startsWith("sk-")&&v.length>20){salvarOpenaiKey(v);showToast("Chave OpenAI salva!");}
                }} style={{marginBottom:8}}/>
                <div style={{fontSize:11,color:"#555"}}>Cole a chave e ela será salva automaticamente</div>
              </div>
            ) : (
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16,padding:"8px 14px",background:"#10b98110",borderRadius:8,border:"1px solid #10b98130"}}>
                <span style={{fontSize:12,color:"#10b981"}}>✅ Chave OpenAI configurada</span>
                <button className="sb" style={{fontSize:11,color:"#ef4444",borderColor:"#ef444440"}} onClick={()=>salvarOpenaiKey("")}>Remover</button>
              </div>
            )}

            <div className="card" style={{padding:24,opacity:vizOpenaiKey?1:0.4,pointerEvents:vizOpenaiKey?"auto":"none"}}>
              {/* Modelo */}
              <div style={{marginBottom:20}}>
                <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"1px"}}>Modelo da Persiana ou Cortina</label>
                <select className="inp" value={vizModelo} onChange={e=>setVizModelo(e.target.value)}>
                  {["Persiana Rolo","Persiana Painel","Persiana Romana","Persiana de Madeira","Persiana Veneziana","Persiana Plissada","Persiana Colmeia","Persiana Zebra (Double Vision)","Persiana Triple Shade","Cortina","Cortina Motorizada"].map(m=>
                    <option key={m}>{m}</option>
                  )}
                </select>
              </div>

              {/* Blackout toggle */}
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"14px 18px",background:"#0d0d15",borderRadius:10,border:"1px solid #2a2a3a",marginBottom:20}}>
                <span style={{fontSize:14,color:"#e8e4dc"}}>Tecido Blackout</span>
                <div onClick={()=>setVizBlackout(!vizBlackout)} style={{width:48,height:26,borderRadius:13,background:vizBlackout?"#c9a84c":"#2a2a3a",cursor:"pointer",transition:"all .2s",position:"relative"}}>
                  <div style={{width:20,height:20,borderRadius:10,background:"#fff",position:"absolute",top:3,left:vizBlackout?25:3,transition:"left .2s",boxShadow:"0 2px 4px rgba(0,0,0,0.3)"}}/>
                </div>
              </div>

              {/* Foto do Ambiente */}
              <div style={{marginBottom:20}}>
                <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"1px"}}>Foto do Ambiente (obrigatório)</label>
                <label style={{display:"flex",alignItems:"center",gap:12,padding:"16px 18px",background:"#0d0d15",borderRadius:10,border:`1px solid ${vizFotoAmbiente?"#10b98140":"#2a2a3a"}`,cursor:"pointer",transition:"all .15s"}}>
                  {vizFotoAmbiente ? (
                    <img src={vizFotoAmbiente} alt="ambiente" style={{width:80,height:60,objectFit:"cover",borderRadius:8}}/>
                  ) : (
                    <div style={{width:80,height:60,borderRadius:8,background:"#1a1a24",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>📷</div>
                  )}
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,color:vizFotoAmbiente?"#10b981":"#aaa"}}>{vizFotoAmbiente?"✅ Foto carregada":"Foto do Ambiente (obrigatório)"}</div>
                    <div style={{fontSize:11,color:"#555",marginTop:2}}>{vizFotoAmbiente?"Toque para trocar":"Tire uma foto da janela do cliente"}</div>
                  </div>
                  <input type="file" accept="image/*" capture="environment" onChange={async e=>{
                    const f=e.target.files?.[0]; if(!f) return;
                    setVizFotoAmbiente(await fileToBase64(f));
                  }} style={{display:"none"}}/>
                </label>
              </div>

              {/* Foto do Tecido */}
              <div style={{marginBottom:24}}>
                <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"1px"}}>Tecido - Foto Zoom (obrigatório)</label>
                <label style={{display:"flex",alignItems:"center",gap:12,padding:"16px 18px",background:"#0d0d15",borderRadius:10,border:`1px solid ${vizFotoTecido?"#10b98140":"#2a2a3a"}`,cursor:"pointer",transition:"all .15s"}}>
                  {vizFotoTecido ? (
                    <img src={vizFotoTecido} alt="tecido" style={{width:80,height:60,objectFit:"cover",borderRadius:8}}/>
                  ) : (
                    <div style={{width:80,height:60,borderRadius:8,background:"#1a1a24",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>🧵</div>
                  )}
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,color:vizFotoTecido?"#10b981":"#aaa"}}>{vizFotoTecido?"✅ Tecido carregado":"Tecido - Foto Zoom (obrigatório)"}</div>
                    <div style={{fontSize:11,color:"#555",marginTop:2}}>{vizFotoTecido?"Toque para trocar":"Tire uma foto de perto do tecido"}</div>
                  </div>
                  <input type="file" accept="image/*" capture="environment" onChange={async e=>{
                    const f=e.target.files?.[0]; if(!f) return;
                    setVizFotoTecido(await fileToBase64(f));
                  }} style={{display:"none"}}/>
                </label>
              </div>

              {/* Erro */}
              {vizErro && (
                <div style={{padding:"12px 16px",background:"#ef444415",border:"1px solid #ef444430",borderRadius:8,color:"#ef4444",fontSize:13,marginBottom:16}}>
                  ⚠️ {vizErro}
                </div>
              )}

              {/* Botão Gerar */}
              <button className="btn bp" style={{width:"100%",padding:16,fontSize:16,fontFamily:"Georgia,serif",letterSpacing:1}} onClick={gerarSimulacao} disabled={vizLoading||!vizFotoAmbiente||!vizFotoTecido}>
                {vizLoading ? "⏳ Gerando simulação... (15-30s)" : "✨ Gerar Simulação"}
              </button>

              {!vizFotoAmbiente||!vizFotoTecido ? (
                <div style={{fontSize:11,color:"#555",textAlign:"center",marginTop:10}}>Envie as duas fotos para habilitar</div>
              ) : null}
            </div>

            {/* Loading animation */}
            {vizLoading && (
              <div className="card" style={{padding:40,textAlign:"center",marginTop:20}}>
                <div style={{fontSize:40,marginBottom:12,animation:"pulse 1.5s infinite"}}>🎨</div>
                <div style={{fontFamily:"Georgia,serif",fontSize:16,color:"#c9a84c",marginBottom:8}}>Gerando simulação com IA...</div>
                <div style={{fontSize:12,color:"#555"}}>A inteligência artificial está criando uma imagem realista da {vizModelo} na janela do cliente</div>
                <div style={{width:200,height:4,background:"#1a1a24",borderRadius:2,margin:"16px auto 0",overflow:"hidden"}}>
                  <div style={{width:"60%",height:"100%",background:"linear-gradient(90deg,#c9a84c,#e0bf6a)",borderRadius:2,animation:"loading 1.5s infinite"}}/>
                </div>
                <style>{`@keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}} @keyframes loading{0%{transform:translateX(-100%)}100%{transform:translateX(200%)}}`}</style>
              </div>
            )}

            {/* Resultado */}
            {vizResultado && (
              <div style={{marginTop:20}}>
                <div className="card" style={{overflow:"hidden"}}>
                  <img src={vizResultado} alt="Simulação" style={{width:"100%",display:"block"}}/>
                </div>
                <div style={{display:"flex",gap:10,marginTop:14,flexWrap:"wrap"}}>
                  <a href={vizResultado} download="simulacao-persiana.png" target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                    <button className="btn bp">📥 Baixar Imagem</button>
                  </a>
                  <button className="btn bg" onClick={()=>{setVizResultado(null);gerarSimulacao()}}>🔄 Gerar Novamente</button>
                  <button className="btn bg" onClick={()=>{setVizFotoAmbiente(null);setVizFotoTecido(null);setVizResultado(null);setVizErro("")}}>📷 Nova Simulação</button>
                </div>
                <div style={{fontSize:11,color:"#555",marginTop:10}}>💡 Dica: baixe a imagem e envie pelo WhatsApp para o cliente</div>
              </div>
            )}
          </div>
        )}


        {/* CONVERTER PDF */}
        {view==="converter" && (
          <div style={{maxWidth:700}}>
            <div style={{fontFamily:"Georgia,serif",fontSize:22,marginBottom:4}}>📄 Converter Orçamento → Pedido de Compra</div>
            <div style={{fontSize:12,color:"#555",marginBottom:24}}>Converte automaticamente o PDF do orçamento em pedido de compra</div>

            <div className="card" style={{padding:24}}>
              {/* Upload */}
              <div style={{marginBottom:20}}>
                <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"1px"}}>Upload do PDF do Orçamento</label>
                <label style={{display:"flex",alignItems:"center",gap:12,padding:"20px 18px",background:"#0d0d15",borderRadius:10,border:`1px solid ${convFile?"#10b98140":"#2a2a3a"}`,cursor:"pointer",transition:"all .15s"}}>
                  <div style={{fontSize:28}}>{convFile?"✅":"📄"}</div>
                  <div>
                    <div style={{fontSize:13,color:convFile?"#10b981":"#aaa"}}>{convFile?convFile.name:"Selecionar PDF do orçamento"}</div>
                    <div style={{fontSize:11,color:"#555",marginTop:2}}>{convFile?"Toque para trocar":"Arquivo gerado pelo sistema Persianas em Casa"}</div>
                  </div>
                  <input type="file" accept=".pdf" onChange={e=>{
                    const f=e.target.files?.[0]; if(!f) return;
                    setConvFile(f); setConvResult(null); setConvErro(""); setConvCliente(""); setConvTelefone("");
                  }} style={{display:"none"}}/>
                </label>
              </div>

              {/* Prazo de entrega */}
              <div style={{marginBottom:20}}>
                <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"1px"}}>Prazo de Entrega</label>
                <div style={{display:"flex",gap:8}}>
                  {[
                    {v:"auto",l:"🔄 Automático",desc:"Detecta do PDF"},
                    {v:"persiana",l:"🪟 Persiana",desc:"20 dias úteis"},
                    {v:"cortina",l:"🪢 Cortina",desc:"25 dias úteis"},
                    {v:"misto",l:"🪟🪢 Misto",desc:"25 dias (maior prazo)"},
                  ].map(op=>(
                    <button key={op.v} onClick={()=>setConvPrazo(op.v)} style={{flex:1,padding:"10px 8px",borderRadius:8,border:`1px solid ${convPrazo===op.v?"#c9a84c":"#2a2a3a"}`,background:convPrazo===op.v?"#c9a84c20":"transparent",color:convPrazo===op.v?"#c9a84c":"#777",fontSize:12,cursor:"pointer",transition:"all .15s",textAlign:"center"}}>
                      <div style={{fontWeight:600}}>{op.l}</div>
                      <div style={{fontSize:10,marginTop:2,opacity:0.7}}>{op.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Observações editáveis */}
              <div style={{marginBottom:20}}>
                <label style={{fontSize:11,color:"#777",display:"block",marginBottom:6,textTransform:"uppercase",letterSpacing:"1px"}}>Observações (editável)</label>
                <textarea className="inp" value={convObs} onChange={e=>setConvObs(e.target.value)} style={{minHeight:120,fontSize:12,lineHeight:1.6}}/>
                <div style={{fontSize:10,color:"#555",marginTop:4}}>Esse texto será adicionado na última página do pedido de compra</div>
              </div>

              {convErro && (
                <div style={{padding:"12px 16px",background:"#ef444415",border:"1px solid #ef444430",borderRadius:8,color:"#ef4444",fontSize:13,marginBottom:16}}>
                  ⚠️ {convErro}
                </div>
              )}

              {/* Botão Converter */}
              <button className="btn bp" style={{width:"100%",padding:16,fontSize:16,fontFamily:"Georgia,serif",letterSpacing:1}} disabled={!convFile||convLoading} onClick={async()=>{
                if(!convFile) return;
                setConvLoading(true); setConvErro(""); setConvResult(null);
                try {
                  if(!window.PDFLib){
                    await new Promise((res,rej)=>{
                      const s=document.createElement("script");
                      s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js";
                      s.onload=res; s.onerror=rej;
                      document.head.appendChild(s);
                    });
                  }
                  const { PDFDocument, PDFName, rgb, StandardFonts } = window.PDFLib;
                  let arrayBuf = await convFile.arrayBuffer();
                  let uint8 = new Uint8Array(arrayBuf);
                  for(let i=0;i<Math.min(uint8.length,1000);i++){
                    if(uint8[i]===0x25&&uint8[i+1]===0x50&&uint8[i+2]===0x44&&uint8[i+3]===0x46){
                      if(i>0){ uint8=uint8.slice(i); arrayBuf=uint8.buffer.slice(uint8.byteOffset,uint8.byteOffset+uint8.byteLength); }
                      break;
                    }
                  }
                  const pdfDoc = await PDFDocument.load(arrayBuf, {ignoreEncryption:true});
                  const pages = pdfDoc.getPages();
                  const page = pages[0];
                  const {width,height} = page.getSize();
                  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
                  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

                  // Extrair texto do PDF
                  let pdfFullText=""; let nomeCliente="Cliente"; let telefoneCliente=""; let numeroPedido="";
                  try {
                    const ref=page.node.get(PDFName.of("Contents"));
                    if(ref){
                      const obj=pdfDoc.context.lookup(ref); let stream="";
                      if(obj){
                        try{ stream=new TextDecoder("latin1").decode(obj.decodeContents?obj.decodeContents():obj.getContents()); }catch(e){}
                        if(!stream&&obj.constructor.name==="PDFArray"){
                          for(let i=0;i<obj.size();i++){const sr=obj.get(i);const st=pdfDoc.context.lookup(sr);if(st){try{stream+=new TextDecoder("latin1").decode(st.decodeContents?st.decodeContents():st.getContents());}catch(e){}}}
                        }
                      }
                      if(stream){
                        const parts=[]; let m; const tjR=/\(([^)]*)\)\s*Tj/g;
                        while((m=tjR.exec(stream))!==null) parts.push(m[1]);
                        const tjAR=/\[([^\]]*)\]\s*TJ/g;
                        while((m=tjAR.exec(stream))!==null){const inner=m[1];const sR=/\(([^)]*)\)/g;let s;let c="";while((s=sR.exec(inner))!==null)c+=s[1];if(c)parts.push(c);}
                        pdfFullText=parts.join(" ");
                        const cm=pdfFullText.match(/CLIENTE:\s*(.+?)(?:\s*DATA:|\s*$)/i);
                        if(cm){let n=cm[1].trim();n=n.replace(/\b\w+/g,w=>w.charAt(0).toUpperCase()+w.slice(1).toLowerCase());nomeCliente=n;}
                        const tm=pdfFullText.match(/CELULAR:\s*(\d+)/i); if(tm) telefoneCliente=tm[1];
                        const nm=pdfFullText.match(/N[º°]:\s*(\d+)/i); if(nm) numeroPedido=nm[1];
                      }
                    }
                  }catch(e){}
                  setConvCliente(nomeCliente); setConvTelefone(telefoneCliente);

                  // Prazo automático
                  let prazoTexto="25 DIAS UTEIS";
                  if(convPrazo==="persiana") prazoTexto="20 DIAS UTEIS";
                  else if(convPrazo==="cortina"||convPrazo==="misto") prazoTexto="25 DIAS UTEIS";
                  else { // auto: detectar do conteúdo
                    const txt=pdfFullText.toLowerCase();
                    const temCortina=txt.includes("cort");
                    const temPersiana=txt.includes("rolo")||txt.includes("double")||txt.includes("triple")||txt.includes("veneziana")||txt.includes("plissada")||txt.includes("colmeia")||txt.includes("zebra")||txt.includes("madeira")||txt.includes("alumin");
                    // Se tem cortina (independente de ter persiana também), usa 25 dias
                    prazoTexto=temCortina?"25 DIAS UTEIS":"20 DIAS UTEIS";
                  }

                  // === 0. CABEÇALHO ===
                  page.drawRectangle({x:300, y:height-85, width:270, height:40, color:rgb(1,1,1), borderWidth:0});
                  page.drawText("A empresa PERSIANAS EM CASA LTDA., com sede em Campinas, SP,", {x:340, y:height-65, size:6.5, font:fontRegular, color:rgb(0,0,0)});
                  page.drawText("está cadastrada sob o CNPJ 46.987.484/0001-05", {x:370, y:height-76, size:6.5, font:fontRegular, color:rgb(0,0,0)});
                  // === 1. TÍTULO ===
                  page.drawRectangle({x:28.62, y:height-142.36, width:343, height:28.70, color:rgb(0.753,0.753,0.753), borderWidth:0});
                  const titleText="PEDIDO DE COMPRA Nº:"; const titleWidth=fontBold.widthOfTextAtSize(titleText,14.29);
                  page.drawText(titleText, {x:372.26-titleWidth-6, y:height-136.33, size:14.29, font:fontBold, color:rgb(0,0,0)});
                  // === 2. PRAZO ===
                  page.drawRectangle({x:454.83, y:height-204.70, width:111.83, height:20.78, color:rgb(1,1,1), borderWidth:0});
                  page.drawText(prazoTexto, {x:457.85, y:height-198.79, size:7.7, font:fontRegular, color:rgb(0,0,0)});
                  // === 3. GARANTIA ===
                  page.drawRectangle({x:28.62, y:height-246.26, width:30.88, height:20.78, color:rgb(0.937,0.937,0.937), borderWidth:0});
                  page.drawRectangle({x:59.51, y:height-246.26, width:72.93, height:20.78, color:rgb(1,1,1), borderWidth:0});
                  page.drawRectangle({x:132.44, y:height-246.26, width:80, height:20.78, color:rgb(0.937,0.937,0.937), borderWidth:0});
                  page.drawText("GARANTIA:", {x:87.37, y:height-240.35, size:7.7, font:fontBold, color:rgb(0,0,0)});
                  const gLabelW=fontBold.widthOfTextAtSize("GARANTIA: ",7.7);
                  page.drawText("3 ANOS", {x:87.37+gLabelW, y:height-240.35, size:7.7, font:fontRegular, color:rgb(0,0,0)});
                  // === 4. ITENS DO PEDIDO ===
                  page.drawRectangle({x:28.63, y:height-294.49, width:538.02, height:21.13, color:rgb(0.722,0.525,0.043), borderWidth:0});
                  const itensText="ITENS DO PEDIDO"; const itensW=fontBold.widthOfTextAtSize(itensText,7.82);
                  page.drawText(itensText, {x:(width-itensW)/2, y:height-288.48, size:7.82, font:fontBold, color:rgb(1,1,1)});

                  // === 5. OBSERVAÇÕES (texto editável) ===
                  const lastPage=pages[pages.length-1]; const{width:lW,height:lH}=lastPage.getSize();
                  const obsPage=pdfDoc.addPage([lW,lH]);
                  obsPage.drawRectangle({x:0, y:lH-52, width:lW, height:52, color:rgb(0.753,0.753,0.753)});
                  obsPage.drawText("OBSERVAÇÕES DO PEDIDO DE COMPRA", {x:150, y:lH-35, size:14, font:fontBold, color:rgb(0,0,0)});
                  const obsLinhas=convObs.split("\n"); let oY=lH-90;
                  obsLinhas.forEach(linha=>{ if(oY<50) return; obsPage.drawText(linha,{x:45,y:oY,size:9,font:fontRegular,color:rgb(0.2,0.2,0.2)}); oY-=14; });
                  oY-=20; obsPage.drawText("Persianas em Casa — Qualidade e conforto para seu lar.",{x:45,y:oY,size:9,font:fontBold,color:rgb(0.722,0.525,0.043)});

                  const pdfBytes=await pdfDoc.save();
                  const safeName=nomeCliente.replace(/[<>:"/\\|?*]/g,"").trim();
                  const blob=new Blob([pdfBytes],{type:"application/pdf"});
                  const url=URL.createObjectURL(blob);
                  setConvResult({url,nome:`Pedido de compra ${safeName}.pdf`});
                  showToast("PDF convertido com sucesso!");
                  salvarHistoricoConv(nomeCliente, numeroPedido, userInfo.nome);
                } catch(e) { console.error(e); setConvErro("Erro ao processar o PDF. Verifique se é um orçamento válido."); }
                setConvLoading(false);
              }}>
                {convLoading ? "⏳ Convertendo..." : "🔄 Converter para Pedido de Compra"}
              </button>
            </div>

            {/* Resultado */}
            {convResult && (
              <div style={{marginTop:20}}>
                <div className="card" style={{padding:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                    <div style={{fontSize:36}}>✅</div>
                    <div>
                      <div style={{fontFamily:"Georgia,serif",fontSize:16,color:"#10b981"}}>Pedido de Compra Gerado!</div>
                      <div style={{fontSize:12,color:"#555",marginTop:2}}>Cliente: {convCliente}</div>
                    </div>
                  </div>
                  <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
                    <a href={convResult.url} download={convResult.nome} style={{textDecoration:"none"}}><button className="btn bp">📥 Baixar PDF</button></a>
                    {convTelefone && (
                      <a href={`https://wa.me/55${convTelefone}?text=${encodeURIComponent(`Olá, ${convCliente.split(" ")[0]}! 😊\n\nSegue o seu pedido de compra conforme combinado.\n\nQualquer dúvida estou à disposição!\n\n${userInfo.nome} - Persianas em Casa`)}`} target="_blank" rel="noreferrer" style={{textDecoration:"none"}}>
                        <button className="btn bg" style={{color:"#25d366",borderColor:"#25d36640"}}>💬 Enviar WhatsApp</button>
                      </a>
                    )}
                    <button className="btn bg" onClick={()=>{setConvFile(null);setConvResult(null);setConvErro("");setConvCliente("");setConvTelefone("")}}>📄 Novo Arquivo</button>
                  </div>
                </div>
                <div style={{marginTop:14,borderRadius:12,overflow:"hidden",border:"1px solid #2a2a3a"}}>
                  <iframe src={convResult.url} style={{width:"100%",height:500,border:"none"}} title="Preview PDF"/>
                </div>
              </div>
            )}

            {/* Histórico */}
            {convHistorico.length>0 && (
              <div style={{marginTop:20}}>
                <div style={{fontSize:11,color:"#555",textTransform:"uppercase",letterSpacing:"1px",marginBottom:10}}>📋 Últimas conversões</div>
                <div className="card">
                  {convHistorico.map((h,i)=>(
                    <div key={h.id||i} style={{padding:"10px 16px",borderBottom:"1px solid #1a1a24",display:"flex",justifyContent:"space-between",alignItems:"center",fontSize:13}}>
                      <div>
                        <span style={{fontWeight:600}}>{h.cliente}</span>
                        {h.numero_pedido && <span style={{fontSize:11,color:"#c9a84c",marginLeft:8}}>#{h.numero_pedido}</span>}
                      </div>
                      <div style={{fontSize:11,color:"#555"}}>{h.data_conversao} · {h.usuario}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                {/* Nome com verificação de duplicata */}
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Nome *</label>
                  <input className="inp" value={form.cliente} onChange={e=>setForm({...form,cliente:e.target.value})} style={{borderColor: !form.id && form.cliente && visitas.some(v=>v.id!==form.id && v.cliente?.toLowerCase().trim()===form.cliente.toLowerCase().trim()) ? "#ef4444" : undefined }}/>
                  {!form.id && form.cliente && (()=>{
                    const dup = visitas.find(v=>v.id!==form.id && v.cliente?.toLowerCase().trim()===form.cliente.toLowerCase().trim());
                    if(!dup) return null;
                    return (
                      <div style={{marginTop:8,padding:"10px 14px",background:"#ef444415",border:"1px solid #ef444430",borderRadius:8}}>
                        <div style={{fontSize:12,color:"#ef4444",fontWeight:600,marginBottom:4}}>⚠️ Cliente já cadastrado!</div>
                        <div style={{fontSize:11,color:"#aaa"}}>
                          "{dup.cliente}" já tem uma visita ({STATUS[dup.status]?.label}) em {dup.dataVisita||"—"}
                        </div>
                        <button className="sb" style={{fontSize:11,marginTop:8,color:"#3b82f6",borderColor:"#3b82f640"}} onClick={()=>{setSelected(dup);setView("detalhe")}}>
                          📋 Ver visita existente
                        </button>
                      </div>
                    );
                  })()}
                </div>
                {[{label:"Telefone",k:"telefone"},{label:"E-mail",k:"email"}].map(f=>(
                  <div key={f.k} style={{marginBottom:12}}>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>{f.label}</label>
                    <input className="inp" value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}/>
                  </div>
                ))}
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Data</label>
                  <input className="inp" type="date" value={brToIso(form.dataVisita)} onChange={e=>setForm({...form,dataVisita:isoToBr(e.target.value)})}/>
                </div>
                <div style={{marginBottom:12}}>
                  <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Horário</label>
                  <input className="inp" type="time" value={form.horaVisita||""} onChange={e=>setForm({...form,horaVisita:e.target.value})}/>
                </div>
                {[{label:"OP_ID",k:"opId"},{label:"Endereço",k:"endereco"}].map(f=>(
                  <div key={f.k} style={{marginBottom:12}}>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>{f.label}</label>
                    <input className="inp" value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}/>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:14}}>
                <div className="card" style={{padding:18}}>
                  <div style={{fontSize:10,color:"#f59e0b",textTransform:"uppercase",letterSpacing:"1px",marginBottom:14}}>🏠 Contexto</div>
                  {[{label:"Ambiente(s)",k:"ambiente"},{label:"Motivo",k:"motivoCompra"},{label:"Urgência",k:"urgencia"},{label:"Medidas",k:"medidas"}].map(f=>(
                    <div key={f.k} style={{marginBottom:12}}>
                      <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>{f.label}</label>
                      <input className="inp" value={form[f.k]} onChange={e=>setForm({...form,[f.k]:e.target.value})}/>
                    </div>
                  ))}
                  <div style={{marginBottom:12}}>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:8}}>Produtos de Interesse</label>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
                      {["Rolo","Rolo Motorizado","Double Vision","Double Vision Motorizado","Triple Shade","Triple Shade Motorizado","Cortina","Cortina Motorizada","Madeira","Madeira Motorizado","Alumínio","Alumínio Motorizado","Romana","Romana Motorizada"].map(p=>{
                        const selecionados = (form.produtos||"").split(",").map(s=>s.trim()).filter(Boolean);
                        const marcado = selecionados.includes(p);
                        return (
                          <label key={p} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:7,background:marcado?"#c9a84c15":"#0d0d15",border:`1px solid ${marcado?"#c9a84c40":"#1e1e28"}`,cursor:"pointer",fontSize:12,color:marcado?"#c9a84c":"#777",transition:"all .15s"}}>
                            <input type="checkbox" checked={marcado} onChange={()=>{
                              const nova = marcado ? selecionados.filter(s=>s!==p) : [...selecionados,p];
                              setForm({...form,produtos:nova.join(", ")});
                            }} style={{accentColor:"#c9a84c"}}/>
                            {p}
                          </label>
                        );
                      })}
                    </div>
                    {form.produtos && <div style={{fontSize:11,color:"#c9a84c",marginTop:8}}>✓ {form.produtos}</div>}
                  </div>
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
                    <input className="inp" type="date" value={brToIso(form.dataInstalacao)} onChange={e=>setForm({...form,dataInstalacao:isoToBr(e.target.value)})}/>
                    {form.status==="fechado" && form.dataInstalacao && (
                      <div style={{fontSize:11,color:"#8b5cf6",marginTop:4}}>
                        📅 {(form.produtos||"").toLowerCase().includes("cortina")?"25 dias úteis (cortina)":"20 dias úteis (persiana)"} a partir de hoje
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={{fontSize:11,color:"#777",display:"block",marginBottom:5}}>Status</label>
                    <select className="inp" value={form.status} onChange={e=>{
                      const novoStatus = e.target.value;
                      const updates = {status: novoStatus};
                      if(novoStatus==="fechado" && !form.dataInstalacao){
                        const prazo = calcPrazo(new Date().toLocaleDateString("pt-BR"), form.produtos);
                        if(prazo) updates.dataInstalacao = prazo;
                      }
                      setForm({...form,...updates});
                    }}>
                      {Object.entries(STATUS).map(([k,v])=><option key={k} value={k}>{v.icon} {v.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <button className="btn bp" style={{padding:"12px 28px"}} onClick={salvar} disabled={saving || (!form.id && form.cliente && visitas.some(v=>v.id!==form.id && v.cliente?.toLowerCase().trim()===form.cliente.toLowerCase().trim()))}>{saving?"Salvando...":(form.id?"Salvar":"Cadastrar Visita")}</button>
              <button className="btn bg" onClick={()=>setView(form.id?"detalhe":"lista")}>← Voltar</button>
              <button className="btn bg" style={{color:"#f59e0b",borderColor:"#f59e0b40"}} onClick={()=>{if(window.confirm("Limpar todos os campos?"))setForm({...empty})}}>🗑️ Limpar</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
