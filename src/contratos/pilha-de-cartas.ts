import type { Carta } from "../modelos/carta";

// Pilha (LIFO): a última carta empilhada é a primeira a sair.
export interface PilhaDeCartas {
  // Coloca a carta no topo da pilha.
  empilhar(carta: Carta): void;

  // Remove e devolve a carta do topo.
  // Lança Error se a pilha estiver vazia.
  desempilhar(): Carta;

  // Devolve a carta do topo SEM removê-la.
  // Lança Error se a pilha estiver vazia.
  topo(): Carta;

  estaVazia(): boolean;

  // Quantidade de cartas na pilha.
  tamanho(): number;
}
