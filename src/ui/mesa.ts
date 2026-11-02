import type { Carta } from "../modelos/carta";
import type { FormatadorDeCarta } from "../contratos/formatador-de-carta";
import type { ResultadoDaPartida } from "../partida/resultado";

const INTERVALO_MS = 900;
const CARTAS_NO_BARALHO = 52;

// Estado de um jogador em um determinado momento da partida.
interface Assento {
  cartas: Carta[];
  pontos: number;
  situacao: "esperando" | "pediu" | "parou" | "estourou";
}

// Desenha a partida na página. Ela recebe o resultado pronto e o
// formatador (a SUA classe) para escrever o texto de cada carta.
export class MesaGrafica {
  private passo = 0;
  private relogio: number | undefined;

  constructor(
    private resultado: ResultadoDaPartida,
    private formatador: FormatadorDeCarta,
  ) {}

  iniciar(): void {
    this.ligar("btn-proximo", () => this.avancar());
    this.ligar("btn-fim", () => this.irParaOFim());
    this.ligar("btn-reiniciar", () => this.reiniciar());
    this.ligar("btn-reproduzir", () => this.alternarReproducao());
    this.desenhar(false);
  }

  private get total(): number {
    return this.resultado.compras.length;
  }

  private avancar(): void {
    if (this.passo < this.total + 1) {
      this.passo++;
      this.desenhar(true);
    }
    if (this.passo > this.total) {
      this.pausar();
    }
  }

  private irParaOFim(): void {
    this.pausar();
    this.passo = this.total + 1;
    this.desenhar(false);
  }

  private reiniciar(): void {
    this.pausar();
    this.passo = 0;
    this.desenhar(false);
  }

  private alternarReproducao(): void {
    if (this.relogio !== undefined) {
      this.pausar();
      return;
    }
    if (this.passo > this.total) {
      this.passo = 0;
      this.desenhar(false);
    }
    this.relogio = window.setInterval(() => this.avancar(), INTERVALO_MS);
    this.escreverBotaoReproduzir();
  }

  private pausar(): void {
    if (this.relogio !== undefined) {
      window.clearInterval(this.relogio);
      this.relogio = undefined;
    }
    this.escreverBotaoReproduzir();
  }

  private escreverBotaoReproduzir(): void {
    const botao = this.elemento("btn-reproduzir");
    botao.textContent = this.relogio === undefined ? "▶ Reproduzir" : "⏸ Pausar";
  }

  // passo 0: mesa vazia; 1..total: uma compra cada; total+1: fim.
  private desenhar(animar: boolean): void {
    const fim = this.passo > this.total;
    const compras = Math.min(this.passo, this.total);

    this.desenharPilhas(compras, fim);
    this.desenharAssentos(compras, fim, animar);
    this.desenharLances(compras, fim);

    const resultado = this.elemento("resultado");
    resultado.hidden = !fim;
    resultado.textContent = fim ? this.resultado.descricao() : "";

    const progresso = this.elemento("progresso");
    progresso.style.width = `${(this.passo / (this.total + 1)) * 100}%`;
  }

  private desenharPilhas(compras: number, fim: boolean): void {
    const restantes = CARTAS_NO_BARALHO - compras;
    this.preencherSlot("monte", restantes > 0 ? "verso" : undefined);
    this.elemento("monte-qtd").textContent = `${restantes} cartas`;

    if (fim) {
      this.preencherSlot("descarte", this.resultado.topoDoDescarte);
      this.elemento("descarte-qtd").textContent =
        `${this.resultado.cartasNoDescarte} cartas`;
    } else {
      this.preencherSlot("descarte", undefined);
      this.elemento("descarte-qtd").textContent = "0 cartas";
    }
  }

  private preencherSlot(id: string, conteudo: Carta | "verso" | undefined): void {
    const slot = this.elemento(id);
    slot.replaceChildren();
    if (conteudo === "verso") {
      slot.append(this.criarVerso());
    } else if (conteudo === undefined) {
      const vazio = document.createElement("div");
      vazio.className = "vazio";
      vazio.textContent = "vazio";
      slot.append(vazio);
    } else {
      slot.append(this.criarCarta(conteudo, false));
    }
  }

