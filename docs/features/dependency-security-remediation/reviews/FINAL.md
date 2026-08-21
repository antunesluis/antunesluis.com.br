# Revisão final - Remediação de segurança de dependências

- Feature: `dependency-security-remediation`
- Data: 2026-08-21
- Tipo: revisão final completa independente do estado combinado
- Veredito: `approved`

## Escopo e baseline

Revisão read-only do merge `5550bf83452022627d16ce4e28929c9328bc183c` em
`test/essential-behavior`, comparado ao baseline
`119f9ccad481a1c91df86a76adec47cfe45cd009`.

O merge preserva o baseline como primeiro pai e integra a remediação dentro do
PRD e plano aprovados: atualização dirigida de dependências, testes de
Markdown, sanitização e UUID, migration aditiva de `projects`, propagação de
falha no seed, ajuste tipado de configuração, Node mínimo e documentação.

## Validações observadas

- CI remota do commit aprovada: `npm ci`, testes, lint, `drizzle-kit push` e
  build;
- `npm audit --omit=dev --json`: zero vulnerabilidades;
- `npm audit --json`: quatro ocorrências moderadas, exclusivamente na cadeia
  aceita do Drizzle Kit e em `GHSA-67mh-4wv8-2f99`;
- `npm ls --all --omit=optional` e `git diff --check 119f9cc..5550bf8`:
  aprovados;
- o lockfile confirma Node `>=22.13.0`, Next e `eslint-config-next` 16.3.1,
  Drizzle ORM 0.45.2, `sanitize-html` 2.17.5, UUID 11.1.1,
  `react-syntax-highlighter` 16.1.1, Drizzle Kit 0.31.10 e Rollup 4.61.0;
- a migration `0001` é aditiva, idempotente e coberta contra banco
  materializado por `drizzle-kit push`;
- a evidência prévia registra três execuções com 103 testes, lint, build,
  instalação limpa no Node 22.13.0 e smokes da branch de remediação.

## Achados

### HIGH - Smoke obrigatório do estado combinado não foi comprovado

- Evidência: os critérios da `TASK-007` exigem smokes aprovados no estado
  combinado, mas o preview do commit `5550bf8` expirou repetidamente e não há
  execução observável e reproduzível posterior ao merge.
- Impacto: não é possível confirmar no estado integrado o comportamento visual
  e end-to-end de conteúdo público, autenticação, CRUD, upload, imagens e
  editor Markdown.
- Ação exigida: repetir e registrar os smokes completos de desenvolvimento e
  produção em ambiente responsivo e descartável no commit `5550bf8`, ou obter
  aceite explícito do usuário para essa lacuna.

Não foram identificados outros achados `BLOCKER`, `HIGH`, `MEDIUM` ou `LOW`
sustentados pelo diff.

## Riscos residuais

Permanecem as quatro vulnerabilidades moderadas aceitas explicitamente por
Luis Antunes em 2026-08-21: `drizzle-kit@0.31.10`,
`@esbuild-kit/esm-loader@2.6.5`, `@esbuild-kit/core-utils@3.3.2` e
`esbuild@0.18.20`, restritas ao toolchain. A lacuna de smoke não possui aceite
explícito.

## Revisão de follow-up

O reviewer independente revisou o HEAD `16b78c4` e confirmou que não há
diferença em `src/`, `package.json` ou `package-lock.json` entre o estado dos
smokes completos da `TASK-005` e o merge. Os smokes pós-merge em desenvolvimento
e produção, somados aos testes focados, resolvem o achado `HIGH`. Não foram
identificados achados `BLOCKER`, `HIGH`, `MEDIUM` ou `LOW`.

## Próxima ação

A `TASK-007` pode ser concluída. A integração em `main` ainda exige decisão
explícita do usuário e não ocorre automaticamente.
