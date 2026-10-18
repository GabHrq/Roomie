# Roomie - protótipo

**Atividade Avaliativa 3 - Usabilidade, desenvolvimento web, mobile e jogos**

Protótipo navegável de um aplicativo mobile para organizar moradias compartilhadas: despesas divididas, tarefas, lista de compras, regras da casa, ferramentas para o proprietário, mural de avisos e gamificação. Feito com HTML, CSS e JavaScript puro (sem frameworks).

## Como executar

Abra o `index.html` no navegador (duplo clique). Não precisa de servidor nem de instalação. A única dependência externa é a fonte Nunito (Google Fonts), com fallback para a fonte do sistema.

> Os dados ficam só em memória: recarregar a página reinicia o protótipo.

## Estrutura de pastas

```
roomie_projeto/
├── index.html        Marcação: cabeçalho da página, moldura do celular e <script>s
├── README.md         Esta documentação
├── css/
│   └── styles.css    Tema, componentes, moldura do celular e navegação
└── js/
    ├── state.js      Dados iniciais e estado global (S)
    ├── utils.js      Funções utilitárias e valores derivados
    ├── screens.js    Telas (devolvem HTML), render, toast, painel de tarefa
    ├── actions.js    Regras de negócio (XP, admin) e ações dos botões (ACT)
    └── main.js       Eventos globais e inicialização
```

Os arquivos JS são scripts clássicos carregados **nesta ordem** (state, utils, screens, actions, main) e compartilham o escopo global. Por isso funcionam abrindo o `index.html` direto do disco, o que módulos ES não permitem.

## Arquitetura

```
 clique do usuário
        │
        ▼
 listener de clique (main.js) ── acha o botão com data-a ──► ACT[data-a](data-v, data-i)
                                                                   │  altera o estado S
                                                                   ▼
 render() (screens.js) ◄──────────────────────────── chama a função da tela atual (S.scr)
        │
        ▼
 #app.innerHTML = HTML da tela + botão flutuante + nav + painel
```

- **Estado único (`S`)**: tudo o que muda na interface mora nele.
- **Telas**: funções puras que recebem o estado e devolvem uma string HTML.
- **Delegação de eventos**: um único listener trata todos os cliques. Os botões declaram `data-a` (ação), `data-v` (valor) e `data-i` (índice).
- **Re-render completo**: cada ação termina chamando `render()`, que preserva a posição da rolagem.

## Telas

| Tela | Função | Como chegar | O que faz |
|---|---|---|---|
| Início | `home()` | aba Início | Casa, nível/XP, mural, indicadores, próximas tarefas e pendências |
| Despesas | `exp()` | aba Despesas | Navega por mês, total, filtros (Todas/Pagas/Pendentes); toque alterna pago/pendente; lixeira remove |
| Nova despesa | `nw()` | botão "Nova despesa" | Formulário com divisão por morador e cálculo por pessoa em tempo real |
| Tarefas | `tasks()` | aba Tarefas | Abas Todas/Minhas/Concluídas; concluir, remover; botão "Nova tarefa" |
| Nova tarefa | `sheet()` | botão "Nova tarefa" | Painel inferior com título, responsável e data |
| Lista da casa | `list()` | aba Lista | Progresso, marcar itens, remover item ou marcados, adicionar |
| Casa | `house()` | aba Casa | Perfil editável, moradores (com proprietário e admins), indicadores e menu |
| Regras da casa | `rules()` | menu da Casa | Edição inline (somente admins), adicionar e remover |
| Conquistas | `ach()` | menu da Casa / card do Início | Nível, medalhas e ranking |
| Painel do proprietário | `owner()` | menu da Casa | Aluguel, chamados de manutenção e comunicados rápidos |
| Mural de avisos | `msgs()` | menu da Casa / card do Início | Conversa em balões entre moradores e proprietário |

A barra inferior (`nav()`) tem 5 abas. Nas subtelas (Regras, Conquistas, Painel, Mural) a aba **Casa** fica destacada; em Nova despesa, a aba **Despesas**.

## Funcionalidades

- **Despesas**: valor aceita vírgula ou ponto; validações (descrição, valor maior que zero, quem pagou, ao menos um morador); ícone escolhido por palavra-chave (internet, luz, mercado, limpeza, água); a despesa nova entra como Pendente no mês da data informada.
- **Tarefas**: rótulo de prazo automático (Hoje, Amanhã ou dia da semana); data anterior a 10/06/2024 vira Atrasada. O "hoje" do protótipo é fixo em 10/06/2024.
- **Lista**: itens marcados ficam riscados; o botão de remover marcados só aparece quando há itens marcados.
- **Casa**: nome, endereço e descrição editáveis por admins. O nome atualiza também no Início.
- **Proprietário**: aluguel de R$ 2.400,00 (vence dia 10, valor por morador), chamados com status Aberto, Em andamento e Resolvido (toque na etiqueta para avançar) e comunicados prontos que vão ao mural.
- **Tema**: claro/escuro automático pelo aparelho, com botão manual na tela Casa.

