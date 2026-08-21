# Plano - Remediação de segurança de dependências

- Estado: `approved`
- Aprovação: aprovada em 2026-08-21 por Luis Antunes
- Origem da aprovação: mensagem `aprovo todos os documentos` nesta conversa,
  após a ampliação para Node `>=22.13.0` e os achados da revisão final
- Criado em: 2026-08-20
- PRD: `PRD.md`, aprovado em 2026-08-21 por Luis Antunes
- Nível: completo
- Branch de trabalho: `security/dependency-remediation`
- Base requerida: `test/essential-behavior`

## Classificação e justificativa

O nível permanece `completo`. O trabalho corrige vulnerabilidades de runtime e
de toolchain em oito cadeias, inclui uma atualização major da biblioteca de
syntax highlighting, precisa preservar contratos de autenticação, conteúdo e
persistência e termina com decisão explícita sobre risco residual. A branch de
remediação também precisa ser validada isoladamente e novamente depois da
integração com a suíte essencial.

## Pré-condições operacionais

- `PRD.md` e este plano foram aprovados explicitamente após a ampliação de
  escopo.
- A branch atual é `security/dependency-remediation` e aponta para o mesmo
  commit de `test/essential-behavior` na data deste plano.
- `AGENTS.md` e `docs/conventions.md` possuem alterações preexistentes da
  documentação da suíte essencial. Elas pertencem ao usuário, devem ser
  preservadas e precisam ser concluídas e commitadas na branch de origem antes
  da implementação da remediação.
- O novo PRD e os artefatos deste plano ficam sob `docs/features/`, caminho
  ignorado para novos arquivos pela regra atual de `.gitignore`. Seu
  rastreamento deve ser tratado deliberadamente no commit documental, sem
  alterar `.gitignore` como parte desta feature.
- Nenhuma instalação, alteração de dependência, merge ou push está autorizada
  enquanto este plano estiver em `draft`.

## Objetivo técnico

Produzir um manifest e um lockfile mínimos, coerentes e reproduzíveis que
eliminem todas as vulnerabilidades conhecidas do grafo de produção, removam
todas as vulnerabilidades corrigíveis do toolchain e preservem os contratos de
runtime, dados e operação. Qualquer vulnerabilidade inevitável deve permanecer
restrita ao toolchain, receber registro técnico individual e ser submetida ao
aceite explícito do usuário antes da integração.

## Baseline revalidado

Em 2026-08-20, `npm audit --omit=dev --json` e `npm audit --json` confirmaram a
linha de base do PRD:

| Grafo | Alta | Moderada | Crítica | Total |
| --- | ---: | ---: | ---: | ---: |
| Produção | 5 | 5 | 0 | 10 |
| Completo | 10 | 10 | 0 | 20 |

O audit atual identifica estes pacotes agregadores:

- produção: `next`, `sharp`, `postcss`, `nanoid`, `drizzle-orm`,
  `sanitize-html`, `uuid`, `react-syntax-highlighter`, `refractor` e
  `prismjs`;
- desenvolvimento: `ajv`, `brace-expansion`, `flatted`, `js-yaml`,
  `minimatch`, `picomatch`, `drizzle-kit`, `@esbuild-kit/esm-loader`,
  `@esbuild-kit/core-utils` e o `esbuild` aninhado nessa cadeia.

O registry também foi consultado em 2026-08-20 para confirmar versões,
dependências, peers e engines. Como advisories e releases mudam, `TASK-001`
deve repetir a consulta imediatamente antes da primeira alteração. Uma mudança
material de risco, plataforma ou versão-alvo devolve este plano a `draft`.

## Escopo técnico

- Atualizar somente dependências diretas necessárias para alcançar versões
  corrigidas e compatíveis.
- Atualizar transitivas vulneráveis dentro dos ranges suportados e regenerar o
  lockfile por comandos npm, sem edição manual.
- Adaptar de forma localizada o componente e os tipos de syntax highlighting
  somente se a versão corrigida exigir.
- Fortalecer testes existentes para os contratos de sanitização, UUID,
  Markdown, blocos de código, repositories, CRUD, autenticação e upload.
- Corrigir os gates revelados pela `TASK-005` com uma migration SQLite aditiva
  para `projects`, propagação de falha no seed e uma correção tipada e localizada
  no teste de configuração que bloqueia o build.
