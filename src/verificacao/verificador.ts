import { Carta } from "../modelos/carta";
import { Jogador } from "../modelos/jogador";
import type { EstrategiaDeOrdenacao } from "../contratos/estrategia-de-ordenacao";
import type { FilaDeJogadores } from "../contratos/fila-de-jogadores";
import type { FormatadorDeCarta } from "../contratos/formatador-de-carta";
import type { GeradorAleatorio } from "../contratos/gerador-aleatorio";
import type { PilhaDeCartas } from "../contratos/pilha-de-cartas";

// Sequência esperada de proximoInteiro(100) com a semente 42.
const SEQUENCIA_SEMENTE_42: number[] = [94, 23, 9, 43, 26];

function exigir(condicao: boolean, mensagem: string): void {
  if (!condicao) {
    throw new Error(mensagem);
  }
}

function lancaErro(acao: () => void): boolean {
  try {
    acao();
    return false;
  } catch {
    return true;
  }
}

function conferirFormato(
  formatador: FormatadorDeCarta,
  valor: number,
  naipe: string,
  esperado: string,
): void {
  const obtido = formatador.formatar(new Carta(valor, naipe));
  exigir(
    obtido === esperado,
    `formatar(${valor} de ${naipe}) devolveu "${obtido}"; esperado "${esperado}"`,
  );
}

// Confere, uma interface por vez, se as implementações recebidas respeitam
// o contrato. Cada teste devolve "" quando passa, ou a mensagem do problema.
// Atenção: a pilha e a fila recebidas devem estar vazias, e o gerador deve
// ser novo (semente 42), pois os testes usam os próprios objetos recebidos.
export class Verificador {
  private falhas = 0;

  constructor(
    private formatador: FormatadorDeCarta,
    private pilha: PilhaDeCartas,
    private fila: FilaDeJogadores,
    private ordenacao: EstrategiaDeOrdenacao,
    private gerador: GeradorAleatorio,
  ) {}

  executar(): string[] {
    const linhas: string[] = [];
    this.falhas = 0;
    this.registrar(linhas, "FormatadorDeCarta", this.testarFormatador());
    this.registrar(linhas, "PilhaDeCartas", this.testarPilha());
    this.registrar(linhas, "FilaDeJogadores", this.testarFila());
    this.registrar(linhas, "EstrategiaDeOrdenacao", this.testarOrdenacao());
    this.registrar(linhas, "GeradorAleatorio", this.testarGerador());
    return linhas;
  }

  todasPassaram(): boolean {
    return this.falhas === 0;
  }

  private registrar(linhas: string[], nome: string, problema: string): void {
    if (problema === "") {
      linhas.push(`[OK] ${nome}`);
    } else {
      linhas.push(`[ERRO] ${nome}: ${problema}`);
      this.falhas++;
    }
  }

  private testarFormatador(): string {
    try {
      const formatador = this.formatador;
      conferirFormato(formatador, 1, "Copas", "A♥");
      conferirFormato(formatador, 7, "Ouros", "7♦");
      conferirFormato(formatador, 10, "Espadas", "10♠");
      conferirFormato(formatador, 11, "Paus", "J♣");
      conferirFormato(formatador, 12, "Copas", "Q♥");
      conferirFormato(formatador, 13, "Ouros", "K♦");
      return "";
    } catch (erro) {
      return this.mensagem(erro);
    }
  }

  private testarPilha(): string {
    try {
      const pilha = this.pilha;
      const a = new Carta(1, "Copas");
      const b = new Carta(2, "Paus");
      const c = new Carta(3, "Ouros");

      exigir(pilha.estaVazia(), "uma pilha nova deveria estar vazia");
      exigir(pilha.tamanho() === 0, "uma pilha nova deveria ter tamanho 0");

      pilha.empilhar(a);
      pilha.empilhar(b);
      pilha.empilhar(c);
      exigir(!pilha.estaVazia(), "depois de empilhar, não está vazia");
      exigir(pilha.tamanho() === 3, "tamanho() deveria ser 3");
      exigir(pilha.topo() === c, "topo() deveria ser a última empilhada");
      exigir(pilha.tamanho() === 3, "topo() não deve remover a carta");

      exigir(pilha.desempilhar() === c, "1º desempilhar() deveria ser a 3ª");
      exigir(pilha.desempilhar() === b, "2º desempilhar() deveria ser a 2ª");
      exigir(pilha.desempilhar() === a, "3º desempilhar() deveria ser a 1ª");
      exigir(pilha.estaVazia(), "depois de desempilhar tudo, está vazia");

      exigir(
        lancaErro(() => pilha.desempilhar()),
        "desempilhar() com a pilha vazia deveria lançar Error",
      );
      exigir(
        lancaErro(() => pilha.topo()),
        "topo() com a pilha vazia deveria lançar Error",
      );
      return "";
    } catch (erro) {
      return this.mensagem(erro);
    }
  }