### Gamificação

| Ação | XP | Para quem |
|---|---|---|
| Concluir tarefa | +20 | responsável |
| Marcar despesa como paga | +10 | quem pagou |
| Adicionar item à lista | +5 | usuário |
| Marcar aluguel como recebido | +25 | usuário |

Desfazer a ação remove os mesmos pontos. **Nível = parte inteira de XP/100 + 1.** Títulos: Novato, Colega de casa, Guardião da casa, Mestre da república, Lenda do lar.

Medalhas (calculadas do estado): **Faxineiro** (1 tarefa concluída), **Em dia** (todas as despesas pagas), **Chef das compras** (3 itens comprados), **Legislador** (5 regras), **Zelador** (1 chamado resolvido), **Veterano** (200 XP).

### Permissões

Moradores: Você, João, Lucas, Pedro e Gabi. Proprietário: Roberto Lima (fictício). Admins iniciais: Você e João.

Somente admins podem editar a casa, editar as regras e gerenciar admins. A casa sempre mantém ao menos 1 admin. Quem não é admin recebe um aviso 🔒.

## Estado global (`S`, em `state.js`)

| Campo | Conteúdo |
|---|---|
| `scr` | tela atual (`home`, `exp`, `new`, `tasks`, `list`, `house`, `rules`, `ach`, `owner`, `msgs`) |
| `month` | mês exibido em Despesas (`AAAA-MM`) |
| `ef`, `tf` | filtros de despesas e de tarefas |
| `sheet` | painel Nova tarefa aberto? |
| `ex` | despesas `{d, v, by, dt, paid, ic}` |
| `tk` | tarefas `{t, o, w, late, done}` |
| `li` | itens da lista `{t, by, c}` |
| `nx` | rascunho do formulário Nova despesa `{d, v, by, dt, sel}` |
| `adm`, `mng` | mapa de admins e modo "gerenciar" |
| `xp` | pontos por morador |
| `rent` | aluguel `{v, paid, day}` |
| `mt` | chamados `{t, by, s}` (s: 0 aberto, 1 andamento, 2 resolvido) |
| `msgs` | mensagens `{a, t, h}` |
| `house`, `addr`, `tag`, `editH` | dados da casa e modo edição |
| `rules` | lista de regras |

Fora do estado: `P` (moradores: nome → cor e emoji), `NAMES` (chaves de `P`) e `MES` (nomes dos meses).

## Referência do código

### `js/utils.js`
| Item | Descrição |
|---|---|
| `$(seletor)` | atalho para `document.querySelector` |
| `brl(n)` | formata como moeda brasileira |
| `fdt(iso)` | converte `2024-06-10` em `10/06/2024` |
| `esc(texto)` | escapa HTML (evita que texto digitado vire código) |
| `av(nome, tamanho?)` | HTML do avatar do morador |
| `pend()`, `lipend()` | tarefas pendentes e itens pendentes da lista |
| `monthEx()` | despesas do mês aberto (com o índice original em `i`) |

### `js/screens.js`
| Item | Descrição |
|---|---|
| `home`, `exp`, `nw`, `tasks`, `list`, `rules`, `house`, `ach`, `owner`, `msgs` | uma função por tela; devolvem HTML |
| `BK(titulo)` | cabeçalho com botão voltar das subtelas |
| `nav()` | barra inferior flutuante |
| `sheet()` | painel de nova tarefa |
| `render()` | redesenha `#app`, escolhe a tela por `S.scr`, o botão flutuante e preserva a rolagem |
| `updDiv()` | atualiza só o cartão de divisão (evita re-render a cada tecla) |
| `toast(msg)` | aviso temporário de 1,8 s |
| `tkLabel(iso)` | rótulo de prazo da tarefa |

### `js/actions.js`
Regras de negócio: `isAdm()` (o usuário é admin?), `lv(xp)` (nível), `TIT` (títulos), `hm()` (hora atual HH:MM) e `award(nome, pontos)` (soma ou subtrai XP e avisa se for o usuário, inclusive subida de nível).

Ações do objeto `ACT` (assinatura `(valor, índice)`):

