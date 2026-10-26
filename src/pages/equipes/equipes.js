import { buscarEquipes, atualizarEquipe, excluirEquipe } from "../../scripts/api/equipes.js"
import { formatarPontos } from "../../scripts/utils/format.js"
import { gerarHtml, gerarCelula, gerarCelulaEquipe, gerarLinhaMensagem } from "../../scripts/ui/generateHtml.js"
import { mostrarFeedback } from "../../scripts/ui/feedback.js"
import { renderizarIcones } from "../../scripts/ui/icones.js"

const tabela = document.querySelector("#teamsTableBody")
const busca = document.querySelector("#teamSearch")
const contador = document.querySelector("#teamsCountLabel")
const feedback = document.querySelector("#teamsFeedback")

const modalEditar = document.querySelector("#editTeamDialog")
const formEditar = document.querySelector("#editTeamForm")
const inputEditarId = document.querySelector("#editTeamId")
const inputEditarNome = document.querySelector("#editTeamName")
const inputEditarEscola = document.querySelector("#editTeamSchool")
const feedbackEditar = document.querySelector("#editTeamFeedback")

const modalExcluir = document.querySelector("#deleteTeamDialog")
const textoExcluir = document.querySelector("#deleteTeamMessage")
const botaoConfirmarExcluir = document.querySelector("#confirmDeleteTeam")
const feedbackExcluir = document.querySelector("#deleteTeamFeedback")

let equipes = []
let idParaExcluir = null

// ---------- Lista ----------

async function carregarEquipes() {
    tabela.replaceChildren(gerarLinhaMensagem(4, "Carregando equipes…"))

    try {
        equipes = await buscarEquipes()
        desenharTabela()
        mostrarFeedback(feedback)
    } catch (error) {
        tabela.replaceChildren(gerarLinhaMensagem(4, "Não foi possível carregar as equipes."))
        mostrarFeedback(feedback, error.message, "error")
    }
}

// A busca procura no nome, na escola e no ID
function filtrarEquipes() {
    let termo = busca.value.trim().toLocaleLowerCase("pt-BR")

    return equipes.filter(equipe => {
        let texto = `${equipe.name || ""} ${equipe.school || ""} ${equipe.id || ""}`
        return texto.toLocaleLowerCase("pt-BR").includes(termo)
    })
}

function desenharTabela() {
    let filtradas = filtrarEquipes()
    let buscando = busca.value.trim() !== ""

    let palavra = filtradas.length === 1 ? "equipe" : "equipes"
    contador.textContent = `${filtradas.length} ${palavra} ${buscando ? "encontradas" : "cadastradas"}`

    tabela.replaceChildren()

    if (filtradas.length === 0) {
        let texto = buscando ? "Nenhuma equipe corresponde à busca." : "Nenhuma equipe cadastrada ainda."
        tabela.append(gerarLinhaMensagem(4, texto))
        return
    }

    filtradas.forEach(equipe => tabela.append(gerarLinhaEquipe(equipe)))
    renderizarIcones()
}

function gerarLinhaEquipe(equipe) {
    let tr = gerarHtml("tr")

    let acoes = gerarHtml("div", "row-actions")
    acoes.append(
        gerarBotaoIcone("pencil", `Editar ${equipe.name}`, "icon-button", () => abrirEdicao(equipe)),
        gerarBotaoIcone("trash-2", `Excluir ${equipe.name}`, "icon-button danger", () => abrirExclusao(equipe))
    )
    let tdAcoes = gerarHtml("td")
    tdAcoes.appendChild(acoes)

    tr.append(
        gerarCelulaEquipe(equipe),
        gerarCelula(equipe.school),
        gerarCelula(formatarPontos(equipe.total_points), "score-value"),
        tdAcoes
    )

    return tr
}

function gerarBotaoIcone(icone, descricao, classe, aoClicar) {
    let botao = gerarHtml("button", classe)

    botao.type = "button"
    botao.title = descricao
    botao.setAttribute("aria-label", descricao)
    botao.innerHTML = `<i data-lucide="${icone}"></i>`
    botao.addEventListener("click", aoClicar)

    return botao
}

// ---------- Editar ----------

function abrirEdicao(equipe) {
    inputEditarId.value = equipe.id
    inputEditarNome.value = equipe.name || ""
    inputEditarEscola.value = equipe.school || ""
    mostrarFeedback(feedbackEditar)
    modalEditar.showModal()
}

async function salvarEdicao(event) {
    event.preventDefault()

    let name = inputEditarNome.value.trim()
    let school = inputEditarEscola.value.trim()

    if (!name || !school) {
        return mostrarFeedback(feedbackEditar, "Nome e escola são obrigatórios.", "error")
    }

    let botao = formEditar.querySelector('button[type="submit"]')
    botao.disabled = true

    try {
        await atualizarEquipe(inputEditarId.value, { name, school })
        modalEditar.close()
        await carregarEquipes()
        mostrarFeedback(feedback, "Equipe atualizada com sucesso.", "success")
    } catch (error) {
        mostrarFeedback(feedbackEditar, error.message, "error")
    } finally {
        botao.disabled = false
    }
}

// ---------- Excluir ----------

function abrirExclusao(equipe) {
    idParaExcluir = equipe.id
    textoExcluir.textContent = `Você está prestes a excluir “${equipe.name}” (ID #${equipe.id}). Essa ação não pode ser desfeita.`
    mostrarFeedback(feedbackExcluir)
    modalExcluir.showModal()
}

async function confirmarExclusao() {
    if (idParaExcluir === null) return

    botaoConfirmarExcluir.disabled = true

    try {
        await excluirEquipe(idParaExcluir)
        idParaExcluir = null
        modalExcluir.close()
        await carregarEquipes()
        mostrarFeedback(feedback, "Equipe excluída com sucesso.", "success")
    } catch (error) {
        mostrarFeedback(feedbackExcluir, error.message, "error")
    } finally {
        botaoConfirmarExcluir.disabled = false
    }
}

// ---------- Início ----------

busca.addEventListener("input", desenharTabela)
document.querySelector("#refreshTeamsButton").addEventListener("click", carregarEquipes)
formEditar.addEventListener("submit", salvarEdicao)
botaoConfirmarExcluir.addEventListener("click", confirmarExclusao)

document.querySelectorAll("[data-close-edit]").forEach(botao => {
    botao.addEventListener("click", () => modalEditar.close())
})
document.querySelectorAll("[data-close-delete]").forEach(botao => {
    botao.addEventListener("click", () => modalExcluir.close())
})

carregarEquipes()
