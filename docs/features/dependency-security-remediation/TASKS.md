# Tasks - Remediação de segurança de dependências

- Estado do pacote: `approved`
- Aprovação: coberta por `PRD.md` e `PLAN.md`, aprovados em 2026-08-21 por Luis
  Antunes
- Origem da aprovação: mensagem `aprovo todos os documentos` nesta conversa
- Plano: `PLAN.md`

Este é o único ledger operacional do trabalho. A decomposição atual possui nove
tasks e está coberta pela aprovação explícita dos documentos. O aceite de riscos
residuais e qualquer merge ou push continuam sujeitos a decisões separadas.

## TASK-001 - Revalidar baseline e preparar a branch

- Estado: `done`
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

Concluída em 2026-08-20. O preflight partiu de um worktree limpo em
`security/dependency-remediation@640dc74`, cuja base é exatamente
`test/essential-behavior@119f9cc`. O commit `119f9cc` contém as alterações de
`AGENTS.md` e `docs/conventions.md` da documentação Vitest. O commit `640dc74`
rastreia deliberadamente `PRD.md`, `PLAN.md` e `TASKS.md`, apesar da regra
`/docs/` no `.gitignore`. Nenhum merge ou push foi executado.

Os comandos `npm audit --omit=dev --json` e `npm audit --json`, executados com
npm 10.9.4 e Node 22.21.1, mantiveram o baseline agregado aprovado:

| Grafo | Alta | Moderada | Crítica | Total |
| --- | ---: | ---: | ---: | ---: |
| Produção | 5 | 5 | 0 | 10 |
| Completo | 10 | 10 | 0 | 20 |

Baseline de produção registrado pelo audit atual:

| Pacote e versão instalada | Severidade | Alcance e advisory | Correção revalidada |
| --- | --- | --- | --- |
| `drizzle-orm@0.44.7` | alta | direto em produção; `GHSA-gpj5-g38j-94v9` | `0.45.2` |
| `nanoid@3.3.11` | alta | transitivo em produção via PostCSS; `GHSA-28wg-ghj8-5hjv`, `GHSA-2v37-7h3g-55p8` | `3.3.18` ou superior compatível |
| `next@16.0.10` | alta agregada | direto em produção; 31 advisories listados abaixo, além das cadeias de PostCSS e Sharp | `16.3.1` |
| `postcss@8.4.31` e `8.5.6` | alta agregada | transitivo em produção; `GHSA-qx2v-qp2m-jg93`, `GHSA-6g55-p6wh-862q`, `GHSA-fxqj-rqcc-2cmp`, `GHSA-r28c-9q8g-f849` | `8.5.23` ou superior compatível |
| `prismjs@1.27.0` | moderada | transitivo em produção via Refractor; `GHSA-x7hr-w5r2-h6wg` | `1.30.0` via `react-syntax-highlighter@16.1.1` |
| `react-syntax-highlighter@15.6.6` | moderada | direto em produção, agregado pela cadeia Refractor/PrismJS; `GHSA-x7hr-w5r2-h6wg` | `16.1.1` |
| `refractor@3.6.0` | moderada | transitivo em produção, agregado por PrismJS; `GHSA-x7hr-w5r2-h6wg` | `5.0.0` via `react-syntax-highlighter@16.1.1` |
| `sanitize-html@2.17.0` | moderada | direto em produção; `GHSA-vccv-cmxp-4j9h` | `2.17.5` exata |
| `sharp@0.34.5` | alta | transitivo em produção via Next.js; `GHSA-f88m-g3jw-g9cj` | `0.35.3` ou superior compatível |
| `uuid@11.1.0` | moderada | direto em produção; `GHSA-w5hq-g745-h8pq` | `11.1.1` ou patch compatível da major 11 |

