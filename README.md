# TurboClass

Marketplace automotivo premium em Next.js App Router com TypeScript para carros turbo,
preparados, swaps, esportivos, premium e projetos especiais.

## Stack

- Next.js 16 com App Router
- React 19
- TypeScript estrito
- Postgres opcional para estoque operacional
- Captacao de leads para anuncio, contato, interesse e financiamento
- CSS global sem runtime pesado de UI
- Assets locais em `public/`

## Estrutura

```text
src/app/                 Rotas, metadata, APIs e estilos globais
src/components/          Componentes reutilizaveis de UI
src/data/                Estoque inicial usado como seed/fallback
src/lib/                 Banco, validacao, filtros, auth e helpers
public/                  Imagens otimizaveis pelo Next
public/icon/             Favicon e icones do site
public/logo/             Logo da TurboClass
```

## Rotas principais

```text
/                         Home de conversao
/comprar                  Estoque com filtros avancados
/comprar/[slug]           Pagina individual do veiculo
/vender                   Captacao de novos anuncios
/financiamento            Captacao de simulacao
/sobre                    Historia e posicionamento
/diferenciais             Proposta de valor do marketplace
/contato                  Atendimento, Instagram e formulario
/admin                    Dashboard operacional
/admin/veiculos           Cadastro/importacao/migracao de veiculos
/admin/leads              Lista de interessados captados
/admin/anuncios-pendentes Area preparada para aprovacao
```

## Estoque e banco

O site le os carros por `src/lib/inventory-store.ts`.

- Sem `DATABASE_URL`: usa o estoque inicial e, em desenvolvimento, permite gravar em `data/inventory.local.json`.
- Com `DATABASE_URL`: cria as tabelas `vehicles` e `leads` automaticamente no primeiro uso e grava dados no Postgres.
- O painel protegido fica em `/admin/veiculos`.
- Para liberar escrita, configure `ADMIN_TOKEN` com pelo menos 24 caracteres.
- Use `.env.example` como base para configurar o ambiente.

Para migrar os carros atuais para o banco:

1. Configure `DATABASE_URL` e `ADMIN_TOKEN` no ambiente.
2. Acesse `/admin/veiculos`.
3. Cole o token.
4. Clique em `Migrar estoque atual`.

Tambem e possivel cadastrar um carro individual ou importar um lote JSON pelo mesmo painel.

## Leads

Os formularios usam `/api/leads` e salvam dados em Postgres quando `DATABASE_URL` estiver
configurado. Sem banco em producao, o formulario abre WhatsApp como fallback para nao perder
conversao.

## Seguranca

- Dependencias auditadas com `npm audit`.
- Next.js e React em versoes corrigidas para CVEs recentes de App Router/RSC.
- APIs administrativas exigem `ADMIN_TOKEN`, rate limit simples, limite de payload e validacao de campos.
- Headers de seguranca configurados em `next.config.ts`, incluindo CSP, HSTS, `nosniff`, `DENY` para frame e politicas de origem.
- O site nao depende de middleware/proxy como unica barreira de autenticacao.

## Escala

A leitura publica do estoque pode rodar com cache e banco fora do caminho de escrita. Para trafego muito alto, mantenha Postgres com pool/serverless, CDN para paginas e imagens, WAF/rate limit na borda e busca dedicada como Algolia, Meilisearch ou OpenSearch quando o catalogo crescer.

## Links comerciais

- WhatsApp de anuncios e atendimento: configurado em `src/lib/links.ts`
- Instagram: configurado em `src/lib/links.ts`
- Banner superior: `src/components/top-banner-ad.tsx`

## Comandos

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm audit
```
