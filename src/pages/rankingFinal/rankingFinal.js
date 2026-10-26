import { buscarEquipes } from "../../scripts/api/equipes.js"
import { formatarPontos } from "../../scripts/utils/format.js"
import { ordenarPorPontos, gerarPosicoes } from "../../scripts/utils/ranking.js"
import { gerarHtml, gerarLinhaMensagem, gerarLinhaRanking } from "../../scripts/ui/generateHtml.js"
import { mostrarFeedback } from "../../scripts/ui/feedback.js"
import { renderizarIcones } from "../../scripts/ui/icones.js"
import { atualizarBadgeStatus } from "../../scripts/ui/status.js"

const tabela = document.querySelector("#finalRankingTableBody")
const podio = document.querySelector("#podiumGrid")
const feedback = document.querySelector("#finalRankingFeedback")
const badgeStatus = document.querySelector("#finalCompetitionStatus")

const LUGARES = {
    1: { titulo: "1º LUGAR", icone: "crown", classe: "podium-first" },
    2: { titulo: "2º LUGAR", icone: "medal", classe: "podium-second" },
    3: { titulo: "3º LUGAR", icone: "medal", classe: "podium-third" }
}

function gerarCardPodio(equipe, posicao) {
    let lugar = LUGARES[posicao]
    let card = gerarHtml("article", `podium-card ${lugar.classe}`)

    let medalha = gerarHtml("span", "podium-medal")
    medalha.innerHTML = `<i data-lucide="${lugar.icone}"></i>`

    let escola = equipe?.school || (equipe ? "Escola não informada" : "Sem equipe nesta posição")
    let pontos = equipe ? `${formatarPontos(equipe.total_points)} pts` : "—"

    card.append(
        gerarHtml("span", "podium-place", lugar.titulo),
        medalha,
        gerarHtml("h2", "", equipe?.name || "—"),
        gerarHtml("p", "", escola),
        gerarHtml("strong", "", pontos)
    )

    return card
}

// A ordem 2º, 1º, 3º deixa o primeiro colocado no centro em telas largas
function desenharPodio(equipes) {
    podio.replaceChildren(
        gerarCardPodio(equipes[1], 2),
        gerarCardPodio(equipes[0], 1),
        gerarCardPodio(equipes[2], 3)
    )
}

function desenharTabela(equipes) {
    let posicoes = gerarPosicoes(equipes)

    tabela.replaceChildren()

    if (equipes.length === 0) {
        tabela.append(gerarLinhaMensagem(4, "Não há equipes cadastradas."))
        return
    }

    equipes.forEach((equipe, i) => tabela.append(gerarLinhaRanking(equipe, posicoes[i])))
}

async function carregarResultado() {
    try {
        let equipes = ordenarPorPontos(await buscarEquipes())

        desenharPodio(equipes)
        desenharTabela(equipes)
        mostrarFeedback(feedback)
        renderizarIcones()

        let status = await atualizarBadgeStatus(badgeStatus)

        if (status === "NOT_STARTED" || status === "IN_PROGRESS") {
            mostrarFeedback(feedback, "A competição ainda não foi finalizada. A classificação exibida é provisória.", "error")
        }
    } catch (error) {
        mostrarFeedback(feedback, error.message, "error")
    }
}

// ---------- Início ----------

document.querySelector("#refreshFinalRankingButton").addEventListener("click", carregarResultado)

// Mostra os três cards vazios enquanto a API não responde
desenharPodio([])
renderizarIcones()
carregarResultado()
