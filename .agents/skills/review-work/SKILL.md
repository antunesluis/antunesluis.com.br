---
name: review-work
description: Revisa de forma independente uma task, lote ou feature implementada e persiste o veredito sem aplicar correções.
---

# Review Work

Valide a implementação com o agente customizado `reviewer`; o agente principal continua responsável por toda escrita.

## Escopo e contexto

1. Determine se o pedido cobre uma task, um lote ou a feature final.
2. Leia `PRD.md` quando existir, `PLAN.md`, `TASKS.md` quando existir, o diff ou commit aplicável e os resultados das validações.
3. Exija revisão final antes de recomendar merge. Faça review por task apenas quando ela for arriscada, independente, destinada a merge separado ou solicitada pelo usuário.

## Delegação

Delegue uma análise ao agente `reviewer` com somente o contexto necessário. Solicite retorno estruturado com escopo, baseline, validações observadas, achados classificados como `BLOCKER`, `HIGH`, `MEDIUM` ou `LOW`, evidência, riscos residuais, veredito e próxima ação.

O reviewer não pode editar código ou artefatos nem gravar o relatório. Se ele tentar produzir mudanças, descarte-as e repita a análise em modo somente leitura.

## Persistência e estado

O agente principal grava o resultado:

- review final rápida ou padrão: `REVIEW.md`;
- review final completa: `reviews/FINAL.md`;
- review seletiva de task: `reviews/TASK-<id>.md`.

Inclua escopo e baseline, referência de diff ou commit quando disponível, validações observadas, achados com severidade e evidência, riscos residuais, veredito `approved`, `changes_requested` ou `blocked`, e recomendação de próxima ação.

Atualize task somente quando o veredito justificar: mantenha `done` após aprovação, volte a task afetada para `in_progress` quando houver correção necessária e use `blocked` apenas para impedimento externo. Em review final, altere somente tasks claramente relacionadas aos achados.

Achado `BLOCKER` ou `HIGH` impede recomendação de merge sem correção ou aceite explícito do usuário. Qualquer risco residual depende de decisão explícita antes da conclusão.

## Limites

- Não aplique correções.
- Não aprove riscos em nome do usuário.
- Não crie relatórios paralelos de QA, auditoria ou implementação.
- Não revise mecanicamente toda task de baixo risco quando a review final fornecer a mesma segurança.
