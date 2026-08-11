# ObraReal

Controle financeiro de obra — recursos, despesas e relatório consolidado.
Next.js 14 (App Router) · TypeScript · Tailwind v4 · Radix/shadcn · Motion · Recharts · Phosphor Icons.

```bash
npm run dev
```

> `next build` e `next dev` compartilham o diretório `.next`. Pare o dev server antes de rodar
> `npm run build` — rodar os dois juntos apaga os chunks servidos pelo dev, e a página aparece sem
> CSS e com o conteúdo duplicado (hidratação falha e o React re-renderiza por cima). Se acontecer:
> `rm -rf .next` e suba o dev de novo.

## Prestadores (mão de obra e serviços pagos por empreitada)

`Fornecedor` sozinho era texto livre — não dava pra saber quanto já foi pago a quem, nem o
saldo devedor de uma empreitada paga em parcelas (o pedreiro cobrado por semana, o vidraceiro
que recebe um sinal e o resto conforme a entrega). Agora existe um cadastro de **Prestadores**,
restrito às categorias Mão de obra e Serviços terceiros:

- Aba "Prestadores" dentro de Despesas (`components/despesas/prestadores-view.tsx`), no mesmo
  padrão de Recursos/Aportes: cada prestador tem um valor combinado *opcional* — sem isso, o
  card só mostra o total pago; com isso, mostra barra de progresso e "falta pagar".
- Cada pagamento é uma `Despesa` normal com `prestadorId` apontando pro prestador — não é uma
  entidade paralela. `lib/aggregations.ts` (`pagamentosDoPrestador`, `saldoPrestador`) deriva
  tudo a partir da lista de despesas.
- Na tela Nova Despesa, escolher categoria Mão de obra/Serviço revela um select de Prestador
  (filtrado pela categoria); ao vincular, o campo Fornecedor livre some — o nome vem do
  prestador. "Fornecedor avulso" continua disponível para quem não tem cadastro.
- Excluir um prestador solta o vínculo das despesas já lançadas (`prestadorId: undefined`) em
  vez de apagar o histórico — a exclusão é do cadastro, não do dinheiro já gasto.

## Estrutura

```
src/
  app/
    (auth)/login · register        Split-screen com painel de preview do produto
    (app)/                         Shell com sidebar, TopBar e store da obra
      dashboard · recursos · despesas · despesas/nova · relatorio
  components/
    ui/          Primitivos no padrão shadcn (Radix + cva) — base do design system
    layout/      Sidebar, TopBar, PageHeader, AppShell (drawer no mobile)
    dashboard/   SummaryCard, BudgetBar, ProgressRing, SpendingChart, CategoryDonut, RecentActivity
    recursos/    RecursoCard, RecursoModal, AporteModal
    despesas/    DespesaTable, DespesaFilters, DespesaForm, CategoryBadge, CategorySegmented
    relatorio/   Layout editorial com estilos de impressão
    shared/      MoneyInput, EmptyState, StatusBadge, ConfirmDialog, Field, Panel, Reveal
    providers/   obra-store — estado da obra em memória
  lib/           formatters, aggregations, domain, mock-data, navigation, utils
  types/
```

## Decisões que divergem do brief

- **Tailwind v4 sem `tailwind.config.ts`.** A v4 é CSS-first: a paleta e a tipografia vivem no bloco
  `@theme` de `src/app/globals.css`. Os tokens viram utilitários (`bg-surface-1`, `text-ink-muted`,
  `border-line`) em vez de `bg-[--surface-1]`, que a v4 deprecou. Nenhum hex no markup.
- **Geist pelo pacote `geist`** (que usa `next/font/local`) em vez de `next/font/google`: o Next 14
  não expõe Geist no catálogo do Google Fonts, e assim a fonte é servida do próprio bundle.
- **Ícones importados de `@phosphor-icons/react/dist/ssr`** — a entrada padrão do pacote é
  client-only e quebraria os Server Components.
- **`Wall` no lugar de `Bricks`** para a categoria Materiais: `Bricks` não existe no Phosphor 2.x.
- **`@types/recharts` não instalado** — o Recharts 2 já publica os próprios tipos; o pacote de tipos
  está deprecado e conflitaria.
- **Busca de despesas usa `placeholder` + `aria-label`, sem label visível.** É o único input assim;
  a regra de "label sempre acima" vale para os campos de formulário.

## Dados

Tudo roda sobre `lib/mock-data.ts` (1 obra, 4 fontes de recurso, 36 despesas) através do
`ObraProvider`, um store em memória. Criar, editar e excluir funcionam de verdade dentro da sessão —
recarregar a página volta ao mock. Os `await new Promise(...)` nos submits simulam a latência da
futura API e existem para que os estados de loading sejam reais, não decorativos.

O dashboard trata **Total de recursos** como o total *aportado* (dinheiro em caixa) e
**Progresso** como `despesas ÷ total planejado` — é o par que responde "quanto tenho" e
"quanto do orçamento já comprometi".
