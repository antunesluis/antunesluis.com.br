---
name: implement-task
description: Implementa uma task ou lote explicitamente autorizado dentro de um PLAN aprovado e registra evidência curta no ledger existente.
---

# Implement Task

Implemente somente o escopo aprovado em `docs/features/<slug>/`.

## Pré-condições

- Exija `PLAN.md` com estado `approved`.
- No fluxo completo, exija também `PRD.md` aprovado.
- Quando existir `TASKS.md`, aceite apenas tasks `pending` ou `in_progress`, desbloqueadas e com dependências concluídas.
- No fluxo rápido, trate a task embutida no plano como `TASK-001`.
- Compare o contrato com o código atual. Se houver conflito material, não edite código, invalide a aprovação aplicável e encaminhe para novo planejamento.

## Seleção

- Com um ID ou lote informado, valide e execute somente a seleção autorizada.
- Sem ID, selecione automaticamente quando houver exatamente uma task elegível e informe a escolha.
- Sem ID e com várias tasks elegíveis, pare e peça ao usuário que indique a seleção.

## Execução

1. Marque a seleção como `in_progress` no `TASKS.md` ou no `PLAN.md` rápido.
2. Altere apenas o código e os testes cobertos pelo plano.
3. Execute as validações previstas e outras verificações proporcionais ao risco que sejam necessárias para demonstrar os critérios locais.
4. Em caso de sucesso, marque a task como `done` e registre evidência curta dos arquivos alterados, comandos e resultados.
5. Se o trabalho ficar incompleto, mantenha `in_progress`. Use `blocked` somente quando houver decisão, acesso ou condição externa impeditiva.

`done` significa implementação concluída, não aprovação final. Informe a próxima revisão necessária.

## Limites

- Pare antes de qualquer mudança material fora do plano.
- Não introduza dependência, contrato, migração ou decisão arquitetural não aprovada.
- Não crie relatório de implementação, plano de testes ou ledger paralelo.
- Não execute a revisão independente nem corrija achados ainda não autorizados.
