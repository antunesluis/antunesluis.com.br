# PRD - Remediação de segurança de dependências

- Estado: `approved`
- Aprovação: aprovada em 2026-08-20 por Luis Antunes
- Origem da aprovação: mensagem `sim` nesta conversa
- Criado em: 2026-08-20
- Origem: solicitação de Luis Antunes nesta conversa
- Slug: `dependency-security-remediation`
- Nível do fluxo: completo

## Classificação do fluxo

O fluxo é `completo`. A iniciativa trata vulnerabilidades de runtime e de
toolchain em múltiplas cadeias de dependências, pode exigir decisões de
compatibilidade e condiciona a integração de uma branch já aprovada
tecnicamente. Também exige aceite explícito para qualquer risco residual e
validação do estado combinado antes da integração em `main`. Esses fatores
caracterizam trabalho de segurança, alto risco e decisão potencialmente difícil
de reverter, incompatível com os níveis rápido ou padrão.

## Problema e objetivo

A branch `test/essential-behavior` possui uma suíte essencial tecnicamente
aprovada, mas sua recomendação de merge está condicionada à triagem e ao
tratamento das vulnerabilidades conhecidas nas dependências.

A linha de base informada contém 20 pacotes vulneráveis, sem vulnerabilidades
críticas:

- 10 pacotes no grafo de produção, sendo 5 de severidade alta e 5 de
  severidade moderada;
- 10 pacotes exclusivos do toolchain de desenvolvimento, sendo 5 de severidade
  alta e 5 de severidade moderada.

As ocorrências estão associadas às cadeias de Next.js, Drizzle ORM,
sanitização, identificadores, syntax highlighting, ESLint, Vite e Drizzle Kit.
Essa linha de base foi fornecida como contexto e deve ser revalidada contra o
registry e os advisories vigentes antes do planejamento técnico. Este PRD não
define versões-alvo.

O objetivo é eliminar vulnerabilidades conhecidas e corrigíveis do grafo de
produção, reduzir as vulnerabilidades corrigíveis do toolchain e submeter todo
risco residual inevitável a uma decisão individual e explícita, preservando o
comportamento, os dados, a compatibilidade e a operabilidade do site.

## Usuários e contexto

- Visitantes dependem da renderização segura e estável de posts, projetos,
  Markdown, blocos de código e imagens.
- O administrador depende de autenticação, CRUD de conteúdo e uploads sem
  regressões.
- O mantenedor precisa de um grafo de dependências auditável, comandos de
  desenvolvimento e operação funcionais e riscos residuais rastreáveis.
- O responsável pela integração precisa de evidência suficiente para decidir
  se a remediação e a suíte essencial podem avançar até `main`.

Há exposição real em componentes usados pelo runtime, incluindo Next.js App
Router, Server Actions, o Proxy administrativo, `next/image`, Drizzle ORM,
conteúdo administrativo persistido e exibido publicamente e syntax
highlighting de Markdown.

Algumas ocorrências têm alcance reduzido pelas defesas e pelos padrões atuais:
layouts e Server Actions revalidam a sessão, identificadores do Drizzle são
estáticos, `sanitize-html` usa a configuração padrão, `uuid` usa somente
`v4()` sem buffer, Markdown passa por `rehype-sanitize` e as cadeias de lint,
build e migrations não integram o runtime público. Esse alcance reduzido pode
compor uma justificativa, mas não equivale a correção nem autoriza um aceite
genérico.

## Resultados esperados

1. Nenhuma vulnerabilidade de produção conhecida permanece sem correção ou
   justificativa específica aprovada explicitamente pelo usuário.
2. Next.js e suas dependências transitivas não permanecem em versões afetadas
   por vulnerabilidades corrigíveis e aplicáveis ao projeto.
3. Drizzle ORM deixa de estar exposto à falha conhecida de escape de
   identificadores.
4. `sanitize-html` e `uuid` deixam de usar versões afetadas pelas ocorrências
   conhecidas e corrigíveis.
5. A cadeia de syntax highlighting é corrigida ou recebe uma decisão explícita
   de adiamento, sustentada por evidência de compatibilidade e alcance.
6. Vulnerabilidades corrigíveis do toolchain são removidas por atualizações
   compatíveis e o lockfile representa fielmente o grafo resultante.
7. Drizzle Kit não é rebaixado para uma versão antiga ou incompatível apenas
   para satisfazer o audit, em especial para `0.18.1`.
