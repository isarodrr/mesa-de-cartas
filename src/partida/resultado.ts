import type { Carta } from "../modelos/carta";

// Uma compra de carta: quem comprou, qual carta, quantos pontos passou a
// ter e se, depois dela, o jogador parou ou estourou.
export class Compra {
  constructor(
    readonly jogador: string,
    readonly carta: Carta,
    readonly pontos: number,
    readonly parou: boolean,
    readonly estourou: boolean,
  ) {}
}

// A mão de um jogador no fim da partida, já ordenada.
export class MaoFinal {
  constructor(
    readonly jogador: string,
    readonly cartas: Carta[],
    readonly pontos: number,
    readonly estourou: boolean,
  ) {}
}

// Tudo o que aconteceu na partida. A interface gráfica só lê esta classe.
export class ResultadoDaPartida {
  constructor(
    readonly compras: Compra[],
    readonly maos: MaoFinal[],
    readonly vencedores: string[],
    readonly melhorPontuacao: number,
    readonly cartasNoMonte: number,
    readonly cartasNoDescarte: number,
    readonly topoDoDescarte: Carta,
  ) {}

  descricao(): string {
    if (this.vencedores.length === 0) {
      return "Ninguém venceu: todos estouraram.";
    }
    if (this.vencedores.length === 1) {
      return `Vencedor: ${this.vencedores[0]} com ${this.melhorPontuacao} pontos`;
    }
    return `Empate entre ${this.vencedores.join(" e ")} com ${this.melhorPontuacao} pontos`;
  }
}