Os 31 advisories agregados pelo pacote Next.js são:
`GHSA-9g9p-9gw9-jx7f`, `GHSA-h25m-26qc-wcjf`,
`GHSA-ggv3-7p47-pfv8`, `GHSA-3x4c-7xq6-9pq8`,
`GHSA-h27x-g6w4-24gq`, `GHSA-mq59-m269-xvcx`,
`GHSA-jcc7-9wpm-mj36`, `GHSA-5f7q-jpqc-wp7h`,
`GHSA-q4gf-8mx6-v5v3`, `GHSA-8h8q-6873-q5fj`,
`GHSA-26hh-7cqf-hhc6`, `GHSA-3g8h-86w9-wvmq`,
`GHSA-ffhc-5mcf-pf4q`, `GHSA-vfv6-92ff-j949`,
`GHSA-gx5p-jg67-6x7h`, `GHSA-mg66-mrh9-m8jx`,
`GHSA-h64f-5h5j-jqjh`, `GHSA-c4j6-fc7j-m34r`,
`GHSA-492v-c6pp-mqqv`, `GHSA-wfc6-r584-vfw7`,
`GHSA-267c-6grr-h53f`, `GHSA-36qx-fr4f-26g5`,
`GHSA-6gpp-xcg3-4w24`, `GHSA-m99w-x7hq-7vfj`,
`GHSA-89xv-2m56-2m9x`, `GHSA-68g3-v927-f742`,
`GHSA-4633-3j49-mh5q`, `GHSA-4c39-4ccg-62r3`,
`GHSA-p9j2-gv94-2wf4`, `GHSA-q8wf-6r8g-63ch` e
`GHSA-955p-x3mx-jcvp`.

Baseline adicional exclusivo do toolchain:

| Pacote e versão instalada | Severidade | Alcance e advisory | Correção revalidada |
| --- | --- | --- | --- |
| `@esbuild-kit/core-utils@3.3.2` | moderada | transitivo de desenvolvimento via Drizzle Kit; agregado por `GHSA-67mh-4wv8-2f99` | sem correção compatível no Drizzle Kit estável |
| `@esbuild-kit/esm-loader@2.6.5` | moderada | transitivo de desenvolvimento via Drizzle Kit; agregado por `GHSA-67mh-4wv8-2f99` | sem correção compatível no Drizzle Kit estável |
| `ajv@6.12.6` | moderada | transitivo de desenvolvimento via ESLint; `GHSA-2g4f-4pwh-qvx6` | `6.14.0` |
| `brace-expansion@1.1.12` | alta | transitivo de desenvolvimento via ESLint/Minimatch; `GHSA-f886-m6hf-6m8v`, `GHSA-3jxr-9vmj-r5cp`, `GHSA-mh99-v99m-4gvg`, `GHSA-rgw5-rvv9-x895` | `1.1.18` |
| `drizzle-kit@0.31.8` | moderada | direto de desenvolvimento, agregado pela cadeia esbuild-kit; `GHSA-67mh-4wv8-2f99` | atualizar a `0.31.10`, mantendo o risco residual esperado |
| `esbuild@0.18.20` | moderada | transitivo de desenvolvimento via Drizzle Kit; `GHSA-67mh-4wv8-2f99` | sem correção compatível; o audit sugere o downgrade proibido do Drizzle Kit para `0.18.1` |
| `flatted@3.3.3` | alta | transitivo de desenvolvimento via ESLint/flat-cache; `GHSA-25h7-pfq9-p65f`, `GHSA-rf6f-7fwh-wjgh` | `3.4.2` ou superior compatível |
| `js-yaml@4.1.1` | alta | transitivo de desenvolvimento via ESLint; `GHSA-h67p-54hq-rp68`, `GHSA-52cp-r559-cp3m`, `GHSA-5p4m-2wfm-xmqj` | `4.3.1` |
| `minimatch@3.1.2` | alta | transitivo de desenvolvimento via ESLint; `GHSA-3ppc-4f35-3m26`, `GHSA-7r86-cg39-jmmj`, `GHSA-23c5-xmqv-rm74` | `3.1.4` |
| `picomatch@4.0.3` | alta agregada | transitivo de desenvolvimento via Vite/Tinyglobby; `GHSA-3v7f-55p6-f55p`, `GHSA-c2c7-rcm5-vvqj` | `4.0.4` ou superior compatível |

As consultas `npm view` confirmaram versões, engines, peers e dependências.
Next.js 16.3.1 depende exatamente de PostCSS 8.5.23 e aceita Sharp `^0.35.3`;
Next.js e Sharp preservam Node `>=20.9.0`. `sanitize-html` 2.17.6 e 2.17.7
continuam exigindo Node `>=22.12.0`, portanto o pin 2.17.5 permanece correto.
Os ranges atuais de ESLint 9.39.2 e Vite 6.4.3 aceitam as correções transitivas
planejadas. Drizzle Kit 0.31.10 ainda introduz
`@esbuild-kit/esm-loader@2.6.5` -> `@esbuild-kit/core-utils@3.3.2` ->
`esbuild@0.18.20`, conforme o risco residual já aprovado para decisão futura.

