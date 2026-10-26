export function formatarPontos(valor) {
    let numero = Number(valor)

    if (!Number.isFinite(numero)) return "0"

    return new Intl.NumberFormat("pt-BR").format(numero)
}

// "Equipe Fênix" -> "EF"
export function gerarIniciais(nome) {
    let palavras = String(nome || "").trim().split(/\s+/).slice(0, 2)
    let iniciais = palavras.map(palavra => palavra[0] || "").join("").toUpperCase()

    return iniciais || "?"
}
