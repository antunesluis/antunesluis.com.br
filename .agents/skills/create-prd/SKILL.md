---
name: create-prd
description: Define produto e registra um PRD aprovável quando requisitos, jornadas, regras de negócio ou contratos ainda exigem decisão.
---

# Create PRD

Transforme uma demanda com decisões reais de produto em `docs/features/<slug>/PRD.md`.

## Procedimento

1. Resolva um slug estável com o usuário ou a partir da demanda e leia o contexto de produto já disponível.
2. Confirme que a demanda exige definição de comportamento, jornada, regra de negócio, contrato externo ou escopo negociável. Se o resultado já estiver claro e for apenas técnico, não crie PRD e indique `$plan-work`.
3. Reúna somente as decisões necessárias para tornar o escopo planejável. Mantenha dúvidas não resolvidas como questões abertas.
4. Crie ou atualize `PRD.md` com:
   - estado `draft` e aprovação pendente;
   - problema e objetivo;
   - usuários e contexto;
   - requisitos e regras de negócio;
   - escopo e fora de escopo;
   - critérios de aceite;
   - riscos e questões abertas.
5. Resuma as decisões pendentes e peça aprovação explícita.

Se o usuário aprovar inequivocamente o conteúdo existente, altere o estado para `approved` e registre data e origem da aprovação. Não considere silêncio, continuidade do trabalho ou autorização genérica como aprovação.

Se uma mudança material for solicitada após aprovação, volte o documento para `draft`, registre que a aprovação anterior foi invalidada e solicite nova aprovação.

## Limites

- Não escolha arquitetura nem estratégia de implementação.
- Não crie `PLAN.md` ou `TASKS.md`.
- Não altere código.
- Não aprove o próprio PRD.
- Não copie documentação inteira para o artefato.
