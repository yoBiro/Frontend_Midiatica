import { formatarPontos, gerarIniciais } from "../utils/format.js"

export function gerarHtml(textoTag, classe = "", texto = "") {
    let novaTag = document.createElement(textoTag)

    if (classe) novaTag.className = classe
    if (texto) novaTag.textContent = texto

    return novaTag
}

export function gerarCelula(texto, classe = "") {
    return gerarHtml("td", classe, texto || "—")
}

// Avatar com iniciais + nome + ID. Usada em todas as tabelas de equipes
export function gerarCelulaEquipe(equipe) {
    let td = gerarHtml("td")
    let wrapper = gerarHtml("div", "team-cell")
    let copy = gerarHtml("span", "team-cell-copy")

    let avatar = gerarHtml("span", "team-avatar", gerarIniciais(equipe.name))
    let nome = gerarHtml("strong", "", equipe.name || "Equipe sem nome")
    let id = gerarHtml("small", "", `ID #${equipe.id}`)

    copy.append(nome, id)
    wrapper.append(avatar, copy)
    td.appendChild(wrapper)

    return td
}

// Linha ocupando a tabela inteira, para "Carregando...", "Nenhuma equipe..." etc.
// Aceita texto e elementos (ex.: um link) como conteúdo
export function gerarLinhaMensagem(colunas, ...conteudo) {
    let tr = gerarHtml("tr")
    let td = gerarHtml("td", "empty-cell")

    td.colSpan = colunas
    td.append(...conteudo)
    tr.appendChild(td)

    return tr
}

// Linha das tabelas de ranking (posição, equipe, escola, pontos)
export function gerarLinhaRanking(equipe, posicao) {
    let tr = gerarHtml("tr")

    let classePosicao = posicao <= 3 ? `rank-number rank-${posicao}` : "rank-number"
    let tdPosicao = gerarHtml("td")
    tdPosicao.appendChild(gerarHtml("span", classePosicao, posicao))

    tr.append(
        tdPosicao,
        gerarCelulaEquipe(equipe),
        gerarCelula(equipe.school),
        gerarCelula(`${formatarPontos(equipe.total_points)} pts`, "score-value")
    )

    return tr
}
