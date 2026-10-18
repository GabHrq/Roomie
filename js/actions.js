/* actions.js - regras de negócio (XP, admin) e ações dos botões (ACT)
   Parte do Roomie. Carregado via <script> em index.html (ordem: state, utils, screens, actions, main). */
/* ---------- 4. REGRAS DE NEGÓCIO E AÇÕES ----------
   isAdm: o usuário ('Você') é admin? | lv: nível = XP/100 + 1 | TIT: títulos de nível
   award(nome, pontos): soma/subtrai XP e avisa se for o usuário (inclui subida de nível). */
const isAdm=()=>!!S.adm['Você'];
const lv=x=>Math.floor(x/100)+1,TIT=['Novato','Colega de casa','Guardião da casa','Mestre da república','Lenda do lar'],hm=()=>new Date().toTimeString().slice(0,5);
function award(n,p){const b=S.xp[n]||0;S.xp[n]=Math.max(0,b+p);if(n==='Você'){const l=lv(S.xp[n]);toast((p>0?'+':'')+p+' XP 🎮'+(l>lv(b)?' · Nível '+l+'!':''))}}
/* ACT: uma função por ação de botão (data-a). Assinatura: (valor, índice). */
const ACT={
// Navegação: troca de tela (fecha painéis e modos de edição)
 go:v=>{S.scr=v;S.sheet=false;S.editH=false;S.mng=0;render();$('.scr').scrollTop=0},
 toast:v=>toast(v),
// Alterna tema claro/escuro lendo o atributo data-theme (ou o tema do aparelho)
 theme:()=>{const r=document.documentElement,cur=r.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');r.dataset.theme=cur==='dark'?'light':'dark'},
// Filtros e navegação de mês
 ef:v=>{S.ef=v;render()},tf:v=>{S.tf=v;render()},
 mo:(v,i)=>{let [y,m]=S.month.split('-').map(Number);m+=i;if(m<1){m=12;y--}if(m>12){m=1;y++}S.month=y+'-'+String(m).padStart(2,'0');render()},
// Alternar status: despesa paga/pendente e tarefa concluída (concedem ou retiram XP)
 tex:(v,i)=>{const e=S.ex[i];e.paid=e.paid?0:1;render();award(e.by,e.paid?10:-10)},
 tt:(v,i)=>{const t=S.tk[i];t.done=t.done?0:1;t.late=t.done?0:t.late;render();award(t.o,t.done?20:-20)},
// Lista da casa: marcar, remover item, remover marcados
 tl:(v,i)=>{S.li[i].c=S.li[i].c?0:1;render()},
 rmli:(v,i)=>{S.li.splice(i,1);render();toast('Item removido')},
 clrli:()=>{S.li=S.li.filter(x=>!x.c);render();toast('Itens marcados removidos')},
// Regras da casa (somente admins)
 addrl:()=>{if(!isAdm())return toast('Apenas admins podem editar as regras 🔒');const el=$('#rin'),t=el.value.trim();if(!t)return toast('Digite a regra');S.rules.push(t);render();$('#rin').focus()},
 rmrl:(v,i)=>{if(!isAdm())return toast('Apenas admins podem editar as regras 🔒');S.rules.splice(i,1);render();toast('Regra removida')},
// Casa: editar nome/endereço/descrição (admins) e remoções de despesa/tarefa
 edithn:()=>{if(!isAdm())return toast('Apenas admins podem editar a casa 🔒');S.scr='house';S.editH=true;render();const el=$('#hn');el.focus();el.select()},
 savehn:()=>{const n=$('#hn').value.trim();if(!n)return toast('Digite o nome da casa');S.house=n;S.addr=$('#ha').value.trim();S.tag=$('#ht').value.trim();S.editH=false;render();toast('Casa renomeada ✓')},
 cancelhn:()=>{S.editH=false;render()},
 rmex:(v,i)=>{S.ex.splice(i,1);render();toast('Despesa removida')},
 rmtk:(v,i)=>{S.tk.splice(i,1);render();toast('Tarefa removida')},
// Lista: adicionar item (+5 XP)
 addli:()=>{const el=$('#lin'),t=el.value.trim();if(!t)return toast('Digite o nome do item');S.li.push({t,by:'você',c:0});render();$('#lin').focus();award('Você',5)},
// Admins: abrir modo gerenciar e promover/remover (sempre resta ao menos 1 admin)
 mng:()=>{if(!isAdm())return toast('Apenas admins podem gerenciar moradores 🔒');S.mng=S.mng?0:1;render()},
 adm:v=>{if(S.adm[v]&&Object.keys(S.adm).filter(k=>S.adm[k]).length<2)return toast('A casa precisa ter ao menos 1 admin');S.adm[v]=S.adm[v]?0:1;if(!isAdm())S.mng=0;render();toast(S.adm[v]?v+' agora é admin ✓':'Admin removido de '+v)},
// Proprietário e mural: aluguel, chamados (status 0/1/2), comunicados e envio de mensagens
 rent:()=>{S.rent.paid=S.rent.paid?0:1;render();award('Você',S.rent.paid?25:-25)},
 mts:(v,i)=>{S.mt[i].s=(S.mt[i].s+1)%3;render()},
 rmmt:(v,i)=>{S.mt.splice(i,1);render()},
 addmt:()=>{const t=$('#min').value.trim();if(!t)return toast('Descreva o problema');S.mt.unshift({t,by:'Você',s:0});render();toast('Chamado aberto ✓')},
 qmsg:v=>{S.msgs.push({a:'Proprietário',t:v,h:hm()});toast('Enviado ao mural ✓')},
 send:()=>{const t=$('#min2').value.trim();if(!t)return;S.msgs.push({a:'Você',t,h:hm()});render();$('.scr').scrollTop=1e5;$('#min2').focus()},
// Formulário Nova despesa: alternar morador na divisão e salvar (com validações)
 sp:v=>{S.nx.sel[v]=S.nx.sel[v]?0:1;render()},
 saveex:()=>{
  const n=S.nx,v=parseFloat(String(n.v).replace(',','.')),c=Object.values(n.sel).filter(Boolean).length;
  if(!n.d.trim())return toast('Informe a descrição');
  if(!(v>0))return toast('Informe um valor válido');
  if(!n.by)return toast('Selecione quem pagou');
  if(!c)return toast('Selecione quem divide');
  const k=n.d.toLowerCase(),ic=/internet|wi/.test(k)?'📶':/luz|energia/.test(k)?'⚡':/mercado|compra/.test(k)?'🛒':/limpeza/.test(k)?'🧴':/água|agua/.test(k)?'💧':'🧾';
  S.ex.unshift({d:n.d.trim(),v,by:n.by,dt:n.dt,paid:0,ic});S.month=n.dt.slice(0,7);
  S.nx={d:'',v:'',by:'',dt:n.dt,sel:{'João':1,Lucas:1}};S.scr='exp';render();toast('Despesa salva ✓');
 },
// Painel Nova tarefa: abrir, fechar e salvar
 newtk:()=>{S.sheet=true;render();$('#tt1').focus()},
 closesheet:()=>{S.sheet=false;render()},
 savetk:()=>{const t=$('#tt1').value.trim();if(!t)return toast('Informe o título');const dt=$('#tt3').value||'2024-06-10';S.tk.push({t,o:$('#tt2').value,w:tkLabel(dt),late:dt<'2024-06-10'?1:0,done:0});S.sheet=false;S.tf='Todas';render();toast('Tarefa salva ✓')}
};
