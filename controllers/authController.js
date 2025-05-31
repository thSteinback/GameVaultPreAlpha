const pool = require('../config/db');
const bcrypt = require('bcrypt');

exports.showLogin = (req, res) => {
    res.render('login', { error: null });
};

exports.login = async (req, res) => {
    const { email, senha } = req.body;
    try {
        const [usuarios] = await pool.query(
            'SELECT * FROM usuarios WHERE USU_EMAIL = ?', [email]
        );
        if (usuarios.length === 0) {
            return res.render('login', { error: 'Credenciais inválidas.' });
        }
        const usuario = usuarios[0];
        const match = await bcrypt.compare(senha, usuario.USU_SENHA);
        if (!match) {
            return res.render('login', { error: 'Credenciais inválidas.' });
        }
        req.session.usuario = {
            id: usuario.USU_COD,
            nome: usuario.USU_NOME,
            email: usuario.USU_EMAIL,
            avatar: usuario.USU_AVATAR,
            banner: usuario.USU_BANNER
        };
        return res.redirect('/');
    } catch (error) {
        console.error(error);
        return res.render('login', { error: 'Erro ao realizar login.' });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/auth/login');
    });
};

exports.showCadastro = (req, res) => {
    res.render('cadastro', { error: null });
};

exports.cadastro = async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM usuarios WHERE USU_EMAIL = ? OR USU_NOME = ?', [email, nome]
        );
        if (rows.length > 0) {
            return res.render('cadastro', { error: 'Nome ou e-mail já cadastrados.' });
        }
        const hash = await bcrypt.hash(senha, 10);
        await pool.query(
            'INSERT INTO usuarios (USU_NOME, USU_EMAIL, USU_SENHA) VALUES (?, ?, ?)',
            [nome, email, hash]
        );
        res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        return res.render('cadastro', { error: 'Erro ao cadastrar usuário.' });
    }
};
