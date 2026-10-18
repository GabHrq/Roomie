/* =====================================================================
   ROOMIE - PROTÓTIPO (JavaScript)
   Arquitetura: um estado único (S) -> funções de tela devolvem HTML ->
   render() injeta em #app -> cliques tratados por delegação
   (atributo data-a no botão -> função de mesmo nome em ACT).
   Seções: 1 Dados | 2 Utilitários | 3 Telas | 4 Ações | 5 Eventos.
   Atributos dos botões: data-a = ação, data-v = valor, data-i = índice.
   ===================================================================== */
/* ---------- 1. DADOS ---------- */
// Moradores: nome -> [cor do avatar, emoji]. NAMES vem das chaves (Você primeiro).
const P={'Você':['#d9f2e3','🎮'],'João':['#d7e6ff','🧔🏽'],Lucas:['#ffe0c2','👦🏻'],Pedro:['#ffd9c9','👨🏼'],Gabi:['#f6d6e4','👩🏻']};
const NAMES=Object.keys(P);
// Nomes dos meses (índice 0 = janeiro)
const MES=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
/* Estado global, só em memória (recarregar a página reinicia tudo).
   scr: tela atual | month: mês em Despesas (AAAA-MM) | ef/tf: filtros de despesas/tarefas
   sheet: painel Nova tarefa aberto | ex: despesas | tk: tarefas | li: lista de compras
   nx: rascunho do formulário Nova despesa | adm: admins | mng: modo gerenciar admins
   xp: pontos por morador | rent: aluguel | mt: chamados | msgs: mural de avisos
   house/addr/tag: dados da casa | editH: modo edição da casa | rules: regras */
const S={scr:'home',month:'2024-06',ef:'Todas',tf:'Todas',sheet:false,
ex:[{d:'Internet',v:120,by:'João',dt:'2024-06-10',paid:1,ic:'📶'},{d:'Energia',v:95,by:'Gabi',dt:'2024-06-08',paid:1,ic:'⚡'},{d:'Mercado',v:160,by:'Lucas',dt:'2024-06-05',paid:0,ic:'🛒'},{d:'Produtos de limpeza',v:45,by:'Pedro',dt:'2024-06-02',paid:1,ic:'🧴'}],
tk:[{t:'Limpar cozinha',o:'Você',w:'Hoje, 10/06',late:1,done:0},{t:'Tirar lixo',o:'Lucas',w:'Amanhã, 11/06',done:0},{t:'Limpar banheiro',o:'Gabi',w:'Qua, 12/06',done:0},{t:'Organizar sala',o:'Pedro',w:'Qui, 13/06',done:0},{t:'Lavar roupa de cama',o:'Você',w:'09/06',done:1}],
li:[{t:'Papel higiênico',by:'João',c:1},{t:'Café',by:'Gabi',c:1},{t:'Detergente',by:'Lucas',c:0},{t:'Sabão',by:'Pedro',c:0},{t:'Sacos de lixo',by:'você',c:1}],
nx:{d:'',v:'',by:'',dt:'2024-06-10',sel:{'João':1,Lucas:1}},
house:'República do Centro',editH:false,addr:'Centro, São Paulo - SP',tag:'Nossa casa, nossas regras',
adm:{'Você':1,'João':1},mng:0,
xp:{'Você':140,'João':220,Lucas:90,Pedro:160,Gabi:180},rent:{v:2400,paid:0,day:10},
mt:[{t:'Torneira da cozinha pingando',by:'Gabi',s:0},{t:'Lâmpada do corredor queimada',by:'Lucas',s:1}],
msgs:[{a:'Proprietário',t:'Bom dia! A vistoria anual será dia 20/06, às 14h.',h:'08:30'},{a:'Gabi',t:'Combinado, estaremos em casa.',h:'09:02'}],
rules:['Silêncio depois das 22h','Louça lavada no mesmo dia','Avisar antes de trazer visitas','Dividir as contas até o dia 10','Cada um limpa a bagunça que fez']};
