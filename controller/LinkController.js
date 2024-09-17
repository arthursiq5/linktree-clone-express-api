const sqlite3 = require('sqlite3').verbose();

class LinkController {
    constructor(databaseFile) {
        this.db = databaseFile;
    }

    // Método para buscar uma rota específica
    getLinkByRoute(rota, callback) {
        const query = 'SELECT url FROM links WHERE rota = ?';
        this.db.get(query, [rota], (err, row) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, row);
        });
    }

    // Método para listar todas as rotas
    index(callback) {
        const query = 'SELECT * FROM links';
        this.db.all(query, (err, rows) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, rows);
        });
    }

    // Método para adicionar uma nova rota
    add(rota, nome, url, callback) {
        const query = 'INSERT INTO links (rota, nome, url) VALUES (?, ?, ?)';
        this.db.run(query, [rota, nome, url], function (err) {
            if (err) {
                return callback(err, null);
            }
            return callback(null, { id: this.lastID });
        });
    }
}

module.exports = LinkController;