8. A suíte essencial e os fluxos operacionais permanecem estáveis após a
   remediação.

## Requisitos e regras de negócio

### Contrato de segurança

1. A triagem deve separar dependências de produção e de desenvolvimento e
   tratar cada advisory conforme severidade, alcance, cadeia de introdução e
   disponibilidade de correção.
2. `npm audit --omit=dev` deve terminar sem vulnerabilidades ou somente com
   exceções individualmente justificadas e aprovadas pelo usuário.
3. Vulnerabilidades de severidade alta no runtime não podem ser aceitas de
   forma implícita ou agrupadas sob uma justificativa genérica.
4. Cada risco residual deve registrar, no mínimo, advisory e dependência
   afetada, causa da permanência, alcance no projeto, mitigação existente,
   impacto, prazo ou condição de reavaliação e decisão explícita do usuário.
5. A ausência de explorabilidade demonstrada reduz o risco, mas não substitui
   correção disponível e compatível.
6. Nenhuma atualização pode remover ou enfraquecer as verificações de sessão
   existentes no layout administrativo e nas Server Actions.
7. Nenhuma mitigação de autenticação pode depender somente do Proxy quando o
   layout ou a própria Server Action puder validar a sessão novamente.
8. O resultado do audit não pode ser ocultado por configuração, filtro ou
   exclusão artificial de dependências pertencentes ao escopo avaliado.
9. `npm audit fix --force` não pode ser usado como estratégia de remediação.
10. Overrides incompatíveis e downgrades não podem ser introduzidos sem
    evidência técnica e aprovação explícita. O downgrade do Drizzle Kit para
    `0.18.1` é proibido.

### Preservação de comportamento

1. O site público deve continuar exibindo posts, projetos, Markdown, blocos de
   código e imagens sem regressões funcionais ou visuais deliberadas.
2. O painel administrativo deve continuar exigindo autenticação.
3. Criação, atualização e exclusão de posts e projetos devem permanecer
   funcionais e preservar os dados existentes.
4. Uploads devem manter o comportamento atual.
5. A sanitização deve preservar ou melhorar a proteção existente sem remover
   conteúdo válido de forma inesperada.
6. IDs existentes e novos devem manter o contrato atual.
7. Build, migrations, seed, lint e testes devem continuar executáveis pelos
   comandos documentados no projeto.

### Compatibilidade

1. Next.js 16 e React 19 devem ser preservados. Qualquer alteração material
   dessas linhas exige decisão explícita do usuário e invalida a aprovação
   aplicável.
2. SQLite e Better SQLite3 devem ser preservados.
3. Schemas e migrations não devem ser alterados sem necessidade comprovada e
   nova decisão explícita sobre a mudança de contrato de dados.
4. O contrato mínimo de Node `>=20.9.0` deve ser preservado. Uma proposta de
   alteração exige decisão explícita e deve demonstrar o impacto operacional.
5. A aplicação deve ser validada no Node mínimo declarado.
6. Uma atualização major de `react-syntax-highlighter` só pode avançar depois
   da avaliação de mudanças de tipos, APIs e renderização.
7. As versões de `next` e `eslint-config-next` devem permanecer alinhadas.

## Escopo

- Revalidar a linha de base das vulnerabilidades antes do planejamento.
- Tratar as cadeias informadas de Next.js, Drizzle ORM, sanitização,
  identificadores, syntax highlighting, ESLint, Vite e Drizzle Kit.
- Atualizar somente dependências necessárias à remediação e à compatibilidade
  do grafo resultante.
- Regenerar e validar o lockfile como parte da remediação.
- Preservar e validar os contratos funcionais, de segurança e operacionais
  definidos neste PRD.
- Documentar e submeter à decisão do usuário qualquer risco residual.
- Validar o estado isolado da remediação e o estado combinado com a suíte
  essencial antes da integração em `main`.

## Restrições de entrega

- A implementação deve ocorrer em `security/dependency-remediation`, criada a
  partir de `test/essential-behavior` depois da conclusão e do commit da
  documentação pendente nessa branch.
- A remediação só pode retornar a `test/essential-behavior` depois de PRD e
  plano aprovados, implementação validada e revisão final sem achados
  bloqueantes.
- O estado combinado deve ser validado e revisado novamente antes de
  `test/essential-behavior` ser integrado em `main`.
- A integração em `main` depende de CI verde e da decisão explícita sobre todos
  os riscos residuais.