Uma verificação SemVer confrontou os 14 alvos corrigíveis com todos os ranges
dos advisories atuais e encontrou zero alvos ainda vulneráveis. `npm ls` das
cadeias de produção e de desenvolvimento encerrou com código 0, sem pacote
inválido ou peer quebrado. Não houve mudança material de risco, plataforma ou
alvo, portanto a aprovação do plano permanece válida.

Arquivos alterados: somente este ledger. Validações finais: diff de
`package.json` e `package-lock.json` sem saída, Prettier aprovado neste arquivo
e `git diff --check` aprovado. Nenhum manifest, lockfile, código, banco,
ambiente ou upload foi alterado.

## TASK-002 - Corrigir o grafo de produção

- Estado: `done`
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

Concluída em 2026-08-21. `package.json` e `package-lock.json` foram atualizados
somente por instalações npm dirigidas. O grafo final resolve `next@16.3.1`,
`eslint-config-next@16.3.1`, `drizzle-orm@0.45.2`,
`sanitize-html@2.17.5`, `uuid@11.1.1` e
`react-syntax-highlighter@16.1.1`. A cadeia de runtime também resolve
`postcss@8.5.23`, `nanoid@3.3.18`, `sharp@0.35.3`, `refractor@5.0.0` e
`prismjs@1.30.0`, sem cópia vulnerável identificada pelo audit.

`npm ls --all` e a inspeção focada das cadeias encerraram com código 0, sem
dependência inválida ou peer quebrado. `npm audit --omit=dev --json` retornou
zero vulnerabilidades em todas as severidades. `jq empty package.json
package-lock.json`, Prettier nos dois artefatos e neste ledger, e
`git diff --check` passaram. Não foi usado override, downgrade, remoção do
lockfile, `npm audit fix` ou `npm audit fix --force`. Nenhum arquivo da
aplicação foi alterado.

Arquivos alterados nesta task: `package.json`, `package-lock.json` e este
ledger. As mudanças preexistentes da `TASK-001` foram preservadas.

## TASK-003 - Preservar contratos de conteúdo, IDs e runtime

- Estado: `done`
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

Concluída em 2026-08-21. Foi criado um teste React focado em `SafeMarkdown` que
comprova Markdown comum, código inline, bloco JavaScript destacado por Prism,
classe de linguagem, classes do wrapper, sanitização de markup executável e
remoção de URI `javascript:`. A combinação entre
`react-syntax-highlighter@16.1.1`, `Prism`, `oneDark`, import ESM, `PreTag`,
classes e conteúdo permaneceu compatível sem mudança em
`MarkdownComponents.tsx`, sem `any` novo e sem supressão de tipos.

Os testes de validação de posts e projetos agora cobrem `action`, `formaction`,
`data`, `poster` e `background`, citados em `GHSA-vccv-cmxp-4j9h`, e comprovam
simultaneamente a preservação de parágrafo e link HTTPS válidos. Os ciclos CRUD
reais comprovam UUID v4 no create e o mesmo ID após update e no delete. Nenhum
repository, schema, migration, arquivo de autenticação, Proxy, Server Action,
upload ou integração de `next/image` foi alterado.

`npx vitest run` nos cinco arquivos focados passou com 33 testes. O TypeScript
focado em `MarkdownComponents.tsx`, `SafeMarkdown.tsx` e no novo teste passou
com `strict`, e `npm test` passou com 19 arquivos e 99 testes. `npm run build`
compilou a aplicação com Next.js 16.3.1, mas o typecheck completo permaneceu
impedido por três erros preexistentes e fora do escopo em
`src/config/env/server.test.ts`, relativos ao tipo readonly de `NODE_ENV`;
nenhum erro da combinação de syntax highlighting permaneceu. O gate completo de
build continua pertencendo à `TASK-005`.

Arquivos alterados nesta task: `src/components/ui/SafeMarkdown.test.tsx`,
`src/features/blog/lib/validation.test.ts`,
`src/features/projects/lib/validation.test.ts`,
`src/features/blog/actions/admin-crud.integration.test.ts`,
`src/features/projects/actions/admin-crud.integration.test.ts` e este ledger.

