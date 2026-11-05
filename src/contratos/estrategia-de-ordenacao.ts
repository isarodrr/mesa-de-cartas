import type { Carta } from "../modelos/carta";

// Ordena cartas em ordem crescente: primeiro pelo valor e, em caso de
// empate, pela ordem dos naipes (Ouros, Espadas, Copas, Paus).
// Dica: carta.comparar(outra) já implementa essa regra.
export interface EstrategiaDeOrdenacao {
  // Devolve um NOVO array ordenado. O array recebido não pode ser
  // alterado (nem a ordem, nem o conteúdo).
  ordenar(cartas: Carta[]): Carta[];
}