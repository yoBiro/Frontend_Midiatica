import { buscarEquipes } from "../../scripts/api/equipes.js"
import { formatarPontos } from "../../scripts/utils/format.js"
import { ordenarPorPontos, gerarPosicoes } from "../../scripts/utils/ranking.js"
import { gerarLinhaMensagem, gerarLinhaRanking } from "../../scripts/ui/generateHtml.js"
import { mostrarFeedback } from "../../scripts/ui/feedback.js"
import { atualizarBadgeStatus } from "../../scripts/ui/status.js"

// A tela se atualiza sozinha a cada 10 segundos (sem precisar de WebSocket)
const INTERVALO = 10000

const tabela = document.querySelector("#rankingTableBody")
const feedback = document.querySelector("#rankingFeedback")
const badgeStatus = document.querySelector("#competitionStatusBadge")

function mostrarLider(lider) {
    let escola = lider?.school || (lider ? "Escola não informada" : "Cadastre equipes para gerar o ranking")

    document.querySelector("#leaderTeamName").textContent = lider?.name || "Nenhuma equipe"
    document.querySelector("#leaderSchoolName").textContent = escola
    document.querySelector("#leaderPoints").textContent = lider ? formatarPontos(lider.total_points) : "0"
}

function mostrarHorario() {
    let horario = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })

    document.querySelector("#rankingUpdatedAt").textContent = horario
    document.querySelector("#rankingLastUpdated").textContent = `Atualizado às ${horario}`
}

function desenharTabela(equipes) {
    let posicoes = gerarPosicoes(equipes)

    tabela.replaceChildren()

    if (equipes.length === 0) {
        tabela.append(gerarLinhaMensagem(4, "Ainda não há equipes para classificar."))
        return
    }

    equipes.forEach((equipe, i) => tabela.append(gerarLinhaRanking(equipe, posicoes[i])))
}

async function carregarRanking() {
    try {
        let equipes = ordenarPorPontos(await buscarEquipes())

        document.querySelector("#rankingTeamCount").textContent = formatarPontos(equipes.length)
        mostrarLider(equipes[0])
        desenharTabela(equipes)
        mostrarHorario()
        mostrarFeedback(feedback)
    } catch (error) {
        mostrarFeedback(feedback, error.message, "error")
    }

    await atualizarBadgeStatus(badgeStatus)
}

// ---------- Início ----------

document.querySelector("#refreshRankingButton").addEventListener("click", carregarRanking)

carregarRanking()
setInterval(carregarRanking, INTERVALO)
