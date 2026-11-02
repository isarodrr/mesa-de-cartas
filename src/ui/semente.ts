// A semente da partida vem do endereço da página (?semente=123).
// Sem parâmetro, ou com um valor inválido, vale a semente padrão.
export const SEMENTE_PADRAO = 42;
const SEMENTE_MAXIMA = 2147483646;

export function lerSemente(): number {
  const texto = new URLSearchParams(window.location.search).get("semente");
  if (texto === null) {
    return SEMENTE_PADRAO;
  }
  const valor = Number(texto);
  const valida = Number.isInteger(valor) && valor >= 1 && valor <= SEMENTE_MAXIMA;
  return valida ? valor : SEMENTE_PADRAO;
}

// Recarrega a página com outra semente: tudo é criado do zero.
function jogarComSemente(semente: number): void {
  const endereco = new URL(window.location.href);
  endereco.searchParams.set("semente", String(semente));
  window.location.href = endereco.toString();
}

export function ligarControlesDeSemente(atual: number): void {
  const campo = document.getElementById("campo-semente");
  const jogar = document.getElementById("btn-semente");
  const sorteio = document.getElementById("btn-aleatoria");
  const padrao = document.getElementById("btn-padrao");
  if (
    !(campo instanceof HTMLInputElement) ||
    jogar === null || sorteio === null || padrao === null
  ) {
    return;
  }
  campo.value = String(atual);
  campo.max = String(SEMENTE_MAXIMA);

  const aplicar = (): void => {
    const valor = Number(campo.value);
    if (Number.isInteger(valor) && valor >= 1 && valor <= SEMENTE_MAXIMA) {
      jogarComSemente(valor);
    } else {
      campo.setCustomValidity(`Use um inteiro de 1 a ${SEMENTE_MAXIMA}.`);
      campo.reportValidity();
      campo.setCustomValidity("");
    }
  };

  jogar.addEventListener("click", aplicar);
  campo.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      aplicar();
    }
  });
  sorteio.addEventListener("click", () =>
    jogarComSemente(1 + Math.floor(Math.random() * SEMENTE_MAXIMA)),
  );
  padrao.addEventListener("click", () => jogarComSemente(SEMENTE_PADRAO));
}