## Fora de escopo

- Novas funcionalidades de produto.
- Mudanças visuais deliberadas.
- Troca de framework, ORM, banco de dados ou gerenciador de pacotes.
- Hardening geral de upload.
- Rate limiting.
- Redesenho de autenticação.
- Refatoração ampla dos repositories ou Server Actions.
- Metas percentuais de cobertura.
- Correção de warnings preexistentes não relacionados.
- Atualização indiscriminada de todas as dependências.

## Critérios de aceite

1. As dependências corrigidas estão explicitamente identificadas no manifest
   e no lockfile, e o grafo instalado corresponde a esses artefatos.
2. `npm audit --omit=dev` atende ao gate de produção definido neste PRD.
3. `npm audit` não apresenta vulnerabilidades corrigíveis por atualização
   compatível.
4. Toda vulnerabilidade residual possui o registro exigido e uma decisão
   explícita do usuário.
5. `npm test` passa três vezes consecutivas.
6. `npm run lint` passa sem novos warnings.
7. `npm run build` passa.
8. Permanecem aprovados os testes de configuração, autenticação, repositories,
   CRUD administrativo, sanitização, Markdown, syntax highlighting e upload.
9. `jq empty package.json package-lock.json` passa.
10. Prettier e `git diff --check` passam.
11. A sequência equivalente à CI passa em workspace temporário após
    `npm ci`.
12. As validações não criam nem modificam `db.sqlite3`, `.env.local` ou uploads
    reais.
13. A validação no Node mínimo declarado passa.
14. A CI remota fica verde no estado candidato à integração.
15. A revisão final read-only não possui achados bloqueantes.

## Riscos que exigem decisão do usuário

1. **Risco residual no runtime:** qualquer advisory sem correção compatível ou
   cuja correção cause regressão material exige aceite ou rejeição individual.
   Sem aceite explícito, a integração permanece bloqueada.
2. **Syntax highlighting:** se a correção exigir uma versão major com mudança
   de tipos, API ou renderização, o usuário deve decidir entre a migração
   compatível e um adiamento documentado. O adiamento precisa registrar alcance
   e condição de reavaliação.
3. **Toolchain residual:** se ESLint, Vite ou Drizzle Kit permanecerem afetados
   após todas as atualizações compatíveis, o usuário deve decidir sobre o risco
   residual com base no uso restrito a desenvolvimento, build ou migrations.
4. **Override ou downgrade incompatível:** qualquer proposta desse tipo exige
   evidência e decisão explícita. Não há autorização prévia neste PRD, e o
   downgrade proibido do Drizzle Kit não pode ser proposto como solução.
5. **Mudança de plataforma:** alterar as linhas de Next.js ou React, o mínimo de
   Node, o banco, o driver, schemas ou migrations é uma mudança material e
   exige revisão do contrato e nova aprovação.

## Questões abertas

As seguintes questões devem ser respondidas com evidência atual no futuro
`PLAN.md`; elas não autorizam decisões técnicas neste PRD:

1. Quais advisories e versões corrigidas permanecem vigentes no registry no
   momento do planejamento?
2. Quais atualizações compatíveis eliminam cada cadeia sem ampliar o escopo?
3. A cadeia de syntax highlighting pode ser corrigida sem mudança major ou
   regressão de tipos e renderização?
4. Quais vulnerabilidades do toolchain, se houver, não possuem correção
   compatível que preserve o Drizzle Kit atual?
5. Alguma correção exige alterar o mínimo de Node ou outro contrato de
   plataforma?

## Fronteira entre PRD e PLAN.md

Este PRD define o resultado de segurança, o comportamento que deve ser
preservado, os limites de compatibilidade, os gates de qualidade e as decisões
que pertencem ao usuário.

O futuro `PLAN.md` deverá definir, depois de nova consulta ao registry e aos
advisories, as versões-alvo exatas, a ordem das atualizações, a estratégia de
regeneração do lockfile, a necessidade demonstrada de overrides, o mapeamento
de testes e a evidência para cada advisory. Nenhuma dessas decisões técnicas é
aprovada por este documento.

## Gate de aprovação

O PRD foi aprovado explicitamente por Luis Antunes em 2026-08-20. A aprovação
autoriza a elaboração do `PLAN.md`, mas não autoriza `TASKS.md`, implementação
ou alteração de código antes da aprovação explícita do plano técnico.
