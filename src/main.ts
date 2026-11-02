import { Baralho } from "./modelos/baralho";
import { Jogador } from "./modelos/jogador";
import { Partida } from "./partida/partida";
import { Verificador } from "./verificacao/verificador";
import { MesaGrafica } from "./ui/mesa";
import { lerSemente, ligarControlesDeSemente } from "./ui/semente";
import type { PilhaDeCartas } from "./contratos/pilha-de-cartas";
import type { FilaDeJogadores } from "./contratos/fila-de-jogadores";
import type { GeradorAleatorio } from "./contratos/gerador-aleatorio";
import type { EstrategiaDeOrdenacao } from "./contratos/estrategia-de-ordenacao";
import type { FormatadorDeCarta } from "./contratos/formatador-de-carta";
import { GeradorCongruencial } from "./implementacoes/gerador-congruencial";

// A semente da partida vem da página (?semente=123); o padrão é 42.
// O verificador usa sempre a semente 42, pois conhece a sequência dela.
const SEMENTE = lerSemente();
const SEMENTE_DE_TESTE = 42;

// TODO: instancie aqui as suas classes (e importe-as no topo do arquivo).
// Crie estas sete variáveis, cada uma com o tipo da sua interface:
// gerador (com SEMENTE), geradorDeTeste (com SEMENTE_DE_TESTE; é só para
// o verificador), compra, descarte, ordemDaVez, ordenacao e formatador.
let gerador: GeradorAleatorio = new GeradorCongruencial(SEMENTE);
let geradorDeTeste : GeradorAleatorio = new GeradorCongruencial(SEMENTE_DE_TESTE);
// Etapa 1: confere se as suas implementações respeitam os contratos.
// O resultado aparece no CONSOLE do navegador (F12).
console.log("=== Verificação das implementações ===");
const verificador = new Verificador(
  formatador, compra, ordemDaVez, ordenacao, geradorDeTeste,
);
for (const linha of verificador.executar()) {
  if (linha.startsWith("[ERRO]")) {
    console.error(linha);
  } else {
    console.log(linha);
  }
}

mostrarPagina();

function mostrarPagina(): void {
  const semente = document.getElementById("semente");
  if (semente !== null) {
    semente.textContent = `· semente ${SEMENTE}`;
  }
  ligarControlesDeSemente(SEMENTE);

  if (!verificador.todasPassaram()) {
    const aviso = document.getElementById("aviso");
    if (aviso !== null) {
      aviso.hidden = false;
      aviso.textContent =
        "Alguma implementação não passou na verificação. " +
        "Abra o console do navegador (F12) e corrija os itens marcados com [ERRO].";
    }
    return;
  }

  // Etapa 2: a partida só conhece os contratos (as interfaces).
  const baralho = new Baralho();
  baralho.embaralhar(gerador);
  baralho.empilharEm(compra);

  const jogadores: Jogador[] = [
    new Jogador("Ana", 15),
    new Jogador("Bruno", 17),
    new Jogador("Carla", 18),
    new Jogador("Diego", 16),
  ];

  const partida = new Partida(jogadores, compra, descarte, ordemDaVez, ordenacao);
  const resultado = partida.jogar();

  const mesa = document.getElementById("mesa");
  if (mesa !== null) {
    mesa.hidden = false;
  }
  new MesaGrafica(resultado, formatador).iniciar();
}
