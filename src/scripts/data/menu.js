// Links do menu. O "id" é o mesmo valor usado no atributo active do <app-header>
// "caminho" é sempre a partir da raiz do projeto
export const menu = [
    { id: "dashboard", texto: "Visão geral", icone: "layout-dashboard", caminho: "index.html" },
    { id: "cadastro", texto: "Cadastro", icone: "user-round-plus", caminho: "src/pages/cadastro/cadastro.html" },
    { id: "equipes", texto: "Equipes", icone: "users", caminho: "src/pages/equipes/equipes.html" },
    { id: "pontuacao", texto: "Pontuação", icone: "plus-circle", caminho: "src/pages/pontuacao/pontuacao.html" },
    { id: "rankingJogo", texto: "Ranking", icone: "chart-no-axes-combined", caminho: "src/pages/rankingJogo/rankingJogo.html" },
    { id: "rankingFinal", texto: "Resultado final", icone: "medal", caminho: "src/pages/rankingFinal/rankingFinal.html" }
]
