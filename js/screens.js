/* screens.js - telas (HTML a partir do estado), render, aviso (toast) e rótulo de prazo
   Parte do Roomie. Carregado via <script> em index.html (ordem: state, utils, screens, actions, main). */
/* ---------- 3. TELAS ----------
   Cada função devolve uma string HTML a partir do estado S. */
/** INÍCIO: casa, nível/XP, mural, indicadores, próximas tarefas e pendências. */
function home(){
 const tot=monthEx().reduce((a,e)=>a+e.v,0);
 const nx=S.tk.filter(t=>!t.done).slice(0,3);
 const ics=['💲','🗑️','🧼'];
 return `<div class="top"><span class="logo">Roomie</span><span style="flex:1"></span><button data-a="toast" data-v="Sem notificações novas 🔔" aria-label="Notificações" style="font-size:20px">🔔</button></div>
 <div class="house"><div class="big">🏡</div><div><b>${esc(S.house)} ▾</b><br><small style="color:var(--mut)">${NAMES.length} moradores</small></div></div>
 <button class='row' data-a='go' data-v='ach' style='margin-top:12px'><div class='ic ok'>🎮</div><div class='t'><b>Nível ${lv(S.xp['Você'])} · ${TIT[Math.min(4,lv(S.xp['Você'])-1)]}</b><div class='prog'><i style='width:${S.xp['Você']%100}%'></i></div><small>${S.xp['Você']%100}/100 XP para o próximo nível</small></div>›</button>
 <button class='row' data-a='go' data-v='msgs'><div class='ic bl'>💬</div><div class='t'><b>Mural de avisos</b><small>${esc(S.msgs[S.msgs.length-1].a)}: ${esc(S.msgs[S.msgs.length-1].t.slice(0,32))}…</small></div>›</button>
 <div class="stats">
  <div class="stat ok"><span>Despesas do mês<b>${brl(tot)}</b></span><span style="font-size:20px">💲</span></div>
  <div class="stat bl"><span>Seu saldo<b>R$ 15,00</b></span><span style="font-size:20px">🐷</span></div>
  <div class="stat or"><span>Tarefas pendentes<b>${pend()}</b></span><span style="font-size:20px">✅</span></div>
 </div>
 <h2>Próximas tarefas <a data-a="go" data-v="tasks">Ver todas</a></h2>
 ${nx.map((t,k)=>`<button class="row" data-a="go" data-v="tasks"><div class="ic ${['or','bl','ok'][k]}">${ics[k]}</div><div class="t"><b>${esc(t.t)}</b><small>${esc(t.w.split(',')[0])} • ${esc(t.o)}</small></div>›</button>`).join('')||'<div class="empty">Tudo em dia! 🎉</div>'}
 <h2>Pendências</h2>
 <button class="row" data-a="go" data-v="exp"><div class="ic rd">📶</div><div class="t"><b>Internet vence amanhã</b><small>R$ 120,00</small></div>›</button>
 <button class="row" data-a="go" data-v="exp"><div class="ic pu">👤</div><div class="t"><b>Lucas deve R$ 30,00</b><small>referente a Mercado (10/06)</small></div>›</button>
 <button class="row" data-a="go" data-v="list"><div class="ic ok">🛒</div><div class="t"><b>Lista de compras</b><small>${lipend()} itens pendentes</small></div>›</button>`;
}
/** DESPESAS: navegação por mês, total, filtros e lista (toque alterna pago/pendente). */
function exp(){
 const [y,m]=S.month.split('-');const all=monthEx();
 const tot=all.reduce((a,e)=>a+e.v,0);
 const l=all.filter(e=>S.ef==='Todas'||(S.ef==='Pagas')===!!e.paid);
 return `<div class="top"><button data-a="go" data-v="home" aria-label="Voltar" style="font-size:22px">‹</button><h1>Despesas</h1></div>
 <div class="month"><button data-a="mo" data-i="-1" aria-label="Mês anterior">‹</button>${MES[+m-1]} de ${y}<button data-a="mo" data-i="1" aria-label="Próximo mês">›</button></div>
 <div class="total"><div>Total do mês<b>${brl(tot)}</b></div><div class="bars"><i style="height:14px"></i><i style="height:24px"></i><i style="height:36px"></i></div></div>
 <div class="seg">${['Todas','Pagas','Pendentes'].map(f=>`<button class="${S.ef===f?'on':''}" data-a="ef" data-v="${f}">${f}</button>`).join('')}</div>
 ${l.map(e=>`<div class="row"><button data-a="tex" data-i="${e.i}" title="Toque para alternar pago/pendente" style="display:flex;flex:1;min-width:0;align-items:center;gap:12px;text-align:left"><div class="ic ${e.paid?'rd':'rd'}">${e.ic}</div><div class="t"><b>${esc(e.d)}</b><small>Pago por ${esc(e.by)}<br>${fdt(e.dt)}</small></div><div style="text-align:right"><b>${brl(e.v)}</b><span class="chip ${e.paid?'g':'p'}">${e.paid?'Pago':'Pendente'}</span></div></button><button data-a="rmex" data-i="${e.i}" aria-label="Remover despesa" style="font-size:18px">🗑️</button></div>`).join('')||'<div class="empty">Nenhuma despesa aqui. Toque em Nova despesa para adicionar.</div>'}`;
}
/** NOVA DESPESA: formulário; os campos ficam em S.nx para sobreviver aos re-renders. */
function nw(){
 const n=S.nx;
 return `<div class="top"><button data-a="go" data-v="exp" aria-label="Voltar" style="font-size:22px">‹</button><h1>Nova despesa</h1></div>
 <label style="margin-top:0">Descrição</label><input class="in" id="nd" placeholder="Ex.: Mercado, Internet, etc." value="${esc(n.d)}">
 <label>Valor</label><input class="in" id="nv" inputmode="decimal" placeholder="R$ 0,00" value="${esc(n.v)}">
 <div class="two"><div><label>Pago por</label><select class="in" id="nb"><option value="">Selecione</option>${NAMES.map(x=>`<option ${n.by===x?'selected':''}>${x}</option>`).join('')}</select></div>
 <div><label>Data</label><input class="in" type="date" id="ndt" value="${n.dt}"></div></div>
 <label>Dividir entre</label><small style="color:var(--mut)">Selecione os moradores que vão dividir a despesa:</small>
 <div class="ppl" style="margin-top:8px">${NAMES.map(x=>`<button class="pp ${n.sel[x]?'on':''}" data-a="sp" data-v="${x}"><span class="box">${n.sel[x]?'✓':''}</span>${av(x)}${x}</button>`).join('')}</div>
 <div class="div"><span style="font-size:28px">👥</span><div id="dv"></div></div>
 <button class="btn" data-a="saveex">Salvar despesa</button>`;
}
/** TAREFAS: abas Todas/Minhas/Concluídas; status por cor (atrasada, pendente, concluída). */
function tasks(){
 const l=S.tk.map((t,i)=>({...t,i})).filter(t=>S.tf==='Todas'||(S.tf==='Minhas'&&t.o==='Você')||(S.tf==='Concluídas'&&t.done));
 return `<h1>Tarefas</h1>
 <div class="seg">${['Todas','Minhas','Concluídas'].map(f=>`<button class="${S.tf===f?'on':''}" data-a="tf" data-v="${f}">${f}</button>`).join('')}</div>
 ${l.map(t=>`<div class="task ${t.done?'done':t.late?'late':''}"><button class="circ" data-a="tt" data-i="${t.i}" aria-label="Concluir tarefa">${t.done?'✅':t.late?'❗':'⚪'}</button><div class="t"><b>${esc(t.t)}</b><small>Responsável: ${esc(t.o)}</small><small>📅 ${esc(t.w)}</small></div>${t.done?'<span class="chip g">Concluída</span>':t.late?'<span class="chip r">Atrasada</span>':'<span class="chip p">Pendente</span>'}<button data-a="rmtk" data-i="${t.i}" aria-label="Remover tarefa" style="font-size:18px">🗑️</button></div>`).join('')||'<div class="empty">Nenhuma tarefa nesta aba.</div>'}`;
}
/** LISTA DA CASA: progresso, itens marcáveis, remoção e campo para adicionar. */
function list(){
 const d=S.li.filter(i=>i.c).length,n=S.li.length;
 return `<h1>Lista da casa</h1>
 <div class="row" style="display:block"><b style="font-size:13px">${d} de ${n} itens</b><div class="prog"><i style="width:${n?d/n*100:0}%"></i></div></div>
 ${S.li.map((x,i)=>`<div class="li ${x.c?'c':''}"><button data-a="tl" data-i="${i}" style="display:flex;flex:1;align-items:center;gap:12px;text-align:left"><span class="box ${x.c?'on':''}">${x.c?'✓':''}</span><span><b style="font-size:14px">${esc(x.t)}</b><br><small style="color:var(--mut)">Adicionado por ${esc(x.by)}</small></span></button><button data-a="rmli" data-i="${i}" aria-label="Remover ${esc(x.t)}" style="font-size:18px">🗑️</button></div>`).join('')||'<div class="empty">Lista vazia. Adicione o primeiro item abaixo.</div>'}
 ${d?`<button class="btn" style="background:var(--rd);color:var(--rdf);margin-top:6px" data-a="clrli">Remover itens marcados (${d})</button>`:''}
 <div class="add"><input class="in" id="lin" placeholder="Adicionar um item..."><button data-a="addli" aria-label="Adicionar item">+</button></div>
 <div class="empty">🛍️ Compras da casa sempre em dia!</div>`;
}
/** REGRAS DA CASA: edição inline; somente leitura para quem não é admin. */
function rules(){
 return `<div class="top"><button data-a="go" data-v="house" aria-label="Voltar" style="font-size:22px">‹</button><h1>Regras da casa</h1></div>
 <small style="color:var(--mut)">Toque em uma regra para editar o texto.</small><div style="height:10px"></div>
 ${S.rules.map((r,i)=>`<div class="li"><div class="ic ok">${i+1}</div><input class="in rl" style="flex:1;min-width:0" data-i="${i}" value="${esc(r)}" aria-label="Regra ${i+1}" ${isAdm()?'':'readonly'}><button data-a="rmrl" data-i="${i}" aria-label="Remover regra" style="font-size:18px">🗑️</button></div>`).join('')||'<div class="empty">Nenhuma regra ainda. Adicione a primeira abaixo.</div>'}
 <div class="add"><input class="in" id="rin" placeholder="Nova regra..."><button data-a="addrl" aria-label="Adicionar regra">+</button></div>`;
}
/** CASA: perfil, moradores (proprietário + admins), indicadores e menu. */
function house(){
 return `<h1>Casa</h1>
 <div class="house" style="flex-direction:column;align-items:flex-start"><div class="big" style="font-size:54px">🏡</div><div style="width:100%" class="${S.editH?'ed':''}">${S.editH?`<input class="in" id="hn" value="${esc(S.house)}" maxlength="40" aria-label="Nome da casa" style="margin-bottom:8px"><input class="in" id="ha" value="${esc(S.addr)}" maxlength="70" aria-label="Endereço da casa" placeholder="Endereço (ex.: Centro, São Paulo - SP)" style="margin-bottom:8px"><input class="in" id="ht" value="${esc(S.tag)}" maxlength="50" aria-label="Descrição da casa" placeholder="Descrição da casa" style="margin-bottom:8px"><div style="display:flex;gap:6px"><button class="chip g" data-a="savehn">Salvar</button><button class="chip r" data-a="cancelhn">Cancelar</button></div>`:`<b style="font-size:18px">${esc(S.house)}</b> <button data-a="edithn" aria-label="Renomear casa">✏️</button>`}<br><small style="color:var(--mut)">📍 ${esc(S.addr)}</small><br><small style="color:var(--g);font-weight:700">${esc(S.tag)} 💚</small></div></div>
 <h2>Moradores (${NAMES.length}) <a data-a='mng'>${S.mng?'Concluir':'Gerenciar'}</a></h2>
 <div class='row'><div class='av' style='background:#fde8c8;width:40px;height:40px;font-size:20px'>🔑</div><div class='t'><b>Roberto Lima</b><small>Proprietário do imóvel</small></div><span class='chip p'>Proprietário</span><button data-a='go' data-v='msgs' aria-label='Enviar mensagem ao proprietário' style='font-size:18px'>💬</button></div>
 ${NAMES.map(x=>`<div class='row'>${av(x,40)}<div class='t'><b>${x}</b><small>${S.adm[x]?'Administrador':'Morador'}</small></div>${S.adm[x]?`<span class='chip g'>Admin</span>`:''}${S.mng?`<button class='chip ${S.adm[x]?'r':'g'}' data-a='adm' data-v='${x}'>${S.adm[x]?'Remover admin':'Tornar admin'}</button>`:''}</div>`).join('')}
 
 <div class="kp"><div class="stat ok"><b>${NAMES.length}</b>Moradores</div><div class="stat bl"><b>3</b>Contas recorrentes</div><div class="stat or"><b>${S.rules.length}</b>Regras da casa</div></div>
 ${[['✏️','Editar casa'],['➕','Convidar morador'],['📖','Regras da casa'],['⚙️','Configurações']].map(([i,t])=>`<button class="menu" ${t==='Regras da casa'?'data-a="go" data-v="rules"':t==='Editar casa'?'data-a="edithn"':`data-a="toast" data-v="${t}: em breve"`}><span>${i}&nbsp; ${t}</span>›</button>`).join('')}
 <button class='menu' data-a='go' data-v='ach'><span>🎮&nbsp; Conquistas e ranking</span>›</button><button class='menu' data-a='go' data-v='owner'><span>🔑&nbsp; Painel do proprietário</span>›</button><button class='menu' data-a='go' data-v='msgs'><span>💬&nbsp; Mural de avisos</span>›</button>
 <button class="menu" data-a="theme"><span>🌗&nbsp; Alternar tema claro/escuro</span>›</button>`;
}
// Cabeçalho com botão voltar (para Casa) usado nas subtelas
const BK=t=>`<div class='top'><button data-a='go' data-v='house' aria-label='Voltar' style='font-size:22px'>‹</button><h1>${t}</h1></div>`;
/** CONQUISTAS: nível, medalhas (calculadas do estado) e ranking por XP. */
function ach(){
 const me=S.xp['Você'],L=lv(me);
 const B=[['🧹','Faxineiro','Conclua 1 tarefa',S.tk.some(t=>t.done)],['💸','Em dia','Todas as despesas pagas',S.ex.length>0&&S.ex.every(e=>e.paid)],['🛒','Chef das compras','3 itens comprados',S.li.filter(i=>i.c).length>=3],['📖','Legislador','5 regras na casa',S.rules.length>=5],['🔧','Zelador','Resolva 1 chamado',S.mt.some(m=>m.s==2)],['⭐','Veterano','Chegue a 200 XP',me>=200]];
 const R=[...NAMES].sort((a,b)=>S.xp[b]-S.xp[a]);
 return `${BK('Conquistas')}
 <div class='house' style='flex-direction:column;align-items:flex-start'><b style='font-size:18px'>Nível ${L} · ${TIT[Math.min(4,L-1)]}</b><div class='prog' style='width:100%'><i style='width:${me%100}%'></i></div><small style='color:var(--mut)'>${me} XP · faltam ${100-me%100} para o nível ${L+1}</small></div>
 <h2>Como ganhar XP</h2><small style='color:var(--mut)'>Concluir tarefa +20 · Pagar despesa +10 · Item na lista +5 · Aluguel em dia +25</small>
 <h2>Medalhas (${B.filter(b=>b[3]).length}/${B.length})</h2><div class='kp'>${B.map(b=>`<div class='stat ${b[3]?'or':''}' style='${b[3]?'':'background:var(--sf);opacity:.55;'}min-height:100px;text-align:center;align-items:center'><span style='font-size:26px'>${b[0]}</span><span>${b[1]}</span><small style='font-weight:600;color:var(--mut)'>${b[2]}</small></div>`).join('')}</div>
 <h2>Ranking da casa</h2>${R.map((n,i)=>`<div class='row'><b style='width:28px;font-size:16px'>${['🥇','🥈','🥉'][i]||(i+1)+'º'}</b>${n==='Você'?`<div class='av' style='background:#d9f2e3;width:36px;height:36px;font-size:19px'>🎮</div>`:av(n,36)}<div class='t'><b>${n}</b><small>Nível ${lv(S.xp[n])}</small></div><b>${S.xp[n]} XP</b></div>`).join('')}`;
}
/** PAINEL DO PROPRIETÁRIO: aluguel, chamados de manutenção e comunicados rápidos. */
function owner(){
 const r=S.rent,ST=['Aberto','Em andamento','Resolvido'],C=['r','p','g'];
 return `${BK('Painel do proprietário')}
 <div class='total'><div>Aluguel de junho<b>${brl(r.v)}</b><span>Vence dia ${r.day} · ${brl(r.v/NAMES.length)} por morador</span></div><span class='chip ${r.paid?'g':'p'}'>${r.paid?'Recebido':'Pendente'}</span></div>
 <button class='btn' data-a='rent'>${r.paid?'Desfazer recebimento':'Marcar aluguel como recebido'}</button>
 <div class='kp'><div class='stat ok'><b>${NAMES.length}</b>Moradores</div><div class='stat bl'><b>11</b>Meses de contrato</div><div class='stat or'><b>${S.mt.filter(m=>m.s<2).length}</b>Chamados abertos</div></div>
 <h2>Manutenção</h2>
 ${S.mt.map((m,i)=>`<div class='row'><div class='ic or'>🔧</div><div class='t'><b>${esc(m.t)}</b><small>Aberto por ${esc(m.by)}</small></div><button class='chip ${C[m.s]}' data-a='mts' data-i='${i}' title='Toque para mudar o status'>${ST[m.s]}</button><button data-a='rmmt' data-i='${i}' aria-label='Remover chamado' style='font-size:16px'>🗑️</button></div>`).join('')||'<div class="empty">Nenhum chamado.</div>'}
 <div class='add'><input class='in' id='min' placeholder='Descrever novo chamado...'><button data-a='addmt' aria-label='Abrir chamado'>+</button></div>
 <h2>Comunicados rápidos</h2>
 ${[['📅','Vistoria agendada para dia 20/06, às 14h.'],['💸','Lembrete: o aluguel vence dia 10.'],['🔧','Um técnico passará amanhã para reparos.']].map(([i,t])=>`<button class='row' data-a='qmsg' data-v='${t}'><div class='ic bl'>${i}</div><div class='t'><b>${t}</b><small>Toque para enviar ao mural</small></div></button>`).join('')}`;
}
/** MURAL DE AVISOS: conversa em balões (a direita são as mensagens do usuário). */
function msgs(){
 return `${BK('Mural de avisos')}
 ${S.msgs.map(m=>{const me=m.a==='Você';return `<div style='display:flex;flex-direction:column;align-items:${me?'flex-end':'flex-start'};margin-bottom:10px'><small style='color:var(--mut);font-weight:700'>${esc(m.a)} · ${m.h}</small><div style='max-width:82%;padding:10px 12px;border-radius:16px;font-size:14px;background:${me?'var(--g)':'var(--sf)'};color:${me?'#fff':'var(--ink)'}'>${esc(m.t)}</div></div>`}).join('')}
 <div class='add'><input class='in' id='min2' placeholder='Escreva um aviso para a casa...'><button data-a='send' aria-label='Enviar'>➤</button></div>`;
}
/** Barra inferior: 5 abas; subtelas mantêm a aba Casa (ou Despesas) destacada. */
function nav(){
 const a=S.scr==='new'?'exp':['rules','ach','owner','msgs'].includes(S.scr)?'house':S.scr;
 return `<nav>${[['home','🏠','Início'],['exp','💲','Despesas'],['tasks','✅','Tarefas'],['list','🛒','Lista'],['house','🏡','Casa']].map(([k,i,t])=>`<button class="${a===k?'on':''}" data-a="go" data-v="${k}"><span>${i}</span>${t}</button>`).join('')}</nav>`;
}
/** Painel (bottom sheet) para criar tarefa: título, responsável e data. */
function sheet(){
 return `<div class="shade" data-a="closesheet"><div class="sheet"><h1 style="margin-top:12px">Nova tarefa</h1>
 <label style="margin-top:0">Título</label><input class="in" id="tt1" placeholder="Ex.: Regar as plantas">
 <label>Responsável</label><select class="in" id="tt2">${NAMES.map(x=>`<option>${x}</option>`).join('')}</select>
 <label>Data</label><input class="in" type="date" id="tt3" value="2024-06-10"><div style="height:16px"></div><button class="btn" data-a="savetk">Salvar tarefa</button></div></div>`;
}
/** Redesenha tudo em #app a partir do estado, preservando a rolagem. Escolhe a tela em S.scr e o botão flutuante conforme a tela. */
function render(){
 const old=$('.scr');const top=old?old.scrollTop:0;
 const f=S.scr==='exp'?`<button class="fab" data-a="go" data-v="new">＋ Nova despesa</button>`:S.scr==='tasks'?`<button class="fab" data-a="newtk">＋ Nova tarefa</button>`:'';
 $('#app').innerHTML=`<div class="scr">${({home,exp,new:nw,tasks,list,house,rules,ach,owner,msgs})[S.scr]()}</div>${f}${nav()}${S.sheet?sheet():''}`;
 $('.scr').scrollTop=top;
 if(S.scr==='new')updDiv();
}
/** Atualiza só o cartão de divisão da despesa (evita re-render a cada tecla digitada). */
function updDiv(){
 const v=parseFloat(String(S.nx.v).replace(',','.'))||0,c=Object.values(S.nx.sel).filter(Boolean).length;
 $('#dv').innerHTML=c?`Divisão da despesa<b>${brl(v/c)} para cada</b>Será dividida entre ${c} moradores.`:'Selecione ao menos um morador.';
}
// Aviso temporário (1,8 s) no rodapé do celular
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;$('#app').appendChild(t);setTimeout(()=>t.remove(),1800)}
// Rótulo de prazo: 'Hoje' = 10/06/2024 (data fixa do protótipo), 'Amanhã', ou dia da semana
function tkLabel(iso){const d=new Date(iso+'T00:00:00'),dm=String(d.getDate()).padStart(2,'0')+'/'+String(d.getMonth()+1).padStart(2,'0');
 if(iso==='2024-06-10')return 'Hoje, '+dm;if(iso==='2024-06-11')return 'Amanhã, '+dm;
 return ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][d.getDay()]+', '+dm}
