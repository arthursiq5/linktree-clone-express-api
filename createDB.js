const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');
const bcrypt = require('bcrypt');

// Cria a tabela "links" se ela não existir
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rota TEXT NOT NULL,
        nome TEXT,
        url TEXT NOT NULL
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL
    )`)
    
    // Inserir dados de exemplo
    db.run(`INSERT INTO links (rota, nome, url) VALUES ('minha-rota', 'Minha Rota', 'https://www.google.com')`);
    db.run(`INSERT INTO usuarios (nome, email, senha) VALUES ('Teste Teste', 'teste@teste.com', '$2b$10$28njEtSUeCbmUuiQ36AhFOTkQADz6Fj/pGi7UlDJsDdu6Qoky6GDS')`);
    
    console.log("Tabela criada e dados inseridos!");
    bcrypt.hash('qwe123', 10, (err, hash) => console.log(hash))
});

db.close();