## TASK-004 - Remediar o toolchain e registrar riscos residuais

- Estado: `done`
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
- Cada ocorrência residual registra advisory, pacote, causa, alcance, mitigação,
  impacto e condição de reavaliação.
- A cadeia residual está ausente de `npm audit --omit=dev` e limitada a Drizzle
  Kit, `@esbuild-kit/esm-loader`, `@esbuild-kit/core-utils` e seu `esbuild`
  aninhado.
- `npm run lint`, `npm run migrate`, `npm run seed` e `npx drizzle-kit push`
  funcionam nos ambientes isolados aplicáveis.

### Gate de decisão residual

A evidência deve ser apresentada a Luis Antunes para aceite ou rejeição
explícita. Aprovação do plano ou da task não constitui aceite do risco.

### Evidência

Concluída em 2026-08-21. Instalações npm dirigidas atualizaram `drizzle-kit`
para `0.31.10` e renovaram somente `ajv`, `brace-expansion`, `flatted`,
`js-yaml`, `minimatch` e `picomatch`. O grafo resolve `ajv@6.15.0`,
`brace-expansion@1.1.18`, `flatted@3.4.4`, `js-yaml@4.3.1`, `minimatch@3.1.5` e
`picomatch@4.0.5`. ESLint permanece em `9.39.2`, Vite em `6.4.3`, não há
override, downgrade, filtro de audit ou atualização indiscriminada, e o registry
confirmou 0.31.10 como a versão estável atual do Drizzle Kit.

`npm audit --omit=dev --json` retornou zero vulnerabilidades. `npm audit --json`
ficou limitado às quatro ocorrências moderadas esperadas abaixo, sem
vulnerabilidade alta ou corrigível por atualização compatível. `npm ls --all` e
a inspeção focada encerraram com código 0, sem pacote inválido ou peer quebrado.
`npm run lint` encerrou com código 0 e somente três warnings preexistentes.
`jq empty`, Prettier nos arquivos de código, manifest e lockfile, e
`git diff --check` passaram. Em workspace temporário, `npm run migrate` aplicou
a migration, `npx drizzle-kit push` criou o schema atual e `npm run seed`
inseriu os projetos depois do push. A migration histórica cria somente `posts`,
portanto um seed imediatamente posterior à migration, em banco vazio, ainda não
encontra `projects`; schema e migration não foram alterados porque esse contrato
está fora do escopo aprovado e volta a ser gate operacional na `TASK-005`.

#### Ocorrências residuais para decisão explícita

- `drizzle-kit@0.31.10`, agregado por `GHSA-67mh-4wv8-2f99`. Permanece porque a
  versão estável atual ainda depende de `@esbuild-kit/esm-loader@^2.5.5` e o
  audit oferece somente o downgrade proibido para 0.18.1. O alcance é exclusivo
  à CLI de desenvolvimento, migrations e CI, ausente do runtime público e do
  audit de produção. A mitigação é executar apenas código e schema confiáveis,
  sem expor servidor de desenvolvimento do esbuild. O impacto remanescente é a
  presença indireta de um esbuild capaz de responder a origens arbitrárias se
  seu servidor de desenvolvimento vulnerável fosse iniciado. Reavaliar na
  próxima release estável do Drizzle Kit que remova a cadeia ou no próximo ciclo
  de remediação de dependências, o que ocorrer primeiro.
- `@esbuild-kit/esm-loader@2.6.5`, agregado por `GHSA-67mh-4wv8-2f99`. É
  introduzido diretamente pelo Drizzle Kit estável e permanece porque não existe
  atualização compatível do Drizzle Kit que o remova; o pacote também está
  descontinuado em favor de `tsx`. O alcance é exclusivo à CLI de
  desenvolvimento, migrations e CI, ausente do runtime público e do audit de
  produção. A mitigação é executar somente código e schema confiáveis e não
  expor servidor do esbuild. O impacto remanescente é herdar o risco do esbuild
  aninhado em ferramentas locais. Reavaliar na próxima release estável do
  Drizzle Kit que remova a cadeia ou no próximo ciclo de remediação, o que
  ocorrer primeiro.
