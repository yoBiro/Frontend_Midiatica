import { cadastrarEquipe } from "../../scripts/api/equipes.js"
import { mostrarFeedback } from "../../scripts/ui/feedback.js"

const form = document.querySelector("#createTeamForm")
const inputNome = document.querySelector("#teamName")
const inputEscola = document.querySelector("#schoolName")
const feedback = document.querySelector("#teamFormFeedback")

form.addEventListener("submit", enviarEquipe)

async function enviarEquipe(event) {
    event.preventDefault()

    let name = inputNome.value.trim()
    let school = inputEscola.value.trim()

    if (!name || !school) {
        return mostrarFeedback(feedback, "Preencha o nome da equipe e a escola.", "error")
    }

    if (name.length > 100 || school.length > 150) {
        return mostrarFeedback(feedback, "Confira os limites de caracteres do nome e da escola.", "error")
    }

    let botao = form.querySelector('button[type="submit"]')
    botao.disabled = true
    mostrarFeedback(feedback, "Cadastrando equipe…")

    try {
        // O ID e a pontuação inicial são definidos pelo backend
        let equipe = await cadastrarEquipe({ name, school })
        let id = equipe?.id ? ` (ID #${equipe.id})` : ""

        mostrarFeedback(feedback, `Equipe cadastrada com sucesso${id}.`, "success")
        form.reset()
    } catch (error) {
        mostrarFeedback(feedback, error.message, "error")
    } finally {
        botao.disabled = false
    }
}