- Validar Next.js, `next/image`, Proxy, Server Actions, Drizzle ORM, Drizzle
  Kit, migrations, seed, lint, build e testes nos ambientes exigidos.
- Elevar o mínimo declarado para Node `>=22.13.0`, preservar `.nvmrc` em
  24.19.0 e validar a instalação limpa e todos os gates no novo mínimo.
- Executar os smokes de desenvolvimento e produção em estado descartável,
  corrigir os assets ausentes dos dados controlados e isolar o editor Markdown
  fora do proxy de preview.
- Tornar a migration nova compatível com banco vazio e com schema equivalente
  já materializado por `drizzle-kit push`, sem alterar schema, migration
  histórica ou dados reais.
- Atualizar no README as versões técnicas afetadas pela remediação.
- Registrar os riscos residuais reais e obter decisão explícita antes da
  integração.
- Executar revisão final read-only na branch de remediação e no estado
  combinado com `test/essential-behavior`.

## Fora de escopo técnico

- Atualizar dependências não relacionadas apenas porque existe versão mais
  nova.
- Migrar Next.js para outra major, React para outra major, ESLint para 10,
  Vite para outra major ou `uuid` para 14.
- Alterar o mínimo de Node além de `>=22.13.0`, `.nvmrc`, SQLite, Better
  SQLite3, schemas, migration histórica ou contratos de IDs. A migration nova
  pode receber somente a adaptação idempotente necessária para bancos vazios e
  schemas equivalentes criados por `drizzle-kit push`.
- Substituir Drizzle Kit, `react-syntax-highlighter`, ORM, framework, banco ou
  gerenciador de pacotes.
- Introduzir override incompatível, ocultar audit, usar
  `npm audit fix --force` ou rebaixar Drizzle Kit.
- Refatorar repositories, Server Actions, autenticação, upload ou UI além de
  uma adaptação estritamente necessária à compatibilidade.
- Corrigir warnings preexistentes ou ampliar cobertura sem relação direta com
  os contratos afetados.

## Decisões técnicas

### Versões diretas verificadas

| Dependência | Estado atual | Alvo planejado | Decisão |
| --- | --- | --- | --- |
| `next` | manifest `^16.0.8`, lock `16.0.10` | `^16.3.1` | Menor linha estável atual acima de todos os ranges vulneráveis reportados e compatível com Node `>=20.9.0`. |
| `eslint-config-next` | `16.0.10` | `16.3.1` | Manter alinhamento exato com Next.js. |
| `drizzle-orm` | manifest `^0.44.4`, lock `0.44.7` | `^0.45.2` | Primeira release estável atual que corrige `GHSA-gpj5-g38j-94v9`. |
| `sanitize-html` | `^2.17.0` | `2.17.5` exata | Corrige `GHSA-vccv-cmxp-4j9h` e preserva Node 20; `2.17.6` e `2.17.7` exigem Node `>=22.12.0`. |
| `uuid` | `^11.1.0` | `^11.1.1` | Corrige `GHSA-w5hq-g745-h8pq` sem mudar a major ou o uso exclusivo de `v4()`. |
| `react-syntax-highlighter` | `^15.6.6` | `^16.1.1` | Remove `refractor` e `prismjs` vulneráveis; a major é aceita tecnicamente sob validação de tipos e renderização. |
| `drizzle-kit` | manifest `^0.31.4`, lock `0.31.8` | `^0.31.10` | Adotar a estável atual sem downgrade, ciente do risco residual transitivo descrito abaixo. |

`@types/react-syntax-highlighter` permanece inicialmente em `^15.5.13`, a
versão publicada atual. A biblioteca 16.1.1 não declara tipos próprios no
registry. O pacote de tipos só será removido ou adaptado se build e testes
comprovarem incompatibilidade, sem uso de `any` ou supressão ampla.

### Transitivas corrigíveis

O lockfile deve resolver, no mínimo, estas versões seguras confirmadas pelo
audit e pelo registry:

