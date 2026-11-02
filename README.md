# Mesa de Cartas — atividade de interfaces

Projeto do livro *Programação Orientada a Objetos com TypeScript* (roda no
navegador, com Parcel e TypeScript em modo estrito). O enunciado completo
está no PDF da atividade.

## Executar

```bash
npm install
npm start        # abre a mesa de cartas (verificador no console, F12)
npm run check    # confere os tipos (precisa terminar sem erros)
```

O projeto só compila depois que você criar as classes e instanciá-las.

## O que você faz

1. Crie, em `src/implementacoes/`, uma classe para cada interface de
   `src/contratos/`, com estes nomes de arquivo e de classe:

   | Arquivo | Classe | Implementa |
   |:--------|:-------|:-----------|
   | `formatador-compacto.ts` | `FormatadorCompacto` | `FormatadorDeCarta` |
   | `pilha-em-array.ts` | `PilhaEmArray` | `PilhaDeCartas` |
   | `fila-em-array.ts` | `FilaEmArray` | `FilaDeJogadores` |
   | `ordenacao-por-valor.ts` | `OrdenacaoPorValor` | `EstrategiaDeOrdenacao` |
   | `gerador-congruencial.ts` | `GeradorCongruencial` | `GeradorAleatorio` |

2. Em `src/main.ts`, no ponto do comentário `TODO`, importe as classes e
   crie as variáveis `gerador` (com `SEMENTE`), `geradorDeTeste` (com `SEMENTE_DE_TESTE`), `compra`, `descarte`,
   `ordemDaVez`, `ordenacao` e `formatador`.

O verificador escreve `[OK]`/`[ERRO]` no **console do navegador** (F12);
enquanto houver `[ERRO]`, a mesa não aparece.

**Não altere** `contratos/`, `modelos/`, `partida/`, `ui/`, `verificacao/` nem o
resto do `main.ts`.

## Entrega

Um `.zip` chamado `nome-sobrenome.zip` com a pasta `implementacoes/` e o
arquivo `main.ts`. Não inclua `node_modules`, `dist` nem `.parcel-cache`.
