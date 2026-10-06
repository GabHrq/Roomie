<script lang="ts">
  import { onMount } from 'svelte';

  type Card = { id: string; title: string };
  type Column = { id: string; title: string; cards: Card[] };

  let pageTitle = "Roomie";

  const STORAGE_KEY = 'kanban-board-v1';
  const uid = () => crypto.randomUUID();

  let columns = $state<Column[]>([
    { id: uid(), title: 'A fazer', cards: [{ id: uid(), title: 'Montar o board' }] },
    { id: uid(), title: 'Fazendo', cards: [] },
    { id: uid(), title: 'Feito', cards: [] }
  ]);

  let drafts = $state<Record<string, string>>({});
  let newColumnTitle = $state('');
  let dragged = $state<string | null>(null); // id do card sendo arrastado
  let overColumn = $state<string | null>(null);
  let loaded = false;

  // Carrega do localStorage só no browser (seguro pra SSR/SvelteKit)
  onMount(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) columns = JSON.parse(raw);
    } catch {}
    loaded = true;
  });

  // Salva sempre que algo mudar
  $effect(() => {
    const snapshot = JSON.stringify(columns);
    if (loaded) localStorage.setItem(STORAGE_KEY, snapshot);
  });

  function addCard(colId: string) {
    const title = drafts[colId]?.trim();
    if (!title) return;
    columns.find((c) => c.id === colId)?.cards.push({ id: uid(), title });
    drafts[colId] = '';
  }

  function removeCard(colId: string, cardId: string) {
    const col = columns.find((c) => c.id === colId);
    if (col) col.cards = col.cards.filter((c) => c.id !== cardId);
  }

  function addColumn() {
    const title = newColumnTitle.trim();
    if (!title) return;
    columns.push({ id: uid(), title, cards: [] });
    newColumnTitle = '';
  }

  function removeColumn(colId: string) {
    columns = columns.filter((c) => c.id !== colId);
  }

  // Move o card arrastado para a coluna, antes de `beforeId` (ou no fim)
  function move(toColId: string, beforeId?: string) {
    if (!dragged || beforeId === dragged) return;

    let moved: Card | undefined;
    for (const col of columns) {
      const i = col.cards.findIndex((c) => c.id === dragged);
      if (i > -1) {
        [moved] = col.cards.splice(i, 1);
        break;
      }
    }
    if (!moved) return;

    const target = columns.find((c) => c.id === toColId)!;
    const idx = beforeId ? target.cards.findIndex((c) => c.id === beforeId) : -1;
    if (idx < 0) target.cards.push(moved);
    else target.cards.splice(idx, 0, moved);
  }

  function endDrag() {
    dragged = null;
    overColumn = null;
  }
</script>

<div class="min-h-screen bg-slate-100 p-6">
  <h1 class="mb-6 text-2xl font-bold text-slate-800">{pageTitle}</h1>

  <div class="flex items-start gap-4 overflow-x-auto pb-4">
    {#each columns as col (col.id)}
      <section
        class="w-72 shrink-0 rounded-xl bg-slate-200 p-3 transition-colors {overColumn === col.id
          ? 'bg-red-100 ring-2 ring-red-400'
          : ''}"
        ondragover={(e) => {
          e.preventDefault();
          overColumn = col.id;
        }}
        ondragleave={() => (overColumn = null)}
        ondrop={(e) => {
          e.preventDefault();
          move(col.id);
          endDrag();
        }}
        aria-label={col.title}
      >
        <header class="mb-3 flex items-center justify-between px-1">
          <h2 class="font-semibold text-slate-700">
            {col.title}
            <span class="ml-1 text-sm font-normal text-slate-500">{col.cards.length}</span>
          </h2>
          <button
            class="rounded px-1.5 text-slate-400 hover:bg-slate-300 hover:text-red-600"
            onclick={() => removeColumn(col.id)}
            aria-label="Excluir coluna {col.title}"
          >
            ✕
          </button>
        </header>

        <ul class="flex min-h-2 flex-col gap-2">
          {#each col.cards as card (card.id)}
            <li
              draggable="true"
              class="group flex cursor-grab items-start justify-between gap-2 rounded-lg bg-white p-3 text-sm text-slate-800 shadow-sm active:cursor-grabbing {dragged ===
              card.id
                ? 'opacity-40'
                : ''}"
              ondragstart={(e) => {
                dragged = card.id;
                e.dataTransfer!.effectAllowed = 'move';
                e.dataTransfer!.setData('text/plain', card.id); // Firefox exige
              }}
              ondragend={endDrag}
              ondragover={(e) => e.preventDefault()}
              ondrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                move(col.id, card.id);
                endDrag();
              }}
            >
              <span class="break-words">{card.title}</span>
              <button
                class="text-slate-300 hover:text-red-600 focus:text-red-600 sm:invisible sm:group-hover:visible"
                onclick={() => removeCard(col.id, card.id)}
                aria-label="Excluir card {card.title}"
              >
                ✕
              </button>
            </li>
          {/each}
        </ul>

        <form
          class="mt-3"
          onsubmit={(e) => {
            e.preventDefault();
            addCard(col.id);
          }}
        >
          <input
            class="w-full rounded-lg border border-transparent bg-white/60 px-3 py-2 text-sm placeholder:text-slate-500 focus:border-red-400 focus:bg-white focus:outline-none"
            placeholder="Adicionar card…"
            bind:value={drafts[col.id]}
          />
        </form>
      </section>
    {/each}

    <form
      class="w-72 shrink-0 rounded-xl bg-white/50 p-3"
      onsubmit={(e) => {
        e.preventDefault();
        addColumn();
      }}
    >
      <input
        class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-500 focus:border-red-400 focus:outline-none"
        placeholder="Nova coluna…"
        bind:value={newColumnTitle}
      />
    </form>
  </div>
</div>