  private testarFila(): string {
    try {
      const fila = this.fila;
      const ana = new Jogador("Ana", 15);
      const bruno = new Jogador("Bruno", 17);
      const carla = new Jogador("Carla", 18);

      exigir(fila.estaVazia(), "uma fila nova deveria estar vazia");
      exigir(fila.tamanho() === 0, "uma fila nova deveria ter tamanho 0");

      fila.entrar(ana);
      fila.entrar(bruno);
      fila.entrar(carla);
      exigir(!fila.estaVazia(), "depois de entrar, não está vazia");
      exigir(fila.tamanho() === 3, "tamanho() deveria ser 3");

      exigir(fila.proximo() === ana, "1º proximo() deveria ser Ana");
      exigir(fila.tamanho() === 2, "proximo() deve remover o jogador");

      fila.entrar(ana);
      exigir(fila.proximo() === bruno, "2º proximo() deveria ser Bruno");
      exigir(fila.proximo() === carla, "3º proximo() deveria ser Carla");
      exigir(fila.proximo() === ana, "4º proximo() deveria ser Ana de novo");
      exigir(fila.estaVazia(), "depois de sair todos, está vazia");

      exigir(
        lancaErro(() => fila.proximo()),
        "proximo() com a fila vazia deveria lançar Error",
      );
      return "";
    } catch (erro) {
      return this.mensagem(erro);
    }
  }

  private testarOrdenacao(): string {
    try {
      const ordenacao = this.ordenacao;
      const damaCopas = new Carta(12, "Copas");
      const asPaus = new Carta(1, "Paus");
      const seteOuros = new Carta(7, "Ouros");
      const seteCopas = new Carta(7, "Copas");
      const seteEspadas = new Carta(7, "Espadas");
      const asOuros = new Carta(1, "Ouros");

      const entrada: Carta[] = [
        damaCopas, asPaus, seteOuros, seteCopas, seteEspadas, asOuros,
      ];
      const saida = ordenacao.ordenar(entrada);

      const esperada: Carta[] = [
        asOuros, asPaus, seteOuros, seteEspadas, seteCopas, damaCopas,
      ];
      exigir(saida.length === esperada.length, "deveria devolver 6 cartas");
      for (let i = 0; i < esperada.length; i++) {
        exigir(
          saida[i] === esperada[i],
          `posição ${i + 1} errada: ordem esperada A♦ A♣ 7♦ 7♠ 7♥ Q♥`,
        );
      }

      exigir(saida !== entrada, "deveria devolver um NOVO array");
      exigir(
        entrada[0] === damaCopas && entrada[1] === asPaus &&
          entrada[2] === seteOuros && entrada[3] === seteCopas &&
          entrada[4] === seteEspadas && entrada[5] === asOuros,
        "o array recebido não pode ser alterado",
      );
      exigir(ordenacao.ordenar([]).length === 0, "array vazio → array vazio");
      return "";
    } catch (erro) {
      return this.mensagem(erro);
    }
  }

  private testarGerador(): string {
    try {
      const gerador = this.gerador;
      for (let i = 0; i < SEQUENCIA_SEMENTE_42.length; i++) {
        const obtido = gerador.proximoInteiro(100);
        exigir(
          obtido === SEQUENCIA_SEMENTE_42[i],
          `semente 42, limite 100, sorteio ${i + 1}: ` +
            `obtido ${obtido}; esperado ${SEQUENCIA_SEMENTE_42[i]}`,
        );
      }

      for (let i = 0; i < 50; i++) {
        const x = gerador.proximoInteiro(52);
        exigir(Number.isInteger(x), `${x} não é inteiro`);
        exigir(x >= 0 && x < 52, `${x} fora do intervalo de 0 a 51`);
      }
      exigir(gerador.proximoInteiro(1) === 0, "com limite 1, só pode sair 0");

      exigir(
        lancaErro(() => gerador.proximoInteiro(0)),
        "proximoInteiro(0) deveria lançar Error",
      );
      exigir(
        lancaErro(() => gerador.proximoInteiro(-3)),
        "proximoInteiro(-3) deveria lançar Error",
      );
      return "";
    } catch (erro) {
      return this.mensagem(erro);
    }
  }

  private mensagem(erro: unknown): string {
    return erro instanceof Error ? erro.message : String(erro);
  }
}
