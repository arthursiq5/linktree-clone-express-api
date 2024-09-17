const express = require('express');
const app = express();

// Porta onde o servidor vai rodar
const PORT = 8080;

// Rota que redireciona
app.get('/rotas/minha-rota', (req, res) => {
    res.redirect('https://www.google.com');
});

// Rota padrão
app.get('/', (req, res) => {
    res.send('Servidor rodando! Vá para /rotas/minha-rota para ser redirecionado.');
});

// Inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
