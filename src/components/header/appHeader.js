import { menu } from "../../scripts/data/menu.js"
import { renderizarIcones } from "../../scripts/ui/icones.js"

// Raiz do projeto, descoberta a partir deste arquivo (src/components/header/)
// Assim os links funcionam em qualquer página, não importa a profundidade da pasta
const RAIZ = new URL("../../../", import.meta.url)

// Uso: <app-header active="equipes"></app-header>
// O valor de active é o id do link no menu (src/scripts/data/menu.js)
class AppHeader extends HTMLElement {

    connectedCallback() {
        let ativo = this.getAttribute("active")

        this.classList.add("site-header")
        this.setAttribute("role", "banner")

        this.innerHTML = `
            <a class="brand" href="${RAIZ}index.html" aria-label="Semana Midiática — início">
                <span class="brand-mark"><i data-lucide="trophy"></i></span>
                <span class="brand-copy">
                    <strong>Semana Midiática</strong>
                    <small>ETEC · Painel de competição</small>
                </span>
            </a>

            <nav class="main-nav" aria-label="Navegação principal">
                ${menu.map(link => this.gerarLink(link, ativo)).join("")}
            </nav>

            <div class="header-end">
                <span class="environment-dot"></span>
                <span>Administração</span>
            </div>

            <button class="mobile-menu-button icon-button" type="button" aria-label="Abrir menu" aria-expanded="false">
                <i data-lucide="menu"></i>
            </button>
        `

        this.querySelector(".mobile-menu-button").addEventListener("click", () => this.alternarMenu())
        renderizarIcones()
    }

    gerarLink(link, ativo) {
        let classe = link.id === ativo ? "nav-link is-active" : "nav-link"

        return `
            <a class="${classe}" href="${RAIZ}${link.caminho}">
                <i data-lucide="${link.icone}"></i><span>${link.texto}</span>
            </a>
        `
    }

    // Só aparece em telas pequenas
    alternarMenu() {
        let botao = this.querySelector(".mobile-menu-button")
        let aberto = this.querySelector(".main-nav").classList.toggle("is-open")

        botao.setAttribute("aria-expanded", String(aberto))
        botao.innerHTML = `<i data-lucide="${aberto ? "x" : "menu"}"></i>`
        renderizarIcones()
    }
}

customElements.define("app-header", AppHeader)
