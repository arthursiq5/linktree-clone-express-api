const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const LinkController = require('./controller/LinkController');
const UserController = require('./controller/UserController');

const app = express();

// Porta onde o servidor vai rodar
const PORT = 8080;

// Abrir controller
const database = new sqlite3.Database('./database.db');
const linkController = new LinkController(database);
const userController = new UserController(database);


// permitindo receber dados via json
app.use(bodyParser.json());

// Rota que redireciona
app.get('/rotas/:rota', (req, res) => {
    const rota = req.params.rota;

    // Usar o método da classe LinkController para buscar a rota
    linkController.getLinkByRoute(rota, (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Erro no servidor');
            return;
        }

        if (!row) {
            res.status(404).send('Rota não encontrada');
            return;
        }

        res.redirect(row.url);
    });
});

app.post('/rotas', (req, res) => {
    const { rota, nome, url } = req.body;

    if (!rota || !url) {
        return res.status(400).send('Campos obrigatórios: rota e url');
    }

    // Usar o método da classe LinkController para adicionar uma nova rota
    linkController.add(rota, nome, url, (err, result) => {
        if (err) {
            console.error('Erro ao inserir no banco de dados:', err.message);
            res.status(500).send('Erro ao inserir no banco de dados');
            return;
        }

        res.send(`Rota adicionada com sucesso! ID: ${result.id}`);
    });
});

// listando todas as rotas
app.get('/rotas', (req, res) => {
    // Usar o método da classe LinkController para listar todas as rotas
    linkController.index((err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Erro no servidor');
            return;
        }

        res.json(rows);
    });
});

// Rota para adicionar um novo usuário
app.post('/adicionar-usuario', (req, res) => {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
        return res.status(400).send('Campos obrigatórios: nome, email e senha');
    }

    userController.add(nome, email, senha, (err, result) => {
        if (err) {
            console.error('Erro ao adicionar usuário:', err.message);
            return res.status(500).send('Erro ao adicionar usuário');
        }

        res.send(`Usuário adicionado com sucesso! ID: ${result.id}`);
    });
});

// Rota para listar todos os usuários
app.get('/usuarios', (req, res) => {
    userController.index((err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Erro no servidor');
            return;
        }

        res.json(rows);
    });
});

// Rota para verificar login (autenticar usuário)
app.post('/login', (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).send('Campos obrigatórios: email e senha');
    }

    userController.verifyUser(email, senha, (err, user) => {
        if (err) {
            console.error('Erro ao verificar usuário:', err.message);
            return res.status(500).send('Erro ao verificar usuário');
        }

        if (!user) {
            return res.status(401).send('Credenciais inválidas');
        }

        res.send(`Login bem-sucedido! Bem-vindo, ${user.nome}`);
    });
});

app.get('/usuarios/:userId/rotas/:rota', (req, res) => {
    const { userId, rota } = req.params;

    linkController.getLinkByUserAndRoute(userId, rota, (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Erro no servidor');
            return;
        }

        if (!row) {
            res.status(404).send('Rota não encontrada para este usuário');
            return;
        }

        res.redirect(row.url);
    });
});

app.get('/usuarios/:userId/rotas', (req, res) => {
    const { userId } = req.params;

    linkController.getAllLinksByUser(userId, (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Erro no servidor');
            return;
        }

        if (rows.length === 0) {
            res.status(404).send('Nenhuma rota encontrada para este usuário');
            return;
        }

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
