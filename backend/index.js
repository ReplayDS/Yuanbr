require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Configuração do Banco de Dados
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'yuanbr_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Teste de Conexão
pool.getConnection()
    .then(conn => {
        console.log("Conectado ao MySQL com sucesso!");
        conn.release();
    })
    .catch(err => {
        console.error("Erro ao conectar no MySQL:", err);
    });

// --- ROTAS ---

// 1. Rota de Login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM users WHERE email = ? AND password_hash = ?', 
            [email, password] // Nota: Em produção, use bcrypt.compare()
        );

        if (rows.length > 0) {
            const user = rows[0];
            // Remove senha do retorno
            delete user.password_hash;
            res.json({ success: true, user });
        } else {
            res.status(401).json({ success: false, message: 'Credenciais inválidas' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

// 2. Rota de Registro
app.post('/register', async (req, res) => {
    const { name, email, password, role, cpf, phone, supplier_id_code } = req.body;
    
    try {
        // Se for fornecedor, gerar código se não vier (simulação)
        let finalSupplierCode = supplier_id_code;
        if (role === 'supplier' && !finalSupplierCode) {
            finalSupplierCode = Math.floor(100000 + Math.random() * 900000).toString();
        }

        const [result] = await pool.execute(
            `INSERT INTO users (name, email, password_hash, role, cpf, phone, supplier_id_code) 
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, email, password, role, cpf, phone, finalSupplierCode]
        );

        res.json({ success: true, id: result.insertId, message: 'Usuário criado!' });
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'E-mail já cadastrado.' });
        }
        res.status(500).json({ error: error.message });
    }
});

// 3. Buscar Pedidos (Por Cliente ou Fornecedor)
app.get('/orders', async (req, res) => {
    const { userId, role } = req.query;
    
    try {
        let query = 'SELECT * FROM orders';
        let params = [];

        if (role === 'client') {
            query += ' WHERE client_id = ?';
            params.push(userId);
        } else if (role === 'supplier') {
            // Primeiro pegamos o codigo do fornecedor
            const [userRows] = await pool.execute('SELECT supplier_id_code FROM users WHERE id = ?', [userId]);
            if (userRows.length > 0) {
                query += ' WHERE supplier_code = ?';
                params.push(userRows[0].supplier_id_code);
            }
        }
        
        query += ' ORDER BY created_at DESC';

        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
