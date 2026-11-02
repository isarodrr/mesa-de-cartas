import { Carta, NAIPES } from "./carta";
import type { GeradorAleatorio } from "../contratos/gerador-aleatorio";
import type { PilhaDeCartas } from "../contratos/pilha-de-cartas";

export class Baralho {
  private cartas: Carta[] = [];

  constructor() {
    for (const naipe of NAIPES) {
      for (let valor = 1; valor <= 13; valor++) {
        this.cartas.push(new Carta(valor, naipe));
      }
    }
  }

  // Embaralhamento de Fisher-Yates: depende só do contrato do gerador.
  embaralhar(gerador: GeradorAleatorio): void {
    for (let i = this.cartas.length - 1; i > 0; i--) {
      const j = gerador.proximoInteiro(i + 1);
      const temporaria = this.cartas[i];
      this.cartas[i] = this.cartas[j];
      this.cartas[j] = temporaria;
    }
  }

  // Empilha as cartas na ordem atual: a última fica no topo.
  empilharEm(pilha: PilhaDeCartas): void {
    for (const carta of this.cartas) {
      pilha.empilhar(carta);
    }
  }
}
