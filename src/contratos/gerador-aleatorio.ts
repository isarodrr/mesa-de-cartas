// Fonte de números pseudoaleatórios com semente: a mesma semente
// produz sempre a mesma sequência.
export interface GeradorAleatorio {
  // Devolve um inteiro de 0 até limite - 1 (inclusive).
  // Lança Error se limite não for um inteiro maior que zero.
  proximoInteiro(limite: number): number;
}
