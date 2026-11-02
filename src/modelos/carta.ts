// Ordem dos naipes usada para desempate: Ouros < Espadas < Copas < Paus.
export const NAIPES: string[] = ["Ouros", "Espadas", "Copas", "Paus"];

export class Carta {
  // valor: 1 (Ás) a 13 (Rei); 11 = Valete, 12 = Dama, 13 = Rei.
  constructor(readonly valor: number, readonly naipe: string) {
    if (!Number.isInteger(valor) || valor < 1 || valor > 13) {
      throw new Error(`Valor de carta inválido: ${valor}`);
    }
    if (!NAIPES.includes(naipe)) {
      throw new Error(`Naipe inválido: ${naipe}`);
    }
  }

  // No jogo, o Ás vale 1 e as figuras (J, Q, K) valem 10.
  pontos(): number {
    return Math.min(this.valor, 10);
  }

  // Negativo: esta carta vem antes; positivo: vem depois; 0: iguais.
  // Compara primeiro o valor e, em caso de empate, a ordem do naipe.
  comparar(outra: Carta): number {
    if (this.valor !== outra.valor) {
      return this.valor - outra.valor;
    }
    return NAIPES.indexOf(this.naipe) - NAIPES.indexOf(outra.naipe);
  }
}
