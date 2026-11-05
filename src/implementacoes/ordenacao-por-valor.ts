import type { EstrategiaDeOrdenacao } from "../contratos/estrategia-de-ordenacao";
import type { Carta } from "../modelos/carta";
 
// Ordenação por inserção, sobre uma cópia do array recebido.
// Critério: Carta.comparar() (valor e, no empate, ordem dos naipes).
export class OrdenacaoPorValor implements EstrategiaDeOrdenacao {
    ordenar(cartas: Carta[]): Carta[] {
        const copia: Carta[] = [];
        for (let i = 0; i < cartas.length; i++) {
            copia[i] = cartas[i];
        }
 
        for (let i = 1; i < copia.length; i++) {
            const atual: Carta = copia[i];
            let j: number = i - 1;
            while (j >= 0 && copia[j].comparar(atual) > 0) {
                copia[j + 1] = copia[j];
                j--;
            }
            copia[j + 1] = atual;
        }
 
        return copia;
    }
}