| Pacote | Mínimo seguro ou resolução esperada | Origem principal |
| --- | --- | --- |
| `postcss` | `8.5.23` | Next.js, `sanitize-html`, Vite e Tailwind |
| `nanoid` | `3.3.18` ou superior compatível | `postcss` |
| `sharp` | `0.35.3` ou superior compatível | dependência opcional de Next.js |
| `refractor` | `5.0.0` ou superior compatível | `react-syntax-highlighter` |
| `prismjs` | `1.30.0` ou superior compatível em todas as cópias | syntax highlighting |
| `ajv` | `6.14.0` ou superior dentro da major 6 | ESLint 9 |
| `brace-expansion` | `1.1.18` ou superior compatível | ESLint |
| `flatted` | `3.4.2` ou superior compatível | ESLint |
| `js-yaml` | `4.3.1` ou superior compatível | ESLint |
| `minimatch` | `3.1.4` ou superior compatível | ESLint |
| `picomatch` | `4.0.4` ou superior compatível nas cópias afetadas | Vite e `tinyglobby` |

ESLint permanece na major 9 e Vite na major 6. As versões diretas atuais já
aceitam as correções transitivas. ESLint 10 continua fora do escopo porque não
é necessário para corrigir as transitivas listadas.

### Geração do lockfile

- Alterar as declarações diretas de forma explícita e usar somente comandos npm
  locais e direcionados para regenerar `package-lock.json` e `node_modules`.
- Atualizar por nome apenas as transitivas vulneráveis que permanecerem presas
  a versões antigas no lockfile.
- Não editar `package-lock.json` manualmente, não apagar o lockfile como
  atalho e não executar atualização indiscriminada de todo o grafo.
- Conferir `npm ls` para provar a cadeia final e falhar diante de dependências
  inválidas ou peers incompatíveis.

### Syntax highlighting

- Preservar o uso de `Prism`, o tema `oneDark`, a importação ESM de estilos, a
  detecção `language-*`, o `PreTag`, as classes e o conteúdo renderizado.
- Criar um teste React focado em `SafeMarkdown` ou `MarkdownComponents` que
  comprove Markdown comum, bloco de código com linguagem, código inline,
  sanitização via `rehype-sanitize` e ausência de markup executável.
- Se a API ou os tipos da versão 16 exigirem adaptação, limitá-la a
  `src/components/ui/MarkdownComponents.tsx` e ao teste correspondente.
- Se houver mudança visual ou de contrato que não possa ser corrigida
  localmente, interromper a task e solicitar a decisão prevista no PRD.

### Sanitização e identificadores

- Manter `sanitizeHtml(val)` com a configuração padrão atual e acrescentar
  casos de regressão para os atributos citados no advisory, sem relaxar listas
  permitidas.
- Preservar `uuidV4()` sem buffer nos creates de post e projeto.
- Comprovar nos ciclos administrativos que IDs novos continuam UUID v4 e que
  update e delete preservam o identificador existente.
- Não alterar schema, coluna, formato persistido ou registros existentes.

### Next.js e autenticação

- Não alterar `src/proxy.ts`, o layout administrativo nem as verificações de
  sessão nas Server Actions, salvo incompatibilidade comprovada pela atualização
  e ainda coberta pelo contrato aprovado.
- Confirmar que App Router, Server Actions, Proxy e `next/image` compilam e
  funcionam com Next.js 16.3.1.
- Manter `next.config.ts`, remote patterns e `.nvmrc` sem alteração, salvo
  evidência contrária que exija novo gate material.

### Drizzle Kit e risco residual esperado

O Drizzle Kit estável 0.31.10 ainda depende de
`@esbuild-kit/esm-loader@^2.5.5`, que depende de
`@esbuild-kit/core-utils@^3.3.2` e de `esbuild@~0.18.20`. O audit agrega essa
cadeia em quatro ocorrências moderadas e sugere o downgrade incompatível de
Drizzle Kit para 0.18.1.

A decisão técnica é atualizar para 0.31.10, rejeitar o downgrade e não forçar
um override de `esbuild` fora do range declarado. Depois da regeneração real do
lockfile, a task deve registrar para cada ocorrência:

- advisory e pacote afetado;
- causa e cadeia de introdução;
- alcance exclusivo a CLI de desenvolvimento, migrations e CI;
- ausência da cadeia no runtime público e em `npm audit --omit=dev`;
- mitigação por execução somente em código e schema confiáveis, sem exposição
  de servidor de desenvolvimento do esbuild;
