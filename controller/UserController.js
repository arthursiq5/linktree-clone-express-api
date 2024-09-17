const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');

class UserController {
    constructor(databaseFile) {
        this.db = databaseFile;
    }

    // Método para adicionar um novo usuário
    add(nome, email, senha, callback) {
        // Criptografar a senha antes de inserir no banco
        const saltRounds = 10;
        bcrypt.hash(senha, saltRounds, (err, hash) => {
            if (err) {
                return callback(err, null);
            }

            const query = 'INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)';
            this.db.run(query, [nome, email, hash], function (err) {
                if (err) {
                    return callback(err, null);
                }
                return callback(null, { id: this.lastID });
            });
        });
    }

    // Método para listar todos os usuários (sem exibir a senha)
    index(callback) {
        const query = 'SELECT id, nome, email FROM usuarios';
        this.db.all(query, (err, rows) => {
            if (err) {
                return callback(err, null);
            }
            return callback(null, rows);
        });
    }

    // Método para verificar as credenciais do usuário (login)
    verifyUser(email, senha, callback) {
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        this.db.get(query, [email], (err, row) => {
            if (err) {
                return callback(err, null);
            }

            if (!row) {
                return callback(null, false); // Usuário não encontrado
            }

            // Comparar a senha hasheada
            bcrypt.compare(senha, row.senha, (err, result) => {
                if (err) {
                    return callback(err, null);
                }

                if (result) {
                    return callback(null, { id: row.id, nome: row.nome, email: row.email });
                } else {
                    return callback(null, false); // Senha incorreta
                }
            });
        });
    }
}

module.exports = UserController;
