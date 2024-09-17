const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db');

// Cria a tabela "links" se ela não existir
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        rota TEXT NOT NULL,
        nome TEXT,
        url TEXT NOT NULL
    )`);
    
    // Inserir dados de exemplo
    db.run(`INSERT INTO links (rota, nome, url) VALUES ('minha-rota', 'Minha Rota', 'https://www.google.com')`);
    
    console.log("Tabela criada e dados inseridos!");
});

db.close();
