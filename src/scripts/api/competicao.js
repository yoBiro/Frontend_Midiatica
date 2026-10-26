import { requisicao } from "./client.js"

export function criarCompeticao() {
    return requisicao("/competition", "POST")
}

export function buscarStatus(id) {
    return requisicao(`/competition/${id}/status`)
}

export function iniciarCompeticao(id) {
    return requisicao(`/competition/${id}/start`, "POST")
}

export function finalizarCompeticao(id) {
    return requisicao(`/competition/${id}/finish`, "POST")
}

// Rota com o id da competição e da equipe separados (o backend precisa ter essa rota)
export function adicionarPontos(idCompeticao, idEquipe, pontos) {
    return requisicao(
        `/competition/${idCompeticao}/teams/${idEquipe}/points`,
        "PATCH",
        { partial_points: pontos }
    )
}