- `@esbuild-kit/core-utils@3.3.2`, agregado por `GHSA-67mh-4wv8-2f99`. É
  introduzido pelo loader do Drizzle Kit e fixa `esbuild@~0.18.20`; não há
  correção dentro desse range e o pacote está descontinuado em favor de `tsx`. O
  alcance é exclusivo à CLI de desenvolvimento, migrations e CI, ausente do
  runtime público e do audit de produção. A mitigação é limitar a execução a
  código e schema confiáveis, sem servidor de desenvolvimento do esbuild. O
  impacto remanescente é transportar a versão vulnerável no toolchain local.
  Reavaliar na próxima release estável do Drizzle Kit que remova a cadeia ou no
  próximo ciclo de remediação, o que ocorrer primeiro.
- `esbuild@0.18.20`, afetado diretamente por `GHSA-67mh-4wv8-2f99`. É aninhado
  por
  `drizzle-kit@0.31.10 -> @esbuild-kit/esm-loader@2.6.5 -> @esbuild-kit/core-utils@3.3.2`
  e não pode ser elevado sem override fora do range declarado. O alcance é
  exclusivo à CLI de desenvolvimento, migrations e CI, ausente do runtime
  público e do audit de produção. A mitigação é não iniciar nem expor seu
  servidor de desenvolvimento e processar somente código e schema confiáveis. O
  impacto remanescente seria permitir que outro site lesse respostas do servidor
  vulnerável caso ele fosse iniciado e visitado no mesmo navegador. Reavaliar na
  próxima release estável do Drizzle Kit que remova a cadeia ou no próximo ciclo
  de remediação, o que ocorrer primeiro.

Arquivos alterados nesta task: `package.json`, `package-lock.json` e este
ledger. As mudanças das tasks anteriores foram preservadas. Este registro
apresenta o risco residual a Luis Antunes, mas não constitui aceite; a decisão
explícita continua obrigatória antes de qualquer integração.

## TASK-008 - Corrigir gates de build, migration e seed

- Estado: `done`
- Dependências: `TASK-003`, `TASK-004`

### Descrição

Corrigir os achados técnicos que impedem a validação: gerar uma migration
aditiva para `projects`, fazer o seed propagar falhas e ajustar o teste de
configuração para o typecheck completo, sem alterar schemas, a migration
histórica, contratos persistidos ou dados reais.

### Critérios locais

- Uma migration nova, gerada pelo Drizzle Kit, cria `projects` e o índice único
  de `slug` compatíveis com `projectsTable` em banco SQLite vazio.
- A migration histórica `0000_groovy_reptil.sql`, schemas e contratos de posts
  e projetos não são alterados.
- Em workspace descartável, `npm run migrate` seguido de `npm run seed` termina
  com código zero e disponibiliza os projetos semeados.
- Um erro real do seed encerra com código não zero, sem ser mascarado por log.
- O ajuste em `src/config/env/server.test.ts` preserva o contrato restrito de
  `NODE_ENV`, não altera `src/config/env/server.ts` e permite `npm run build`.
- Testes novos ou adaptados cobrem a migration e o comportamento de êxito e
  falha do seed sem tocar `db.sqlite3`, `.env.local` ou uploads reais.
- Não há dependência, override, downgrade, mudança de Node, alteração de
  autenticação, Server Action, repository, schema ou dados reais.

### Evidência

Concluída em 2026-08-21. `npx drizzle-kit generate` criou
`0001_vengeful_risque.sql` e os metadados correspondentes, com somente a tabela
`projects` e o índice único `projects_slug_unique`; schema e migration histórica
permaneceram inalterados. `seed.ts` agora propaga erro por código de saída não
zero, e `server.test.ts` preserva a tipagem restrita de `NODE_ENV` ao preparar e
restaurar o ambiente de teste.

Foi criado `seed.integration.test.ts`, que valida a migration em SQLite em
memória, o seed bem-sucedido em diretório temporário e a saída não zero quando
a tabela não existe. Os testes focados passaram com 17 testes; `npm test`
passou com 20 arquivos e 102 testes; `npm run lint` terminou sem erros e com os
três warnings preexistentes; `npm run build` passou. Em cópia descartável do
workspace, `npm run migrate` seguido de `npm run seed` inseriu cinco projetos.
`jq empty` nos metadados JSON, Prettier nos arquivos formatáveis e
`git diff --check` passaram. `db.sqlite3`, `.env.local` e uploads reais
permaneceram inalterados.

