// Troca os <i data-lucide="..."> por SVG. Precisa ser chamado depois de criar ícones novos na tela
export function renderizarIcones() {
    if (window.lucide) window.lucide.createIcons()
}
