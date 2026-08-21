# Tasks - Remediação de segurança de dependências

- Estado do pacote: `approved`
- Aprovação: coberta pelo `PLAN.md` aprovado em 2026-08-20
- Plano: `PLAN.md`

Este é o único ledger operacional do trabalho. Todas as tasks permanecem
`pending` até sua seleção posterior para implementação. A aprovação do plano
cobre a decomposição atual das sete tasks.

## TASK-001 - Revalidar baseline e preparar a branch

- Estado: `pending`
- Dependências: nenhuma

### Descrição

Confirmar a base da branch, preservar e concluir a documentação preexistente e
repetir audit, registry e análise de alcance imediatamente antes da primeira
alteração de dependências.

### Critérios locais

- `test/essential-behavior` contém a documentação pendente commitada antes do
  início da remediação.
- `security/dependency-remediation` parte do estado correto dessa branch sem
  perder ou sobrescrever mudanças do usuário.
- `PRD.md`, `PLAN.md` e `TASKS.md` estão presentes e rastreados de forma
  deliberada apesar da regra `/docs/` no `.gitignore`.
- `npm audit --omit=dev --json` e `npm audit --json` possuem baseline
  registrado por pacote, advisory, severidade, alcance e correção.
- Registry, engines, peers e dependências confirmam ou atualizam os alvos do
  plano.
- Mudança material de risco, plataforma ou alvo devolve o plano a `draft` em
  vez de ser aceita silenciosamente.
- Nenhum manifest, lockfile, código, banco, ambiente ou upload é alterado nesta
  task.

### Evidência

Em 2026-08-20, o preflight inicial confirmou 10 ocorrências de produção, sendo
5 altas e 5 moderadas, e 20 ocorrências no audit completo, sendo 10 altas e 10
moderadas. O registry confirmou os alvos e compatibilidades registrados no
plano. A tentativa inicial foi bloqueada porque a documentação Vitest ainda não
estava commitada na branch-base e os artefatos desta feature permaneciam
ignorados e não rastreados.

A preparação posterior avançou localmente `test/essential-behavior` por
fast-forward para `119f9cc`, o commit documental já presente em
`security/dependency-remediation`, e incluiu `PRD.md`, `PLAN.md` e `TASKS.md` no
commit documental da feature com rastreamento forçado e deliberado. Nenhum
manifest, lockfile, código, banco, ambiente ou upload foi alterado. A branch
remota não foi modificada. Com os bloqueios locais removidos, a task retorna a
`pending` e pode ser selecionada pela skill de implementação.

## TASK-002 - Corrigir o grafo de produção

- Estado: `pending`
- Dependências: `TASK-001`

### Descrição

Atualizar Next.js e sua configuração de lint alinhada, Drizzle ORM,
`sanitize-html`, `uuid` e `react-syntax-highlighter`, regenerar o lockfile com
comandos npm dirigidos e eliminar todas as vulnerabilidades de produção.

### Critérios locais

- `next` resolve 16.3.1 e `eslint-config-next` resolve exatamente 16.3.1.
- Next.js resolve `postcss` 8.5.23 e `sharp` 0.35.3 ou versões compatíveis
  superiores, e todas as cópias afetadas de `nanoid` são seguras.
- `drizzle-orm` resolve 0.45.2 ou patch compatível superior.
- `sanitize-html` fica fixado exatamente em 2.17.5.
- `uuid` permanece na major 11 e resolve 11.1.1 ou patch compatível superior.
- `react-syntax-highlighter` resolve 16.1.1 e não resta cópia vulnerável de
  `refractor` ou `prismjs` na cadeia de produção.
- `package-lock.json` é regenerado por npm, sem edição manual, remoção total,
  `audit fix --force` ou override.
- `npm ls` não apresenta dependências inválidas nem peers quebrados.
- `npm audit --omit=dev` retorna zero vulnerabilidades.
- Nenhum arquivo de aplicação muda além de adaptação explicitamente delegada à
  `TASK-003`.

### Evidência

Pendente.

## TASK-003 - Preservar contratos de conteúdo, IDs e runtime

- Estado: `pending`
- Dependências: `TASK-002`

### Descrição

Adaptar somente o necessário para a major corrigida de syntax highlighting e
fortalecer os testes de sanitização, UUID, Markdown e fluxos já cobertos pela
suíte essencial.

### Critérios locais

- `MarkdownComponents.tsx` preserva Prism, `oneDark`, import ESM, classes,
  linguagem, `PreTag` e conteúdo, sem `any` novo ou supressão ampla.
- Um teste React comprova Markdown comum, código inline, bloco com linguagem,
  syntax highlighting e sanitização por `rehype-sanitize`.
- Testes de posts e projetos cobrem os vetores de URI do advisory de
  `sanitize-html` e preservam conteúdo válido esperado.
- CRUD de posts e projetos comprova UUID v4 em creates e estabilidade do ID em
  update e delete.
- Repositories, autenticação, Proxy, Server Actions, upload e `next/image` não
  sofrem mudança de contrato.
- Testes focados da task passam e o build TypeScript aceita a combinação entre
  `react-syntax-highlighter` 16.1.1 e os tipos disponíveis.
- Qualquer incompatibilidade visual ou material não corrigível localmente
  interrompe a task e retorna ao gate do usuário.