Arquivos alterados nesta task: `src/config/env/server.test.ts`,
`src/db/drizzle/seed.ts`, `src/db/drizzle/seed.integration.test.ts`,
`src/db/drizzle/migrations/0001_vengeful_risque.sql`, os metadados gerados pelo
Drizzle Kit e este ledger.

## TASK-009 - Corrigir achados da revisão final

- Estado: `done`
- Dependências: `TASK-008`

### Descrição

Aplicar a ampliação material solicitada após a revisão final: elevar o mínimo
de Node, tornar a migration nova compatível com schema equivalente criado por
`drizzle-kit push`, corrigir assets descartáveis, isolar o editor Markdown e
alinhar a documentação técnica.

### Critérios locais

- `package.json` declara Node `>=22.13.0`, a representação raiz do lockfile é
  atualizada por comando npm dirigido e `.nvmrc` permanece em 24.19.0.
- Nenhuma dependência instalada declara engine incompatível com Node 22.13.0.
- `0001_vengeful_risque.sql` permanece aditiva e passa a criar tabela e índice
  de forma idempotente, sem alterar schema, snapshot ou migration histórica.
- Um teste comprova que a migration passa e preserva dados em banco descartável
  cujo schema equivalente já foi materializado por `drizzle-kit push`.
- As referências inválidas `/images/bryen_*.png` nos dados descartáveis de
  projetos são substituídas por assets públicos existentes, sem tocar dados
  reais.
- O editor Markdown é verificado em cópia limpa fora do proxy de preview. Uma
  mudança de aplicação só ocorre se a regressão for reproduzida nesse ambiente
  controlado e fica limitada ao componente diretamente afetado.
- O README representa Next.js 16.3.1, Drizzle ORM 0.45.2 e o novo mínimo de
  Node quando aplicável.
- Testes focados de migration, seed, Markdown e configuração passam; lint,
  build, JSON, Prettier e `git diff --check` passam proporcionalmente ao diff.
- `db.sqlite3`, `.env.local`, uploads e outros dados reais permanecem
  inalterados.

### Evidência

Concluída em 2026-08-21. `package.json` e a raiz do lockfile passaram a
declarar Node `>=22.13.0`, com `.nvmrc` preservado em 24.19.0. A resolução
dirigida fixou `rollup@4.61.0` no toolchain para evitar o binário opcional LZMA
que exigia Node 22.20; a inspeção do grafo instalado confirmou suporte ao novo
mínimo em todas as engines declaradas.

A migration `0001_vengeful_risque.sql` passou a criar tabela e índice com
`IF NOT EXISTS`. O teste de integração materializou o schema por
`drizzle-kit push`, inseriu um projeto, reaplicou a migration e comprovou a
preservação do registro. As cinco capas inválidas do seed de projetos agora
referenciam `/images/home.png`, asset versionado existente. O README foi
alinhado a Next.js 16.3.1, Drizzle ORM 0.45.2 e Node 22.13.0.

Em cópia limpa criada com `npm ci`, migration e servidor de desenvolvimento
passaram. O editor Markdown carregou autenticado fora do proxy de preview,
aceitou `# Editor task 009`, atualizou a renderização e não gerou erro de
console; como a regressão não foi reproduzida, o componente permaneceu
inalterado. O workspace descartável foi removido.

Os testes focados passaram com 3 arquivos e 19 testes. `npm run lint` terminou
sem erros e com os três warnings preexistentes; `npm run build`, `jq empty`,
Prettier e `git diff --check` passaram. O audit de produção permaneceu em zero
e o audit completo permaneceu nas quatro moderadas residuais já registradas.
`db.sqlite3`, `.env.local`, uploads e demais dados reais não foram alterados.

Correção posterior à revisão seletiva em 2026-08-21: o range de Rollup foi
alterado de `^4.61.0` para o pin exato `4.61.0` por comando npm, com a raiz do
lockfile regenerada. Manifest, raiz do lockfile e resolução instalada agora
registram exatamente 4.61.0, e o pacote LZMA incompatível não está presente.
`npm ls` confirmou a resolução deduplicada sob Vite e a inspeção das engines
instaladas confirmou compatibilidade com Node 22.13.0. Os 19 testes focados,
lint, build, audits, JSON, Prettier e `git diff --check` foram repetidos com os
mesmos resultados aprovados e riscos residuais já registrados.

