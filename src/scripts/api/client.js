// Endereço do backend (Express). Troque aqui se a porta ou o host mudarem
export const API_URL = "http://localhost:3000"

// Faz a requisição e já devolve o JSON. Em caso de erro, lança uma mensagem legível
export async function requisicao(caminho, metodo = "GET", corpo) {
    let opcoes = {
        method: metodo,
        headers: { "Accept": "application/json" }
    }

    if (corpo !== undefined) {
        opcoes.headers["Content-Type"] = "application/json"
        opcoes.body = JSON.stringify(corpo)
    }

    let resp

    try {
        resp = await fetch(`${API_URL}${caminho}`, opcoes)
    } catch (error) {
        throw new Error(`Não foi possível conectar à API em ${API_URL}. Verifique se o backend está ativo.`)
    }

    let dados = await lerResposta(resp)

    if (!resp.ok) {
        throw new Error(dados?.error || dados?.message || `A requisição falhou (HTTP ${resp.status}).`)
    }

    return dados
}

// A API pode responder sem corpo ou com texto puro, então não dá pra chamar resp.json() direto
async function lerResposta(resp) {
    let texto = await resp.text()

    if (!texto) return null

    try {
        return JSON.parse(texto)
    } catch (error) {
        return { message: texto }
    }
}