  private desenharAssentos(compras: number, fim: boolean, animar: boolean): void {
    const container = this.elemento("assentos");
    container.replaceChildren();

    const ultima = compras > 0 ? this.resultado.compras[compras - 1] : undefined;

    for (const mao of this.resultado.maos) {
      const assento = fim
        ? this.assentoFinal(mao.jogador)
        : this.assentoParcial(mao.jogador, compras);

      const caixa = document.createElement("article");
      caixa.className = "assento";
      if (fim && this.resultado.vencedores.includes(mao.jogador)) {
        caixa.classList.add("vencedor");
      }

      const topo = document.createElement("div");
      topo.className = "assento-topo";
      const nome = document.createElement("span");
      nome.className = "nome";
      nome.textContent = mao.jogador;
      const pontos = document.createElement("span");
      pontos.className = "pontos";
      pontos.textContent = String(assento.pontos);
      if (assento.situacao === "estourou") {
        pontos.classList.add("estourou");
      }
      topo.append(nome, pontos);

      const cartas = document.createElement("div");
      cartas.className = "mao";
      assento.cartas.forEach((carta, i) => {
        const nova =
          animar && !fim && ultima?.jogador === mao.jogador && i === assento.cartas.length - 1;
        cartas.append(this.criarCarta(carta, nova));
      });

      const status = document.createElement("span");
      status.className = "status";
      status.textContent = this.textoDaSituacao(assento.situacao, fim, mao.jogador);

      caixa.append(topo, cartas, status);
      container.append(caixa);
    }
  }

  private assentoParcial(jogador: string, compras: number): Assento {
    const assento: Assento = { cartas: [], pontos: 0, situacao: "esperando" };
    for (const compra of this.resultado.compras.slice(0, compras)) {
      if (compra.jogador === jogador) {
        assento.cartas.push(compra.carta);
        assento.pontos = compra.pontos;
        assento.situacao = compra.estourou ? "estourou" : compra.parou ? "parou" : "pediu";
      }
    }
    return assento;
  }

  private assentoFinal(jogador: string): Assento {
    const mao = this.resultado.maos.find((m) => m.jogador === jogador);
    if (mao === undefined) {
      throw new Error(`Jogador sem mão final: ${jogador}`);
    }
    return {
      cartas: mao.cartas,
      pontos: mao.pontos,
      situacao: mao.estourou ? "estourou" : "parou",
    };
  }

  private textoDaSituacao(situacao: Assento["situacao"], fim: boolean, jogador: string): string {
    if (fim && this.resultado.vencedores.includes(jogador)) {
      return "🏆 Venceu!";
    }
    switch (situacao) {
      case "esperando":
        return "Aguardando a vez";
      case "pediu":
        return "Pediu carta";
      case "parou":
        return fim ? "Parou (mão ordenada)" : "Parou";
      case "estourou":
        return "Estourou!";
    }
  }

  private desenharLances(compras: number, fim: boolean): void {
    const lista = this.elemento("log");
    lista.replaceChildren();
    this.resultado.compras.slice(0, compras).forEach((compra, i) => {
      const item = document.createElement("li");
      const texto = this.formatador.formatar(compra.carta);
      let frase = `${compra.jogador} comprou ${texto} (${compra.pontos} pts)`;
      if (compra.estourou) {
        frase += " e estourou";
      } else if (compra.parou) {
        frase += " e parou";
      }
      item.textContent = frase;
      if (i === compras - 1 && !fim) {
        item.className = "atual";
      }
      lista.append(item);
    });
    if (fim) {
      const item = document.createElement("li");
      item.className = "atual";
      item.textContent = this.resultado.descricao();
      lista.append(item);
    }
    lista.scrollTop = lista.scrollHeight;
  }

  private criarCarta(carta: Carta, nova: boolean): HTMLElement {
    const texto = this.formatador.formatar(carta);
    const naipe = texto.slice(-1);
    const valor = texto.slice(0, -1);

    const elemento = document.createElement("div");
    elemento.className = "carta";
    elemento.classList.add(naipe === "♥" || naipe === "♦" ? "vermelha" : "preta");
    if (nova) {
      elemento.classList.add("nova");
    }
    elemento.title = `${carta.valor} de ${carta.naipe}`;

    const canto = document.createElement("span");
    canto.className = "canto";
    canto.textContent = valor;
    const centro = document.createElement("span");
    centro.className = "centro";
    centro.textContent = naipe;
    elemento.append(canto, centro);
    return elemento;
  }

  private criarVerso(): HTMLElement {
    const elemento = document.createElement("div");
    elemento.className = "carta verso";
    return elemento;
  }

  private ligar(id: string, acao: () => void): void {
    this.elemento(id).addEventListener("click", acao);
  }

  private elemento(id: string): HTMLElement {
    const el = document.getElementById(id);
    if (el === null) {
      throw new Error(`Elemento #${id} não encontrado no index.html.`);
    }
    return el;
  }
}
