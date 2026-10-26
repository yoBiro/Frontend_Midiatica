// Mostra uma mensagem abaixo do formulário. tipo: "success" ou "error" (vazio = neutro)
export function mostrarFeedback(elemento, mensagem = "", tipo = "") {
    elemento.textContent = mensagem
    elemento.classList.remove("is-error", "is-success")

    if (tipo) elemento.classList.add(`is-${tipo}`)
}