Arquivos alterados nesta task: `package.json`, `package-lock.json`, `README.md`,
`src/db/seed/projects.json`, `src/db/drizzle/migrations/0001_vengeful_risque.sql`,
`src/db/drizzle/seed.integration.test.ts` e este ledger.

## TASK-005 - Executar validação local e limpa

- Estado: `done`
- Dependências: `TASK-003`, `TASK-004`, `TASK-008`, `TASK-009`

### Descrição

Executar todos os gates técnicos no workspace, em instalação limpa temporária e
no Node mínimo declarado, além dos smokes funcionais com dados descartáveis.

### Critérios locais

- `npm audit --omit=dev` retorna zero e o audit completo corresponde ao registro
  residual submetido ao usuário.
- Testes focados passam e `npm test` passa três vezes consecutivas.
- `npm run lint` passa sem novos warnings e `npm run build` passa.
- `jq empty package.json package-lock.json`, Prettier e `git diff --check`
  passam.
- Uma instalação limpa executa a sequência equivalente à CI: `npm ci`,
  `npm test`, `npm run lint`, `npx drizzle-kit push` e `npm run build`.
- Migrations e seed funcionam em workspace descartável.
- A instalação limpa, suíte essencial, lint e build passam em Node 22.13.0.
- Smokes de desenvolvimento e produção aprovam páginas públicas, Markdown,
  código, imagens, proteção administrativa, CRUD e upload.
- `db.sqlite3`, `.env.local`, uploads reais e outros estados locais preservam
  existência, conteúdo e metadados.
- Nenhum cache, banco, ambiente, upload ou log temporário fica rastreado.

### Evidência

Em andamento em 2026-08-21. Com Node 22.21.1, `npm audit --omit=dev
--json` retornou zero vulnerabilidades e o audit completo retornou somente as
quatro moderadas já registradas na cadeia de desenvolvimento do Drizzle Kit.
`jq empty package.json package-lock.json`, Prettier e `git diff --check`
passaram. `npm test` passou três vezes consecutivas, com 19 arquivos e 99
testes em cada execução.

O lint encerra sem erros, mas mantém três warnings preexistentes em
`src/app/(public)/blog/page.tsx`,
`src/components/ui/SearchButton/SearchButton.tsx` e
`src/features/blog/components/PostsList.tsx`. O build compila, porém falha no
typecheck por três erros preexistentes em `src/config/env/server.test.ts`,
relacionados ao tipo readonly de `NODE_ENV`.

Uma cópia descartável do workspace, instalada por `npm ci` com Node 20.19.6,
executou os 99 testes com sucesso e confirmou que o `better-sqlite3` é
recompilado para a ABI do Node 20. Nesse mesmo ambiente, lint manteve os três
warnings e build repetiu os três erros de tipagem. `npm run migrate` e
`npx drizzle-kit push` terminaram com código 0; o seed só concluiu depois de
`drizzle-kit push`, pois após `migrate` isolado reportou `no such table:
projects` apesar de encerrar com código 0. O banco, `.env.local` e uploads do
workspace original permaneceram inalterados. A task continua bloqueada pelos
gates de lint, build e pela sequência migrate/seed.

Revalidação posterior à `TASK-008`, em 2026-08-21: no workspace atual com
Node 22.21.1, `npm test` passou três vezes consecutivas (20 arquivos e 102
testes por execução), `npm run lint` terminou sem erros e preservou apenas os
três warnings preexistentes, e `npm run build` passou. O audit de produção
permanece em zero; o audit completo permanece limitado às quatro moderadas
residuais do Drizzle Kit. `git diff --check` também passou.

Em cópia limpa descartável, `npm ci`, `npm run migrate` e `npm run seed`
passaram no Node 20.9.0 e inseriram os projetos. A sequência exigida não pode
ser concluída nesse runtime: `npm test` falha antes de executar a suíte com
`ERR_REQUIRE_ESM`, ao carregar `std-env` via `vitest`; durante `npm ci`,
`eslint-visitor-keys@5.0.1` também reporta `EBADENGINE`, pois requer
`^20.19.0 || ^22.13.0 || >=24`. O mínimo declarado continua `>=20.9.0` e o
plano proíbe alterá-lo, portanto a incompatibilidade exige decisão de escopo
do usuário e mantém esta task em andamento.

