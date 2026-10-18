/* utils.js - funções utilitárias e valores derivados do estado
   Parte do Roomie. Carregado via <script> em index.html (ordem: state, utils, screens, actions, main). */
/* ---------- 2. UTILITÁRIOS ---------- */
// Atalho para querySelector
const $=s=>document.querySelector(s);
// Formata número como moeda brasileira (R$ 1.234,56)
const brl=v=>v.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
// Converte data ISO (2024-06-10) em 10/06/2024
const fdt=d=>d.split('-').reverse().join('/');
// Escapa HTML: evita que texto digitado pelo usuário vire código na tela
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// Avatar do morador (círculo colorido com emoji); sz = tamanho opcional em px
const av=(n,sz)=>`<div class="av" style="background:${P[n][0]};${sz?`width:${sz}px;height:${sz}px`:''}">${P[n][1]}</div>`;
// Valores derivados do estado: tarefas pendentes, itens pendentes da lista e despesas do mês aberto
const pend=()=>S.tk.filter(t=>!t.done).length;
const lipend=()=>S.li.filter(i=>!i.c).length;
const monthEx=()=>S.ex.map((e,i)=>({...e,i})).filter(e=>e.dt.slice(0,7)===S.month);