- impacto remanescente;
- reavaliação na próxima release estável do Drizzle Kit que remova a cadeia ou
  no próximo ciclo de remediação de dependências, o que ocorrer primeiro.

A aprovação deste plano não aceita esse risco. O resultado real deve ser
apresentado ao usuário para aceite ou rejeição explícita antes de qualquer
integração.

### Recuperação dos gates operacionais

- Gerar pelo Drizzle Kit uma migration nova e aditiva que crie `projects` e seu
  índice único de `slug`, exatamente conforme `projectsTable`. Não modificar a
  migration `0000_groovy_reptil.sql`, nem schema, dados existentes ou contratos
  de post e projeto.
- Fazer o seed propagar falhas com código não zero. O comportamento bem-sucedido
  continua limitado à carga de projetos do repositório JSON existente.
- Ajustar somente `src/config/env/server.test.ts` para preservar o tipo restrito
  de `NODE_ENV` ao preparar e restaurar `process.env` e ao montar o ambiente do
  processo filho. Não alterar o contrato de `src/config/env/server.ts`.
- Adicionar ou adaptar testes de migration e seed em diretório temporário, sem
  tocar `db.sqlite3`, `.env.local` ou uploads reais. Eles devem comprovar que
  migration seguida de seed funciona em banco vazio e que falha do seed encerra
  com código não zero.
- Adaptar somente `0001_vengeful_risque.sql` para usar criação idempotente da
  tabela e do índice, preservando o snapshot gerado e a migration histórica.
  Acrescentar um teste que materialize o schema atual como `drizzle-kit push` e
  depois aplique a migration, comprovando preservação dos dados existentes.
- Alterar `engines.node` para `>=22.13.0`, atualizar a representação raiz no
  lockfile por comando npm dirigido e alinhar README e `.env.local-example`
  somente onde documentarem o mínimo. `.nvmrc` permanece em 24.19.0.
- Instalar e usar Node 22.13.0 somente em workspace temporário para `npm ci`,
  suíte essencial, lint e build.
- Executar smokes de desenvolvimento e produção com banco e uploads temporários
  para páginas públicas, Markdown, código, imagens, proteção administrativa,
  CRUD e upload. Os registros controlados devem usar assets existentes; as
  referências inválidas do seed podem ser substituídas por assets públicos já
  versionados. O editor deve ser verificado em cópia limpa fora da limitação do
  proxy, com correção localizada somente se a regressão for reproduzida. Não há
  mudança visual deliberada ou alteração de autenticação.

## Componentes e arquivos prováveis

### Alteração esperada

- `package.json`
- `package-lock.json`, somente regenerado por npm
- `src/components/ui/MarkdownComponents.tsx`, apenas se a major 16 exigir
- teste React novo ou existente sob `src/components/ui/`
- `src/features/blog/lib/validation.test.ts`
- `src/features/projects/lib/validation.test.ts`
- `src/features/blog/actions/admin-crud.integration.test.ts`
- `src/features/projects/actions/admin-crud.integration.test.ts`
- `src/config/env/server.test.ts`
- `src/db/drizzle/migrations/<nova-migration>.sql` e os metadados gerados pelo
  Drizzle Kit
- `src/db/drizzle/seed.ts` e teste localizado de migration e seed
- `src/db/seed/projects.json`, somente para substituir assets inexistentes
- `README.md`
- `docs/features/dependency-security-remediation/TASKS.md`, para evidências e
  decisões operacionais
- `docs/features/dependency-security-remediation/reviews/FINAL.md`, somente no
  gate de revisão final do fluxo completo

### Sem alteração esperada

- `src/proxy.ts` e arquivos de autenticação
- repositories e schemas Drizzle
- migration histórica `0000_groovy_reptil.sql`, schemas, dados reais e
  contratos persistidos; somente a migration nova pode receber a adaptação
  idempotente aprovada
- `next.config.ts`
- `.nvmrc`
- `.github/workflows/ci.yml`, salvo necessidade concreta não material
- `db.sqlite3`, `.env.local` e uploads reais
- `CHANGELOG.md` e arquivos gerados fora do lockfile

## Estratégia de implementação

1. Revalidar branch, audit, registry, advisories, engines e ranges e preservar
   as mudanças preexistentes.
