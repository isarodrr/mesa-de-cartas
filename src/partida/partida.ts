import type { Jogador } from "../modelos/jogador";
import type { PilhaDeCartas } from "../contratos/pilha-de-cartas";
import type { FilaDeJogadores } from "../contratos/fila-de-jogadores";
import type { EstrategiaDeOrdenacao } from "../contratos/estrategia-de-ordenacao";
import { Compra, MaoFinal, ResultadoDaPartida } from "./resultado";

const MAXIMO_DE_COMPRAS = 500;

// Vinte-e-um simplificado. A Partida só conhece os CONTRATOS: não sabe
// se a pilha usa array, se a fila é circular nem como a ordenação é feita.
export class Partida {
  constructor(
    private jogadores: Jogador[],
    private compra: PilhaDeCartas,
    private descarte: PilhaDeCartas,
    private ordemDaVez: FilaDeJogadores,
    private ordenacao: EstrategiaDeOrdenacao,
  ) {}

  jogar(): ResultadoDaPartida {
    const compras: Compra[] = [];

    for (const jogador of this.jogadores) {
      this.ordemDaVez.entrar(jogador);
    }

    let tentativas = 0;
    while (!this.ordemDaVez.estaVazia()) {
      tentativas++;
      if (tentativas > MAXIMO_DE_COMPRAS) {
        throw new Error("A partida não terminou: confira a fila e a pilha.");
      }

      const jogador = this.ordemDaVez.proximo();
      const carta = this.compra.desempilhar();
      jogador.receber(carta);

      const parou = !jogador.querCarta();
      compras.push(
        new Compra(jogador.nome, carta, jogador.pontos(), parou, jogador.estourou()),
      );
      if (!parou) {
        this.ordemDaVez.entrar(jogador);
      }
    }

    const maos: MaoFinal[] = [];
    for (const jogador of this.jogadores) {
      const ordenada = this.ordenacao.ordenar(jogador.cartas());
      for (const carta of ordenada) {
        this.descarte.empilhar(carta);
      }
      maos.push(
        new MaoFinal(jogador.nome, ordenada, jogador.pontos(), jogador.estourou()),
      );
    }

    const melhor = this.melhorPontuacao();
    return new ResultadoDaPartida(
      compras,
      maos,
      this.nomesComPontuacao(melhor),
      melhor,
      this.compra.tamanho(),
      this.descarte.tamanho(),
      this.descarte.topo(),
    );
  }

  // Maior pontuação entre quem não estourou (0 se todos estouraram).
  private melhorPontuacao(): number {
    let melhor = 0;
    for (const jogador of this.jogadores) {
      if (!jogador.estourou() && jogador.pontos() > melhor) {
        melhor = jogador.pontos();
      }
    }
    return melhor;
  }

  private nomesComPontuacao(pontos: number): string[] {
    const nomes: string[] = [];
    if (pontos === 0) {
      return nomes;
    }
    for (const jogador of this.jogadores) {
      if (!jogador.estourou() && jogador.pontos() === pontos) {
        nomes.push(jogador.nome);
      }
    }
    return nomes;
  }
}
