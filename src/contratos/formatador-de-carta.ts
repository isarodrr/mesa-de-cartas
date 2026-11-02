import type { Carta } from "../modelos/carta";

// Transforma uma carta em texto curto para exibição.
// Formato: rótulo do valor + símbolo do naipe, sem espaço.
//   Rótulo: 1 = A, 2 a 10 = o próprio número, 11 = J, 12 = Q, 13 = K.
//   Naipe:  Copas = ♥, Espadas = ♠, Ouros = ♦, Paus = ♣.
// Exemplos: Ás de Copas = "A♥", 10 de Espadas = "10♠",
//           Dama de Ouros = "Q♦", Rei de Paus = "K♣".
export interface FormatadorDeCarta {
  formatar(carta: Carta): string;
}