O smoke de desenvolvimento em cópia descartável confirmou listagem pública de
projetos, redirecionamento de rota administrativa sem sessão e login com
credenciais temporárias. Ele revelou dois impedimentos para aprovar o conjunto
de smokes: imagens referenciadas pelo seed retornam 400 porque os arquivos
`/images/bryen_*.png` não existem em `public/images`; além disso, o editor
Markdown não carregou no proxy do preview de desenvolvimento. Não houve
alteração de estados locais reais.

Após a revisão final, Luis Antunes solicitou ampliar o escopo e adotar Node
`>=22.13.0`. Essa mudança material criou a `TASK-009` e devolveu PRD, plano e
este pacote a `draft`. A evidência histórica no Node 20.9.0 permanece registrada
como causa da mudança, mas deixou de ser o alvo de aceite. Os documentos
ampliados foram aprovados em seguida pela mensagem `aprovo todos os documentos`.
A execução desta task só pode continuar depois da conclusão da `TASK-009`.

Concluída em 2026-08-21 após a `TASK-009`. No workspace com Node 22.21.1,
`npm audit --omit=dev --json` retornou zero vulnerabilidades, o audit completo
permaneceu limitado às quatro moderadas residuais do Drizzle Kit e `npm ls
--all` passou. `npm test` passou três vezes consecutivas, com 20 arquivos e 103
testes em cada execução. `npm run lint` passou sem erros e somente com os três
warnings preexistentes já registrados, e `npm run build` passou.

Em cópia descartável com Node 22.13.0 e npm 10.9.2, a sequência `npm ci`, `npm
test`, `npm run lint`, `npx drizzle-kit push` e `npm run build` passou. Em banco
vazio separado na mesma cópia, `npm run migrate` seguido de `npm run seed`
passou e tornou cinco projetos consultáveis. Os testes da suíte também
comprovaram a migration sobre schema materializado por push e a propagação de
falha do seed.

Os smokes em desenvolvimento e produção, com banco, credenciais e uploads
descartáveis, aprovaram páginas públicas, redirecionamento administrativo sem
sessão, login, editor Markdown fora do proxy de preview, create e update de
post e projeto, delete de post, upload PNG válido e renderização de imagens,
tabela, código inline e blocos TypeScript e JavaScript destacados. A exclusão
de projeto e os ciclos completos de delete permanecem cobertos pelos testes de
integração aprovados da suíte. O upload foi gravado somente em
`public/ci-uploads` da cópia temporária.

`jq empty package.json package-lock.json`, Prettier nos arquivos alterados e
`git diff --check` passaram. `db.sqlite3` e `.env.local` do workspace fonte
mantiveram tamanho, timestamp, permissões e hashes SHA-256; `public/uploads`
manteve seus arquivos e metadados. Nenhum banco, ambiente, upload, cache ou log
temporário ficou rastreado. Arquivo alterado nesta conclusão: somente este
ledger. A implementação está concluída, mas ainda requer a revisão e a decisão
de risco residual da `TASK-006`.

## TASK-006 - Revisar a remediação e decidir risco residual

- Estado: `done`
- Dependências: `TASK-005`

### Descrição

Submeter o diff completo e as evidências a uma revisão final read-only, corrigir
achados cobertos pelo plano e obter a decisão explícita do usuário sobre cada
risco residual antes de recomendar integração.

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

Revisão final read-only executada em 2026-08-21 e registrada em
`reviews/FINAL.md`. O reviewer não identificou defeito técnico ou regressão no
estado atual. Foram repetidos `npm audit --omit=dev --json` com zero
vulnerabilidades, `npm audit --json` com quatro ocorrências moderadas restritas
à cadeia do Drizzle Kit, `npm ls --all`, 19 testes focados e `git diff
--check`, todos com o resultado esperado. `jq empty package.json
package-lock.json` também passou na verificação do agente principal.

Luis Antunes aceitou explicitamente as quatro ocorrências residuais em
2026-08-21 pela mensagem `aceito os riscos residuais` nesta conversa. O aceite
abrange `drizzle-kit@0.31.10`, `@esbuild-kit/esm-loader@2.6.5`,
`@esbuild-kit/core-utils@3.3.2` e `esbuild@0.18.20`, todas associadas a
`GHSA-67mh-4wv8-2f99` e restritas ao toolchain. A decisão não autoriza merge,
push nem o início da `TASK-007`.

## TASK-007 - Integrar e validar o estado combinado

- Estado: `in_progress`
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
