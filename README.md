# 🏆 Semana Midiática — client

*Painel administrativo da Semana Midiática da ETEC: cadastro de equipes, controle da competição, pontuação e ranking.*

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=plastic&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=plastic&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=plastic&logo=javascript&logoColor=black)

---

## 📖 Sobre o projeto

Front-end em **HTML, CSS e JavaScript puro** (ES Modules) que consome a API Express/MySQL do projeto. Não precisa de build nem de `npm install`.

## 📁 Estrutura do projeto

```
client/
├── index.html                    # Visão geral (controle da competição)
├── src/
│   ├── main.js                   # Ponto de entrada — registra os componentes
│   ├── components/
│   │   └── header/               # <app-header active="..."> (menu de todas as páginas)
│   ├── pages/
│   │   ├── dashboard/            # JS e CSS da Visão geral
│   │   ├── cadastro/             # Cadastrar equipe
│   │   ├── equipes/              # Listar, buscar, editar e excluir
│   │   ├── pontuacao/            # Registrar pontos
│   │   ├── rankingJogo/          # Ranking dinâmico (atualiza a cada 10s)
│   │   └── rankingFinal/         # Pódio e classificação final
│   ├── scripts/
│   │   ├── api/                  # client.js (fetch), equipes.js, competicao.js
│   │   ├── data/                 # status.js (textos/cores) e menu.js (links)
│   │   ├── ui/                   # generateHtml.js, feedback.js, status.js, icones.js
│   │   └── utils/                # format.js, ranking.js, storage.js
│   └── styles/
│       ├── globals.css           # Importa todos os outros + base (reset)
│       ├── tokens.css            # Cores, raios, sombras
│       └── layout / header / buttons / forms / cards / tables / modal .css
└── README.md
```

Cada página fica na sua pasta com `.html`, `.js` e (quando precisa) `.css`.

## ▶️ Como executar localmente

1. Suba o backend Express na porta `3000`.
2. Sirva esta pasta por HTTP, por exemplo com a extensão **Live Server** do VS Code, ou `npx serve .`
3. Abra o `index.html`, crie uma competição (ou digite o ID de uma existente) e selecione. O ID fica salvo no `localStorage`.

> ⚠️ Como o projeto usa `type="module"`, **não abre pelo `file://`** (duplo clique no HTML). Precisa estar servido por HTTP.

> ⚠️ O front roda em outra porta (ex.: `5500`), então o backend precisa liberar **CORS**.

A URL do backend fica em `src/scripts/api/client.js` (`API_URL`).

## 🔌 Rotas da API usadas

| Método | Rota | Onde é usada |
|--------|------|--------------|
| `POST` | `/competition` | Nova competição |
| `GET` | `/competition/:id/status` | Status (Visão geral e rankings) |
| `POST` | `/competition/:id/start` | Iniciar |
| `POST` | `/competition/:id/finish` | Finalizar |
| `GET` | `/teams` | Listagens e rankings |
| `POST` | `/teams` | Cadastro (`{ name, school }`) |
| `PUT` | `/teams/:id` | Edição (`{ name, school }`) |
| `DELETE` | `/teams/:id` | Exclusão |
| `PATCH` | `/competition/:competitionId/teams/:teamId/points` | Pontuação (`{ partial_points }`) |

As chamadas ficam todas em `src/scripts/api/`. Se alguma rota do backend for diferente, é só ajustar ali.

## 📝 Observações

- Fonte (Geist) e ícones (Lucide) vêm de CDN, então precisam de internet.
- O ranking mostra o `total_points` retornado por `GET /teams`. Se o backend guarda os pontos só na tabela `teams`, o total é compartilhado entre competições.
- Não há login, pois a API não tem essa rota.
- A validação do front é básica. As regras de verdade (ex.: só pontuar com a competição em andamento) ficam no backend.