### Evidência

Pendente.

## TASK-004 - Remediar o toolchain e registrar riscos residuais

- Estado: `pending`
- Dependências: `TASK-002`

### Descrição

Atualizar Drizzle Kit para a estável planejada, renovar somente transitivas
vulneráveis de ESLint e Vite dentro dos ranges compatíveis e documentar as
ocorrências inevitáveis da cadeia descontinuada de esbuild.

### Critérios locais

- `drizzle-kit` resolve 0.31.10 ou patch estável compatível superior e nunca
  0.18.1.
- ESLint permanece na major 9 e Vite na major 6.
- `ajv`, `brace-expansion`, `flatted`, `js-yaml`, `minimatch` e as cópias
  afetadas de `picomatch` atendem aos mínimos seguros do plano.
- Não existe override incompatível, downgrade, filtro de audit ou atualização
  indiscriminada.
- `npm audit` não apresenta vulnerabilidade corrigível por atualização
  compatível.
- Cada ocorrência residual registra advisory, pacote, causa, alcance,
  mitigação, impacto e condição de reavaliação.
- A cadeia residual está ausente de `npm audit --omit=dev` e limitada a
  Drizzle Kit, `@esbuild-kit/esm-loader`, `@esbuild-kit/core-utils` e seu
  `esbuild` aninhado.
- `npm run lint`, `npm run migrate`, `npm run seed` e
  `npx drizzle-kit push` funcionam nos ambientes isolados aplicáveis.

### Gate de decisão residual

A evidência deve ser apresentada a Luis Antunes para aceite ou rejeição
explícita. Aprovação do plano ou da task não constitui aceite do risco.

### Evidência

Pendente.

## TASK-005 - Executar validação local e limpa

- Estado: `pending`
- Dependências: `TASK-003`, `TASK-004`

### Descrição

Executar todos os gates técnicos no workspace, em instalação limpa temporária
e no Node mínimo declarado, além dos smokes funcionais com dados descartáveis.

### Critérios locais

- `npm audit --omit=dev` retorna zero e o audit completo corresponde ao
  registro residual submetido ao usuário.
- Testes focados passam e `npm test` passa três vezes consecutivas.
- `npm run lint` passa sem novos warnings e `npm run build` passa.
- `jq empty package.json package-lock.json`, Prettier e `git diff --check`
  passam.
- Uma instalação limpa executa a sequência equivalente à CI:
  `npm ci`, `npm test`, `npm run lint`, `npx drizzle-kit push` e
  `npm run build`.
- Migrations e seed funcionam em workspace descartável.
- A suíte essencial passa em Node 20.9.0; lint e build também passam nesse
  runtime quando todas as dependências declararem suporte.
- Smokes de desenvolvimento e produção aprovam páginas públicas, Markdown,
  código, imagens, proteção administrativa, CRUD e upload.
- `db.sqlite3`, `.env.local`, uploads reais e outros estados locais preservam
  existência, conteúdo e metadados.
- Nenhum cache, banco, ambiente, upload ou log temporário fica rastreado.

### Evidência

Pendente.

## TASK-006 - Revisar a remediação e decidir risco residual

- Estado: `pending`
- Dependências: `TASK-005`

### Descrição

Submeter o diff completo e as evidências a uma revisão final read-only,
corrigir achados cobertos pelo plano e obter a decisão explícita do usuário
sobre cada risco residual antes de recomendar integração.

### Critérios locais

- O reviewer read-only examina manifest, lockfile, código, testes, audit,
  compatibilidade, validações e aderência a PRD, plano e tasks.
- O main agent registra o resultado em `reviews/FINAL.md` sem delegar a escrita
  do artefato.
- Não existem achados bloqueantes nem falhas de lint, teste, build, audit de
  produção ou instalação limpa.
- Correções dentro do contrato repetem as validações proporcionais ao risco.
- Mudança material devolve PRD ou plano a `draft`, conforme aplicável.
- Cada risco residual recebe aceite ou rejeição explícita de Luis Antunes, com
  data e origem registradas.
- Sem aceite explícito, a recomendação de integração permanece bloqueada.

### Evidência

Pendente.

## TASK-007 - Integrar e validar o estado combinado

- Estado: `pending`
- Dependências: `TASK-006`, aceite explícito dos riscos residuais e autorização
  específica para merge e push

### Descrição

Integrar `security/dependency-remediation` em `test/essential-behavior`, repetir
validação e revisão no estado combinado e aguardar CI remota verde antes de
recomendar a integração final em `main`.

### Critérios locais

- Merge e push ocorrem somente após autorização explícita do usuário e sem
  descartar mudanças locais.
- O estado combinado preserva todos os commits e artefatos aprovados da suíte
  essencial e da remediação.
- Audit de produção, audit completo, três execuções de testes, lint, build,
  instalação limpa, Node mínimo e smokes permanecem aprovados no estado
  combinado.
- Nova revisão read-only não possui achados bloqueantes.
- A CI remota fica verde.
- O risco residual aceito não mudou entre a decisão e o estado candidato.
- A integração em `main` continua dependente de uma decisão específica do
  usuário e não ocorre automaticamente nesta task.

### Evidência

Pendente.
