import { GeradorAleatorio } from "../contratos/gerador-aleatorio";

export class GeradorCongruencial implements GeradorAleatorio {
    private estado: number;

    constructor(private semente: number) {
        if (this.semente < 1 || this.semente > 2147483646) {
            throw new Error("Semente invalida");
        }

        this.estado = (this.semente * 16807) % 2147483646
    }
    proximoInteiro(limite: number): number {
        this.estado = (this.estado * 16807) % 2147483646
        let resultado = this.estado % limite;
        return resultado;

    }
}

