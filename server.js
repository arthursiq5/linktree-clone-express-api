const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();

// Porta onde o servidor vai rodar
const PORT = 8080;

// Conexão com banco de dados
const db = new sqlite3.Database('./database.db');

// permitindo receber dados via json
app.use(bodyParser.json());

// Rota que redireciona
app.get('/rotas/:rota', (req, res) => {

    const rota = req.params.rota;

    db.get('SELECT url FROM links WHERE rota = ?', [rota], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Erro no servidor');
            return;
        }

        // Se a rota não for encontrada
        if (!row) {
            res.status(404).send('Rota não encontrada');
            return;
        }

        // Redireciona para a URL encontrada
        res.redirect(row.url);
    });
});

app.post('/rotas', (req, res) => {
    console.log(req.body)
    const { rota, nome, url } = req.body;

    if (!rota || !url) {
        return res.status(400).send('Campos obrigatórios: rota e url');
    }

    // Inserir os dados na tabela "links"
    const query = 'INSERT INTO links (rota, nome, url) VALUES (?, ?, ?)';
    db.run(query, [rota, nome, url], function (err) {
        if (err) {
            console.error('Erro ao inserir no banco de dados:', err.message);
            res.status(500).send('Erro ao inserir no banco de dados');
        } else {
            res.send(`Rota adicionada com sucesso! ID: ${this.lastID}`);
        }
    });
});

// listando todas as rotas
app.get('/rotas', (req, res) => {
    // Consulta todas as rotas no banco de dados
    db.all('SELECT * FROM links', (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Erro no servidor');
            return;
        }

        // Retorna todas as rotas como JSON
        res.json(rows);
    });
});

// Rota padrão
app.get('/', (req, res) => {
    res.send('Servidor rodando! Vá para /rotas/minha-rota para ser redirecionado.');
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
