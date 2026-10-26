export function pontosDe(equipe) {
    return Number(equipe.total_points) || 0
}

// Devolve uma cópia ordenada, da maior para a menor pontuação
export function ordenarPorPontos(equipes) {
    return [...equipes].sort((a, b) => pontosDe(b) - pontosDe(a))
}

// Recebe as equipes já ordenadas. Empatadas ficam com a mesma posição (1, 1, 3...)
export function gerarPosicoes(equipes) {
    let posicoes = []

    for (let i = 0; i < equipes.length; i++) {
        let empatou = i > 0 && pontosDe(equipes[i]) === pontosDe(equipes[i - 1])
        posicoes.push(empatou ? posicoes[i - 1] : i + 1)
    }

    return posicoes
}
