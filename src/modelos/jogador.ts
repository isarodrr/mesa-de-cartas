import type { Carta } from "./carta";

export const LIMITE_DE_PONTOS = 21;

export class Jogador {
  private mao: Carta[] = [];

  // limite: o jogador pede carta enquanto tiver menos pontos que isso.
  constructor(readonly nome: string, readonly limite: number) {}

  receber(carta: Carta): void {
    this.mao.push(carta);
  }

  // Devolve uma cópia: quem chama não consegue alterar a mão.
  cartas(): Carta[] {
    return this.mao.slice();
  }

  pontos(): number {
    let total = 0;
    for (const carta of this.mao) {
      total += carta.pontos();
    }
    return total;
  }

  querCarta(): boolean {
    return this.pontos() < this.limite;
  }

  estourou(): boolean {
    return this.pontos() > LIMITE_DE_PONTOS;
  }
}
