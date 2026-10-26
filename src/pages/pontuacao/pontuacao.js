import { buscarEquipes } from "../../scripts/api/equipes.js"
import { adicionarPontos } from "../../scripts/api/competicao.js"
import { buscarCompeticaoAtiva } from "../../scripts/utils/storage.js"
import { formatarPontos } from "../../scripts/utils/format.js"
import { gerarHtml } from "../../scripts/ui/generateHtml.js"
import { mostrarFeedback } from "../../scripts/ui/feedback.js"

const form = document.querySelector("#pointsForm")
const selectEquipe = document.querySelector("#pointsTeam")
const inputPontos = document.querySelector("#partialPoints")
const feedback = document.querySelector("#pointsFeedback")

const competicaoId = buscarCompeticaoAtiva()

function gerarOpcao(valor, texto) {
    let option = gerarHtml("option", "", texto)
    option.value = valor

    return option
}

async function carregarEquipes() {
    try {
        let equipes = await buscarEquipes()
        let primeira = equipes.length ? "Selecione uma equipe" : "Nenhuma equipe cadastrada"

        selectEquipe.replaceChildren(gerarOpcao("", primeira))

        equipes.forEach(equipe => {
            let escola = equipe.school || "Escola não informada"
            let texto = `${equipe.name} · ${escola} · ${formatarPontos(equipe.total_points)} pts`

            selectEquipe.append(gerarOpcao(equipe.id, texto))
        })
    } catch (error) {
        selectEquipe.replaceChildren(gerarOpcao("", "Falha ao carregar equipes"))
        mostrarFeedback(feedback, error.message, "error")
    }
}

async function registrarPontos(event) {
    event.preventDefault()

    let equipeId = selectEquipe.value
    let pontos = Number(inputPontos.value)

    if (!competicaoId) {
        return mostrarFeedback(feedback, "Selecione uma competição na página Visão geral antes de registrar pontos.", "error")
    }

    if (!equipeId) {
        return mostrarFeedback(feedback, "Selecione uma equipe.", "error")
    }

    if (!Number.isSafeInteger(pontos) || pontos <= 0) {
        return mostrarFeedback(feedback, "Informe um número inteiro de pontos maior que zero.", "error")
    }

    let botao = form.querySelector('button[type="submit"]')
    botao.disabled = true

    try {
        // A regra "só pontua com a competição em andamento" é validada pelo backend
        await adicionarPontos(competicaoId, equipeId, pontos)

        mostrarFeedback(feedback, `${formatarPontos(pontos)} pontos adicionados à equipe selecionada.`, "success")
        inputPontos.value = ""

        await carregarEquipes()
        selectEquipe.value = equipeId
    } catch (error) {
        mostrarFeedback(feedback, error.message, "error")
    } finally {
        botao.disabled = false
    }
}

// ---------- Início ----------

form.addEventListener("submit", registrarPontos)

document.querySelector("#activeCompetitionLabel").textContent =
    competicaoId ? `Competição #${competicaoId}` : "Nenhuma selecionada"

if (!competicaoId) {
    mostrarFeedback(feedback, "Nenhuma competição selecionada. Acesse Visão geral para criar ou selecionar uma competição.", "error")
}

carregarEquipes()
