import { STATUS } from "../data/status.js"
import { buscarStatus } from "../api/competicao.js"
import { buscarCompeticaoAtiva } from "../utils/storage.js"
import { gerarHtml } from "./generateHtml.js"

// Pinta a badge com o texto e a cor do status. O prefixo vai antes do texto
export function mostrarStatus(badge, status, prefixo = "") {
    let info = STATUS[status] || STATUS.UNAVAILABLE

    badge.className = `status-pill ${info.classe}`
    badge.replaceChildren(gerarHtml("span", "status-dot"), `${prefixo}${info.texto}`)
}

// Consulta a API e atualiza a badge. Devolve o status (ou NONE / UNAVAILABLE)
export async function atualizarBadgeStatus(badge) {
    let id = buscarCompeticaoAtiva()

    if (!id) {
        mostrarStatus(badge, "NONE")
        return "NONE"
    }

    let prefixo = `Competição #${id} · `

    try {
        let dados = await buscarStatus(id)
        mostrarStatus(badge, dados?.status, prefixo)
        return dados?.status
    } catch (error) {
        mostrarStatus(badge, "UNAVAILABLE", prefixo)
        return "UNAVAILABLE"
    }
}
