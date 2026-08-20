---
name: plan-work
description: Cria o contrato técnico e a decomposição executável de um trabalho, sem implementar e sem decidir requisitos de produto pendentes.
---

# Plan Work

Produza o contrato técnico em `docs/features/<slug>/`, sempre com `PLAN.md`.

## Preparação

1. Resolva o slug e leia `docs/architecture.md`, `docs/conventions.md`, os artefatos existentes e apenas o código relevante.
2. Se houver decisão de produto pendente, pare e indique `$create-prd`. Não crie PRD nem escolha o requisito silenciosamente.
3. Quando o trabalho exigir fluxo completo, exija `PRD.md` com estado `approved` antes de planejar.

## Escolha do nível

- `rápido`: somente quando o comportamento estiver claro, a mudança for localizada e de baixo risco, sem contrato externo, migração, decisão arquitetural ou dependência nova, e couber em uma task lógica.
- `completo`: produto ambíguo ou negociável, iniciativa ampla, contrato público, migração de dados, segurança, autorização, pagamentos, privacidade, alto risco, múltiplas equipes ou decisão difícil de reverter.
- `padrão`: trabalhos que não atendem integralmente ao nível rápido nem exigem o completo, especialmente quando houver múltiplas tasks, componentes ou sessões.

Registre o nível e sua justificativa no plano.

## Artefatos

Crie `PLAN.md` com estado `draft`, aprovação pendente, objetivo técnico, escopo, fora de escopo, decisões técnicas, componentes ou arquivos prováveis, critérios de aceite, estratégia de implementação, validação esperada, riscos e rollback quando aplicável.

No nível rápido, inclua no próprio plano uma task lógica `TASK-001` com estado, critérios locais e campo de evidência. Não crie `TASKS.md`.

Nos níveis padrão e completo, crie ou atualize `TASKS.md` como único ledger operacional. Para cada task registre ID, descrição executável, dependências, estado `pending`, critérios locais e evidência ainda pendente.

Apresente plano e tasks como um único pacote e peça aprovação explícita. Quando o usuário aprovar inequivocamente, altere o plano para `approved`, registre data e origem da aprovação e indique que a aprovação cobre a decomposição atual.

Mudança material de produto, escopo, arquitetura, contrato, migração ou risco devolve o plano a `draft` e exige nova aprovação. Reordenar ou dividir tasks sem alterar o contrato não exige novo gate.

## Limites

- Não implemente nem altere código.
- Não aprove o próprio plano.
- Não use o chat como única cópia persistente do contrato.
- Não crie artefatos adicionais de status ou testes.
