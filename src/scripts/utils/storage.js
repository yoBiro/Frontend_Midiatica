const CHAVE = "midiatica.activeCompetitionId"

export function buscarCompeticaoAtiva() {
    return localStorage.getItem(CHAVE) || ""
}

export function salvarCompeticaoAtiva(id) {
    localStorage.setItem(CHAVE, String(id).trim())
}
