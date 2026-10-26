import { requisicao } from "./client.js"

export async function buscarEquipes() {
    let dados = await requisicao("/teams")
    return Array.isArray(dados) ? dados : []
}

export function cadastrarEquipe(equipe) {
    return requisicao("/teams", "POST", equipe)
}

export function atualizarEquipe(id, equipe) {
    return requisicao(`/teams/${id}`, "PUT", equipe)
}

export function excluirEquipe(id) {
    return requisicao(`/teams/${id}`, "DELETE")
}
