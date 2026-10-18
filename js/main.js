/* main.js - eventos globais e inicialização
   Parte do Roomie. Carregado via <script> em index.html (ordem: state, utils, screens, actions, main). */
/* ---------- 5. EVENTOS ----------
   Delegação: um único listener de clique acha o botão com data-a e chama ACT[data-a].
   Clicar no fundo escuro (shade) fecha o painel; clicar dentro dele não. */
document.addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(!a)return;if(a.dataset.a==='closesheet'&&e.target!==a)return;ACT[a.dataset.a]?.(a.dataset.v,+a.dataset.i)});
// Digitação: guarda os campos do formulário em S.nx, atualiza a divisão e as regras editadas
document.addEventListener('input',e=>{
 const m={nd:'d',nv:'v',ndt:'dt'}[e.target.id];
 if(m){S.nx[m]=e.target.value;if(m==='v')updDiv()}
 if(e.target.classList.contains('rl'))S.rules[+e.target.dataset.i]=e.target.value;
});
document.addEventListener('change',e=>{if(e.target.id==='nb')S.nx.by=e.target.value});
// Atalho Enter nos campos de texto (lista, regras, casa, chamado e mural)
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='lin')ACT.addli();if(e.key==='Enter'&&e.target.id==='rin')ACT.addrl();if(e.key==='Enter'&&['hn','ha','ht'].includes(e.target.id))ACT.savehn();if(e.key==='Enter'&&e.target.id==='min')ACT.addmt();if(e.key==='Enter'&&e.target.id==='min2')ACT.send()});
// Inicialização: desenha a primeira tela
render();
