import { buscarEquipes } from "../../scripts/api/equipes.js"
import { criarCompeticao, buscarStatus, iniciarCompeticao, finalizarCompeticao } from "../../scripts/api/competicao.js"
import { buscarCompeticaoAtiva, salvarCompeticaoAtiva } from "../../scripts/utils/storage.js"
import { formatarPontos } from "../../scripts/utils/format.js"
import { ordenarPorPontos, pontosDe } from "../../scripts/utils/ranking.js"
import { gerarHtml, gerarCelula, gerarCelulaEquipe, gerarLinhaMensagem } from "../../scripts/ui/generateHtml.js"
import { mostrarFeedback } from "../../scripts/ui/feedback.js"
import { mostrarStatus } from "../../scripts/ui/status.js"

const formSelecionar = document.querySelector("#selectCompetitionForm")
const inputId = document.querySelector("#competitionId")
const badgeStatus = document.querySelector("#competitionStatus")
const botaoCriar = document.querySelector("#createCompetitionButton")
const botaoIniciar = document.querySelector("#startCompetitionButton")
const botaoFinalizar = document.querySelector("#finishCompetitionButton")
const feedback = document.querySelector("#competitionFeedback")

const tabelaEquipes = document.querySelector("#recentTeamsTable")
const feedbackResumo = document.querySelector("#dashboardFeedback")

// ---------- Competição ----------

async function carregarStatus() {
    let id = buscarCompeticaoAtiva()

    if (!id) {
        mostrarStatus(badgeStatus, "NONE")
        atualizarBotoes(null)
        return
    }

    try {
        let dados = await buscarStatus(id)

        mostrarStatus(badgeStatus, dados?.status)
        atualizarBotoes(dados?.status)
        mostrarFeedback(feedback, `Competição #${id} selecionada.`, "success")
    } catch (error) {
        mostrarStatus(badgeStatus, "UNAVAILABLE")
        atualizarBotoes(null)
        mostrarFeedback(feedback, error.message, "error")
    }
}

// Só dá pra iniciar quem não começou e só dá pra finalizar quem está em andamento
function atualizarBotoes(status) {
    botaoIniciar.disabled = status !== "NOT_STARTED"
    botaoFinalizar.disabled = status !== "IN_PROGRESS"
}

async function selecionarCompeticao(event) {
    event.preventDefault()

    let id = inputId.value.trim()

    if (!/^\d+$/.test(id) || Number(id) <= 0) {
        return mostrarFeedback(feedback, "Informe um ID de competição válido.", "error")
    }

    salvarCompeticaoAtiva(id)
    await carregarStatus()
}

async function novaCompeticao() {
    botaoCriar.disabled = true
    mostrarFeedback(feedback, "Criando competição…")

    try {
        let dados = await criarCompeticao()

        if (dados?.id === undefined || dados?.id === null) {
            throw new Error("A API criou a competição, mas não retornou o ID esperado.")
        }

        inputId.value = dados.id
        salvarCompeticaoAtiva(dados.id)
        await carregarStatus()
        mostrarFeedback(feedback, `Competição #${dados.id} criada e selecionada.`, "success")
    } catch (error) {
        mostrarFeedback(feedback, error.message, "error")
    } finally {
        botaoCriar.disabled = false
    }
}

// Serve para iniciar e finalizar: muda o status e recarrega a tela
async function mudarStatus(acao, mensagemSucesso) {
    let id = buscarCompeticaoAtiva()

    if (!id) {
        return mostrarFeedback(feedback, "Selecione ou crie uma competição primeiro.", "error")
    }

    atualizarBotoes(null)

    try {
        await acao(id)
        await carregarStatus()
        mostrarFeedback(feedback, mensagemSucesso, "success")
    } catch (error) {
        await carregarStatus()
        mostrarFeedback(feedback, error.message, "error")
    }
}

function finalizar() {
    let confirmou = confirm("Deseja realmente finalizar esta competição? A pontuação deixará de aceitar novos registros.")

    if (confirmou) mudarStatus(finalizarCompeticao, "Competição finalizada.")
}

// ---------- Resumo das equipes ----------

function gerarLinhaResumo(equipe) {
    let tr = gerarHtml("tr")

    let link = gerarHtml("a", "text-link", "Gerenciar")
    link.href = "src/pages/equipes/equipes.html"
    let tdAcao = gerarHtml("td")
    tdAcao.appendChild(link)

    tr.append(
        gerarCelulaEquipe(equipe),
        gerarCelula(equipe.school),
        gerarCelula(formatarPontos(equipe.total_points), "score-value"),
        tdAcao
    )

    return tr
}

function mostrarMetricas(equipes) {
    let escolas = new Set(
        equipes.map(equipe => String(equipe.school || "").trim().toLowerCase()).filter(Boolean)
    )
    let maiorPontuacao = Math.max(0, ...equipes.map(pontosDe))

    document.querySelector("#teamCount").textContent = formatarPontos(equipes.length)
    document.querySelector("#schoolCount").textContent = formatarPontos(escolas.size)
    document.querySelector("#highestScore").textContent = formatarPontos(maiorPontuacao)
}

function desenharTabela(equipes) {
    tabelaEquipes.replaceChildren()

    if (equipes.length === 0) {
        let link = gerarHtml("a", "text-link", "Cadastrar a primeira")
        link.href = "src/pages/cadastro/cadastro.html"

        tabelaEquipes.append(gerarLinhaMensagem(4, "Nenhuma equipe cadastrada. ", link, "."))
        return
    }

    equipes.forEach(equipe => tabelaEquipes.append(gerarLinhaResumo(equipe)))
}

async function carregarResumo() {
    try {
        let equipes = await buscarEquipes()

        mostrarMetricas(equipes)
        desenharTabela(ordenarPorPontos(equipes).slice(0, 5))
    } catch (error) {
        tabelaEquipes.replaceChildren(gerarLinhaMensagem(4, "Não foi possível carregar as equipes."))
        mostrarFeedback(feedbackResumo, error.message, "error")
    }
}

// ---------- Início ----------

formSelecionar.addEventListener("submit", selecionarCompeticao)
botaoCriar.addEventListener("click", novaCompeticao)
botaoIniciar.addEventListener("click", () => mudarStatus(iniciarCompeticao, "Competição iniciada."))
botaoFinalizar.addEventListener("click", finalizar)

inputId.value = buscarCompeticaoAtiva()
carregarStatus()
carregarResumo()