2. Atualizar o grafo de produção de forma dirigida, alinhar Next.js e
   `eslint-config-next` e confirmar `npm audit --omit=dev` limpo.
3. Adaptar e testar os contratos atingidos, especialmente sanitização, UUID e
   syntax highlighting.
4. Atualizar Drizzle Kit e somente as transitivas corrigíveis do toolchain,
   provar que não restam correções compatíveis e preparar o registro residual.
5. Gerar e testar a migration aditiva, o seed e a correção tipada do teste de
   ambiente em banco e diretórios temporários.
6. Corrigir os achados da revisão final: mínimo de Node, compatibilidade da
   migration com schema criado por push, assets controlados, isolamento do
   editor e documentação técnica.
7. Executar validação completa no workspace atual, em instalação limpa
   temporária e no Node mínimo declarado, preservando estado local real.
8. Executar revisão final read-only, corrigir achados cobertos pelo plano e
   obter decisão explícita sobre o risco residual.
9. Somente com autorização específica, integrar a remediação em
   `test/essential-behavior`, repetir validação e revisão do estado combinado e
   aguardar CI remota verde antes de recomendar integração em `main`.

## Critérios de aceite técnico

- O manifest declara os alvos diretos aprovados e o lockfile contém somente
  resoluções coerentes com eles.
- `npm ls` não apresenta pacotes inválidos nem peer dependencies quebradas.
- `npm audit --omit=dev` retorna zero vulnerabilidades.
- `npm audit` não apresenta vulnerabilidade corrigível por atualização
  compatível.
- Qualquer ocorrência residual possui registro completo e aceite explícito do
  usuário.
- Next.js e `eslint-config-next` estão ambos em 16.3.1.
- Drizzle ORM está em 0.45.2 ou patch compatível superior e os repositories
  continuam aprovados sem mudança de schema.
- `sanitize-html` permanece exatamente em 2.17.5 conforme o alvo seguro e
  compatível já validado.
- `engines.node` declara `>=22.13.0`, `.nvmrc` permanece em 24.19.0 e a
  instalação limpa passa no novo mínimo.
- IDs novos continuam UUID v4 e IDs existentes permanecem estáveis em update e
  delete.
- Markdown, código inline, blocos destacados, tema e sanitização permanecem
  funcionais com `react-syntax-highlighter` 16.1.1.
- Proxy, layout autenticado e Server Actions mantêm as verificações de sessão.
- `next/image`, páginas públicas, CRUD administrativo e upload passam nos
  testes e smokes previstos.
- Em banco vazio descartável, a migration aditiva torna `projects` disponível,
  `npm run migrate` seguido de `npm run seed` encerra com código zero e uma
  falha do seed encerra com código não zero.
- Em cópia descartável de banco com schema atual materializado por
  `drizzle-kit push`, a migration preserva tabela, índice e dados existentes.
- O README representa as versões entregues e os dados usados nos smokes não
  apontam para assets inexistentes.
- Todos os critérios de validação abaixo passam sem criar ou alterar estado
  real ignorado.
- Revisões finais read-only da branch isolada e do estado combinado não possuem
  achados bloqueantes.
- A CI remota do estado candidato fica verde antes da recomendação de merge.

## Validação esperada

### Auditoria e estrutura

- `npm audit --omit=dev --json` e `npm audit --json`.
- `npm ls` e `npm explain` para cada cadeia originalmente vulnerável.
- `jq empty package.json package-lock.json`.
- Busca por `overrides`, versões proibidas, mudanças de schema, remoção de
  autenticação e imports afetados.
- Prettier nos arquivos alterados e `git diff --check`.

### Testes e comandos locais

- Testes focados de sanitização, UUID, Markdown, syntax highlighting,
  repositories, CRUD, autenticação e upload.
- `npm test`, três vezes consecutivas.
- `npm run lint`, sem novos warnings.
- `npm run build`.
- Hash, tamanho e timestamp de `db.sqlite3`, `.env.local` e diretório real de
  uploads antes e depois, quando existirem.

### Instalação limpa e operação

- Em workspace temporário criado a partir do estado candidato: `npm ci`,
  `npm test`, `npm run lint`, `npx drizzle-kit push` e `npm run build`, na
  ordem da CI.
