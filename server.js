const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// Porta onde o servidor vai rodar
const PORT = 8080;

// Conexão com banco de dados
const db = new sqlite3.Database('./database.db');

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

// Rota padrão
app.get('/', (req, res) => {
    res.send('Servidor rodando! Vá para /rotas/minha-rota para ser redirecionado.');
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
