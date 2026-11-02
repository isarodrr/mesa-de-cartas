import type { Jogador } from "../modelos/jogador";

// Fila (FIFO): o primeiro jogador que entra é o primeiro a sair.
export interface FilaDeJogadores {
  // Coloca o jogador no fim da fila.
  entrar(jogador: Jogador): void;

  // Remove e devolve o jogador do início da fila.
  // Lança Error se a fila estiver vazia.
  proximo(): Jogador;

  estaVazia(): boolean;

  // Quantidade de jogadores na fila.
  tamanho(): number;
}