| Ação | O que faz |
|---|---|
| `go(v)` | troca de tela e fecha painéis e modos de edição |
| `toast(v)`, `theme()` | mostra aviso; alterna tema claro/escuro |
| `ef(v)`, `tf(v)`, `mo(_, ±1)` | filtro de despesas, filtro de tarefas, mês anterior/próximo |
| `tex(_, i)` | alterna despesa paga/pendente (±10 XP) |
| `tt(_, i)` | conclui/reabre tarefa (±20 XP) |
| `tl(_, i)`, `rmli(_, i)`, `clrli()`, `addli()` | marcar, remover, remover marcados e adicionar item (+5 XP) |
| `addrl()`, `rmrl(_, i)` | adicionar e remover regra (admin) |
| `edithn()`, `savehn()`, `cancelhn()` | editar a casa (admin), salvar e cancelar |
| `rmex(_, i)`, `rmtk(_, i)` | remover despesa e tarefa |
| `mng()`, `adm(nome)` | modo gerenciar admins; promover/remover (mínimo 1 admin) |
| `rent()` | marca aluguel como recebido/desfaz (±25 XP) |
| `mts(_, i)`, `rmmt(_, i)`, `addmt()` | avançar status, remover e abrir chamado |
| `qmsg(texto)`, `send()` | comunicado rápido e mensagem do usuário no mural |
| `sp(nome)`, `saveex()` | alternar morador na divisão; validar e salvar despesa |
| `newtk()`, `closesheet()`, `savetk()` | abrir, fechar e salvar o painel de tarefa |

### `js/main.js`
- **click**: delegação; acha o `[data-a]` mais próximo e chama `ACT[data-a]`. O fundo escuro do painel só fecha quando o clique é nele mesmo.
- **input**: guarda os campos da Nova despesa em `S.nx`, atualiza a divisão e grava as regras editadas.
- **change**: guarda o morador escolhido em "Pago por".
- **keydown**: Enter envia nos campos de lista, regra, casa, chamado e mural.
- Por fim chama `render()` para desenhar a primeira tela.

## CSS (`css/styles.css`)

1. **Tokens de cor** em `:root` (`--g` verde da marca; `--bg`, `--card`, `--sf` fundos; `--ink`, `--mut` textos; pares `--bl/--blf`, `--or/--orf`, `--rd/--rdf`, `--pu/--puf` para azul, laranja, vermelho e roxo).
2. **Tema escuro**: valores redefinidos em `@media (prefers-color-scheme: dark)` e em `:root[data-theme="dark"]` (botão manual).
3. **Base**: reset, `body` e `#app`; `.scr` é a área rolável com barra de rolagem fina.
4. **Componentes**: `.row` (linha de lista), `.stat` (indicador), `.chip` (etiqueta de status), `.task`, `.li`, `.btn`, `.in` (campo), `.seg` (abas), `.fab`, `.toast`, `.shade`/`.sheet`.
5. **Navegação**: `nav` flutuante em cápsula translúcida (liquid glass), aba ativa em `button.on`.
6. **Moldura do celular**: `.site` (cabeçalho da página), `.stage`, `.dev` e os elementos `.isl`, `.sb`, `.hb`, `.bt`. Em telas com 520 px ou mais desenha a moldura estilo iPhone; abaixo disso o app ocupa a tela toda.

## Como estender

**Nova tela**
1. Crie `function minhaTela(){ return \`...\`; }` em `screens.js`.
2. Registre-a no mapa dentro de `render()`.
3. Navegue com um botão `data-a="go" data-v="minhaTela"`.
4. Se for subtela, inclua-a na lista usada por `nav()` para manter a aba destacada.

**Nova ação**: adicione uma função em `ACT` (em `actions.js`), termine com `render()` e use `data-a="nomeDaAcao"` no botão.

**Novo dado**: acrescente o campo em `S` (`state.js`) e use-o nas telas.

## Limitações conhecidas

- Sem backend, login ou persistência.
- Papéis simulados: não há contas separadas para morador e proprietário.
- Valores fixos de demonstração: saldo (R$ 15,00), pendências do Início, contas recorrentes (3), meses de contrato (11) e data de hoje (10/06/2024).
- Lista de moradores fixa; "Convidar morador" e "Configurações" são marcadores de "em breve".
- Remoções acontecem sem confirmação.
- XP de outros moradores muda sem aviso na tela (só o do usuário gera aviso).

## Ideias de evolução

Persistência (`localStorage` ou backend), login por perfil, confirmação antes de excluir, convite de moradores por link, contas recorrentes, acerto de contas (quem deve a quem), missões diárias, notificações e testes de usabilidade com moradores reais.