- No mesmo ambiente descartável ou em outro isolado: `npm run migrate` e
  `npm run seed`, sem tocar no banco real.
- Repetir a instalação limpa, suíte essencial, lint e build com Node 22.13.0.
- Confirmar que o workspace fonte não ganhou `db.sqlite3`, `.env.local`,
  uploads ou caches rastreados.

### Smokes funcionais

- Em desenvolvimento e produção, abrir um post e um projeto controlados com
  imagem, Markdown, tabela, código inline e bloco de código com linguagem.
- Confirmar que um visitante é redirecionado ao acessar o painel sem sessão.
- Confirmar com dados descartáveis os ciclos autenticados de create, update e
  delete de post e projeto e um upload válido.
- Conferir ausência de regressão visual deliberada nos blocos destacados e nas
  imagens.
- Isolar o editor Markdown em uma cópia limpa fora do proxy de preview e
  registrar se a falha era do harness ou da aplicação.

### Integração e revisão

- Revisão final read-only da branch de remediação em `reviews/FINAL.md`.
- Decisão explícita do usuário sobre cada risco residual.
- Merge e push somente após autorização específica do usuário.
- CI remota verde e nova validação e revisão read-only do estado combinado em
  `test/essential-behavior`.

## Riscos e mitigação

- **Advisory novo entre plano e implementação:** pode invalidar os alvos.
  Mitigação: revalidar no início e antes da revisão final; mudança material
  retorna o plano a `draft`.
- **`sanitize-html` elevar o engine por patch:** o range caret selecionaria uma
  release incompatível com Node 20. Mitigação: pin exato em 2.17.5 e validar o
  mínimo declarado.
- **Major de syntax highlighting alterar tipos ou markup:** pode quebrar build
  ou aparência. Mitigação: adaptação localizada, teste React e smoke visual;
  mudança material volta ao usuário.
- **Next.js alterar comportamento de Proxy, Server Actions ou imagens:** pode
  afetar segurança e disponibilidade. Mitigação: manter defesas em camadas,
  executar testes de autenticação e smokes públicos e administrativos.
- **Migration aditiva divergir do schema atual:** pode falhar em banco vazio ou
  criar contrato persistido incorreto. Mitigação: gerar pelo Drizzle Kit, revisar
  SQL e metadados, testar migration e seed em banco vazio e preservar a
  migration histórica e schemas.
- **Lockfile atualizar pacote não relacionado:** aumenta superfície e dificulta
  revisão. Mitigação: comandos dirigidos, inspeção do diff e justificativa de
  cada alteração transitiva.
- **Drizzle Kit continuar vulnerável:** não existe correção estável compatível
  na data do plano. Mitigação: não expor a cadeia ao runtime, manter execução
  confiável e efêmera, documentar e exigir aceite explícito.
- **Estado local preexistente ser sobrescrito:** a branch contém documentação
  pendente do usuário. Mitigação: concluir a pré-condição, nunca reverter ou
  incluir mudanças alheias silenciosamente e validar status antes de cada
  commit.
- **Validação operacional tocar dados reais:** migrations, seed e uploads têm
  efeitos. Mitigação: executar somente em workspaces e diretórios temporários
  validados.

## Rollback

- Manter as mudanças de dependências e adaptações em commits coesos da branch
  de remediação.
- Antes da integração, abandonar ou reverter somente os commits da feature,
  preservando a documentação e os testes herdados de
  `test/essential-behavior`.
- Depois da integração, usar um revert explícito dos commits da remediação em
  vez de comandos destrutivos sobre o worktree.
- Regenerar `node_modules` pelo lockfile restaurado com `npm ci`; não editar o
  lockfile manualmente.
- Nenhum rollback deve tocar schemas, a migration histórica, `db.sqlite3`,
  `.env.local` ou uploads. A única migration nova deve ser revertida por commit
  explícito antes da integração, nunca por alteração de bancos reais.

## Gate de aprovação

Este plano e a decomposição atual de nove tasks foram aprovados explicitamente
por Luis Antunes em 2026-08-21 pela mensagem `aprovo todos os documentos`. A
aprovação autoriza a execução da `TASK-009`, mas não constitui aceite dos riscos
residuais nem autorização para merge ou push.
